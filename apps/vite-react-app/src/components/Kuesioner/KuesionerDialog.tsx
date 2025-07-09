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
import { Kuesioner } from '@/mocks/kuesioner';
import { PeridagData } from '@/mocks/perwadag';

interface KuesionerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Kuesioner | null;
  mode: 'view' | 'edit';
  onSave: (data: Partial<Kuesioner>) => void;
  availablePerwadag: PeridagData[];
}

const KuesionerDialog: React.FC<KuesionerDialogProps> = ({
  open,
  onOpenChange,
  item,
  mode,
  onSave,
  availablePerwadag,
}) => {
  const [formData, setFormData] = useState<Partial<Kuesioner>>({});
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

  const handleOpenLink = () => {
    if (formData.linkDokumen) {
      window.open(formData.linkDokumen, '_blank');
    }
  };


  const isEditable = mode === 'edit';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle>
            {mode === 'view' ? 'Lihat Kuesioner' : 'Edit Kuesioner'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="tanggal">Tanggal Kuesioner</Label>
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
              <Label htmlFor="aspek">Aspek</Label>
              <Input
                id="aspek"
                value={formData.aspek || ''}
                onChange={(e) => setFormData({ ...formData, aspek: e.target.value })}
                disabled={!isEditable}
                className={!isEditable ? "bg-muted" : ""}
                placeholder="Masukkan aspek"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkDokumen">Link Dokumen</Label>
              <div className="flex gap-2">
                <Input
                  id="linkDokumen"
                  value={formData.linkDokumen || ''}
                  onChange={(e) => setFormData({ ...formData, linkDokumen: e.target.value })}
                  disabled={!isEditable}
                  className={!isEditable ? "bg-muted" : ""}
                  placeholder="https://drive.google.com/file/..."
                />
                {formData.linkDokumen && mode === 'view' && (
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

            {mode === 'view' && (
              <div className="space-y-2">
                <Label>Informasi Kuesioner</Label>
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  Klik tombol "Buka Link" di bawah untuk melihat dokumen kuesioner.
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button variant="outline" onClick={handleCancel}>
            {mode === 'view' ? 'Tutup' : 'Batal'}
          </Button>
          {mode === 'view' && formData.linkDokumen && (
            <Button onClick={handleOpenLink}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Buka Link
            </Button>
          )}
          {mode === 'edit' && (
            <Button onClick={handleSave}>
              Simpan
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KuesionerDialog;