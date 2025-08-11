// apps/vite-react-app/src/services/auth/types.ts

// Auth Request Types
export interface LoginRequest {
  username: string; // username field as per backend
  password: string;
  captcha_token?: string; // Optional Google reCAPTCHA token
}


export interface PasswordResetRequest {
  email: string;
  captcha_token?: string; // Optional CAPTCHA token for security
}

export interface PasswordResetConfirmRequest {
  token: string;
  new_password: string;
  captcha_token?: string; // Optional CAPTCHA token for security
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

// Auth Response Types

export interface MessageResponse {
  message: string;
}

// Login response with cookie-based auth (no tokens returned to client)
export interface LoginResponse {
  user: UserResponse;
  message: string;
}

// User Response Type (simplified structure from backend)
export interface UserResponse {
  id: string;
  nama: string;
  username: string;
  jabatan: string;
  email?: string;
  is_active: boolean;
  role: "ADMIN" | "INSPEKTORAT" | "PIMPINAN" | "PERWADAG";
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

// Token refresh response (similar to LoginResponse for cookie-based auth)
export interface RefreshTokenResponse {
  user: UserResponse;
  message: string;
}

