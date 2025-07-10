import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Button } from '@workspace/ui/components/button';
import { Matriks } from '@/mocks/matriks';
import { useFormPermissions } from '@/hooks/useFormPermissions';
import FileUpload from '@/components/common/FileUpload';

interface MatriksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Matriks | null;
  mode?: 'view' | 'edit' | 'create';
  onSave: (data: Partial<Matriks>) => void;
}

const MatriksDialog: React.FC<MatriksDialogProps> = ({
  open,
  onOpenChange,
  item,
  mode = item ? 'edit' : 'create',
  onSave,
}) => {
  const { canEditForm } = useFormPermissions();
  const isEditable = mode !== 'view';
  const canEdit = canEditForm('matriks') && isEditable;
  const [formData, setFormData] = useState<Partial<Matriks>>({});
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<Array<{ name: string; url?: string }>>([]);

  useEffect(() => {
    if (item && open) {
      setFormData({
        ...item,
      });
      setExistingFiles(item.uploadFile ? [{ name: item.uploadFile, url: item.uploadFileUrl }] : []);
    } else {
      setFormData({});
      setUploadFiles([]);
      setExistingFiles([]);
    }
  }, [item, open]);

  const handleUploadFilesChange = (files: File[]) => {
    setUploadFiles(files);
  };

  const handleExistingFileRemove = (index: number) => {
    setExistingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const dataToSave = { 
      ...formData,
      uploadFiles
    };
    onSave(dataToSave);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle>Edit Matriks</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-6">
            <FileUpload
              label="Upload Dokumen Matriks"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              multiple={false}
              maxSize={10 * 1024 * 1024} // 10MB
              maxFiles={1}
              files={uploadFiles}
              existingFiles={existingFiles}
              mode={canEdit ? 'edit' : 'view'}
              disabled={!canEdit}
              onFilesChange={handleUploadFilesChange}
              onExistingFileRemove={handleExistingFileRemove}
              description="Format yang didukung: PDF, DOC, DOCX, XLS, XLSX (Max 10MB)"
            />
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Batal
          </Button>
          {canEdit && (
            <Button onClick={handleSave}>
              Simpan
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MatriksDialog;