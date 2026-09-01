import { apiRequest } from './api';

export const notificationService = {
  async getNotifications() {
    return apiRequest('/notifications');
  },

  async markAsRead(id) {
    return apiRequest(`/notifications/${id}/read`, {
      method: 'PUT'
    });
  },

  async markAllAsRead() {
    return apiRequest('/notifications/read-all', {
      method: 'PUT'
    });
  }
};
