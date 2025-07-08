// apps/vite-react-app/src/components/Auth/AuthProvider.tsx
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { 
  loginUser,
  fetchCurrentUser, 
  verifyToken, 
  refreshToken, 
  clearAuth,
  logoutUser,
  changePassword,
  clearError,
  clearErrorToast,
  sanitizeError
} from '@/redux/features/authSlice';
import { useToast } from '@workspace/ui/components/sonner';
import type { UserData } from '@/redux/features/authSlice';
import { pushNotificationManager } from '@/utils/pushNotifications';
import { pushNotificationService } from '@/services/pushService';

interface LoginData {
  email: string;
  password: string;
  mfa_code?: string;
}

interface PasswordChangeData {
  current_password: string;
  new_password: string;
}

interface AuthContextType {
  // State
  isAuthenticated: boolean;
  user: UserData | null;
  loading: boolean;
  error: string | null;
  mfaRequired: boolean;
  mfaVerified: boolean;
  sessionId: string | null;
  
  // Actions
  login: (loginData: LoginData) => Promise<void>;
  logout: (sessionId?: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  changeUserPassword: (passwordData: PasswordChangeData) => Promise<void>;
  clearAuthError: () => void;
  
  // Token management
  isTokenValid: () => boolean;
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { 
    isAuthenticated, 
    user, 
    loading, 
    error, 
    accessToken,
    refreshToken: refreshTokenValue,
    tokenExpiration,
    mfaRequired,
    mfaVerified,
    sessionId,
    lastErrorToast
  } = useAppSelector((state) => state.auth);

  // Sanitize any persisted error objects on initialization
  useEffect(() => {
    if (typeof error === 'object' && error !== null) {
      dispatch(sanitizeError());
    }
  }, [dispatch, error]);

  // Show error toast when lastErrorToast is set
  useEffect(() => {
    if (lastErrorToast) {
      toast({
        title: "Login Failed",
        description: lastErrorToast,
        variant: "destructive"
      });
      // Clear the error toast after showing it
      dispatch(clearErrorToast());
    }
  }, [lastErrorToast, toast, dispatch]);

  const login = async (loginData: LoginData): Promise<void> => {
    try {
      const result = await dispatch(loginUser(loginData)).unwrap();
      
      // If login successful and no MFA required, fetch user data
      if (result.mfa_verified || !result.requires_mfa) {
        await dispatch(fetchCurrentUser()).unwrap();
      }
    } catch (error: any) {
      // Error is already handled in the slice
      throw error;
    }
  };

  const logout = async (sessionId?: string): Promise<void> => {
    try {
      await dispatch(logoutUser(sessionId)).unwrap();
    } catch (error) {
      console.error('Logout error:', error);
      // Force clear auth even if logout request fails
      dispatch(clearAuth());
    }
  };

  const checkAuth = async (): Promise<void> => {
    if (!accessToken) {
      return;
    }

    try {
      // Check if token is expired
      if (tokenExpiration && tokenExpiration < Date.now()) {
        if (refreshTokenValue) {
          await dispatch(refreshToken()).unwrap();
        } else {
          dispatch(clearAuth());
          return;
        }
      }
      
      // Verify token is still valid
      await dispatch(verifyToken()).unwrap();
      
      // Fetch user data if not available
      if (!user && isAuthenticated) {
        await dispatch(fetchCurrentUser()).unwrap();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      dispatch(clearAuth());
    }
  };

  const changeUserPassword = async (passwordData: PasswordChangeData): Promise<void> => {
    try {
      await dispatch(changePassword(passwordData)).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const clearAuthError = () => {
    dispatch(clearError());
    dispatch(clearErrorToast());
  };

  const isTokenValid = (): boolean => {
    if (!accessToken || !tokenExpiration) {
      return false;
    }
    
    // Check if token expires in the next 5 minutes
    const fiveMinutesFromNow = Date.now() + (5 * 60 * 1000);
    return tokenExpiration > fiveMinutesFromNow;
  };

  const getAccessToken = (): string | null => {
    return accessToken;
  };

  // Check auth on mount and when authentication state changes
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      checkAuth();
    }
  }, []); // Only run on mount

  // Auto-refresh token before expiration
  useEffect(() => {
    if (accessToken && tokenExpiration && refreshTokenValue) {
      const timeUntilExpiry = tokenExpiration - Date.now();
      // Refresh 5 minutes before expiry, but not if less than 1 minute remaining
      const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0);

      if (refreshTime > 60 * 1000) { // Only set timer if more than 1 minute
        const timer = setTimeout(() => {
          if (isAuthenticated) {
            dispatch(refreshToken());
          }
        }, refreshTime);

        return () => clearTimeout(timer);
      }
    }
  }, [accessToken, tokenExpiration, refreshTokenValue, isAuthenticated, dispatch]);

  // Periodic token validation (every 10 minutes)
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      const interval = setInterval(() => {
        if (!isTokenValid()) {
          checkAuth();
        }
      }, 10 * 60 * 1000); // Check every 10 minutes

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, accessToken]);

  // Handle push notifications when user is authenticated
  useEffect(() => {
    const setupPushNotifications = async () => {
      if (isAuthenticated && user && pushNotificationManager.isSupported()) {
        try {
          // Check if already subscribed
          const existingSubscription = await pushNotificationManager.getExistingSubscription();
          
          if (!existingSubscription) {
            // Request permission and subscribe
            const permission = await pushNotificationManager.requestPermission();
            if (permission === 'granted') {
              const subscription = await pushNotificationManager.subscribeToPush();
              if (subscription) {
                // Send subscription to backend
                await pushNotificationService.subscribe(
                  pushNotificationManager.convertToPushSubscriptionCreate(subscription)
                );
                console.log('Push notification subscription successful');
              }
            }
          } else {
            // Verify existing subscription is still valid with backend
            try {
              await pushNotificationService.getSubscriptions();
            } catch (error) {
              // If subscription is invalid, try to resubscribe
              console.log('Resubscribing to push notifications...');
              const permission = await pushNotificationManager.requestPermission();
              if (permission === 'granted') {
                const subscription = await pushNotificationManager.subscribeToPush();
                if (subscription) {
                  await pushNotificationService.subscribe(
                    pushNotificationManager.convertToPushSubscriptionCreate(subscription)
                  );
                }
              }
            }
          }
        } catch (error) {
          console.error('Push notification setup failed:', error);
        }
      }
    };

    setupPushNotifications();
  }, [isAuthenticated, user]);

  const value: AuthContextType = {
    // State
    isAuthenticated,
    user,
    loading,
    error,
    mfaRequired,
    mfaVerified,
    sessionId,
    
    // Actions
    login,
    logout,
    checkAuth,
    changeUserPassword,
    clearAuthError,
    
    // Token management
    isTokenValid,
    getAccessToken
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