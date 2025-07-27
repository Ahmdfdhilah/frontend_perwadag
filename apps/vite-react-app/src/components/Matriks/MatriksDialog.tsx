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
import { Textarea } from '@workspace/ui/components/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Trash2, Plus, Loader2 } from 'lucide-react';
import { MatriksResponse, TemuanRekomendasi } from '@/services/matriks/types';
import { useFormPermissions } from '@/hooks/useFormPermissions';
import { formatIndonesianDateRange } from '@/utils/timeFormat';
import FileUpload from '@/components/common/FileUpload';
import FileDeleteConfirmDialog from '@/components/common/FileDeleteConfirmDialog';
import { matriksService } from '@/services/matriks';
import { useToast } from '@workspace/ui/components/sonner';

interface MatriksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MatriksResponse | null;
  mode: 'edit' | 'view';
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
  const { toast } = useToast();
  const isEditable = mode === 'edit';
  const canEdit = canEditForm('matriks') && isEditable;
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [temuanRekomendasi, setTemuanRekomendasi] = useState<TemuanRekomendasi[]>([]);
  const [existingFiles, setExistingFiles] = useState<Array<{ name: string; url?: string; viewUrl?: string; size?: number; filename?: string }>>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<{ name: string; filename: string } | null>(null);
  const [deletingFile, setDeletingFile] = useState(false);
  
  // Loading states for different operations
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (item && open) {
      setTemuanRekomendasi(item.temuan_rekomendasi_summary?.data || []);

      // Set existing files for display
      setExistingFiles(item.has_file ? [{
        name: item.file_metadata?.original_filename || item.file_metadata?.filename || 'Matriks',
        url: item.file_urls?.download_url,
        viewUrl: item.file_urls?.file_url,
        size: item.file_metadata?.size,
        filename: item.file_metadata?.original_filename || item.file_metadata?.filename
      }] : []);
    } else {
      setUploadFile(null);
      setTemuanRekomendasi([]);
      setExistingFiles([]);
      setFileToDelete(null);
      setDeleteConfirmOpen(false);
    }
    
    // Reset loading states when dialog opens/closes
    setIsSaving(false);
    setIsDownloading(false);
  }, [item, open]);

  const handleUploadFileChange = (files: File[]) => {
    // Prevent file changes during save operation
    if (isSaving) return;
    setUploadFile(files[0] || null);
  };

  const handleAddTemuanRekomendasi = () => {
    // Prevent adding during save operation
    if (isSaving || temuanRekomendasi.length >= 20) return;
    setTemuanRekomendasi([...temuanRekomendasi, { temuan: '', rekomendasi: '' }]);
  };

  const handleRemoveTemuanRekomendasi = (index: number) => {
    // Prevent removing during save operation
    if (isSaving) return;
    setTemuanRekomendasi(temuanRekomendasi.filter((_, i) => i !== index));
  };

  const handleTemuanRekomendasiChange = (index: number, field: 'temuan' | 'rekomendasi', value: string) => {
    // Prevent changes during save operation
    if (isSaving) return;
    const updated = [...temuanRekomendasi];
    updated[index] = { ...updated[index], [field]: value };
    setTemuanRekomendasi(updated);
  };

  const handleSave = async () => {
    if (!onSave || isSaving) return;

    setIsSaving(true);
    try {
      // Send full JSON of temuan_rekomendasi, including existing IDs for updates
      // Allow empty strings to be sent for clearing data
      const processedTemuanRekomendasi = temuanRekomendasi.map(tr => ({
        ...tr,
        temuan: tr.temuan || '',
        rekomendasi: tr.rekomendasi || ''
      }));

      const dataToSave = {
        temuan_rekomendasi: processedTemuanRekomendasi,
        file: uploadFile,
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

  const handleFileDownload = async (file: { name: string; url?: string; viewUrl?: string }) => {
    if (!item?.id || isDownloading) return;

    setIsDownloading(true);
    try {
      const blob = await matriksService.downloadFile(item.id);
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

  const handleExistingFileRemove = () => {
    // Prevent file removal during save operation
    if (isSaving || !existingFiles[0] || !existingFiles[0].filename) return;

    const fileToRemove = existingFiles[0];
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
      await matriksService.deleteFile(item.id, fileToDelete.filename);

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

  // Determine if any operation is in progress
  const isOperationInProgress = isSaving || isDownloading || deletingFile;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle>
            {mode === 'view' ? 'Detail Matriks' : 'Edit Matriks'}
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

            {/* Temuan Rekomendasi */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Temuan dan Rekomendasi</span>
                  {canEdit && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddTemuanRekomendasi}
                      disabled={temuanRekomendasi.length >= 20 || isSaving}
                      className="ml-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {temuanRekomendasi.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Belum ada temuan dan rekomendasi</p>
                  ) : (
                    temuanRekomendasi.map((tr, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">#{index + 1}</span>
                          {canEdit && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveTemuanRekomendasi(index)}
                              disabled={isSaving}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`temuan-${index}`}>Temuan</Label>
                            {canEdit ? (
                              <Textarea
                                id={`temuan-${index}`}
                                value={tr.temuan}
                                onChange={(e) => handleTemuanRekomendasiChange(index, 'temuan', e.target.value)}
                                placeholder="Masukkan temuan..."
                                rows={3}
                                disabled={isSaving}
                                className={isSaving ? "bg-muted" : ""}
                              />
                            ) : (
                              <div className="p-3 bg-muted rounded-md text-sm">
                                {tr.temuan || '-'}
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`rekomendasi-${index}`}>Rekomendasi</Label>
                            {canEdit ? (
                              <Textarea
                                id={`rekomendasi-${index}`}
                                value={tr.rekomendasi}
                                onChange={(e) => handleTemuanRekomendasiChange(index, 'rekomendasi', e.target.value)}
                                placeholder="Masukkan rekomendasi..."
                                rows={3}
                                disabled={isSaving}
                                className={isSaving ? "bg-muted" : ""}
                              />
                            ) : (
                              <div className="p-3 bg-muted rounded-md text-sm">
                                {tr.rekomendasi || '-'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* File Upload */}
            {canEdit && (
              <FileUpload
                label="Upload File Matriks (Optional)"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                multiple={false}
                maxSize={10 * 1024 * 1024} // 10MB
                files={uploadFile ? [uploadFile] : []}
                existingFiles={existingFiles}
                mode={isSaving ? 'view' : 'edit'}
                disabled={isSaving}
                onFilesChange={handleUploadFileChange}
                onExistingFileRemove={handleExistingFileRemove}
                onFileDownload={handleFileDownload}
                description="Format yang didukung: PDF, DOC, DOCX, XLS, XLSX (Max 10MB)"
              />
            )}
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
          {canEdit && onSave && mode === 'edit' && (
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

export default MatriksDialog;