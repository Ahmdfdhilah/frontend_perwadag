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
  nama_pengedali_mutu?: string;
  nama_pengendali_teknis?: string;
  nama_ketua_tim?: string;
  file_urls?: {
    file_url?: string;
    download_url?: string;
    view_url?: string;
  };
  file_metadata?: {
    filename: string;
    original_filename?: string;
    size: number;
    size_mb: number;
    content_type: string;
    extension: string;
    uploaded_at: string;
    uploaded_by?: string;
    is_viewable: boolean;
  };
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

// Dashboard Summary Types
export interface CompletionStat {
  completed: number;      // How many completed
  total: number;         // Total records
  percentage: number;    // 0-100
  remaining: number;     // total - completed
}


export interface SuratTugasDashboardSummary {
  user_info: {
    nama: string;
    role: "ADMIN" | "INSPEKTORAT" | "PERWADAG";
    inspektorat: string | null;
  };
  year_filter: number | null;
  summary: {
    statistics: {
      total_perwadag?: number;          // Total perwadag (only for admin/inspektorat)
      average_progress: number;         // 0-100 percentage
      year_filter_applied: boolean;
      filtered_year: number | null;
    };
    completion_stats: {
      surat_pemberitahuan: CompletionStat;
      entry_meeting: CompletionStat;
      konfirmasi_meeting: CompletionStat;
      exit_meeting: CompletionStat;
      matriks: CompletionStat;
      laporan_hasil: CompletionStat;
      kuisioner: CompletionStat;
    };
    recent_surat_tugas: SuratTugasResponse[];   // Last 5 items
    summary_by_relationship: {
      most_completed: string | null;    // e.g. "matriks"
      least_completed: string | null;   // e.g. "kuisioner"
      total_relationships: number;      // Always 7
      fully_completed_relationships: number;
    };
  };
  quick_actions: {
    can_create_surat_tugas: boolean;
    can_manage_templates: boolean;
    total_evaluasi?: number;            // Not shown for perwadag
  };
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