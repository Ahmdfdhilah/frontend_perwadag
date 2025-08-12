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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { Plus, Loader2 } from 'lucide-react';
import { MatriksResponse, TemuanRekomendasi, MatriksStatus } from '@/services/matriks/types';
import { formatIndonesianDateRange } from '@/utils/timeFormat';
import FileUpload from '@/components/common/FileUpload';
import FileDeleteConfirmDialog from '@/components/common/FileDeleteConfirmDialog';
import ActionDropdown from '@/components/common/ActionDropdown';
import { matriksService } from '@/services/matriks';
import { useToast } from '@workspace/ui/components/sonner';

interface MatriksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MatriksResponse | null;
  mode: 'edit' | 'view';
  onSave?: (data: any) => void;
  onStatusChange?: (status: MatriksStatus) => void;
}

const MatriksDialog: React.FC<MatriksDialogProps> = ({
  open,
  onOpenChange,
  item,
  mode,
  onSave,
  onStatusChange,
}) => {
  const { toast } = useToast();
  const isEditable = mode === 'edit';
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [temuanRekomendasi, setTemuanRekomendasi] = useState<TemuanRekomendasi[]>([]);
  const [existingFiles, setExistingFiles] = useState<Array<{ name: string; url?: string; viewUrl?: string; size?: number; filename?: string }>>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<{ name: string; filename: string } | null>(null);
  const [deletingFile, setDeletingFile] = useState(false);

  // Loading states for different operations
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  // Validation states
  const [validationErrors, setValidationErrors] = useState<Record<string, { kondisi?: string; kriteria?: string; rekomendasi?: string }>>({});

  // Form dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({ kondisi: '', kriteria: '', rekomendasi: '' });

  // Get next status and button label
  const getNextStatusAction = (currentStatus?: MatriksStatus) => {
    switch (currentStatus) {
      case 'DRAFTING': return { next: 'CHECKING' as MatriksStatus, label: 'Kirim ke Review' };
      case 'CHECKING': return { next: 'VALIDATING' as MatriksStatus, label: 'Setujui & Lanjutkan' };
      case 'VALIDATING': return { next: 'FINISHED' as MatriksStatus, label: 'Finalisasi' };
      default: return null;
    }
  };

  // Check if user can edit temuan based on permissions
  const canEditTemuan = item?.user_permissions?.can_edit_temuan && item?.is_editable && isEditable;

  // Check if user can change status
  const canChangeStatus = item?.user_permissions?.can_change_matrix_status && item?.is_editable;

  // Use backend permissions instead of role-based check
  const canEdit = canEditTemuan;

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
      setEditingIndex(null);
      setFormData({ kondisi: '', kriteria: '', rekomendasi: '' });
      setFormDialogOpen(false);
    }

    // Reset loading states when dialog opens/closes
    setIsSaving(false);
    setIsDownloading(false);
    setIsChangingStatus(false);
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

    setEditingIndex(null);
    setFormData({ kondisi: '', kriteria: '', rekomendasi: '' });
    setFormDialogOpen(true);
  };

  const handleEditTemuanRekomendasi = (index: number) => {
    if (isSaving) return;

    setEditingIndex(index);
    setFormData({
      kondisi: temuanRekomendasi[index].kondisi,
      kriteria: temuanRekomendasi[index].kriteria,
      rekomendasi: temuanRekomendasi[index].rekomendasi
    });
    setFormDialogOpen(true);
  };

  const handleFormSubmit = () => {
    // Validate form data
    const errors: { kondisi?: string; kriteria?: string; rekomendasi?: string } = {};

    if (!formData.kondisi.trim()) errors.kondisi = 'Kondisi wajib diisi';
    if (!formData.kriteria.trim()) errors.kriteria = 'Kriteria wajib diisi';
    if (!formData.rekomendasi.trim()) errors.rekomendasi = 'Rekomendasi wajib diisi';

    if (Object.keys(errors).length > 0) {
      setValidationErrors({ [editingIndex ?? temuanRekomendasi.length]: errors });
      return;
    }

    if (editingIndex !== null) {
      // Update existing
      const updated = [...temuanRekomendasi];
      updated[editingIndex] = { ...formData };
      setTemuanRekomendasi(updated);
    } else {
      // Add new
      setTemuanRekomendasi([...temuanRekomendasi, { ...formData }]);
    }

    // Reset form
    setEditingIndex(null);
    setFormData({ kondisi: '', kriteria: '', rekomendasi: '' });
    setFormDialogOpen(false);
    setValidationErrors({});
  };

  const handleFormCancel = () => {
    setEditingIndex(null);
    setFormData({ kondisi: '', kriteria: '', rekomendasi: '' });
    setFormDialogOpen(false);
    setValidationErrors({});
  };

  const handleRemoveTemuanRekomendasi = (index: number) => {
    // Prevent removing during save operation
    if (isSaving) return;
    setTemuanRekomendasi(temuanRekomendasi.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!onSave || isSaving) return;

    // Validate all fields before saving
    if (temuanRekomendasi.length > 0 && !validateTemuanRekomendasi()) {
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
    if (isSaving || isDownloading || deletingFile || isChangingStatus) {
      return;
    }
    onOpenChange(false);
  };

  const handleStatusChange = async (newStatus: MatriksStatus) => {
    if (!onStatusChange || !item?.id || isChangingStatus) return;

    setIsChangingStatus(true);
    try {
      await onStatusChange(newStatus);
    } catch (error) {
      console.error('Error changing status:', error);
      // Error toast is handled by parent component
    } finally {
      setIsChangingStatus(false);
    }
  };

  const handleRollback = async () => {
    if (!item?.status) return;

    const rollbackStatus: MatriksStatus = 'DRAFTING';
    await handleStatusChange(rollbackStatus);
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
  const isOperationInProgress = isSaving || isDownloading || deletingFile || isChangingStatus;

  // Get next status action
  const nextAction = getNextStatusAction(item?.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] h-[90vh] !max-w-none !max-h-none flex flex-col">
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
                <CardTitle className="text-lg">Daftar Kondisi, Kriteria dan Rekomendasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Button Section */}
                {canEdit && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddTemuanRekomendasi}
                    disabled={temuanRekomendasi.length >= 20 || isSaving}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah
                  </Button>
                )}

                {/* Data Table Section */}
                {temuanRekomendasi.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-8">
                    {canEdit ? "Klik tombol Tambah untuk menambahkan temuan rekomendasi" : "Belum ada kondisi, kriteria dan rekomendasi"}
                  </p>
                ) : (
                  <div className="rounded-md border overflow-auto max-h-96">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>No</TableHead>
                          <TableHead>Kondisi</TableHead>
                          <TableHead>Kriteria</TableHead>
                          <TableHead>Rekomendasi</TableHead>
                          {canEdit && <TableHead className="w-[80px]">Aksi</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {temuanRekomendasi.map((tr, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell className="max-w-xs">
                              <div className="text-sm whitespace-pre-wrap break-words">
                                {tr.kondisi || '-'}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <div className="text-sm whitespace-pre-wrap break-words">
                                {tr.kriteria || '-'}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <div className="text-sm whitespace-pre-wrap break-words">
                                {tr.rekomendasi || '-'}
                              </div>
                            </TableCell>
                            {canEdit && (
                              <TableCell>
                                <ActionDropdown
                                  onEdit={() => handleEditTemuanRekomendasi(index)}
                                  onDelete={() => handleRemoveTemuanRekomendasi(index)}
                                  showEdit={!isSaving}
                                  showDelete={!isSaving}
                                />
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
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
          <div className="flex flex-wrap gap-2 w-full">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isOperationInProgress}
            >
              {mode === 'view' ? 'Tutup' : 'Batal'}
            </Button>

            {/* Rollback button - show for CHECKING and VALIDATING status */}
            {canChangeStatus && (item?.status === 'CHECKING' || item?.status === 'VALIDATING') && (
              <Button
                variant="destructive"
                onClick={handleRollback}
                disabled={isChangingStatus}
              >
                {isChangingStatus ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Mengembalikan...
                  </>
                ) : (
                  'Kembalikan ke Draft'
                )}
              </Button>
            )}

            {/* Save button */}
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

            {/* Status change button */}
            {canChangeStatus && nextAction && (
              <Button
                onClick={() => handleStatusChange(nextAction.next)}
                disabled={isChangingStatus || (temuanRekomendasi.length === 0)}
                className="ml-auto"
              >
                {isChangingStatus ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  nextAction.label
                )}
              </Button>
            )}
          </div>
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

      {/* Form Input Dialog */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null ? `Edit Temuan ${editingIndex + 1}` : 'Tambah Temuan Rekomendasi'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="form-kondisi">Kondisi <span className="text-red-500">*</span></Label>
              <Textarea
                id="form-kondisi"
                value={formData.kondisi}
                onChange={(e) => setFormData({ ...formData, kondisi: e.target.value })}
                placeholder="Masukkan kondisi yang ditemukan..."
                rows={4}
                disabled={isSaving}
                className={validationErrors[editingIndex ?? temuanRekomendasi.length]?.kondisi ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {validationErrors[editingIndex ?? temuanRekomendasi.length]?.kondisi && (
                <p className="text-red-500 text-xs mt-1">{validationErrors[editingIndex ?? temuanRekomendasi.length].kondisi}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="form-kriteria">Kriteria <span className="text-red-500">*</span></Label>
              <Textarea
                id="form-kriteria"
                value={formData.kriteria}
                onChange={(e) => setFormData({ ...formData, kriteria: e.target.value })}
                placeholder="Masukkan kriteria/standar yang harus dipenuhi..."
                rows={4}
                disabled={isSaving}
                className={validationErrors[editingIndex ?? temuanRekomendasi.length]?.kriteria ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {validationErrors[editingIndex ?? temuanRekomendasi.length]?.kriteria && (
                <p className="text-red-500 text-xs mt-1">{validationErrors[editingIndex ?? temuanRekomendasi.length].kriteria}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="form-rekomendasi">Rekomendasi <span className="text-red-500">*</span></Label>
              <Textarea
                id="form-rekomendasi"
                value={formData.rekomendasi}
                onChange={(e) => setFormData({ ...formData, rekomendasi: e.target.value })}
                placeholder="Masukkan rekomendasi perbaikan..."
                rows={4}
                disabled={isSaving}
                className={validationErrors[editingIndex ?? temuanRekomendasi.length]?.rekomendasi ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {validationErrors[editingIndex ?? temuanRekomendasi.length]?.rekomendasi && (
                <p className="text-red-500 text-xs mt-1">{validationErrors[editingIndex ?? temuanRekomendasi.length].rekomendasi}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleFormCancel}
              disabled={isSaving}
            >
              Batal
            </Button>
            <Button
              onClick={handleFormSubmit}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                editingIndex !== null ? 'Update' : 'Simpan'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default MatriksDialog;