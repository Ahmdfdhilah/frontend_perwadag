export interface ServiceOptions {
  showToast?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface StatusResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ToastConfig {
  title: string;
  description: string;
  variant?: "default" | "destructive";
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface SortOption {
  field: string;
  order: "asc" | "desc";
}

export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
  sort?: SortOption[];
}