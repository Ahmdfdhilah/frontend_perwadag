// apps/vite-react-app/src/services/users/service.ts
import { BaseService } from "../base";
import {
  UserCreate,
  UserUpdate,
  UserChangePassword,
  UserResponse,
  UserListResponse,
  UserStatistics,
  UserFilterParams,
  UserSummary,
  UsernameGenerationPreview,
  UsernameGenerationResponse,
  MessageResponse,
  PerwadagListResponse,
  PerwadagSearchParams,
} from "./types";

class UserService extends BaseService {
  constructor() {
    super("/users");
  }

  // Current user methods
  async getCurrentUser(): Promise<UserResponse> {
    return this.get("/me");
  }

  async updateCurrentUser(
    userData: UserUpdate
  ): Promise<UserResponse> {
    return this.put("/me", userData);
  }

  async changePassword(
    passwordData: UserChangePassword
  ): Promise<MessageResponse> {
    return this.post("/me/change-password", passwordData);
  }

  // Admin user management methods
  async getUsers(
    params?: UserFilterParams
  ): Promise<UserListResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = queryParams.toString() ? `/?${queryParams.toString()}` : "/";
    return this.get(endpoint);
  }

  async getUsersByRole(
    roleName: string
  ): Promise<UserSummary[]> {
    return this.get(`/by-role/${roleName}`);
  }

  async getUserStatistics(): Promise<UserStatistics> {
    return this.get("/statistics");
  }

  async previewUsername(
    previewData: UsernameGenerationPreview
  ): Promise<UsernameGenerationResponse> {
    return this.post("/preview-username", previewData);
  }

  async createUser(
    userData: UserCreate
  ): Promise<UserResponse> {
    return this.post("/", userData);
  }

  async getUserById(
    userId: string
  ): Promise<UserResponse> {
    return this.get(`/${userId}`);
  }

  async updateUser(
    userId: string,
    userData: UserUpdate
  ): Promise<UserResponse> {
    return this.put(`/${userId}`, userData);
  }

  async resetUserPassword(
    userId: string
  ): Promise<MessageResponse> {
    return this.post(`/${userId}/reset-password`);
  }

  async activateUser(
    userId: string
  ): Promise<UserResponse> {
    return this.post(`/${userId}/activate`);
  }

  async deactivateUser(
    userId: string
  ): Promise<UserResponse> {
    return this.post(`/${userId}/deactivate`);
  }

  async deleteUser(
    userId: string
  ): Promise<MessageResponse> {
    return this.delete(`/${userId}`);
  }

  // Perwadag search methods
  async getPerwadagList(
    params?: PerwadagSearchParams
  ): Promise<PerwadagListResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = queryParams.toString() ? `/perwadag?${queryParams.toString()}` : "/perwadag";
    return this.get(endpoint);
  }
}

export const userService = new UserService();