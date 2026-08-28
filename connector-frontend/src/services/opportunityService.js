import { INITIAL_OPPORTUNITIES } from '../data/mockData';

export const opportunityService = {
  createOpportunity(oppData, currentOrg) {
    const newOpportunity = {
      id: `opp-${Date.now()}`,
      title: oppData.title,
      organization: {
        id: currentOrg.id,
        name: currentOrg.name,
        location: oppData.location || currentOrg.location,
        logo: currentOrg.logo
      },
      type: oppData.type || 'Internship',
      description: oppData.description,
      responsibilities: oppData.responsibilities || [],
      requirements: oppData.requirements || [],
      skills: oppData.skills || [],
      location: oppData.location || 'Remote',
      workMode: oppData.workMode || 'Remote',
      duration: oppData.duration || '3 Months',
      stipend: oppData.stipend || 'Competitive Stipend',
      eligibility: oppData.eligibility || 'All eligible students',
      deadline: oppData.deadline || '2026-12-31',
      positions: Number(oppData.positions) || 5,
      status: oppData.status || 'Published',
      postedDate: new Date().toISOString().split('T')[0],
      applicantsCount: 0
    };
    return newOpportunity;
  },

  updateOpportunityStatus(opportunities, oppId, newStatus) {
    return opportunities.map((opp) => {
      if (opp.id === oppId) {
        return { ...opp, status: newStatus };
      }
      return opp;
    });
  }
};
