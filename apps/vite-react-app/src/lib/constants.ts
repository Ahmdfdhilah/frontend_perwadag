// apps/vite-react-app/src/lib/constants.ts

// User Role Constants
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  INSPEKTORAT: 'INSPEKTORAT',
  PERWADAG: 'PERWADAG'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Role Display Labels
export const ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.INSPEKTORAT]: 'Inspektorat',
  [USER_ROLES.PERWADAG]: 'Perwadag'
} as const;

// Inspektorat Options
export const INSPEKTORAT_OPTIONS = [
  { value: 'Inspektorat 1', label: 'Inspektorat 1' },
  { value: 'Inspektorat 2', label: 'Inspektorat 2' },
  { value: 'Inspektorat 3', label: 'Inspektorat 3' },
  { value: 'Inspektorat 4', label: 'Inspektorat 4' }
] as const;

// Meeting Type Constants
export const MEETING_TYPES = {
  ENTRY: 'ENTRY',
  KONFIRMASI: 'KONFIRMASI',
  EXIT: 'EXIT'
} as const;

export type MeetingType = typeof MEETING_TYPES[keyof typeof MEETING_TYPES];

// Meeting Type Display Labels
export const MEETING_TYPE_LABELS = {
  [MEETING_TYPES.ENTRY]: 'Entry Meeting',
  [MEETING_TYPES.KONFIRMASI]: 'Konfirmasi Meeting',
  [MEETING_TYPES.EXIT]: 'Exit Meeting'
} as const;

// Status Constants
export const STATUS_LABELS = {
  ACTIVE: 'Aktif',
  INACTIVE: 'Tidak Aktif'
} as const;

// API Pagination defaults
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  SIZE: 20,
  MAX_SIZE: 100
} as const;

export const AUDIT_CHOICES = [
  { value: '1-tahun', label: '1 Tahun', score: 1 },
  { value: '2-tahun', label: '2 Tahun', score: 2 },
  { value: '3-tahun', label: '3 Tahun', score: 3 },
  { value: '4-tahun', label: '4 Tahun', score: 4 },
  { value: 'belum-pernah', label: 'Belum pernah diaudit', score: 5 }
];

export const TRADE_AGREEMENT_CHOICES = [
  { value: 'sudah-implementasi', label: 'Sudah diimplementasikan', score: 5 },
  { value: 'sudah-sepakat-belum-ratifikasi', label: 'Sudah disepakati namun belum diratifikasi', score: 4 },
  { value: 'masih-proses', label: 'Masih berproses/ on going', score: 3 },
  { value: 'sedang-diusulkan', label: 'Sedang diusulkan/ Being Proposed', score: 2 },
  { value: 'tidak-ada', label: 'Tidak ada perjanjian internasional', score: 1 }
];