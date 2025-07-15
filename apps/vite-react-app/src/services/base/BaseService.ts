import api from "@/utils/api";
import { useToast } from "@workspace/ui/components/sonner";
import { AxiosResponse } from "axios";
import { ServiceOptions, ToastConfig } from "./types";

const { toast } = useToast();

export abstract class BaseService {
  protected baseEndpoint: string;

  constructor(baseEndpoint: string) {
    this.baseEndpoint = baseEndpoint;
  }

  protected showToast(
    config: ToastConfig,
    options?: ServiceOptions
  ): void {
    if (options?.showToast !== false) {
      toast({
        title: config.title,
        description: config.description,
        variant: config.variant || "default",
      });
    }
  }

  protected async handleRequest<T>(
    requestFn: () => Promise<AxiosResponse<T>>,
    successConfig?: ToastConfig,
    errorConfig?: Partial<ToastConfig>,
    options?: ServiceOptions
  ): Promise<T> {
    try {
      const response = await requestFn();
      
      if (successConfig) {
        this.showToast(successConfig, options);
      }
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || "An error occurred";
      
      if (errorConfig) {
        this.showToast(
          {
            title: errorConfig.title || "Error",
            description: errorConfig.description || errorMessage,
            variant: errorConfig.variant || "destructive",
          },
          options
        );
      }
      
      throw new Error(errorMessage);
    }
  }

  protected async get<T>(
    endpoint: string,
    successConfig?: ToastConfig,
    errorConfig?: Partial<ToastConfig>,
    options?: ServiceOptions
  ): Promise<T> {
    return this.handleRequest(
      () => api.get(`${this.baseEndpoint}${endpoint}`),
      successConfig,
      errorConfig,
      options
    );
  }

  protected async post<T>(
    endpoint: string,
    data?: any,
    successConfig?: ToastConfig,
    errorConfig?: Partial<ToastConfig>,
    options?: ServiceOptions
  ): Promise<T> {
    return this.handleRequest(
      () => api.post(`${this.baseEndpoint}${endpoint}`, data),
      successConfig,
      errorConfig,
      options
    );
  }

  protected async put<T>(
    endpoint: string,
    data?: any,
    successConfig?: ToastConfig,
    errorConfig?: Partial<ToastConfig>,
    options?: ServiceOptions
  ): Promise<T> {
    return this.handleRequest(
      () => api.put(`${this.baseEndpoint}${endpoint}`, data),
      successConfig,
      errorConfig,
      options
    );
  }

  protected async patch<T>(
    endpoint: string,
    data?: any,
    successConfig?: ToastConfig,
    errorConfig?: Partial<ToastConfig>,
    options?: ServiceOptions
  ): Promise<T> {
    return this.handleRequest(
      () => api.patch(`${this.baseEndpoint}${endpoint}`, data),
      successConfig,
      errorConfig,
      options
    );
  }

  protected async delete<T>(
    endpoint: string,
    successConfig?: ToastConfig,
    errorConfig?: Partial<ToastConfig>,
    options?: ServiceOptions
  ): Promise<T> {
    return this.handleRequest(
      () => api.delete(`${this.baseEndpoint}${endpoint}`),
      successConfig,
      errorConfig,
      options
    );
  }
}