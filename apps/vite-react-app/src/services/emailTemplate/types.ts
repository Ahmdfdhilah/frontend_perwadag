// apps/vite-react-app/src/services/emailTemplate/types.ts

import { PaginatedResponse } from "../base/types";

// Email Template Types
export interface EmailTemplate {
  id: string;
  name: string;
  subject_template: string;
  body_template: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  created_by?: string;
}

// Request Types
export interface EmailTemplateCreateRequest {
  name: string; // max 100 chars
  subject_template: string; // max 200 chars
  body_template: string;
}

export interface EmailTemplateUpdateRequest {
  name?: string; // max 100 chars
  subject_template?: string; // max 200 chars
  body_template?: string;
}

// Response Types
export interface EmailTemplateResponse extends EmailTemplate {}

export interface EmailTemplateListResponse extends PaginatedResponse<EmailTemplate> {}

export interface EmailComposedResponse {
  subject: string;
  body: string;
  gmail_url: string;
}

export interface EmailVariablesResponse {
  variables: Record<string, string>;
}

// Message response for delete operations
export interface MessageResponse {
  message: string;
}

// Available email variables with descriptions
export interface EmailVariableInfo {
  key: string;
  description: string;
}

export const EMAIL_VARIABLES: EmailVariableInfo[] = [
  { key: "nama_perwadag", description: "Nama perwadag yang dievaluasi" },
  { key: "inspektorat", description: "Nama inspektorat" },
  { key: "tahun_evaluasi", description: "Tahun evaluasi" },
  { key: "nomor_laporan", description: "Nomor laporan" },
  { key: "tanggal_laporan", description: "Tanggal laporan (dd/mm/yyyy)" },
  { key: "tanggal_mulai", description: "Tanggal mulai evaluasi (dd/mm/yyyy)" },
  { key: "tanggal_selesai", description: "Tanggal selesai evaluasi (dd/mm/yyyy)" },
  { key: "durasi_evaluasi", description: "Durasi evaluasi dalam hari" },
  { key: "evaluation_status", description: "Status evaluasi" },
  { key: "status_kelengkapan", description: "Status kelengkapan (Lengkap/Belum Lengkap)" },
  { key: "persentase", description: "Persentase kelengkapan" },
  { key: "file_status", description: "Status ketersediaan file" },
  { key: "file_url", description: "Link download file (jika tersedia)" },
  { key: "user_nama", description: "Nama user yang mengirim email" }
];