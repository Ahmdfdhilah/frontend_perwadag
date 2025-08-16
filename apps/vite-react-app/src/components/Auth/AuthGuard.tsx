// apps/vite-react-app/src/components/Auth/AuthGuard.tsx
import React, { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  requireRoles?: string[];
  requireMfa?: boolean;
  redirectTo?: string;
  allowUnauthenticated?: boolean;
  preserveLayout?: boolean; // New prop to preserve layout during loading
}

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Memuat..." }) => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="flex flex-col items-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  </div>
);

const AuthLoadingOverlay: React.FC<LoadingSpinnerProps> = ({ message = "Memverifikasi..." }) => (
  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4 bg-card p-6 rounded-lg border shadow-lg">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  </div>
);

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallback = null, 
  requireRoles = [],
  redirectTo = '/login',
  allowUnauthenticated = false,
  preserveLayout = false
}) => {
  const { 
    isAuthenticated, 
    user, 
    loading, 
    checkAuth,
    isSessionValid 
  } = useAuth();
  const location = useLocation();

  // Check auth on location changes only if authenticated and session might be expired
  useEffect(() => {
    if (isAuthenticated && !isSessionValid()) {
      checkAuth();
    }
  }, [location.pathname]); // Removed isAuthenticated from deps to prevent unnecessary calls

  // Show loading spinner while authentication is being checked
  if (loading) {
    if (preserveLayout) {
      return (
        <>
          {children}
          <AuthLoadingOverlay message="Memverifikasi autentikasi..." />
        </>
      );
    }
    return <LoadingSpinner message="Memverifikasi autentikasi..." />;
  }

  // If unauthenticated access is allowed, render children
  if (allowUnauthenticated) {
    return <>{children}</>;
  }

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Check if user account is active
  if (!user.is_active) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-destructive">Akun Tidak Aktif</h2>
          <p className="text-muted-foreground">
            Akun Anda telah dinonaktifkan. Silakan hubungi administrator untuk bantuan.
          </p>
        </div>
      </div>
    );
  }

  // Note: Password change requirement should be handled by backend

  // Note: MFA requirements should be handled by backend

  // Check role requirements
  if (requireRoles.length > 0) {
    const hasRequiredRole = requireRoles.includes(user.role);
    
    if (!hasRequiredRole) {
      if (fallback) {
        return <>{fallback}</>;
      }
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-destructive">Akses Ditolak</h2>
            <p className="text-muted-foreground">
              Anda tidak memiliki izin yang diperlukan untuk mengakses halaman ini.
            </p>
            <p className="text-sm text-muted-foreground">
              Role yang diperlukan: {requireRoles.join(', ')}
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

// Higher-order component for protecting routes
export const withAuthGuard = (
  Component: React.ComponentType<any>,
  options: Omit<AuthGuardProps, 'children'> = {}
) => {
  return (props: any) => (
    <AuthGuard {...options}>
      <Component {...props} />
    </AuthGuard>
  );
};

// Role-specific guards
export const AdminGuard: React.FC<Omit<AuthGuardProps, 'requireRoles'>> = (props) => (
  <AuthGuard {...props} requireRoles={['ADMIN']} />
);

export const InspektoratGuard: React.FC<Omit<AuthGuardProps, 'requireRoles'>> = (props) => (
  <AuthGuard {...props} requireRoles={['INSPEKTORAT']} />
);

export const PerwadagGuard: React.FC<Omit<AuthGuardProps, 'requireRoles'>> = (props) => (
  <AuthGuard {...props} requireRoles={['PERWADAG']} />
);

export const AdminOrInspektoratGuard: React.FC<Omit<AuthGuardProps, 'requireRoles'>> = (props) => (
  <AuthGuard {...props} requireRoles={['ADMIN', 'INSPEKTORAT']} />
);

export const MfaGuard: React.FC<Omit<AuthGuardProps, 'requireMfa'>> = (props) => (
  <AuthGuard {...props} requireMfa={true} />
);

// Public route guard (for login/register pages)
export const PublicRoute: React.FC<{ children: ReactNode; redirectTo?: string }> = ({ 
  children, 
  redirectTo = '/dashboard' 
}) => {
  const { isAuthenticated, loading, user, isSessionValid, checkAuth } = useAuth();

  // Only check authentication on mount if user appears to be authenticated but session might be invalid
  useEffect(() => {
    if (isAuthenticated && user && !isSessionValid()) {
      // Only check auth if session appears to be expired
      checkAuth();
    }
  }, []); // Remove isAuthenticated from deps to prevent loops

  if (loading) {
    // For auth pages, use overlay that preserves the page layout
    return (
      <>
        {children}
        <AuthLoadingOverlay message="Memeriksa autentikasi..." />
      </>
    );
  }

  // If already authenticated with valid session and user data, redirect to dashboard
  if (isAuthenticated && user && isSessionValid()) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};