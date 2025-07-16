import { BaseService } from "../base";
import {
  SuratPemberitahuanUpdate,
  SuratPemberitahuanResponse,
  SuratPemberitahuanListResponse,
  SuratPemberitahuanFilterParams,
  SuratPemberitahuanFileUploadResponse,
  SuratPemberitahuanServiceOptions,
} from "./types";

class SuratPemberitahuanService extends BaseService {
  constructor() {
    super("/surat-pemberitahuan");
  }

  // Get all surat pemberitahuan with filters
  async getSuratPemberitahuanList(
    params?: SuratPemberitahuanFilterParams,
    options?: SuratPemberitahuanServiceOptions
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
    return this.get(
      endpoint,
      undefined,
      {
        title: "Error",
        description: "Failed to fetch surat pemberitahuan list",
      },
      options
    );
  }

  // Get surat pemberitahuan by ID
  async getSuratPemberitahuanById(
    suratPemberitahuanId: string,
    options?: SuratPemberitahuanServiceOptions
  ): Promise<SuratPemberitahuanResponse> {
    return this.get(
      `/${suratPemberitahuanId}`,
      undefined,
      {
        title: "Error",
        description: "Failed to get surat pemberitahuan details",
      },
      options
    );
  }

  // Get surat pemberitahuan by surat tugas ID
  async getSuratPemberitahuanBySuratTugasId(
    suratTugasId: string,
    options?: SuratPemberitahuanServiceOptions
  ): Promise<SuratPemberitahuanResponse> {
    return this.get(
      `/surat-tugas/${suratTugasId}`,
      undefined,
      {
        title: "Error",
        description: "Failed to get surat pemberitahuan by surat tugas",
      },
      options
    );
  }

  // Update surat pemberitahuan
  async updateSuratPemberitahuan(
    suratPemberitahuanId: string,
    data: SuratPemberitahuanUpdate,
    options?: SuratPemberitahuanServiceOptions
  ): Promise<SuratPemberitahuanResponse> {
    return this.put(
      `/${suratPemberitahuanId}`,
      data,
      {
        title: "Success",
        description: "Surat pemberitahuan updated successfully",
      },
      {
        title: "Update Failed",
        description: "Failed to update surat pemberitahuan",
      },
      options
    );
  }

  // Upload file for surat pemberitahuan
  async uploadFile(
    suratPemberitahuanId: string,
    file: File,
    options?: SuratPemberitahuanServiceOptions
  ): Promise<SuratPemberitahuanFileUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    return this.post(
      `/${suratPemberitahuanId}/upload-file`,
      formData,
      {
        title: "Success",
        description: "Surat pemberitahuan file uploaded successfully",
      },
      {
        title: "Upload Failed",
        description: "Failed to upload surat pemberitahuan file",
      },
      options
    );
  }

  // Download surat pemberitahuan file
  async downloadFile(
    suratPemberitahuanId: string,
    options?: SuratPemberitahuanServiceOptions
  ): Promise<Blob> {
    return this.get(
      `/${suratPemberitahuanId}/download`,
      undefined,
      {
        title: "Error",
        description: "Failed to download surat pemberitahuan file",
      },
      options
    );
  }

  // View surat pemberitahuan file in browser
  async viewFile(
    suratPemberitahuanId: string,
    options?: SuratPemberitahuanServiceOptions
  ): Promise<Blob> {
    return this.get(
      `/${suratPemberitahuanId}/view`,
      undefined,
      {
        title: "Error",
        description: "Failed to view surat pemberitahuan file",
      },
      options
    );
  }
}

export const suratPemberitahuanService = new SuratPemberitahuanService();