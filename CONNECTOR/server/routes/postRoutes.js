import express from 'express';
import { db } from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';

const router = express.Router();

// Helper to optionally get current user ID without blocking public reads
const getOptionalUserId = (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
      return decoded.userId || decoded.id;
    }
  } catch (e) {}
  return null;
};

// Get All Posts
router.get('/', async (req, res) => {
  try {
    const currentUserId = getOptionalUserId(req);
    const { type, authorId } = req.query;

    let posts = await db.posts.find();

    if (type && type !== 'all') {
      posts = posts.filter(p => p.postType === type);
    }
    if (authorId) {
      posts = posts.filter(p => p.authorId === authorId);
    }

    // Sort newest first
    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Enrich with author information and like/saved state
    const enriched = await Promise.all(posts.map(async post => {
      const author = await db.users.findById(post.authorId);
      const likesList = post.likes || [];
      const savedList = post.savedBy || [];
      const sharedList = post.sharedBy || [];

      return {
        ...post,
        authorName: author?.name || post.authorName || 'Unknown User',
        authorAvatar: author?.avatar || author?.logo || post.authorAvatar || '',
        authorRole: author?.role || post.authorRole || 'student',
        authorSubtitle: author?.headline || author?.tagline || author?.industry || post.authorSubtitle || '',
        likesCount: likesList.length,
        isLiked: currentUserId ? likesList.includes(currentUserId) : false,
        savedCount: savedList.length,
        isSaved: currentUserId ? savedList.includes(currentUserId) : false,
        sharesCount: sharedList.length,
        isShared: currentUserId ? sharedList.includes(currentUserId) : false,
        commentsCount: (post.comments || []).length
      };
    }));

    return res.json(enriched);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving posts.', error: error.message });
  }
});

// Create Post
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { content, postType, media, projectAttachment, opportunityAttachment } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Post content is required.' });
    }

    const newPost = await db.posts.insertOne({
      authorId: req.user.id,
      authorName: req.user.name,
      authorAvatar: req.user.avatar || req.user.logo || '',
      authorRole: req.user.role,
      authorSubtitle: req.user.headline || req.user.tagline || '',
      content: content.trim(),
      postType: postType || 'general',
      media: media?.trim() || null,
      projectAttachment: projectAttachment || null,
      opportunityAttachment: opportunityAttachment || null,
      likes: [],
      savedBy: [],
      sharedBy: [],
      comments: []
    });

    return res.status(201).json({
      ...newPost,
      likesCount: 0,
      isLiked: false,
      savedCount: 0,
      isSaved: false,
      sharesCount: 0,
      isShared: false
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating post.', error: error.message });
  }
});

// Like / Unlike Post
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await db.posts.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const likes = post.likes || [];
    const isLiked = likes.includes(req.user.id);
    let updated;

    if (isLiked) {
      updated = await db.posts.updateById(postId, { $pull: { likes: req.user.id } });
    } else {
      updated = await db.posts.updateById(postId, { $push: { likes: req.user.id } });

      // Create notification for post author if not liking own post
      if (post.authorId !== req.user.id) {
        await db.notifications.insertOne({
          recipientId: post.authorId,
          senderId: req.user.id,
          senderName: req.user.name,
          senderAvatar: req.user.avatar,
          type: 'post_like',
          title: 'Post Liked',
          message: `${req.user.name} liked your post.`,
          link: '/student/feed',
          read: false
        });
      }
    }

    const finalLikes = updated?.likes || [];
    return res.json({
      isLiked: !isLiked,
      likesCount: finalLikes.length
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error toggling like on post.', error: error.message });
  }
});

// Share Post
router.post('/:id/share', authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await db.posts.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const sharedBy = post.sharedBy || [];
    if (sharedBy.includes(req.user.id)) {
      return res.status(400).json({ message: 'You have already shared this post.' });
    }

    const updated = await db.posts.updateById(postId, { $push: { sharedBy: req.user.id } });
    const finalShares = updated?.sharedBy || [];

    return res.json({
      isShared: true,
      sharesCount: finalShares.length
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error sharing post.', error: error.message });
  }
});

// Add Comment
router.post('/:id/comments', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Comment text is required.' });
    }

    const postId = req.params.id;
    const post = await db.posts.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const newComment = {
      id: `comm-${Date.now()}`,
      authorId: req.user.id,
      authorName: req.user.name,
      authorAvatar: req.user.avatar || req.user.logo || '',
      authorSubtitle: req.user.headline || req.user.tagline || 'Builder',
      content: content.trim(),
      createdAt: new Date().toISOString(),
      likes: [],
      replies: []
    };

    const updated = await db.posts.updateById(postId, { $push: { comments: newComment } });

    // Notify author if commenting on someone else's post
    if (post.authorId !== req.user.id) {
      await db.notifications.insertOne({
        recipientId: post.authorId,
        senderId: req.user.id,
        senderName: req.user.name,
        senderAvatar: req.user.avatar,
        type: 'comment',
        title: 'New Comment',
        message: `${req.user.name} commented: "${content.trim().slice(0, 60)}..."`,
        link: '/student/feed',
        read: false
      });
    }

    return res.json(updated.comments);
  } catch (error) {
    return res.status(500).json({ message: 'Error adding comment.', error: error.message });
  }
});

// Add Reply to Comment
router.post('/:id/comments/:commentId/replies', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Reply text is required.' });
    }

    const { id: postId, commentId } = req.params;
    const post = await db.posts.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found.' });

    const newReply = {
      id: `rep-${Date.now()}`,
      authorId: req.user.id,
      authorName: req.user.name,
      authorAvatar: req.user.avatar || '',
      content: content.trim(),
      createdAt: new Date().toISOString()
    };

    const updatedComments = (post.comments || []).map(comm => {
      if (comm.id === commentId) {
        return {
          ...comm,
          replies: [...(comm.replies || []), newReply]
        };
      }
      return comm;
    });

    const updated = await db.posts.updateById(postId, { $set: { comments: updatedComments } });
    return res.json(updated.comments);
  } catch (error) {
    return res.status(500).json({ message: 'Error adding reply.', error: error.message });
  }
});

// Delete Comment
router.delete('/:id/comments/:commentId', authMiddleware, async (req, res) => {
  try {
    const { id: postId, commentId } = req.params;
    const post = await db.posts.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found.' });

    const updatedComments = (post.comments || []).filter(
      c => c.id !== commentId || (c.authorId !== req.user.id && post.authorId !== req.user.id)
    );

    const updated = await db.posts.updateById(postId, { $set: { comments: updatedComments } });
    return res.json(updated.comments);
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting comment.', error: error.message });
  }
});

// Toggle Save Post
router.post('/:id/save', authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await db.posts.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found.' });

    const saved = post.savedBy || [];
    const isSaved = saved.includes(req.user.id);
    let updated;

    if (isSaved) {
      updated = await db.posts.updateById(postId, { $pull: { savedBy: req.user.id } });
      await db.users.updateById(req.user.id, { $pull: { savedPosts: postId } });
    } else {
      updated = await db.posts.updateById(postId, { $push: { savedBy: req.user.id } });
      await db.users.updateById(req.user.id, { $push: { savedPosts: postId } });
    }

    return res.json({ isSaved: !isSaved, savedCount: (updated?.savedBy || []).length });
  } catch (error) {
    return res.status(500).json({ message: 'Error saving post.', error: error.message });
  }
});

export default router;
