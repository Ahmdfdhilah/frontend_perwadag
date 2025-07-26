// apps/vite-react-app/src/services/penilaianRisiko/types.ts

import { PaginatedResponse } from "../base/types";

// 8 Kriteria Data Types
export interface TrenCapaianData {
  tahun_pembanding_1: number;
  capaian_tahun_1?: number;
  tahun_pembanding_2: number;
  capaian_tahun_2?: number;
  tren?: number | null;
  pilihan?: string | null;
  nilai?: number | null;
}

export interface RealisasiAnggaranData {
  tahun_pembanding: number;
  realisasi?: number;
  pagu?: number;
  persentase?: number | null;
  pilihan?: string | null;
  nilai?: number | null;
}

export interface TrenEksporData {
  tahun_pembanding: number;
  deskripsi?: number;
  pilihan?: string;
  nilai?: number;
}

export interface AuditItjenData {
  tahun_pembanding: number;
  deskripsi?: string;
  pilihan?: string;
  nilai?: number;
}

export interface PerjanjianPerdaganganData {
  tahun_pembanding: number;
  deskripsi?: string;
  pilihan?: string;
  nilai?: number;
}

export interface PeringkatEksporData {
  tahun_pembanding: number;
  deskripsi?: number;
  pilihan?: string;
  nilai?: number;
}

export interface PersentaseIkData {
  tahun_pembanding: number;
  ik_tidak_tercapai?: number;
  total_ik?: number;
  persentase?: number | null;
  pilihan?: string | null;
  nilai?: number | null;
}

export interface RealisasiTeiData {
  tahun_pembanding: number;
  nilai_realisasi?: number;
  nilai_potensi?: number;
  deskripsi?: number | null;
  pilihan?: string | null;
  nilai?: number | null;
}

export interface KriteriaData {
  tren_capaian: TrenCapaianData;
  realisasi_anggaran: RealisasiAnggaranData;
  tren_ekspor: TrenEksporData;
  audit_itjen: AuditItjenData;
  perjanjian_perdagangan: PerjanjianPerdaganganData;
  peringkat_ekspor: PeringkatEksporData;
  persentase_ik: PersentaseIkData;
  realisasi_tei: RealisasiTeiData;
}

// Penilaian Risiko Types
export interface PerwadagInfo {
  id: string;
  nama: string;
  inspektorat: string;
  email?: string;
}

export interface PeriodeInfo {
  id: string;
  tahun: number;
  status: string;
  is_locked: boolean;
  is_editable: boolean;
}

export interface CalculationDetails {
  formula_used: string;
  individual_scores: Record<string, number>;
  weighted_total: number;
  risk_category: string;
}

export interface PenilaianRisiko {
  id: string;
  user_perwadag_id: string;
  periode_id: string;
  tahun: number;
  inspektorat: string;
  total_nilai_risiko?: number;
  skor_rata_rata?: number;
  profil_risiko_auditan?: string;
  catatan?: string;
  kriteria_data: KriteriaData;
  is_calculation_complete: boolean;
  has_calculation_result: boolean;
  completion_percentage: number; // 0-100
  profil_risiko_color: string;
  perwadag_info: PerwadagInfo;
  periode_info: PeriodeInfo;
  nama_perwadag: string;
  periode_tahun: number;
  periode_status: string;
  calculation_performed: boolean;
  calculation_details: CalculationDetails;
  created_at: string; // datetime
  updated_at?: string; // datetime
  created_by?: string;
  updated_by?: string;
}

// Request Types
export interface PenilaianRisikoUpdate {
  kriteria_data: Partial<KriteriaData>;
  catatan?: string; // max 1000 chars
  auto_calculate?: boolean; // default: true
}

// Response Types
export interface PenilaianRisikoResponse extends PenilaianRisiko {}

export interface PenilaianRisikoListResponse extends PaginatedResponse<PenilaianRisiko> {}

export interface PeriodeSummaryStatistics {
  periode_info: PeriodeInfo;
  total_penilaian: number;
  completed_penilaian: number;
  completion_rate: number;
  by_inspektorat: Record<string, {
    total: number;
    completed: number;
    completion_rate: number;
  }>;
  by_profil_risiko: Record<string, number>;
  average_skor: number;
  top_performers: Array<{
    nama_perwadag: string;
    inspektorat: string;
    skor_rata_rata: number;
    profil_risiko: string;
  }>;
  bottom_performers: Array<{
    nama_perwadag: string;
    inspektorat: string;
    skor_rata_rata: number;
    profil_risiko: string;
  }>;
  risk_distribution: {
    rendah: number;
    sedang: number;
    tinggi: number;
  };
}

// Filter Types
export interface PenilaianRisikoFilterParams {
  page?: number; // default: 1
  size?: number; // default: 10
  search?: string; // Search in nama perwadag, inspektorat
  periode_id?: string;
  user_perwadag_id?: string;
  inspektorat?: string;
  tahun?: number;
  is_complete?: boolean; // Filter complete data
  sort_by?: "skor_tertinggi" | "skor_terendah" | "nama" | "created_at";
}

// Response wrapper for single operations
export interface MessageResponse {
  message: string;
}

// Choice/Option Types for Form Dropdowns
export interface ChoiceOption {
  value: string;
  label: string;
  score: number;
}

export interface RiskAssessmentChoices {
  trend_choices: ChoiceOption[];
  budget_choices: ChoiceOption[];
  export_trend_choices: ChoiceOption[];
  audit_choices: ChoiceOption[];
  trade_agreement_choices: ChoiceOption[];
  export_ranking_choices: ChoiceOption[];
  ik_choices: ChoiceOption[];
  tei_choices: ChoiceOption[];
}