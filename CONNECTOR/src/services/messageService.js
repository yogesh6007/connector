import { apiRequest } from './api';

export const messageService = {
  async getConversations() {
    return apiRequest('/conversations');
  },

  async sendMessage(conversationId, text, recipientId) {
    return apiRequest('/messages', {
      method: 'POST',
      body: { conversationId, text, recipientId }
    });
  }
};
