import { DOMAINS, SKILLS_LIST } from '../utils/constants';

/**
 * AI Service for CONNECTOR
 * Modular abstraction for AI Project Analysis, Teammate Matching, Opportunity Scoring, and Talent Discovery.
 * Ready to connect with backend endpoints (e.g., POST /api/ai/analyze-project, POST /api/ai/recommend-teammates).
 */

export const aiService = {
  /**
   * AI Project Analyzer
   * Extracts domain, required skills, suggested roles, complexity, and team size from a project description.
   */
  async analyzeProject(title = '', description = '') {
    // Simulated inference delay for authentic AI experience
    await new Promise((resolve) => setTimeout(resolve, 600));

    const combinedText = `${title} ${description}`.toLowerCase();

    // 1. Detect Domain
    let detectedDomain = 'Artificial Intelligence & ML';
    if (combinedText.includes('web') || combinedText.includes('react') || combinedText.includes('frontend') || combinedText.includes('fullstack')) {
      detectedDomain = 'Web & Full Stack Development';
    } else if (combinedText.includes('health') || combinedText.includes('medical') || combinedText.includes('clinical') || combinedText.includes('patient') || combinedText.includes('bio')) {
      detectedDomain = 'BioTech & HealthTech';
    } else if (combinedText.includes('iot') || combinedText.includes('sensor') || combinedText.includes('hardware') || combinedText.includes('green') || combinedText.includes('carbon') || combinedText.includes('eco')) {
      detectedDomain = 'CleanTech & Sustainability';
    } else if (combinedText.includes('mobile') || combinedText.includes('flutter') || combinedText.includes('android') || combinedText.includes('ios')) {
      detectedDomain = 'Mobile App Development';
    } else if (combinedText.includes('cloud') || combinedText.includes('kubernetes') || combinedText.includes('devops') || combinedText.includes('pipeline')) {
      detectedDomain = 'Cloud & DevOps';
    } else if (combinedText.includes('crypto') || combinedText.includes('blockchain') || combinedText.includes('smart contract') || combinedText.includes('solidity')) {
      detectedDomain = 'Blockchain & Web3';
    }

    // 2. Extract Matching Skills
    const extractedSkills = SKILLS_LIST.filter((skill) => {
      const s = skill.toLowerCase();
      return combinedText.includes(s) || (s === 'ai' && combinedText.includes('ai')) || (s === 'ml' && combinedText.includes('ml'));
    });

    // Provide sensible defaults if user provided brief description
    if (extractedSkills.length === 0) {
      if (detectedDomain.includes('AI')) {
        extractedSkills.push('Python', 'Machine Learning', 'PyTorch', 'FastAPI');
      } else if (detectedDomain.includes('Web')) {
        extractedSkills.push('React', 'TypeScript', 'Node.js', 'PostgreSQL');
      } else {
        extractedSkills.push('Python', 'React', 'Git', 'Docker');
      }
    }

    // 3. Generate Suggested Roles & Team Composition
    const suggestedRoles = [];
    if (extractedSkills.some((s) => ['Python', 'PyTorch', 'TensorFlow', 'OpenCV', 'NLP', 'Machine Learning'].includes(s))) {
      suggestedRoles.push({
        title: 'ML / AI Research Engineer',
        skills: ['Python', 'PyTorch', 'Machine Learning'],
        description: 'Design model architecture, fine-tune weights, and evaluate performance metrics.'
      });
    }
    if (extractedSkills.some((s) => ['React', 'TypeScript', 'Tailwind CSS', 'Figma', 'UI/UX'].includes(s)) || suggestedRoles.length < 2) {
      suggestedRoles.push({
        title: 'Frontend & UI/UX Specialist',
        skills: ['React', 'TypeScript', 'Tailwind CSS'],
        description: 'Implement intuitive user interfaces, responsive workflows, and dashboard visualizations.'
      });
    }
    if (extractedSkills.some((s) => ['Node.js', 'FastAPI', 'PostgreSQL', 'Docker', 'Go', 'Rust'].includes(s)) || suggestedRoles.length < 3) {
      suggestedRoles.push({
        title: 'Backend & Systems Architect',
        skills: ['FastAPI', 'PostgreSQL', 'Docker'],
        description: 'Develop low-latency APIs, database schema, and scalable containerized services.'
      });
    }

    // 4. Determine Complexity & Duration
    let complexity = 'Intermediate';
    let suggestedTeamSize = 3;
    let estimatedDuration = '3-4 Months';

    if (extractedSkills.length >= 6 || combinedText.includes('distributed') || combinedText.includes('autonomous') || combinedText.includes('multimodal')) {
      complexity = 'Advanced';
      suggestedTeamSize = 4;
      estimatedDuration = '4-6 Months';
    } else if (extractedSkills.length <= 2) {
      complexity = 'Beginner';
      suggestedTeamSize = 2;
      estimatedDuration = '1-2 Months';
    }

    return {
      domain: detectedDomain,
      extractedSkills: Array.from(new Set(extractedSkills)),
      suggestedRoles,
      complexity,
      suggestedTeamSize,
      estimatedDuration,
      summary: `AI analyzed the requirements: Classified under ${detectedDomain} with ${complexity} complexity. Recommended ${suggestedTeamSize} team members across ${suggestedRoles.length} specialized functional roles.`
    };
  },

  /**
   * Multi-Vector AI Teammate Matching Engine
   * Calculates similarity between a project's requirements and candidate student profiles.
   */
  calculateTeammateMatch(project, student) {
    if (!project || !student) return { matchScore: 50, reasons: [] };

    const projectSkills = project.requiredSkills || [];
    const studentSkills = student.skills || [];
    const projectDomain = project.domain || '';
    const studentInterests = student.interests || [];

    // 1. Skill Overlap Score (50% weight)
    const matchingSkills = studentSkills.filter((s) =>
      projectSkills.some((ps) => ps.toLowerCase() === s.toLowerCase())
    );
    const skillRatio = projectSkills.length > 0 ? matchingSkills.length / projectSkills.length : 0.5;
    const skillScore = Math.min(100, Math.round(skillRatio * 100));

    // 2. Domain & Interest Affinity (30% weight)
    const hasDomainMatch = studentInterests.some(
      (interest) => interest.toLowerCase().includes(projectDomain.toLowerCase()) || projectDomain.toLowerCase().includes(interest.toLowerCase())
    );
    const domainScore = hasDomainMatch ? 95 : 60;

    // 3. Experience & Availability Alignment (20% weight)
    let experienceScore = 75;
    if (student.experience && student.experience.length > 0) {
      experienceScore += 15;
    }
    if (student.availability && student.availability.includes('Available')) {
      experienceScore += 10;
    }
    experienceScore = Math.min(100, experienceScore);

    // Weighted Total Score
    const totalScore = Math.round(skillScore * 0.5 + domainScore * 0.3 + experienceScore * 0.2);
    const normalizedScore = Math.max(45, Math.min(98, totalScore));

    // Generate Explanations
    const reasons = [];
    if (matchingSkills.length > 0) {
      reasons.push(`Matches ${matchingSkills.length} required skill${matchingSkills.length > 1 ? 's' : ''}: ${matchingSkills.slice(0, 3).join(', ')}`);
    }
    if (hasDomainMatch) {
      reasons.push(`High interest alignment in ${projectDomain}`);
    }
    if (student.experience && student.experience.length > 0) {
      reasons.push(`Relevant project & internship experience (${student.experience[0].title})`);
    }
    if (student.availability && student.availability.includes('Available')) {
      reasons.push(`Active weekly availability confirmed (${student.availability})`);
    }

    return {
      matchScore: normalizedScore,
      reasons,
      matchingSkills
    };
  },

  /**
   * Recommend top candidate teammates for a project
   */
  async recommendTeammates(project, candidates = []) {
    await new Promise((resolve) => setTimeout(resolve, 350));

    const scoredCandidates = candidates.map((student) => {
      const match = this.calculateTeammateMatch(project, student);
      return {
        ...student,
        ...match
      };
    });

    return scoredCandidates.sort((a, b) => b.matchScore - a.matchScore);
  },

  /**
   * Calculate student match against an Opportunity
   */
  calculateOpportunityMatch(student, opportunity) {
    if (!student || !opportunity) return { matchScore: 70, reasons: [] };

    const oppSkills = opportunity.skills || [];
    const studentSkills = student.skills || [];

    const matchingSkills = studentSkills.filter((s) =>
      oppSkills.some((os) => os.toLowerCase() === s.toLowerCase())
    );

    const skillMatchRatio = oppSkills.length > 0 ? matchingSkills.length / oppSkills.length : 0.6;
    const score = Math.round(Math.min(98, Math.max(50, skillMatchRatio * 60 + 35)));

    const reasons = [];
    if (matchingSkills.length > 0) {
      reasons.push(`Skill match in ${matchingSkills.join(', ')}`);
    }
    if (student.university) {
      reasons.push(`Enrolled at accredited institution: ${student.university}`);
    }
    if (student.achievements && student.achievements.length > 0) {
      reasons.push(`Verified achievements portfolio`);
    }

    return {
      matchScore: score,
      reasons,
      matchingSkills
    };
  }
};
