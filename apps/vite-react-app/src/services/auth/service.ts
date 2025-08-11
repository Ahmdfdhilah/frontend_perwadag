// apps/vite-react-app/src/services/auth/service.ts
import { BaseService } from "../base";
import {
  LoginRequest,
  LoginResponse,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
  ChangePasswordRequest,
  PasswordResetEligibilityResponse,
  DefaultPasswordInfoResponse,
  TokenVerificationResponse,
  RefreshTokenResponse,
  MessageResponse,
} from "./types";

class AuthService extends BaseService {
  constructor() {
    super("/auth");
  }

  async login(loginData: LoginRequest): Promise<LoginResponse> {
    return this.post("/login", loginData);
  }

  async logout(): Promise<MessageResponse> {
    // Always try to refresh token first to ensure we have a valid token for logout
    // This ensures proper token blacklisting on the backend
    try {
      await this.refreshToken();
      // After refresh, proceed with logout using fresh token
      return await this.post("/logout", {});
    } catch (refreshError) {
      // If refresh fails, token is truly invalid/expired
      // In this case, logout is already successful since token can't be used
      return { message: "Logout successful (token was expired)" };
    }
  }

  async verifyToken(): Promise<TokenVerificationResponse> {
    return this.get("/verify-token");
  }

  async refreshToken(): Promise<RefreshTokenResponse> {
    return this.post("/refresh", {});
  }

  async requestPasswordReset(
    resetData: PasswordResetRequest
  ): Promise<MessageResponse> {
    return this.post("/request-password-reset", resetData);
  }

  async confirmPasswordReset(
    resetData: PasswordResetConfirmRequest
  ): Promise<MessageResponse> {
    return this.post("/confirm-password-reset", resetData);
  }

  async getPasswordResetEligibility(): Promise<PasswordResetEligibilityResponse> {
    return this.get("/password-reset-eligibility");
  }

  async getDefaultPasswordInfo(): Promise<DefaultPasswordInfoResponse> {
    return this.get("/default-password-info");
  }

  async changePassword(
    changePasswordData: ChangePasswordRequest
  ): Promise<MessageResponse> {
    return this.post("/change-password", changePasswordData);
  }

  async getCaptchaConfig(): Promise<{enabled: boolean, site_key: string | null, version: string}> {
    return this.get("/captcha-config");
  }
}

export const authService = new AuthService();