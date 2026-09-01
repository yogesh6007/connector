import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
import { JWT_SECRET } from '../config/jwt.js';

const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
  try {
    const {
      role,
      name,
      organizationName,
      email,
      officialEmail,
      password,
      college,
      degree,
      gradYear,
      location,
      bio,
      skills,
      interests,
      orgType,
      industry,
      website,
      description
    } = req.body;

    const userEmail = (email || officialEmail || '').trim().toLowerCase();
    const userName = (name || organizationName || '').trim();

    if (!userEmail || !password || !userName) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    // Check if email already exists
    const existing = await db.users.findOne({ email: userEmail });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email address already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === 'organizer' ? 'organizer' : 'student';

    let newUserData = {
      role: userRole,
      name: userName,
      email: userEmail,
      password: hashedPassword,
      location: location?.trim() || '',
      avatar: '',
      followers: [],
      following: [],
      savedPosts: [],
      savedProjects: []
    };

    if (userRole === 'student') {
      newUserData = {
        ...newUserData,
        headline: degree && college ? `${degree} @ ${college}` : (degree || 'Student Builder'),
        college: college?.trim() || '',
        degree: degree?.trim() || '',
        gradYear: gradYear ? parseInt(gradYear) : null,
        bio: bio?.trim() || '',
        skills: Array.isArray(skills) ? skills.map(s => typeof s === 'string' ? { name: s, level: 'Intermediate', endorsed: 0 } : s) : [],
        interests: Array.isArray(interests) ? interests : [],
        experience: [],
        education: college ? [
          {
            id: `edu-${Date.now()}`,
            institution: college.trim(),
            degree: degree?.trim() || '',
            period: gradYear ? `Class of ${gradYear}` : ''
          }
        ] : [],
        certifications: [],
        achievements: [],
        github: '',
        linkedin: '',
        resumeUrl: '',
        portfolio: ''
      };
    } else {
      newUserData = {
        ...newUserData,
        organizationName: userName,
        officialEmail: userEmail,
        orgType: orgType?.trim() || 'Tech Company / Startup',
        industry: industry?.trim() || 'Technology',
        website: website?.trim() || '',
        tagline: description ? description.slice(0, 100) : 'Innovative organization on CONNECTOR',
        description: description?.trim() || '',
        logo: '',
        coverImage: '',
        size: '10-50 employees'
      };
    }

    const user = await db.users.insertOne(newUserData);

    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...safeUser } = user;
    return res.status(201).json({ token, user: safeUser });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error during registration.', error: error.message });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const userEmail = (email || '').trim().toLowerCase();

    if (!userEmail || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await db.users.findOne({ email: userEmail });
    if (!user) {
      return res.status(401).json({ message: 'No account found with this email address. Please register.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password. Please try again.' });
    }

    // Optional role check validation
    if (role && user.role !== role) {
      return res.status(400).json({
        message: `This account is registered as a ${user.role}. Please select the ${user.role} role tab to sign in.`
      });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...safeUser } = user;
    return res.json({ token, user: safeUser });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error during login.', error: error.message });
  }
});

export default router;
