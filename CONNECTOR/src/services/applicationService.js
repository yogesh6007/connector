import { apiRequest } from './api';

export const applicationService = {
  async applyToOpportunity(oppId, applicationData) {
    return apiRequest(`/applications/opportunities/${oppId}/apply`, {
      method: 'POST',
      body: applicationData
    });
  },

  async getMyApplications() {
    return apiRequest('/applications/my');
  },

  async getOrganizerApplicants() {
    return apiRequest('/applications/organizer');
  },

  async updateStatus(applicationId, status, note) {
    return apiRequest(`/applications/${applicationId}/status`, {
      method: 'PUT',
      body: { status, note }
    });
  }
};
