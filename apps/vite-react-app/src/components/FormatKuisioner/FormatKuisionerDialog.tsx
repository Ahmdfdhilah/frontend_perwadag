import React, { useState, useEffect } from 'react';
import { useRole } from '@/hooks/useRole';
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
import { Textarea } from '@workspace/ui/components/textarea';
import { FormatKuisionerResponse, FormatKuisionerCreate, FormatKuisionerUpdate } from '@/services/formatKuisioner/types';
import { Download, Loader2 } from 'lucide-react';
import FileUpload from '@/components/common/FileUpload';
import FileDeleteConfirmDialog from '@/components/common/FileDeleteConfirmDialog';
import { formatKuisionerService } from '@/services/formatKuisioner';
import { useToast } from '@workspace/ui/components/sonner';

interface FormatKuisionerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: FormatKuisionerResponse | null;
  mode: 'view' | 'create' | 'edit';
  onSave: () => void;
}

export const FormatKuisionerDialog: React.FC<FormatKuisionerDialogProps> = ({
  open,
  onOpenChange,
  template,
  mode,
  onSave,
}) => {
  const { isAdmin } = useRole();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FormatKuisionerCreate>({
    nama_template: '',
    deskripsi: '',
    tahun: new Date().getFullYear(),
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [existingFiles, setExistingFiles] = useState<Array<{ name: string; url?: string; viewUrl?: string; size?: number; filename: string }>>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<{ name: string; filename: string } | null>(null);
  const [deletingFile, setDeletingFile] = useState(false);

  // Loading states for different operations
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const isCreating = mode === 'create';
  const isEditable = mode === 'edit' || mode === 'create';

  useEffect(() => {
    if (template && open && mode !== 'create') {
      setFormData({
        nama_template: template.nama_template,
        deskripsi: template.deskripsi || '',
        tahun: template.tahun,
      });

      // Set existing files for display
      setExistingFiles(template.has_file ? [{
        name: template.file_metadata?.original_filename || template.file_metadata?.filename || template.nama_template,
        url: template.file_urls?.file_url,
        viewUrl: template.file_urls?.view_url,
        size: template.file_metadata?.size,
        filename: template.file_metadata?.original_filename || template.file_metadata?.filename || ''
      }] : []);
    } else if (mode === 'create') {
      // Initialize empty form for new template
      setFormData({
        nama_template: '',
        deskripsi: '',
        tahun: new Date().getFullYear(),
      });
      setUploadFile(null);
      setExistingFiles([]);
    }

    // Reset states when dialog opens/closes
    setFileToDelete(null);
    setDeleteConfirmOpen(false);
    setIsSaving(false);
    setIsDownloading(false);
  }, [template, open, mode]);

  const handleSave = async () => {
    if (!isFormValid || isSaving) {
      return;
    }

    setIsSaving(true);
    try {
      if (isCreating) {
        // Create new template
        await formatKuisionerService.createFormatKuisioner(formData, uploadFile || undefined);
        toast({
          title: 'Template Dibuat',
          description: `Template "${formData.nama_template}" berhasil dibuat.`,
          variant: 'default'
        });
      } else if (template) {
        // Update existing template
        const updateData: FormatKuisionerUpdate = {
          nama_template: formData.nama_template !== template.nama_template ? formData.nama_template : undefined,
          deskripsi: formData.deskripsi !== (template.deskripsi || '') ? formData.deskripsi : undefined,
          tahun: formData.tahun !== template.tahun ? formData.tahun : undefined,
        };

        // Only update if there are actual changes
        if (Object.values(updateData).some(value => value !== undefined)) {
          await formatKuisionerService.updateFormatKuisioner(template.id, updateData);
        }
        
        // Handle file upload if any
        if (uploadFile) {
          await formatKuisionerService.uploadFile(template.id, uploadFile);
        }

        toast({
          title: 'Template Diperbarui',
          description: `Template "${formData.nama_template}" berhasil diperbarui.`,
          variant: 'default'
        });
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: 'Gagal Menyimpan',
        description: 'Terjadi kesalahan saat menyimpan template.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (isSaving || isDownloading || deletingFile) {
      return;
    }
    onOpenChange(false);
  };

  const handleUploadFileChange = (files: File[]) => {
    if (isSaving) return;
    setUploadFile(files[0] || null);
  };

  const handleDownloadTemplate = async () => {
    if (!template?.id || isDownloading) return;

    setIsDownloading(true);
    try {
      const blob = await formatKuisionerService.downloadTemplate(template.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = template.file_metadata?.original_filename || `template_${template.nama_template}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Download Berhasil',
        description: 'Template berhasil didownload.',
        variant: 'default'
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: 'Gagal Download',
        description: 'Terjadi kesalahan saat download template.',
        variant: 'destructive'
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleExistingFileRemove = () => {
    if (isSaving || !existingFiles[0] || !existingFiles[0].filename) return;

    const fileToRemove = existingFiles[0];
    setFileToDelete({
      name: fileToRemove.name,
      filename: fileToRemove.filename
    });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!fileToDelete || !template?.id || deletingFile) return;

    setDeletingFile(true);
    try {
      await formatKuisionerService.deleteFile(template.id, fileToDelete.filename);

      // Remove from UI
      setExistingFiles([]);

      toast({
        title: 'File Dihapus',
        description: `File ${fileToDelete.name} berhasil dihapus.`,
        variant: 'default'
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: 'Gagal Hapus File',
        description: 'Terjadi kesalahan saat menghapus file.',
        variant: 'destructive'
      });
    } finally {
      setDeletingFile(false);
      setFileToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  const handleFileDownload = async (file: { name: string; url?: string; viewUrl?: string }) => {
    if (!template?.id || isDownloading) return;

    setIsDownloading(true);
    try {
      const blob = await formatKuisionerService.downloadTemplate(template.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Download Berhasil',
        description: 'File berhasil didownload.',
        variant: 'default'
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: 'Gagal Download',
        description: 'Terjadi kesalahan saat download file.',
        variant: 'destructive'
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const isFormValid = formData.nama_template.trim() &&
    formData.deskripsi?.trim() &&
    formData.tahun &&
    (isCreating ? uploadFile : true); // For create mode, file is required

  const isOperationInProgress = isSaving || isDownloading || deletingFile;

  const getDialogTitle = () => {
    switch (mode) {
      case 'view':
        return 'Detail Template Format Kuisioner';
      case 'create':
        return 'Tambah Template Format Kuisioner';
      case 'edit':
        return 'Edit Template Format Kuisioner';
      default:
        return 'Template Format Kuisioner';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nama_template">Nama Template *</Label>
              <Input
                id="nama_template"
                value={formData.nama_template || ''}
                onChange={(e) => setFormData({ ...formData, nama_template: e.target.value })}
                disabled={!isEditable || isSaving}
                className={(!isEditable || isSaving) ? "bg-muted" : ""}
                placeholder="Nama template format kuisioner"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi Template *</Label>
              <Textarea
                id="deskripsi"
                value={formData.deskripsi || ''}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                disabled={!isEditable || isSaving}
                className={(!isEditable || isSaving) ? "bg-muted" : ""}
                placeholder="Deskripsi template format kuisioner"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tahun">Tahun *</Label>
              <Input
                id="tahun"
                type="number"
                value={formData.tahun || ''}
                onChange={(e) => setFormData({ ...formData, tahun: parseInt(e.target.value) || new Date().getFullYear() })}
                disabled={!isEditable || isSaving}
                className={(!isEditable || isSaving) ? "bg-muted" : ""}
                placeholder="Tahun"
                min="2020"
                max="2030"
              />
            </div>

            <FileUpload
              label="Upload Dokumen Template"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              multiple={false}
              maxSize={10 * 1024 * 1024} // 10MB
              maxFiles={1}
              files={uploadFile ? [uploadFile] : []}
              existingFiles={existingFiles}
              mode={isEditable && !isSaving ? 'edit' : 'view'}
              disabled={!isEditable || isSaving}
              onFilesChange={handleUploadFileChange}
              onExistingFileRemove={handleExistingFileRemove}
              onFileDownload={handleFileDownload}
              description="Format yang didukung: PDF, DOC, DOCX, XLS, XLSX (Max 10MB)"
            />
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isOperationInProgress}
          >
            {mode === 'view' ? 'Tutup' : 'Batal'}
          </Button>

          {mode === 'view' && template?.has_file && (
            <Button
              onClick={handleDownloadTemplate}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </>
              )}
            </Button>
          )}

          {isEditable && isAdmin() && (
            <Button
              onClick={handleSave}
              disabled={!isFormValid || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isCreating ? 'Menyimpan...' : 'Memperbarui...'}
                </>
              ) : (
                'Simpan'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>

      {/* File Delete Confirmation Dialog */}
      <FileDeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={(open) => {
          if (!deletingFile) {
            setDeleteConfirmOpen(open);
          }
        }}
        fileName={fileToDelete?.name || ''}
        onConfirm={handleConfirmDelete}
        loading={deletingFile}
      />
    </Dialog>
  );
};