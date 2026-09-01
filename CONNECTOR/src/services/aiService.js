import { apiRequest } from './api';

export const aiService = {
  async analyzeProject(title, description) {
    return apiRequest('/ai/analyze-project', {
      method: 'POST',
      body: { title, description }
    });
  },

  async matchTeammates(projectId, requiredSkills = [], domain = '', excludeUserId) {
    return apiRequest('/ai/match-teammates', {
      method: 'POST',
      body: { projectId, requiredSkills, domain, excludeUserId }
    });
  }
};
