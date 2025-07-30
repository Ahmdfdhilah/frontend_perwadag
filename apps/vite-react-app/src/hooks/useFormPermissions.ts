import { useCallback } from 'react';
import { useRole } from '@/hooks/useRole';

export type FormType = 
  | 'entry_meeting'
  | 'exit_meeting'
  | 'konfirmasi_meeting'
  | 'surat_tugas'
  | 'surat_pemberitahuan'
  | 'kuesioner'
  | 'matriks'
  | 'laporan_hasil_evaluasi'
  | 'risk_assessment'
  | 'questionnaire_template'
  | 'user_management';

export interface FormPermission {
  canView: boolean;
  canEdit: boolean;
  canCreate: boolean;
  canDelete: boolean;
  excludeReadonlyFields: boolean;
}

export const useFormPermissions = () => {
  const { isAdmin, isInspektorat, isPerwadag } = useRole();

  const getFormPermission = useCallback((formType: FormType): FormPermission => {
    const role = isAdmin() ? 'admin' : isInspektorat() ? 'inspektorat' : 'perwadag';
    
    // Define permissions based on mapping requirements
    const permissions: Record<FormType, Record<string, FormPermission>> = {
      // Risk Assessment: Admin (R,U), Inspektorat (X), Perwadag (X)
      risk_assessment: {
        admin: { canView: true, canEdit: true, canCreate: false, canDelete: false, excludeReadonlyFields: true },
        inspektorat: { canView: false, canEdit: false, canCreate: false, canDelete: false, excludeReadonlyFields: false },
        perwadag: { canView: false, canEdit: false, canCreate: false, canDelete: false, excludeReadonlyFields: false },
      },
      
      // Surat Tugas: Admin (CRUD), Inspektorat (CRUD), Perwadag (R)
      surat_tugas: {
        admin: { canView: true, canEdit: true, canCreate: true, canDelete: true, excludeReadonlyFields: true },
        inspektorat: { canView: true, canEdit: true, canCreate: true, canDelete: true, excludeReadonlyFields: true },
        perwadag: { canView: true, canEdit: false, canCreate: false, canDelete: false, excludeReadonlyFields: false },
      },
      
      // Surat Pemberitahuan: Admin (RU), Inspektorat (RU), Perwadag (R)
      surat_pemberitahuan: {
        admin: { canView: true, canEdit: true, canCreate: false, canDelete: false, excludeReadonlyFields: true },
        inspektorat: { canView: true, canEdit: true, canCreate: false, canDelete: false, excludeReadonlyFields: true },
        perwadag: { canView: true, canEdit: false, canCreate: false, canDelete: false, excludeReadonlyFields: false },
      },
      
      // Kuesioner: Admin (RU), Inspektorat (RU), Perwadag (RU)
      kuesioner: {
        admin: { canView: true, canEdit: true, canCreate: false, canDelete: false, excludeReadonlyFields: true },
        inspektorat: { canView: true, canEdit: true, canCreate: false, canDelete: false, excludeReadonlyFields: true },
        perwadag: { canView: true, canEdit: true, canCreate: false, canDelete: false, excludeReadonlyFields: true },
      },
      
      // Entry Meeting: Admin (RU), Inspektorat (RU), Perwadag (RU)
      entry_meeting: {
        admin: { canView: true, canEdit: true, canCreate: false, canDelete: false, excludeReadonlyFields: true },
        inspektorat: { canView: true, canEdit: true, canCreate: false, canDelete: false, excludeReadonlyFields: true },
        perwadag: { canView: true, canEdit: true, canCreate: false, canDelete: false, excludeReadonlyFields: true },
      },
      
      // Exit Meeting: Admin (RU), Inspektorat (RU), Perwadag (RU)
      exit_meeting: {
        admin: { canView: true, canEdit: true, canCreate: false, canDelete: false, excludeReadonlyFields: true },
        inspektorat: { canView: true, canEdit: true, canCreate: false, canDelete: false, excludeReadonlyFields: true },
        perwadag: { canView: true, canEdit: true, canCreate: false, canDelete: false, excludeReadonlyFields: true },
      },
      
      // Konfirmasi Meeting: Admin (RU), Inspektorat (RU), Perwadag (RU)
      konfirmasi_meeting: {
        admin: { canView: true, canEdit: true, canCreate: false, canDelete: false, excludeReadonlyFields: true },
        inspektorat: { canView: true, canEdit: true, canCreate: false, canDelete: false, excludeReadonlyFields: true },
        perwadag: { canView: true, canEdit: true, canCreate: false, canDelete: false, excludeReadonlyFields: true },
      },
      
      // Matriks: Admin (RU), Inspektorat (RU), Perwadag (R)
      matriks: {
        admin: { canView: true, canEdit: true, canCreate: false, canDelete: false, excludeReadonlyFields: true },
        inspektorat: { canView: true, canEdit: true, canCreate: false, canDelete: false, excludeReadonlyFields: true },
        perwadag: { canView: true, canEdit: false, canCreate: false, canDelete: false, excludeReadonlyFields: false },
      },
      
      // Laporan Hasil: Admin (RU), Inspektorat (X), Perwadag (X)
      laporan_hasil_evaluasi: {
        admin: { canView: true, canEdit: true, canCreate: false, canDelete: false, excludeReadonlyFields: true },
        inspektorat: { canView: true, canEdit: true, canCreate: false, canDelete: false, excludeReadonlyFields: true },
        perwadag: { canView: true, canEdit: false, canCreate: false, canDelete: false, excludeReadonlyFields: false },
      },
      
      // Default permissions for other forms
      questionnaire_template: {
        admin: { canView: true, canEdit: true, canCreate: true, canDelete: true, excludeReadonlyFields: true },
        inspektorat: { canView: true, canEdit: false, canCreate: false, canDelete: false, excludeReadonlyFields: false },
        perwadag: { canView: true, canEdit: false, canCreate: false, canDelete: false, excludeReadonlyFields: false },
      },
      
      user_management: {
        admin: { canView: true, canEdit: true, canCreate: true, canDelete: true, excludeReadonlyFields: true },
        inspektorat: { canView: false, canEdit: false, canCreate: false, canDelete: false, excludeReadonlyFields: false },
        perwadag: { canView: false, canEdit: false, canCreate: false, canDelete: false, excludeReadonlyFields: false },
      },
    };

    return permissions[formType]?.[role] || {
      canView: false,
      canEdit: false,
      canCreate: false,
      canDelete: false,
      excludeReadonlyFields: false,
    };
  }, [isAdmin, isInspektorat, isPerwadag]);

  const canViewForm = useCallback((formType: FormType): boolean => {
    return getFormPermission(formType).canView;
  }, [getFormPermission]);

  const canEditForm = useCallback((formType: FormType): boolean => {
    return getFormPermission(formType).canEdit;
  }, [getFormPermission]);

  const canCreateForm = useCallback((formType: FormType): boolean => {
    return getFormPermission(formType).canCreate;
  }, [getFormPermission]);

  const canDeleteForm = useCallback((formType: FormType): boolean => {
    return getFormPermission(formType).canDelete;
  }, [getFormPermission]);

  const shouldExcludeReadonlyFields = useCallback((formType: FormType): boolean => {
    return getFormPermission(formType).excludeReadonlyFields;
  }, [getFormPermission]);

  const hasPageAccess = useCallback((formType: FormType): boolean => {
    return getFormPermission(formType).canView;
  }, [getFormPermission]);

  return {
    getFormPermission,
    canViewForm,
    canEditForm,
    canCreateForm,
    canDeleteForm,
    shouldExcludeReadonlyFields,
    hasPageAccess,
  };
};