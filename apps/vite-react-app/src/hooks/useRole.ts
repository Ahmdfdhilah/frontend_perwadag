import { useCallback } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { selectUser } from '@/redux/features/authSlice';

export const useRole = () => {
  const user = useAppSelector(selectUser);
  const currentRole = user?.role || 'PERWADAG';

  const isRole = useCallback((role: string) => {
    return currentRole === role;
  }, [currentRole]);

  const isAdmin = useCallback(() => {
    return currentRole === 'ADMIN';
  }, [currentRole]);

  const isInspektorat = useCallback(() => {
    return currentRole === 'INSPEKTORAT';
  }, [currentRole]);

  const isPimpinan = useCallback(() => {
    return currentRole === 'PIMPINAN';
  }, [currentRole]);

  const isPerwadag = useCallback(() => {
    return currentRole === 'PERWADAG';
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
    isPimpinan,
    isPerwadag,
    hasPermission,
  };
};