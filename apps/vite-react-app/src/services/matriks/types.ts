import { PaginatedResponse } from "../base/types";

// Base Types
export interface Matriks {
  id: string;
  surat_tugas_id: string;
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

export interface MatriksStatistics {
  total_records: number;
  completed_records: number;
  with_files: number;
  without_files: number;
  completion_rate: number;
  last_updated: string;
}

// Temuan Rekomendasi Types - Updated to 3-field structure
export interface TemuanRekomendasi {
  id?: number;
  kondisi: string;
  kriteria: string;
  rekomendasi: string;
}

// Request Types
export interface MatriksCreate {
  surat_tugas_id: string;
}

export interface MatriksUpdate {
  temuan_rekomendasi?: {
    items: TemuanRekomendasi[];
  };
}

// Temuan Rekomendasi Response Types
export interface TemuanRekomendasiSummary {
  data: TemuanRekomendasi[];
}

// Response Types
export interface MatriksResponse {
  id: string;
  surat_tugas_id: string;
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
  temuan_rekomendasi_summary: TemuanRekomendasiSummary | null;
  has_temuan_rekomendasi: boolean;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface MatriksListResponse extends PaginatedResponse<MatriksResponse> {
  statistics: MatriksStatistics;
}

export interface MatriksFileUploadResponse {
  success: boolean;
  message: string;
  data: any;
  matriks_id: string;
  file_path: string;
  file_url: string;
}

// Filter Types
export interface MatriksFilterParams {
  page?: number;
  size?: number;
  search?: string;
  inspektorat?: string;
  user_perwadag_id?: string;
  has_file?: boolean;
  is_completed?: boolean;
  tahun_evaluasi?: number;
}

// Message Response
export interface MessageResponse {
  message: string;
  success?: boolean;
}