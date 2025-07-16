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

// Login response includes user data and refresh token
export interface LoginResponse extends TokenResponse {
  refresh_token: string;
  user: {
    id: string;
    username: string;
    nama: string;
    email: string;
    role: string;
    is_active: boolean;
    inspektorat?: string;
    wilayah?: string;
    perwadag_id?: string;
    created_at: string;
    updated_at?: string;
    tempat_lahir?: string;
    tanggal_lahir?: string;
    pangkat?: string;
    jabatan?: string;
    display_name?: string;
    age?: number;
    has_email?: boolean;
    last_login?: string;
    role_display?: string;
  };
}

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
  user_id: string;
  nama: string;
  roles: string[];
  message: string;
}

