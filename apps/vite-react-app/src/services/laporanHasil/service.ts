import { BaseService } from "../base";
import {
  LaporanHasilUpdate,
  LaporanHasilResponse,
  LaporanHasilListResponse,
  LaporanHasilFilterParams,
  LaporanHasilFileUploadResponse,
} from "./types";

class LaporanHasilService extends BaseService {
  constructor() {
    super("/laporan-hasil");
  }

  // Get all laporan hasil with filters
  async getLaporanHasilList(
    params?: LaporanHasilFilterParams
  ): Promise<LaporanHasilListResponse> {
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

  // Get laporan hasil by ID
  async getLaporanHasilById(
    laporanHasilId: string
  ): Promise<LaporanHasilResponse> {
    return this.get(`/${laporanHasilId}`);
  }

  // Get laporan hasil by surat tugas ID
  async getLaporanHasilBySuratTugasId(
    suratTugasId: string
  ): Promise<LaporanHasilResponse> {
    return this.get(`/surat-tugas/${suratTugasId}`);
  }

  // Update laporan hasil
  async updateLaporanHasil(
    laporanHasilId: string,
    data: LaporanHasilUpdate
  ): Promise<LaporanHasilResponse> {
    return this.put(`/${laporanHasilId}`, data);
  }

  // Upload file for laporan hasil
  async uploadFile(
    laporanHasilId: string,
    file: File
  ): Promise<LaporanHasilFileUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    return this.post(`/${laporanHasilId}/upload-file`, formData);
  }

  // Download laporan hasil file
  async downloadFile(
    laporanHasilId: string
  ): Promise<Blob> {
    return this.get(`/${laporanHasilId}/download`);
  }

  // View laporan hasil file in browser
  async viewFile(
    laporanHasilId: string
  ): Promise<Blob> {
    return this.get(`/${laporanHasilId}/view`);
  }
}

export const laporanHasilService = new LaporanHasilService();