// apps/vite-react-app/src/services/users/types.ts

import { ServiceOptions, PaginatedResponse } from "../base/types";

// User Types
export interface User {
  id: string;
  nama: string;
  username: string;
  tempat_lahir: string;
  tanggal_lahir: string; // date
  pangkat: string;
  jabatan: string;
  email?: string;
  is_active: boolean;
  role: "ADMIN" | "INSPEKTORAT" | "PERWADAG";
  inspektorat?: string;
  display_name: string;
  age: number;
  has_email: boolean;
  last_login?: string; // datetime
  role_display: string;
  created_at: string; // datetime
  updated_at?: string; // datetime
}

export interface UserSummary {
  id: string;
  nama: string;
  username: string;
  pangkat: string;
  jabatan: string;
  role: "ADMIN" | "INSPEKTORAT" | "PERWADAG";
  role_display: string;
  inspektorat?: string;
  has_email: boolean;
  is_active: boolean;
}

// Request Types
export interface UserCreate {
  nama: string; // 1-200 chars
  tempat_lahir: string; // 1-100 chars
  tanggal_lahir: string; // date
  pangkat: string; // 1-100 chars
  jabatan: string; // 1-200 chars
  email?: string; // valid email
  is_active?: boolean; // default: true
  role: "ADMIN" | "INSPEKTORAT" | "PERWADAG";
  inspektorat?: string; // required for perwadag, inspectorat role
}

export interface UserUpdate {
  nama?: string; // 1-200 chars
  tempat_lahir?: string; // 1-100 chars
  tanggal_lahir?: string; // date
  pangkat?: string; // 1-100 chars
  jabatan?: string; // 1-200 chars
  email?: string; // valid email
  is_active?: boolean;
  role?: "ADMIN" | "INSPEKTORAT" | "PERWADAG";
  inspektorat?: string; // max 100 chars
}

export interface UserChangePassword {
  current_password: string;
  new_password: string;
}

export interface UsernameGenerationPreview {
  nama: string;
  tanggal_lahir: string; // date
  role: "ADMIN" | "INSPEKTORAT" | "PERWADAG";
}

// Response Types
export interface UserResponse extends User {}

export interface UsernameGenerationResponse {
  generated_username: string;
  is_available: boolean;
  existing_username?: string;
  format_explanation: string;
}

export interface UserListResponse extends PaginatedResponse<User> {};

export interface UserStatistics {
  total_users: number;
  active_users: number;
  inactive_users: number;
  by_role: Record<string, number>;
  by_inspektorat: Record<string, number>;
}

// Filter Types
export interface UserFilterParams {
  page?: number; // default: 1
  size?: number; // default: 20, max: 100
  search?: string; // Search in nama, username, tempat_lahir, pangkat, jabatan, email, inspektorat
  role?: "ADMIN" | "INSPEKTORAT" | "PERWADAG";
  inspektorat?: string;
  pangkat?: string;
  jabatan?: string;
  tempat_lahir?: string;
  has_email?: boolean;
  is_active?: boolean;
  min_age?: number; // 17-70
  max_age?: number; // 17-70
}

export interface UserServiceOptions extends ServiceOptions {}

// Response wrapper for single operations
export interface MessageResponse {
  message: string;
}