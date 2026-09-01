import express from 'express';
import { db } from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get Logged-In User Profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await db.users.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const { password, ...safeUser } = user;
    return res.json(safeUser);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving user profile.', error: error.message });
  }
});

// Update Logged-In User Profile
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const allowedFields = [
      'name', 'headline', 'bio', 'college', 'degree', 'gradYear', 'location',
      'skills', 'interests', 'experience', 'education', 'certifications', 'achievements',
      'github', 'linkedin', 'resumeUrl', 'portfolio', 'website', 'tagline', 'description',
      'industry', 'orgType', 'avatar', 'logo', 'coverImage', 'size'
    ];

    const updateData = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    const updatedUser = await db.users.updateById(req.user.id, { $set: updateData });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const { password, ...safeUser } = updatedUser;
    return res.json(safeUser);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating user profile.', error: error.message });
  }
});

// Update Avatar Endpoint
router.post('/me/avatar', authMiddleware, async (req, res) => {
  try {
    const { avatar } = req.body;
    if (!avatar) {
      return res.status(400).json({ message: 'Avatar data or URL is required.' });
    }

    const updatedUser = await db.users.updateById(req.user.id, { $set: { avatar, logo: avatar } });
    const { password, ...safeUser } = updatedUser;
    return res.json(safeUser);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating avatar.', error: error.message });
  }
});

// Get User by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await db.users.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const safeUser = {
      id: user.id,
      role: user.role,
      name: user.name,
      avatar: user.avatar || user.logo || '',
      headline: user.headline || '',
      bio: user.bio || '',
      skills: user.skills || [],
      interests: user.interests || [],
      experience: user.experience || [],
      education: user.education || [],
      college: user.college || '',
      degree: user.degree || '',
      gradYear: user.gradYear || '',
      location: user.location || '',
      github: user.github || '',
      linkedin: user.linkedin || '',
      portfolio: user.portfolio || '',
      resumeUrl: user.resumeUrl || '',
      orgType: user.orgType || '',
      industry: user.industry || '',
      website: user.website || '',
      tagline: user.tagline || '',
      description: user.description || ''
    };

    return res.json(safeUser);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching user.', error: error.message });
  }
});

// Search & List Real Users
router.get('/', async (req, res) => {
  try {
    const { role, skill, search } = req.query;
    let users = await db.users.find();

    if (role) {
      users = users.filter(u => u.role === role);
    }
    if (skill) {
      const lowerSkill = skill.toLowerCase();
      users = users.filter(u =>
        (u.skills || []).some(s => (typeof s === 'string' ? s : s.name).toLowerCase().includes(lowerSkill))
      );
    }
    if (search) {
      const q = search.toLowerCase();
      users = users.filter(u =>
        u.name?.toLowerCase().includes(q) ||
        u.college?.toLowerCase().includes(q) ||
        u.headline?.toLowerCase().includes(q) ||
        u.industry?.toLowerCase().includes(q) ||
        (u.skills || []).some(s => (typeof s === 'string' ? s : s.name).toLowerCase().includes(q))
      );
    }

    const safeUsers = users.map(u => {
      const { password, ...safe } = u;
      return safe;
    });

    return res.json(safeUsers);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching users.', error: error.message });
  }
});

// Get Connection Status between Current User and Target User
router.get('/connections/status/:id', authMiddleware, async (req, res) => {
  try {
    const targetId = req.params.id;
    const currentUserId = req.user.id;

    // Check if connected
    const connected = await db.connections.findOne({ userIds: [currentUserId, targetId] }) ||
                      await db.connections.findOne({ userIds: [targetId, currentUserId] });

    if (connected) {
      return res.json({ status: 'connected', requestId: null });
    }

    // Check pending request sent by current user
    const pendingSent = await db.connectionRequests.findOne({
      senderId: currentUserId,
      receiverId: targetId,
      status: 'pending'
    });

    if (pendingSent) {
      return res.json({ status: 'pending_sent', requestId: pendingSent.id });
    }

    // Check pending request received from target user
    const pendingReceived = await db.connectionRequests.findOne({
      senderId: targetId,
      receiverId: currentUserId,
      status: 'pending'
    });

    if (pendingReceived) {
      return res.json({ status: 'pending_received', requestId: pendingReceived.id });
    }

    return res.json({ status: 'none', requestId: null });
  } catch (error) {
    return res.status(500).json({ message: 'Error checking connection status.', error: error.message });
  }
});

// Send Connection Request
router.post('/connections/request/:id', authMiddleware, async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user.id;

    if (targetUserId === currentUserId) {
      return res.status(400).json({ message: 'You cannot connect with yourself.' });
    }

    const targetUser = await db.users.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found.' });
    }

    // 1. Check existing connection
    const alreadyConnected = await db.connections.findOne({ userIds: [currentUserId, targetUserId] }) ||
                             await db.connections.findOne({ userIds: [targetUserId, currentUserId] });
    if (alreadyConnected) {
      return res.status(400).json({ message: 'You are already connected.' });
    }

    // 2. Check pending request from current user
    const alreadySent = await db.connectionRequests.findOne({
      senderId: currentUserId,
      receiverId: targetUserId,
      status: 'pending'
    });
    if (alreadySent) {
      return res.status(400).json({ message: 'Connection request already sent.' });
    }

    // 3. Check pending request from target user (reverse duplicate)
    const alreadyReceived = await db.connectionRequests.findOne({
      senderId: targetUserId,
      receiverId: currentUserId,
      status: 'pending'
    });
    if (alreadyReceived) {
      return res.status(400).json({ message: 'This user has already sent you a connection request.' });
    }

    // Create request
    const newRequest = await db.connectionRequests.insertOne({
      senderId: currentUserId,
      receiverId: targetUserId,
      status: 'pending'
    });

    // Create notification
    await db.notifications.insertOne({
      recipientId: targetUserId,
      senderId: currentUserId,
      senderName: req.user.name,
      senderAvatar: req.user.avatar || '',
      type: 'connection_request',
      title: 'Connection Request',
      message: `${req.user.name} wants to connect with you.`,
      link: '/student/notifications',
      connectionRequestId: newRequest.id,
      read: false
    });

    return res.status(201).json(newRequest);
  } catch (error) {
    return res.status(500).json({ message: 'Error sending connection request.', error: error.message });
  }
});

// Accept Connection Request
router.post('/connections/accept/:requestId', authMiddleware, async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await db.connectionRequests.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Connection request not found.' });
    }

    if (request.receiverId !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to accept this connection request.' });
    }

    // Check duplicate connection
    const alreadyConnected = await db.connections.findOne({ userIds: [request.senderId, request.receiverId] }) ||
                             await db.connections.findOne({ userIds: [request.receiverId, request.senderId] });

    if (!alreadyConnected) {
      await db.connections.insertOne({
        userIds: [request.senderId, request.receiverId]
      });
    }

    // Remove the pending request
    await db.connectionRequests.deleteById(requestId);

    // Create acceptance notification
    await db.notifications.insertOne({
      recipientId: request.senderId,
      senderId: req.user.id,
      senderName: req.user.name,
      senderAvatar: req.user.avatar || '',
      type: 'connection_accepted',
      title: 'Connection Request Accepted',
      message: `${req.user.name} accepted your connection request.`,
      link: `/student/profile/${req.user.id}`,
      read: false
    });

    return res.json({ message: 'Connection request accepted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error accepting connection request.', error: error.message });
  }
});

// Reject / Ignore Connection Request
router.post('/connections/reject/:requestId', authMiddleware, async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await db.connectionRequests.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Connection request not found.' });
    }

    if (request.receiverId !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to ignore this request.' });
    }

    // Remove request
    await db.connectionRequests.deleteById(requestId);

    return res.json({ message: 'Connection request ignored.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error ignoring connection request.', error: error.message });
  }
});

// Disconnect Connection
router.post('/connections/disconnect/:id', authMiddleware, async (req, res) => {
  try {
    const targetId = req.params.id;
    const currentUserId = req.user.id;

    // Delete permanent connection records
    const conn1 = await db.connections.findOne({ userIds: [currentUserId, targetId] });
    if (conn1) await db.connections.deleteById(conn1.id);
    const conn2 = await db.connections.findOne({ userIds: [targetId, currentUserId] });
    if (conn2) await db.connections.deleteById(conn2.id);

    // Remove any pending requests
    const req1 = await db.connectionRequests.findOne({ senderId: currentUserId, receiverId: targetId });
    if (req1) await db.connectionRequests.deleteById(req1.id);
    const req2 = await db.connectionRequests.findOne({ senderId: targetId, receiverId: currentUserId });
    if (req2) await db.connectionRequests.deleteById(req2.id);

    return res.json({ message: 'Disconnected successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error disconnecting.', error: error.message });
  }
});

// Get Pending Connection Requests
router.get('/connections/requests/pending', authMiddleware, async (req, res) => {
  try {
    const pending = await db.connectionRequests.find({
      receiverId: req.user.id,
      status: 'pending'
    });

    const enriched = await Promise.all(pending.map(async r => {
      const sender = await db.users.findById(r.senderId);
      return {
        ...r,
        senderName: sender?.name || 'Unknown User',
        senderAvatar: sender?.avatar || '',
        senderCollege: sender?.college || 'Student'
      };
    }));

    return res.json(enriched);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching pending requests.', error: error.message });
  }
});

export default router;
