import { INITIAL_APPLICATIONS } from '../data/mockData';

export const applicationService = {
  applyToOpportunity(applications, opportunity, student, applicationData = {}) {
    const newApplication = {
      id: `app-${Date.now()}`,
      opportunityId: opportunity.id,
      opportunityTitle: opportunity.title,
      organizationName: opportunity.organization?.name || 'Organization',
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      studentHeadline: student.headline || 'Student',
      studentUniversity: student.university || 'University',
      studentAvatar: student.avatar,
      skills: student.skills || [],
      matchScore: applicationData.matchScore || 88,
      appliedDate: new Date().toISOString(),
      status: 'Applied',
      resumeUrl: applicationData.resumeUrl || 'https://portfolio.dev/resume.pdf',
      portfolioUrl: applicationData.portfolioUrl || student.portfolio || '',
      statement: applicationData.statement || 'Excited to apply and contribute to this opportunity!'
    };

    return [newApplication, ...applications];
  },

  updateApplicationStatus(applications, applicationId, newStatus) {
    return applications.map((app) => {
      if (app.id === applicationId) {
        return { ...app, status: newStatus };
      }
      return app;
    });
  }
};
