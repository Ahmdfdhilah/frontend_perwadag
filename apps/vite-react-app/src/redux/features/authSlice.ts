import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { authService } from '@/services/auth';
import { userService } from '@/services/users';
import { UserUpdate } from '@/services/users/types';
import { 
  LoginRequest, 
  PasswordResetRequest, 
  PasswordResetConfirmRequest,
  ChangePasswordRequest,
  UserResponse 
} from '@/services/auth/types';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserResponse | null;
  error: string | null;
  sessionExpiry: number | null;
}

export const updateProfileAsync = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: UserUpdate, { rejectWithValue }) => {
    try {
      const response = await userService.updateCurrentUser(profileData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Profile update failed');
    }
  }
);

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  error: null,
  sessionExpiry: null,
};

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (loginData: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(loginData);
      
      // Calculate session expiry (30 minutes default)
      const sessionExpiry = Date.now() + (30 * 60 * 1000); // 30 minutes
      
      return {
        user: response.user,
        sessionExpiry
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

export const verifySessionAsync = createAsyncThunk(
  'auth/verifySession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.verifyToken();
      const sessionExpiry = Date.now() + (30 * 60 * 1000); // Extend session by 30 minutes
      
      return {
        valid: response.valid,
        sessionExpiry
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Session verification failed');
    }
  }
);

export const refreshTokenAsync = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.refreshToken();
      
      // Calculate new session expiry (30 minutes from now)
      const sessionExpiry = Date.now() + (30 * 60 * 1000);
      
      return {
        user: response.user,
        sessionExpiry
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Token refresh failed');
    }
  }
);


export const requestPasswordResetAsync = createAsyncThunk(
  'auth/requestPasswordReset',
  async (resetData: PasswordResetRequest, { rejectWithValue }) => {
    try {
      const response = await authService.requestPasswordReset(resetData);
      return response.message;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Password reset request failed');
    }
  }
);

export const confirmPasswordResetAsync = createAsyncThunk(
  'auth/confirmPasswordReset',
  async (resetData: PasswordResetConfirmRequest, { rejectWithValue }) => {
    try {
      const response = await authService.confirmPasswordReset(resetData);
      return response.message;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Password reset confirmation failed');
    }
  }
);

export const changePasswordAsync = createAsyncThunk(
  'auth/changePassword',
  async (passwordData: ChangePasswordRequest, { rejectWithValue }) => {
    try {
      const response = await authService.changePassword(passwordData);
      return response.message;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Password change failed');
    }
  }
);

export const getCurrentUserAsync = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getCurrentUser();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get current user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.sessionExpiry = null;
      state.error = null;
    },
    setUser: (state, action: PayloadAction<UserResponse>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    updateUser: (state, action: PayloadAction<Partial<UserResponse>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    extendSession: (state) => {
      state.sessionExpiry = Date.now() + (30 * 60 * 1000); // Extend by 30 minutes
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.sessionExpiry = action.payload.sessionExpiry;
        
        if (action.payload.user) {
          state.user = action.payload.user;
        }
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(logoutAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.sessionExpiry = null;
        state.error = null;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(verifySessionAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifySessionAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.valid) {
          state.sessionExpiry = action.payload.sessionExpiry;
          state.isAuthenticated = true;
        } else {
          state.isAuthenticated = false;
          state.user = null;
          state.sessionExpiry = null;
        }
        state.error = null;
      })
      .addCase(verifySessionAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // Clear all auth data when session verification fails
        state.isAuthenticated = false;
        state.user = null;
        state.sessionExpiry = null;
      })
      .addCase(refreshTokenAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshTokenAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.sessionExpiry = action.payload.sessionExpiry;
        
        if (action.payload.user) {
          state.user = action.payload.user;
        }
        state.error = null;
      })
      .addCase(refreshTokenAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // Clear all auth data when token refresh fails
        state.isAuthenticated = false;
        state.user = null;
        state.sessionExpiry = null;
      })
      .addCase(requestPasswordResetAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestPasswordResetAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(requestPasswordResetAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(confirmPasswordResetAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(confirmPasswordResetAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(confirmPasswordResetAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(changePasswordAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePasswordAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changePasswordAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getCurrentUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUserAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getCurrentUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfileAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearAuth, setUser, updateUser, extendSession } = authSlice.actions;

export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectSessionExpiry = (state: { auth: AuthState }) => state.auth.sessionExpiry;

// Persist config for auth - persist user data, session expiry, and auth state
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'sessionExpiry', 'isAuthenticated'], // Persist essential auth data
  blacklist: ['isLoading', 'error'] // Don't persist loading and error states
};

export default persistReducer(authPersistConfig, authSlice.reducer);