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
import { Textarea } from '@workspace/ui/components/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
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
import { EntryMeeting } from '@/mocks/entryMeeting';
import { useRole } from '@/hooks/useRole';
import { Perwadag } from '@/mocks/perwadag';

interface EntryMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: EntryMeeting | null;
  mode: 'view' | 'edit';
  onSave: (data: Partial<EntryMeeting>) => void;
  availablePerwadag: Perwadag[];
}

const EntryMeetingDialog: React.FC<EntryMeetingDialogProps> = ({
  open,
  onOpenChange,
  item,
  mode,
  onSave,
  availablePerwadag,
}) => {
  const { isAdmin, isInspektorat } = useRole();
  const [formData, setFormData] = useState<Partial<EntryMeeting>>({});
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    if (item && open) {
      setFormData({
        ...item,
      });
      setSelectedDate(new Date(item.tanggal));
    } else {
      setFormData({});
      setSelectedDate(undefined);
    }
  }, [item, open]);

  const handleSave = () => {
    if (selectedDate) {
      const dataToSave = {
        ...formData,
        tanggal: selectedDate.toISOString().split('T')[0],
      };
      onSave(dataToSave);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleOpenLink = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const isEditable = mode === 'edit';
  const canEditAdminFields = isAdmin() && isEditable;
  const canEditInspektoratFields = isInspektorat() && isEditable;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle>
            {mode === 'view' ? 'Lihat Entry Meeting' : 'Edit Entry Meeting'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="tanggal">Tanggal Evaluasi</Label>
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground",
                      !isEditable && "bg-muted cursor-not-allowed"
                    )}
                    disabled={!isEditable}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "dd MMMM yyyy", { locale: id })
                    ) : (
                      <span>Pilih tanggal</span>
                    )}
                  </Button>
                </PopoverTrigger>
                {isEditable && (
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setIsDatePickerOpen(false);
                      }}
                      initialFocus
                      locale={id}
                    />
                  </PopoverContent>
                )}
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="perwadag">Nama Perwadag</Label>
              {isEditable ? (
                <Select
                  value={formData.perwadagId || ''}
                  onValueChange={(value) => {
                    const selected = availablePerwadag.find(p => p.id === value);
                    setFormData({
                      ...formData,
                      perwadagId: value,
                      perwadagName: selected?.name || '',
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih perwadag" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePerwadag.map((perwadag) => (
                      <SelectItem key={perwadag.id} value={perwadag.id}>
                        {perwadag.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={formData.perwadagName || ''}
                  disabled
                  className="bg-muted"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rincian">Rincian</Label>
              <Textarea
                id="rincian"
                value={formData.rincian || ''}
                onChange={(e) => setFormData({ ...formData, rincian: e.target.value })}
                disabled={!isEditable}
                className={!isEditable ? "bg-muted" : ""}
                rows={3}
              />
            </div>

            {/* Admin fields */}
            <div className="space-y-2">
              <Label htmlFor="linkZoom">Link Zoom</Label>
              <div className="flex gap-2">
                <Input
                  id="linkZoom"
                  value={formData.linkZoom || ''}
                  onChange={(e) => setFormData({ ...formData, linkZoom: e.target.value })}
                  disabled={!canEditAdminFields}
                  className={!canEditAdminFields ? "bg-muted" : ""}
                  placeholder="https://zoom.us/j/..."
                />
                {formData.linkZoom && mode === 'view' && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleOpenLink(formData.linkZoom!)}
                    title="Buka Link Zoom"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Inspektorat fields */}
            <div className="space-y-2">
              <Label htmlFor="daftarHadir">Daftar Hadir</Label>
              <div className="flex gap-2">
                <Input
                  id="daftarHadir"
                  value={formData.daftarHadir || ''}
                  onChange={(e) => setFormData({ ...formData, daftarHadir: e.target.value })}
                  disabled={!canEditInspektoratFields}
                  className={!canEditInspektoratFields ? "bg-muted" : ""}
                  placeholder="https://drive.google.com/file/..."
                />
                {formData.daftarHadir && mode === 'view' && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleOpenLink(formData.daftarHadir!)}
                    title="Buka Daftar Hadir"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buktiHadir">Bukti Hadir</Label>
              <div className="flex gap-2">
                <Input
                  id="buktiHadir"
                  value={formData.buktiHadir || ''}
                  onChange={(e) => setFormData({ ...formData, buktiHadir: e.target.value })}
                  disabled={!canEditInspektoratFields}
                  className={!canEditInspektoratFields ? "bg-muted" : ""}
                  placeholder="https://drive.google.com/file/..."
                />
                {formData.buktiHadir && mode === 'view' && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleOpenLink(formData.buktiHadir!)}
                    title="Buka Bukti Hadir"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <div className="flex flex-wrap gap-2 justify-between w-full">
            <div className="flex gap-2">
              {mode === 'view' && formData.linkZoom && (
                <Button
                  variant="outline"
                  onClick={() => handleOpenLink(formData.linkZoom!)}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Buka Zoom
                </Button>
              )}
              {mode === 'view' && formData.daftarHadir && (
                <Button
                  variant="outline"
                  onClick={() => handleOpenLink(formData.daftarHadir!)}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Daftar Hadir
                </Button>
              )}
              {mode === 'view' && formData.buktiHadir && (
                <Button
                  variant="outline"
                  onClick={() => handleOpenLink(formData.buktiHadir!)}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Bukti Hadir
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                {mode === 'view' ? 'Tutup' : 'Batal'}
              </Button>
              {mode === 'edit' && (
                <Button onClick={handleSave}>
                  Simpan
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EntryMeetingDialog;