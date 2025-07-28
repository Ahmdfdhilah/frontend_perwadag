// src/utils/api.ts
import axios, { AxiosInstance } from 'axios';
import { clearAuth, verifySessionAsync } from '@/redux/features/authSlice';
import { store } from '@/redux/store';
import { API_BASE_URL } from '@/config/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important: This enables cookies to be sent with requests
});

// Configure interceptors for both API instances
const configureInterceptors = (api: AxiosInstance) => {
  // Request interceptor - No need to add Authorization header as we use cookies
  api.interceptors.request.use(
    (config) => {
      // Cookies will be automatically sent due to withCredentials: true
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - Handle 401 responses and session verification
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If error is 401 and we haven't already tried to verify session
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        // Don't try to verify session if the original request was already a session verification
        if (!originalRequest.url?.includes('/verify-token')) {
          try {
            // Try to verify and refresh the session
            await store.dispatch(verifySessionAsync()).unwrap();
            
            // If session verification succeeds, retry the original request
            return api.request(originalRequest);
          } catch (sessionError) {
            console.error('Session verification failed:', sessionError);
            store.dispatch(clearAuth());
          }
        } else {
          // If verify-token itself fails, clear auth
          store.dispatch(clearAuth());
        }
      }

      return Promise.reject(error);
    }
  );
};

// Apply interceptors to both API instances
configureInterceptors(api);

export default api;