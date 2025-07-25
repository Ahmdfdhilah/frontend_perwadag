import { PaginatedResponse } from "../base/types";

// Base Types
export interface LaporanHasil {
  id: string;
  surat_tugas_id: string;
  nomor_laporan?: string;
  tanggal_laporan?: string;
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

export interface LaporanHasilStatistics {
  total_records: number;
  completed_records: number;
  with_files: number;
  without_files: number;
  completion_rate: number;
  last_updated: string;
}

// Request Types
export interface LaporanHasilCreate {
  surat_tugas_id: string;
}

export interface LaporanHasilUpdate {
  nomor_laporan?: string;
  tanggal_laporan?: string;
}

// Response Types
export interface LaporanHasilResponse {
  id: string;
  surat_tugas_id: string;
  nomor_laporan?: string;
  tanggal_laporan?: string;
  file_dokumen?: string;
  file_urls: FileUrls;
  file_metadata: FileMetadata;
  is_completed: boolean;
  has_file: boolean;
  has_nomor: boolean;
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

export interface LaporanHasilListResponse extends PaginatedResponse<LaporanHasilResponse> {
  statistics: LaporanHasilStatistics;
}

export interface LaporanHasilFileUploadResponse {
  success: boolean;
  message: string;
  data: any;
  laporan_hasil_id: string;
  file_path: string;
  file_url: string;
}

// Filter Types
export interface LaporanHasilFilterParams {
  page?: number;
  size?: number;
  search?: string;
  inspektorat?: string;
  user_perwadag_id?: string;
  has_file?: boolean;
  has_nomor?: boolean;
  is_completed?: boolean;
  tahun_evaluasi?: number;
  tanggal_from?: string;
  tanggal_to?: string;
}

// Message Response
export interface MessageResponse {
  message: string;
  success?: boolean;
}