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
import { SuratPemberitahuan } from '@/mocks/suratPemberitahuan';

interface SuratPemberitahuanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: SuratPemberitahuan | null;
  onSave?: (data: Partial<SuratPemberitahuan>) => void;
  mode: 'view' | 'edit';
}

const SuratPemberitahuanDialog: React.FC<SuratPemberitahuanDialogProps> = ({
  open,
  onOpenChange,
  item,
  onSave,
  mode,
}) => {
  const [formData, setFormData] = useState({
    tanggal: undefined as Date | undefined,
    linkDrive: '',
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        tanggal: new Date(item.tanggal),
        linkDrive: item.linkDrive,
      });
    } else {
      setFormData({
        tanggal: undefined,
        linkDrive: '',
      });
    }
  }, [item, open]);

  const handleSave = () => {
    if (!formData.tanggal || !item) {
      return;
    }

    const saveData: Partial<SuratPemberitahuan> = {
      id: item.id,
      tanggal: formData.tanggal.toISOString().split('T')[0],
      linkDrive: formData.linkDrive,
      year: formData.tanggal.getFullYear(),
    };

    onSave?.(saveData);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleOpenLink = () => {
    if (item?.linkDrive) {
      window.open(item.linkDrive, '_blank');
    }
  };

  const isFormValid = formData.tanggal && formData.linkDrive;
  const isEditing = mode === 'edit';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle>
            {isEditing ? 'Edit Surat Pemberitahuan' : 'Lihat Surat Pemberitahuan'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Nama Perwadag</Label>
              <Input
                value={item?.perwadagName || ''}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label>Tanggal {isEditing && '*'}</Label>
              {isEditing ? (
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.tanggal ? (
                        format(formData.tanggal, 'dd MMMM yyyy', { locale: id })
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.tanggal}
                      onSelect={(date) => {
                        setFormData(prev => ({ ...prev, tanggal: date }));
                        setIsCalendarOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                <Input
                  value={item ? format(new Date(item.tanggal), 'dd MMMM yyyy', { locale: id }) : ''}
                  disabled
                  className="bg-muted"
                />
              )}
            </div>

            {!isEditing && (
              <div className="space-y-2">
                <Label>Informasi Surat Pemberitahuan</Label>
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  Klik tombol "Buka Link" di bawah untuk melihat surat pemberitahuan.
                </div>
              </div>
            )}

            {isEditing && (
              <div className="space-y-2">
                <Label>Informasi Upload Surat Pemberitahuan</Label>
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  Silakan upload surat pemberitahuan ke Google Drive dan copy link share-nya di bawah ini.
                  Pastikan link dapat diakses oleh tim audit.
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="linkDrive">Link Drive Surat Pemberitahuan {isEditing && '*'}</Label>
              <div className="flex gap-2">
                <Input
                  id="linkDrive"
                  value={formData.linkDrive}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkDrive: e.target.value }))}
                  placeholder="https://drive.google.com/file/d/..."
                  type="url"
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                />
                {!isEditing && item?.linkDrive && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleOpenLink}
                    title="Buka Link"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button variant="outline" onClick={handleCancel}>
            {isEditing ? 'Batal' : 'Tutup'}
          </Button>
          {isEditing && (
            <Button onClick={handleSave} disabled={!isFormValid}>
              Simpan
            </Button>
          )}
          {!isEditing && item?.linkDrive && (
            <Button onClick={handleOpenLink}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Buka Link
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuratPemberitahuanDialog;