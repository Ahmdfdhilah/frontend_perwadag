import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Combobox } from '@workspace/ui/components/combobox';
import DatePicker from '@/components/common/DatePicker';
import { SuratTugasResponse } from '@/services/suratTugas/types';
import { PerwadagSummary } from '@/services/users/types';
import { useFormPermissions } from '@/hooks/useFormPermissions';
import FileUpload from '@/components/common/FileUpload';
import FileDeleteConfirmDialog from '@/components/common/FileDeleteConfirmDialog';
import { formatDateForAPI } from '@/utils/timeFormat';
import { suratTugasService } from '@/services/suratTugas';
import { useToast } from '@workspace/ui/components/sonner';

interface SuratTugasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: SuratTugasResponse | null;
  mode: 'view' | 'edit' | 'create';
  onSave: (data: any) => void;
  availablePerwadag: PerwadagSummary[];
}

const SuratTugasDialog: React.FC<SuratTugasDialogProps> = ({
  open,
  onOpenChange,
  editingItem,
  mode,
  onSave,
  availablePerwadag,
}) => {
  const { canEditForm } = useFormPermissions();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    no_surat: '',
    user_perwadag_id: '',
    tanggal_evaluasi_mulai: undefined as Date | undefined,
    tanggal_evaluasi_selesai: undefined as Date | undefined,
  });

  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<Array<{ name: string; url?: string; viewUrl?: string; size?: number; filename?: string }>>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<{ name: string; filename: string } | null>(null);
  const [deletingFile, setDeletingFile] = useState(false);
  const [perwadagSearchValue, setPerwadagSearchValue] = useState('');

  useEffect(() => {
    if (editingItem) {
      setFormData({
        no_surat: editingItem.no_surat,
        user_perwadag_id: editingItem.user_perwadag_id,
        tanggal_evaluasi_mulai: new Date(editingItem.tanggal_evaluasi_mulai),
        tanggal_evaluasi_selesai: editingItem.tanggal_evaluasi_selesai ? new Date(editingItem.tanggal_evaluasi_selesai) : undefined,
      });
      
      // Set existing files for display
      if (editingItem.file_surat_tugas && editingItem.file_metadata) {
        setExistingFiles([{ 
          name: editingItem.file_metadata.original_filename || editingItem.file_metadata.filename || 'Surat Tugas',
          url: editingItem.file_urls?.download_url,
          viewUrl: editingItem.file_urls?.file_url,
          size: editingItem.file_metadata.size,
          filename: editingItem.file_metadata.original_filename || editingItem.file_metadata.filename
        }]);
      } else {
        setExistingFiles([]);
      }
      
      // Reset file to delete when opening dialog
      setFileToDelete(null);
      setDeleteConfirmOpen(false);
    } else {
      setFormData({
        no_surat: '',
        user_perwadag_id: '',
        tanggal_evaluasi_mulai: undefined,
        tanggal_evaluasi_selesai: undefined,
      });
      setUploadFiles([]);
      setExistingFiles([]);
      setFileToDelete(null);
      setDeleteConfirmOpen(false);
    }
    // Reset search when dialog opens/closes
    setPerwadagSearchValue('');
  }, [editingItem, open]);

  const handleSave = async () => {
    // Validate all required fields
    if (!formData.no_surat || !formData.user_perwadag_id || !formData.tanggal_evaluasi_mulai || !formData.tanggal_evaluasi_selesai) {
      return;
    }

    // For create mode, file upload is required
    // For edit mode, file is only required if there's no existing file
    if (mode === 'create' && uploadFiles.length === 0) {
      return;
    }


    const saveData = {
      user_perwadag_id: formData.user_perwadag_id,
      tanggal_evaluasi_mulai: formatDateForAPI(formData.tanggal_evaluasi_mulai),
      tanggal_evaluasi_selesai: formData.tanggal_evaluasi_selesai ? formatDateForAPI(formData.tanggal_evaluasi_selesai) : undefined,
      no_surat: formData.no_surat || '',
      file: uploadFiles.length > 0 ? uploadFiles[0] : null, // Send null instead of undefined
    };

    onSave(saveData);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleUploadFilesChange = (files: File[]) => {
    setUploadFiles(files);
  };

  const handleExistingFileRemove = (index: number) => {
    if (!existingFiles[index] || !existingFiles[index].filename) return;
    
    const fileToRemove = existingFiles[index];
    setFileToDelete({
      name: fileToRemove.name,
      filename: fileToRemove.filename!
    });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!fileToDelete || !editingItem?.id) return;
    
    setDeletingFile(true);
    try {
      await suratTugasService.deleteFile(editingItem.id, fileToDelete.filename);
      
      // Remove from UI
      setExistingFiles([]);
      
      toast({
        title: 'File berhasil dihapus',
        description: `File ${fileToDelete.name} telah dihapus.`,
        variant: 'default'
      });
    } catch (error) {
      console.error('Error deleting file:', error);
    } finally {
      setDeletingFile(false);
      setFileToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  const handleFileDownload = async (file: { name: string; url?: string; viewUrl?: string }) => {
    if (!editingItem?.id) return;
    
    try {
      const blob = await suratTugasService.downloadFile(editingItem.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };


  const isFormValid = formData.no_surat && 
    formData.user_perwadag_id && 
    formData.tanggal_evaluasi_mulai && 
    formData.tanggal_evaluasi_selesai &&
    (mode !== 'create' || uploadFiles.length > 0);
  const isEditable = mode !== 'view';
  const canEdit = canEditForm('surat_tugas') && isEditable;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle>
            {mode === 'view' ? 'Lihat Surat Tugas' : 
             mode === 'edit' ? 'Edit Surat Tugas' : 
             'Tambah Surat Tugas'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="no_surat">Nomor Surat Tugas *</Label>
              <Input
                id="no_surat"
                value={formData.no_surat}
                onChange={(e) => setFormData(prev => ({ ...prev, no_surat: e.target.value }))}
                placeholder="Contoh: ST/001/I/2024"
                disabled={!canEdit}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="perwadag">Perwadag *</Label>
              {mode === 'edit' || !canEdit ? (
                <Input
                  id="perwadag"
                  value={editingItem ? editingItem.nama_perwadag : ''}
                  disabled={true}
                  className="bg-muted"
                />
              ) : (
                <Combobox
                  options={availablePerwadag
                    .filter(perwadag => 
                      perwadagSearchValue === '' || 
                      perwadag.nama.toLowerCase().includes(perwadagSearchValue.toLowerCase()) ||
                      perwadag.inspektorat?.toLowerCase().includes(perwadagSearchValue.toLowerCase())
                    )
                    .map(perwadag => ({
                      value: perwadag.id,
                      label: perwadag.nama,
                      description: perwadag.inspektorat || ''
                    }))}
                  value={formData.user_perwadag_id}
                  onChange={(value) => setFormData(prev => ({ ...prev, user_perwadag_id: value.toString() }))}
                  placeholder="Pilih perwadag"
                  searchPlaceholder="Cari perwadag..."
                  searchValue={perwadagSearchValue}
                  onSearchChange={setPerwadagSearchValue}
                  emptyMessage="Tidak ada perwadag yang ditemukan"
                />
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Tanggal Mulai Evaluasi *</Label>
                <DatePicker
                  value={formData.tanggal_evaluasi_mulai}
                  onChange={(date) => setFormData(prev => ({ ...prev, tanggal_evaluasi_mulai: date }))}
                  placeholder="Pilih tanggal mulai"
                  disabled={!canEdit}
                />
              </div>

              <div className="space-y-2">
                <Label>Tanggal Selesai Evaluasi *</Label>
                <DatePicker
                  value={formData.tanggal_evaluasi_selesai}
                  onChange={(date) => setFormData(prev => ({ ...prev, tanggal_evaluasi_selesai: date }))}
                  placeholder="Pilih tanggal selesai"
                  disabled={!canEdit}
                  disabledDates={(date) => {
                    if (!formData.tanggal_evaluasi_mulai) return false;
                    return date < formData.tanggal_evaluasi_mulai;
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Informasi Upload Surat Tugas</Label>
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                Silakan upload file surat tugas. File yang didukung: PDF, DOC, DOCX.
              </div>
            </div>

            <FileUpload
              label="File Surat Tugas *"
              accept=".pdf,.doc,.docx"
              multiple={false}
              maxSize={10 * 1024 * 1024} // 10MB
              maxFiles={1}
              files={uploadFiles}
              existingFiles={existingFiles}
              mode={canEdit ? 'edit' : 'view'}
              disabled={!canEdit}
              onFilesChange={handleUploadFilesChange}
              onExistingFileRemove={handleExistingFileRemove}
              onFileDownload={handleFileDownload}
              description="Format yang didukung: PDF, DOC, DOCX (Max 10MB)"
            />
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button variant="outline" onClick={handleCancel}>
            {mode === 'view' ? 'Tutup' : 'Batal'}
          </Button>
          {canEdit && (
            <Button onClick={handleSave} disabled={!isFormValid}>
              {mode === 'edit' ? 'Simpan' : 'Buat'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>

      {/* File Delete Confirmation Dialog */}
      <FileDeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        fileName={fileToDelete?.name || ''}
        onConfirm={handleConfirmDelete}
        loading={deletingFile}
      />
    </Dialog>
  );
};

export default SuratTugasDialog;