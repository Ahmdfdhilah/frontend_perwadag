import { BaseService } from "../base";
import {
  FormatKuisionerCreate,
  FormatKuisionerUpdate,
  FormatKuisionerResponse,
  FormatKuisionerListResponse,
  FormatKuisionerFilterParams,
  FormatKuisionerFileUploadResponse,
  FormatKuisionerByYearResponse,
  FormatKuisionerStatisticsResponse,
  MessageResponse,
} from "./types";

class FormatKuisionerService extends BaseService {
  constructor() {
    super("/evaluasi/format-kuisioner");
  }

  // Create format kuisioner template
  async createFormatKuisioner(
    data: FormatKuisionerCreate,
    file?: File
  ): Promise<FormatKuisionerResponse> {
    const formData = new FormData();
    formData.append("nama_template", data.nama_template);
    formData.append("tahun", data.tahun.toString());
    if (data.deskripsi) {
      formData.append("deskripsi", data.deskripsi);
    }
    if (file) {
      formData.append("file", file);
    }

    return this.post("/", formData);
  }

  // Get all format kuisioner with filters
  async getFormatKuisionerList(
    params?: FormatKuisionerFilterParams
  ): Promise<FormatKuisionerListResponse> {
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

  // Get format kuisioner by year
  async getFormatKuisionerByYear(
    tahun: number
  ): Promise<FormatKuisionerByYearResponse> {
    return this.get(`/tahun/${tahun}`);
  }

  // Get format kuisioner by ID
  async getFormatKuisionerById(
    formatKuisionerId: string
  ): Promise<FormatKuisionerResponse> {
    return this.get(`/${formatKuisionerId}`);
  }

  // Update format kuisioner
  async updateFormatKuisioner(
    formatKuisionerId: string,
    data: FormatKuisionerUpdate
  ): Promise<FormatKuisionerResponse> {
    return this.put(`/${formatKuisionerId}`, data);
  }

  // Upload template file
  async uploadFile(
    formatKuisionerId: string,
    file: File
  ): Promise<FormatKuisionerFileUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    return this.post(`/${formatKuisionerId}/upload-file`, formData);
  }

  // Delete format kuisioner
  async deleteFormatKuisioner(
    formatKuisionerId: string
  ): Promise<MessageResponse> {
    return this.delete(`/${formatKuisionerId}`);
  }

  // Download template file
  async downloadTemplate(
    formatKuisionerId: string
  ): Promise<Blob> {
    return this.get(`/download/${formatKuisionerId}`);
  }

  // Get admin statistics
  async getAdminStatistics(): Promise<FormatKuisionerStatisticsResponse> {
    return this.get("/admin/statistics");
  }
}

export const formatKuisionerService = new FormatKuisionerService();