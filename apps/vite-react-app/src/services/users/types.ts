// apps/vite-react-app/src/services/users/types.ts

import { ServiceOptions, PaginatedResponse } from "../base/types";

// User Types
export interface User {
  id: string;
  nama: string;
  email?: string;
  role: "ADMIN" | "INSPEKTORAT" | "PERWADAG";
  inspektorat?: string;
  wilayah?: string;
  perwadag_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSummary {
  id: string;
  nama: string;
  role: string;
  inspektorat?: string;
  wilayah?: string;
  is_active: boolean;
}

// Request Types
export interface UserCreate {
  nama: string;
  email?: string;
  role: "ADMIN" | "INSPEKTORAT" | "PERWADAG";
  inspektorat?: string;
  wilayah?: string;
  perwadag_id?: string;
}

export interface UserUpdate {
  nama?: string;
  email?: string;
  wilayah?: string;
  perwadag_id?: string;
}

export interface UserChangePassword {
  current_password: string;
  new_password: string;
}

export interface UsernameGenerationPreview {
  nama: string;
  role: string;
  inspektorat?: string;
}

// Response Types
export interface UserResponse {
  id: string;
  nama: string;
  email?: string;
  role: string;
  inspektorat?: string;
  wilayah?: string;
  perwadag_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  username?: string;
}

export interface UsernameGenerationResponse {
  preview_username: string;
  is_available: boolean;
  suggestions?: string[];
}

export interface UserListResponse extends PaginatedResponse<User> {}

export interface UserStatistics {
  total_users: number;
  active_users: number;
  inactive_users: number;
  by_role: Record<string, number>;
  by_inspektorat: Record<string, number>;
}

// Filter Types
export interface UserFilterParams {
  page?: number;
  size?: number;
  search?: string;
  role?: string;
  inspektorat?: string;
  is_active?: boolean;
  created_after?: string;
  created_before?: string;
}

export interface UserServiceOptions extends ServiceOptions {}

// Response wrapper for single operations
export interface MessageResponse {
  message: string;
}