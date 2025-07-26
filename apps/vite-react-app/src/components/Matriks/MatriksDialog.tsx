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
import { Trash2, Plus } from 'lucide-react';
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
  const [existingFiles, setExistingFiles] = useState<Array<{ name: string; url?: string; viewUrl?: string; filename?: string }>>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<{ name: string; filename: string } | null>(null);
  const [deletingFile, setDeletingFile] = useState(false);

  useEffect(() => {
    if (item && open) {
      setTemuanRekomendasi(item.temuan_rekomendasi_summary?.data || []);
      
      // Set existing files for display
      setExistingFiles(item.has_file ? [{
        name: item.file_metadata?.original_filename || item.file_metadata?.filename || 'Matriks',
        url: item.file_urls?.download_url,
        viewUrl: item.file_urls?.file_url,
        filename: item.file_metadata?.original_filename || item.file_metadata?.filename
      }] : []);
    } else {
      setUploadFile(null);
      setTemuanRekomendasi([]);
      setExistingFiles([]);
      setFileToDelete(null);
      setDeleteConfirmOpen(false);
    }
  }, [item, open]);

  const handleUploadFileChange = (files: File[]) => {
    setUploadFile(files[0] || null);
  };

  const handleAddTemuanRekomendasi = () => {
    if (temuanRekomendasi.length >= 20) return;
    setTemuanRekomendasi([...temuanRekomendasi, { temuan: '', rekomendasi: '' }]);
  };

  const handleRemoveTemuanRekomendasi = (index: number) => {
    setTemuanRekomendasi(temuanRekomendasi.filter((_, i) => i !== index));
  };

  const handleTemuanRekomendasiChange = (index: number, field: 'temuan' | 'rekomendasi', value: string) => {
    const updated = [...temuanRekomendasi];
    updated[index] = { ...updated[index], [field]: value };
    setTemuanRekomendasi(updated);
  };

  const handleSave = async () => {
    if (!onSave) return;

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
    onSave(dataToSave);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleFileDownload = async (file: { name: string; url?: string; viewUrl?: string }) => {
    if (!item?.id) return;
    
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
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleExistingFileRemove = () => {
    if (!existingFiles[0] || !existingFiles[0].filename) return;
    
    const fileToRemove = existingFiles[0];
    setFileToDelete({
      name: fileToRemove.name,
      filename: fileToRemove.filename!
    });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!fileToDelete || !item?.id) return;
    
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
      toast({
        title: 'Gagal menghapus file',
        description: `Terjadi kesalahan saat menghapus file ${fileToDelete.name}.`,
        variant: 'destructive'
      });
    } finally {
      setDeletingFile(false);
      setFileToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

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
                      disabled={temuanRekomendasi.length >= 20}
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
                mode="edit"
                onFilesChange={handleUploadFileChange}
                onExistingFileRemove={handleExistingFileRemove}
                onFileDownload={handleFileDownload}
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
            {mode === 'view' ? 'Tutup' : 'Batal'}
          </Button>
          {canEdit && onSave && mode === 'edit' && (
            <Button onClick={handleSave}>
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

export default MatriksDialog;