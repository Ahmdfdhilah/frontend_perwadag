import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Button } from '@workspace/ui/components/button';
import { Label } from '@workspace/ui/components/label';
import { MatriksResponse } from '@/services/matriks/types';
import { useFormPermissions } from '@/hooks/useFormPermissions';
import { formatIndonesianDateRange } from '@/utils/timeFormat';
import FileUpload from '@/components/common/FileUpload';

interface MatriksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MatriksResponse | null;
  mode: 'edit';
  onSave?: (data: any) => void;
}

const MatriksDialog: React.FC<MatriksDialogProps> = ({
  open,
  onOpenChange,
  item,
  mode,
  onSave,
}) => {
  const { canEditForm } = useFormPermissions();
  const isEditable = mode === 'edit';
  const canEdit = canEditForm('matriks') && isEditable;
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  useEffect(() => {
    if (item && open) {
    } else {
      setUploadFile(null);
    }
  }, [item, open]);

  const handleUploadFileChange = (files: File[]) => {
    setUploadFile(files[0] || null);
  };


  const handleSave = () => {
    if (!onSave) return;

    const dataToSave = {
      file: uploadFile,
    };
    onSave(dataToSave);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle>
            Edit Matriks
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-6">
            {/* Basic Info - Read Only */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Nama Perwadag</Label>
                <div className="p-3 bg-muted rounded-md">
                  {item?.nama_perwadag}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Periode Evaluasi</Label>
              <div className="p-3 bg-muted rounded-md">
                {item ? formatIndonesianDateRange(item.tanggal_evaluasi_mulai, item.tanggal_evaluasi_selesai) : '-'}
              </div>
            </div>


            {/* File Upload */}
            {canEdit && (
              <FileUpload
                label="Upload File Matriks (Optional)"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                multiple={false}
                maxSize={10 * 1024 * 1024} // 10MB
                files={uploadFile ? [uploadFile] : []}
                existingFiles={item?.has_file ? [{
                  name: item.file_metadata?.original_filename || 'Matriks',
                  url: item.file_urls?.view_url,
                  size: item.file_metadata?.size_mb ? Math.round(item.file_metadata.size_mb * 1024 * 1024) : undefined
                }] : []}
                mode="edit"
                onFilesChange={handleUploadFileChange}
                description="Format yang didukung: PDF, DOC, DOCX, XLS, XLSX (Max 10MB)"
              />
            )}

            {/* Status Information */}
            <div className="space-y-2">
              <Label>Status Kelengkapan</Label>
              <div className="p-3 bg-muted rounded-md">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${item?.is_completed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {item?.is_completed ? 'Lengkap' : 'Belum Lengkap'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Batal
          </Button>
          {canEdit && onSave && (
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