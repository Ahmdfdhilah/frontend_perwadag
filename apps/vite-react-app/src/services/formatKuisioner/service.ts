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
  FormatKuisionerServiceOptions,
  MessageResponse,
} from "./types";

class FormatKuisionerService extends BaseService {
  constructor() {
    super("/format-kuisioner");
  }

  // Create format kuisioner template
  async createFormatKuisioner(
    data: FormatKuisionerCreate,
    file?: File,
    options?: FormatKuisionerServiceOptions
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

    return this.post(
      "/",
      formData,
      {
        title: "Success",
        description: "Format kuisioner template created successfully",
      },
      {
        title: "Creation Failed",
        description: "Failed to create format kuisioner template",
      },
      options
    );
  }

  // Get all format kuisioner with filters
  async getFormatKuisionerList(
    params?: FormatKuisionerFilterParams,
    options?: FormatKuisionerServiceOptions
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
    return this.get(
      endpoint,
      undefined,
      {
        title: "Error",
        description: "Failed to fetch format kuisioner list",
      },
      options
    );
  }

  // Get format kuisioner by year
  async getFormatKuisionerByYear(
    tahun: number,
    options?: FormatKuisionerServiceOptions
  ): Promise<FormatKuisionerByYearResponse> {
    return this.get(
      `/tahun/${tahun}`,
      undefined,
      {
        title: "Error",
        description: "Failed to get format kuisioner by year",
      },
      options
    );
  }

  // Get format kuisioner by ID
  async getFormatKuisionerById(
    formatKuisionerId: string,
    options?: FormatKuisionerServiceOptions
  ): Promise<FormatKuisionerResponse> {
    return this.get(
      `/${formatKuisionerId}`,
      undefined,
      {
        title: "Error",
        description: "Failed to get format kuisioner details",
      },
      options
    );
  }

  // Update format kuisioner
  async updateFormatKuisioner(
    formatKuisionerId: string,
    data: FormatKuisionerUpdate,
    options?: FormatKuisionerServiceOptions
  ): Promise<FormatKuisionerResponse> {
    return this.put(
      `/${formatKuisionerId}`,
      data,
      {
        title: "Success",
        description: "Format kuisioner updated successfully",
      },
      {
        title: "Update Failed",
        description: "Failed to update format kuisioner",
      },
      options
    );
  }

  // Upload template file
  async uploadFile(
    formatKuisionerId: string,
    file: File,
    options?: FormatKuisionerServiceOptions
  ): Promise<FormatKuisionerFileUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    return this.post(
      `/${formatKuisionerId}/upload-file`,
      formData,
      {
        title: "Success",
        description: "Template file uploaded successfully",
      },
      {
        title: "Upload Failed",
        description: "Failed to upload template file",
      },
      options
    );
  }

  // Delete format kuisioner
  async deleteFormatKuisioner(
    formatKuisionerId: string,
    options?: FormatKuisionerServiceOptions
  ): Promise<MessageResponse> {
    return this.delete(
      `/${formatKuisionerId}`,
      {
        title: "Success",
        description: "Format kuisioner deleted successfully",
      },
      {
        title: "Error",
        description: "Failed to delete format kuisioner",
      },
      options
    );
  }

  // Download template file
  async downloadTemplate(
    formatKuisionerId: string,
    options?: FormatKuisionerServiceOptions
  ): Promise<Blob> {
    return this.get(
      `/download/${formatKuisionerId}`,
      undefined,
      {
        title: "Error",
        description: "Failed to download template file",
      },
      options
    );
  }

  // Get admin statistics
  async getAdminStatistics(
    options?: FormatKuisionerServiceOptions
  ): Promise<FormatKuisionerStatisticsResponse> {
    return this.get(
      "/admin/statistics",
      undefined,
      {
        title: "Error",
        description: "Failed to fetch template statistics",
      },
      options
    );
  }
}

export const formatKuisionerService = new FormatKuisionerService();