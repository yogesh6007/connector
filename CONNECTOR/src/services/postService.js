import { apiRequest } from './api';

export const postService = {
  async getPosts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/posts${query ? `?${query}` : ''}`);
  },

  async createPost(postData) {
    return apiRequest('/posts', {
      method: 'POST',
      body: postData
    });
  },

  async toggleLike(postId) {
    return apiRequest(`/posts/${postId}/like`, {
      method: 'POST'
    });
  },

  async addComment(postId, content) {
    return apiRequest(`/posts/${postId}/comments`, {
      method: 'POST',
      body: { content }
    });
  },

  async addReply(postId, commentId, content) {
    return apiRequest(`/posts/${postId}/comments/${commentId}/replies`, {
      method: 'POST',
      body: { content }
    });
  },

  async deleteComment(postId, commentId) {
    return apiRequest(`/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE'
    });
  },

  async toggleSave(postId) {
    return apiRequest(`/posts/${postId}/save`, {
      method: 'POST'
    });
  },

  async sharePost(postId) {
    return apiRequest(`/posts/${postId}/share`, {
      method: 'POST'
    });
  }
};
