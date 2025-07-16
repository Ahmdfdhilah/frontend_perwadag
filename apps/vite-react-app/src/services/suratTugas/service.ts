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
  MessageResponse,
} from "./types";

class SuratTugasService extends BaseService {
  constructor() {
    super("/surat-tugas");
  }

  // Create surat tugas
  async createSuratTugas(
    data: SuratTugasCreate
  ): Promise<SuratTugasCreateResponse> {
    return this.post("/", data);
  }

  // Get all surat tugas with filters
  async getSuratTugasList(
    params?: SuratTugasFilterParams
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
    return this.get(endpoint);
  }

  // Get surat tugas by ID
  async getSuratTugasById(
    suratTugasId: string
  ): Promise<SuratTugasResponse> {
    return this.get(`/${suratTugasId}`);
  }

  // Update surat tugas
  async updateSuratTugas(
    suratTugasId: string,
    data: SuratTugasUpdate
  ): Promise<SuratTugasResponse> {
    return this.put(`/${suratTugasId}`, data);
  }

  // Upload file for surat tugas
  async uploadFile(
    suratTugasId: string,
    file: File
  ): Promise<SuratTugasFileUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    return this.post(`/${suratTugasId}/upload-file`, formData);
  }

  // Delete surat tugas
  async deleteSuratTugas(
    suratTugasId: string
  ): Promise<MessageResponse> {
    return this.delete(`/${suratTugasId}`);
  }

  // Get available perwadag users list
  async getPerwadagList(): Promise<PerwadagListResponse> {
    return this.get("/perwadag/list");
  }

  // Get dashboard summary
  async getDashboardSummary(): Promise<SuratTugasDashboardSummary> {
    return this.get("/dashboard/summary");
  }
}

export const suratTugasService = new SuratTugasService();