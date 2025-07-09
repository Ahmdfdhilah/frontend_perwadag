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
import { CalendarIcon, Upload, Download, File } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { SuratTugas } from '@/mocks/suratTugas';
import { Perwadag } from '@/mocks/perwadag';

interface SuratTugasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: SuratTugas | null;
  onSave: (data: Partial<SuratTugas>) => void;
  availablePerwadag: Perwadag[];
}

const SuratTugasDialog: React.FC<SuratTugasDialogProps> = ({
  open,
  onOpenChange,
  editingItem,
  onSave,
  availablePerwadag,
}) => {
  const [formData, setFormData] = useState({
    nomor: '',
    perwadagId: '',
    tanggal: undefined as Date | undefined,
    pengendaliMutu: '',
    pengendaliTeknis: '',
    ketuaTim: '',
    fileName: '',
    fileUrl: '',
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        nomor: editingItem.nomor,
        perwadagId: editingItem.perwadagId,
        tanggal: new Date(editingItem.tanggal),
        pengendaliMutu: editingItem.pengendaliMutu,
        pengendaliTeknis: editingItem.pengendaliTeknis,
        ketuaTim: editingItem.ketuaTim,
        fileName: editingItem.fileName || '',
        fileUrl: editingItem.fileUrl || '',
      });
    } else {
      setFormData({
        nomor: '',
        perwadagId: '',
        tanggal: undefined,
        pengendaliMutu: '',
        pengendaliTeknis: '',
        ketuaTim: '',
        fileName: '',
        fileUrl: '',
      });
    }
  }, [editingItem, open]);

  const handleSave = () => {
    if (!formData.nomor || !formData.perwadagId || !formData.tanggal) {
      return;
    }

    const selectedPerwadag = availablePerwadag.find(p => p.id === formData.perwadagId);
    
    const saveData: Partial<SuratTugas> = {
      ...formData,
      tanggal: formData.tanggal.toISOString().split('T')[0],
      perwadagName: selectedPerwadag?.name || '',
      year: formData.tanggal.getFullYear(),
      inspektorat: selectedPerwadag?.inspektorat || 1,
    };

    if (editingItem) {
      saveData.id = editingItem.id;
    }

    onSave(saveData);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleFileUpload = (file: File) => {
    const fileUrl = URL.createObjectURL(file);
    const fileName = file.name;
    setFormData({
      ...formData,
      fileName,
      fileUrl,
    });
  };

  const handleDownloadFile = () => {
    if (formData.fileUrl && formData.fileName) {
      const link = document.createElement('a');
      link.href = formData.fileUrl;
      link.download = formData.fileName;
      link.click();
    }
  };

  const isFormValid = formData.nomor && formData.perwadagId && formData.tanggal &&
                      formData.pengendaliMutu && formData.pengendaliTeknis && formData.ketuaTim;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle>
            {editingItem ? 'Edit Surat Tugas' : 'Tambah Surat Tugas'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nomor">Nomor Surat Tugas *</Label>
              <Input
                id="nomor"
                value={formData.nomor}
                onChange={(e) => setFormData(prev => ({ ...prev, nomor: e.target.value }))}
                placeholder="Contoh: ST/001/I/2024"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="perwadag">Perwadag *</Label>
              <Select
                value={formData.perwadagId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, perwadagId: value }))}
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
            </div>

            <div className="space-y-2">
              <Label>Tanggal *</Label>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="pengendaliMutu">Nama Pengendali Mutu *</Label>
              <Input
                id="pengendaliMutu"
                value={formData.pengendaliMutu}
                onChange={(e) => setFormData(prev => ({ ...prev, pengendaliMutu: e.target.value }))}
                placeholder="Contoh: Dr. Ahmad Sutanto"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pengendaliTeknis">Nama Pengendali Teknis *</Label>
              <Input
                id="pengendaliTeknis"
                value={formData.pengendaliTeknis}
                onChange={(e) => setFormData(prev => ({ ...prev, pengendaliTeknis: e.target.value }))}
                placeholder="Contoh: Ir. Budi Setiawan"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ketuaTim">Nama Ketua Tim *</Label>
              <Input
                id="ketuaTim"
                value={formData.ketuaTim}
                onChange={(e) => setFormData(prev => ({ ...prev, ketuaTim: e.target.value }))}
                placeholder="Contoh: Drs. Chandra Kusuma"
              />
            </div>

            <div className="space-y-2">
              <Label>Informasi Upload Surat Tugas</Label>
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                Silakan upload file surat tugas. File yang didukung: PDF, DOC, DOCX.
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileUpload">File Surat Tugas</Label>
              <div className="flex gap-2">
                <input
                  type="file"
                  id="fileUpload"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(file);
                    }
                  }}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('fileUpload')?.click()}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {formData.fileName ? 'Ubah File' : 'Upload File'}
                </Button>
                {formData.fileName && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDownloadFile}
                    title="Download File"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {formData.fileName && (
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <File className="w-3 h-3" />
                  File: {formData.fileName}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Batal
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid}>
            {editingItem ? 'Simpan' : 'Buat'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuratTugasDialog;