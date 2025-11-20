// client/src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});



// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: async (email, password, role, roleId) => {
    try {
      const response = await api.post('/auth/login', { 
        email, 
        password,
        role,
        roleId
      });
      return response.data;
    } catch (error) {
      console.error('Login API error:', error);
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('auth_user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('auth_user');
    return user ? JSON.parse(user) : null;
  }
};

export default api;