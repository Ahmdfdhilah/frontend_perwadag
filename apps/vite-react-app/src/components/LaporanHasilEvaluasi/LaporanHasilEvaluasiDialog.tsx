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
import { Loader2 } from 'lucide-react';
import DatePicker from '@/components/common/DatePicker';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { LaporanHasilResponse } from '@/services/laporanHasil/types';
import { useFormPermissions } from '@/hooks/useFormPermissions';
import { formatIndonesianDateRange, formatDateForAPI, parseDateStringToDate } from '@/utils/timeFormat';
import FileUpload from '@/components/common/FileUpload';
import FileDeleteConfirmDialog from '@/components/common/FileDeleteConfirmDialog';
import { laporanHasilService } from '@/services/laporanHasil';
import { useToast } from '@workspace/ui/components/sonner';

interface LaporanHasilEvaluasiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: LaporanHasilResponse | null;
  mode: 'view' | 'edit';
  onSave: (data: any) => void;
}

const LaporanHasilEvaluasiDialog: React.FC<LaporanHasilEvaluasiDialogProps> = ({
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
        nomor_laporan: item.nomor_laporan || '',
        tanggal_laporan: item.tanggal_laporan,
      });
      setSelectedDate(item.tanggal_laporan ? parseDateStringToDate(item.tanggal_laporan) : undefined);

      // Set existing files for display
      if (item.has_file && item.file_metadata) {
        setExistingFiles([{
          name: item.file_metadata.original_filename || item.file_metadata.filename || 'Laporan Hasil Evaluasi',
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
        nomor_laporan: '',
        tanggal_laporan: '',
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

  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const dataToSave = {
        nomor_laporan: formData.nomor_laporan || '',
        tanggal_laporan: selectedDate ? formatDateForAPI(selectedDate) : formData.tanggal_laporan,
        files: uploadFiles,
      };
      await onSave(dataToSave);
    } catch (error) {
      console.error('Error saving:', error);
      // Error toast is handled by base service
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
      await laporanHasilService.deleteFile(item.id, fileToDelete.filename);
      
      // Remove from UI
      setExistingFiles([]);
      
      toast({
        title: 'File berhasil dihapus',
        description: `File ${fileToDelete.name} telah dihapus.`,
        variant: 'default'
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      // Error toast is handled by base service
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
      const blob = await laporanHasilService.downloadFile(item.id);
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
      // Error toast is handled by base service
    } finally {
      setIsDownloading(false);
    }
  };

  const isEditable = mode === 'edit';
  const canEdit = canEditForm('laporan_hasil_evaluasi') && isEditable;
  
  // Determine if any operation is in progress
  const isOperationInProgress = isSaving || isDownloading || deletingFile;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle>
            {mode === 'view' ? 'Lihat Laporan Hasil Evaluasi' : 'Edit Laporan Hasil Evaluasi'}
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
              <Label htmlFor="nomor_laporan">Nomor Laporan</Label>
              {canEdit ? (
                <Input
                  id="nomor_laporan"
                  value={formData.nomor_laporan || ''}
                  onChange={(e) => setFormData({ ...formData, nomor_laporan: e.target.value })}
                  placeholder="LHE/001/2024"
                  disabled={isSaving}
                  className={isSaving ? "bg-muted" : ""}
                />
              ) : (
                <div className="p-3 bg-muted rounded-md">
                  {item?.nomor_laporan || '-'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tanggal_laporan">Tanggal Laporan</Label>
              {canEdit ? (
                <DatePicker
                  value={selectedDate}
                  onChange={setSelectedDate}
                  placeholder="Pilih tanggal laporan"
                  disabled={!canEdit || isSaving}
                />
              ) : (
                <div className="p-3 bg-muted rounded-md">
                  {item?.tanggal_laporan ? format(parseDateStringToDate(item.tanggal_laporan), "dd MMMM yyyy", { locale: id }) : '-'}
                </div>
              )}
            </div>

            {/* Upload File Laporan */}
            <FileUpload
              label="Upload File Laporan Hasil Evaluasi"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
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
              description="Format yang didukung: PDF, DOC, DOCX, XLS, XLSX (Max 10MB per file)"
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
              disabled={isSaving}
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

export default LaporanHasilEvaluasiDialog;