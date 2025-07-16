import { PaginatedResponse } from "../base/types";

// Base Types
export interface Meeting {
  id: string;
  surat_tugas_id: string;
  meeting_type: "ENTRY" | "KONFIRMASI" | "EXIT";
  tanggal_meeting?: string;
  link_zoom?: string;
  link_daftar_hadir?: string;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface MeetingFile {
  filename: string;
  original_filename: string;
  path: string;
  size: number;
  size_mb: number;
  content_type: string;
  uploaded_at: string;
  uploaded_by?: string;
  download_url: string;
  file_url?: string;
  view_url?: string;
  is_viewable: boolean;
}

export interface MeetingFilesInfo {
  files: MeetingFile[];
  total_files: number;
  total_size: number;
  total_size_mb: number;
  download_all_url: string;
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

export interface MeetingStatistics {
  total_records: number;
  completed_records: number;
  with_files: number;
  without_files: number;
  completion_rate: number;
  last_updated: string;
}

// Request Types
export interface MeetingCreate {
  surat_tugas_id: string;
  meeting_type: "ENTRY" | "KONFIRMASI" | "EXIT";
}

export interface MeetingUpdate {
  tanggal_meeting?: string;
  link_zoom?: string;
  link_daftar_hadir?: string;
}

export interface MeetingFileUploadRequest {
  replace_existing?: boolean;
}

// Response Types
export interface MeetingResponse {
  id: string;
  surat_tugas_id: string;
  meeting_type: "ENTRY" | "KONFIRMASI" | "EXIT";
  tanggal_meeting?: string;
  link_zoom?: string;
  link_daftar_hadir?: string;
  files_info: MeetingFilesInfo;
  is_completed: boolean;
  has_files: boolean;
  has_date: boolean;
  has_links: boolean;
  completion_percentage: number;
  meeting_type_display: string;
  meeting_order: number;
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

export interface MeetingListResponse extends PaginatedResponse<MeetingResponse> {
  statistics: MeetingStatistics;
}

export interface MeetingFileUploadResponse {
  success: boolean;
  message: string;
  data: any;
  meeting_id: string;
  uploaded_files: Array<{
    filename: string;
    original_filename: string;
    path: string;
    size: number;
    size_mb: number;
    content_type: string;
    uploaded_at: string;
    uploaded_by: string;
  }>;
  total_files: number;
  total_size_mb: number;
}

export interface MeetingFileDeleteResponse {
  success: boolean;
  message: string;
  data: any;
  meeting_id: string;
  deleted_file: string;
  remaining_files: number;
}

// Filter Types
export interface MeetingFilterParams {
  page?: number;
  size?: number;
  search?: string;
  meeting_type?: "ENTRY" | "KONFIRMASI" | "EXIT";
  inspektorat?: string;
  user_perwadag_id?: string;
  has_files?: boolean;
  has_date?: boolean;
  has_links?: boolean;
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