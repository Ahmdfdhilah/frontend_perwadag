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

export interface TemuanFormData {
  kondisi: string;
  kriteria: string;
  rekomendasi: string;
}

interface TemuanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingIndex: number | null;
  formData: TemuanFormData;
  onFormDataChange: (data: TemuanFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
  validationErrors?: {
    kondisi?: string;
    kriteria?: string;
    rekomendasi?: string;
  };
  isSaving?: boolean;
}

const TemuanFormDialog: React.FC<TemuanFormDialogProps> = ({
  open,
  onOpenChange,
  editingIndex,
  formData,
  onFormDataChange,
  onSubmit,
  onCancel,
  validationErrors = {},
  isSaving = false,
}) => {
  const handleInputChange = (field: keyof TemuanFormData, value: string) => {
    onFormDataChange({
      ...formData,
      [field]: value,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle>
            {editingIndex !== null ? `Edit Temuan ${editingIndex + 1}` : 'Tambah Temuan Rekomendasi'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="form-kondisi">Kondisi <span className="text-red-500">*</span></Label>
            <Textarea
              id="form-kondisi"
              value={formData.kondisi}
              onChange={(e) => handleInputChange('kondisi', e.target.value)}
              placeholder="Masukkan kondisi yang ditemukan..."
              rows={4}
              disabled={isSaving}
              className={validationErrors.kondisi ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {validationErrors.kondisi && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.kondisi}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="form-kriteria">Kriteria <span className="text-red-500">*</span></Label>
            <Textarea
              id="form-kriteria"
              value={formData.kriteria}
              onChange={(e) => handleInputChange('kriteria', e.target.value)}
              placeholder="Masukkan kriteria/standar yang harus dipenuhi..."
              rows={4}
              disabled={isSaving}
              className={validationErrors.kriteria ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {validationErrors.kriteria && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.kriteria}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="form-rekomendasi">Rekomendasi <span className="text-red-500">*</span></Label>
            <Textarea
              id="form-rekomendasi"
              value={formData.rekomendasi}
              onChange={(e) => handleInputChange('rekomendasi', e.target.value)}
              placeholder="Masukkan rekomendasi perbaikan..."
              rows={4}
              disabled={isSaving}
              className={validationErrors.rekomendasi ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {validationErrors.rekomendasi && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.rekomendasi}</p>
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
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : (
              editingIndex !== null ? 'Update' : 'Simpan'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemuanFormDialog;