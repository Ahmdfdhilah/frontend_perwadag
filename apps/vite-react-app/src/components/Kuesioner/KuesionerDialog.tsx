import React, { useState, useEffect } from 'react';
import { useFormPermissions } from '@/hooks/useFormPermissions';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Button } from '@workspace/ui/components/button';
import { Label } from '@workspace/ui/components/label';
import { Input } from '@workspace/ui/components/input';
import DatePicker from '@/components/common/DatePicker';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { KuisionerResponse } from '@/services/kuisioner/types';
import { formatIndonesianDateRange, formatDateForAPI } from '@/utils/timeFormat';
import FileUpload from '@/components/common/FileUpload';
import FileDeleteConfirmDialog from '@/components/common/FileDeleteConfirmDialog';
import { kuisionerService } from '@/services/kuisioner';
import { useToast } from '@workspace/ui/components/sonner';
import { Loader2, ExternalLink } from 'lucide-react';
import { isValidUrl, URL_VALIDATION_MESSAGES } from '@/utils/urlValidation';

interface KuesionerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: KuisionerResponse | null;
  mode: 'view' | 'edit';
  onSave: (data: any) => void;
}

const KuesionerDialog: React.FC<KuesionerDialogProps> = ({
  open,
  onOpenChange,
  item,
  mode,
  onSave,
}) => {
  const { canEditForm } = useFormPermissions();
  const { toast } = useToast();
  const [formData, setFormData] = useState<any>({});
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<Array<{ name: string; url?: string; viewUrl?: string; size?: number; filename?: string }>>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<{ name: string; filename: string } | null>(null);
  const [deletingFile, setDeletingFile] = useState(false);

  // Loading states for different operations
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (item && open) {
      setFormData({
        tanggal_kuisioner: item.tanggal_kuisioner,
        link_dokumen_data_dukung: item.link_dokumen_data_dukung || '',
      });
      setSelectedDate(item.tanggal_kuisioner ? new Date(item.tanggal_kuisioner) : undefined);

      // Set existing files for display
      if (item.has_file && item.file_metadata) {
        setExistingFiles([{
          name: item.file_metadata.original_filename || item.file_metadata.filename || 'Kuesioner',
          url: item.file_urls?.download_url,
          viewUrl: item.file_urls?.file_url,
          size: item.file_metadata.size,
          filename: item.file_metadata.original_filename || item.file_metadata.filename
        }]);
      } else {
        setExistingFiles([]);
      }
    } else {
      setFormData({
        tanggal_kuisioner: '',
        link_dokumen_data_dukung: '',
      });
      setSelectedDate(undefined);
      setUploadFiles([]);
      setExistingFiles([]);
      setFileToDelete(null);
      setDeleteConfirmOpen(false);
    }

    // Reset loading states when dialog opens/closes
    setIsSaving(false);
    setIsDownloading(false);
  }, [item, open]);

  const handleOpenLink = (url: string) => {
    if (url && isValidUrl(url)) {
      window.open(url.startsWith('http') ? url : `https://${url}`, '_blank');
    }
  };

  const handleSave = async () => {
    if (isSaving) return;

    // Validate URL before saving
    if (formData.link_dokumen_data_dukung && !isValidUrl(formData.link_dokumen_data_dukung)) {
      toast({
        title: 'URL tidak valid',
        description: URL_VALIDATION_MESSAGES.INVALID,
        variant: 'destructive'
      });
      return;
    }

    setIsSaving(true);
    try {
      const dataToSave = {
        tanggal_kuisioner: selectedDate ? formatDateForAPI(selectedDate) : formData.tanggal_kuisioner,
        link_dokumen_data_dukung: formData.link_dokumen_data_dukung || '',
        files: uploadFiles,
      };
      await onSave(dataToSave);
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Prevent closing if operations are in progress
    if (isSaving || isDownloading || deletingFile) {
      return;
    }
    onOpenChange(false);
  };

  const handleUploadFilesChange = (files: File[]) => {
    // Prevent file changes during save operation
    if (isSaving) return;
    setUploadFiles(files);
  };

  const handleExistingFilesRemove = (index: number) => {
    // Prevent file removal during save operation
    if (isSaving || !existingFiles[index] || !existingFiles[index].filename) return;

    const fileToRemove = existingFiles[index];
    setFileToDelete({
      name: fileToRemove.name,
      filename: fileToRemove.filename!
    });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!fileToDelete || !item?.id || deletingFile) return;

    setDeletingFile(true);
    try {
      await kuisionerService.deleteFile(item.id, fileToDelete.filename);

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
    if (!item?.id || isDownloading) return;

    setIsDownloading(true);
    try {
      const blob = await kuisionerService.downloadFile(item.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Download berhasil',
        description: 'File berhasil didownload.',
        variant: 'default'
      });
    } catch (error) {
      console.error('Error downloading file:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const isEditable = mode === 'edit';
  const canEdit = canEditForm('kuesioner') && isEditable;

  // Determine if any operation is in progress
  const isOperationInProgress = isSaving || isDownloading || deletingFile;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle>
            {canEdit ? 'Edit Kuesioner' : 'Lihat Kuesioner'}
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

            <div className="space-y-2">
              <Label htmlFor="tanggal_kuisioner">Tanggal Kuisioner</Label>
              {canEdit ? (
                <DatePicker
                  value={selectedDate}
                  onChange={setSelectedDate}
                  placeholder="Pilih tanggal"
                  disabled={isSaving}
                />
              ) : (
                <div className="p-3 bg-muted rounded-md">
                  {item?.tanggal_kuisioner ? format(new Date(item.tanggal_kuisioner), "dd MMMM yyyy", { locale: id }) : '-'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="link_dokumen_data_dukung">Link Dokumen Data Dukung</Label>
              <div className="flex gap-2">
                <Input
                  id="link_dokumen_data_dukung"
                  value={formData.link_dokumen_data_dukung || ''}
                  onChange={(e) => setFormData({ ...formData, link_dokumen_data_dukung: e.target.value })}
                  disabled={!canEdit || isSaving}
                  className={`flex-1 ${(!canEdit || isSaving) ? "bg-muted" : ""}`}
                  placeholder={URL_VALIDATION_MESSAGES.PLACEHOLDER}
                />
                {formData.link_dokumen_data_dukung && isValidUrl(formData.link_dokumen_data_dukung) && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenLink(formData.link_dokumen_data_dukung)}
                    disabled={isSaving}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {formData.link_dokumen_data_dukung && !isValidUrl(formData.link_dokumen_data_dukung) && (
                <p className="text-xs text-red-500">
                  {URL_VALIDATION_MESSAGES.INVALID}
                </p>
              )}
              {!(!canEdit || isSaving) && (
                <p className="text-xs text-muted-foreground">
                  {URL_VALIDATION_MESSAGES.EXAMPLE}
                </p>
              )}
            </div>

            {/* Upload File Kuisioner */}
            <FileUpload
              label="Upload File Kuisioner"
              accept=".pdf,.doc,.docx"
              multiple={false}
              maxSize={10 * 1024 * 1024} // 10MB
              maxFiles={1}
              files={uploadFiles}
              existingFiles={existingFiles}
              mode={canEdit && !isSaving ? 'edit' : 'view'}
              disabled={!canEdit || isSaving}
              onFilesChange={handleUploadFilesChange}
              onExistingFileRemove={handleExistingFilesRemove}
              onFileDownload={handleFileDownload}
              description="Format yang didukung: PDF, DOC, DOCX (Max 10MB per file)"
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
          {canEdit && (
            <Button
              onClick={handleSave}
              disabled={isSaving || (formData.link_dokumen_data_dukung && !isValidUrl(formData.link_dokumen_data_dukung))}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
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
          // Prevent closing during delete operation
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

export default KuesionerDialog;