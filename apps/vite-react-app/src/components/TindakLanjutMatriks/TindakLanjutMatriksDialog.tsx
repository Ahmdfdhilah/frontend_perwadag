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
import { Loader2 } from 'lucide-react';
import { MatriksResponse, TindakLanjutStatus } from '@/services/matriks/types';
import { formatIndonesianDateRange } from '@/utils/timeFormat';
import { matriksService } from '@/services/matriks';
import { useToast } from '@workspace/ui/components/sonner';
import ActionDropdown from '@/components/common/ActionDropdown';
import FileViewLink from '@/components/common/FileViewLink';
import { useRole } from '@/hooks/useRole';
import { formatDokumenUrl, URL_VALIDATION_MESSAGES } from '@/utils/urlValidation';
import TindakLanjutFormDialog, {
  type TindakLanjutFormData,
  type TindakLanjutFieldPermissions
} from './TindakLanjutFormDialog';
import TindakLanjutStatusChangeConfirmDialog from './TindakLanjutStatusChangeConfirmDialog';
import { Label } from '@workspace/ui/components/label';

interface TindakLanjutMatriksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MatriksResponse | null;
  mode: 'edit' | 'view';
  onSave?: (data: any) => void;
  onStatusChange?: (status: TindakLanjutStatus) => void;
}

const TindakLanjutMatriksDialog: React.FC<TindakLanjutMatriksDialogProps> = ({
  open,
  onOpenChange,
  item,
  mode,
  onSave,
  onStatusChange,
}) => {
  const { toast } = useToast();
  const { isAdmin, isPerwadag, isInspektorat, isPimpinan } = useRole();
  const isEditable = mode === 'edit';


  // Loading states for different operations
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  // Form dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<TindakLanjutFormData>({
    tindak_lanjut: '',
    dokumen_pendukung_tindak_lanjut: '',
    catatan_evaluator: ''
  });

  // Status change confirmation state
  const [statusChangeConfirmOpen, setStatusChangeConfirmOpen] = useState(false);
  const [newStatusToSet, setNewStatusToSet] = useState<TindakLanjutStatus | null>(null);

  // Get status badge with background colors (now uses matriks-level status)
  const getTindakLanjutStatusBadge = (status?: TindakLanjutStatus) => {
    switch (status) {
      case 'DRAFTING':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100">
            Draft Tindak Lanjut
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
            Belum Ada Tindak Lanjut
          </span>
        );
    }
  };

  // Get next status and button label for tindak lanjut (matriks-level)
  const getNextTindakLanjutAction = (currentStatus?: TindakLanjutStatus) => {
    switch (currentStatus) {
      case 'DRAFTING': return { next: 'CHECKING' as TindakLanjutStatus, label: 'Kirim ke Review' };
      case 'CHECKING': return { next: 'VALIDATING' as TindakLanjutStatus, label: 'Setujui & Lanjutkan' };
      case 'VALIDATING': return { next: 'FINISHED' as TindakLanjutStatus, label: 'Finalisasi Tindak Lanjut' };
      default: return null;
    }
  };

  // Check if user can edit tindak lanjut based on permissions
  const canEditTindakLanjut = item?.user_permissions?.can_edit_tindak_lanjut && item?.is_editable && isEditable;

  // Check if user can change tindak lanjut status
  const canChangeTindakLanjutStatus = item?.user_permissions?.can_change_tindak_lanjut_status && item?.is_editable;

  // Check if there are any local changes that haven't been saved
  const hasLocalChanges = React.useMemo(() => {
    if (!formDialogOpen || editingIndex === null || !item?.temuan_rekomendasi_summary?.data) {
      return false;
    }

    const originalItem = item.temuan_rekomendasi_summary.data[editingIndex];
    if (!originalItem) return false;

    // Compare current form data with original data
    return (
      formData.tindak_lanjut !== (originalItem.tindak_lanjut || '') ||
      formData.dokumen_pendukung_tindak_lanjut !== (originalItem.dokumen_pendukung_tindak_lanjut || '') ||
      formData.catatan_evaluator !== (originalItem.catatan_evaluator || '')
    );
  }, [formDialogOpen, editingIndex, item?.temuan_rekomendasi_summary?.data, formData]);

  // Field-specific permissions based on role and context (uses matriks-level status)
  const getFieldPermissions = (): TindakLanjutFieldPermissions => {
    const currentStatus = item?.status_tindak_lanjut;

    // Admin can edit everything
    if (isAdmin()) {
      return {
        canEditTindakLanjut: true,
        canEditDokumen: true,
        canEditCatatan: true,
      };
    }

    return {
      // Perwadag can edit tindak_lanjut and dokumen when status allows
      canEditTindakLanjut: isPerwadag() && (currentStatus === 'DRAFTING' || currentStatus === 'CHECKING'),
      canEditDokumen: isPerwadag() && (currentStatus === 'DRAFTING' || currentStatus === 'CHECKING'),

      // Evaluator (Inspektorat/Pimpinan) can edit catatan when status allows
      canEditCatatan: (isInspektorat() || isPimpinan()) && (currentStatus === 'CHECKING' || currentStatus === 'VALIDATING'),
    };
  };

  useEffect(() => {
    if (!item || !open) {
      setEditingIndex(null);
      setFormData({ tindak_lanjut: '', dokumen_pendukung_tindak_lanjut: '', catatan_evaluator: '' });
      setFormDialogOpen(false);
      setStatusChangeConfirmOpen(false);
      setNewStatusToSet(null);
    }

    // Reset loading states when dialog opens/closes
    setIsSaving(false);
    setIsChangingStatus(false);
  }, [item, open]);

  const handleEditTindakLanjut = (index: number) => {
    if (!item?.temuan_rekomendasi_summary?.data || isSaving) return;

    const temuanItem = item.temuan_rekomendasi_summary.data[index];
    setEditingIndex(index);
    setFormData({
      tindak_lanjut: temuanItem.tindak_lanjut || '',
      dokumen_pendukung_tindak_lanjut: temuanItem.dokumen_pendukung_tindak_lanjut || '',
      catatan_evaluator: temuanItem.catatan_evaluator || ''
    });
    setFormDialogOpen(true);
  };

  const handleFormSubmit = async () => {
    if (!item?.temuan_rekomendasi_summary?.data || editingIndex === null) return;

    // Validate URL before saving
    if (formData.dokumen_pendukung_tindak_lanjut) {
      const validUrl = formatDokumenUrl(formData.dokumen_pendukung_tindak_lanjut);
      if (!validUrl) {
        toast({
          title: 'URL tidak valid',
          description: URL_VALIDATION_MESSAGES.INVALID,
          variant: 'destructive'
        });
        return;
      }
    }

    setIsSaving(true);
    try {
      const temuanItem = item.temuan_rekomendasi_summary.data[editingIndex];
      const fieldPermissions = getFieldPermissions();

      if (temuanItem.id) {
        // Prepare data based on field permissions
        // Send empty string for locked fields to ensure they don't get updated
        const updateData = {
          tindak_lanjut: fieldPermissions.canEditTindakLanjut ? formData.tindak_lanjut : '',
          dokumen_pendukung_tindak_lanjut: fieldPermissions.canEditDokumen ? formData.dokumen_pendukung_tindak_lanjut : '',
          catatan_evaluator: fieldPermissions.canEditCatatan ? formData.catatan_evaluator : ''
        };

        await matriksService.updateTindakLanjut(item.id, temuanItem.id, updateData);

        setFormDialogOpen(false);
        setEditingIndex(null);
        setFormData({ tindak_lanjut: '', dokumen_pendukung_tindak_lanjut: '', catatan_evaluator: '' });

        // Refresh parent data without closing main dialog
        if (onSave) {
          onSave({});
        }

        toast({
          title: 'Berhasil diperbarui',
          description: 'Data tindak lanjut telah diperbarui.',
          variant: 'default'
        });
      }
    } catch (error) {
      console.error('Failed to save tindak lanjut:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFormCancel = () => {
    setEditingIndex(null);
    setFormData({ tindak_lanjut: '', dokumen_pendukung_tindak_lanjut: '', catatan_evaluator: '' });
    setFormDialogOpen(false);
  };

  const handleStatusChangeClick = (newStatus: TindakLanjutStatus) => {
    if (!onStatusChange || isChangingStatus) return;
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
      console.error('Error changing tindak lanjut status:', error);
    } finally {
      setIsChangingStatus(false);
    }
  };

  const handleRollback = async () => {
    const rollbackStatus: TindakLanjutStatus = 'DRAFTING';
    handleStatusChangeClick(rollbackStatus);
  };

  const handleCancel = () => {
    if (isSaving || isChangingStatus) return;
    onOpenChange(false);
  };

  // Determine if any operation is in progress
  const isOperationInProgress = isSaving || isChangingStatus;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] h-[90vh] !max-w-none !max-h-none flex flex-col">
          <DialogHeader className="flex-shrink-0 border-b pb-4">
            <DialogTitle>
              {mode === 'view' ? 'Detail Tindak Lanjut' : 'Edit Tindak Lanjut'}
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

              {/* Tindak Lanjut Data Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Data Tindak Lanjut</CardTitle>
                </CardHeader>
                <CardContent>
                  {!item?.temuan_rekomendasi_summary?.data || item.temuan_rekomendasi_summary.data.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-8">
                      Belum ada data tindak lanjut
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
                            <TableHead>Tindak Lanjut</TableHead>
                            <TableHead>Dokumen Pendukung</TableHead>
                            <TableHead>Catatan Evaluator</TableHead>
                            {canEditTindakLanjut && <TableHead className="w-[80px]">Aksi</TableHead>}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {item.temuan_rekomendasi_summary.data.map((tr, index) => (
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
                              <TableCell className="max-w-xs">
                                <div className="text-sm whitespace-pre-wrap break-words">
                                  {tr.tindak_lanjut || '-'}
                                </div>
                              </TableCell>
                              <TableCell className="max-w-xs">
                                {(() => {
                                  const validUrl = formatDokumenUrl(tr.dokumen_pendukung_tindak_lanjut);

                                  if (validUrl) {
                                    return (
                                      <FileViewLink
                                        hasFile={true}
                                        fileUrls={{
                                          view_url: validUrl,
                                          file_url: validUrl
                                        }}
                                        linkText="Lihat Dokumen"
                                        showIcon={true}
                                        className="text-sm truncate max-w-48 text-primary hover:text-primary/80 underline"
                                      />
                                    );
                                  }

                                  return <span className="text-sm text-muted-foreground">-</span>;
                                })()}
                              </TableCell>
                              <TableCell className="max-w-xs">
                                <div className="text-sm whitespace-pre-wrap break-words">
                                  {tr.catatan_evaluator || '-'}
                                </div>
                              </TableCell>
                              {canEditTindakLanjut && (
                                <TableCell>
                                  <ActionDropdown
                                    onEdit={() => handleEditTindakLanjut(index)}
                                    showEdit={!isOperationInProgress}
                                    showView={false}
                                    showDelete={false}
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

              {/* Status Actions */}
              {canChangeTindakLanjutStatus && item?.temuan_rekomendasi_summary?.data && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Aksi Tindak Lanjut</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Current Status Display */}
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground">Status Tindak Lanjut saat ini:</span>
                        {getTindakLanjutStatusBadge(item?.status_tindak_lanjut)}
                      </div>
                    </div>

                    {/* Workflow Instructions */}
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950 dark:border-green-800">
                      <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">Alur Kerja Tindak Lanjut:</h4>
                      <ul className="text-xs text-green-700 dark:text-green-300 space-y-1 list-disc list-inside">
                        <li><strong>Draft Tindak Lanjut:</strong> Perwadag isi tindak lanjut + dokumen → kirim ke Review</li>
                        <li><strong>Review Ketua Tim Tindak Lanjut:</strong> Ketua Tim isi catatan evaluator → setujui atau kembalikan</li>
                        <li><strong>Review Pengendali Tindak Lanjut:</strong> Pengendali Teknis review → finalisasi atau kembalikan</li>
                        <li><strong>Selesai Tindak Lanjut:</strong> Tindak lanjut selesai, matriks terkunci</li>
                      </ul>
                    </div>

                    {/* Local Changes Warning */}
                    {hasLocalChanges && (
                      <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg dark:bg-orange-950 dark:border-orange-800">
                        <div className="w-4 h-4 rounded-full bg-orange-400 dark:bg-orange-500 flex-shrink-0 mt-0.5"></div>
                        <p className="text-sm text-orange-800 dark:text-orange-200">
                          Ada perubahan tindak lanjut yang belum disimpan. Simpan perubahan terlebih dahulu sebelum mengubah status.
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {(() => {
                      const nextAction = getNextTindakLanjutAction(item?.status_tindak_lanjut);
                      return (
                        <div className="flex flex-wrap gap-2">
                          {/* Rollback button - show for CHECKING and VALIDATING status */}
                          {canChangeTindakLanjutStatus && (item?.status_tindak_lanjut === 'CHECKING' || item?.status_tindak_lanjut === 'VALIDATING') && (
                            <Button
                              variant="destructive"
                              onClick={handleRollback}
                              disabled={isChangingStatus || hasLocalChanges}
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
                          {canChangeTindakLanjutStatus && nextAction && (
                            <Button
                              onClick={() => handleStatusChangeClick(nextAction.next)}
                              disabled={isChangingStatus || hasLocalChanges}
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
                      );
                    })()}
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
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TindakLanjutStatusChangeConfirmDialog
        open={statusChangeConfirmOpen}
        onOpenChange={setStatusChangeConfirmOpen}
        newStatus={newStatusToSet}
        onConfirm={confirmStatusChange}
        loading={isChangingStatus}
      />

      {/* Modular Dialog Components */}
      <TindakLanjutFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        editingIndex={editingIndex}
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        fieldPermissions={getFieldPermissions()}
        isSaving={isSaving}
      />
    </>
  );
};

export default TindakLanjutMatriksDialog;