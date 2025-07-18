import { PaginatedResponse } from "../base/types";

// Base Types
export interface SuratTugas {
  id: string;
  user_perwadag_id: string;
  nama_perwadag: string;
  inspektorat: string;
  tanggal_evaluasi_mulai: string;
  tanggal_evaluasi_selesai: string;
  no_surat: string;
  file_surat_tugas?: string;
  tahun_evaluasi?: number;
  durasi_evaluasi?: number;
  is_evaluation_active?: boolean;
  evaluation_status?: string;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface SuratTugasProgress {
  surat_pemberitahuan_completed: boolean;
  entry_meeting_completed: boolean;
  konfirmasi_meeting_completed: boolean;
  exit_meeting_completed: boolean;
  matriks_completed: boolean;
  laporan_completed: boolean;
  kuisioner_completed: boolean;
  overall_percentage: number;
}

export interface PerwadagInfo {
  id: string;
  nama: string;
  inspektorat: string;
}

// Request Types
export interface SuratTugasCreate {
  user_perwadag_id: string;
  tanggal_evaluasi_mulai: string;
  tanggal_evaluasi_selesai: string;
  no_surat: string;
}

export interface SuratTugasUpdate {
  tanggal_evaluasi_mulai?: string;
  tanggal_evaluasi_selesai?: string;
  no_surat?: string;
}

// Response Types
export interface SuratTugasResponse {
  id: string;
  user_perwadag_id: string;
  nama_perwadag: string;
  inspektorat: string;
  tanggal_evaluasi_mulai: string;
  tanggal_evaluasi_selesai: string;
  no_surat: string;
  file_surat_tugas?: string;
  tahun_evaluasi?: number;
  durasi_evaluasi?: number;
  is_evaluation_active?: boolean;
  evaluation_status?: string;
  progress: SuratTugasProgress;
  perwadag_info: PerwadagInfo;
  file_surat_tugas_url?: string;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface SuratTugasCreateResponse {
  success: boolean;
  message: string;
  data: SuratTugasResponse;
  surat_tugas: SuratTugasResponse;
  auto_generated_records: {
    surat_pemberitahuan_id: string;
    entry_meeting_id: string;
    konfirmasi_meeting_id: string;
    exit_meeting_id: string;
    matriks_id: string;
    laporan_hasil_id: string;
    kuisioner_id: string;
  };
}

export interface SuratTugasListResponse extends PaginatedResponse<SuratTugasResponse> { }

export interface SuratTugasDashboardSummary {
  total_surat_tugas: number;
  active_evaluations: number;
  completed_evaluations: number;
  by_status: Record<string, number>;
  by_inspektorat: Record<string, number>;
  recent_activities: any[];
}

export interface PerwadagListResponse {
  [key: string]: any;
}

// Filter Types
export interface SuratTugasFilterParams {
  page?: number;
  size?: number;
  search?: string;
  inspektorat?: string;
  user_perwadag_id?: string;
  tahun_evaluasi?: number;
  tanggal_mulai_from?: string;
  tanggal_mulai_to?: string;
  tanggal_selesai_from?: string;
  tanggal_selesai_to?: string;
}

// File Upload Types
export interface SuratTugasFileUploadResponse {
  success: boolean;
  message: string;
  data: any;
  file_path: string;
  file_url: string;
}

// Message Response
export interface MessageResponse {
  message: string;
  success?: boolean;
}