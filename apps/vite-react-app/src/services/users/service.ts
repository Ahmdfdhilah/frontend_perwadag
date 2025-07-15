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
  UserServiceOptions,
} from "./types";

class UserService extends BaseService {
  constructor() {
    super("/users");
  }

  // Current user methods
  async getCurrentUser(options?: UserServiceOptions): Promise<UserResponse> {
    return this.get(
      "/me",
      undefined,
      {
        title: "Error",
        description: "Failed to get user profile",
      },
      options
    );
  }

  async updateCurrentUser(
    userData: UserUpdate,
    options?: UserServiceOptions
  ): Promise<UserResponse> {
    return this.put(
      "/me",
      userData,
      {
        title: "Success",
        description: "Profile updated successfully",
      },
      {
        title: "Update Failed",
        description: "Failed to update profile",
      },
      options
    );
  }

  async changePassword(
    passwordData: UserChangePassword,
    options?: UserServiceOptions
  ): Promise<MessageResponse> {
    return this.post(
      "/me/change-password",
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

  // Admin user management methods
  async getUsers(
    params?: UserFilterParams,
    options?: UserServiceOptions
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
    return this.get(
      endpoint,
      undefined,
      {
        title: "Error",
        description: "Failed to fetch users",
      },
      options
    );
  }

  async getUsersByRole(
    roleName: string,
    options?: UserServiceOptions
  ): Promise<UserSummary[]> {
    return this.get(
      `/by-role/${roleName}`,
      undefined,
      {
        title: "Error",
        description: "Failed to fetch users by role",
      },
      options
    );
  }

  async getUserStatistics(
    options?: UserServiceOptions
  ): Promise<UserStatistics> {
    return this.get(
      "/statistics",
      undefined,
      {
        title: "Error",
        description: "Failed to get user statistics",
      },
      options
    );
  }

  async previewUsername(
    previewData: UsernameGenerationPreview,
    options?: UserServiceOptions
  ): Promise<UsernameGenerationResponse> {
    return this.post(
      "/preview-username",
      previewData,
      undefined,
      {
        title: "Error",
        description: "Failed to preview username",
      },
      options
    );
  }

  async createUser(
    userData: UserCreate,
    options?: UserServiceOptions
  ): Promise<UserResponse> {
    return this.post(
      "/",
      userData,
      {
        title: "Success",
        description: "User created successfully",
      },
      {
        title: "Creation Failed",
        description: "Failed to create user",
      },
      options
    );
  }

  async getUserById(
    userId: string,
    options?: UserServiceOptions
  ): Promise<UserResponse> {
    return this.get(
      `/${userId}`,
      undefined,
      {
        title: "Error",
        description: "Failed to get user",
      },
      options
    );
  }

  async updateUser(
    userId: string,
    userData: UserUpdate,
    options?: UserServiceOptions
  ): Promise<UserResponse> {
    return this.put(
      `/${userId}`,
      userData,
      {
        title: "Success",
        description: "User updated successfully",
      },
      {
        title: "Update Failed",
        description: "Failed to update user",
      },
      options
    );
  }

  async resetUserPassword(
    userId: string,
    options?: UserServiceOptions
  ): Promise<MessageResponse> {
    return this.post(
      `/${userId}/reset-password`,
      undefined,
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

  async activateUser(
    userId: string,
    options?: UserServiceOptions
  ): Promise<UserResponse> {
    return this.post(
      `/${userId}/activate`,
      undefined,
      {
        title: "Success",
        description: "User activated successfully",
      },
      {
        title: "Error",
        description: "Failed to activate user",
      },
      options
    );
  }

  async deactivateUser(
    userId: string,
    options?: UserServiceOptions
  ): Promise<UserResponse> {
    return this.post(
      `/${userId}/deactivate`,
      undefined,
      {
        title: "Success",
        description: "User deactivated successfully",
      },
      {
        title: "Error",
        description: "Failed to deactivate user",
      },
      options
    );
  }

  async deleteUser(
    userId: string,
    options?: UserServiceOptions
  ): Promise<MessageResponse> {
    return this.delete(
      `/${userId}`,
      {
        title: "Success",
        description: "User deleted successfully",
      },
      {
        title: "Error",
        description: "Failed to delete user",
      },
      options
    );
  }
}

export const userService = new UserService();