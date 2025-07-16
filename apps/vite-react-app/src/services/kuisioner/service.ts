import { BaseService } from "../base";
import {
  KuisionerUpdate,
  KuisionerResponse,
  KuisionerListResponse,
  KuisionerFilterParams,
  KuisionerFileUploadResponse,
  KuisionerServiceOptions,
} from "./types";

class KuisionerService extends BaseService {
  constructor() {
    super("/kuisioner");
  }

  // Get all kuisioner with filters
  async getKuisionerList(
    params?: KuisionerFilterParams,
    options?: KuisionerServiceOptions
  ): Promise<KuisionerListResponse> {
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
        description: "Failed to fetch kuisioner list",
      },
      options
    );
  }

  // Get kuisioner by ID
  async getKuisionerById(
    kuisionerId: string,
    options?: KuisionerServiceOptions
  ): Promise<KuisionerResponse> {
    return this.get(
      `/${kuisionerId}`,
      undefined,
      {
        title: "Error",
        description: "Failed to get kuisioner details",
      },
      options
    );
  }

  // Get kuisioner by surat tugas ID
  async getKuisionerBySuratTugasId(
    suratTugasId: string,
    options?: KuisionerServiceOptions
  ): Promise<KuisionerResponse> {
    return this.get(
      `/surat-tugas/${suratTugasId}`,
      undefined,
      {
        title: "Error",
        description: "Failed to get kuisioner by surat tugas",
      },
      options
    );
  }

  // Update kuisioner
  async updateKuisioner(
    kuisionerId: string,
    data: KuisionerUpdate,
    options?: KuisionerServiceOptions
  ): Promise<KuisionerResponse> {
    return this.put(
      `/${kuisionerId}`,
      data,
      {
        title: "Success",
        description: "Kuisioner updated successfully",
      },
      {
        title: "Update Failed",
        description: "Failed to update kuisioner",
      },
      options
    );
  }

  // Upload file for kuisioner
  async uploadFile(
    kuisionerId: string,
    file: File,
    options?: KuisionerServiceOptions
  ): Promise<KuisionerFileUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    return this.post(
      `/${kuisionerId}/upload-file`,
      formData,
      {
        title: "Success",
        description: "Kuisioner file uploaded successfully",
      },
      {
        title: "Upload Failed",
        description: "Failed to upload kuisioner file",
      },
      options
    );
  }

  // Download kuisioner file
  async downloadFile(
    kuisionerId: string,
    options?: KuisionerServiceOptions
  ): Promise<Blob> {
    return this.get(
      `/${kuisionerId}/download`,
      undefined,
      {
        title: "Error",
        description: "Failed to download kuisioner file",
      },
      options
    );
  }

  // View kuisioner file in browser
  async viewFile(
    kuisionerId: string,
    options?: KuisionerServiceOptions
  ): Promise<Blob> {
    return this.get(
      `/${kuisionerId}/view`,
      undefined,
      {
        title: "Error",
        description: "Failed to view kuisioner file",
      },
      options
    );
  }
}

export const kuisionerService = new KuisionerService();