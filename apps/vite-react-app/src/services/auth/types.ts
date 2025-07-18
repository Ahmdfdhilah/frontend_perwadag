// apps/vite-react-app/src/services/auth/types.ts

// Auth Request Types
export interface LoginRequest {
  username: string; // username field as per backend
  password: string;
}

export interface TokenRefreshRequest {
  refresh_token: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  new_password: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

// Auth Response Types
export interface TokenResponse {
  access_token: string;
  token_type: "bearer";
  expires_in: number;
}

export interface MessageResponse {
  message: string;
}

// Login response includes user data and refresh token
export interface LoginResponse extends TokenResponse {
  refresh_token: string;
  user: UserResponse;
}

// User Response Type (simplified structure from backend)
export interface UserResponse {
  id: string;
  nama: string;
  username: string;
  jabatan: string;
  email?: string;
  is_active: boolean;
  role: "ADMIN" | "INSPEKTORAT" | "PERWADAG";
  inspektorat?: string;
  display_name: string;
  has_email: boolean;
  last_login?: string;
  role_display: string;
  created_at: string;
  updated_at?: string;
}

// User password eligibility and info
export interface PasswordResetEligibilityResponse {
  eligible: boolean;
  has_email: boolean;
  email?: string;
  message: string;
}

export interface DefaultPasswordInfoResponse {
  message: string;
  description: string;
  recommendation: string;
  policy: string;
  actual_password?: string; // Only for admin users
}

// Token verification
export interface TokenVerificationResponse {
  valid: boolean;
  user_id: string;
  nama: string;
  roles: string[];
  message: string;
}

