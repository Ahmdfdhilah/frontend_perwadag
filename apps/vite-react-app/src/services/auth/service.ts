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
    try {
      return await this.post("/logout", {});
    } catch (error: any) {
      console.error("Logout error:", error);
      return { message: "Logout failed" };
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
}

export const authService = new AuthService();