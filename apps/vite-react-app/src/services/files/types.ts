// apps/vite-react-app/src/services/files/types.ts

import { ServiceOptions, PaginatedResponse } from "../base/types";

// File Types
export interface FileInfo {
  id: string;
  filename: string;
  original_filename: string;
  size: number;
  content_type: string;
  is_public: boolean;
  is_temporary: boolean;
  expires_at?: string;
  url?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Request Types
export interface FileUploadParams {
  is_public?: boolean;
  is_temporary?: boolean;
  expires_in_hours?: number;
  category?: string;
}

export interface FileUrlParams {
  expires_in_minutes?: number;
  download?: boolean;
}

export interface FileDeleteParams {
  force?: boolean;
}

export interface FileFilterParams {
  page?: number;
  size?: number;
  search?: string;
  content_type?: string;
  is_public?: boolean;
  is_temporary?: boolean;
  user_id?: string;
  created_after?: string;
  created_before?: string;
}

// Response Types
export interface FileUploadResponse {
  id: string;
  filename: string;
  original_filename: string;
  size: number;
  content_type: string;
  is_public: boolean;
  is_temporary: boolean;
  expires_at?: string;
  url?: string;
  message: string;
}

export interface MultipleFileUploadResponse {
  files: FileUploadResponse[];
  failed_files: Array<{
    filename: string;
    error: string;
  }>;
  total_uploaded: number;
  total_failed: number;
}

export interface FileUrlResponse {
  url: string;
  expires_at?: string;
}

export interface FileDeleteResponse {
  message: string;
  deleted_file_id: string;
}

export interface FileListResponse extends PaginatedResponse<FileInfo> {}

export interface StorageInfoResponse {
  total_files: number;
  total_size: number;
  storage_type: string;
  available_space?: number;
  used_space?: number;
}

export interface FileCleanupResponse {
  cleaned_files: number;
  total_size_freed: number;
  message: string;
}

export interface FileStatistics {
  total_files: number;
  total_size: number;
  public_files: number;
  private_files: number;
  temporary_files: number;
  by_content_type: Record<string, number>;
  by_user: Record<string, number>;
}

export interface FileServiceOptions extends ServiceOptions {}