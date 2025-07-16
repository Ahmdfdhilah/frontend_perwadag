import { BaseService } from "../base";
import {
  SuratTugasCreate,
  SuratTugasUpdate,
  SuratTugasResponse,
  SuratTugasCreateResponse,
  SuratTugasListResponse,
  SuratTugasFilterParams,
  SuratTugasDashboardSummary,
  PerwadagListResponse,
  SuratTugasFileUploadResponse,
  SuratTugasServiceOptions,
  MessageResponse,
} from "./types";

class SuratTugasService extends BaseService {
  constructor() {
    super("/surat-tugas");
  }

  // Create surat tugas
  async createSuratTugas(
    data: SuratTugasCreate,
    options?: SuratTugasServiceOptions
  ): Promise<SuratTugasCreateResponse> {
    return this.post(
      "/",
      data,
      {
        title: "Success",
        description: "Surat tugas created successfully with auto-generated evaluation records",
      },
      {
        title: "Creation Failed",
        description: "Failed to create surat tugas",
      },
      options
    );
  }

  // Get all surat tugas with filters
  async getSuratTugasList(
    params?: SuratTugasFilterParams,
    options?: SuratTugasServiceOptions
  ): Promise<SuratTugasListResponse> {
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
        description: "Failed to fetch surat tugas list",
      },
      options
    );
  }

  // Get surat tugas by ID
  async getSuratTugasById(
    suratTugasId: string,
    options?: SuratTugasServiceOptions
  ): Promise<SuratTugasResponse> {
    return this.get(
      `/${suratTugasId}`,
      undefined,
      {
        title: "Error",
        description: "Failed to get surat tugas details",
      },
      options
    );
  }

  // Update surat tugas
  async updateSuratTugas(
    suratTugasId: string,
    data: SuratTugasUpdate,
    options?: SuratTugasServiceOptions
  ): Promise<SuratTugasResponse> {
    return this.put(
      `/${suratTugasId}`,
      data,
      {
        title: "Success",
        description: "Surat tugas updated successfully",
      },
      {
        title: "Update Failed",
        description: "Failed to update surat tugas",
      },
      options
    );
  }

  // Upload file for surat tugas
  async uploadFile(
    suratTugasId: string,
    file: File,
    options?: SuratTugasServiceOptions
  ): Promise<SuratTugasFileUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    return this.post(
      `/${suratTugasId}/upload-file`,
      formData,
      {
        title: "Success",
        description: "File uploaded successfully",
      },
      {
        title: "Upload Failed",
        description: "Failed to upload file",
      },
      options
    );
  }

  // Delete surat tugas
  async deleteSuratTugas(
    suratTugasId: string,
    options?: SuratTugasServiceOptions
  ): Promise<MessageResponse> {
    return this.delete(
      `/${suratTugasId}`,
      {
        title: "Success",
        description: "Surat tugas deleted successfully",
      },
      {
        title: "Error",
        description: "Failed to delete surat tugas",
      },
      options
    );
  }

  // Get available perwadag users list
  async getPerwadagList(
    options?: SuratTugasServiceOptions
  ): Promise<PerwadagListResponse> {
    return this.get(
      "/perwadag/list",
      undefined,
      {
        title: "Error",
        description: "Failed to fetch perwadag users list",
      },
      options
    );
  }

  // Get dashboard summary
  async getDashboardSummary(
    options?: SuratTugasServiceOptions
  ): Promise<SuratTugasDashboardSummary> {
    return this.get(
      "/dashboard/summary",
      undefined,
      {
        title: "Error",
        description: "Failed to fetch dashboard summary",
      },
      options
    );
  }
}

export const suratTugasService = new SuratTugasService();