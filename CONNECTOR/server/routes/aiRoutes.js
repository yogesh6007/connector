import express from 'express';
import { db } from '../config/db.js';

const router = express.Router();

const SKILL_KEYWORDS_MAP = {
  'python': 'Python',
  'pytorch': 'PyTorch',
  'tensorflow': 'Machine Learning',
  'keras': 'Machine Learning',
  'machine learning': 'Machine Learning',
  'ml': 'Machine Learning',
  'deep learning': 'Deep Learning',
  'computer vision': 'Computer Vision',
  'cv': 'Computer Vision',
  'yolo': 'Computer Vision',
  'opencv': 'Computer Vision',
  'nlp': 'Natural Language Processing',
  'natural language': 'Natural Language Processing',
  'llm': 'Natural Language Processing',
  'whisper': 'Natural Language Processing',
  'transformers': 'Natural Language Processing',
  'react': 'React',
  'react native': 'React',
  'next.js': 'Next.js',
  'nextjs': 'Next.js',
  'typescript': 'TypeScript',
  'javascript': 'JavaScript',
  'node': 'Node.js',
  'node.js': 'Node.js',
  'express': 'Node.js',
  'fastapi': 'FastAPI',
  'postgres': 'PostgreSQL',
  'postgresql': 'PostgreSQL',
  'mongodb': 'MongoDB',
  'docker': 'Docker',
  'kubernetes': 'Kubernetes',
  'aws': 'AWS',
  'solidity': 'Solidity',
  'web3': 'Web3',
  'ui/ux': 'UI/UX Design',
  'figma': 'Figma',
  'tailwind': 'Tailwind CSS',
  'three.js': 'Three.js',
  'flutter': 'Flutter',
  'c++': 'C++',
  'go': 'Go',
  'golang': 'Go',
  'cybersecurity': 'Cybersecurity'
};

const DOMAIN_KEYWORDS = [
  { domain: 'Artificial Intelligence & ML', keywords: ['ai', 'ml', 'machine learning', 'deep learning', 'vision', 'nlp', 'llm', 'neural', 'yolo', 'pytorch', 'model'] },
  { domain: 'Fintech & Web3', keywords: ['crypto', 'blockchain', 'solidity', 'web3', 'defi', 'token', 'wallet', 'finance', 'fintech', 'ethereum', 'smart contract'] },
  { domain: 'Healthcare & Biotech', keywords: ['health', 'medical', 'clinical', 'patient', 'biotech', 'doctor', 'hospital', 'ehr', 'biomedical'] },
  { domain: 'EdTech & Social Impact', keywords: ['education', 'learning', 'students', 'school', 'physics', 'teaching', 'campus', 'social', 'community'] },
  { domain: 'Climate & CleanTech', keywords: ['carbon', 'climate', 'sustainability', 'energy', 'solar', 'emission', 'green', 'satellite'] },
  { domain: 'Cybersecurity & Cloud', keywords: ['security', 'cloud', 'encryption', 'distributed', 'kubernetes', 'infrastructure', 'devops'] },
  { domain: 'Web & Mobile Development', keywords: ['app', 'mobile', 'ios', 'android', 'web', 'frontend', 'fullstack', 'platform', 'saas'] }
];

// 1. Analyze Project NLP Endpoint
router.post('/analyze-project', async (req, res) => {
  try {
    const { title = '', description = '' } = req.body;

    if (!description.trim()) {
      return res.status(400).json({ message: 'Project description is required for AI analysis.' });
    }

    const combinedText = `${title} ${description}`.toLowerCase();

    // Extract skills
    const extractedSkillsSet = new Set();
    Object.entries(SKILL_KEYWORDS_MAP).forEach(([keyword, skillName]) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(combinedText)) {
        extractedSkillsSet.add(skillName);
      }
    });

    if (extractedSkillsSet.size === 0) {
      extractedSkillsSet.add('Python');
      extractedSkillsSet.add('React');
    }

    const extractedSkills = Array.from(extractedSkillsSet);

    // Infer domain
    let matchedDomain = 'Web & Mobile Development';
    let maxDomainScore = 0;
    DOMAIN_KEYWORDS.forEach(({ domain, keywords }) => {
      let score = 0;
      keywords.forEach(kw => {
        if (combinedText.includes(kw)) score += 1;
      });
      if (score > maxDomainScore) {
        maxDomainScore = score;
        matchedDomain = domain;
      }
    });

    // Complexity
    let complexity = 'Intermediate';
    if (extractedSkills.length >= 4 || combinedText.includes('distributed') || combinedText.includes('multimodal') || combinedText.includes('real-time') || combinedText.includes('edge')) {
      complexity = 'Advanced';
    } else if (extractedSkills.length <= 2 && description.length < 150) {
      complexity = 'Beginner';
    }

    // Suggested Roles
    const suggestedRoles = [];
    if (extractedSkills.some(s => ['Python', 'Machine Learning', 'Computer Vision', 'PyTorch', 'Natural Language Processing'].includes(s))) {
      suggestedRoles.push({
        role: 'AI / Machine Learning Engineer',
        description: 'Focus on model architecture, training loops, evaluation, and pipeline inference.',
        skills: extractedSkills.filter(s => ['Python', 'Machine Learning', 'Computer Vision', 'PyTorch', 'Natural Language Processing'].includes(s))
      });
    }
    if (extractedSkills.some(s => ['React', 'UI/UX Design', 'Tailwind CSS', 'Figma', 'TypeScript', 'Three.js'].includes(s))) {
      suggestedRoles.push({
        role: 'Frontend UI/UX Engineer',
        description: 'Design intuitive interfaces, interactive visualization dashboards, and user flows.',
        skills: extractedSkills.filter(s => ['React', 'UI/UX Design', 'Tailwind CSS', 'Figma', 'TypeScript', 'Three.js'].includes(s))
      });
    }
    if (extractedSkills.some(s => ['Node.js', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS', 'Go'].includes(s))) {
      suggestedRoles.push({
        role: 'Backend & Cloud Architect',
        description: 'Build robust REST/WebSocket APIs, manage database schemas, and deploy containerized services.',
        skills: extractedSkills.filter(s => ['Node.js', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS', 'Go'].includes(s))
      });
    }
    if (extractedSkills.some(s => ['Solidity', 'Web3'].includes(s))) {
      suggestedRoles.push({
        role: 'Smart Contract & Web3 Engineer',
        description: 'Develop verified smart contracts, security audits, and decentralized wallet bindings.',
        skills: ['Solidity', 'Web3', 'React']
      });
    }

    if (suggestedRoles.length === 0) {
      suggestedRoles.push({
        role: 'Full-Stack Developer',
        description: 'Implement core user interfaces and backend endpoints.',
        skills: ['React', 'Node.js', 'PostgreSQL']
      });
    }

    const suggestedTeamSize = complexity === 'Advanced' ? '4-5 members' : complexity === 'Intermediate' ? '3-4 members' : '2-3 members';
    const readinessScore = Math.min(95, 70 + extractedSkills.length * 4);
    const summary = `AI Analysis detected ${extractedSkills.length} core technical domains. The project falls within "${matchedDomain}" at an ${complexity} tier, benefiting from a balanced multidisciplinary team of ${suggestedTeamSize}.`;

    return res.json({
      extractedSkills,
      suggestedRoles,
      domain: matchedDomain,
      complexity,
      suggestedTeamSize,
      readinessScore,
      summary
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error analyzing project.', error: error.message });
  }
});

// 2. Match Teammates for Project (Strictly against Real Registered Students in DB)
router.post('/match-teammates', async (req, res) => {
  try {
    const { projectId, requiredSkills = [], domain = '', excludeUserId } = req.body;

    let project = null;
    if (projectId) {
      project = await db.projects.findById(projectId);
    }

    const projectSkills = ((project?.requiredSkills || requiredSkills) || []).map(s => s.toLowerCase());
    const projectDomain = (project?.domain || domain || '').toLowerCase();
    const projectOwnerId = project?.ownerId || excludeUserId;

    // Retrieve only real registered students from DB
    const allStudents = await db.users.find({ role: 'student' });
    const eligibleStudents = allStudents.filter(s => s.id !== projectOwnerId);

    if (eligibleStudents.length === 0) {
      return res.json({
        notEnoughData: true,
        candidates: [],
        message: 'Not enough student profiles available for matching yet.'
      });
    }

    // Compute real mathematical match scores
    const scoredCandidates = eligibleStudents.map(student => {
      const studentSkills = (student.skills || []).map(s => (typeof s === 'string' ? s : s.name).toLowerCase());
      const matchedSkills = [];
      let skillScore = 0;

      (student.skills || []).forEach(sk => {
        const skillName = typeof sk === 'string' ? sk : sk.name;
        const lower = skillName.toLowerCase();
        const level = typeof sk === 'object' ? sk.level : 'Intermediate';

        if (projectSkills.some(ps => ps === lower || lower.includes(ps) || ps.includes(lower))) {
          matchedSkills.push(skillName);
          let weight = 20;
          if (level === 'Expert') weight = 30;
          else if (level === 'Advanced') weight = 25;
          skillScore += weight;
        }
      });

      const skillOverlapRatio = projectSkills.length > 0 ? (matchedSkills.length / projectSkills.length) : 0.4;
      const normalizedSkillScore = Math.min(45, skillOverlapRatio * 45 + Math.min(15, matchedSkills.length * 5));

      let domainScore = 10;
      const studentInterests = (student.interests || []).map(i => i.toLowerCase());
      studentInterests.forEach(it => {
        if (projectDomain.includes(it) || it.includes(projectDomain)) {
          domainScore = 25;
        }
      });

      let expScore = 10;
      if (student.experience && student.experience.length > 0) expScore += 8;
      if (student.achievements && student.achievements.length > 0) expScore += 7;

      const rawScore = Math.round(normalizedSkillScore + domainScore + expScore);
      const matchScore = Math.max(50, Math.min(97, rawScore));

      const reasons = [];
      if (matchedSkills.length > 0) reasons.push(`Direct skill match in ${matchedSkills.slice(0, 3).join(', ')}`);
      if (domainScore >= 20) reasons.push(`Strong domain alignment with ${projectDomain}`);
      if (student.experience && student.experience.length > 0) reasons.push(`Prior internship experience at ${student.experience[0].company || 'industry team'}`);

      const { password, ...safeStudent } = student;

      return {
        student: safeStudent,
        matchScore,
        matchTier: matchScore >= 90 ? 'Exceptional' : matchScore >= 80 ? 'Strong' : matchScore >= 70 ? 'Good' : 'Moderate',
        matchedSkills,
        reasons
      };
    });

    scoredCandidates.sort((a, b) => b.matchScore - a.matchScore);

    return res.json({
      notEnoughData: false,
      candidates: scoredCandidates
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error calculating teammate matches.', error: error.message });
  }
});

export default router;
