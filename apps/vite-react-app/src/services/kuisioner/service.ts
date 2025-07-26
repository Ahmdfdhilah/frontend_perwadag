import { BaseService } from "../base";
import {
  KuisionerUpdate,
  KuisionerResponse,
  KuisionerListResponse,
  KuisionerFilterParams,
  KuisionerFileUploadResponse,
} from "./types";

class KuisionerService extends BaseService {
  constructor() {
    super("/evaluasi/kuisioner");
  }

  // Get all kuisioner with filters
  async getKuisionerList(
    params?: KuisionerFilterParams
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
    return this.get(endpoint);
  }

  // Get kuisioner by ID
  async getKuisionerById(
    kuisionerId: string
  ): Promise<KuisionerResponse> {
    return this.get(`/${kuisionerId}`);
  }

  // Get kuisioner by surat tugas ID
  async getKuisionerBySuratTugasId(
    suratTugasId: string
  ): Promise<KuisionerResponse> {
    return this.get(`/surat-tugas/${suratTugasId}`);
  }

  // Update kuisioner
  async updateKuisioner(
    kuisionerId: string,
    data: KuisionerUpdate
  ): Promise<KuisionerResponse> {
    return this.put(`/${kuisionerId}`, data);
  }

  // Upload file for kuisioner
  async uploadFile(
    kuisionerId: string,
    file: File
  ): Promise<KuisionerFileUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    return this.post(`/${kuisionerId}/upload-file`, formData);
  }

  // Download kuisioner file
  async downloadFile(
    kuisionerId: string
  ): Promise<Blob> {
    return this.get(`/${kuisionerId}/download`);
  }

  // View kuisioner file in browser
  async viewFile(
    kuisionerId: string
  ): Promise<Blob> {
    return this.get(`/${kuisionerId}/view`);
  }

  // Delete kuisioner file by filename
  async deleteFile(
    kuisionerId: string,
    filename: string
  ): Promise<{ success: boolean; message: string; deleted_file?: string }> {
    return this.delete(`/${kuisionerId}/files/${encodeURIComponent(filename)}`);
  }
}

export const kuisionerService = new KuisionerService();