import api from "@/utils/api";
import { AxiosResponse } from "axios";
import { toast } from "@workspace/ui/components/sonner";

export abstract class BaseService {
  protected baseEndpoint: string;

  constructor(baseEndpoint: string) {
    this.baseEndpoint = `/api/v1${baseEndpoint}`;
  }

  protected async handleRequest<T>(
    requestFn: () => Promise<AxiosResponse<T>>
  ): Promise<T> {
    try {
      const response = await requestFn();
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || "Terjadi kesalahan";

      // Show error toast to user
      toast.error("Error", {
        description: errorMessage,
      });
      
      throw new Error(errorMessage);
    }
  }

  protected async get<T>(endpoint: string): Promise<T> {
    return this.handleRequest(
      () => api.get(`${this.baseEndpoint}${endpoint}`)
    );
  }

  protected async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.handleRequest(
      () => api.post(`${this.baseEndpoint}${endpoint}`, data)
    );
  }

  protected async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.handleRequest(
      () => api.put(`${this.baseEndpoint}${endpoint}`, data)
    );
  }

  protected async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.handleRequest(
      () => api.patch(`${this.baseEndpoint}${endpoint}`, data)
    );
  }

  protected async delete<T>(endpoint: string): Promise<T> {
    return this.handleRequest(
      () => api.delete(`${this.baseEndpoint}${endpoint}`)
    );
  }
}