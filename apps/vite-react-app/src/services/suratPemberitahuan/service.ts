import { BaseService } from "../base";
import {
  SuratPemberitahuanUpdate,
  SuratPemberitahuanResponse,
  SuratPemberitahuanListResponse,
  SuratPemberitahuanFilterParams,
  SuratPemberitahuanFileUploadResponse,
} from "./types";

class SuratPemberitahuanService extends BaseService {
  constructor() {
    super("/evaluasi/surat-pemberitahuan");
  }

  // Get all surat pemberitahuan with filters
  async getSuratPemberitahuanList(
    params?: SuratPemberitahuanFilterParams
  ): Promise<SuratPemberitahuanListResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = queryParams.toString() ? `/?${queryParams.toString()}` : "/";
    return this.get(endpoint);
  }

  // Get surat pemberitahuan by ID
  async getSuratPemberitahuanById(
    suratPemberitahuanId: string
  ): Promise<SuratPemberitahuanResponse> {
    return this.get(`/${suratPemberitahuanId}`);
  }

  // Get surat pemberitahuan by surat tugas ID
  async getSuratPemberitahuanBySuratTugasId(
    suratTugasId: string
  ): Promise<SuratPemberitahuanResponse> {
    return this.get(`/surat-tugas/${suratTugasId}`);
  }

  // Update surat pemberitahuan
  async updateSuratPemberitahuan(
    suratPemberitahuanId: string,
    data: SuratPemberitahuanUpdate
  ): Promise<SuratPemberitahuanResponse> {
    return this.put(`/${suratPemberitahuanId}`, data);
  }

  // Upload file for surat pemberitahuan
  async uploadFile(
    suratPemberitahuanId: string,
    file: File
  ): Promise<SuratPemberitahuanFileUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    return this.post(`/${suratPemberitahuanId}/upload-file`, formData);
  }

  // Download surat pemberitahuan file
  async downloadFile(
    suratPemberitahuanId: string
  ): Promise<Blob> {
    return this.get(`/${suratPemberitahuanId}/download`);
  }

  // View surat pemberitahuan file in browser
  async viewFile(
    suratPemberitahuanId: string
  ): Promise<Blob> {
    return this.get(`/${suratPemberitahuanId}/view`);
  }

  // Delete surat pemberitahuan file by filename
  async deleteFile(
    suratPemberitahuanId: string,
    filename: string
  ): Promise<{ success: boolean; message: string; deleted_file?: string }> {
    return this.delete(`/${suratPemberitahuanId}/files/${encodeURIComponent(filename)}`);
  }
}

export const suratPemberitahuanService = new SuratPemberitahuanService();