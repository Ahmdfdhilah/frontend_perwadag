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
import { Calendar } from '@workspace/ui/components/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover';
import { CalendarIcon, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@workspace/ui/lib/utils';
import { MeetingResponse } from '@/services/meeting/types';
import { useFormPermissions } from '@/hooks/useFormPermissions';
import { formatIndonesianDate, formatIndonesianDateRange } from '@/utils/timeFormat';
import FileUpload from '@/components/common/FileUpload';

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
  const [formData, setFormData] = useState<any>({});
  const [selectedExitDate, setSelectedExitDate] = useState<Date>();
  const [isExitDatePickerOpen, setIsExitDatePickerOpen] = useState(false);
  const [meetingFiles, setMeetingFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<Array<{ name: string; url?: string }>>([]);

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
        url: file.download_url 
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
    }
  }, [item, open]);

  const handleSave = () => {
    const dataToSave = {
      tanggal_meeting: selectedExitDate ? selectedExitDate.toISOString().split('T')[0] : formData.tanggal_meeting,
      link_zoom: formData.link_zoom,
      link_daftar_hadir: formData.link_daftar_hadir,
      files: meetingFiles,
    };
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

  const isEditable = mode === 'edit';
  const canEdit = canEditForm('exit_meeting') && isEditable;

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
                {canEdit ? (
                  <Popover open={isExitDatePickerOpen} onOpenChange={setIsExitDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedExitDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedExitDate ? (
                          format(selectedExitDate, "dd MMMM yyyy", { locale: id })
                        ) : (
                          <span>Pilih tanggal</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedExitDate}
                        onSelect={(date) => {
                          setSelectedExitDate(date);
                          setIsExitDatePickerOpen(false);
                        }}
                        initialFocus
                        locale={id}
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <div className="p-3 bg-muted rounded-md">
                    {item ? formatIndonesianDate(item.tanggal_meeting) : '-'}
                  </div>
                )}
              </div>
            </div>

            {/* Link Zoom - Editable */}
            <div className="space-y-2">
              <Label htmlFor="link_zoom">Link Zoom</Label>
              {canEdit ? (
                <div className="flex gap-2">
                  <Input
                    id="link_zoom"
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
              <Label htmlFor="link_daftar_hadir">Link Daftar Hadir (Google Form)</Label>
              {canEdit ? (
                <div className="flex gap-2">
                  <Input
                    id="link_daftar_hadir"
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
              accept="*/*"
              multiple={true}
              maxSize={10 * 1024 * 1024} // 10MB
              maxFiles={5}
              files={meetingFiles}
              existingFiles={existingFiles}
              mode={canEdit ? 'edit' : 'view'}
              disabled={!canEdit}
              onFilesChange={handleMeetingFilesChange}
              onExistingFileRemove={handleExistingFilesRemove}
              description="Upload bukti hadir meeting (Max 10MB per file)"
            />
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button variant="outline" onClick={handleCancel}>
            {mode === 'view' ? 'Tutup' : 'Batal'}
          </Button>
          {canEdit && (
            <Button onClick={handleSave}>
              Simpan
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExitMeetingDialog;