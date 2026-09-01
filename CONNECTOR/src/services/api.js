const API_BASE = '/api';

export const getAuthToken = () => {
  return localStorage.getItem('connector_token_v1');
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('connector_token_v1', token);
  } else {
    localStorage.removeItem('connector_token_v1');
  }
};

export const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network response was not ok' }));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json();
};
