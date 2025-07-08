import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '@/redux/store';
import { hasRouteAccess, type UserRole } from '@/lib/menus';

interface RoleProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
  fallback?: ReactNode;
  requireRoles?: boolean; 
}

export function RoleProtectedRoute({
  children,
  allowedRoles = [],
  redirectTo = '/dashboard',
  fallback,
  requireRoles = false
}: RoleProtectedRouteProps) {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Get user role names
  const userRoles = user?.roles?.map(role => role.name) || [];
  const hasRoles = userRoles.length > 0;

  // If route requires roles but user has none, redirect to home
  if (requireRoles && !hasRoles) {
    return <Navigate to="/" replace />;
  }

  // If no specific roles required, allow access to authenticated users
  if (allowedRoles.length === 0) {
    return <>{children}</>;
  }

  // Check if user has any of the required roles
  const hasAccess = allowedRoles.some(role => userRoles.includes(role));

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

// Guard for routes that require user to have ANY role assigned
export function RequireRoles({ 
  children, 
  redirectTo = '/dashboard',
  fallback 
}: { 
  children: ReactNode; 
  redirectTo?: string;
  fallback?: ReactNode;
}) {
  return (
    <RoleProtectedRoute 
      requireRoles={true} 
      redirectTo={redirectTo}
      fallback={fallback}
    >
      {children}
    </RoleProtectedRoute>
  );
}

// Guard for routes that are ONLY for users without roles
export function NoRolesOnly({ 
  children, 
  redirectTo = '/dashboard',
  fallback 
}: { 
  children: ReactNode; 
  redirectTo?: string;
  fallback?: ReactNode;
}) {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRoles = user?.roles?.map(role => role.name) || [];
  const hasRoles = userRoles.length > 0;

  // If user has roles, redirect them away from this route
  if (hasRoles) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

// Guard for home page accessible to users with or without roles
export function HomePageGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Hook to check role access in components
export function useRoleAccess() {
  const user = useSelector((state: RootState) => state.auth.user);
  
  const userRoles = user?.roles?.map(role => role.name) || [];
  const hasRoles = userRoles.length > 0;

  const hasRole = (role: UserRole | UserRole[]) => {
    const rolesToCheck = Array.isArray(role) ? role : [role];
    return rolesToCheck.some(r => userRoles.includes(r));
  };

  const hasAnyRole = (roles: UserRole[]) => {
    return roles.some(role => userRoles.includes(role));
  };

  const hasAllRoles = (roles: UserRole[]) => {
    return roles.every(role => userRoles.includes(role));
  };

  const canAccessRoute = (path: string) => {
    return hasRouteAccess(path, userRoles);
  };

  const isMasterAdmin = hasRole('master_admin');
  const isAdmin = hasRole('admin');
  const isUser = hasRole('user');

  return {
    userRoles,
    hasRoles,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    canAccessRoute,
    isMasterAdmin,
    isAdmin,
    isUser,
  };
}