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

// Auth Response Types
export interface TokenResponse {
  access_token: string;
  token_type: "bearer";
  expires_in: number;
}

export interface MessageResponse {
  message: string;
}

// Backward compatibility type aliases
export interface LoginResponse extends TokenResponse {}

// User password eligibility and info
export interface PasswordResetEligibilityResponse {
  can_reset: boolean;
  has_email: boolean;
  message?: string;
}

export interface DefaultPasswordInfoResponse {
  has_default_password: boolean;
  default_password?: string;
  message?: string;
}

// Token verification
export interface TokenVerificationResponse {
  valid: boolean;
  user_id?: string;
  nama?: string;
  role?: string;
  inspektorat?: string;
}

export interface AuthServiceOptions {
  showToast?: boolean;
}