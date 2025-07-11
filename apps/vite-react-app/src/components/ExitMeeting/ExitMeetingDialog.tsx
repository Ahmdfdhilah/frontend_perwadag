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
import { ExitMeeting } from '@/mocks/exitMeeting';
import { useFormPermissions } from '@/hooks/useFormPermissions';
import { formatIndonesianDate, formatIndonesianDateRange } from '@/utils/timeFormat';
import FileUpload from '@/components/common/FileUpload';

interface ExitMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ExitMeeting | null;
  mode: 'view' | 'edit';
  onSave: (data: Partial<ExitMeeting>) => void;
}

const ExitMeetingDialog: React.FC<ExitMeetingDialogProps> = ({
  open,
  onOpenChange,
  item,
  mode,
  onSave,
}) => {
  const { canEditForm } = useFormPermissions();
  const [formData, setFormData] = useState<Partial<ExitMeeting>>({});
  const [selectedExitDate, setSelectedExitDate] = useState<Date>();
  const [isExitDatePickerOpen, setIsExitDatePickerOpen] = useState(false);
  const [buktiHadirFiles, setBuktiHadirFiles] = useState<File[]>([]);
  const [existingBuktiHadir, setExistingBuktiHadir] = useState<Array<{ name: string; url?: string }>>([]);

  useEffect(() => {
    if (item && open) {
      setFormData({ ...item });
      setSelectedExitDate(item.tanggal ? new Date(item.tanggal) : undefined);
      
      // Set existing files for display
      setExistingBuktiHadir(item.buktiImageUrls ? item.buktiImageUrls.map((url, index) => ({ name: `Bukti ${index + 1}`, url })) : []);
    } else {
      setFormData({});
      setSelectedExitDate(undefined);
      setBuktiHadirFiles([]);
      setExistingBuktiHadir([]);
    }
  }, [item, open]);

  const handleSave = () => {
    const dataToSave = {
      ...formData,
      tanggal: selectedExitDate ? selectedExitDate.toISOString().split('T')[0] : formData.tanggal,
      buktiHadirFiles,
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

  const handleBuktiHadirFilesChange = (files: File[]) => {
    setBuktiHadirFiles(files);
  };

  const handleExistingBuktiHadirRemove = (index: number) => {
    setExistingBuktiHadir(prev => prev.filter((_, i) => i !== index));
  };

  const isEditable = mode === 'edit';
  const canEdit = canEditForm('exit_meeting') && isEditable;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
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
                  {item?.perwadagName}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Tanggal Evaluasi</Label>
                <div className="p-3 bg-muted rounded-md">
                  {item ? formatIndonesianDateRange(item.tanggalMulaiEvaluasi, item.tanggalAkhirEvaluasi) : '-'}
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
                    {item ? formatIndonesianDate(item.tanggal) : '-'}
                  </div>
                )}
              </div>
            </div>

            {/* Link Zoom - Editable */}
            <div className="space-y-2">
              <Label htmlFor="linkZoom">Link Zoom</Label>
              {canEdit ? (
                <div className="flex gap-2">
                  <Input
                    id="linkZoom"
                    value={formData.linkZoom || ''}
                    onChange={(e) => setFormData({ ...formData, linkZoom: e.target.value })}
                    placeholder="https://zoom.us/j/..."
                  />
                  {formData.linkZoom && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenLink(formData.linkZoom!)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="p-3 bg-muted rounded-md flex-1">
                    {item?.linkZoom || '-'}
                  </div>
                  {item?.linkZoom && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenLink(item.linkZoom!)}
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
              {canEdit ? (
                <div className="flex gap-2">
                  <Input
                    id="linkDaftarHadir"
                    value={formData.linkDaftarHadir || ''}
                    onChange={(e) => setFormData({ ...formData, linkDaftarHadir: e.target.value })}
                    placeholder="https://forms.google.com/..."
                  />
                  {formData.linkDaftarHadir && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenLink(formData.linkDaftarHadir!)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="p-3 bg-muted rounded-md flex-1">
                    {item?.linkDaftarHadir || '-'}
                  </div>
                  {item?.linkDaftarHadir && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenLink(item.linkDaftarHadir!)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Upload Bukti Hadir */}
            <FileUpload
              label="Upload Bukti Hadir (Maksimal 2 gambar)"
              accept="image/*"
              multiple={true}
              maxSize={5 * 1024 * 1024} // 5MB
              maxFiles={2}
              files={buktiHadirFiles}
              existingFiles={existingBuktiHadir}
              mode={canEdit ? 'edit' : 'view'}
              disabled={!canEdit}
              onFilesChange={handleBuktiHadirFilesChange}
              onExistingFileRemove={handleExistingBuktiHadirRemove}
              description="Format gambar: JPG, PNG, GIF (Max 5MB per file)"
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