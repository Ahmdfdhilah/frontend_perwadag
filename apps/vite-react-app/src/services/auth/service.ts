// apps/vite-react-app/src/services/auth/service.ts
import { BaseService } from "../base";
import {
  LoginRequest,
  LoginResponse,
  PasswordChangeRequest,
  PasswordResetConfirmRequest,
  PasswordStrengthResponse,
  RegisterRequest,
  UserSessionsResponse,
  StatusResponse,
  AuthServiceOptions,
} from "./types";

class AuthService extends BaseService {
  constructor() {
    super("/auth");
  }
  async register(
    registerData: RegisterRequest,
    options?: AuthServiceOptions
  ): Promise<any> {
    return this.post(
      "/register",
      registerData,
      {
        title: "Success",
        description: "Account created successfully",
      },
      {
        title: "Registration Failed",
        description: "Registration failed",
      },
      options
    );
  }

  async login(
    loginData: LoginRequest,
    options?: AuthServiceOptions
  ): Promise<LoginResponse> {
    return this.post(
      "/login",
      loginData,
      undefined,
      {
        title: "Login Failed",
        description: "Login failed",
      },
      options
    );
  }

  async logout(
    sessionId?: string,
    options?: AuthServiceOptions
  ): Promise<StatusResponse> {
    try {
      return await this.post(
        "/logout",
        sessionId ? { session_id: sessionId } : {},
        {
          title: "Success",
          description: "Logged out successfully",
        },
        undefined,
        options
      );
    } catch (error: any) {
      console.error("Logout error:", error);
      return { success: false, message: "Logout failed" };
    }
  }

  async logoutAllDevices(
    options?: AuthServiceOptions
  ): Promise<StatusResponse> {
    const response = await this.post<StatusResponse>(
      "/logout-all",
      undefined,
      {
        title: "Success",
        description: `Logged out from all devices`,
      },
      {
        title: "Error",
        description: "Failed to logout from all devices",
      },
      options
    );
    
    // Update success message with actual count
    if (response.data?.sessions_terminated) {
      this.showToast(
        {
          title: "Success",
          description: `Logged out from ${response.data.sessions_terminated} devices`,
        },
        options
      );
    }
    
    return response;
  }

  async revokeSession(
    sessionId: string,
    options?: AuthServiceOptions
  ): Promise<StatusResponse> {
    return this.post(
      `/revoke-session/${sessionId}`,
      undefined,
      {
        title: "Success",
        description: "Session revoked successfully",
      },
      {
        title: "Error",
        description: "Failed to revoke session",
      },
      options
    );
  }

  async refreshToken(): Promise<{ access_token: string }> {
    return this.post("/refresh");
  }

  async verifyToken(): Promise<any> {
    return this.post("/verify");
  }

  async changePassword(
    passwordData: PasswordChangeRequest,
    options?: AuthServiceOptions
  ): Promise<StatusResponse> {
    return this.post(
      "/change-password",
      passwordData,
      {
        title: "Success",
        description: "Password changed successfully",
      },
      {
        title: "Error",
        description: "Failed to change password",
      },
      options
    );
  }

  async checkPasswordStrength(password: string): Promise<PasswordStrengthResponse> {
    try {
      return await this.post("/check-password-strength", { password });
    } catch (error: any) {
      console.error("Password strength check error:", error);
      return {
        valid: false,
        strength_score: 0,
        errors: ["Unable to check password strength"],
        feedback: ["Please try a different password"]
      };
    }
  }

  async requestPasswordReset(
    email: string,
    options?: AuthServiceOptions
  ): Promise<StatusResponse> {
    return this.post(
      "/request-password-reset",
      { email },
      {
        title: "Success",
        description: "Password reset instructions sent to your email",
      },
      {
        title: "Error",
        description: "Failed to send reset email",
      },
      options
    );
  }

  async confirmPasswordReset(
    resetData: PasswordResetConfirmRequest,
    options?: AuthServiceOptions
  ): Promise<StatusResponse> {
    return this.post(
      "/confirm-password-reset",
      resetData,
      {
        title: "Success",
        description: "Password reset successfully",
      },
      {
        title: "Error",
        description: "Failed to reset password",
      },
      options
    );
  }

  async unlockAccount(
    userId: number,
    options?: AuthServiceOptions
  ): Promise<StatusResponse> {
    return this.post(
      `/unlock-account/${userId}`,
      undefined,
      {
        title: "Success",
        description: "Account unlocked successfully",
      },
      {
        title: "Error",
        description: "Failed to unlock account",
      },
      options
    );
  }

  async getUserSessions(
    options?: AuthServiceOptions
  ): Promise<UserSessionsResponse> {
    return this.get(
      "/sessions",
      undefined,
      {
        title: "Error",
        description: "Failed to fetch sessions",
      },
      options
    );
  }
}

export const authService = new AuthService();