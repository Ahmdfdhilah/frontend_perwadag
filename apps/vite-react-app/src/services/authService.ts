// apps/vite-react-app/src/services/authService.ts
import api from "@/utils/api";
import { useToast } from "@workspace/ui/components/sonner";

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

const { toast } = useToast();

export const authService = {
  // Authentication
  register: async (registerData: RegisterRequest): Promise<any> => {
    try {
      const response = await api.post("/auth/register", registerData);
      toast({
        title: "Success",
        description: "Account created successfully",
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Registration failed";
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    }
  },

  login: async (loginData: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post("/auth/login", loginData);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Login failed";
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    }
  },

  logout: async (sessionId?: string): Promise<StatusResponse> => {
    try {
      const response = await api.post("/auth/logout", sessionId ? { session_id: sessionId } : {});
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      return response.data;
    } catch (error: any) {
      // Don't show error toast for logout, as it might be expected
      console.error("Logout error:", error);
      return { success: false, message: "Logout failed" };
    }
  },

  logoutAllDevices: async (): Promise<StatusResponse> => {
    try {
      const response = await api.post("/auth/logout-all");
      toast({
        title: "Success",
        description: `Logged out from ${response.data.data?.sessions_terminated || 'all'} devices`,
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Failed to logout from all devices";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    }
  },

  revokeSession: async (sessionId: string): Promise<StatusResponse> => {
    try {
      const response = await api.post(`/auth/revoke-session/${sessionId}`);
      toast({
        title: "Success",
        description: "Session revoked successfully",
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Failed to revoke session";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    }
  },

  // Token management
  refreshToken: async (): Promise<{ access_token: string }> => {
    try {
      const response = await api.post("/auth/refresh");
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Token refresh failed");
    }
  },

  verifyToken: async (): Promise<any> => {
    try {
      const response = await api.post("/auth/verify");
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Token verification failed");
    }
  },

  // Password management
  changePassword: async (passwordData: PasswordChangeRequest): Promise<StatusResponse> => {
    try {
      const response = await api.post("/auth/change-password", passwordData);
      toast({
        title: "Success",
        description: "Password changed successfully",
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Failed to change password";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    }
  },

  checkPasswordStrength: async (password: string): Promise<PasswordStrengthResponse> => {
    try {
      const response = await api.post("/auth/check-password-strength", { password });
      return response.data;
    } catch (error: any) {
      // Don't show toast for password strength checks
      console.error("Password strength check error:", error);
      return {
        valid: false,
        strength_score: 0,
        errors: ["Unable to check password strength"],
        feedback: ["Please try a different password"]
      };
    }
  },

  requestPasswordReset: async (email: string): Promise<StatusResponse> => {
    try {
      const response = await api.post("/auth/request-password-reset", { email });
      toast({
        title: "Success",
        description: "Password reset instructions sent to your email",
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Failed to send reset email";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    }
  },

  confirmPasswordReset: async (resetData: PasswordResetConfirmRequest): Promise<StatusResponse> => {
    try {
      const response = await api.post("/auth/confirm-password-reset", resetData);
      toast({
        title: "Success",
        description: "Password reset successfully",
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Failed to reset password";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    }
  },

  // Account management
  unlockAccount: async (userId: number): Promise<StatusResponse> => {
    try {
      const response = await api.post(`/auth/unlock-account/${userId}`);
      toast({
        title: "Success",
        description: "Account unlocked successfully",
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Failed to unlock account";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    }
  },

  // Session management
  getUserSessions: async (): Promise<UserSessionsResponse> => {
    try {
      const response = await api.get("/auth/sessions");
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Failed to fetch sessions";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    }
  },

  // Multi-Factor Authentication
  mfa: {
    enable: async (): Promise<{
      secret: string;
      qr_code_url: string;
      backup_codes: string[];
    }> => {
      try {
        const response = await api.post("/mfa/enable");
        return response.data;
      } catch (error: any) {
        const errorMessage = error.response?.data?.detail || "Failed to enable MFA";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw new Error(errorMessage);
      }
    },

    verify: async (code: string): Promise<{ success: boolean; message: string }> => {
      try {
        const response = await api.post("/mfa/verify", { code });
        if (response.data.success) {
          toast({
            title: "Success",
            description: "MFA enabled successfully",
          });
        }
        return response.data;
      } catch (error: any) {
        const errorMessage = error.response?.data?.detail || "Invalid MFA code";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw new Error(errorMessage);
      }
    },

    disable: async (code: string): Promise<{ success: boolean; message: string }> => {
      try {
        const response = await api.post("/mfa/disable", { code });
        if (response.data.success) {
          toast({
            title: "Success",
            description: "MFA disabled successfully",
          });
        }
        return response.data;
      } catch (error: any) {
        const errorMessage = error.response?.data?.detail || "Failed to disable MFA";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw new Error(errorMessage);
      }
    },

    getStatus: async (): Promise<{
      mfa_enabled: boolean;
      backup_codes_remaining: number;
    }> => {
      try {
        const response = await api.get("/mfa/status");
        return response.data;
      } catch (error: any) {
        console.error("MFA status error:", error);
        return {
          mfa_enabled: false,
          backup_codes_remaining: 0
        };
      }
    },

    regenerateBackupCodes: async (): Promise<{ backup_codes: string[] }> => {
      try {
        const response = await api.post("/mfa/backup-codes/regenerate");
        toast({
          title: "Success",
          description: "Backup codes regenerated successfully",
        });
        return response.data;
      } catch (error: any) {
        const errorMessage = error.response?.data?.detail || "Failed to regenerate backup codes";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw new Error(errorMessage);
      }
    }
  },

  // Admin functions
  admin: {
    disableMfa: async (userId: number): Promise<{ success: boolean; message: string }> => {
      try {
        const response = await api.post(`/mfa/admin/disable/${userId}`);
        if (response.data.success) {
          toast({
            title: "Success",
            description: `MFA disabled for user ${userId}`,
          });
        }
        return response.data;
      } catch (error: any) {
        const errorMessage = error.response?.data?.detail || "Failed to disable user MFA";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw new Error(errorMessage);
      }
    },

    getMfaStats: async (): Promise<{
      total_users: number;
      mfa_enabled_users: number;
      mfa_adoption_rate: number;
    }> => {
      try {
        const response = await api.get("/mfa/admin/stats");
        return response.data;
      } catch (error: any) {
        const errorMessage = error.response?.data?.detail || "Failed to fetch MFA statistics";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw new Error(errorMessage);
      }
    }
  }
};

export default authService;