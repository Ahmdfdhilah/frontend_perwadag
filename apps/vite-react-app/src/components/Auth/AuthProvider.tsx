// apps/vite-react-app/src/components/Auth/AuthProvider.tsx
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  loginAsync,
  logoutAsync,
  verifySessionAsync,
  refreshTokenAsync,
  changePasswordAsync,
  clearAuth,
  clearError,
  setUser,
  extendSession,
  selectIsAuthenticated,
  selectUser,
  selectAuthLoading,
  selectAuthError,
  selectSessionExpiry
} from '@/redux/features/authSlice';
import type { User } from '@/services/users/types';

interface LoginData {
  username: string;
  password: string;
  captcha_token?: string;
}

interface PasswordChangeData {
  current_password: string;
  new_password: string;
}

interface AuthContextType {
  // State
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;

  // Actions
  login: (loginData: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  changeUserPassword: (passwordData: PasswordChangeData) => Promise<void>;
  clearAuthError: () => void;

  // Session management
  isSessionValid: () => boolean;
  extendUserSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const sessionExpiry = useAppSelector(selectSessionExpiry);

  // Note: Error toast handling removed to avoid duplication with BaseService
  // BaseService automatically shows toast errors for all auth API calls

  const login = async (loginData: LoginData): Promise<void> => {
    try {
      await dispatch(loginAsync(loginData)).unwrap();
    } catch (error: any) {
      // Error is already handled in the slice
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await dispatch(logoutAsync()).unwrap();
    } catch (error) {
      console.error('Logout error:', error);
      // Force clear auth even if logout request fails
      dispatch(clearAuth());
    }
  };

  const checkAuth = async (): Promise<void> => {
    try {
      // Check if session is expired
      if (sessionExpiry && sessionExpiry < Date.now()) {
        // Session is expired, try to refresh token
        try {
          await dispatch(refreshTokenAsync()).unwrap();
          return;
        } catch (refreshError) {
          console.error('Token refresh failed during checkAuth:', refreshError);
          dispatch(clearAuth());
          return;
        }
      }

      // If session is still valid, just verify without refresh
      const sessionResult = await dispatch(verifySessionAsync()).unwrap();
      
      if (sessionResult.valid) {
        // If we have persisted user data but not authenticated state, restore it
        if (user && !isAuthenticated) {
          dispatch(setUser(user));
        }
        // Note: Don't automatically fetch user data during checkAuth
        // This should only be done on explicit request or initial login
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      dispatch(clearAuth());
    }
  };

  const changeUserPassword = async (passwordData: PasswordChangeData): Promise<void> => {
    try {
      await dispatch(changePasswordAsync(passwordData)).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  const isSessionValid = (): boolean => {
    if (!sessionExpiry) {
      return false;
    }

    // Check if session expires in the next 5 minutes
    const fiveMinutesFromNow = Date.now() + (5 * 60 * 1000);
    return sessionExpiry > fiveMinutesFromNow;
  };

  const extendUserSession = (): void => {
    dispatch(extendSession());
  };

  // Check auth on mount to restore session after refresh
  useEffect(() => {
    // If we have user data and authenticated state persisted, verify session is still valid
    if (user && isAuthenticated) {
      // Check if session is expired before making API call
      if (sessionExpiry && sessionExpiry < Date.now()) {
        // Session is expired, clear auth
        dispatch(clearAuth());
        return;
      }
      // Session looks valid, try refresh first to ensure freshness
      dispatch(refreshTokenAsync()).catch(() => {
        // If refresh fails, clear auth
        dispatch(clearAuth());
      });
    } else if (user && !isAuthenticated) {
      // If we have user data but not authenticated, try to restore session
      checkAuth();
    }
    // If no user data and not authenticated, no need to check
  }, []); // Only run on mount

  // Auto-verify session before expiration
  useEffect(() => {
    if (sessionExpiry && isAuthenticated) {
      const timeUntilExpiry = sessionExpiry - Date.now();
      // Verify session 5 minutes before expiry, but not if less than 1 minute remaining
      const verifyTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0);

      if (verifyTime > 60 * 1000) { // Only set timer if more than 1 minute
        const timer = setTimeout(() => {
          if (isAuthenticated) {
            checkAuth();
          }
        }, verifyTime);

        return () => clearTimeout(timer);
      }
    }
  }, [sessionExpiry, isAuthenticated, dispatch]);

  // Periodic session validation and refresh (every 10 minutes)
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        if (!isSessionValid()) {
          // Try to refresh token if session is close to expiry
          dispatch(refreshTokenAsync()).catch(() => {
            dispatch(clearAuth());
          });
        }
      }, 10 * 60 * 1000); // Check every 10 minutes

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, dispatch]);

  const value: AuthContextType = {
    // State
    isAuthenticated,
    user,
    loading,
    error,

    // Actions
    login,
    logout,
    checkAuth,
    changeUserPassword,
    clearAuthError,

    // Session management
    isSessionValid,
    extendUserSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};