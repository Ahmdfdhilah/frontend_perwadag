import { BaseService } from "../base";
import {
  MatriksUpdate,
  MatriksResponse,
  MatriksListResponse,
  MatriksFilterParams,
  MatriksFileUploadResponse,
  MatriksServiceOptions,
} from "./types";

class MatriksService extends BaseService {
  constructor() {
    super("/matriks");
  }

  // Get all matriks with filters
  async getMatriksList(
    params?: MatriksFilterParams,
    options?: MatriksServiceOptions
  ): Promise<MatriksListResponse> {
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
        description: "Failed to fetch matriks list",
      },
      options
    );
  }

  // Get matriks by ID
  async getMatriksById(
    matriksId: string,
    options?: MatriksServiceOptions
  ): Promise<MatriksResponse> {
    return this.get(
      `/${matriksId}`,
      undefined,
      {
        title: "Error",
        description: "Failed to get matriks details",
      },
      options
    );
  }

  // Get matriks by surat tugas ID
  async getMatriksBySuratTugasId(
    suratTugasId: string,
    options?: MatriksServiceOptions
  ): Promise<MatriksResponse> {
    return this.get(
      `/surat-tugas/${suratTugasId}`,
      undefined,
      {
        title: "Error",
        description: "Failed to get matriks by surat tugas",
      },
      options
    );
  }

  // Update matriks
  async updateMatriks(
    matriksId: string,
    data: MatriksUpdate,
    options?: MatriksServiceOptions
  ): Promise<MatriksResponse> {
    return this.put(
      `/${matriksId}`,
      data,
      {
        title: "Success",
        description: "Matriks updated successfully",
      },
      {
        title: "Update Failed",
        description: "Failed to update matriks",
      },
      options
    );
  }

  // Upload file for matriks
  async uploadFile(
    matriksId: string,
    file: File,
    options?: MatriksServiceOptions
  ): Promise<MatriksFileUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    return this.post(
      `/${matriksId}/upload-file`,
      formData,
      {
        title: "Success",
        description: "Matriks file uploaded successfully",
      },
      {
        title: "Upload Failed",
        description: "Failed to upload matriks file",
      },
      options
    );
  }

  // Download matriks file
  async downloadFile(
    matriksId: string,
    options?: MatriksServiceOptions
  ): Promise<Blob> {
    return this.get(
      `/${matriksId}/download`,
      undefined,
      {
        title: "Error",
        description: "Failed to download matriks file",
      },
      options
    );
  }

  // View matriks file in browser
  async viewFile(
    matriksId: string,
    options?: MatriksServiceOptions
  ): Promise<Blob> {
    return this.get(
      `/${matriksId}/view`,
      undefined,
      {
        title: "Error",
        description: "Failed to view matriks file",
      },
      options
    );
  }
}

export const matriksService = new MatriksService();