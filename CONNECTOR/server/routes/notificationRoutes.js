import express from 'express';
import { db } from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get Notifications for Current User
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifs = await db.notifications.find({ recipientId: req.user.id });
    notifs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(notifs);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching notifications.', error: error.message });
  }
});

// Mark Single Notification as Read
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const notifId = req.params.id;
    const updated = await db.notifications.updateById(notifId, { $set: { read: true } });
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating notification.', error: error.message });
  }
});

// Mark All Notifications as Read
router.put('/read-all', authMiddleware, async (req, res) => {
  try {
    const notifs = await db.notifications.find({ recipientId: req.user.id });
    await Promise.all(notifs.map(n => db.notifications.updateById(n.id, { $set: { read: true } })));
    return res.json({ message: 'All notifications marked as read.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating notifications.', error: error.message });
  }
});

export default router;
