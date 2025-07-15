// src/utils/api.ts
import axios, { AxiosInstance } from 'axios';
import { clearAuth } from '@/redux/features/authSlice';
import { store } from '@/redux/store';
import { API_BASE_URL } from '@/config/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Configure interceptors for both API instances
const configureInterceptors = (api: AxiosInstance) => {
  // Request interceptor - Add auth token to requests
  api.interceptors.request.use(
    (config) => {
      const state = store.getState();
      const token = state.auth?.accessToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - Handle 401 responses
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      // If error is 401, clear auth state and redirect to login
      if (error.response?.status === 401) {
        store.dispatch(clearAuth());
        // Let the auth guard handle the redirect to login
      }

      return Promise.reject(error);
    }
  );
};

// Apply interceptors to both API instances
configureInterceptors(api);

export default api;