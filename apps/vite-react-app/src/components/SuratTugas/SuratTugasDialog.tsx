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
import { Combobox } from '@workspace/ui/components/combobox';
import { Calendar } from '@workspace/ui/components/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { SuratTugasResponse } from '@/services/suratTugas/types';
import { PerwadagSummary } from '@/services/users/types';
import { useFormPermissions } from '@/hooks/useFormPermissions';
import FileUpload from '@/components/common/FileUpload';

interface SuratTugasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: SuratTugasResponse | null;
  mode?: 'view' | 'edit' | 'create';
  onSave: (data: any) => void;
  availablePerwadag: PerwadagSummary[];
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
    no_surat: '',
    user_perwadag_id: '',
    tanggal_evaluasi_mulai: undefined as Date | undefined,
    tanggal_evaluasi_selesai: undefined as Date | undefined,
    nama_pengedali_mutu: '',
    nama_pengendali_teknis: '',
    nama_ketua_tim: '',
  });

  const [isStartCalendarOpen, setIsStartCalendarOpen] = useState(false);
  const [isEndCalendarOpen, setIsEndCalendarOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<Array<{ name: string; url?: string }>>([]);
  const [perwadagSearchValue, setPerwadagSearchValue] = useState('');

  useEffect(() => {
    if (editingItem) {
      setFormData({
        no_surat: editingItem.no_surat,
        user_perwadag_id: editingItem.user_perwadag_id,
        tanggal_evaluasi_mulai: new Date(editingItem.tanggal_evaluasi_mulai),
        tanggal_evaluasi_selesai: editingItem.tanggal_evaluasi_selesai ? new Date(editingItem.tanggal_evaluasi_selesai) : undefined,
        nama_pengedali_mutu: editingItem.nama_pengedali_mutu,
        nama_pengendali_teknis: editingItem.nama_pengendali_teknis,
        nama_ketua_tim: editingItem.nama_ketua_tim,
      });
      
      // Set existing files for display
      setExistingFiles(editingItem.file_surat_tugas ? [{ name: 'Surat Tugas', url: editingItem.file_surat_tugas_url }] : []);
    } else {
      setFormData({
        no_surat: '',
        user_perwadag_id: '',
        tanggal_evaluasi_mulai: undefined,
        tanggal_evaluasi_selesai: undefined,
        nama_pengedali_mutu: '',
        nama_pengendali_teknis: '',
        nama_ketua_tim: '',
      });
      setUploadFiles([]);
      setExistingFiles([]);
    }
    // Reset search when dialog opens/closes
    setPerwadagSearchValue('');
  }, [editingItem, open]);

  const handleSave = () => {
    // Validate all required fields
    if (!formData.no_surat || !formData.user_perwadag_id || !formData.tanggal_evaluasi_mulai ||
        !formData.nama_pengedali_mutu || !formData.nama_pengendali_teknis || !formData.nama_ketua_tim) {
      return;
    }

    const saveData = {
      user_perwadag_id: formData.user_perwadag_id,
      tanggal_evaluasi_mulai: formData.tanggal_evaluasi_mulai.toISOString().split('T')[0],
      tanggal_evaluasi_selesai: formData.tanggal_evaluasi_selesai?.toISOString().split('T')[0],
      no_surat: formData.no_surat,
      nama_pengedali_mutu: formData.nama_pengedali_mutu,
      nama_pengendali_teknis: formData.nama_pengendali_teknis,
      nama_ketua_tim: formData.nama_ketua_tim,
      file: uploadFiles.length > 0 ? uploadFiles[0] : null, // Send null instead of undefined
    };

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

  const isFormValid = formData.no_surat && formData.user_perwadag_id && formData.tanggal_evaluasi_mulai &&
    formData.nama_pengedali_mutu && formData.nama_pengendali_teknis && formData.nama_ketua_tim;
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
              <Label htmlFor="no_surat">Nomor Surat Tugas *</Label>
              <Input
                id="no_surat"
                value={formData.no_surat}
                onChange={(e) => setFormData(prev => ({ ...prev, no_surat: e.target.value }))}
                placeholder="Contoh: ST/001/I/2024"
                disabled={!canEdit}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="perwadag">Perwadag *</Label>
              <Combobox
                options={availablePerwadag
                  .filter(perwadag => 
                    perwadagSearchValue === '' || 
                    perwadag.nama.toLowerCase().includes(perwadagSearchValue.toLowerCase()) ||
                    perwadag.inspektorat?.toLowerCase().includes(perwadagSearchValue.toLowerCase())
                  )
                  .map(perwadag => ({
                    value: perwadag.id,
                    label: perwadag.nama,
                    description: perwadag.inspektorat || ''
                  }))}
                value={formData.user_perwadag_id}
                onChange={(value) => setFormData(prev => ({ ...prev, user_perwadag_id: value.toString() }))}
                placeholder="Pilih perwadag"
                searchPlaceholder="Cari perwadag..."
                searchValue={perwadagSearchValue}
                onSearchChange={setPerwadagSearchValue}
                emptyMessage="Tidak ada perwadag yang ditemukan"
                disabled={!canEdit}
              />
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
                      {formData.tanggal_evaluasi_mulai ? (
                        format(formData.tanggal_evaluasi_mulai, 'dd MMM yyyy', { locale: id })
                      ) : (
                        <span>Pilih tanggal mulai</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.tanggal_evaluasi_mulai}
                      onSelect={(date) => {
                        setFormData(prev => ({ ...prev, tanggal_evaluasi_mulai: date }));
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
                      {formData.tanggal_evaluasi_selesai ? (
                        format(formData.tanggal_evaluasi_selesai, 'dd MMM yyyy', { locale: id })
                      ) : (
                        <span>Pilih tanggal selesai</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.tanggal_evaluasi_selesai}
                      onSelect={(date) => {
                        setFormData(prev => ({ ...prev, tanggal_evaluasi_selesai: date }));
                        setIsEndCalendarOpen(false);
                      }}
                      disabled={(date) => {
                        if (!formData.tanggal_evaluasi_mulai) return false;
                        return date < formData.tanggal_evaluasi_mulai;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nama_pengedali_mutu">Nama Pengendali Mutu *</Label>
              <Input
                id="nama_pengedali_mutu"
                value={formData.nama_pengedali_mutu}
                onChange={(e) => setFormData(prev => ({ ...prev, nama_pengedali_mutu: e.target.value }))}
                placeholder="Contoh: Dr. Ahmad Sutanto"
                disabled={!canEdit}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nama_pengendali_teknis">Nama Pengendali Teknis *</Label>
              <Input
                id="nama_pengendali_teknis"
                value={formData.nama_pengendali_teknis}
                onChange={(e) => setFormData(prev => ({ ...prev, nama_pengendali_teknis: e.target.value }))}
                placeholder="Contoh: Ir. Budi Setiawan"
                disabled={!canEdit}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nama_ketua_tim">Nama Ketua Tim *</Label>
              <Input
                id="nama_ketua_tim"
                value={formData.nama_ketua_tim}
                onChange={(e) => setFormData(prev => ({ ...prev, nama_ketua_tim: e.target.value }))}
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