# 🏛️ SIELANGMERAH Frontend - Sistem Evaluasi Kinerja Perwakilan Perdagangan

Frontend aplikasi **SIELANGMERAH (Sistem Evaluasi Kinerja Perwakilan Perdagangan Metode Jarak Jauh)** yang dibangun dengan React 19, TypeScript, dan Vite. Platform digital untuk evaluasi kinerja perwakilan perdagangan Indonesia di luar negeri, dikembangkan oleh Kementerian Perdagangan Republik Indonesia.

## 🚀 Getting Started

### Prerequisites

Pastikan Anda memiliki yang berikut terinstal:
- **Node.js** >= 20.0.0  
- **pnpm** >= 9.15.4 (package manager)

### Installation

1. **Clone repository:**
```bash
git clone https://github.com/DaffaJatmiko/frontend-perwadag.git frontend
cd sielangmerah/frontend
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Setup environment variables:**
```bash
# Copy dan edit file environment
cp apps/vite-react-app/.env.example apps/vite-react-app/.env
```

4. **Start development server:**
```bash
pnpm dev
```

Aplikasi akan berjalan di `http://localhost:5173`

## 🛠️ Tech Stack

### Core Framework
- **React 19** - Library UI dengan concurrent features
- **TypeScript** - Static type checking untuk JavaScript
- **Vite** - Fast build tool dan development server

### State Management
- **Redux Toolkit** - Modern Redux dengan less boilerplate
- **Redux Persist** - Persist state ke localStorage

### UI & Styling  
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Headless, accessible UI components
- **Lucide React** - Beautiful & consistent icon library
- **Framer Motion** - Production-ready motion library

### Authentication & Security
- **JWT Decode** - JWT token parsing di client
- **🆕 Google reCAPTCHA v3** - Invisible bot protection untuk login

### Forms & Validation
- **React Hook Form** - Performant forms dengan minimal re-renders
- **Zod** - TypeScript-first schema validation

### Routing
- **React Router DOM v7** - Client-side routing

### Rich Text & Data
- **TipTap** - Headless rich text editor
- **ExcelJS** - Excel file generation dan parsing
- **Recharts** - Composable charting library

## 📁 Struktur Proyek

```
frontend/
├── apps/
│   └── vite-react-app/           # Main React application
│       ├── src/
│       │   ├── components/       # React components
│       │   │   ├── Auth/        # Authentication components
│       │   │   │   ├── AuthProvider.tsx    # Auth context
│       │   │   │   ├── AuthGuard.tsx       # Route protection
│       │   │   │   └── RoleProtectedRoute.tsx
│       │   │   ├── common/      # Reusable components
│       │   │   └── layouts/     # Layout components
│       │   ├── hooks/          # Custom React hooks
│       │   │   ├── useAuth.ts  # Authentication hook
│       │   │   ├── useCaptcha.ts  # 🆕 reCAPTCHA hook
│       │   │   └── useTheme.ts # Theme management
│       │   ├── pages/          # Page components
│       │   │   ├── Auth/       # Login, reset password
│       │   │   ├── Dashboard/  # Dashboard pages
│       │   │   └── Users/      # User management
│       │   ├── redux/          # Redux store & slices
│       │   │   ├── features/   # Redux slices
│       │   │   └── store.ts    # Store configuration
│       │   ├── services/       # API service layers
│       │   │   ├── auth/       # Authentication API
│       │   │   ├── users/      # User management API
│       │   │   └── base/       # Base HTTP client
│       │   ├── utils/          # Utility functions
│       │   └── types/          # TypeScript type definitions
│       ├── public/             # Static assets
│       ├── .env               # Environment variables
│       └── package.json       # App dependencies
├── packages/                   # Shared packages
│   ├── ui/                    # Shared UI components
│   ├── eslint/               # ESLint configuration
│   ├── prettier/             # Prettier configuration
│   ├── tailwind/             # Tailwind configuration
│   └── typescript/           # TypeScript configuration
└── package.json              # Monorepo dependencies
```

## 🌟 Fitur Aplikasi

### 🔐 Authentication & Security
- **JWT-based Authentication** - Secure login dengan access/refresh tokens
- **Role-based Authorization** - Admin, Inspektorat, Perwadag roles
- **Password Management** - Change password, reset via email
- **🆕 Invisible CAPTCHA Protection** - Google reCAPTCHA v3 untuk login security
- **Session Management** - Automatic token refresh dan session handling

### 👥 User Management
- **User CRUD Operations** - Create, read, update, delete users
- **Role Assignment** - Manage user roles dan permissions
- **Profile Management** - User dapat update profil sendiri
- **User Statistics** - Dashboard dengan statistik user

### 📋 Workflow Evaluasi
- **Surat Tugas Management** - CRUD surat tugas evaluasi
- **Meeting Management** - Entry, exit, dan konfirmasi meeting
- **Kuisioner System** - Template dan pengisian kuisioner
- **Matriks Evaluasi** - Input dan kelola matriks penilaian
- **Laporan Hasil** - Generate dan view laporan evaluasi

### 🎨 User Experience
- **Responsive Design** - Optimal di desktop, tablet, dan mobile
- **Dark/Light Mode** - Theme switching dengan persist preference
- **Loading States** - Beautiful loading indicators dan skeletons
- **Error Handling** - Comprehensive error messages dan recovery
- **Progressive Web App** - PWA capabilities untuk offline usage

### 📁 File Management
- **File Upload** - Drag & drop file upload dengan progress
- **File Preview** - Preview documents dan images
- **Export Functionality** - Export data ke Excel format

## 🔧 Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linting
pnpm lint

# Run type checking
pnpm check-types

# Format code
pnpm format

# Clean build artifacts
pnpm clean
```

## 📜 Environment Variables

Buat file `.env` di `apps/vite-react-app/`:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api/v1

# Google reCAPTCHA Configuration (Bot Protection)
VITE_RECAPTCHA_SITE_KEY=your_site_key_from_google_console

# Application Settings
VITE_APP_NAME="Sistem Evaluasi Perwadag"
VITE_APP_VERSION="1.0.0"
```

## 🛡️ Security Features

### Google reCAPTCHA v3 Integration
- **Invisible Protection** - Bot detection tanpa mengganggu user experience
- **Score-based Validation** - Real-time human vs bot scoring
- **Smart Fallback** - Graceful degradation jika CAPTCHA disabled
- **Privacy Focused** - Minimal data collection, GDPR compliant

### Authentication Security
- **HTTP-Only Cookies** - Secure token storage
- **CSRF Protection** - Cross-site request forgery protection
- **XSS Prevention** - Content Security Policy headers
- **Session Management** - Automatic session cleanup dan expiry

## 📱 Progressive Web App (PWA)

Aplikasi ini dikonfigurasi sebagai PWA dengan fitur:

- **Offline Support** - Caching strategy untuk offline usage
- **Install Prompt** - User dapat install sebagai native app
- **Background Sync** - Sync data ketika connection restored
- **Push Notifications** - (Coming soon) Real-time notifications

## 🎨 UI Components

### Design System
- **Consistent Colors** - Unified color palette dengan dark mode support
- **Typography** - Hierarchical text styles
- **Spacing** - Consistent margin dan padding scale
- **Animations** - Smooth transitions dengan Framer Motion

### Component Library (@workspace/ui)
- **Form Components** - Input, Select, Checkbox, Radio
- **Data Display** - Table, Card, Badge, Avatar
- **Navigation** - Breadcrumb, Pagination, Menu
- **Feedback** - Toast, Alert, Loading, Progress

## 🔍 State Management

### Redux Store Structure
```typescript
{
  auth: {
    user: User | null,
    isAuthenticated: boolean,
    loading: boolean,
    error: string | null
  },
  theme: {
    mode: 'light' | 'dark',
    primaryColor: string
  }
  // ... other slices
}
```

### Data Persistence
- **Auth State** - Persisted untuk automatic login
- **Theme Preferences** - Persisted user theme choice
- **Form Drafts** - Auto-save form data (coming soon)

## 🧪 Testing

```bash
# Run unit tests (coming soon)
pnpm test

# Run component tests (coming soon)  
pnpm test:components

# Run e2e tests (coming soon)
pnpm test:e2e
```

## 🚀 Deployment

### Production Build

```bash
# Build optimized production bundle
pnpm build

# Preview production build locally
pnpm preview
```

### Environment Configuration

**Development:**
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_RECAPTCHA_SITE_KEY=test_site_key
```

**Production:**
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
VITE_RECAPTCHA_SITE_KEY=prod_site_key_from_google
```

### Deployment Platforms

**Vercel (Recommended):**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

**Netlify:**
```bash
# Build command: pnpm build
# Publish directory: apps/vite-react-app/dist
```

**Docker:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN pnpm install
COPY . .
RUN pnpm build
EXPOSE 5173
CMD ["pnpm", "preview", "--host", "0.0.0.0"]
```

## 📊 Performance

### Bundle Analysis
```bash
# Analyze bundle size
pnpm build --analyze
```

### Performance Optimizations
- **Code Splitting** - Lazy loading untuk routes dan components
- **Tree Shaking** - Remove unused code
- **Asset Optimization** - Image compression dan lazy loading
- **Service Worker** - Caching strategies untuk fast loading

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards

```bash
# Lint code
pnpm lint

# Format code
pnpm format

# Type check
pnpm check-types
```

### Component Guidelines
- Use TypeScript untuk semua components
- Follow Compound Component pattern untuk complex UI
- Implement proper error boundaries
- Write meaningful prop documentation

## 📄 License

Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](../../../LICENSE) untuk detail.

## 🆘 Support

Jika Anda mengalami masalah atau memiliki pertanyaan:

1. Periksa [CAPTCHA Setup Guide](../../../CAPTCHA_SETUP.md) untuk CAPTCHA troubleshooting
2. Cari [issues](../../issues) yang sudah ada
3. Buat [issue baru](../../issues/new) jika diperlukan

---

**✨ New Features:**
- 🛡️ **Google reCAPTCHA v3** - Invisible bot protection dengan score-based validation
- 🔒 **Enhanced Security** - Multi-layer authentication protection
- 📱 **PWA Support** - Progressive Web App capabilities
- 🎨 **Modern UI** - React 19 dengan Tailwind CSS 4

Dibangun dengan ❤️ oleh Kementerian Perdagangan Republik Indonesia untuk Sistem Evaluasi Kinerja Perwakilan Perdagangan Indonesia