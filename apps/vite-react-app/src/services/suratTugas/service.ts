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
    super("/evaluasi/surat-tugas");
  }

  // Create surat tugas
  async createSuratTugas(
    data: SuratTugasCreate & { file?: File | null }
  ): Promise<SuratTugasCreateResponse> {
    // If file is provided, send as FormData
    if (data.file) {
      const formData = new FormData();
      
      // Add all the regular fields
      formData.append("user_perwadag_id", data.user_perwadag_id);
      formData.append("tanggal_evaluasi_mulai", data.tanggal_evaluasi_mulai);
      formData.append("tanggal_evaluasi_selesai", data.tanggal_evaluasi_selesai);
      formData.append("no_surat", data.no_surat);
      
      // Add the file
      formData.append("file", data.file);
      
      return this.post("/", formData);
    } else {
      // Send as JSON without file
      const { file, ...createData } = data;
      return this.post("/", createData);
    }
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
  async getDashboardSummary(year?: number): Promise<SuratTugasDashboardSummary> {
    const queryParams = new URLSearchParams();
    if (year) {
      queryParams.append("year", year.toString());
    }
    
    const endpoint = queryParams.toString() 
      ? `/dashboard/summary?${queryParams.toString()}` 
      : "/dashboard/summary";
    
    return this.get(endpoint);
  }

  // Download surat tugas file
  async downloadFile(
    suratTugasId: string
  ): Promise<Blob> {
    return this.get(`/${suratTugasId}/download`);
  }

  // Delete surat tugas file by filename
  async deleteFile(
    suratTugasId: string,
    filename: string
  ): Promise<{ success: boolean; message: string; deleted_file?: string }> {
    return this.delete(`/${suratTugasId}/files/${encodeURIComponent(filename)}`);
  }
}

export const suratTugasService = new SuratTugasService();