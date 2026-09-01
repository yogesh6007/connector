import { apiRequest } from './api';

export const projectService = {
  async getProjects(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/projects${query ? `?${query}` : ''}`);
  },

  async getRecruitingProjects(params = {}) {
    const query = new URLSearchParams({ ...params, recruiting: 'true' }).toString();
    return apiRequest(`/projects?${query}`);
  },

  async getMyProjects() {
    return apiRequest('/projects/my');
  },

  async getProjectById(id) {
    return apiRequest(`/projects/${id}`);
  },

  async createProject(projectData) {
    return apiRequest('/projects', {
      method: 'POST',
      body: projectData
    });
  },

  async sendInterest(projectId, interestData) {
    return apiRequest(`/projects/${projectId}/interest`, {
      method: 'POST',
      body: interestData
    });
  },

  async getProjectInterests(projectId) {
    return apiRequest(`/projects/${projectId}/interests`);
  },

  async handleInterestRequest(projectId, interestId, action) {
    return apiRequest(`/projects/${projectId}/interests/${interestId}`, {
      method: 'PUT',
      body: { action }
    });
  },

  async getProjectDiscussions(projectId) {
    return apiRequest(`/projects/${projectId}/discussions`);
  },

  async sendProjectDiscussion(projectId, text) {
    return apiRequest(`/projects/${projectId}/discussions`, {
      method: 'POST',
      body: { text }
    });
  }
};
