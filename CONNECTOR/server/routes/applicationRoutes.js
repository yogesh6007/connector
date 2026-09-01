import express from 'express';
import { db } from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply to Opportunity (Students)
router.post('/opportunities/:id/apply', authMiddleware, async (req, res) => {
  try {
    const oppId = req.params.id;
    const { coverNote, resumeUrl, matchScore } = req.body;

    const opp = await db.opportunities.findById(oppId);
    if (!opp) return res.status(404).json({ message: 'Opportunity not found.' });

    // Check if already applied
    const existing = await db.applications.findOne({
      opportunityId: oppId,
      studentId: req.user.id
    });
    if (existing) {
      return res.status(400).json({ message: 'You have already applied to this opportunity.' });
    }

    const newApp = await db.applications.insertOne({
      opportunityId: oppId,
      opportunityTitle: opp.title,
      orgId: opp.orgId,
      orgName: opp.orgName,
      orgLogo: opp.orgLogo,
      studentId: req.user.id,
      studentName: req.user.name,
      studentAvatar: req.user.avatar || '',
      studentCollege: req.user.college || '',
      studentDegree: req.user.degree || '',
      studentGpa: req.user.gpa || '',
      studentSkills: (req.user.skills || []).map(s => typeof s === 'string' ? s : s.name),
      matchScore: matchScore || null,
      status: 'Applied',
      appliedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      coverNote: coverNote?.trim() || '',
      resumeUrl: resumeUrl?.trim() || req.user.resumeUrl || '',
      timeline: [
        { status: 'Applied', date: new Date().toISOString(), note: 'Application submitted on CONNECTOR' }
      ]
    });

    // Increment applicantsCount on opportunity
    const currentCount = opp.applicantsCount || 0;
    await db.opportunities.updateById(oppId, { $set: { applicantsCount: currentCount + 1 } });

    // Notify organizer
    await db.notifications.insertOne({
      recipientId: opp.orgId,
      senderId: req.user.id,
      senderName: req.user.name,
      senderAvatar: req.user.avatar,
      type: 'application_submitted',
      title: 'New Candidate Application',
      message: `${req.user.name} applied for "${opp.title}".`,
      link: '/organizer/applicants',
      read: false
    });

    return res.status(201).json(newApp);
  } catch (error) {
    return res.status(500).json({ message: 'Error submitting application.', error: error.message });
  }
});

// Get Student Applications
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const apps = await db.applications.find({ studentId: req.user.id });
    apps.sort((a, b) => new Date(b.lastUpdated || b.appliedDate) - new Date(a.lastUpdated || a.appliedDate));
    return res.json(apps);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching applications.', error: error.message });
  }
});

// Get Organizer Applicants
router.get('/organizer', authMiddleware, async (req, res) => {
  try {
    const apps = await db.applications.find({ orgId: req.user.id });
    apps.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
    return res.json(apps);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching organizer applicants.', error: error.message });
  }
});

// Update Application Status (Organizer)
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status, note } = req.body;
    const appId = req.params.id;

    if (req.user.role !== 'organizer') {
      return res.status(403).json({ message: 'Only organizers are authorized to update application statuses.' });
    }

    const app = await db.applications.findById(appId);
    if (!app) return res.status(404).json({ message: 'Application not found.' });

    const opp = await db.opportunities.findById(app.opportunityId);
    if (!opp) {
      return res.status(404).json({ message: 'Associated opportunity not found.' });
    }

    if (opp.orgId !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to update applications for this opportunity.' });
    }

    const newTimelineItem = {
      status,
      date: new Date().toISOString(),
      note: note || `Application status updated to ${status}`
    };

    const updated = await db.applications.updateById(appId, {
      $set: {
        status,
        lastUpdated: new Date().toISOString(),
        timeline: [...(app.timeline || []), newTimelineItem]
      }
    });

    // Notify student
    await db.notifications.insertOne({
      recipientId: app.studentId,
      senderId: req.user.id,
      senderName: req.user.name,
      senderAvatar: req.user.logo || req.user.avatar,
      type: 'application_update',
      title: `Application Status: ${status}`,
      message: `${req.user.name} updated your application for "${app.opportunityTitle}" to "${status}".`,
      link: '/student/applications',
      read: false
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating application status.', error: error.message });
  }
});

export default router;
