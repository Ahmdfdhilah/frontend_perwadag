# Guards dan Route Protection

## Penjelasan Guards yang Tersedia

### 1. **RoleProtectedRoute** - Guard Utama
Guard ini adalah yang paling fleksibel untuk berbagai skenario:

```tsx
<RoleProtectedRoute 
  allowedRoles={['admin', 'master_admin']} 
  requireRoles={true}
  redirectTo="/home"
>
  <AdminDashboard />
</RoleProtectedRoute>
```

**Props:**
- `allowedRoles: []` = **Semua user bisa akses** (punya role atau tidak)
- `allowedRoles: ['admin']` = **Hanya user dengan role admin**
- `requireRoles: true` = **User HARUS punya role** (minimal 1 role)
- `requireRoles: false` = **User boleh tidak punya role**

### 2. **RequireRoles** - Harus Punya Role
Untuk route yang hanya bisa diakses user yang sudah punya role:

```tsx
<RequireRoles redirectTo="/home">
  <DashboardPage />  {/* Hanya user dengan role bisa akses */}
</RequireRoles>
```

### 3. **NoRolesOnly** - Khusus User Tanpa Role
Untuk route yang hanya bisa diakses user yang belum punya role:

```tsx
<NoRolesOnly redirectTo="/dashboard">
  <WelcomePage />  {/* Hanya user tanpa role bisa akses */}
</NoRolesOnly>
```

### 4. **HomePageGuard** - Universal Home
Untuk home page yang bisa diakses semua user (punya role atau tidak):

```tsx
<HomePageGuard>
  <HomePage />  {/* Semua authenticated user bisa akses */}
</HomePageGuard>
```

## Contoh Penggunaan dalam Routing

```tsx
// App.tsx atau Router setup
function AppRoutes() {
  return (
    <Routes>
      {/* Login - tidak butuh guard */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Home - semua user bisa akses */}
      <Route path="/home" element={
        <HomePageGuard>
          <HomePage />
        </HomePageGuard>
      } />
      
      {/* Dashboard - hanya user dengan role */}
      <Route path="/dashboard" element={
        <RequireRoles>
          <DashboardPage />
        </RequireRoles>
      } />
      
      {/* Admin routes - hanya admin */}
      <Route path="/admin/*" element={
        <RoleProtectedRoute allowedRoles={['admin', 'master_admin']}>
          <AdminRoutes />
        </RoleProtectedRoute>
      } />
      
      {/* Welcome page - hanya user tanpa role */}
      <Route path="/welcome" element={
        <NoRolesOnly>
          <WelcomePage />
        </NoRolesOnly>
      } />
      
      {/* Profile - semua user bisa akses */}
      <Route path="/profile" element={
        <RoleProtectedRoute allowedRoles={[]}>
          <ProfilePage />
        </RoleProtectedRoute>
      } />
    </Routes>
  );
}
```

## Hook: useRoleAccess

```tsx
function MyComponent() {
  const {
    hasRoles,      // apakah user punya role
    hasRole,       // cek role specific
    isMasterAdmin, // shortcut
    isAdmin,       // shortcut
    isUser         // shortcut
  } = useRoleAccess();

  if (!hasRoles) {
    return <div>Anda belum mendapat role</div>;
  }

  if (isMasterAdmin) {
    return <AdminPanel />;
  }

  return <UserPanel />;
}
```

## Logika Akses Menu

### Basic Menu (User Tanpa Role)
```tsx
export const basicMenuItems: SidebarItem[] = [
  {
    title: 'Home',
    href: '/home',
    icon: Home,
    allowedRoles: [], // ✅ SEMUA user bisa akses (punya role atau tidak)
  }
];
```

### HRIS Menu (User Dengan Role)
```tsx
{
  title: 'Dashboard',
  href: '/dashboard',
  icon: Home,
  allowedRoles: ['master_admin', 'admin', 'user'], // ✅ Hanya user dengan role ini
}
```

## Skenario Flow User

### 1. **User Baru (Belum Punya Role)**
- Login → Redirect ke `/home`
- Menu: Hanya "Home" 
- Bisa akses: `/home`, `/profile/*`
- Tidak bisa akses: `/dashboard`, admin routes

### 2. **User Dapat Role**
- Menu berubah otomatis ke HRIS menu
- Bisa akses semua fitur sesuai role
- Redirect dari `/home` ke `/dashboard`

### 3. **Admin/Master Admin**
- Full akses ke semua menu
- Bisa manage users, settings, dll

## Best Practices

1. **Untuk route publik dalam app**: `allowedRoles: []`
2. **Untuk fitur HRIS**: `allowedRoles: ['user', 'admin', 'master_admin']`
3. **Untuk admin only**: `allowedRoles: ['admin', 'master_admin']`
4. **Untuk master admin only**: `allowedRoles: ['master_admin']`
5. **Untuk cek user punya role**: `requireRoles: true`