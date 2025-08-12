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
import { ExternalLink, Loader2 } from 'lucide-react';
import DateTimePicker from '@/components/common/DateTimePicker';
import { MeetingResponse } from '@/services/meeting/types';
import { useFormPermissions } from '@/hooks/useFormPermissions';
import { useRole } from '@/hooks/useRole';
import {  formatIndonesianDateRange, formatDateTimeForAPI, formatMeetingDate } from '@/utils/timeFormat';
import FileUpload from '@/components/common/FileUpload';
import FileDeleteConfirmDialog from '@/components/common/FileDeleteConfirmDialog';
import { meetingService } from '@/services/meeting';
import { useToast } from '@workspace/ui/components/sonner';

interface ExitMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MeetingResponse | null;
  mode: 'view' | 'edit';
  onSave: (data: any) => void;
}

const ExitMeetingDialog: React.FC<ExitMeetingDialogProps> = ({
  open,
  onOpenChange,
  item,
  mode,
  onSave,
}) => {
  const { canEditForm } = useFormPermissions();
  const { isAdmin, isInspektorat, isPimpinan } = useRole();
  const { toast } = useToast();
  const [formData, setFormData] = useState<any>({});
  const [selectedExitDate, setSelectedExitDate] = useState<Date>();
  const [meetingFiles, setMeetingFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<Array<{ name: string; url?: string; viewUrl?: string; filename?: string }>>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<{ index: number; name: string; filename: string } | null>(null);
  const [deletingFile, setDeletingFile] = useState(false);
  
  // Loading states for different operations
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (item && open) {
      setFormData({
        tanggal_meeting: item.tanggal_meeting,
        link_zoom: item.link_zoom || '',
        link_daftar_hadir: item.link_daftar_hadir || '',
      });
      setSelectedExitDate(item.tanggal_meeting ? new Date(item.tanggal_meeting) : undefined);
      
      // Set existing files for display
      setExistingFiles(item.files_info?.files ? item.files_info.files.map((file, index) => ({ 
        name: file.original_filename || `Bukti Hadir ${index + 1}`, 
        url: file.download_url,
        viewUrl: file.file_url,
        size: file.size,
        filename: file.filename
      })) : []);
    } else {
      setFormData({
        tanggal_meeting: '',
        link_zoom: '',
        link_daftar_hadir: '',
      });
      setSelectedExitDate(undefined);
      setMeetingFiles([]);
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
      const dataToSave: any = {
        files: meetingFiles,
      };
      
      // Only include fields that the user can edit
      if (canEditAllFields) {
        dataToSave.tanggal_meeting = selectedExitDate ? formatDateTimeForAPI(selectedExitDate) : formData.tanggal_meeting;
        dataToSave.link_zoom = formData.link_zoom || '';
        dataToSave.link_daftar_hadir = formData.link_daftar_hadir || '';
      }
      
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


  const handleOpenLink = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleMeetingFilesChange = (files: File[]) => {
    // Prevent file changes during save operation
    if (isSaving) return;
    setMeetingFiles(files);
  };

  const handleExistingFilesRemove = (index: number) => {
    // Prevent file removal during save operation
    if (isSaving || !existingFiles[index]) return;
    
    const fileToRemove = existingFiles[index];
    if (!fileToRemove.filename) return;
    
    setFileToDelete({
      index,
      name: fileToRemove.name,
      filename: fileToRemove.filename
    });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!fileToDelete || !item?.id || deletingFile) return;
    
    setDeletingFile(true);
    try {
      await meetingService.deleteFile(item.id, fileToDelete.filename);
      
      // Remove from UI
      setExistingFiles(prev => prev.filter((_, i) => i !== fileToDelete.index));
      
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

  const handleFileDownload = async (file: { name: string; url?: string; viewUrl?: string }, index: number) => {
    if (!item?.id || !item?.files_info?.files?.[index] || isDownloading) return;
    
    setIsDownloading(true);
    try {
      const fileMetadata = item.files_info.files[index];
      const filename = fileMetadata.filename;
      const blob = await meetingService.downloadFile(item.id, filename);
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
  const canEdit = canEditForm('exit_meeting') && isEditable;
  const canEditAllFields = canEdit && (isAdmin() || isInspektorat() || isPimpinan());
  const canEditBuktiHadir = canEdit; // All roles can edit bukti hadir
  
  // Determine if any operation is in progress
  const isOperationInProgress = isSaving || isDownloading || deletingFile;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle>
            {mode === 'view' ? 'Lihat Exit Meeting' : 'Edit Exit Meeting'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-6">
            {/* Info Basic - Read Only */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Nama Perwadag</Label>
                <div className="p-3 bg-muted rounded-md">
                  {item?.nama_perwadag}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Tanggal Evaluasi</Label>
                <div className="p-3 bg-muted rounded-md">
                  {item ? formatIndonesianDateRange(item.tanggal_evaluasi_mulai, item.tanggal_evaluasi_selesai) : '-'}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tanggal Exit Meeting</Label>
                {canEditAllFields ? (
                  <DateTimePicker
                    value={selectedExitDate}
                    onChange={setSelectedExitDate}
                    placeholder="Pilih tanggal dan waktu"
                    disabled={isSaving}
                  />
                ) : (
                  <div className="p-3 bg-muted rounded-md">
                    {item?.tanggal_meeting ? formatMeetingDate(item.tanggal_meeting) : '-'}
                  </div>
                )}
              </div>
            </div>

            {/* Link Zoom - Editable */}
            <div className="space-y-2">
              <Label htmlFor="link_zoom">Link Zoom</Label>
              {canEditAllFields ? (
                <div className="flex gap-2">
                  <Input
                    id="link_zoom"
                    value={formData.link_zoom || ''}
                    onChange={(e) => setFormData({ ...formData, link_zoom: e.target.value })}
                    placeholder="https://zoom.us/j/..."
                    disabled={isSaving}
                    className={isSaving ? "bg-muted" : ""}
                  />
                  {formData.link_zoom && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenLink(formData.link_zoom!)}
                      disabled={isSaving}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="p-3 bg-muted rounded-md flex-1">
                    {item?.link_zoom || '-'}
                  </div>
                  {item?.link_zoom && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenLink(item.link_zoom!)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Link Daftar Hadir */}
            <div className="space-y-2">
              <Label htmlFor="link_daftar_hadir">Link Daftar Hadir </Label>
              {canEditAllFields ? (
                <div className="flex gap-2">
                  <Input
                    id="link_daftar_hadir"
                    value={formData.link_daftar_hadir || ''}
                    onChange={(e) => setFormData({ ...formData, link_daftar_hadir: e.target.value })}
                    placeholder="https://forms.google.com/..."
                    disabled={isSaving}
                    className={isSaving ? "bg-muted" : ""}
                  />
                  {formData.link_daftar_hadir && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenLink(formData.link_daftar_hadir!)}
                      disabled={isSaving}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="p-3 bg-muted rounded-md flex-1">
                    {item?.link_daftar_hadir || '-'}
                  </div>
                  {item?.link_daftar_hadir && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenLink(item.link_daftar_hadir!)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Upload Bukti Hadir */}
            <FileUpload
              label="Upload Bukti Hadir"
              accept="image/*,.jpg,.jpeg,.png,.gif,.webp"
              multiple={true}
              maxSize={10 * 1024 * 1024} // 10MB
              maxFiles={5}
              files={meetingFiles}
              existingFiles={existingFiles}
              mode={canEditBuktiHadir && !isSaving ? 'edit' : 'view'}
              disabled={!canEditBuktiHadir || isSaving}
              onFilesChange={handleMeetingFilesChange}
              onExistingFileRemove={handleExistingFilesRemove}
              onFileDownload={handleFileDownload}
              description="Upload bukti hadir meeting dalam format gambar (Max 10MB per file)"
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
          {(canEditAllFields || canEditBuktiHadir) && (
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

export default ExitMeetingDialog;