//src/redux/features/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { jwtDecode } from 'jwt-decode';
import { FileUploadResponse } from '@/services/fileService';
// Types based on backend schemas
export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface OrgUnit {
  id: number;
  name: string;
  description: string;
}

export interface UserData {
  id: number;
  email: string;
  first_name: string;
  last_name?: string;
  is_active: boolean;
  is_verified: boolean;
  password_changed_at?: string;
  force_password_change: boolean;
  last_login?: string;
  mfa_enabled: boolean;
  employee_id?: string;
  gender?: string;
  org_unit_id?: number;
  phone?: string;
  hire_date?: string;
  basic_salary?: string;
  avatar_file_id?: number;
  failed_login_attempts?: number;
  locked_until?: string | null;
  roles: Role[];
  org_unit?: OrgUnit;
  avatar_file?: FileUploadResponse;
}

interface TokenData {
  exp: number;
  sub: string;
  email: string;
  mfa_verified?: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  tokenExpiration: number | null;
  mfaRequired: boolean;
  mfaVerified: boolean;
  sessionId: string | null;
  deviceFingerprint: string | null;
  lastErrorToast: string | null; // Track last error shown to avoid duplicates
}

// Login request interface
interface LoginRequest {
  email: string;
  password: string;
  mfa_code?: string;
}

// Login response from backend
interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  mfa_verified: boolean;
  requires_mfa: boolean;
  session_id?: string;
  device_fingerprint?: string;
}

// Password change request
interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
}

// Login error response interface
interface LoginErrorResponse {
  message: string;
  requires_mfa?: boolean;
  status_code?: number;
}

// Helper function to check token and extract expiration
function getTokenExpiration(token: string | null): number | null {
  if (!token) return null;

  try {
    const decoded = jwtDecode<TokenData>(token);
    return decoded.exp * 1000; // Convert to milliseconds
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

// Helper function to get user-friendly error message
function getUserFriendlyErrorMessage(error: any): string {
  if (!error) return 'Login failed';
  
  const detail = error.detail || error.message || error;
  
  // Map backend error messages to user-friendly ones
  if (typeof detail === 'string') {
    if (detail.includes('Incorrect email or password')) {
      return 'Invalid email or password. Please check your credentials and try again.';
    }
    if (detail.includes('Account is temporarily locked')) {
      return 'Your account has been temporarily locked due to multiple failed login attempts. Please try again later.';
    }
    if (detail.includes('Account locked due to too many failed login attempts')) {
      // Extract the time from the message if available
      const timeMatch = detail.match(/Try again in (\d+) minutes/);
      if (timeMatch) {
        return `Your account has been locked due to multiple failed login attempts. Please try again in ${timeMatch[1]} minutes.`;
      }
      return 'Your account has been locked due to multiple failed login attempts. Please try again later.';
    }
    if (detail.includes('Inactive user')) {
      return 'Your account has been deactivated. Please contact your administrator.';
    }
    if (detail.includes('Password change required')) {
      return 'You must change your password before logging in. Please contact your administrator.';
    }
    if (detail.includes('MFA code required')) {
      return 'Two-factor authentication code is required. Please enter your authenticator code.';
    }
    if (detail.includes('Invalid MFA code')) {
      return 'Invalid two-factor authentication code. Please check your authenticator app and try again.';
    }
    
    // Return the original message if no specific mapping found
    return detail;
  }
  
  // Handle array of errors
  if (Array.isArray(detail)) {
    return detail.join(', ');
  }
  
  return 'Login failed. Please try again.';
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  tokenExpiration: null,
  sessionId: null,
  deviceFingerprint: null,
  loading: false,
  error: null,
  mfaRequired: false,
  mfaVerified: false,
  lastErrorToast: null
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (loginData: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, loginData);

      // If MFA is required but not provided, return special response
      if (response.data.requires_mfa && !response.data.mfa_verified && !loginData.mfa_code) {
        return rejectWithValue({
          message: 'MFA code required',
          requires_mfa: true
        });
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        const statusCode = error.response.status;

        // Handle specific error cases
        let errorResponse: LoginErrorResponse = {
          message: getUserFriendlyErrorMessage(errorData),
          requires_mfa: false,
          status_code: statusCode
        };

        // Handle MFA required case (422)
        if (statusCode === 422 && errorData.detail?.includes('MFA')) {
          errorResponse.requires_mfa = true;
        }

        // Handle account locked cases (423)
        if (statusCode === 423) {
          errorResponse.requires_mfa = false;
        }

        // Handle force password change (403)
        if (statusCode === 403) {
          errorResponse.requires_mfa = false;
        }

        // Handle inactive user (400)
        if (statusCode === 400) {
          errorResponse.requires_mfa = false;
        }

        // Handle invalid credentials (401)
        if (statusCode === 401) {
          errorResponse.requires_mfa = false;
        }

        return rejectWithValue(errorResponse);
      }
      
      return rejectWithValue({
        message: 'Network error occurred. Please check your internet connection and try again.',
        requires_mfa: false,
        status_code: 0
      } as LoginErrorResponse);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      if (!auth.accessToken) {
        return rejectWithValue('No access token found');
      }

      const response = await axios.get<UserData>(`${API_BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`
        }
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        return rejectWithValue(errorData?.detail || errorData?.message || 'An error occurred fetching user data');
      }
      return rejectWithValue('An error occurred fetching user data');
    }
  }
);

export const updateCurrentUserProfile = createAsyncThunk(
  'auth/updateCurrentUserProfile',
  async (formData: FormData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      if (!auth.accessToken) {
        return rejectWithValue('No access token found');
      }

      const response = await axios.put<UserData>(`${API_BASE_URL}/users/me`, formData, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        return rejectWithValue(errorData?.detail || errorData?.message || 'Failed to update profile');
      }
      return rejectWithValue('Failed to update profile');
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      if (!auth.refreshToken) {
        return rejectWithValue('No refresh token found');
      }

      const response = await axios.post(`${API_BASE_URL}/auth/refresh`,
        {
          refresh_token: auth.refreshToken
        },
        {
          headers: {
            Authorization: `Bearer ${auth.refreshToken}`
          }
        });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        return rejectWithValue(errorData?.detail || errorData?.message || 'Failed to refresh token');
      }
      return rejectWithValue('Failed to refresh token');
    }
  }
);

export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      if (!auth.accessToken) {
        return rejectWithValue('No access token found');
      }

      const response = await axios.post(`${API_BASE_URL}/auth/verify`, {}, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        return rejectWithValue(errorData?.detail || errorData?.message || 'Token verification failed');
      }
      return rejectWithValue('Token verification failed');
    }
  }
);
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (sessionId: string | undefined, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      const logoutSessionId = sessionId || auth.sessionId;

      if (auth.accessToken && logoutSessionId) {
        try {
          await axios.post(`${API_BASE_URL}/auth/logout`, { session_id: logoutSessionId }, {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`
            }
          });
        } catch (error) {
          console.error("Error during logout:", error);
          // Continue with local logout even if server logout fails
        }
      }

      return null;
    } catch (error) {
      return rejectWithValue('An error occurred during logout');
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData: PasswordChangeRequest, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      if (!auth.accessToken) {
        return rejectWithValue('No access token found');
      }

      const response = await axios.post(`${API_BASE_URL}/auth/change-password`, passwordData, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`
        }
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        return rejectWithValue(errorData?.detail || errorData?.message || 'Password change failed');
      }
      return rejectWithValue('Password change failed');
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<LoginResponse>) => {
      const {
        access_token,
        refresh_token,
        mfa_verified,
        requires_mfa,
        session_id,
        device_fingerprint
      } = action.payload;

      state.accessToken = access_token;
      state.refreshToken = refresh_token;
      state.isAuthenticated = true;
      state.tokenExpiration = getTokenExpiration(access_token);
      state.mfaRequired = requires_mfa;
      state.mfaVerified = mfa_verified;
      state.sessionId = session_id || null;
      state.deviceFingerprint = device_fingerprint || null;
      state.error = null;
    },

    clearAuth: (state) => {
      // Reset state
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.tokenExpiration = null;
      state.sessionId = null;
      state.deviceFingerprint = null;
      state.loading = false;
      state.error = null;
      state.mfaRequired = false;
      state.mfaVerified = false;
      state.lastErrorToast = null;
    },

    updateUserData: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
    },

    clearError: (state) => {
      state.error = null;
      state.lastErrorToast = null;
    },

    clearErrorToast: (state) => {
      state.lastErrorToast = null;
    },

    // Add action to sanitize error if it's an object
    sanitizeError: (state) => {
      if (typeof state.error === 'object' && state.error !== null) {
        const errorObj = state.error as any;
        state.error = Array.isArray(errorObj.detail)
          ? errorObj.detail.join(', ')
          : errorObj.detail || errorObj.message || 'An error occurred';
      }
    },

    setMfaRequired: (state, action: PayloadAction<boolean>) => {
      state.mfaRequired = action.payload;
    }
  },

  extraReducers: (builder) => {
    // loginUser
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.mfaRequired = false;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      const payload = action.payload as LoginResponse;

      state.accessToken = payload.access_token;
      state.refreshToken = payload.refresh_token;
      state.isAuthenticated = true;
      state.tokenExpiration = getTokenExpiration(payload.access_token);
      state.mfaRequired = payload.requires_mfa;
      state.mfaVerified = payload.mfa_verified;
      state.sessionId = payload.session_id || null;
      state.deviceFingerprint = payload.device_fingerprint || null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      const payload = action.payload as LoginErrorResponse;
      const errorMessage = payload?.message || 'Login failed';
      
      state.error = errorMessage;
      state.mfaRequired = payload?.requires_mfa || false;
      
      // Store error message for toast display in component
      // Don't show toast for MFA required case
      if (!payload?.requires_mfa) {
        state.lastErrorToast = errorMessage;
      } else {
        state.lastErrorToast = null;
      }
    });

    // fetchCurrentUser
    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(fetchCurrentUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // verifyToken
    builder.addCase(verifyToken.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyToken.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(verifyToken.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      // Clear auth if token verification fails
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.tokenExpiration = null;
      state.sessionId = null;
      state.deviceFingerprint = null;
      state.mfaRequired = false;
      state.mfaVerified = false;
    });

    // refreshToken
    builder.addCase(refreshToken.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(refreshToken.fulfilled, (state, action) => {
      state.loading = false;
      state.accessToken = action.payload.access_token;
      state.tokenExpiration = getTokenExpiration(action.payload.access_token);
    });
    builder.addCase(refreshToken.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      // Clear auth if refresh fails
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.tokenExpiration = null;
      state.sessionId = null;
      state.deviceFingerprint = null;
      state.mfaRequired = false;
      state.mfaVerified = false;
    });

    // logoutUser
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.tokenExpiration = null;
      state.sessionId = null;
      state.deviceFingerprint = null;
      state.loading = false;
      state.mfaRequired = false;
      state.mfaVerified = false;
    });

    // changePassword
    builder.addCase(changePassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(changePassword.fulfilled, (state) => {
      state.loading = false;
      // Password changed successfully
    });
    builder.addCase(changePassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // updateCurrentUserProfile
    builder.addCase(updateCurrentUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateCurrentUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(updateCurrentUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  }
});

export const {
  setTokens,
  clearAuth,
  updateUserData,
  clearError,
  clearErrorToast,
  sanitizeError,
  setMfaRequired
} = authSlice.actions;

// Helper selectors and functions
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

// Avatar helper functions
export const selectUserAvatar = (state: { auth: AuthState }, defaultUrl: string = '/static/images/avatar.png') => {
  const user = state.auth.user;
  return user?.avatar_file?.file_url || defaultUrl;
};

export const selectUserHasAvatar = (state: { auth: AuthState }) => {
  const user = state.auth.user;
  return !!(user?.avatar_file?.file_url);
};

export const selectUserFullName = (state: { auth: AuthState }) => {
  const user = state.auth.user;
  if (!user) return '';
  return `${user.first_name}${user.last_name ? ` ${user.last_name}` : ''}`;
};

export default authSlice.reducer;