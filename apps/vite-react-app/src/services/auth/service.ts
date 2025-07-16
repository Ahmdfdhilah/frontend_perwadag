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
} from "./types";

class AuthService extends BaseService {
  constructor() {
    super("/auth");
  }

  async login(loginData: LoginRequest): Promise<LoginResponse> {
    return this.post("/login", loginData);
  }

  async logout(): Promise<MessageResponse> {
    try {
      return await this.post("/logout", {});
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
}

export const authService = new AuthService();