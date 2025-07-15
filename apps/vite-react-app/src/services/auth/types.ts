// apps/vite-react-app/src/services/auth/types.ts

export interface LoginRequest {
    email: string;
    password: string;
    mfa_code?: string;
  }
  
  export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    mfa_verified: boolean;
    requires_mfa: boolean;
    session_id?: string;
    device_fingerprint?: string;
  }
  
  export interface PasswordChangeRequest {
    current_password: string;
    new_password: string;
  }
  
  export interface PasswordResetRequest {
    email: string;
  }
  
  export interface PasswordResetConfirmRequest {
    token: string;
    new_password: string;
  }
  
  export interface PasswordStrengthRequest {
    password: string;
  }
  
  export interface PasswordStrengthResponse {
    valid: boolean;
    strength_score: number;
    errors: string[];
    feedback: string[];
  }
  
  export interface RegisterRequest {
    email: string;
    password: string;
    first_name: string;
    last_name?: string;
  }
  
  export interface UserSessionsResponse {
    success: boolean;
    message: string;
    data: {
      sessions: Array<{
        session_id: string;
        device_fingerprint?: string;
        user_agent?: string;
        ip_address?: string;
        created_at: string;
        last_activity: string;
        status: string;
      }>;
    };
  }
  
  export interface StatusResponse {
    success: boolean;
    message: string;
    data?: any;
  }
  
  export interface MfaEnableResponse {
    secret: string;
    qr_code_url: string;
    backup_codes: string[];
  }
  
  export interface MfaStatusResponse {
    mfa_enabled: boolean;
    backup_codes_remaining: number;
  }
  
  export interface MfaStatsResponse {
    total_users: number;
    mfa_enabled_users: number;
    mfa_adoption_rate: number;
  }
  
  export interface BackupCodesResponse {
    backup_codes: string[];
  }
  
  export interface AuthServiceOptions {
    showToast?: boolean;
  }