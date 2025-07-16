import { BaseService } from "../base";
import {
  MatriksUpdate,
  MatriksResponse,
  MatriksListResponse,
  MatriksFilterParams,
  MatriksFileUploadResponse,
} from "./types";

class MatriksService extends BaseService {
  constructor() {
    super("/matriks");
  }

  // Get all matriks with filters
  async getMatriksList(
    params?: MatriksFilterParams
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
    return this.get(endpoint);
  }

  // Get matriks by ID
  async getMatriksById(
    matriksId: string
  ): Promise<MatriksResponse> {
    return this.get(`/${matriksId}`);
  }

  // Get matriks by surat tugas ID
  async getMatriksBySuratTugasId(
    suratTugasId: string
  ): Promise<MatriksResponse> {
    return this.get(`/surat-tugas/${suratTugasId}`);
  }

  // Update matriks
  async updateMatriks(
    matriksId: string,
    data: MatriksUpdate
  ): Promise<MatriksResponse> {
    return this.put(`/${matriksId}`, data);
  }

  // Upload file for matriks
  async uploadFile(
    matriksId: string,
    file: File
  ): Promise<MatriksFileUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    return this.post(`/${matriksId}/upload-file`, formData);
  }

  // Download matriks file
  async downloadFile(
    matriksId: string
  ): Promise<Blob> {
    return this.get(`/${matriksId}/download`);
  }

  // View matriks file in browser
  async viewFile(
    matriksId: string
  ): Promise<Blob> {
    return this.get(`/${matriksId}/view`);
  }
}

export const matriksService = new MatriksService();