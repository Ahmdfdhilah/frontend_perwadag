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
  
  // Validation states
  const [validationErrors, setValidationErrors] = useState<Record<string, { kondisi?: string; kriteria?: string; rekomendasi?: string }>>({});

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
      setValidationErrors({});
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

  const validateTemuanRekomendasi = () => {
    const errors: Record<string, { kondisi?: string; kriteria?: string; rekomendasi?: string }> = {};
    let hasErrors = false;
    
    temuanRekomendasi.forEach((tr, index) => {
      const fieldErrors: { kondisi?: string; kriteria?: string; rekomendasi?: string } = {};
      
      if (!tr.kondisi?.trim()) {
        fieldErrors.kondisi = 'Kondisi wajib diisi';
        hasErrors = true;
      }
      
      if (!tr.kriteria?.trim()) {
        fieldErrors.kriteria = 'Kriteria wajib diisi';
        hasErrors = true;
      }
      
      if (!tr.rekomendasi?.trim()) {
        fieldErrors.rekomendasi = 'Rekomendasi wajib diisi';
        hasErrors = true;
      }
      
      if (Object.keys(fieldErrors).length > 0) {
        errors[index] = fieldErrors;
      }
    });
    
    setValidationErrors(errors);
    return !hasErrors;
  };
  
  const handleAddTemuanRekomendasi = () => {
    // Prevent adding during save operation
    if (isSaving || temuanRekomendasi.length >= 20) return;
    
    // Validate existing entries before adding new one
    if (temuanRekomendasi.length > 0 && !validateTemuanRekomendasi()) {
      toast({
        title: 'Validasi Gagal',
        description: 'Harap lengkapi semua field yang sudah ada sebelum menambah matriks baru.',
        variant: 'destructive'
      });
      return;
    }
    
    setTemuanRekomendasi([...temuanRekomendasi, { kondisi: '', kriteria: '', rekomendasi: '' }]);
  };

  const handleRemoveTemuanRekomendasi = (index: number) => {
    // Prevent removing during save operation
    if (isSaving) return;
    setTemuanRekomendasi(temuanRekomendasi.filter((_, i) => i !== index));
  };

  const handleTemuanRekomendasiChange = (index: number, field: 'kondisi' | 'kriteria' | 'rekomendasi', value: string) => {
    // Prevent changes during save operation
    if (isSaving) return;
    const updated = [...temuanRekomendasi];
    updated[index] = { ...updated[index], [field]: value };
    setTemuanRekomendasi(updated);
    
    // Clear validation error for this field when user types
    if (validationErrors[index]?.[field]) {
      const updatedErrors = { ...validationErrors };
      if (updatedErrors[index]) {
        delete updatedErrors[index][field];
        if (Object.keys(updatedErrors[index]).length === 0) {
          delete updatedErrors[index];
        }
      }
      setValidationErrors(updatedErrors);
    }
  };

  const handleSave = async () => {
    if (!onSave || isSaving) return;
    
    // Validate all fields before saving
    if (temuanRekomendasi.length > 0 && !validateTemuanRekomendasi()) {
      toast({
        title: 'Validasi Gagal',
        description: 'Harap lengkapi semua field Kondisi, Kriteria, dan Rekomendasi.',
        variant: 'destructive'
      });
      return;
    }

    setIsSaving(true);
    try {
      // Send full JSON of temuan_rekomendasi, including existing IDs for updates
      const processedTemuanRekomendasi = temuanRekomendasi.map(tr => ({
        ...tr,
        kondisi: tr.kondisi?.trim() || '',
        kriteria: tr.kriteria?.trim() || '',
        rekomendasi: tr.rekomendasi?.trim() || ''
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
                  <span>Kondisi, Kriteria dan Rekomendasi</span>
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
                    <p className="text-muted-foreground text-sm">Belum ada kondisi, kriteria dan rekomendasi</p>
                  ) : (
                    temuanRekomendasi.map((tr, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">Matriks {index + 1}</span>
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
                            <Label htmlFor={`kondisi-${index}`}>Kondisi <span className="text-red-500">*</span></Label>
                            {canEdit ? (
                              <div className="space-y-1">
                                <Textarea
                                  id={`kondisi-${index}`}
                                  value={tr.kondisi}
                                  onChange={(e) => handleTemuanRekomendasiChange(index, 'kondisi', e.target.value)}
                                  placeholder="Masukkan kondisi yang ditemukan..."
                                  rows={3}
                                  disabled={isSaving}
                                  className={`${isSaving ? "bg-muted" : ""} ${validationErrors[index]?.kondisi ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                />
                                {validationErrors[index]?.kondisi && (
                                  <p className="text-red-500 text-xs mt-1">{validationErrors[index].kondisi}</p>
                                )}
                              </div>
                            ) : (
                              <div className="p-3 bg-muted rounded-md text-sm">
                                {tr.kondisi || '-'}
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`kriteria-${index}`}>Kriteria <span className="text-red-500">*</span></Label>
                            {canEdit ? (
                              <div className="space-y-1">
                                <Textarea
                                  id={`kriteria-${index}`}
                                  value={tr.kriteria}
                                  onChange={(e) => handleTemuanRekomendasiChange(index, 'kriteria', e.target.value)}
                                  placeholder="Masukkan kriteria/standar yang harus dipenuhi..."
                                  rows={3}
                                  disabled={isSaving}
                                  className={`${isSaving ? "bg-muted" : ""} ${validationErrors[index]?.kriteria ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                />
                                {validationErrors[index]?.kriteria && (
                                  <p className="text-red-500 text-xs mt-1">{validationErrors[index].kriteria}</p>
                                )}
                              </div>
                            ) : (
                              <div className="p-3 bg-muted rounded-md text-sm">
                                {tr.kriteria || '-'}
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`rekomendasi-${index}`}>Rekomendasi <span className="text-red-500">*</span></Label>
                            {canEdit ? (
                              <div className="space-y-1">
                                <Textarea
                                  id={`rekomendasi-${index}`}
                                  value={tr.rekomendasi}
                                  onChange={(e) => handleTemuanRekomendasiChange(index, 'rekomendasi', e.target.value)}
                                  placeholder="Masukkan rekomendasi perbaikan..."
                                  rows={3}
                                  disabled={isSaving}
                                  className={`${isSaving ? "bg-muted" : ""} ${validationErrors[index]?.rekomendasi ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                />
                                {validationErrors[index]?.rekomendasi && (
                                  <p className="text-red-500 text-xs mt-1">{validationErrors[index].rekomendasi}</p>
                                )}
                              </div>
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
              disabled={isSaving || (temuanRekomendasi.length > 0 && Object.keys(validationErrors).length > 0)}
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