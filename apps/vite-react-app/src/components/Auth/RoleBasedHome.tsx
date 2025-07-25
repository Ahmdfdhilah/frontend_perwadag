import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { hasRouteAccess } from '@/lib/menus';

export function RoleBasedHome() {
  const { user } = useAuth();

  // Define default routes for each role - all roles default to dashboard
  const getDefaultRouteForRole = (role: string): string => {
    // All roles have access to dashboard, so redirect there by default
    return '/dashboard';
  };

  if (!user?.role) {
    // If user has no role, redirect to dashboard as safe default
    return <Navigate to="/dashboard" replace />;
  }

  const defaultRoute = getDefaultRouteForRole(user.role);
  return <Navigate to={defaultRoute} replace />;
}