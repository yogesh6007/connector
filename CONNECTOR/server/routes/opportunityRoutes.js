import express from 'express';
import { db } from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';

const router = express.Router();

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

// Get All Opportunities
router.get('/', async (req, res) => {
  try {
    const currentUserId = getOptionalUserId(req);
    const { type, workMode, search } = req.query;
    let opps = await db.opportunities.find();

    if (type && type !== 'all') {
      opps = opps.filter(o => o.type === type);
    }
    if (workMode && workMode !== 'all') {
      opps = opps.filter(o => o.workMode?.toLowerCase().includes(workMode.toLowerCase()));
    }
    if (search) {
      const q = search.toLowerCase();
      opps = opps.filter(o =>
        o.title?.toLowerCase().includes(q) ||
        o.orgName?.toLowerCase().includes(q) ||
        o.description?.toLowerCase().includes(q) ||
        (o.skillsRequired || []).some(s => s.toLowerCase().includes(q))
      );
    }

    opps.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Enrich with community membership info
    const enriched = await Promise.all(opps.map(async opp => {
      const community = await db.opportunityCommunities.findOne({ opportunityId: opp.id });
      const membersList = community?.members || [];
      const org = await db.users.findById(opp.orgId);

      return {
        ...opp,
        orgLogo: org?.logo || org?.avatar || opp.orgLogo || '',
        orgName: org?.name || opp.orgName,
        hasCommunity: !!community,
        communityMembersCount: membersList.length,
        isCommunityMember: currentUserId ? membersList.includes(currentUserId) : false
      };
    }));

    return res.json(enriched);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching opportunities.', error: error.message });
  }
});

// Get Single Opportunity Details & Community State
router.get('/:id', async (req, res) => {
  try {
    const currentUserId = getOptionalUserId(req);
    const opp = await db.opportunities.findById(req.params.id);
    if (!opp) return res.status(404).json({ message: 'Opportunity not found.' });

    const org = await db.users.findById(opp.orgId);
    const community = await db.opportunityCommunities.findOne({ opportunityId: opp.id });
    const membersList = community?.members || [];

    return res.json({
      ...opp,
      orgLogo: org?.logo || org?.avatar || opp.orgLogo || '',
      orgName: org?.name || opp.orgName,
      orgDescription: org?.description || '',
      hasCommunity: !!community,
      communityMembersCount: membersList.length,
      isCommunityMember: currentUserId ? membersList.includes(currentUserId) : false
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving opportunity.', error: error.message });
  }
});

// Create Opportunity with Optional Community Hub (Organizers only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'organizer') {
      return res.status(403).json({ message: 'Only registered organizations can publish opportunities.' });
    }

    const {
      title,
      type,
      description,
      responsibilities,
      requirements,
      location,
      workMode,
      duration,
      stipend,
      positionsCount,
      deadline,
      skillsRequired,
      enableCommunity = true
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    const newOpp = await db.opportunities.insertOne({
      orgId: req.user.id,
      orgName: req.user.name,
      orgLogo: req.user.logo || req.user.avatar || '',
      title: title.trim(),
      type: type || 'Internship',
      description: description.trim(),
      responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
      requirements: Array.isArray(requirements) ? requirements : [],
      location: location?.trim() || 'Remote',
      workMode: workMode || 'Remote',
      duration: duration?.trim() || '12 Weeks',
      stipend: stipend?.trim() || 'Competitive Stipend',
      positionsCount: parseInt(positionsCount) || 1,
      deadline: deadline || '',
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : [],
      applicantsCount: 0,
      status: 'Active'
    });

    // Create Community Space if enabled
    if (enableCommunity) {
      await db.opportunityCommunities.insertOne({
        opportunityId: newOpp.id,
        orgId: req.user.id,
        orgName: req.user.name,
        name: `${newOpp.title} Community`,
        members: [req.user.id],
        channels: ['announcements', 'discussion', 'resources']
      });

      // Post initial welcome announcement
      await db.communityMessages.insertOne({
        opportunityId: newOpp.id,
        channel: 'announcements',
        senderId: req.user.id,
        senderName: req.user.name,
        senderAvatar: req.user.logo || req.user.avatar || '',
        senderRole: 'Organizer',
        title: 'Welcome to the Opportunity Community Hub! 🎉',
        content: `Applications are officially open for **${newOpp.title}**. Join the discussion channel to ask questions and connect with fellow applicants.`,
        likes: [],
        comments: []
      });
    }

    // Auto-create social feed post
    await db.posts.insertOne({
      authorId: req.user.id,
      authorName: req.user.name,
      authorAvatar: req.user.logo || req.user.avatar || '',
      authorRole: 'organizer',
      authorSubtitle: req.user.industry || 'Organization',
      content: `📢 **${newOpp.title}**\n\n${newOpp.description}\n\n**Type:** ${newOpp.type} · **Compensation:** ${newOpp.stipend} · **Mode:** ${newOpp.workMode}\n\nCommunity discussions are live on CONNECTOR. Join the community and apply below!`,
      postType: 'opportunity',
      opportunityAttachment: {
        id: newOpp.id,
        title: newOpp.title,
        type: newOpp.type,
        stipend: newOpp.stipend,
        location: newOpp.location,
        deadline: newOpp.deadline
      },
      likes: [],
      savedBy: [],
      comments: []
    });

    return res.status(201).json(newOpp);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating opportunity.', error: error.message });
  }
});

// Join Opportunity Community Space
router.post('/:id/join-community', authMiddleware, async (req, res) => {
  try {
    const oppId = req.params.id;
    const opp = await db.opportunities.findById(oppId);
    if (!opp) return res.status(404).json({ message: 'Opportunity not found.' });

    let community = await db.opportunityCommunities.findOne({ opportunityId: oppId });
    if (!community) {
      // Auto-initialize if missing
      community = await db.opportunityCommunities.insertOne({
        opportunityId: oppId,
        orgId: opp.orgId,
        orgName: opp.orgName,
        name: `${opp.title} Community`,
        members: [opp.orgId, req.user.id],
        channels: ['announcements', 'discussion', 'resources']
      });
    } else {
      const members = community.members || [];
      if (!members.includes(req.user.id)) {
        await db.opportunityCommunities.updateById(community.id, {
          $push: { members: req.user.id }
        });
      }
    }

    return res.json({ message: 'Successfully joined opportunity community space.', isMember: true });
  } catch (error) {
    return res.status(500).json({ message: 'Error joining community.', error: error.message });
  }
});

// Get Community Space Hub (Announcements, Discussions, Members)
router.get('/:id/community', authMiddleware, async (req, res) => {
  try {
    const oppId = req.params.id;
    const opp = await db.opportunities.findById(oppId);
    if (!opp) return res.status(404).json({ message: 'Opportunity not found.' });

    const community = await db.opportunityCommunities.findOne({ opportunityId: oppId });
    const membersIds = community?.members || [opp.orgId];

    // Retrieve real member profiles
    const allUsers = await db.users.find();
    const members = allUsers
      .filter(u => membersIds.includes(u.id))
      .map(u => {
        const { password, ...safe } = u;
        return safe;
      });

    // Retrieve community messages
    const messages = await db.communityMessages.find({ opportunityId: oppId });
    messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const announcements = messages.filter(m => m.channel === 'announcements');
    const discussions = messages.filter(m => m.channel === 'discussion');
    const resources = messages.filter(m => m.channel === 'resources');

    return res.json({
      community,
      opportunity: opp,
      announcements,
      discussions,
      resources,
      members,
      isOrganizer: opp.orgId === req.user.id,
      isMember: membersIds.includes(req.user.id)
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching community hub.', error: error.message });
  }
});

// Post Announcement in Community (Organizer only)
router.post('/:id/announcements', authMiddleware, async (req, res) => {
  try {
    const oppId = req.params.id;
    const { title, content } = req.body;

    const opp = await db.opportunities.findById(oppId);
    if (!opp) return res.status(404).json({ message: 'Opportunity not found.' });

    if (opp.orgId !== req.user.id) {
      return res.status(403).json({ message: 'Only the hosting organization can post announcements.' });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Announcement content is required.' });
    }

    const announcement = await db.communityMessages.insertOne({
      opportunityId: oppId,
      channel: 'announcements',
      senderId: req.user.id,
      senderName: req.user.name,
      senderAvatar: req.user.logo || req.user.avatar || '',
      senderRole: 'Organizer',
      title: title?.trim() || 'Community Announcement',
      content: content.trim(),
      likes: [],
      comments: []
    });

    // Notify all community members
    const community = await db.opportunityCommunities.findOne({ opportunityId: oppId });
    const members = (community?.members || []).filter(id => id !== req.user.id);

    await Promise.all(members.map(memberId =>
      db.notifications.insertOne({
        recipientId: memberId,
        senderId: req.user.id,
        senderName: req.user.name,
        senderAvatar: req.user.logo || req.user.avatar,
        type: 'community_announcement',
        title: `New Announcement: ${opp.title}`,
        message: `${req.user.name} posted: "${announcement.title}"`,
        link: `/student/opportunities/${oppId}`,
        read: false
      })
    ));

    return res.status(201).json(announcement);
  } catch (error) {
    return res.status(500).json({ message: 'Error posting announcement.', error: error.message });
  }
});

// Post Discussion Topic or Reply in Community
router.post('/:id/discussions', authMiddleware, async (req, res) => {
  try {
    const oppId = req.params.id;
    const { content, title } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Discussion text is required.' });
    }

    const opp = await db.opportunities.findById(oppId);
    if (!opp) return res.status(404).json({ message: 'Opportunity not found.' });

    const newMsg = await db.communityMessages.insertOne({
      opportunityId: oppId,
      channel: 'discussion',
      senderId: req.user.id,
      senderName: req.user.name,
      senderAvatar: req.user.avatar || req.user.logo || '',
      senderRole: req.user.role === 'organizer' ? 'Organizer' : 'Student Member',
      title: title?.trim() || '',
      content: content.trim(),
      likes: [],
      comments: []
    });

    return res.status(201).json(newMsg);
  } catch (error) {
    return res.status(500).json({ message: 'Error posting discussion.', error: error.message });
  }
});

export default router;
