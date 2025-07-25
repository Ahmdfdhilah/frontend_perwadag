// apps/vite-react-app/src/services/log-activity/service.ts
import { BaseService } from "../base";
import {
  LogActivityResponse,
  LogActivityListResponse,
  LogActivityFilterParams,
  LogActivityStatistics,
  CleanupResponse,
} from "./types";

class LogActivityService extends BaseService {
  constructor() {
    super("/log-activity");
  }

  async getAllLogActivities(
    filters?: LogActivityFilterParams
  ): Promise<LogActivityListResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.size) params.append("size", filters.size.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.date_from) params.append("date_from", filters.date_from);
      if (filters.date_to) params.append("date_to", filters.date_to);
      if (filters.method) params.append("method", filters.method);
      if (filters.user_id) params.append("user_id", filters.user_id);
      if (filters.success_only !== undefined) {
        params.append("success_only", filters.success_only.toString());
      }
    }

    const queryString = params.toString();
    const url = queryString ? `/?${queryString}` : "/";
    
    return this.get(url);
  }

  async getLogActivity(logId: string): Promise<LogActivityResponse> {
    return this.get(`/${logId}`);
  }

  async getStatistics(): Promise<LogActivityStatistics> {
    return this.get("/statistics/overview");
  }

  async cleanupOldLogs(daysToKeep: number = 90): Promise<CleanupResponse> {
    return this.post(`/cleanup?days_to_keep=${daysToKeep}`, {});
  }
}

export const logActivityService = new LogActivityService();