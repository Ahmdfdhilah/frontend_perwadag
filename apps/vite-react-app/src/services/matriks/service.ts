import { BaseService } from "../base";
import {
  MatriksUpdate,
  MatriksResponse,
  MatriksListResponse,
  MatriksFilterParams,
  MatriksFileUploadResponse,
  MatriksStatusUpdate,
  TindakLanjutUpdate,
  TindakLanjutStatusUpdate,
} from "./types";

class MatriksService extends BaseService {
  constructor() {
    super("/evaluasi/matriks");
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

  // Delete matriks file by filename
  async deleteFile(
    matriksId: string,
    filename: string
  ): Promise<{ success: boolean; message: string; deleted_file?: string }> {
    return this.delete(`/${matriksId}/files/${encodeURIComponent(filename)}`);
  }

  // Update matriks status
  async updateMatriksStatus(
    matriksId: string,
    data: MatriksStatusUpdate
  ): Promise<MatriksResponse> {
    return this.put(`/${matriksId}/status`, data);
  }

  // Update tindak lanjut content
  async updateTindakLanjut(
    matriksId: string,
    itemId: number,
    data: TindakLanjutUpdate
  ): Promise<MatriksResponse> {
    return this.put(`/${matriksId}/tindak-lanjut/${itemId}`, data);
  }

  // Update tindak lanjut status (global)
  async updateTindakLanjutStatus(
    matriksId: string,
    data: TindakLanjutStatusUpdate
  ): Promise<MatriksResponse> {
    return this.put(`/${matriksId}/tindak-lanjut/status`, data);
  }

  // Generate PDF matriks evaluasi
  async generatePdf(
    matriksId: string
  ): Promise<Blob> {
    return this.get(`/${matriksId}/pdf`, {
      responseType: 'blob'
    });
  }
}

export const matriksService = new MatriksService();