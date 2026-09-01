import { apiRequest } from './api';

export const userService = {
  async getMe() {
    return apiRequest('/users/me');
  },

  async updateProfile(profileData) {
    return apiRequest('/users/me', {
      method: 'PUT',
      body: profileData
    });
  },

  async updateAvatar(avatar) {
    return apiRequest('/users/me/avatar', {
      method: 'POST',
      body: { avatar }
    });
  },

  async getUserById(id) {
    return apiRequest(`/users/${id}`);
  },

  async getAllUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/users${query ? `?${query}` : ''}`);
  },

  async toggleFollow(userId) {
    return apiRequest(`/users/${userId}/follow`, {
      method: 'POST'
    });
  },

  async getConnectionStatus(userId) {
    return apiRequest(`/users/connections/status/${userId}`);
  },

  async sendConnectionRequest(userId) {
    return apiRequest(`/users/connections/request/${userId}`, {
      method: 'POST'
    });
  },

  async acceptConnectionRequest(requestId) {
    return apiRequest(`/users/connections/accept/${requestId}`, {
      method: 'POST'
    });
  },

  async rejectConnectionRequest(requestId) {
    return apiRequest(`/users/connections/reject/${requestId}`, {
      method: 'POST'
    });
  },

  async disconnectConnection(userId) {
    return apiRequest(`/users/connections/disconnect/${userId}`, {
      method: 'POST'
    });
  },

  async getPendingConnectionRequests() {
    return apiRequest('/users/connections/requests/pending');
  }
};
