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
import { Loader2, ExternalLink } from 'lucide-react';
import { MatriksResponse, TemuanRekomendasi, TindakLanjutStatus } from '@/services/matriks/types';
import { formatIndonesianDateRange } from '@/utils/timeFormat';
import { matriksService } from '@/services/matriks';
import { useToast } from '@workspace/ui/components/sonner';

interface TindakLanjutMatriksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MatriksResponse | null;
  mode: 'edit' | 'view';
  onSave?: (data: any) => void;
  onStatusChange?: (itemId: number, status: TindakLanjutStatus) => void;
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
  const isEditable = mode === 'edit';
  
  // Loading states for different operations
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  
  // Form dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({ 
    tindak_lanjut: '', 
    dokumen_pendukung_tindak_lanjut: '', 
    catatan_evaluator: '' 
  });

  // Get status badge with background colors
  const getTindakLanjutStatusBadge = (status?: TindakLanjutStatus) => {
    switch (status) {
      case 'DRAFTING':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100">
            Draft TL
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
            Belum Ada TL
          </span>
        );
    }
  };

  // Get next status and button label for tindak lanjut
  const getNextTindakLanjutAction = (currentStatus?: TindakLanjutStatus) => {
    switch (currentStatus) {
      case 'DRAFTING': return { next: 'CHECKING' as TindakLanjutStatus, label: 'Kirim ke Review' };
      case 'CHECKING': return { next: 'VALIDATING' as TindakLanjutStatus, label: 'Setujui & Lanjutkan' };
      case 'VALIDATING': return { next: 'FINISHED' as TindakLanjutStatus, label: 'Finalisasi TL' };
      default: return null;
    }
  };

  // Check if user can edit tindak lanjut based on permissions
  const canEditTindakLanjut = item?.user_permissions?.can_edit_tindak_lanjut && item?.is_editable && isEditable;
  
  // Check if user can change tindak lanjut status
  const canChangeTindakLanjutStatus = item?.user_permissions?.can_change_tindak_lanjut_status && item?.is_editable;

  useEffect(() => {
    if (!item || !open) {
      setEditingIndex(null);
      setFormData({ tindak_lanjut: '', dokumen_pendukung_tindak_lanjut: '', catatan_evaluator: '' });
      setFormDialogOpen(false);
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

    setIsSaving(true);
    try {
      const temuanItem = item.temuan_rekomendasi_summary.data[editingIndex];
      
      if (temuanItem.id) {
        await matriksService.updateTindakLanjut(item.id, temuanItem.id, {
          tindak_lanjut: formData.tindak_lanjut,
          dokumen_pendukung_tindak_lanjut: formData.dokumen_pendukung_tindak_lanjut,
          catatan_evaluator: formData.catatan_evaluator
        });

        setFormDialogOpen(false);
        setEditingIndex(null);
        setFormData({ tindak_lanjut: '', dokumen_pendukung_tindak_lanjut: '', catatan_evaluator: '' });
        
        // Refresh parent data
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

  const handleStatusChange = async (itemId: number, newStatus: TindakLanjutStatus) => {
    if (!onStatusChange || isChangingStatus) return;

    setIsChangingStatus(true);
    try {
      await onStatusChange(itemId, newStatus);
    } catch (error) {
      console.error('Error changing tindak lanjut status:', error);
    } finally {
      setIsChangingStatus(false);
    }
  };

  const handleRollback = async (itemId: number) => {
    const rollbackStatus: TindakLanjutStatus = 'DRAFTING';
    await handleStatusChange(itemId, rollbackStatus);
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
              {mode === 'view' ? 'Detail Tindak Lanjut Matriks' : 'Edit Tindak Lanjut Matriks'}
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
                            <TableHead>Status TL</TableHead>
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
                                {tr.dokumen_pendukung_tindak_lanjut && (
                                  <div className="mt-1">
                                    <a 
                                      href={tr.dokumen_pendukung_tindak_lanjut} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                      Lihat Dokumen
                                    </a>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                {getTindakLanjutStatusBadge(tr.status_tindak_lanjut)}
                              </TableCell>
                              {canEditTindakLanjut && (
                                <TableCell>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditTindakLanjut(index)}
                                    disabled={isOperationInProgress}
                                  >
                                    Edit
                                  </Button>
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
                    {/* Workflow Instructions */}
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="text-sm font-medium text-green-800 mb-2">Alur Kerja Tindak Lanjut:</h4>
                      <ul className="text-xs text-green-700 space-y-1 list-disc list-inside">
                        <li><strong>DRAFTING:</strong> Perwadag isi tindak lanjut + dokumen → kirim ke Review</li>
                        <li><strong>CHECKING:</strong> Ketua Tim isi catatan evaluator → setujui atau kembalikan</li>
                        <li><strong>VALIDATING:</strong> Pengendali Teknis review → finalisasi atau kembalikan</li>
                        <li><strong>FINISHED:</strong> Tindak lanjut selesai, matriks terkunci</li>
                      </ul>
                    </div>

                    {/* Status Action Buttons for each item */}
                    {item.temuan_rekomendasi_summary.data.map((tr, index) => {
                      const nextAction = getNextTindakLanjutAction(tr.status_tindak_lanjut);
                      return (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">Temuan {index + 1}</span>
                            {getTindakLanjutStatusBadge(tr.status_tindak_lanjut)}
                          </div>
                          
                          <div className="flex gap-2">
                            {/* Rollback button */}
                            {(tr.status_tindak_lanjut === 'CHECKING' || tr.status_tindak_lanjut === 'VALIDATING') && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => tr.id && handleRollback(tr.id)}
                                disabled={isChangingStatus}
                              >
                                {isChangingStatus ? 'Loading...' : 'Kembalikan ke Draft'}
                              </Button>
                            )}
                            
                            {/* Next status button */}
                            {nextAction && (
                              <Button
                                size="sm"
                                onClick={() => tr.id && handleStatusChange(tr.id, nextAction.next)}
                                disabled={isChangingStatus}
                              >
                                {isChangingStatus ? 'Loading...' : nextAction.label}
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
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

      {/* Form Input Dialog */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Edit Tindak Lanjut {editingIndex !== null ? `Temuan ${editingIndex + 1}` : ''}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="form-tindak-lanjut">Tindak Lanjut</Label>
              <Textarea
                id="form-tindak-lanjut"
                value={formData.tindak_lanjut}
                onChange={(e) => setFormData({ ...formData, tindak_lanjut: e.target.value })}
                placeholder="Masukkan tindak lanjut yang akan dilakukan..."
                rows={4}
                disabled={isSaving}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="form-dokumen">Dokumen Pendukung (URL)</Label>
              <Textarea
                id="form-dokumen"
                value={formData.dokumen_pendukung_tindak_lanjut}
                onChange={(e) => setFormData({ ...formData, dokumen_pendukung_tindak_lanjut: e.target.value })}
                placeholder="Masukkan URL dokumen pendukung..."
                rows={2}
                disabled={isSaving}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="form-catatan">Catatan Evaluator</Label>
              <Textarea
                id="form-catatan"
                value={formData.catatan_evaluator}
                onChange={(e) => setFormData({ ...formData, catatan_evaluator: e.target.value })}
                placeholder="Masukkan catatan evaluator..."
                rows={3}
                disabled={isSaving}
              />
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
                'Simpan'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TindakLanjutMatriksDialog;