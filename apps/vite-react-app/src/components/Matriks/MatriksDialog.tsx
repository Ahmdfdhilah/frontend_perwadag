import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Button } from '@workspace/ui/components/button';
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
import TemuanFormDialog, { type TemuanFormData } from './TemuanFormDialog';
import TemuanDeleteConfirmDialog from './TemuanDeleteConfirmDialog';
import { Label } from '@workspace/ui/components/label';
import StatusChangeConfirmDialog from './StatusChangeConfirmDialog';

interface MatriksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MatriksResponse | null;
  mode: 'edit' | 'view';
  onSave?: (data: any) => void;
  onStatusChange?: (status: MatriksStatus) => void;
  onRefetch?: (id: string) => Promise<MatriksResponse>;
}

const MatriksDialog: React.FC<MatriksDialogProps> = ({
  open,
  onOpenChange,
  item,
  mode,
  onSave,
  onStatusChange,
  onRefetch,
}) => {
  const { toast } = useToast();
  const isEditable = mode === 'edit';
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [temuanRekomendasi, setTemuanRekomendasi] = useState<TemuanRekomendasi[]>([]);
  const [existingFiles, setExistingFiles] = useState<Array<{ name: string; url?: string; viewUrl?: string; size?: number; filename?: string }>>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<{ name: string; filename: string } | null>(null);
  const [deletingFile, setDeletingFile] = useState(false);
  
  // Temuan deletion confirmation state
  const [deleteTemuanConfirmOpen, setDeleteTemuanConfirmOpen] = useState(false);
  const [temuanIndexToDelete, setTemuanIndexToDelete] = useState<number | null>(null);
  
  // Status change confirmation state
  const [statusChangeConfirmOpen, setStatusChangeConfirmOpen] = useState(false);
  const [newStatusToSet, setNewStatusToSet] = useState<MatriksStatus | null>(null);


  // Loading states for different operations
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  // Store current temuan_version for conflict detection
  const [currentTemuanVersion, setCurrentTemuanVersion] = useState<number>(0);

  // Store current item to allow updates without closing dialog
  const [currentItem, setCurrentItem] = useState<MatriksResponse | null>(null);

  // Validation states
  const [validationErrors, setValidationErrors] = useState<Record<string, { kondisi?: string; kriteria?: string; rekomendasi?: string }>>({});

  // Form dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<TemuanFormData>({ kondisi: '', kriteria: '', rekomendasi: '' });

  // Get status badge with background colors
  const getStatusBadge = (status?: MatriksStatus) => {
    switch (status) {
      case 'DRAFTING':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100">
            Draft
          </span>
        );
      case 'CHECKING':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            Review Ketua Tim
          </span>
        );
      case 'VALIDATING':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
            Review Pengendali
          </span>
        );
      case 'FINISHED':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            Selesai
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100">
            Draft
          </span>
        );
    }
  };

  // Get next status and button label
  const getNextStatusAction = (currentStatus?: MatriksStatus) => {
    switch (currentStatus) {
      case 'DRAFTING': return { next: 'CHECKING' as MatriksStatus, label: 'Kirim ke Review' };
      case 'CHECKING': return { next: 'VALIDATING' as MatriksStatus, label: 'Setujui & Lanjutkan' };
      case 'VALIDATING': return { next: 'FINISHED' as MatriksStatus, label: 'Finalisasi' };
      default: return null;
    }
  };

  // Use currentItem or fallback to item prop
  const activeItem = currentItem || item;

  // Check if user can edit temuan based on permissions
  const canEditTemuan = activeItem?.user_permissions?.can_edit_temuan && activeItem?.is_editable && isEditable;

  // Check if user can change status
  const canChangeStatus = activeItem?.user_permissions?.can_change_matrix_status && activeItem?.is_editable;

  // Use backend permissions instead of role-based check
  const canEdit = canEditTemuan;

  // Function to update dialog with fresh data
  const updateDialogWithFreshData = (freshItem: MatriksResponse) => {
    setCurrentItem(freshItem);
    setTemuanRekomendasi(freshItem.temuan_rekomendasi_summary?.data || []);
    setCurrentTemuanVersion(freshItem.temuan_version || 0);

    // Set existing files for display
    setExistingFiles(freshItem.has_file ? [{
      name: freshItem.file_metadata?.original_filename || freshItem.file_metadata?.filename || 'Matriks',
      url: freshItem.file_urls?.download_url,
      viewUrl: freshItem.file_urls?.file_url,
      size: freshItem.file_metadata?.size,
      filename: freshItem.file_metadata?.original_filename || freshItem.file_metadata?.filename
    }] : []);
  };

  useEffect(() => {
    if (item && open) {
      updateDialogWithFreshData(item);
    } else {
      setUploadFile(null);
      setTemuanRekomendasi([]);
      setCurrentTemuanVersion(0);
      setCurrentItem(null);
      setExistingFiles([]);
      setFileToDelete(null);
      setDeleteConfirmOpen(false);
      setValidationErrors({});
      setEditingIndex(null);
      setFormData({ kondisi: '', kriteria: '', rekomendasi: '' });
      setFormDialogOpen(false);
      setDeleteTemuanConfirmOpen(false);
      setTemuanIndexToDelete(null);
      setStatusChangeConfirmOpen(false);
      setNewStatusToSet(null);
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
    setTemuanIndexToDelete(index);
    setDeleteTemuanConfirmOpen(true);
  };

  const confirmDeleteTemuan = () => {
    if (temuanIndexToDelete !== null) {
      setTemuanRekomendasi(temuanRekomendasi.filter((_, i) => i !== temuanIndexToDelete));
      setTemuanIndexToDelete(null);
      setDeleteTemuanConfirmOpen(false);
    }
  };

  const handleSave = async () => {
    if (!onSave || isSaving) return;

    // Validate all fields before saving
    if (temuanRekomendasi.length > 0 && !validateTemuanRekomendasi()) {
      return;
    }

    setIsSaving(true);
    try {
      // Step 1: Check version before submitting (preventive check)
      if (onRefetch && activeItem?.id) {
        const latestData = await onRefetch(activeItem.id);
        
        // Check if version has changed
        if (latestData.temuan_version !== currentTemuanVersion) {
          // Save user's current changes before any updates
          const userTemuan = [...temuanRekomendasi];
          const userFile = uploadFile;
          
          // Merge server data with user's additional changes based on ID
          const serverTemuan = latestData.temuan_rekomendasi_summary?.data || [];
          
          // Find user additions (items without ID - these are new items user created locally)
          const userAdditions = userTemuan.filter(item => !item.id);
          
          // Final merged data: All server items + user's new additions (without ID)
          const finalMergedTemuan = [...serverTemuan, ...userAdditions];
          
          // Create modified latestData with merged temuan for updateDialog
          const modifiedLatestData = {
            ...latestData,
            temuan_rekomendasi_summary: {
              ...latestData.temuan_rekomendasi_summary,
              data: finalMergedTemuan
            }
          };
          
          // Update dialog with merged data (this will update version, metadata, etc)
          updateDialogWithFreshData(modifiedLatestData);
          setUploadFile(userFile);
          
          toast({
            title: 'Data diperbarui',
            description: 'Data telah diubah oleh user lain. Sistem telah memuat versi terbaru dan perubahan Anda tetap dipertahankan. Silakan simpan kembali.',
            variant: 'warning'
          });
          
          setIsSaving(false);
          return; // Don't proceed with save, let user save again
        }
      }

      // Step 2: Proceed with normal save if version is same
      const processedTemuanRekomendasi = temuanRekomendasi.map(tr => ({
        ...tr,
        kondisi: tr.kondisi?.trim() || '',
        kriteria: tr.kriteria?.trim() || '',
        rekomendasi: tr.rekomendasi?.trim() || ''
      }));

      const dataToSave = {
        temuan_rekomendasi: processedTemuanRekomendasi,
        expected_temuan_version: currentTemuanVersion,
        file: uploadFile,
      };
      await onSave(dataToSave);

      // Success - refetch fresh data and update dialog
      if (onRefetch && activeItem?.id) {
        try {
          const freshData = await onRefetch(activeItem.id);
          updateDialogWithFreshData(freshData);
          
          // Clear upload file after successful save
          setUploadFile(null);
          
          toast({
            title: 'Berhasil disimpan',
            description: 'Data matriks telah diperbarui dengan versi terbaru.',
            variant: 'default'
          });
        } catch (error) {
          console.error('Error refetching data:', error);
          toast({
            title: 'Berhasil disimpan',
            description: 'Data telah disimpan. Silakan refresh halaman untuk melihat perubahan terbaru.',
            variant: 'default'
          });
        }
      }
    } catch (error: any) {
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

  const handleStatusChangeClick = (newStatus: MatriksStatus) => {
    if (!onStatusChange || !activeItem?.id || isChangingStatus) return;
    setNewStatusToSet(newStatus);
    setStatusChangeConfirmOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!onStatusChange || !newStatusToSet || isChangingStatus) return;

    setIsChangingStatus(true);
    try {
      await onStatusChange(newStatusToSet);
      setStatusChangeConfirmOpen(false);
      setNewStatusToSet(null);
    } catch (error) {
      console.error('Error changing status:', error);
      // Error toast is handled by parent component
    } finally {
      setIsChangingStatus(false);
    }
  };

  const handleRollback = async () => {
    if (!activeItem?.status) return;

    const rollbackStatus: MatriksStatus = 'DRAFTING';
    handleStatusChangeClick(rollbackStatus);
  };

  const handleFileDownload = async (file: { name: string; url?: string; viewUrl?: string }) => {
    if (!activeItem?.id || isDownloading) return;

    setIsDownloading(true);
    try {
      const blob = await matriksService.downloadFile(activeItem.id);
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
    if (!fileToDelete || !activeItem?.id || deletingFile) return;

    setDeletingFile(true);
    try {
      await matriksService.deleteFile(activeItem.id, fileToDelete.filename);

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
  const nextAction = getNextStatusAction(activeItem?.status);

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
                  {activeItem?.nama_perwadag}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Periode Evaluasi</Label>
              <div className="p-3 bg-muted rounded-md">
                {activeItem ? formatIndonesianDateRange(activeItem.tanggal_evaluasi_mulai, activeItem.tanggal_evaluasi_selesai) : '-'}
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

            {/* Status Action Buttons */}
            {(canChangeStatus && (nextAction || (activeItem?.status === 'CHECKING' || activeItem?.status === 'VALIDATING'))) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Aksi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Current Status Display */}
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground">Status saat ini:</span>
                      {getStatusBadge(activeItem?.status)}
                    </div>
                  </div>

                  {/* Workflow Instructions */}
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950 dark:border-blue-800">
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Alur Kerja Matriks:</h4>
                    <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                      <li><strong>Draft:</strong> Anggota Tim input temuan → kirim ke Review Ketua Tim</li>
                      <li><strong>Review Ketua Tim:</strong> Ketua Tim review → setujui atau kembalikan ke Draft</li>
                      <li><strong>Review Pengendali:</strong> Pengendali Teknis review → finalisasi atau kembalikan ke Draft</li>
                      <li><strong>Selesai:</strong> Matriks selesai, dapat diakses untuk tindak lanjut</li>
                    </ul>
                  </div>

                  {/* Helper Text */}
                  {canChangeStatus && nextAction && temuanRekomendasi.length === 0 && (
                    <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg dark:bg-amber-950 dark:border-amber-800">
                      <div className="w-4 h-4 rounded-full bg-amber-400 dark:bg-amber-500 flex-shrink-0 mt-0.5"></div>
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        Tambahkan minimal satu temuan rekomendasi untuk melanjutkan ke tahap berikutnya.
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {/* Rollback button - show for CHECKING and VALIDATING status */}
                    {canChangeStatus && (activeItem?.status === 'CHECKING' || activeItem?.status === 'VALIDATING') && (
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

                    {/* Status change button */}
                    {canChangeStatus && nextAction && (
                      <Button
                        onClick={() => handleStatusChangeClick(nextAction.next)}
                        disabled={isChangingStatus || (temuanRekomendasi.length === 0)}
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
                </CardContent>
              </Card>
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

      <TemuanDeleteConfirmDialog
        open={deleteTemuanConfirmOpen}
        onOpenChange={setDeleteTemuanConfirmOpen}
        temuanIndex={temuanIndexToDelete}
        onConfirm={confirmDeleteTemuan}
      />

      <StatusChangeConfirmDialog
        open={statusChangeConfirmOpen}
        onOpenChange={setStatusChangeConfirmOpen}
        newStatus={newStatusToSet}
        onConfirm={confirmStatusChange}
        loading={isChangingStatus}
      />


      {/* Modular Dialog Components */}
      <TemuanFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        editingIndex={editingIndex}
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        validationErrors={validationErrors[editingIndex ?? temuanRekomendasi.length]}
        isSaving={isSaving}
      />
    </Dialog>
  );
};

export default MatriksDialog;