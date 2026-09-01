import { apiRequest, setAuthToken } from './api';

export const authService = {
  async register(userData) {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: userData
    });
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  async login(email, password, role) {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password, role }
    });
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  logout() {
    setAuthToken(null);
  },

  async getCurrentUser() {
    return apiRequest('/users/me');
  }
};
