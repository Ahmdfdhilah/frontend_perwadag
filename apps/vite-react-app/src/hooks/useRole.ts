import { useCallback } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { selectUser } from '@/redux/features/authSlice';

export const useRole = () => {
  const user = useAppSelector(selectUser);
  const currentRole = user?.role || 'perwadag';

  const isRole = useCallback((role: string) => {
    return currentRole === role;
  }, [currentRole]);

  const isAdmin = useCallback(() => {
    return currentRole === 'admin';
  }, [currentRole]);

  const isInspektorat = useCallback(() => {
    return currentRole === 'inspektorat';
  }, [currentRole]);

  const isPerwadag = useCallback(() => {
    return currentRole === 'perwadag';
  }, [currentRole]);

  const hasPermission = useCallback((requiredRoles: string[]) => {
    return requiredRoles.includes(currentRole);
  }, [currentRole]);

  return {
    currentRole,
    user,
    isRole,
    isAdmin,
    isInspektorat,
    isPerwadag,
    hasPermission,
  };
};