import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Button } from '@workspace/ui/components/button';
import { Label } from '@workspace/ui/components/label';
import { Textarea } from '@workspace/ui/components/textarea';
import { Loader2 } from 'lucide-react';
import { isValidUrl, URL_VALIDATION_MESSAGES } from '@/utils/urlValidation';

export interface TindakLanjutFormData {
  tindak_lanjut: string;
  dokumen_pendukung_tindak_lanjut: string;
  catatan_evaluator: string;
}

export interface TindakLanjutFieldPermissions {
  canEditTindakLanjut: boolean;
  canEditDokumen: boolean;
  canEditCatatan: boolean;
}

interface TindakLanjutFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingIndex: number | null;
  formData: TindakLanjutFormData;
  onFormDataChange: (data: TindakLanjutFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
  fieldPermissions: TindakLanjutFieldPermissions;
  isSaving?: boolean;
}

const TindakLanjutFormDialog: React.FC<TindakLanjutFormDialogProps> = ({
  open,
  onOpenChange,
  editingIndex,
  formData,
  onFormDataChange,
  onSubmit,
  onCancel,
  fieldPermissions,
  isSaving = false,
}) => {
  const handleInputChange = (field: keyof TindakLanjutFormData, value: string) => {
    onFormDataChange({
      ...formData,
      [field]: value,
    });
  };

  const isFormValid = () => {
    return isValidUrl(formData.dokumen_pendukung_tindak_lanjut);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle>
            Edit Tindak Lanjut {editingIndex !== null ? editingIndex + 1 : ''}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Tindak Lanjut Field */}
            <div className="space-y-2">
              <Label htmlFor="form-tindak-lanjut">
                Tindak Lanjut {fieldPermissions.canEditTindakLanjut && <span className="text-red-500">*</span>}
              </Label>
              <Textarea
                id="form-tindak-lanjut"
                value={formData.tindak_lanjut}
                onChange={(e) => handleInputChange('tindak_lanjut', e.target.value)}
                placeholder="Masukkan tindak lanjut..."
                rows={4}
                disabled={isSaving || !fieldPermissions.canEditTindakLanjut}
                className={!fieldPermissions.canEditTindakLanjut ? 'bg-muted cursor-not-allowed' : ''}
              />
              {!fieldPermissions.canEditTindakLanjut && (
                <p className="text-xs text-muted-foreground">Anda tidak memiliki izin untuk mengedit field ini</p>
              )}
            </div>

            {/* Dokumen Pendukung Field */}
            <div className="space-y-2">
              <Label htmlFor="form-dokumen">
                Dokumen Pendukung Tindak Lanjut {fieldPermissions.canEditDokumen && <span className="text-red-500">*</span>}
              </Label>
              <Textarea
                id="form-dokumen"
                value={formData.dokumen_pendukung_tindak_lanjut}
                onChange={(e) => handleInputChange('dokumen_pendukung_tindak_lanjut', e.target.value)}
                placeholder={URL_VALIDATION_MESSAGES.PLACEHOLDER}
                rows={4}
                disabled={isSaving || !fieldPermissions.canEditDokumen}
                className={!fieldPermissions.canEditDokumen ? 'bg-muted cursor-not-allowed' : ''}
              />
              {!fieldPermissions.canEditDokumen ? (
                <p className="text-xs text-muted-foreground">Anda tidak memiliki izin untuk mengedit field ini</p>
              ) : (
                <>
                  {formData.dokumen_pendukung_tindak_lanjut && !isValidUrl(formData.dokumen_pendukung_tindak_lanjut) && (
                    <p className="text-xs text-red-500">
                      {URL_VALIDATION_MESSAGES.INVALID}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {URL_VALIDATION_MESSAGES.EXAMPLE}
                  </p>
                </>
              )}
            </div>

            {/* Catatan Evaluator Field */}
            <div className="space-y-2">
              <Label htmlFor="form-catatan">
                Catatan Evaluator {fieldPermissions.canEditCatatan && <span className="text-red-500">*</span>}
              </Label>
              <Textarea
                id="form-catatan"
                value={formData.catatan_evaluator}
                onChange={(e) => handleInputChange('catatan_evaluator', e.target.value)}
                placeholder="Masukkan catatan evaluator..."
                rows={4}
                disabled={isSaving || !fieldPermissions.canEditCatatan}
                className={!fieldPermissions.canEditCatatan ? 'bg-muted cursor-not-allowed' : ''}
              />
              {!fieldPermissions.canEditCatatan && (
                <p className="text-xs text-muted-foreground">Anda tidak memiliki izin untuk mengedit field ini</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
          >
            Batal
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isSaving || !isFormValid() || (!fieldPermissions.canEditTindakLanjut && !fieldPermissions.canEditDokumen && !fieldPermissions.canEditCatatan)}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : (
              'Update'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TindakLanjutFormDialog;