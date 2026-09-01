import express from 'express';
import { db } from '../config/db.js';

const router = express.Router();

// Universal Search Endpoint querying Real Database Records
router.get('/', async (req, res) => {
  try {
    const { q = '', tab = 'all', skill, domain, location, workMode, type } = req.query;
    const query = q.trim().toLowerCase();

    // 1. Search People (Students & Organizers)
    const allUsers = await db.users.find();
    let matchedPeople = allUsers.filter(u => {
      const matchText = !query ||
        u.name?.toLowerCase().includes(query) ||
        u.college?.toLowerCase().includes(query) ||
        u.headline?.toLowerCase().includes(query) ||
        u.bio?.toLowerCase().includes(query) ||
        u.location?.toLowerCase().includes(query) ||
        (u.skills || []).some(s => (typeof s === 'string' ? s : s.name).toLowerCase().includes(query)) ||
        (u.interests || []).some(i => i.toLowerCase().includes(query));

      if (!matchText) return false;
      if (skill && !(u.skills || []).some(s => (typeof s === 'string' ? s : s.name).toLowerCase() === skill.toLowerCase())) return false;
      if (location && !u.location?.toLowerCase().includes(location.toLowerCase())) return false;
      return true;
    }).map(u => {
      const { password, ...safe } = u;
      return safe;
    });

    // 2. Search Projects
    const allProjects = await db.projects.find();
    let matchedProjects = allProjects.filter(p => {
      const matchText = !query ||
        p.title?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.domain?.toLowerCase().includes(query) ||
        (p.requiredSkills || []).some(s => s.toLowerCase().includes(query));

      if (!matchText) return false;
      if (domain && p.domain !== domain) return false;
      if (workMode && p.workMode !== workMode) return false;
      return true;
    });

    // 3. Search Posts
    const allPosts = await db.posts.find();
    let matchedPosts = allPosts.filter(p => {
      return !query ||
        p.content?.toLowerCase().includes(query) ||
        p.authorName?.toLowerCase().includes(query);
    });

    // 4. Search Organizations
    let matchedOrganizations = allUsers.filter(u => {
      return u.role === 'organizer' && (!query ||
        u.name?.toLowerCase().includes(query) ||
        u.organizationName?.toLowerCase().includes(query) ||
        u.industry?.toLowerCase().includes(query) ||
        u.description?.toLowerCase().includes(query) ||
        u.location?.toLowerCase().includes(query)
      );
    }).map(u => {
      const { password, ...safe } = u;
      return safe;
    });

    // 5. Search Opportunities
    const allOpps = await db.opportunities.find();
    let matchedOpportunities = allOpps.filter(o => {
      const matchText = !query ||
        o.title?.toLowerCase().includes(query) ||
        o.orgName?.toLowerCase().includes(query) ||
        o.description?.toLowerCase().includes(query) ||
        (o.skillsRequired || []).some(s => s.toLowerCase().includes(query));

      if (!matchText) return false;
      if (type && o.type !== type) return false;
      if (workMode && o.workMode !== workMode) return false;
      return true;
    });

    return res.json({
      query,
      counts: {
        people: matchedPeople.length,
        projects: matchedProjects.length,
        posts: matchedPosts.length,
        organizations: matchedOrganizations.length,
        opportunities: matchedOpportunities.length,
        total: matchedPeople.length + matchedProjects.length + matchedPosts.length + matchedOrganizations.length + matchedOpportunities.length
      },
      results: {
        people: matchedPeople,
        projects: matchedProjects,
        posts: matchedPosts,
        organizations: matchedOrganizations,
        opportunities: matchedOpportunities
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error performing explore search.', error: error.message });
  }
});

export default router;
