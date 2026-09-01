import express from 'express';
import { db } from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get Conversations for Current User
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const allConvs = await db.conversations.find();

    const userConvs = allConvs.filter(c => (c.participants || []).includes(userId));
    userConvs.sort((a, b) => new Date(b.lastMessageTime || b.createdAt) - new Date(a.lastMessageTime || a.createdAt));

    // Enrich conversation partner details
    const enriched = await Promise.all(userConvs.map(async conv => {
      const otherUserId = (conv.participants || []).find(id => id !== userId) || userId;
      const otherUser = await db.users.findById(otherUserId);

      return {
        ...conv,
        participantId: otherUserId,
        participantName: otherUser?.name || 'User',
        participantAvatar: otherUser?.avatar || otherUser?.logo || '',
        participantRole: otherUser?.headline || otherUser?.tagline || otherUser?.role || 'User',
        online: false
      };
    }));

    return res.json(enriched);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching conversations.', error: error.message });
  }
});

// Send Message (Creates conversation if not existing)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { recipientId, conversationId, text } = req.body;
    const currentUserId = req.user.id;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Message text is required.' });
    }

    let conv = null;

    if (conversationId) {
      conv = await db.conversations.findById(conversationId);
      if (conv && !(conv.participants || []).includes(currentUserId)) {
        return res.status(403).json({ message: 'You are not a participant in this conversation.' });
      }
    } else if (recipientId) {
      const allConvs = await db.conversations.find();
      conv = allConvs.find(c =>
        (c.participants || []).includes(currentUserId) && (c.participants || []).includes(recipientId)
      );

      if (!conv) {
        // Create new conversation
        conv = await db.conversations.insertOne({
          participants: [currentUserId, recipientId],
          lastMessage: text.trim(),
          lastMessageTime: new Date().toISOString(),
          messages: []
        });
      }
    }

    if (!conv) {
      return res.status(404).json({ message: 'Conversation could not be found or created.' });
    }

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      senderName: req.user.name,
      text: text.trim(),
      time: new Date().toISOString()
    };

    const updatedConv = await db.conversations.updateById(conv.id, {
      $set: {
        lastMessage: text.trim(),
        lastMessageTime: new Date().toISOString()
      },
      $push: {
        messages: newMessage
      }
    });

    return res.status(201).json({ message: newMessage, conversation: updatedConv });
  } catch (error) {
    return res.status(500).json({ message: 'Error sending message.', error: error.message });
  }
});

export default router;
