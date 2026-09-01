import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db } from './config/db.js';
import { authMiddleware } from './middleware/auth.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import opportunityRoutes from './routes/opportunityRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import exploreRoutes from './routes/exploreRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check & Stats
app.get('/api/health', async (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    stats: {
      users: await db.users.count(),
      posts: await db.posts.count(),
      projects: await db.projects.count(),
      opportunities: await db.opportunities.count(),
      applications: await db.applications.count(),
      conversations: await db.conversations.count(),
      messages: await db.messages.count(),
      notifications: await db.notifications.count()
    }
  });
});

// Database Reset Endpoint (Dev + Authenticated only)
app.post('/api/admin/db/reset', authMiddleware, async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ message: 'Database reset is disabled in production.' });
  }

  try {
    await db.resetAll();
    res.json({
      message: 'Database reset successful. 0 records across all collections.',
      stats: {
        users: 0,
        posts: 0,
        projects: 0,
        opportunities: 0,
        applications: 0,
        conversations: 0,
        messages: 0,
        notifications: 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting database.', error: error.message });
  }
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/explore', exploreRoutes);
app.use('/api/conversations', messageRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'An unexpected server error occurred.', error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 CONNECTOR Backend Server is running on http://localhost:${PORT}`);
});
