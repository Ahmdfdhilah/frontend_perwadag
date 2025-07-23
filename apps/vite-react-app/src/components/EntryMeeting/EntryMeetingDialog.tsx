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
import { ExternalLink } from 'lucide-react';
import DatePicker from '@/components/common/DatePicker';
import { MeetingResponse } from '@/services/meeting/types';
import { useFormPermissions } from '@/hooks/useFormPermissions';
import { useRole } from '@/hooks/useRole';
import { formatIndonesianDate, formatIndonesianDateRange } from '@/utils/timeFormat';
import FileUpload from '@/components/common/FileUpload';
import { meetingService } from '@/services/meeting';

interface EntryMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MeetingResponse | null;
  mode: 'view' | 'edit';
  onSave: (data: any) => void;
}

const EntryMeetingDialog: React.FC<EntryMeetingDialogProps> = ({
  open,
  onOpenChange,
  item,
  mode,
  onSave,
}) => {
  const { canEditForm } = useFormPermissions();
  const { isAdmin, isInspektorat } = useRole();
  const [formData, setFormData] = useState<any>({});
  const [selectedEntryDate, setSelectedEntryDate] = useState<Date>();
  const [meetingFiles, setMeetingFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<Array<{ name: string; url?: string; viewUrl?: string }>>([]);

  useEffect(() => {
    if (item && open) {
      setFormData({
        tanggal_meeting: item.tanggal_meeting,
        link_zoom: item.link_zoom || '',
        link_daftar_hadir: item.link_daftar_hadir || '',
      });
      setSelectedEntryDate(item.tanggal_meeting ? new Date(item.tanggal_meeting) : undefined);
      
      // Set existing files for display
      setExistingFiles(item.files_info?.files ? item.files_info.files.map((file, index) => ({ 
        name: file.original_filename || `Bukti Hadir ${index + 1}`, 
        url: file.download_url,
        viewUrl: file.file_url
      })) : []);
    } else {
      setFormData({});
      setSelectedEntryDate(undefined);
      setMeetingFiles([]);
      setExistingFiles([]);
    }
  }, [item, open]);

  const handleSave = () => {
    const dataToSave: any = {
      files: meetingFiles,
    };
    
    // Only include fields that the user can edit
    if (canEditAllFields) {
      dataToSave.tanggal_meeting = selectedEntryDate ? selectedEntryDate.toISOString().split('T')[0] : formData.tanggal_meeting;
      dataToSave.link_zoom = formData.link_zoom;
      dataToSave.link_daftar_hadir = formData.link_daftar_hadir;
    }
    
    onSave(dataToSave);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };


  const handleOpenLink = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleMeetingFilesChange = (files: File[]) => {
    setMeetingFiles(files);
  };

  const handleExistingFilesRemove = (index: number) => {
    setExistingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileDownload = async (file: { name: string; url?: string; viewUrl?: string }) => {
    if (!item?.id) return;
    
    try {
      const blob = await meetingService.downloadFile(item.id, file.name);
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

  const isEditable = mode === 'edit';
  const canEdit = canEditForm('entry_meeting') && isEditable;
  const canEditAllFields = canEdit && (isAdmin() || isInspektorat());
  const canEditBuktiHadir = canEdit; // All roles can edit bukti hadir


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle>
            {mode === 'view' ? 'Lihat Entry Meeting' : 'Edit Entry Meeting'}
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
                <Label>Tanggal Entry Meeting</Label>
                {canEditAllFields ? (
                  <DatePicker
                    value={selectedEntryDate}
                    onChange={setSelectedEntryDate}
                    placeholder="Pilih tanggal"
                  />
                ) : (
                  <div className="p-3 bg-muted rounded-md">
                    {item?.tanggal_meeting ? formatIndonesianDate(item.tanggal_meeting) : '-'}
                  </div>
                )}
              </div>
            </div>

            {/* Link Zoom - Editable */}
            <div className="space-y-2">
              <Label htmlFor="linkZoom">Link Zoom</Label>
              {canEditAllFields ? (
                <div className="flex gap-2">
                  <Input
                    id="linkZoom"
                    value={formData.link_zoom || ''}
                    onChange={(e) => setFormData({ ...formData, link_zoom: e.target.value })}
                    placeholder="https://zoom.us/j/..."
                  />
                  {formData.link_zoom && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenLink(formData.link_zoom!)}
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
              <Label htmlFor="linkDaftarHadir">Link Daftar Hadir (Google Form)</Label>
              {canEditAllFields ? (
                <div className="flex gap-2">
                  <Input
                    id="linkDaftarHadir"
                    value={formData.link_daftar_hadir || ''}
                    onChange={(e) => setFormData({ ...formData, link_daftar_hadir: e.target.value })}
                    placeholder="https://forms.google.com/..."
                  />
                  {formData.link_daftar_hadir && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenLink(formData.link_daftar_hadir!)}
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
              mode={canEditBuktiHadir ? 'edit' : 'view'}
              disabled={!canEditBuktiHadir}
              onFilesChange={handleMeetingFilesChange}
              onExistingFileRemove={handleExistingFilesRemove}
              onFileDownload={handleFileDownload}
              description="Upload bukti hadir meeting dalam format gambar (Max 10MB per file)"
            />
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button variant="outline" onClick={handleCancel}>
            {mode === 'view' ? 'Tutup' : 'Batal'}
          </Button>
          {(canEditAllFields || canEditBuktiHadir) && (
            <Button onClick={handleSave}>
              Simpan
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EntryMeetingDialog;