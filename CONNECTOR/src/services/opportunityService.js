import { apiRequest } from './api';

export const opportunityService = {
  async getOpportunities(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/opportunities${query ? `?${query}` : ''}`);
  },

  async getOpportunityById(id) {
    return apiRequest(`/opportunities/${id}`);
  },

  async createOpportunity(oppData) {
    return apiRequest('/opportunities', {
      method: 'POST',
      body: oppData
    });
  },

  async joinCommunity(id) {
    return apiRequest(`/opportunities/${id}/join-community`, {
      method: 'POST'
    });
  },

  async getCommunity(id) {
    return apiRequest(`/opportunities/${id}/community`);
  },

  async postAnnouncement(id, announcementData) {
    return apiRequest(`/opportunities/${id}/announcements`, {
      method: 'POST',
      body: announcementData
    });
  },

  async postDiscussion(id, discussionData) {
    return apiRequest(`/opportunities/${id}/discussions`, {
      method: 'POST',
      body: discussionData
    });
  }
};
