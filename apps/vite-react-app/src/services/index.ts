// apps/vite-react-app/src/services/index.ts

// Export base types (including shared types to avoid conflicts)
export * from "./base";

// Export services with explicit type re-exports to avoid naming conflicts
export { authService } from "./auth";
export { userService } from "./users";
export { suratTugasService } from "./suratTugas";
export { formatKuisionerService } from "./formatKuisioner";
export { kuisionerService } from "./kuisioner";
export { laporanHasilService } from "./laporanHasil";
export { matriksService } from "./matriks";
export { suratPemberitahuanService } from "./suratPemberitahuan";
export { meetingService } from "./meeting";

// Export types with explicit imports to avoid conflicts
export type {
  LoginRequest,
  LoginResponse,
  TokenResponse,
  TokenRefreshRequest,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
  PasswordResetEligibilityResponse,
  DefaultPasswordInfoResponse,
  TokenVerificationResponse,
} from "./auth";

export type {
  User,
  UserSummary,
  UserCreate,
  UserUpdate,
  UserChangePassword,
  UsernameGenerationPreview,
  UserResponse,
  UsernameGenerationResponse,
  UserListResponse,
  UserStatistics,
  UserFilterParams,
} from "./users";

export type {
  SuratTugas,
  SuratTugasProgress,
  PerwadagInfo,
  SuratTugasCreate,
  SuratTugasUpdate,
  SuratTugasResponse,
  SuratTugasCreateResponse,
  SuratTugasListResponse,
  SuratTugasDashboardSummary,
  PerwadagListResponse,
  SuratTugasFilterParams,
  SuratTugasFileUploadResponse,
} from "./suratTugas";

export type {
  FormatKuisioner,
  FormatKuisionerStatistics,
  FormatKuisionerCreate,
  FormatKuisionerUpdate,
  FormatKuisionerResponse,
  FormatKuisionerListResponse,
  FormatKuisionerFileUploadResponse,
  FormatKuisionerByYearResponse,
  FormatKuisionerStatisticsResponse,
  FormatKuisionerFilterParams,
} from "./formatKuisioner";

export type {
  Kuisioner,
  KuisionerStatistics,
  KuisionerCreate,
  KuisionerUpdate,
  KuisionerResponse,
  KuisionerListResponse,
  KuisionerFileUploadResponse,
  KuisionerFilterParams,
} from "./kuisioner";

export type {
  LaporanHasil,
  LaporanHasilStatistics,
  LaporanHasilCreate,
  LaporanHasilUpdate,
  LaporanHasilResponse,
  LaporanHasilListResponse,
  LaporanHasilFileUploadResponse,
  LaporanHasilFilterParams,
} from "./laporanHasil";

export type {
  Matriks,
  MatriksStatistics,
  MatriksCreate,
  MatriksUpdate,
  MatriksResponse,
  MatriksListResponse,
  MatriksFileUploadResponse,
  MatriksFilterParams,

} from "./matriks";

export type {
  SuratPemberitahuan,
  SuratPemberitahuanStatistics,
  SuratPemberitahuanCreate,
  SuratPemberitahuanUpdate,
  SuratPemberitahuanResponse,
  SuratPemberitahuanListResponse,
  SuratPemberitahuanFileUploadResponse,
  SuratPemberitahuanFilterParams,
} from "./suratPemberitahuan";

export type {
  Meeting,
  MeetingFile,
  MeetingFilesInfo,
  MeetingStatistics,
  MeetingCreate,
  MeetingUpdate,
  MeetingFileUploadRequest,
  MeetingResponse,
  MeetingListResponse,
  MeetingFileUploadResponse,
  MeetingFileDeleteResponse,
  MeetingFilterParams,
} from "./meeting";