// apps/vite-react-app/src/services/periodeEvaluasi/service.ts

import { BaseService } from "../base";
import {
  PeriodeEvaluasiCreate,
  PeriodeEvaluasiUpdate,
  PeriodeEvaluasiResponse,
  PeriodeEvaluasiCreateResponse,
  PeriodeEvaluasiListResponse,
  PeriodeEvaluasiFilterParams,
  TahunAvailabilityResponse,
  PeriodeEvaluasiStatistics,
  SuccessResponse,
} from "./types";

class PeriodeEvaluasiService extends BaseService {
  constructor() {
    super("/periode-evaluasi");
  }

  // Create periode evaluasi with auto bulk generate
  async createPeriodeEvaluasi(
    periodeData: PeriodeEvaluasiCreate
  ): Promise<PeriodeEvaluasiCreateResponse> {
    return this.post("/", periodeData);
  }

  // Get all periode evaluasi with filtering
  async getPeriodeEvaluasi(
    params?: PeriodeEvaluasiFilterParams
): Promise<PeriodeEvaluasiListResponse> {
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

  // Get periode evaluasi by ID
  async getPeriodeEvaluasiById(
    periodeId: string
  ): Promise<PeriodeEvaluasiResponse> {
    return this.get(`/${periodeId}`);
  }

  // Update periode evaluasi (lock/unlock)
  async updatePeriodeEvaluasi(
    periodeId: string,
    updateData: PeriodeEvaluasiUpdate
  ): Promise<PeriodeEvaluasiResponse> {
    return this.put(`/${periodeId}`, updateData);
  }

  // Delete periode evaluasi with cascade
  async deletePeriodeEvaluasi(
    periodeId: string
  ): Promise<SuccessResponse> {
    return this.delete(`/${periodeId}`);
  }

  // Check ketersediaan tahun
  async checkTahunAvailability(
    tahun: number
  ): Promise<TahunAvailabilityResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("tahun", tahun.toString());
    
    return this.get(`/check/tahun-availability?${queryParams.toString()}`);
  }

  // Get comprehensive statistics
  async getStatisticsOverview(): Promise<PeriodeEvaluasiStatistics> {
    return this.get("/statistics/overview");
  }
}

export const periodeEvaluasiService = new PeriodeEvaluasiService();