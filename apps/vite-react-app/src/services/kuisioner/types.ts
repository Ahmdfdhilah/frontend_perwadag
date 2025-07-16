import { ServiceOptions, PaginatedResponse } from "../base/types";

// Base Types
export interface Kuisioner {
  id: string;
  surat_tugas_id: string;
  tanggal_kuisioner?: string;
  file_dokumen?: string;
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

export interface SuratTugasInfo {
  id: string;
  no_surat: string;
  nama_perwadag: string;
  inspektorat: string;
  tanggal_evaluasi_mulai: string;
  tanggal_evaluasi_selesai: string;
  tahun_evaluasi: number;
  durasi_evaluasi: number;
  evaluation_status: string;
  is_evaluation_active: boolean;
}

export interface KuisionerStatistics {
  total_records: number;
  completed_records: number;
  with_files: number;
  without_files: number;
  completion_rate: number;
  last_updated: string;
}

// Request Types
export interface KuisionerCreate {
  surat_tugas_id: string;
}

export interface KuisionerUpdate {
  tanggal_kuisioner?: string;
}

// Response Types
export interface KuisionerResponse {
  id: string;
  surat_tugas_id: string;
  tanggal_kuisioner?: string;
  file_dokumen?: string;
  file_urls: FileUrls;
  file_metadata: FileMetadata;
  is_completed: boolean;
  has_file: boolean;
  completion_percentage: number;
  surat_tugas_info: SuratTugasInfo;
  nama_perwadag: string;
  inspektorat: string;
  tanggal_evaluasi_mulai: string;
  tanggal_evaluasi_selesai: string;
  tahun_evaluasi: number;
  evaluation_status: string;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface KuisionerListResponse extends PaginatedResponse<KuisionerResponse> {
  statistics: KuisionerStatistics;
}

export interface KuisionerFileUploadResponse {
  success: boolean;
  message: string;
  data: any;
  kuisioner_id: string;
  file_path: string;
  file_url: string;
}

// Filter Types
export interface KuisionerFilterParams {
  page?: number;
  size?: number;
  search?: string;
  inspektorat?: string;
  user_perwadag_id?: string;
  has_file?: boolean;
  is_completed?: boolean;
  tahun_evaluasi?: number;
  tanggal_from?: string;
  tanggal_to?: string;
}

// Service Options
export interface KuisionerServiceOptions extends ServiceOptions {}

// Message Response
export interface MessageResponse {
  message: string;
  success?: boolean;
}