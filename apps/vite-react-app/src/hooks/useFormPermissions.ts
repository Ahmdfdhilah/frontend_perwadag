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
    
    // Base permissions for different roles
    const basePermissions = {
      admin: {
        canView: true,
        canEdit: true,
        canCreate: true,
        canDelete: true,
        excludeReadonlyFields: true,
      },
      inspektorat: {
        canView: true,
        canEdit: true,
        canCreate: true,
        canDelete: false,
        excludeReadonlyFields: true,
      },
      perwadag: {
        canView: true,
        canEdit: false,
        canCreate: false,
        canDelete: false,
        excludeReadonlyFields: false,
      },
    };

    // Override permissions based on form type and role
    if (role === 'perwadag') {
      const perwadagOverrides: Partial<Record<FormType, Partial<FormPermission>>> = {
        // Meeting forms - view only
        entry_meeting: { canView: true, canEdit: false },
        exit_meeting: { canView: true, canEdit: false },
        konfirmasi_meeting: { canView: true, canEdit: false },
        
        // Document forms - mostly view only
        surat_tugas: { canView: true, canEdit: false },
        surat_pemberitahuan: { canView: true, canEdit: false },
        laporan_hasil_evaluasi: { canView: true, canEdit: false },
        
        // Kuesioner - can edit
        kuesioner: { canView: true, canEdit: true, canCreate: true },
        
        // Matrix and risk assessment - view only
        matriks: { canView: true, canEdit: false },
        risk_assessment: { canView: true, canEdit: false },
        
        // Templates and user management - view only
        questionnaire_template: { canView: true, canEdit: false },
        user_management: { canView: false, canEdit: false },
      };

      return {
        ...basePermissions[role],
        ...perwadagOverrides[formType],
      };
    }

    return basePermissions[role];
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

  return {
    getFormPermission,
    canViewForm,
    canEditForm,
    canCreateForm,
    canDeleteForm,
    shouldExcludeReadonlyFields,
  };
};