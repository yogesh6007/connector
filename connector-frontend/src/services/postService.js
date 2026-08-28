import { INITIAL_POSTS } from '../data/mockData';

export const postService = {
  createPost(postData, currentUser) {
    const newPost = {
      id: `post-${Date.now()}`,
      author: {
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.role,
        title: currentUser.headline || (currentUser.role === 'student' ? 'Student @ ' + currentUser.university : currentUser.industry),
        avatar: currentUser.avatar || currentUser.logo
      },
      type: postData.type || 'general',
      content: postData.content,
      tags: postData.tags || [],
      projectRef: postData.projectRef || null,
      opportunityRef: postData.opportunityRef || null,
      image: postData.image || null,
      likes: 0,
      isLiked: false,
      saved: false,
      createdAt: new Date().toISOString(),
      comments: []
    };
    return newPost;
  },

  toggleLike(posts, postId) {
    return posts.map((post) => {
      if (post.id === postId) {
        const isLiked = !post.isLiked;
        return {
          ...post,
          isLiked,
          likes: isLiked ? post.likes + 1 : Math.max(0, post.likes - 1)
        };
      }
      return post;
    });
  },

  toggleSave(posts, postId) {
    return posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          saved: !post.saved
        };
      }
      return post;
    });
  },

  addComment(posts, postId, commentText, currentUser) {
    return posts.map((post) => {
      if (post.id === postId) {
        const newComment = {
          id: `com-${Date.now()}`,
          author: {
            id: currentUser.id,
            name: currentUser.name,
            avatar: currentUser.avatar || currentUser.logo
          },
          content: commentText,
          likes: 0,
          createdAt: new Date().toISOString(),
          replies: []
        };
        return {
          ...post,
          comments: [...(post.comments || []), newComment]
        };
      }
      return post;
    });
  },

  addReply(posts, postId, commentId, replyText, currentUser) {
    return posts.map((post) => {
      if (post.id === postId) {
        const updatedComments = (post.comments || []).map((comment) => {
          if (comment.id === commentId) {
            const newReply = {
              id: `rep-${Date.now()}`,
              author: {
                id: currentUser.id,
                name: currentUser.name,
                avatar: currentUser.avatar || currentUser.logo
              },
              content: replyText,
              createdAt: new Date().toISOString()
            };
            return {
              ...comment,
              replies: [...(comment.replies || []), newReply]
            };
          }
          return comment;
        });
        return {
          ...post,
          comments: updatedComments
        };
      }
      return post;
    });
  }
};
