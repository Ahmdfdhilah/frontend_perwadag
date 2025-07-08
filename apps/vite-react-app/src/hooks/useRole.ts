import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setRole, resetRole } from '@/redux/features/roleSlice';

export const useRole = () => {
  const dispatch = useAppDispatch();
  const { currentRole, availableRoles } = useAppSelector((state) => state.role);

  const changeRole = useCallback((roleId: string) => {
    dispatch(setRole(roleId));
  }, [dispatch]);

  const resetToDefault = useCallback(() => {
    dispatch(resetRole());
  }, [dispatch]);

  const isRole = useCallback((roleId: string) => {
    return currentRole.id === roleId;
  }, [currentRole.id]);

  const isAdmin = useCallback(() => {
    return currentRole.id === 'admin';
  }, [currentRole.id]);

  const isInspektorat = useCallback(() => {
    return currentRole.id === 'inspektorat';
  }, [currentRole.id]);

  const isPerwadag = useCallback(() => {
    return currentRole.id === 'perwadag';
  }, [currentRole.id]);

  return {
    currentRole,
    availableRoles,
    changeRole,
    resetToDefault,
    isRole,
    isAdmin,
    isInspektorat,
    isPerwadag,
  };
};