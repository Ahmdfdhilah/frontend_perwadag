import React, { useState, useEffect } from 'react';
import { useRole } from '@/hooks/useRole';
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
import { CalendarIcon, Upload, X, Download } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@workspace/ui/lib/utils';
import { Kuesioner } from '@/mocks/kuesioner';
import { Perwadag } from '@/mocks/perwadag';

interface KuesionerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Kuesioner | null;
  mode: 'view' | 'edit';
  onSave: (data: Partial<Kuesioner>) => void;
  availablePerwadag: Perwadag[];
}

const KuesionerDialog: React.FC<KuesionerDialogProps> = ({
  open,
  onOpenChange,
  item,
  mode,
  onSave,
  availablePerwadag,
}) => {
  const { isAdmin, isInspektorat, isPerwadag } = useRole();
  const [formData, setFormData] = useState<Partial<Kuesioner>>({});
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dokumenFile, setDokumenFile] = useState<File | null>(null);
  const dokumenRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (item && open) {
      setFormData({
        ...item,
      });
      setSelectedDate(new Date(item.tanggal));
      setDokumenFile(null);
    } else {
      setFormData({});
      setSelectedDate(undefined);
      setDokumenFile(null);
    }
  }, [item, open]);

  const handleSave = () => {
    // Basic validation for all roles
    if (!selectedDate) {
      alert('Tanggal harus diisi');
      return;
    }

    // Role-based validation
    if (isPerwadag()) {
      // Perwadag can edit tanggal and dokumen for their own data
      if (!dokumenFile && !formData.dokumen) {
        alert('Dokumen harus diupload');
        return;
      }
    } else if (isAdmin() || isInspektorat()) {
      // Admin/Inspektorat can edit all fields including dokumen
      if (!formData.perwadagId) {
        alert('Nama perwadag harus dipilih');
        return;
      }
    }

    const dataToSave = {
      ...formData,
      tanggal: selectedDate.toISOString().split('T')[0],
      dokumenFile,
    };
    onSave(dataToSave);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleDokumenFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDokumenFile(file);
    }
  };

  const removeDokumenFile = () => {
    setDokumenFile(null);
    if (dokumenRef.current) {
      dokumenRef.current.value = '';
    }
  };

  const handleDownloadDokumen = () => {
    if (formData.dokumen) {
      console.log('Download dokumen:', formData.dokumen);
      // Implement download logic here
    }
  };


  const isEditable = mode === 'edit';

  // Role-based field permissions
  const canEditDate = isEditable && (isAdmin() || isInspektorat() || isPerwadag());
  const canEditPerwadag = isEditable && (isAdmin() || isInspektorat());
  const canEditDokumen = isEditable && (isAdmin() || isInspektorat() || isPerwadag());

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
                      !canEditDate && "bg-muted cursor-not-allowed"
                    )}
                    disabled={!canEditDate}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "dd MMMM yyyy", { locale: id })
                    ) : (
                      <span>Pilih tanggal</span>
                    )}
                  </Button>
                </PopoverTrigger>
                {canEditDate && (
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
              {canEditPerwadag ? (
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
              <Label>Upload Dokumen Kuesioner</Label>
              {canEditDokumen ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => dokumenRef.current?.click()}
                      className="w-full justify-start"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {dokumenFile ? dokumenFile.name : 'Pilih file dokumen kuesioner'}
                    </Button>
                    {dokumenFile && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeDokumenFile}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <input
                    ref={dokumenRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleDokumenFileChange}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground">
                    Format yang didukung: PDF, DOC, DOCX (Max 10MB)
                  </p>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="p-3 bg-muted rounded-md flex-1">
                    {item?.dokumen ? `File: ${item.dokumen}` : 'Belum ada file dokumen'}
                  </div>
                  {item?.dokumen && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadDokumen}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button variant="outline" onClick={handleCancel}>
            {mode === 'view' ? 'Tutup' : 'Batal'}
          </Button>
          {mode === 'view' && formData.dokumen && (
            <Button onClick={handleDownloadDokumen}>
              <Download className="w-4 h-4 mr-2" />
              Download Dokumen
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