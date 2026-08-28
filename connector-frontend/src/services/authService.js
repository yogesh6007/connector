import { INITIAL_STUDENTS, INITIAL_ORGANIZATIONS } from '../data/mockData';

const AUTH_STORAGE_KEY = 'connector_auth_user';

export const authService = {
  getCurrentUser() {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    // Default to student user Alex Kumar
    return INITIAL_STUDENTS[0];
  },

  async login(email, password, role = 'student') {
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (role === 'student') {
      const student = INITIAL_STUDENTS.find((s) => s.email.toLowerCase() === email.toLowerCase()) || {
        ...INITIAL_STUDENTS[0],
        email
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(student));
      return { success: true, user: student };
    } else {
      const org = INITIAL_ORGANIZATIONS.find((o) => o.officialEmail.toLowerCase() === email.toLowerCase()) || {
        ...INITIAL_ORGANIZATIONS[0],
        officialEmail: email
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(org));
      return { success: true, user: org };
    }
  },

  async registerStudent(formData) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newStudent = {
      id: `student-${Date.now()}`,
      role: 'student',
      name: formData.fullName || 'New Student',
      email: formData.email,
      university: formData.university || 'Tech University',
      degree: formData.degree || 'B.S. Computer Science',
      gradYear: formData.gradYear || '2026',
      location: formData.location || 'San Francisco, CA',
      headline: `${formData.degree || 'Student'} @ ${formData.university || 'University'}`,
      bio: formData.bio || 'Passionate student exploring exciting project collaborations and career opportunities.',
      skills: formData.skills && formData.skills.length > 0 ? formData.skills : ['Python', 'React', 'Git'],
      interests: formData.interests && formData.interests.length > 0 ? formData.interests : ['Artificial Intelligence & ML'],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      availability: 'Available for projects',
      experience: [],
      education: [
        {
          id: `edu-${Date.now()}`,
          institution: formData.university || 'Tech University',
          degree: formData.degree || 'B.S. Computer Science',
          period: `2022 - ${formData.gradYear || '2026'}`
        }
      ],
      achievements: [],
      followersCount: 1,
      followingCount: 5
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newStudent));
    return { success: true, user: newStudent };
  },

  async registerOrganizer(formData) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newOrg = {
      id: `org-${Date.now()}`,
      role: 'organizer',
      name: formData.orgName || 'New Organization',
      officialEmail: formData.officialEmail,
      type: formData.orgType || 'Technology Startup',
      industry: formData.industry || 'Technology & Software',
      location: formData.location || 'San Francisco, CA',
      website: formData.website || 'https://example.com',
      description: formData.description || 'Innovative organization looking to connect with top-tier student talent and sponsor projects.',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
      followersCount: 10,
      activeOpportunitiesCount: 0,
      mentoredProjectsCount: 0
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newOrg));
    return { success: true, user: newOrg };
  },

  logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  switchRole(targetRole = 'student') {
    if (targetRole === 'student') {
      const student = INITIAL_STUDENTS[0];
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(student));
      return student;
    } else {
      const org = INITIAL_ORGANIZATIONS[0];
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(org));
      return org;
    }
  }
};
