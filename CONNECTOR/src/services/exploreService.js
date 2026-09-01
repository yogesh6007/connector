import { apiRequest } from './api';

export const exploreService = {
  async search(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/explore${query ? `?${query}` : ''}`);
  }
};
