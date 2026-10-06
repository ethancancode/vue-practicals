import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('role_user')) || null,
    token: localStorage.getItem('role_token') || '',
    loading: false,
    error: null
  }),
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    role: (state) => state.user?.role || 'viewer',
    isAdmin: (state) => state.user?.role === 'admin',
    isEditor: (state) => state.user?.role === 'editor',
    isViewer: (state) => state.user?.role === 'viewer'
  },
  actions: {
    async login(username, password) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post(`${API_URL}/auth/login`, { username, password });
        this.token = response.data.token;
        this.user = {
          _id: response.data._id,
          username: response.data.username,
          role: response.data.role
        };
        localStorage.setItem('role_token', this.token);
        localStorage.setItem('role_user', JSON.stringify(this.user));
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || 'Login failed';
        return false;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.user = null;
      this.token = '';
      localStorage.removeItem('role_token');
      localStorage.removeItem('role_user');
    },
    async fetchCurrentUser() {
      if (!this.token) return;
      try {
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.user = response.data;
        localStorage.setItem('role_user', JSON.stringify(this.user));
      } catch (err) {
        this.logout();
      }
    }
  }
});
