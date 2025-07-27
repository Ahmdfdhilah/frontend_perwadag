# 🏛️ Perwadag Frontend - Sistem Evaluasi Pemerintahan

Aplikasi web frontend modern untuk **Sistem Evaluasi Perdagangan (Perwadag)** yang dibangun dengan React, TypeScript, dan arsitektur monorepo Turborepo. Sistem ini menyediakan platform komprehensif untuk mengelola proses evaluasi pemerintahan dengan fitur manajemen surat tugas, meeting, kuisioner, dan pelaporan.

## 🏗️ Arsitektur Sistem

Proyek ini menggunakan struktur monorepo yang diperkuat oleh Turborepo, memungkinkan berbagi kode yang efisien dan pengembangan terkoordinasi di seluruh aplikasi evaluasi pemerintahan.

### 📱 Aplikasi
- **vite-react-app** - Aplikasi utama sistem evaluasi Perwadag dengan dashboard, manajemen user, dan workflow evaluasi

### 📦 Shared Packages
- **@workspace/ui** - Komponen UI yang dapat digunakan ulang dengan Tailwind CSS dan Radix UI
- **@workspace/eslint** - Konfigurasi ESLint terpusat untuk kualitas kode yang konsisten
- **@workspace/prettier** - Aturan formatting kode bersama
- **@workspace/tailwind** - Konfigurasi Tailwind CSS dan design tokens umum
- **@workspace/typescript** - Konfigurasi TypeScript terpadu

## 🚀 Getting Started

### Prerequisites

Pastikan Anda memiliki yang berikut terinstal di sistem:

- **Node.js** >= 20.0.0
- **pnpm** >= 9.15.4

### Installation

1. **Clone repository:**
```bash
git clone https://github.com/Ahmdfdhilah/frontend_perwadag.git frontend
cd perwadag/frontend
```

2. **Install dependencies:**
```bash
pnpm install
```

### Development

**Start aplikasi dalam mode development:**

```bash
pnpm dev
```

**Start aplikasi tertentu:**
```bash
# Aplikasi Perwadag utama
pnpm --filter vite-react-app dev
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start aplikasi dalam mode development |
| `pnpm build` | Build aplikasi untuk production |
| `pnpm lint` | Jalankan ESLint di semua packages |
| `pnpm format` | Format kode dengan Prettier |
| `pnpm check-types` | Jalankan TypeScript type checking |
| `pnpm clean` | Bersihkan build artifacts dan dependencies |

## 🛠️ Tech Stack

### Core Framework
- **React 19** - React terbaru dengan fitur concurrent
- **TypeScript** - Pengembangan JavaScript yang type-safe
- **Vite** - Build tool dan dev server yang sangat cepat

### State Management
- **Redux Toolkit** - Redux modern dengan boilerplate minimal
- **Redux Persist** - Persistensi state otomatis

### Styling & UI
- **Tailwind CSS 4** - Framework CSS utility-first
- **Radix UI** - UI primitives yang accessible dan unstyled
- **Framer Motion** - Library motion siap produksi

### Forms & Validation
- **React Hook Form** - Forms performa tinggi dengan minimal re-renders
- **Zod** - Validasi schema TypeScript-first

### Rich Text Editing
- **TipTap** - Rich text editor headless untuk dokumen evaluasi
- **React Quill** - WYSIWYG editor alternatif

### Data Visualization
- **Recharts** - Library charting untuk dashboard dan laporan

### HTTP & API
- **Axios** - HTTP client berbasis Promise dengan interceptors

### Internationalization
- **i18next** - Framework internasionalisasi
- **react-i18next** - Integrasi React untuk i18next

### Development Tools
- **Turborepo** - Build system performa tinggi untuk monorepos
- **ESLint** - JavaScript linter yang pluggable
- **Prettier** - Code formatter yang opinionated

## 📁 Struktur Proyek

```
frontend/
├── apps/                              # Aplikasi
│   └── vite-react-app/               # Aplikasi utama Perwadag
│       ├── src/
│       │   ├── components/           # Komponen React
│       │   │   ├── Auth/             # Komponen autentikasi (AuthGuard, AuthProvider, RoleProtectedRoute)
│       │   │   ├── Dashboard/        # Komponen dashboard (Charts, Cards, Activity)
│       │   │   ├── Users/            # Manajemen user (UserCards, UserDialog, UserTable)
│       │   │   ├── SuratTugas/       # Surat tugas evaluasi
│       │   │   ├── SuratPemberitahuan/ # Surat pemberitahuan
│       │   │   ├── EntryMeeting/     # Entry meeting
│       │   │   ├── ExitMeeting/      # Exit meeting
│       │   │   ├── KonfirmasiMeeting/ # Konfirmasi meeting
│       │   │   ├── Kuesioner/        # Kuisioner evaluasi
│       │   │   ├── FormatKuisioner/  # Format kuisioner
│       │   │   ├── Matriks/          # Matriks evaluasi
│       │   │   ├── LaporanHasilEvaluasi/ # Laporan hasil evaluasi
│       │   │   ├── RiskAssesment/    # Risk assessment
│       │   │   ├── EmailTemplate/    # Template email
│       │   │   ├── Profile/          # Manajemen profil user
│       │   │   ├── common/           # Komponen umum (Pagination, FileUpload, DatePicker, dll)
│       │   │   └── layouts/          # Layout komponen (Dashboard, Default)
│       │   ├── pages/                # Halaman aplikasi
│       │   │   ├── Auth/             # Halaman autentikasi (Login, ForgotPassword, ResetPassword)
│       │   │   ├── Dashboard/        # Dashboard utama
│       │   │   ├── Profile/          # Halaman profil
│       │   │   ├── Users/            # Halaman manajemen user
│       │   │   └── RiskAssesment/    # Halaman risk assessment
│       │   ├── services/             # API services layer
│       │   │   ├── auth/             # Service autentikasi
│       │   │   ├── users/            # Service manajemen user
│       │   │   ├── meeting/          # Service meeting
│       │   │   ├── kuisioner/        # Service kuisioner
│       │   │   ├── formatKuisioner/  # Service format kuisioner
│       │   │   ├── matriks/          # Service matriks
│       │   │   ├── suratTugas/       # Service surat tugas
│       │   │   ├── suratPemberitahuan/ # Service surat pemberitahuan
│       │   │   ├── laporanHasil/     # Service laporan hasil
│       │   │   ├── penilaianRisiko/  # Service penilaian risiko
│       │   │   ├── emailTemplate/    # Service template email
│       │   │   ├── periodeEvaluasi/  # Service periode evaluasi
│       │   │   ├── log-activity/     # Service log aktivitas
│       │   │   └── base/             # Base service configurations
│       │   ├── redux/                # State management
│       │   │   ├── features/         # Redux slices (auth, theme, role)
│       │   │   ├── store.ts          # Store configuration
│       │   │   ├── hooks.ts          # Typed Redux hooks
│       │   │   └── reducers.ts       # Root reducer
│       │   ├── hooks/                # Custom React hooks
│       │   │   ├── useDebounce.ts    # Debounce hook
│       │   │   ├── useFormPermissions.ts # Form permissions hook
│       │   │   ├── useInfiniteSearch.ts  # Infinite search hook
│       │   │   ├── useRole.ts        # Role management hook
│       │   │   ├── useTheme.ts       # Theme management hook
│       │   │   └── useURLFilters.ts  # URL filters hook
│       │   ├── utils/                # Utility functions
│       │   │   ├── api.ts            # API utilities
│       │   │   ├── excelExportUtils.ts # Excel export utilities
│       │   │   ├── imageUtils.ts     # Image processing utilities
│       │   │   ├── numberUtils.ts    # Number formatting utilities
│       │   │   ├── riskCalculationUtils.ts # Risk calculation utilities
│       │   │   ├── textUtils.ts      # Text processing utilities
│       │   │   ├── timeFormat.ts     # Time formatting utilities
│       │   │   ├── urlStateUtils.ts  # URL state utilities
│       │   │   └── yearUtils.ts      # Year utilities
│       │   ├── config/               # Konfigurasi aplikasi
│       │   │   └── api.ts            # Konfigurasi API
│       │   ├── lib/                  # Library utilities
│       │   │   ├── constants.ts      # Application constants
│       │   │   └── menus.ts          # Menu configurations
│       │   ├── types/                # TypeScript type definitions
│       │   └── assets/               # Static assets (images, icons)
│       ├── public/                   # Public assets (favicons, PWA assets)
│       └── package.json
├── packages/                          # Shared packages
│   ├── ui/                           # Shared UI components
│   │   ├── src/
│   │   │   ├── components/           # Komponen yang dapat digunakan ulang
│   │   │   │   ├── ui/               # Custom UI components (carousel, loading, news-card, dll)
│   │   │   │   └── [radix-components] # Radix UI components (button, dialog, form, dll)
│   │   │   ├── lib/
│   │   │   │   └── utils.ts          # Utility functions
│   │   │   └── globals.css           # Global CSS styles
│   │   └── package.json
│   ├── eslint/                       # Konfigurasi ESLint
│   │   ├── src/
│   │   │   └── index.ts              # ESLint rules configuration
│   │   └── package.json
│   ├── prettier/                     # Konfigurasi Prettier
│   │   ├── base.js                   # Base Prettier configuration
│   │   └── package.json
│   ├── tailwind/                     # Konfigurasi Tailwind CSS
│   │   ├── tailwind.config.ts        # Tailwind configuration
│   │   ├── globals.css               # Global Tailwind styles
│   │   └── package.json
│   └── typescript/                   # Konfigurasi TypeScript
│       ├── base.json                 # Base TypeScript config
│       ├── react.json                # React TypeScript config
│       ├── next.json                 # Next.js TypeScript config
│       └── package.json
├── turbo.json                        # Konfigurasi Turborepo
├── package.json                      # Root package.json
├── pnpm-workspace.yaml              # Konfigurasi PNPM workspace
├── CLAUDE.md                         # Claude Code project instructions
└── README.md                         # File ini
```

## 🌟 Fitur Sistem Perwadag

### 🔐 Autentikasi & Otorisasi
- **Login dengan Nama Lengkap** - Sistem login menggunakan nama lengkap sebagai username
- **Role-based Access Control** - Tiga level akses: Admin, Inspektorat, Perwadag
- **JWT Authentication** - Token-based authentication dengan refresh token
- **Password Reset** - Fitur reset password via email

### 👥 Manajemen User
- **Multi-role User Management** - Kelola user dengan role berbeda
- **Profile Management** - User dapat mengelola profil sendiri
- **User Statistics** - Dashboard statistik user untuk admin

### 📋 Workflow Evaluasi
- **Surat Tugas** - Pembuatan dan pengelolaan surat tugas evaluasi
- **Surat Pemberitahuan** - Notifikasi evaluasi ke perwadag
- **Entry Meeting** - Manajemen meeting pembukaan evaluasi
- **Konfirmasi Meeting** - Konfirmasi jadwal dan agenda meeting
- **Exit Meeting** - Meeting penutupan evaluasi
- **Matriks Evaluasi** - Input dan kelola matriks penilaian
- **Kuisioner** - Template dan pengisian kuisioner evaluasi
- **Format Kuisioner** - Manajemen format dan template kuisioner
- **Risk Assessment** - Penilaian risiko dan analisis
- **Email Template** - Template email untuk komunikasi otomatis
- **Periode Evaluasi** - Manajemen periode dan jadwal evaluasi
- **Laporan Hasil** - Generate dan kelola laporan hasil evaluasi

### 📊 Dashboard & Reporting
- **Dashboard Overview** - Ringkasan status evaluasi dan progress
- **Progress Tracking** - Pelacakan kemajuan setiap tahap evaluasi
- **Data Visualization** - Charts dan grafik untuk analisis data
- **Completion Statistics** - Statistik penyelesaian evaluasi per periode
- **Activity Logging** - Log aktivitas pengguna untuk audit trail
- **Export Functionality** - Export data ke Excel dan PDF

### 📁 File Management
- **Document Upload** - Upload dokumen pendukung evaluasi
- **File Preview** - Preview file dalam aplikasi
- **Download Center** - Pusat download dokumen dan template

### 🔍 Search & Filter
- **Advanced Search** - Pencarian lanjutan di semua modul
- **URL-based Filters** - Filter yang tersimpan di URL untuk bookmarking
- **Real-time Filtering** - Filter real-time dengan debouncing

## 🎯 Pola Pengembangan

### Services Layer
- **API Integration** - Layer service terstruktur untuk komunikasi dengan backend
- **Error Handling** - Penanganan error terpusat dengan toast notifications
- **Request/Response Types** - Type safety penuh untuk semua API calls

### Component Architecture
- **Reusable Components** - Komponen yang dapat digunakan ulang di seluruh aplikasi
- **Compound Components** - Pola compound untuk komponen kompleks
- **Custom Hooks** - Hooks kustom untuk logic yang dapat digunakan ulang
  - `useDebounce` - Debouncing untuk input search
  - `useFormPermissions` - Manajemen permission form berdasarkan role
  - `useInfiniteSearch` - Infinite scrolling untuk list data
  - `useRole` - Manajemen role dan permission user
  - `useTheme` - Theme switching (dark/light mode)
  - `useURLFilters` - Sinkronisasi filter dengan URL state

### State Management
- **Redux Toolkit** - State management modern dengan RTK
- **Persistent State** - State yang persisten untuk user preferences
- **Optimistic Updates** - Update optimistik untuk UX yang lebih baik

### Utility Functions
- **Excel Export** - Utils untuk export data ke format Excel
- **Image Processing** - Utilities untuk kompresi dan manipulasi gambar
- **Risk Calculation** - Kalkulasi dan analisis penilaian risiko
- **Time Formatting** - Formatting tanggal dan waktu yang konsisten
- **Number Formatting** - Format angka dan currency
- **Text Processing** - Utilities untuk manipulasi teks dan string
- **URL State Management** - Manajemen state melalui URL parameters

## 🔧 Konfigurasi Environment

Buat file `.env.local` di `apps/vite-react-app/`:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME=Sistem Evaluasi Perwadag
VITE_APP_VERSION=1.0.0
```

## 🚀 Deployment

### Build untuk Production

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

## 📖 Dokumentasi Tambahan

- [Guide Logic Pages](./guide-logic-pages.md) - Panduan implementasi halaman
- [Form Data Mapping](./form-data-mapping.md) - Mapping data forms
- [Data Structure Mapping](./data-structure-mapping.md) - Struktur data
- [File Upload Components](./file-upload-components-list.md) - Komponen upload file

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit perubahan (`git commit -m 'Add some amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buka Pull Request

## 📄 License

Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 🆘 Support

Jika Anda mengalami masalah atau memiliki pertanyaan:

1. Periksa [dokumentasi](#)
2. Cari [issues](../../issues) yang sudah ada
3. Buat [issue baru](../../issues/new) jika diperlukan

---

Dibangun dengan ❤️ untuk Sistem Evaluasi Pemerintahan Indonesia