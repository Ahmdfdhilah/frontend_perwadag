// src/utils/api.ts
import axios, { AxiosInstance } from 'axios';
import { clearAuth, refreshTokenAsync } from '@/redux/features/authSlice';
import { store } from '@/redux/store';
import { API_BASE_URL } from '@/config/api';

// Refresh token queue to prevent multiple concurrent refresh requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

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

      // Add header to prevent Service Worker from caching this request
      config.headers['X-No-Cache'] = '1';
      config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';

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

        // Don't try to refresh token for auth endpoints (login, logout, refresh, etc.)
        const isAuthEndpoint = originalRequest.url?.includes('/auth/') ||
          originalRequest.url?.includes('/login') ||
          originalRequest.url?.includes('/logout') ||
          originalRequest.url?.includes('/refresh') ||
          originalRequest.url?.includes('/verify-token');

        if (!isAuthEndpoint) {
          // If we're already refreshing, add the request to the queue
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            }).then(() => {
              // After token is refreshed, retry the original request
              return api.request(originalRequest);
            }).catch((err) => {
              return Promise.reject(err);
            });
          }

          // Set refreshing flag and start refresh process
          originalRequest._retry = true;
          isRefreshing = true;

          try {
            // Try to refresh the token
            await store.dispatch(refreshTokenAsync()).unwrap();

            // Token refresh succeeded, process the queue
            processQueue(null, 'success');

            // If token refresh succeeds, retry the original request
            return api.request(originalRequest);
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);

            // Process queue with error
            processQueue(refreshError, null);
            store.dispatch(clearAuth());
          } finally {
            isRefreshing = false;
          }
        } else {
          // For auth endpoints, just clear auth on 401
          console.log('Auth endpoint failed with 401, clearing auth');
          if (!originalRequest.url?.includes('/logout')) {
            store.dispatch(clearAuth());
          }
        }
      }

      return Promise.reject(error);
    }
  );
};

// Apply interceptors to both API instances
configureInterceptors(api);

export default api;