import { PaginatedResponse } from "../base/types";
import { UserRole } from "../../lib/constants";

// User Summary Interface
export interface UserSummary {
  id: string;
  nama: string;
  username: string;
  jabatan: string;
  role: UserRole;
  role_display: string;
  inspektorat?: string;
  has_email: boolean;
  is_active: boolean;
}

// File Types
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

export interface FileUrls {
  file_url: string;
  download_url: string;
  view_url: string;
}

// Assignment Information
export interface AssignmentInfo {
  pengedali_mutu?: UserSummary;
  pengendali_teknis?: UserSummary;
  ketua_tim?: UserSummary;
  anggota_tim: UserSummary[];
  pimpinan_inspektorat?: UserSummary;
}

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

export interface PerwardagSummary {
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
  pengedali_mutu_id?: string;
  pengendali_teknis_id?: string;
  ketua_tim_id?: string;
  anggota_tim_ids?: string[];
  pimpinan_inspektorat_id?: string;
}

export interface SuratTugasUpdate {
  tanggal_evaluasi_mulai?: string;
  tanggal_evaluasi_selesai?: string;
  no_surat?: string;
  pengedali_mutu_id?: string;
  pengendali_teknis_id?: string;
  ketua_tim_id?: string;
  anggota_tim_ids?: string[];
  pimpinan_inspektorat_id?: string;
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
  assignment_info: AssignmentInfo;
  file_surat_tugas: string;
  file_urls?: FileUrls;
  file_metadata?: FileMetadata;
  tahun_evaluasi?: number;
  durasi_evaluasi?: number;
  is_evaluation_active?: boolean;
  evaluation_status?: string;
  progress: SuratTugasProgress;
  perwadag_info: PerwardagSummary;
  file_surat_tugas_url: string;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface SuratTugasCreateResponse {
  success: boolean;
  message: string;
  surat_tugas: SuratTugasResponse;
  auto_generated_records: Record<string, string>;
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
    role: "ADMIN" | "INSPEKTORAT" | "PIMPINAN" | "PERWADAG";
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

// Additional Types from Backend Schema

export interface EvaluasiProgress extends SuratTugasProgress {
  completed_count: number;
  total_stages: number;
  get_next_stage(): string | null;
}

export interface SuratTugasOverview {
  surat_tugas: SuratTugasResponse;
  surat_pemberitahuan?: Record<string, any>;
  meetings: Record<string, any>[];
  matriks?: Record<string, any>;
  laporan_hasil?: Record<string, any>;
  kuisioner?: Record<string, any>;
}

// Statistics Types
export interface SuratTugasStats {
  total_surat_tugas: number;
  total_by_tahun: Record<number, number>;
  total_by_inspektorat: Record<string, number>;
  completed_evaluations: number;
  in_progress_evaluations: number;
  upcoming_evaluations: number;
  completion_rate: number; // 0-100 percentage
}

// Bulk Operations
export interface BulkDeleteRequest {
  surat_tugas_ids: string[];
  force_delete?: boolean;
}

export interface BulkDeleteResponse {
  success: boolean;
  message: string;
  deleted_count: number;
  failed_count: number;
  failed_ids: string[];
  details: Array<Record<string, string>>;
}

// Dashboard Types Enhancement
export interface DashboardStatistics {
  total_perwadag?: number;
  average_progress: number;
  year_filter_applied: boolean;
  filtered_year?: number;
}

export interface RelationshipCompletionStats {
  surat_pemberitahuan: CompletionStat;
  entry_meeting: CompletionStat;
  konfirmasi_meeting: CompletionStat;
  exit_meeting: CompletionStat;
  matriks: CompletionStat;
  laporan_hasil: CompletionStat;
  kuisioner: CompletionStat;
}

export interface RelationshipSummary {
  most_completed?: string;
  least_completed?: string;
  total_relationships: number;
  fully_completed_relationships: number;
}

export interface RecentSuratTugasItem extends SuratTugasResponse {
  progress_percentage: number;
}

export interface DashboardSummaryData {
  statistics: DashboardStatistics;
  completion_stats: RelationshipCompletionStats;
  recent_surat_tugas: RecentSuratTugasItem[];
  summary_by_relationship: RelationshipSummary;
}

export interface UserInfo {
  nama: string;
  role: string;
  inspektorat?: string;
}

export interface QuickActions {
  can_create_surat_tugas: boolean;
  can_manage_templates: boolean;
  total_evaluasi?: number;
}

// Updated Dashboard Summary Response
export interface DashboardSummaryResponse {
  user_info: UserInfo;
  year_filter?: number;
  summary: DashboardSummaryData;
  quick_actions: QuickActions;
}

// Progress Response
export interface SuratTugasProgressResponse {
  surat_tugas_id: string;
  progress: EvaluasiProgress;
  last_updated: string;
  next_stage?: string;
}