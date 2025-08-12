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
import { PerwadagCombobox } from '@/components/common/PerwadagCombobox';
import UserAssignmentCombobox from '@/components/common/UserAssignmentCombobox';
import MultiUserAssignmentCombobox from '@/components/common/MultiUserAssignmentCombobox';
import DatePicker from '@/components/common/DatePicker';
import { SuratTugasResponse } from '@/services/suratTugas/types';
import { useFormPermissions } from '@/hooks/useFormPermissions';
import { useRole } from '@/hooks/useRole';
import FileUpload from '@/components/common/FileUpload';
import FileDeleteConfirmDialog from '@/components/common/FileDeleteConfirmDialog';
import { formatDateForAPI } from '@/utils/timeFormat';
import { suratTugasService } from '@/services/suratTugas';
import { useToast } from '@workspace/ui/components/sonner';

interface SuratTugasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: SuratTugasResponse | null;
  mode: 'view' | 'edit' | 'create';
  onSave: (data: any) => void;
}

const SuratTugasDialog: React.FC<SuratTugasDialogProps> = ({
  open,
  onOpenChange,
  editingItem,
  mode,
  onSave,
}) => {
  const { canEditForm } = useFormPermissions();
  const { user } = useRole();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    no_surat: '',
    user_perwadag_id: '',
    tanggal_evaluasi_mulai: undefined as Date | undefined,
    tanggal_evaluasi_selesai: undefined as Date | undefined,
    pengedali_mutu_id: '',
    pengendali_teknis_id: '',
    ketua_tim_id: '',
    anggota_tim_ids: [] as string[],
    pimpinan_inspektorat_id: '',
  });

  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<Array<{ name: string; url?: string; viewUrl?: string; size?: number; filename?: string }>>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<{ name: string; filename: string } | null>(null);
  const [deletingFile, setDeletingFile] = useState(false);
  
  // Loading states for different operations
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedPerwadagInspektorat, setSelectedPerwadagInspektorat] = useState<string>(''); // Track inspektorat from selected perwadag

  useEffect(() => {
    if (editingItem) {
      setFormData({
        no_surat: editingItem.no_surat,
        user_perwadag_id: editingItem.user_perwadag_id,
        tanggal_evaluasi_mulai: new Date(editingItem.tanggal_evaluasi_mulai),
        tanggal_evaluasi_selesai: editingItem.tanggal_evaluasi_selesai ? new Date(editingItem.tanggal_evaluasi_selesai) : undefined,
        pengedali_mutu_id: editingItem.assignment_info?.pengedali_mutu?.id || '',
        pengendali_teknis_id: editingItem.assignment_info?.pengendali_teknis?.id || '',
        ketua_tim_id: editingItem.assignment_info?.ketua_tim?.id || '',
        anggota_tim_ids: editingItem.assignment_info?.anggota_tim?.map(user => user.id) || [],
        pimpinan_inspektorat_id: editingItem.assignment_info?.pimpinan_inspektorat?.id || '',
      });
      
      // Set existing files for display
      if (editingItem.file_surat_tugas && editingItem.file_metadata) {
        setExistingFiles([{ 
          name: editingItem.file_metadata.original_filename || editingItem.file_metadata.filename || 'Surat Tugas',
          url: editingItem.file_urls?.download_url,
          viewUrl: editingItem.file_urls?.file_url,
          size: editingItem.file_metadata.size,
          filename: editingItem.file_metadata.original_filename || editingItem.file_metadata.filename
        }]);
      } else {
        setExistingFiles([]);
      }
      
      // Reset file to delete when opening dialog
      setFileToDelete(null);
      setDeleteConfirmOpen(false);
      
      // Set inspektorat for assignment fields
      if (editingItem.inspektorat) {
        setSelectedPerwadagInspektorat(editingItem.inspektorat);
      }
    } else {
      setFormData({
        no_surat: '',
        user_perwadag_id: '',
        tanggal_evaluasi_mulai: undefined,
        tanggal_evaluasi_selesai: undefined,
        pengedali_mutu_id: '',
        pengendali_teknis_id: '',
        ketua_tim_id: '',
        anggota_tim_ids: [],
        pimpinan_inspektorat_id: '',
      });
      setUploadFiles([]);
      setExistingFiles([]);
      setFileToDelete(null);
      setDeleteConfirmOpen(false);
      
      // Reset inspektorat for create mode
      setSelectedPerwadagInspektorat('');
    }
    
    
    // Reset loading states when dialog opens/closes
    setIsSaving(false);
    setIsDownloading(false);
  }, [editingItem, open]);

  const handleSave = async () => {
    if (isSaving) return;
    
    // Validate all required fields
    if (!formData.no_surat || !formData.user_perwadag_id || !formData.tanggal_evaluasi_mulai || !formData.tanggal_evaluasi_selesai) {
      return;
    }

    // For create mode, file upload is required
    // For edit mode, file is only required if there's no existing file
    if (mode === 'create' && uploadFiles.length === 0) {
      return;
    }

    setIsSaving(true);
    try {
      const saveData = {
        user_perwadag_id: formData.user_perwadag_id,
        tanggal_evaluasi_mulai: formatDateForAPI(formData.tanggal_evaluasi_mulai),
        tanggal_evaluasi_selesai: formData.tanggal_evaluasi_selesai ? formatDateForAPI(formData.tanggal_evaluasi_selesai) : undefined,
        no_surat: formData.no_surat || '',
        pengedali_mutu_id: formData.pengedali_mutu_id && formData.pengedali_mutu_id.trim() ? formData.pengedali_mutu_id : undefined,
        pengendali_teknis_id: formData.pengendali_teknis_id && formData.pengendali_teknis_id.trim() ? formData.pengendali_teknis_id : undefined,
        ketua_tim_id: formData.ketua_tim_id && formData.ketua_tim_id.trim() ? formData.ketua_tim_id : undefined,
        anggota_tim_ids: formData.anggota_tim_ids || [],
        pimpinan_inspektorat_id: formData.pimpinan_inspektorat_id && formData.pimpinan_inspektorat_id.trim() ? formData.pimpinan_inspektorat_id : undefined,
        file: uploadFiles.length > 0 ? uploadFiles[0] : null,
      };


      await onSave(saveData);
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

  const handleExistingFileRemove = (index: number) => {
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
    if (!fileToDelete || !editingItem?.id || deletingFile) return;
    
    setDeletingFile(true);
    try {
      await suratTugasService.deleteFile(editingItem.id, fileToDelete.filename);
      
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
    if (!editingItem?.id || isDownloading) return;
    
    setIsDownloading(true);
    try {
      const blob = await suratTugasService.downloadFile(editingItem.id);
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


  const isFormValid = formData.no_surat && 
    formData.user_perwadag_id && 
    formData.tanggal_evaluasi_mulai && 
    formData.tanggal_evaluasi_selesai &&
    (mode !== 'create' || uploadFiles.length > 0);
  const isEditable = mode !== 'view';
  const canEdit = canEditForm('surat_tugas') && isEditable;
  
  // Determine if any operation is in progress
  const isOperationInProgress = isSaving || isDownloading || deletingFile;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle>
            {mode === 'view' ? 'Lihat Surat Tugas' : 
             mode === 'edit' ? 'Edit Surat Tugas' : 
             'Tambah Surat Tugas'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="no_surat">Nomor Surat Tugas *</Label>
              <Input
                id="no_surat"
                value={formData.no_surat}
                onChange={(e) => setFormData(prev => ({ ...prev, no_surat: e.target.value }))}
                placeholder="Contoh: ST/001/I/2024"
                disabled={!canEdit || isSaving}
                className={isSaving ? "bg-muted" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="perwadag">Perwadag *</Label>
              {mode === 'edit' || !canEdit ? (
                <Input
                  id="perwadag"
                  value={editingItem ? editingItem.nama_perwadag : ''}
                  disabled={true}
                  className="bg-muted"
                />
              ) : (
                <PerwadagCombobox
                  value={formData.user_perwadag_id}
                  onChange={(value, selectedItem) => {
                    // Clear all assignment fields when perwadag changes in create mode
                    if (mode === 'create') {
                      setFormData(prev => ({
                        ...prev,
                        user_perwadag_id: value,
                        pengedali_mutu_id: '',
                        pengendali_teknis_id: '',
                        ketua_tim_id: '',
                        anggota_tim_ids: [],
                        pimpinan_inspektorat_id: '',
                      }));
                    } else {
                      setFormData(prev => ({ ...prev, user_perwadag_id: value }));
                    }
                    
                    // Get inspektorat from selected perwadag
                    if (selectedItem && selectedItem.inspektorat) {
                      setSelectedPerwadagInspektorat(selectedItem.inspektorat);
                    } else {
                      // Clear inspektorat if no perwadag selected
                      setSelectedPerwadagInspektorat('');
                    }
                  }}
                  includeAllOption={false}
                />
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Tanggal Mulai Evaluasi *</Label>
                <DatePicker
                  value={formData.tanggal_evaluasi_mulai}
                  onChange={(date) => setFormData(prev => ({ ...prev, tanggal_evaluasi_mulai: date }))}
                  placeholder="Pilih tanggal mulai"
                  disabled={!canEdit || isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label>Tanggal Selesai Evaluasi *</Label>
                <DatePicker
                  value={formData.tanggal_evaluasi_selesai}
                  onChange={(date) => setFormData(prev => ({ ...prev, tanggal_evaluasi_selesai: date }))}
                  placeholder="Pilih tanggal selesai"
                  disabled={!canEdit || isSaving}
                  disabledDates={(date) => {
                    if (!formData.tanggal_evaluasi_mulai) return false;
                    return date < formData.tanggal_evaluasi_mulai;
                  }}
                />
              </div>
            </div>

            {/* Assignment Section */}
            <div className="space-y-4 border-t pt-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">Tim Evaluasi (Opsional)</Label>
                <div className="text-sm text-muted-foreground">
                  Pilih anggota tim evaluasi untuk surat tugas ini.
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>Pengedali Mutu</Label>
                  <UserAssignmentCombobox
                    value={formData.pengedali_mutu_id}
                    onChange={(value) => setFormData(prev => ({ ...prev, pengedali_mutu_id: value as string }))}
                    placeholder="Pilih pengedali mutu"
                    inspektorat={selectedPerwadagInspektorat || editingItem?.inspektorat || user?.inspektorat}
                    disabled={!canEdit || isSaving || (mode === 'create' && !selectedPerwadagInspektorat)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Pengendali Teknis</Label>
                  <UserAssignmentCombobox
                    value={formData.pengendali_teknis_id}
                    onChange={(value) => setFormData(prev => ({ ...prev, pengendali_teknis_id: value as string }))}
                    placeholder="Pilih pengendali teknis"
                    inspektorat={selectedPerwadagInspektorat || editingItem?.inspektorat || user?.inspektorat}
                    disabled={!canEdit || isSaving || (mode === 'create' && !selectedPerwadagInspektorat)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ketua Tim</Label>
                  <UserAssignmentCombobox
                    value={formData.ketua_tim_id}
                    onChange={(value) => setFormData(prev => ({ ...prev, ketua_tim_id: value as string }))}
                    placeholder="Pilih ketua tim"
                    inspektorat={selectedPerwadagInspektorat || editingItem?.inspektorat || user?.inspektorat}
                    disabled={!canEdit || isSaving || (mode === 'create' && !selectedPerwadagInspektorat)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Anggota Tim</Label>
                  <MultiUserAssignmentCombobox
                    value={formData.anggota_tim_ids}
                    onChange={(value) => setFormData(prev => ({ ...prev, anggota_tim_ids: value }))}
                    placeholder="Pilih anggota tim"
                    inspektorat={selectedPerwadagInspektorat || editingItem?.inspektorat || user?.inspektorat}
                    disabled={!canEdit || isSaving || (mode === 'create' && !selectedPerwadagInspektorat)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Pimpinan Inspektorat</Label>
                  <UserAssignmentCombobox
                    value={formData.pimpinan_inspektorat_id}
                    onChange={(value) => setFormData(prev => ({ ...prev, pimpinan_inspektorat_id: value as string }))}
                    placeholder="Pilih pimpinan inspektorat"
                    inspektorat={selectedPerwadagInspektorat || editingItem?.inspektorat || user?.inspektorat}
                    roles={['PIMPINAN']}
                    disabled={!canEdit || isSaving || (mode === 'create' && !selectedPerwadagInspektorat)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Informasi Upload Surat Tugas</Label>
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                Silakan upload file surat tugas. File yang didukung: PDF, DOC, DOCX.
              </div>
            </div>

            {/* Assignment Info Display for View Mode */}
            {mode === 'view' && editingItem && (
              <div className="space-y-4 border-t pt-4">
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Tim Evaluasi</Label>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {editingItem.assignment_info?.pengedali_mutu && (
                    <div className="space-y-2">
                      <Label>Pengedali Mutu</Label>
                      <div className="p-3 bg-muted rounded-md text-sm">
                        <div className="font-medium">{editingItem.assignment_info.pengedali_mutu.nama}</div>
                        <div className="text-muted-foreground">
                          {editingItem.assignment_info.pengedali_mutu.jabatan} - {editingItem.assignment_info.pengedali_mutu.role_display}
                        </div>
                      </div>
                    </div>
                  )}

                  {editingItem.assignment_info?.pengendali_teknis && (
                    <div className="space-y-2">
                      <Label>Pengendali Teknis</Label>
                      <div className="p-3 bg-muted rounded-md text-sm">
                        <div className="font-medium">{editingItem.assignment_info.pengendali_teknis.nama}</div>
                        <div className="text-muted-foreground">
                          {editingItem.assignment_info.pengendali_teknis.jabatan} - {editingItem.assignment_info.pengendali_teknis.role_display}
                        </div>
                      </div>
                    </div>
                  )}

                  {editingItem.assignment_info?.ketua_tim && (
                    <div className="space-y-2">
                      <Label>Ketua Tim</Label>
                      <div className="p-3 bg-muted rounded-md text-sm">
                        <div className="font-medium">{editingItem.assignment_info.ketua_tim.nama}</div>
                        <div className="text-muted-foreground">
                          {editingItem.assignment_info.ketua_tim.jabatan} - {editingItem.assignment_info.ketua_tim.role_display}
                        </div>
                      </div>
                    </div>
                  )}

                  {editingItem.assignment_info?.anggota_tim && editingItem.assignment_info.anggota_tim.length > 0 && (
                    <div className="space-y-2">
                      <Label>Anggota Tim</Label>
                      <div className="space-y-2">
                        {editingItem.assignment_info.anggota_tim.map((anggota) => (
                          <div key={anggota.id} className="p-3 bg-muted rounded-md text-sm">
                            <div className="font-medium">{anggota.nama}</div>
                            <div className="text-muted-foreground">
                              {anggota.jabatan} - {anggota.role_display}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {editingItem.assignment_info?.pimpinan_inspektorat && (
                    <div className="space-y-2">
                      <Label>Pimpinan Inspektorat</Label>
                      <div className="p-3 bg-muted rounded-md text-sm">
                        <div className="font-medium">{editingItem.assignment_info.pimpinan_inspektorat.nama}</div>
                        <div className="text-muted-foreground">
                          {editingItem.assignment_info.pimpinan_inspektorat.jabatan} - {editingItem.assignment_info.pimpinan_inspektorat.role_display}
                        </div>
                      </div>
                    </div>
                  )}

                  {!editingItem.assignment_info?.pengedali_mutu && 
                   !editingItem.assignment_info?.pengendali_teknis && 
                   !editingItem.assignment_info?.ketua_tim && 
                   !editingItem.assignment_info?.pimpinan_inspektorat && 
                   (!editingItem.assignment_info?.anggota_tim || editingItem.assignment_info.anggota_tim.length === 0) && (
                    <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground text-center">
                      Belum ada tim evaluasi yang ditugaskan
                    </div>
                  )}
                </div>
              </div>
            )}

            <FileUpload
              label="File Surat Tugas *"
              accept=".pdf,.doc,.docx"
              multiple={false}
              maxSize={10 * 1024 * 1024} // 10MB
              maxFiles={1}
              files={uploadFiles}
              existingFiles={existingFiles}
              mode={canEdit && !isSaving ? 'edit' : 'view'}
              disabled={!canEdit || isSaving}
              onFilesChange={handleUploadFilesChange}
              onExistingFileRemove={handleExistingFileRemove}
              onFileDownload={handleFileDownload}
              description="Format yang didukung: PDF, DOC, DOCX (Max 10MB)"
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
              disabled={!isFormValid || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                mode === 'edit' ? 'Simpan' : 'Buat'
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

export default SuratTugasDialog;