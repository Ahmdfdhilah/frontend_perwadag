// apps/vite-react-app/src/services/periodeEvaluasi/types.ts

import { PaginatedResponse } from "../base/types";

// Periode Evaluasi Types
export interface PeriodeEvaluasi {
  id: string;
  tahun: number;
  is_locked: boolean;
  status: "aktif" | "tutup";
  is_editable: boolean;
  status_display: string;
  lock_status_display: string;
  tahun_pembanding_1: number;
  tahun_pembanding_2: number;
  total_penilaian: number;
  penilaian_completed: number;
  completion_rate: number;
  created_at: string; // datetime
  updated_at?: string; // datetime
  created_by?: string;
  updated_by?: string;
}

// Request Types
export interface PeriodeEvaluasiCreate {
  tahun: number; // 2020-2050
  status?: "aktif" | "tutup"; // default: aktif
}

export interface PeriodeEvaluasiUpdate {
  is_locked?: boolean;
  status?: "aktif" | "tutup";
}

// Response Types
export interface PeriodeEvaluasiResponse extends PeriodeEvaluasi {}

export interface BulkGenerationSummary {
  total_perwadag: number;
  generated_penilaian: number;
  failed_generation: number;
  errors: string[];
}

export interface PeriodeEvaluasiCreateResponse {
  success: boolean;
  message: string;
  data?: any;
  periode_evaluasi: PeriodeEvaluasiResponse;
  bulk_generation_summary: BulkGenerationSummary;
}

export interface PeriodeEvaluasiListResponse extends PaginatedResponse<PeriodeEvaluasi> {}

export interface TahunAvailabilityResponse {
  tahun: number;
  is_available: boolean;
  existing_periode?: PeriodeEvaluasiResponse;
  message: string;
}

export interface PeriodeEvaluasiStatistics {
  total_periode: number;
  aktif_periode: number;
  tutup_periode: number;
  locked_periode: number;
  total_penilaian: number;
  completed_penilaian: number;
  overall_completion_rate: number;
  by_tahun: Record<string, {
    total_penilaian: number;
    completed_penilaian: number;
    completion_rate: number;
  }>;
  by_status: Record<string, number>;
  latest_periode?: PeriodeEvaluasiResponse;
}

// Filter Types
export interface PeriodeEvaluasiFilterParams {
  page?: number; // default: 1
  size?: number; // default: 10
  search?: string; // Search by tahun
  status?: "aktif" | "tutup";
  is_locked?: boolean;
  tahun_from?: number;
  tahun_to?: number;
  include_statistics?: boolean;
}

// Response wrapper for single operations
export interface MessageResponse {
  message: string;
}

export interface SuccessResponse {
  success: boolean;
  message: string;
  data?: any;
}