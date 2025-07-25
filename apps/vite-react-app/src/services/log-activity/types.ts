// apps/vite-react-app/src/services/log-activity/types.ts

// Log Activity Request Types
export interface LogActivityFilterParams {
  // Pagination
  page?: number;
  size?: number;
  
  // Search
  search?: string;
  
  // Date filters
  date_from?: string; // ISO date string
  date_to?: string; // ISO date string
  
  // Activity filters
  method?: "POST" | "PUT" | "PATCH" | "DELETE";
  user_id?: string;
  
  // Status filters
  success_only?: boolean;
}

// Log Activity Response Types
export interface LogActivityResponse {
  id: string;
  user_id: string;
  method: string;
  url: string;
  activity: string;
  date: string; // ISO date string
  user_name?: string;
  ip_address?: string;
  response_status?: number;
  is_success: boolean;
  activity_type: string;
  created_at: string; // ISO date string
}

export interface LogActivityListResponse {
  items: LogActivityResponse[];
  total: number;
  page: number;
  pages: number;
  size: number;
  has_next: boolean;
  has_prev: boolean;
  statistics?: ModuleStatistics;
}

// Statistics Types
export interface LogActivityStatistics {
  total_activities: number;
  success_count: number;
  success_rate: number;
  activities_by_method: Record<string, number>;
  activities_by_day: Record<string, number>; // Last 7 days
}

export interface ModuleStatistics {
  total: number;
  success_rate: number;
  most_active_day?: string;
  most_used_method?: string;
}

// Admin Operations
export interface CleanupResponse {
  success: boolean;
  message: string;
  cleaned_count?: number;
}