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
import { CalendarIcon, ExternalLink, Upload, Eye, Download } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@workspace/ui/lib/utils';
import { KonfirmasiMeeting } from '@/mocks/konfirmasiMeeting';
import { Perwadag } from '@/mocks/perwadag';
import { Badge } from '@workspace/ui/components/badge';

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
  const { isAdmin, isInspektorat, isPerwadag } = useRole();
  const [formData, setFormData] = useState<Partial<KonfirmasiMeeting>>({});
  const [selectedKonfirmasiDate, setSelectedKonfirmasiDate] = useState<Date>();
  const [selectedEvaluasiStartDate, setSelectedEvaluasiStartDate] = useState<Date>();
  const [selectedEvaluasiEndDate, setSelectedEvaluasiEndDate] = useState<Date>();
  const [isKonfirmasiDatePickerOpen, setIsKonfirmasiDatePickerOpen] = useState(false);
  const [isEvaluasiStartDatePickerOpen, setIsEvaluasiStartDatePickerOpen] = useState(false);
  const [isEvaluasiEndDatePickerOpen, setIsEvaluasiEndDatePickerOpen] = useState(false);

  useEffect(() => {
    if (item && open) {
      setFormData({
        ...item,
      });
      setSelectedKonfirmasiDate(new Date(item.tanggalKonfirmasi));
      setSelectedEvaluasiStartDate(new Date(item.tanggalMulaiEvaluasi));
      setSelectedEvaluasiEndDate(new Date(item.tanggalAkhirEvaluasi));
    } else {
      setFormData({});
      setSelectedKonfirmasiDate(undefined);
      setSelectedEvaluasiStartDate(undefined);
      setSelectedEvaluasiEndDate(undefined);
    }
  }, [item, open]);

  const handleSave = () => {
    // Role-based validation
    if (isPerwadag()) {
      // Perwadag can only upload documents
      if (!formData.daftarHadir && (!formData.buktiImages || formData.buktiImages.length === 0)) {
        alert('Minimal harus upload daftar hadir atau bukti');
        return;
      }
    } else if (isAdmin() || isInspektorat()) {
      // Admin/Inspektorat can edit all fields
      if (!formData.perwadagId) {
        alert('Nama perwadag harus dipilih');
        return;
      }
      if (!selectedKonfirmasiDate) {
        alert('Tanggal konfirmasi harus diisi');
        return;
      }
    }

    const dataToSave = {
      ...formData,
      tanggalKonfirmasi: selectedKonfirmasiDate ? selectedKonfirmasiDate.toISOString().split('T')[0] : formData.tanggalKonfirmasi,
      tanggalMulaiEvaluasi: selectedEvaluasiStartDate ? selectedEvaluasiStartDate.toISOString().split('T')[0] : formData.tanggalMulaiEvaluasi,
      tanggalAkhirEvaluasi: selectedEvaluasiEndDate ? selectedEvaluasiEndDate.toISOString().split('T')[0] : formData.tanggalAkhirEvaluasi,
    };
    onSave(dataToSave);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleOpenLink = () => {
    if (formData.linkZoom) {
      window.open(formData.linkZoom, '_blank');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'daftarHadir' | 'buktiImages') => {
    const files = event.target.files;
    if (files && files.length > 0) {
      if (type === 'daftarHadir') {
        const file = files[0];
        setFormData({
          ...formData,
          daftarHadir: file.name,
          daftarHadirUrl: URL.createObjectURL(file),
        });
      } else {
        const fileArray = Array.from(files);
        const fileNames = fileArray.map(file => file.name);
        const fileUrls = fileArray.map(file => URL.createObjectURL(file));
        setFormData({
          ...formData,
          buktiImages: fileNames,
          buktiImageUrls: fileUrls,
        });
      }
    }
  };

  const getStatusBadge = (status: string, hasDocuments: boolean) => {
    if (status === 'completed' && hasDocuments) {
      return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Selesai</Badge>;
    } else if (status === 'confirmed') {
      return <Badge variant="secondary">Dikonfirmasi</Badge>;
    } else {
      return <Badge variant="outline">Pending</Badge>;
    }
  };

  const isEditable = mode === 'edit';
  const hasDocuments = !!(formData.daftarHadir || (formData.buktiImages && formData.buktiImages.length > 0));

  // Role-based field permissions
  const canEditAdmin = isEditable && (isAdmin() || isInspektorat());
  const canUploadDocs = isEditable && isPerwadag();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle>
            {mode === 'view' ? 'Lihat Konfirmasi Meeting' : 'Edit Konfirmasi Meeting'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="perwadag">Nama Perwadag</Label>
                {canEditAdmin ? (
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
                <Label htmlFor="tanggalKonfirmasi">Tanggal Konfirmasi</Label>
                <Popover open={isKonfirmasiDatePickerOpen} onOpenChange={setIsKonfirmasiDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedKonfirmasiDate && "text-muted-foreground",
                        !canEditAdmin && "bg-muted cursor-not-allowed"
                      )}
                      disabled={!canEditAdmin}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedKonfirmasiDate ? (
                        format(selectedKonfirmasiDate, "dd MMMM yyyy", { locale: id })
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  {canEditAdmin && (
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
                  )}
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkZoom">Link Zoom</Label>
                <div className="flex gap-2">
                  <Input
                    id="linkZoom"
                    value={formData.linkZoom || ''}
                    onChange={(e) => setFormData({ ...formData, linkZoom: e.target.value })}
                    disabled={!canEditAdmin}
                    className={!canEditAdmin ? "bg-muted" : ""}
                    placeholder="https://zoom.us/j/..."
                  />
                  {formData.linkZoom && mode === 'view' && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleOpenLink}
                      title="Join Meeting"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <div className="flex items-center gap-2">
                  {canEditAdmin ? (
                    <Select
                      value={formData.status || ''}
                      onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Dikonfirmasi</SelectItem>
                        <SelectItem value="completed">Selesai</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div>
                      {getStatusBadge(formData.status || 'pending', hasDocuments)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Periode Evaluasi</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Tanggal Mulai</Label>
                    <Popover open={isEvaluasiStartDatePickerOpen} onOpenChange={setIsEvaluasiStartDatePickerOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedEvaluasiStartDate && "text-muted-foreground",
                            !canEditAdmin && "bg-muted cursor-not-allowed"
                          )}
                          disabled={!canEditAdmin}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedEvaluasiStartDate ? (
                            format(selectedEvaluasiStartDate, "dd/MM/yyyy", { locale: id })
                          ) : (
                            <span>Pilih</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      {canEditAdmin && (
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedEvaluasiStartDate}
                            onSelect={(date) => {
                              setSelectedEvaluasiStartDate(date);
                              setIsEvaluasiStartDatePickerOpen(false);
                            }}
                            initialFocus
                            locale={id}
                          />
                        </PopoverContent>
                      )}
                    </Popover>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Tanggal Akhir</Label>
                    <Popover open={isEvaluasiEndDatePickerOpen} onOpenChange={setIsEvaluasiEndDatePickerOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedEvaluasiEndDate && "text-muted-foreground",
                            !canEditAdmin && "bg-muted cursor-not-allowed"
                          )}
                          disabled={!canEditAdmin}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedEvaluasiEndDate ? (
                            format(selectedEvaluasiEndDate, "dd/MM/yyyy", { locale: id })
                          ) : (
                            <span>Pilih</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      {canEditAdmin && (
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedEvaluasiEndDate}
                            onSelect={(date) => {
                              setSelectedEvaluasiEndDate(date);
                              setIsEvaluasiEndDatePickerOpen(false);
                            }}
                            initialFocus
                            locale={id}
                          />
                        </PopoverContent>
                      )}
                    </Popover>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Daftar Hadir</Label>
                <div className="space-y-2">
                  {canUploadDocs && (
                    <div>
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileUpload(e, 'daftarHadir')}
                        className="hidden"
                        id="daftarHadirUpload"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('daftarHadirUpload')?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Daftar Hadir
                      </Button>
                    </div>
                  )}
                  {formData.daftarHadir && (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <span className="text-sm">{formData.daftarHadir}</span>
                      {formData.daftarHadirUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(formData.daftarHadirUrl, '_blank')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Bukti Foto</Label>
                <div className="space-y-2">
                  {canUploadDocs && (
                    <div>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileUpload(e, 'buktiImages')}
                        className="hidden"
                        id="buktiImagesUpload"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('buktiImagesUpload')?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Bukti Foto
                      </Button>
                    </div>
                  )}
                  {formData.buktiImages && formData.buktiImages.length > 0 && (
                    <div className="space-y-1">
                      {formData.buktiImages.map((image, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                          <span className="text-sm">{image}</span>
                          {formData.buktiImageUrls && formData.buktiImageUrls[index] && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(formData.buktiImageUrls![index], '_blank')}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button variant="outline" onClick={handleCancel}>
            {mode === 'view' ? 'Tutup' : 'Batal'}
          </Button>
          {mode === 'view' && formData.linkZoom && (
            <Button onClick={handleOpenLink}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Join Meeting
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

export default KonfirmasiMeetingDialog;