import express from 'express';
import { db } from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get All Projects (with filters)
router.get('/', async (req, res) => {
  try {
    const { domain, status, search, recruiting } = req.query;
    let projects = await db.projects.find();

    if (recruiting === 'true') {
      projects = projects.filter(p => p.status === 'Recruiting' && (p.members || []).length < (p.teamCapacity || 4));
    }
    if (domain && domain !== 'all') {
      projects = projects.filter(p => p.domain === domain);
    }
    if (status && status !== 'all') {
      projects = projects.filter(p => p.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      projects = projects.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.domain?.toLowerCase().includes(q) ||
        (p.requiredSkills || []).some(s => s.toLowerCase().includes(q)) ||
        (p.requiredRoles || []).some(r => (typeof r === 'string' ? r : r.role).toLowerCase().includes(q))
      );
    }

    projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Enrich with owner and member current data
    const enriched = await Promise.all(projects.map(async p => {
      const owner = await db.users.findById(p.ownerId);
      const membersEnriched = await Promise.all((p.members || []).map(async m => {
        const u = await db.users.findById(m.id);
        return {
          ...m,
          name: u?.name || m.name,
          avatar: u?.avatar || m.avatar || '',
          college: u?.college || m.college || '',
          headline: u?.headline || m.headline || ''
        };
      }));

      return {
        ...p,
        ownerName: owner?.name || p.ownerName || 'Project Lead',
        ownerAvatar: owner?.avatar || p.ownerAvatar || '',
        ownerCollege: owner?.college || p.ownerCollege || '',
        ownerHeadline: owner?.headline || '',
        members: membersEnriched,
        isFull: membersEnriched.length >= (p.teamCapacity || 4)
      };
    }));

    return res.json(enriched);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving projects.', error: error.message });
  }
});

// Get My Projects (Owned or Joined)
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const allProjects = await db.projects.find();

    const myProjects = allProjects.filter(
      p => p.ownerId === userId || (p.members || []).some(m => m.id === userId)
    );

    myProjects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(myProjects);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching user projects.', error: error.message });
  }
});

// Get Single Project Details
router.get('/:id', async (req, res) => {
  try {
    const project = await db.projects.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    const owner = await db.users.findById(project.ownerId);
    const membersEnriched = await Promise.all((project.members || []).map(async m => {
      const u = await db.users.findById(m.id);
      return {
        ...m,
        name: u?.name || m.name,
        avatar: u?.avatar || m.avatar || '',
        college: u?.college || m.college || '',
        headline: u?.headline || m.headline || ''
      };
    }));

    return res.json({
      ...project,
      ownerName: owner?.name || project.ownerName,
      ownerAvatar: owner?.avatar || project.ownerAvatar,
      ownerCollege: owner?.college || project.ownerCollege,
      ownerHeadline: owner?.headline || '',
      members: membersEnriched,
      isFull: membersEnriched.length >= (project.teamCapacity || 4)
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching project.', error: error.message });
  }
});

// Create Project & Publish Recruitment Post
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      domain,
      requiredSkills,
      requiredRoles,
      teamCapacity,
      duration,
      workMode,
      githubUrl,
      demoUrl,
      whyLookingForTeammates,
      publishRecruitmentPost = true
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Project title and description are required.' });
    }

    const maxCap = parseInt(teamCapacity) || 4;

    const newProject = await db.projects.insertOne({
      title: title.trim(),
      description: description.trim(),
      domain: domain || 'Artificial Intelligence & ML',
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : ['Python', 'React'],
      requiredRoles: Array.isArray(requiredRoles) ? requiredRoles : ['Frontend Developer', 'Backend Developer'],
      teamCapacity: maxCap,
      duration: duration || '3 Months',
      workMode: workMode || 'Remote',
      githubUrl: githubUrl?.trim() || null,
      demoUrl: demoUrl?.trim() || null,
      whyLookingForTeammates: whyLookingForTeammates?.trim() || '',
      status: 'Recruiting',
      ownerId: req.user.id,
      ownerName: req.user.name,
      ownerAvatar: req.user.avatar || '',
      ownerCollege: req.user.college || '',
      members: [
        {
          id: req.user.id,
          name: req.user.name,
          role: 'Project Lead',
          avatar: req.user.avatar || '',
          college: req.user.college || '',
          joinedAt: new Date().toISOString()
        }
      ]
    });

    // Automatically create recruitment post in social feed
    if (publishRecruitmentPost) {
      const skillsText = (newProject.requiredSkills || []).slice(0, 4).join(' · ');
      const neededCount = Math.max(1, maxCap - 1);

      await db.posts.insertOne({
        authorId: req.user.id,
        authorName: req.user.name,
        authorAvatar: req.user.avatar || '',
        authorRole: req.user.role,
        authorSubtitle: req.user.headline || req.user.college || 'Project Lead',
        content: `🚀 **${newProject.title}**\n\n${newProject.description}\n\n**Looking for teammates:**\n• ${skillsText || 'Developers'}\n\n**Team:** 1 / ${maxCap} (Looking for ${neededCount} more teammate${neededCount > 1 ? 's' : ''})`,
        postType: 'collaboration',
        projectAttachment: {
          id: newProject.id,
          title: newProject.title,
          domain: newProject.domain,
          requiredSkills: newProject.requiredSkills,
          teamCurrent: 1,
          teamMax: maxCap
        },
        likes: [],
        savedBy: [],
        comments: []
      });
    }

    return res.status(201).json(newProject);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating project.', error: error.message });
  }
});

// Submit "I'm Interested" Request for Project
router.post('/:id/interest', authMiddleware, async (req, res) => {
  try {
    const projectId = req.params.id;
    const { message, roleApplied } = req.body;

    const project = await db.projects.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found.' });

    if (project.ownerId === req.user.id) {
      return res.status(400).json({ message: 'You are the owner of this project.' });
    }

    const isMember = (project.members || []).some(m => m.id === req.user.id);
    if (isMember) {
      return res.status(400).json({ message: 'You are already a member of this project team.' });
    }

    if (project.status !== 'Recruiting' || (project.members || []).length >= (project.teamCapacity || 4)) {
      return res.status(400).json({ message: 'This project is not currently accepting new teammates.' });
    }

    // Check existing pending interest
    const existingInterest = await db.projectInterests.findOne({
      projectId,
      studentId: req.user.id,
      status: 'pending'
    });
    if (existingInterest) {
      return res.status(400).json({ message: 'You have already submitted an interest request for this project.' });
    }

    const newInterest = await db.projectInterests.insertOne({
      projectId,
      projectTitle: project.title,
      ownerId: project.ownerId,
      studentId: req.user.id,
      studentName: req.user.name,
      studentAvatar: req.user.avatar || '',
      studentCollege: req.user.college || '',
      studentDegree: req.user.degree || '',
      studentHeadline: req.user.headline || 'Student Builder',
      studentSkills: (req.user.skills || []).map(s => typeof s === 'string' ? s : s.name),
      roleApplied: roleApplied || 'Teammate',
      message: message?.trim() || 'I am excited to contribute to this project!',
      status: 'pending'
    });

    // Notify Project Leader
    await db.notifications.insertOne({
      recipientId: project.ownerId,
      senderId: req.user.id,
      senderName: req.user.name,
      senderAvatar: req.user.avatar,
      type: 'project_request',
      title: 'New Teammate Interest',
      message: `${req.user.name} expressed interest in "${project.title}": "${(message || '').slice(0, 60)}..."`,
      link: `/student/projects/${projectId}`,
      read: false
    });

    return res.status(201).json(newInterest);
  } catch (error) {
    return res.status(500).json({ message: 'Error submitting interest request.', error: error.message });
  }
});

// Get Interest Requests for a Project (Leader only)
router.get('/:id/interests', authMiddleware, async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await db.projects.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found.' });

    if (project.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Only the project leader can view join requests.' });
    }

    const interests = await db.projectInterests.find({ projectId });
    interests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(interests);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching project interest requests.', error: error.message });
  }
});

// Accept / Reject Teammate Interest Request (Leader only)
router.put('/:id/interests/:interestId', authMiddleware, async (req, res) => {
  try {
    const { id: projectId, interestId } = req.params;
    const { action } = req.body; // 'accept' | 'reject'

    const project = await db.projects.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found.' });

    if (project.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Only the project leader can manage teammate requests.' });
    }

    const interest = await db.projectInterests.findById(interestId);
    if (!interest) return res.status(404).json({ message: 'Interest request not found.' });

    if (action === 'accept') {
      const currentMembers = project.members || [];
      const maxCap = project.teamCapacity || 4;

      if (currentMembers.length >= maxCap) {
        return res.status(400).json({ message: 'Project team is already at maximum capacity.' });
      }

      const alreadyIn = currentMembers.some(m => m.id === interest.studentId);
      let updatedMembers = [...currentMembers];

      if (!alreadyIn) {
        updatedMembers.push({
          id: interest.studentId,
          name: interest.studentName,
          avatar: interest.studentAvatar || '',
          college: interest.studentCollege || '',
          role: interest.roleApplied || 'Teammate',
          joinedAt: new Date().toISOString()
        });
      }

      const isNowFull = updatedMembers.length >= maxCap;
      const newStatus = isNowFull ? 'Active' : project.status;

      await db.projects.updateById(projectId, {
        $set: {
          members: updatedMembers,
          status: newStatus
        }
      });

      await db.projectInterests.updateById(interestId, { $set: { status: 'accepted' } });

      // Notify Student
      await db.notifications.insertOne({
        recipientId: interest.studentId,
        senderId: req.user.id,
        senderName: req.user.name,
        senderAvatar: req.user.avatar,
        type: 'project_status',
        title: 'Team Join Request Accepted! 🎉',
        message: `You joined the team for "${project.title}" as ${interest.roleApplied || 'Teammate'}!`,
        link: `/student/projects/${projectId}`,
        read: false
      });

      return res.json({ message: 'Teammate accepted successfully.', members: updatedMembers, status: newStatus });
    } else {
      await db.projectInterests.updateById(interestId, { $set: { status: 'rejected' } });

      // Notify Student
      await db.notifications.insertOne({
        recipientId: interest.studentId,
        senderId: req.user.id,
        senderName: req.user.name,
        senderAvatar: req.user.avatar,
        type: 'project_status',
        title: 'Project Application Update',
        message: `Your request to join "${project.title}" was not accepted at this time.`,
        link: `/student/projects/${projectId}`,
        read: false
      });

      return res.json({ message: 'Teammate request rejected.' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error processing teammate request.', error: error.message });
  }
});

// Project Discussion Thread (Team members only)
router.get('/:id/discussions', authMiddleware, async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await db.projects.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found.' });

    const isMember = project.ownerId === req.user.id || (project.members || []).some(m => m.id === req.user.id);
    if (!isMember) {
      return res.status(403).json({ message: 'Only team members can access internal project discussions.' });
    }

    const messages = await db.projectDiscussions.find({ projectId });
    messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching project discussions.', error: error.message });
  }
});

router.post('/:id/discussions', authMiddleware, async (req, res) => {
  try {
    const projectId = req.params.id;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Message text is required.' });
    }

    const project = await db.projects.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found.' });

    const isMember = project.ownerId === req.user.id || (project.members || []).some(m => m.id === req.user.id);
    if (!isMember) {
      return res.status(403).json({ message: 'Only team members can post to project discussions.' });
    }

    const newMsg = await db.projectDiscussions.insertOne({
      projectId,
      senderId: req.user.id,
      senderName: req.user.name,
      senderAvatar: req.user.avatar || '',
      senderRole: project.ownerId === req.user.id ? 'Project Lead' : 'Team Member',
      text: text.trim()
    });

    return res.status(201).json(newMsg);
  } catch (error) {
    return res.status(500).json({ message: 'Error sending discussion message.', error: error.message });
  }
});

export default router;
