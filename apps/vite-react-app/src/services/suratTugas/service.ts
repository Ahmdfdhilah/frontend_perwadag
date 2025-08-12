import { BaseService } from "../base";
import {
  SuratTugasCreate,
  SuratTugasUpdate,
  SuratTugasResponse,
  SuratTugasCreateResponse,
  SuratTugasListResponse,
  SuratTugasFilterParams,
  MessageResponse,
  SuratTugasStats,
  BulkDeleteRequest,
  BulkDeleteResponse,
  DashboardSummaryResponse,
  SuratTugasOverview,
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
      
      // Add assignment fields if provided
      if (data.pengedali_mutu_id) {
        formData.append("pengedali_mutu_id", data.pengedali_mutu_id);
      }
      if (data.pengendali_teknis_id) {
        formData.append("pengendali_teknis_id", data.pengendali_teknis_id);
      }
      if (data.ketua_tim_id) {
        formData.append("ketua_tim_id", data.ketua_tim_id);
      }
      if (data.anggota_tim_ids && data.anggota_tim_ids.length > 0) {
        data.anggota_tim_ids.forEach(id => {
          formData.append("anggota_tim_ids", id);
        });
      }
      
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
    data: SuratTugasUpdate & { file?: File | null }
  ): Promise<SuratTugasResponse> {
    // If file is provided, send as FormData
    if (data.file) {
      const formData = new FormData();
      
      // Add all the regular fields
      if (data.tanggal_evaluasi_mulai) {
        formData.append("tanggal_evaluasi_mulai", data.tanggal_evaluasi_mulai);
      }
      if (data.tanggal_evaluasi_selesai) {
        formData.append("tanggal_evaluasi_selesai", data.tanggal_evaluasi_selesai);
      }
      if (data.no_surat) {
        formData.append("no_surat", data.no_surat);
      }
      
      // Add assignment fields if provided
      if (data.pengedali_mutu_id) {
        formData.append("pengedali_mutu_id", data.pengedali_mutu_id);
      }
      if (data.pengendali_teknis_id) {
        formData.append("pengendali_teknis_id", data.pengendali_teknis_id);
      }
      if (data.ketua_tim_id) {
        formData.append("ketua_tim_id", data.ketua_tim_id);
      }
      if (data.anggota_tim_ids && data.anggota_tim_ids.length > 0) {
        data.anggota_tim_ids.forEach(id => {
          formData.append("anggota_tim_ids", id);
        });
      }
      
      // Add the file
      formData.append("file", data.file);
      
      return this.put(`/${suratTugasId}`, formData);
    } else {
      // Send as JSON without file
      const { file, ...updateData } = data;
      
      // Filter out only undefined and null values, keep arrays as arrays
      const cleanData = Object.entries(updateData).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = value;
        }
        return acc;
      }, {} as any);
      return this.put(`/${suratTugasId}`, cleanData);
    }
  }

  // Upload file for surat tugas  
  async uploadFile(
    suratTugasId: string,
    file: File
  ): Promise<{ success: boolean; message: string; file_path: string; file_url: string; surat_tugas_id: string }> {
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
  async getPerwadagList(): Promise<{
    available_perwadag: Array<{
      id: string;
      nama: string;
      inspektorat: string;
      email?: string;
      has_email: boolean;
    }>;
    total: number;
  }> {
    return this.get("/perwadag/list");
  }

  // Get dashboard summary
  async getDashboardSummary(year?: number): Promise<DashboardSummaryResponse> {
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
    return this.get(`/${suratTugasId}/download`, { responseType: 'blob' });
  }

  // Delete surat tugas file by filename
  async deleteFile(
    suratTugasId: string,
    filename: string
  ): Promise<{ success: boolean; message: string; deleted_file?: string }> {
    return this.delete(`/${suratTugasId}/files/${encodeURIComponent(filename)}`);
  }

  // Get surat tugas statistics (commented in backend, but keeping for future)
  async getStatistics(): Promise<SuratTugasStats> {
    return this.get("/statistics/overview");
  }

  // Get surat tugas overview with all related data (commented in backend)
  async getOverview(suratTugasId: string): Promise<SuratTugasOverview> {
    return this.get(`/${suratTugasId}/overview`);
  }

  // Check nomor surat availability (commented in backend)
  async checkNoSuratAvailability(
    noSurat: string, 
    excludeId?: string
  ): Promise<{ no_surat: string; available: boolean; message: string }> {
    const params = new URLSearchParams({ no_surat: noSurat });
    if (excludeId) {
      params.append("exclude_id", excludeId);
    }
    return this.get(`/check/no-surat-availability?${params.toString()}`);
  }

  // Bulk operations (commented in backend)
  async bulkDelete(request: BulkDeleteRequest): Promise<BulkDeleteResponse> {
    return this.post("/bulk/delete", request);
  }

  async bulkCheckProgress(suratTugasIds: string[]): Promise<{
    progress_data: Array<any>;
    total_checked: number;
    successful: number;
  }> {
    return this.post("/bulk/progress-check", suratTugasIds);
  }
}

export const suratTugasService = new SuratTugasService();