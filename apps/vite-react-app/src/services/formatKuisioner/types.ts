import { PaginatedResponse } from "../base/types";

// Base Types
export interface FormatKuisioner {
  id: string;
  nama_template: string;
  deskripsi?: string;
  tahun: number;
  link_template: string;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface FileUrls {
  file_url: string;
  download_url: string;
  view_url: string;
}

export interface FileMetadata {
  filename: string;
  original_filename?: string;
  size: number;
  size_mb: number;
  content_type: string;
  extension: string;
  uploaded_at: string;
  uploaded_by?: string;
  is_viewable: boolean;
}

export interface FormatKuisionerStatistics {
  total_records: number;
  completed_records: number;
  with_files: number;
  without_files: number;
  completion_rate: number;
  last_updated: string;
}

// Request Types
export interface FormatKuisionerCreate {
  nama_template: string;
  deskripsi?: string;
  tahun: number;
}

export interface FormatKuisionerUpdate {
  nama_template?: string;
  deskripsi?: string;
  tahun?: number;
}

// Response Types
export interface FormatKuisionerResponse {
  id: string;
  nama_template: string;
  deskripsi?: string;
  tahun: number;
  link_template: string;
  file_urls?: FileUrls;
  file_metadata?: FileMetadata;
  display_name: string;
  has_file: boolean;
  is_downloadable: boolean;
  is_active: boolean;
  usage_count: number;
  last_used?: string;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface ModuleStatistics {
  total_records: number;
  completed_records: number;
  with_files: number;
  without_files: number;
  completion_rate: number;
  last_updated: string;
}

export interface FormatKuisionerListResponse extends PaginatedResponse<FormatKuisionerResponse> {
  statistics?: ModuleStatistics;
}

export interface FormatKuisionerFileUploadResponse {
  success: boolean;
  message: string;
  data: any;
  format_kuisioner_id: string;
  file_path: string;
  file_url: string;
}

export interface FormatKuisionerByYearResponse {
  tahun: number;
  templates: FormatKuisionerResponse[];
  total: number;
}

export interface FormatKuisionerStatisticsResponse {
  total_templates: number;
  templates_by_year: Record<number, number>;
  templates_with_files: number;
  templates_without_files: number;
  active_templates: number;
  completion_rate: number;
}

// Filter Types
export interface FormatKuisionerFilterParams {
  page?: number;
  size?: number;
  search?: string;
  tahun?: number;
  has_file?: boolean;
  created_after?: string;
  created_before?: string;
}


// Message Response
export interface MessageResponse {
  message: string;
  success?: boolean;
}