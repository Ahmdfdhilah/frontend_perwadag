// apps/vite-react-app/src/services/auth/service.ts
import { BaseService } from "../base";
import {
  LoginRequest,
  LoginResponse,
  TokenResponse,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
  PasswordResetEligibilityResponse,
  DefaultPasswordInfoResponse,
  TokenVerificationResponse,
  MessageResponse,
  AuthServiceOptions,
} from "./types";

class AuthService extends BaseService {
  constructor() {
    super("/auth");
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

  async logout(options?: AuthServiceOptions): Promise<MessageResponse> {
    try {
      return await this.post(
        "/logout",
        {},
        {
          title: "Success",
          description: "Logged out successfully",
        },
        undefined,
        options
      );
    } catch (error: any) {
      console.error("Logout error:", error);
      return { message: "Logout failed" };
    }
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    return this.post("/refresh", { refresh_token: refreshToken });
  }

  async verifyToken(): Promise<TokenVerificationResponse> {
    return this.get("/verify-token");
  }

  async requestPasswordReset(
    resetData: PasswordResetRequest,
    options?: AuthServiceOptions
  ): Promise<MessageResponse> {
    return this.post(
      "/request-password-reset",
      resetData,
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
  ): Promise<MessageResponse> {
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

  async getPasswordResetEligibility(
    options?: AuthServiceOptions
  ): Promise<PasswordResetEligibilityResponse> {
    return this.get(
      "/password-reset-eligibility",
      undefined,
      {
        title: "Error",
        description: "Failed to check password reset eligibility",
      },
      options
    );
  }

  async getDefaultPasswordInfo(
    options?: AuthServiceOptions
  ): Promise<DefaultPasswordInfoResponse> {
    return this.get(
      "/default-password-info",
      undefined,
      {
        title: "Error",
        description: "Failed to get default password info",
      },
      options
    );
  }
}

export const authService = new AuthService();