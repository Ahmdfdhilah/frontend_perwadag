import { BaseService } from "../base";
import {
  LaporanHasilUpdate,
  LaporanHasilResponse,
  LaporanHasilListResponse,
  LaporanHasilFilterParams,
  LaporanHasilFileUploadResponse,
  LaporanHasilServiceOptions,
} from "./types";

class LaporanHasilService extends BaseService {
  constructor() {
    super("/laporan-hasil");
  }

  // Get all laporan hasil with filters
  async getLaporanHasilList(
    params?: LaporanHasilFilterParams,
    options?: LaporanHasilServiceOptions
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
    return this.get(
      endpoint,
      undefined,
      {
        title: "Error",
        description: "Failed to fetch laporan hasil list",
      },
      options
    );
  }

  // Get laporan hasil by ID
  async getLaporanHasilById(
    laporanHasilId: string,
    options?: LaporanHasilServiceOptions
  ): Promise<LaporanHasilResponse> {
    return this.get(
      `/${laporanHasilId}`,
      undefined,
      {
        title: "Error",
        description: "Failed to get laporan hasil details",
      },
      options
    );
  }

  // Get laporan hasil by surat tugas ID
  async getLaporanHasilBySuratTugasId(
    suratTugasId: string,
    options?: LaporanHasilServiceOptions
  ): Promise<LaporanHasilResponse> {
    return this.get(
      `/surat-tugas/${suratTugasId}`,
      undefined,
      {
        title: "Error",
        description: "Failed to get laporan hasil by surat tugas",
      },
      options
    );
  }

  // Update laporan hasil
  async updateLaporanHasil(
    laporanHasilId: string,
    data: LaporanHasilUpdate,
    options?: LaporanHasilServiceOptions
  ): Promise<LaporanHasilResponse> {
    return this.put(
      `/${laporanHasilId}`,
      data,
      {
        title: "Success",
        description: "Laporan hasil updated successfully",
      },
      {
        title: "Update Failed",
        description: "Failed to update laporan hasil",
      },
      options
    );
  }

  // Upload file for laporan hasil
  async uploadFile(
    laporanHasilId: string,
    file: File,
    options?: LaporanHasilServiceOptions
  ): Promise<LaporanHasilFileUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    return this.post(
      `/${laporanHasilId}/upload-file`,
      formData,
      {
        title: "Success",
        description: "Laporan hasil file uploaded successfully",
      },
      {
        title: "Upload Failed",
        description: "Failed to upload laporan hasil file",
      },
      options
    );
  }

  // Download laporan hasil file
  async downloadFile(
    laporanHasilId: string,
    options?: LaporanHasilServiceOptions
  ): Promise<Blob> {
    return this.get(
      `/${laporanHasilId}/download`,
      undefined,
      {
        title: "Error",
        description: "Failed to download laporan hasil file",
      },
      options
    );
  }

  // View laporan hasil file in browser
  async viewFile(
    laporanHasilId: string,
    options?: LaporanHasilServiceOptions
  ): Promise<Blob> {
    return this.get(
      `/${laporanHasilId}/view`,
      undefined,
      {
        title: "Error",
        description: "Failed to view laporan hasil file",
      },
      options
    );
  }
}

export const laporanHasilService = new LaporanHasilService();