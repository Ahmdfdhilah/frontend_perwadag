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
import { FormatKuisionerResponse } from '@/services/formatKuisioner/types';
import { Download } from 'lucide-react';
import FileUpload from '@/components/common/FileUpload';
import FileDeleteConfirmDialog from '@/components/common/FileDeleteConfirmDialog';
import { formatKuisionerService } from '@/services/formatKuisioner';
import { useToast } from '@workspace/ui/components/sonner';

interface QuestionnaireFormData {
  nama_template: string;
  deskripsi: string;
  tahun: number;
  file?: File;
}

interface QuestionnaireDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: FormatKuisionerResponse | null;
  mode: 'view' | 'edit';
  onSave: (data: QuestionnaireFormData) => void;
}

const QuestionnaireDialog: React.FC<QuestionnaireDialogProps> = ({
  open,
  onOpenChange,
  item,
  mode,
  onSave,
}) => {
  const { isAdmin } = useRole();
  const { toast } = useToast();
  const [formData, setFormData] = useState<QuestionnaireFormData>({
    nama_template: '',
    deskripsi: '',
    tahun: new Date().getFullYear(),
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [existingFiles, setExistingFiles] = useState<Array<{ name: string; url?: string; viewUrl?: string; size?: number; filename: string }>>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<{ name: string; filename: string } | null>(null);
  const [deletingFile, setDeletingFile] = useState(false);

  const isCreating = !item;
  const isEditable = mode === 'edit' && isAdmin();

  useEffect(() => {
    if (item && open) {
      setFormData({
        nama_template: item.nama_template,
        deskripsi: item.deskripsi || '',
        tahun: item.tahun,
      });
      
      // Set existing files for display
      setExistingFiles(item.has_file ? [{
        name: item.file_metadata?.original_filename || item.file_metadata?.filename || item.nama_template,
        url: item.file_urls?.file_url,
        viewUrl: item.file_urls?.view_url,
        size: item.file_metadata?.size,
        filename: item.file_metadata?.original_filename || item.file_metadata?.filename
      }] : []);
    } else {
      // Initialize empty form for new template
      setFormData({
        nama_template: '',
        deskripsi: '',
        tahun: new Date().getFullYear(),
      });
      setUploadFile(null);
      setExistingFiles([]);
      setFileToDelete(null);
      setDeleteConfirmOpen(false);
    }
  }, [item, open]);

  const handleSave = async () => {
    // Skip validation if form is invalid
    if (!isFormValid) {
      return;
    }

    const dataToSave = {
      ...formData,
      nama_template: formData.nama_template || '',
      deskripsi: formData.deskripsi || '',
      file: uploadFile || undefined,
    };
    onSave(dataToSave);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleUploadFileChange = (files: File[]) => {
    setUploadFile(files[0] || null);
  };

  const handleDownloadTemplate = async () => {
    if (!item?.id) return;
    
    try {
      const blob = await formatKuisionerService.downloadTemplate(item.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = item.file_metadata?.original_filename || `template_${item.nama_template}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleExistingFileRemove = () => {
    if (!existingFiles[0] || !existingFiles[0].filename) return;
    
    const fileToRemove = existingFiles[0];
    setFileToDelete({
      name: fileToRemove.name,
      filename: fileToRemove.filename
    });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!fileToDelete || !item?.id) return;
    
    setDeletingFile(true);
    try {
      await formatKuisionerService.deleteFile(item.id, fileToDelete.filename);
      
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
    if (!item?.id) return;
    
    try {
      const blob = await formatKuisionerService.downloadTemplate(item.id);
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

  const isFormValid = formData.nama_template.trim() && 
    formData.deskripsi.trim() && 
    formData.tahun &&
    isAdmin();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle>
            {mode === 'view' ? 'Lihat Template Kuesioner' : isCreating ? 'Tambah Template Kuesioner' : 'Edit Template Kuesioner'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nama_template">Nama Template *</Label>
              <Input
                id="nama_template"
                value={formData.nama_template || ''}
                onChange={(e) => setFormData({ ...formData, nama_template: e.target.value })}
                disabled={!isEditable}
                className={!isEditable ? "bg-muted" : ""}
                placeholder="Nama template kuesioner"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi Template *</Label>
              <Textarea
                id="deskripsi"
                value={formData.deskripsi || ''}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                disabled={!isEditable}
                className={!isEditable ? "bg-muted" : ""}
                placeholder="Deskripsi template kuesioner"
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
                disabled={!isEditable}
                className={!isEditable ? "bg-muted" : ""}
                placeholder="Tahun"
                min="2000"
                max="2099"
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
              mode={isEditable ? 'edit' : 'view'}
              disabled={!isEditable}
              onFilesChange={handleUploadFileChange}
              onExistingFileRemove={handleExistingFileRemove}
              onFileDownload={handleFileDownload}
              description="Format yang didukung: PDF, DOC, DOCX, XLS, XLSX (Max 10MB)"
            />
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button variant="outline" onClick={handleCancel}>
            {mode === 'view' ? 'Tutup' : 'Batal'}
          </Button>
          {mode === 'view' && item?.has_file && (
            <Button onClick={handleDownloadTemplate}>
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>
          )}
          {mode === 'edit' && isAdmin() && (
            <Button onClick={handleSave} disabled={!isFormValid}>
              Simpan
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

export default QuestionnaireDialog;