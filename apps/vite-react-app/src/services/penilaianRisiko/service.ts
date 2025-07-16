// apps/vite-react-app/src/services/penilaianRisiko/service.ts

import { BaseService } from "../base";
import {
  PenilaianRisikoUpdate,
  PenilaianRisikoResponse,
  PenilaianRisikoListResponse,
  PenilaianRisikoFilterParams,
  PeriodeSummaryStatistics,
} from "./types";

class PenilaianRisikoService extends BaseService {
  constructor() {
    super("/penilaian-risiko");
  }

  // Get all penilaian risiko dengan filtering dan sorting
  async getPenilaianRisiko(
    params?: PenilaianRisikoFilterParams
  ): Promise<PenilaianRisikoListResponse> {
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

  // Get penilaian risiko by ID
  async getPenilaianRisikoById(
    penilaianId: string
  ): Promise<PenilaianRisikoResponse> {
    return this.get(`/${penilaianId}`);
  }

  // Update penilaian risiko dengan auto-calculate
  async updatePenilaianRisiko(
    penilaianId: string,
    updateData: PenilaianRisikoUpdate
  ): Promise<PenilaianRisikoResponse> {
    return this.put(`/${penilaianId}`, updateData);
  }

  // Get periode summary statistics
  async getPeriodeSummary(
    periodeId: string
  ): Promise<PeriodeSummaryStatistics> {
    return this.get(`/periode/${periodeId}/summary`);
  }
}

export const penilaianRisikoService = new PenilaianRisikoService();