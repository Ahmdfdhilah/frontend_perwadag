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
import { KonfirmasiMeeting } from '@/mocks/konfirmasiMeeting';
import { Perwadag } from '@/mocks/perwadag';
import { useRole } from '@/hooks/useRole';
import { formatIndonesianDateRange } from '@/utils/timeFormat';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import FileUpload from '@/components/common/FileUpload';

interface KonfirmasiMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: KonfirmasiMeeting | null;
  mode: 'view' | 'edit';
  onSave: (data: Partial<KonfirmasiMeeting>) => void;
  availablePerwadag: Perwadag[];
}

const KonfirmasiMeetingDialog: React.FC<KonfirmasiMeetingDialogProps> = ({
  open,
  onOpenChange,
  item,
  mode,
  onSave,
  availablePerwadag,
}) => {
  const { isAdmin, isInspektorat } = useRole();
  const [formData, setFormData] = useState<Partial<KonfirmasiMeeting>>({});
  const [selectedKonfirmasiDate, setSelectedKonfirmasiDate] = useState<Date>();
  const [isKonfirmasiDatePickerOpen, setIsKonfirmasiDatePickerOpen] = useState(false);
  const [daftarHadirFiles, setDaftarHadirFiles] = useState<File[]>([]);
  const [buktiHadirFiles, setBuktiHadirFiles] = useState<File[]>([]);

  useEffect(() => {
    if (item && open) {
      setFormData({ ...item });
      setSelectedKonfirmasiDate(new Date(item.tanggalKonfirmasi));
    } else {
      setFormData({});
      setSelectedKonfirmasiDate(undefined);
      setDaftarHadirFiles([]);
      setBuktiHadirFiles([]);
    }
  }, [item, open]);

  const handleSave = () => {
    const dataToSave = {
      ...formData,
      tanggalKonfirmasi: selectedKonfirmasiDate ? selectedKonfirmasiDate.toISOString().split('T')[0] : formData.tanggalKonfirmasi,
      daftarHadirFiles,
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

  const handleDaftarHadirFilesChange = (files: File[]) => {
    setDaftarHadirFiles(files);
  };

  const handleBuktiHadirFilesChange = (files: File[]) => {
    setBuktiHadirFiles(files);
  };



  const isEditable = mode === 'edit';
  const canEdit = (isAdmin() || isInspektorat()) && isEditable;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle>
            {mode === 'view' ? 'Lihat Konfirmasi Meeting' : 'Edit Konfirmasi Meeting'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-6">
            {/* Info Basic - Read Only */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Nama Perwadag</Label>
                {canEdit ? (
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
                  <div className="p-3 bg-muted rounded-md">
                    {item?.perwadagName}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tanggal Konfirmasi</Label>
              {canEdit ? (
                <Popover open={isKonfirmasiDatePickerOpen} onOpenChange={setIsKonfirmasiDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedKonfirmasiDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedKonfirmasiDate ? (
                        format(selectedKonfirmasiDate, "dd MMMM yyyy", { locale: id })
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedKonfirmasiDate}
                      onSelect={(date) => {
                        setSelectedKonfirmasiDate(date);
                        setIsKonfirmasiDatePickerOpen(false);
                      }}
                      initialFocus
                      locale={id}
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                <div className="p-3 bg-muted rounded-md">
                  {item ? format(new Date(item.tanggalKonfirmasi), "dd MMMM yyyy", { locale: id }) : '-'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Periode Evaluasi</Label>
              <div className="p-3 bg-muted rounded-md">
                {item ? formatIndonesianDateRange(item.tanggalMulaiEvaluasi, item.tanggalAkhirEvaluasi) : '-'}
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

            {/* Upload Daftar Hadir */}
            <FileUpload
              label="Upload Daftar Hadir"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              maxSize={5 * 1024 * 1024}
              multiple={false}
              mode={canEdit ? 'edit' : 'view'}
              files={daftarHadirFiles}
              existingFiles={item?.linkDaftarHadir ? [{ name: 'Daftar Hadir', url: item.linkDaftarHadir }] : []}
              onFilesChange={handleDaftarHadirFilesChange}
              description="Format yang didukung: PDF, DOC, DOCX, JPG, PNG (Max 5MB)"
            />

            {/* Upload Bukti Foto */}
            <FileUpload
              label="Upload Bukti Foto (Maksimal 2 gambar)"
              accept="image/*"
              maxSize={5 * 1024 * 1024}
              multiple={true}
              maxFiles={2}
              mode={canEdit ? 'edit' : 'view'}
              files={buktiHadirFiles}
              existingFiles={item?.buktiImageUrls ? item.buktiImageUrls.map((url, index) => ({ name: `Bukti ${index + 1}`, url })) : []}
              onFilesChange={handleBuktiHadirFilesChange}
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

export default KonfirmasiMeetingDialog;