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
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { SuratTugas } from '@/mocks/suratTugas';
import { Perwadag } from '@/mocks/perwadag';
import { useFormPermissions } from '@/hooks/useFormPermissions';
import FileUpload from '@/components/common/FileUpload';

interface SuratTugasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: SuratTugas | null;
  mode?: 'view' | 'edit' | 'create';
  onSave: (data: Partial<SuratTugas>) => void;
  availablePerwadag: Perwadag[];
}

const SuratTugasDialog: React.FC<SuratTugasDialogProps> = ({
  open,
  onOpenChange,
  editingItem,
  mode = editingItem ? 'edit' : 'create',
  onSave,
  availablePerwadag,
}) => {
  const { canEditForm } = useFormPermissions();
  const [formData, setFormData] = useState({
    nomor: '',
    perwadagId: '',
    tanggalPelaksanaanEvaluasi: undefined as Date | undefined,
    tanggalSelesaiEvaluasi: undefined as Date | undefined,
    pengendaliMutu: '',
    pengendaliTeknis: '',
    ketuaTim: '',
    fileName: '',
    fileUrl: '',
  });

  const [isStartCalendarOpen, setIsStartCalendarOpen] = useState(false);
  const [isEndCalendarOpen, setIsEndCalendarOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<Array<{ name: string; url?: string }>>([]);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        nomor: editingItem.nomor,
        perwadagId: editingItem.perwadagId,
        tanggalPelaksanaanEvaluasi: new Date(editingItem.tanggalPelaksanaanEvaluasi),
        tanggalSelesaiEvaluasi: editingItem.tanggalSelesaiEvaluasi ? new Date(editingItem.tanggalSelesaiEvaluasi) : undefined,
        pengendaliMutu: editingItem.pengendaliMutu,
        pengendaliTeknis: editingItem.pengendaliTeknis,
        ketuaTim: editingItem.ketuaTim,
        fileName: editingItem.fileName || '',
        fileUrl: editingItem.fileUrl || '',
      });
      
      // Set existing files for display
      setExistingFiles(editingItem.fileName ? [{ name: editingItem.fileName, url: editingItem.fileUrl }] : []);
    } else {
      setFormData({
        nomor: '',
        perwadagId: '',
        tanggalPelaksanaanEvaluasi: undefined,
        tanggalSelesaiEvaluasi: undefined,
        pengendaliMutu: '',
        pengendaliTeknis: '',
        ketuaTim: '',
        fileName: '',
        fileUrl: '',
      });
      setUploadFiles([]);
      setExistingFiles([]);
    }
  }, [editingItem, open]);

  const handleSave = () => {
    if (!formData.nomor || !formData.perwadagId || !formData.tanggalPelaksanaanEvaluasi) {
      return;
    }

    const selectedPerwadag = availablePerwadag.find(p => p.id === formData.perwadagId);

    const saveData: Partial<SuratTugas> = {
      ...formData,
      tanggalPelaksanaanEvaluasi: formData.tanggalPelaksanaanEvaluasi.toISOString().split('T')[0],
      tanggalSelesaiEvaluasi: formData.tanggalSelesaiEvaluasi?.toISOString().split('T')[0],
      perwadagName: selectedPerwadag?.name || '',
      year: formData.tanggalPelaksanaanEvaluasi.getFullYear(),
      inspektorat: selectedPerwadag?.inspektorat || 1,
      uploadFiles,
    };

    if (editingItem) {
      saveData.id = editingItem.id;
    }

    onSave(saveData);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleUploadFilesChange = (files: File[]) => {
    setUploadFiles(files);
  };

  const handleExistingFileRemove = (index: number) => {
    setExistingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const isFormValid = formData.nomor && formData.perwadagId && formData.tanggalPelaksanaanEvaluasi &&
    formData.pengendaliMutu && formData.pengendaliTeknis && formData.ketuaTim;
  const isEditable = mode !== 'view';
  const canEdit = canEditForm('surat_tugas') && isEditable;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] flex flex-col">
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
                disabled={!canEdit}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="perwadag">Perwadag *</Label>
              <Select
                value={formData.perwadagId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, perwadagId: value }))}
                disabled={!canEdit}
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

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Tanggal Mulai Evaluasi *</Label>
                <Popover open={isStartCalendarOpen} onOpenChange={setIsStartCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={!canEdit}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.tanggalPelaksanaanEvaluasi ? (
                        format(formData.tanggalPelaksanaanEvaluasi, 'dd MMM yyyy', { locale: id })
                      ) : (
                        <span>Pilih tanggal mulai</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.tanggalPelaksanaanEvaluasi}
                      onSelect={(date) => {
                        setFormData(prev => ({ ...prev, tanggalPelaksanaanEvaluasi: date }));
                        setIsStartCalendarOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Tanggal Selesai Evaluasi</Label>
                <Popover open={isEndCalendarOpen} onOpenChange={setIsEndCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={!canEdit}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.tanggalSelesaiEvaluasi ? (
                        format(formData.tanggalSelesaiEvaluasi, 'dd MMM yyyy', { locale: id })
                      ) : (
                        <span>Pilih tanggal selesai</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.tanggalSelesaiEvaluasi}
                      onSelect={(date) => {
                        setFormData(prev => ({ ...prev, tanggalSelesaiEvaluasi: date }));
                        setIsEndCalendarOpen(false);
                      }}
                      disabled={(date) => {
                        if (!formData.tanggalPelaksanaanEvaluasi) return false;
                        return date < formData.tanggalPelaksanaanEvaluasi;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pengendaliMutu">Nama Pengendali Mutu *</Label>
              <Input
                id="pengendaliMutu"
                value={formData.pengendaliMutu}
                onChange={(e) => setFormData(prev => ({ ...prev, pengendaliMutu: e.target.value }))}
                placeholder="Contoh: Dr. Ahmad Sutanto"
                disabled={!canEdit}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pengendaliTeknis">Nama Pengendali Teknis *</Label>
              <Input
                id="pengendaliTeknis"
                value={formData.pengendaliTeknis}
                onChange={(e) => setFormData(prev => ({ ...prev, pengendaliTeknis: e.target.value }))}
                placeholder="Contoh: Ir. Budi Setiawan"
                disabled={!canEdit}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ketuaTim">Nama Ketua Tim *</Label>
              <Input
                id="ketuaTim"
                value={formData.ketuaTim}
                onChange={(e) => setFormData(prev => ({ ...prev, ketuaTim: e.target.value }))}
                placeholder="Contoh: Drs. Chandra Kusuma"
                disabled={!canEdit}
              />
            </div>

            <div className="space-y-2">
              <Label>Informasi Upload Surat Tugas</Label>
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                Silakan upload file surat tugas. File yang didukung: PDF, DOC, DOCX.
              </div>
            </div>

            <FileUpload
              label="File Surat Tugas"
              accept=".pdf,.doc,.docx"
              multiple={false}
              maxSize={10 * 1024 * 1024} // 10MB
              maxFiles={1}
              files={uploadFiles}
              existingFiles={existingFiles}
              mode={canEdit ? 'edit' : 'view'}
              disabled={!canEdit}
              onFilesChange={handleUploadFilesChange}
              onExistingFileRemove={handleExistingFileRemove}
              description="Format yang didukung: PDF, DOC, DOCX (Max 10MB)"
            />
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Batal
          </Button>
          {canEdit && (
            <Button onClick={handleSave} disabled={!isFormValid}>
              {editingItem ? 'Simpan' : 'Buat'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuratTugasDialog;