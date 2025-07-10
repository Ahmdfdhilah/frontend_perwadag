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
import { CalendarIcon, Download } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { SuratPemberitahuan } from '@/mocks/suratPemberitahuan';
import { useFormPermissions } from '@/hooks/useFormPermissions';
import FileUpload from '@/components/common/FileUpload';

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
  const { canEditForm } = useFormPermissions();
  const [formData, setFormData] = useState({
    tanggalEvaluasi: undefined as Date | undefined,
    tanggalSuratPemberitahuan: undefined as Date | undefined,
    fileName: '',
    fileUrl: '',
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const [isSuratCalendarOpen, setIsSuratCalendarOpen] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        tanggalEvaluasi: item.tanggalEvaluasi ? new Date(item.tanggalEvaluasi) : undefined,
        tanggalSuratPemberitahuan: item.tanggalSuratPemberitahuan ? new Date(item.tanggalSuratPemberitahuan) : undefined,
        fileName: item.fileName || '',
        fileUrl: item.fileUrl || '',
      });
    } else {
      setFormData({
        tanggalEvaluasi: undefined,
        tanggalSuratPemberitahuan: undefined,
        fileName: '',
        fileUrl: '',
      });
    }
  }, [item, open]);

  const handleSave = () => {
    if (!formData.tanggalEvaluasi || !formData.tanggalSuratPemberitahuan || !item) {
      return;
    }

    const saveData: Partial<SuratPemberitahuan> = {
      id: item.id,
      tanggalEvaluasi: formData.tanggalEvaluasi.toISOString().split('T')[0],
      tanggalSuratPemberitahuan: formData.tanggalSuratPemberitahuan.toISOString().split('T')[0],
      fileName: formData.fileName,
      fileUrl: formData.fileUrl,
      year: formData.tanggalEvaluasi.getFullYear(),
    };

    onSave?.(saveData);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleFilesChange = (files: File[]) => {
    setUploadedFiles(files);
    if (files.length > 0) {
      const file = files[0];
      const fileUrl = URL.createObjectURL(file);
      const fileName = file.name;
      setFormData({
        ...formData,
        fileName,
        fileUrl,
      });
    } else {
      setFormData({
        ...formData,
        fileName: '',
        fileUrl: '',
      });
    }
  };

  const handleDownloadFile = () => {
    if (formData.fileUrl && formData.fileName) {
      const link = document.createElement('a');
      link.href = formData.fileUrl;
      link.download = formData.fileName;
      link.click();
    }
  };

  const isFormValid = formData.tanggalEvaluasi && formData.tanggalSuratPemberitahuan && formData.fileName;
  const isEditable = mode === 'edit';
  const canEdit = canEditForm('surat_pemberitahuan') && isEditable;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle>
            {canEdit ? 'Edit Surat Pemberitahuan' : 'Lihat Surat Pemberitahuan'}
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

            <div>
              <div className="space-y-2">
                <Label>Tanggal Surat {canEdit && '*'}</Label>
                {canEdit ? (
                  <Popover open={isSuratCalendarOpen} onOpenChange={setIsSuratCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.tanggalSuratPemberitahuan ? (
                          format(formData.tanggalSuratPemberitahuan, 'dd MMM yyyy', { locale: id })
                        ) : (
                          <span>Pilih tanggal</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.tanggalSuratPemberitahuan}
                        onSelect={(date) => {
                          setFormData(prev => ({ ...prev, tanggalSuratPemberitahuan: date }));
                          setIsSuratCalendarOpen(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Input
                    value={item?.tanggalSuratPemberitahuan ? format(new Date(item.tanggalSuratPemberitahuan), 'dd MMM yyyy', { locale: id }) : 'Tidak ada data'}
                    disabled
                    className="bg-muted"
                  />
                )}
              </div>
            </div>

            {!canEdit && (
              <div className="space-y-2">
                <Label>Informasi Surat Pemberitahuan</Label>
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  Klik tombol "Download" di bawah untuk mengunduh surat pemberitahuan.
                </div>
              </div>
            )}

            {canEdit && (
              <div className="space-y-2">
                <Label>Informasi Upload Surat Pemberitahuan</Label>
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  Silakan upload file surat pemberitahuan. File yang didukung: PDF, DOC, DOCX.
                </div>
              </div>
            )}

            <FileUpload
              label={`File Surat Pemberitahuan ${canEdit ? '*' : ''}`}
              accept=".pdf,.doc,.docx"
              maxSize={10 * 1024 * 1024}
              multiple={false}
              mode={canEdit ? 'edit' : 'view'}
              disabled={!canEdit}
              files={uploadedFiles}
              existingFiles={formData.fileName ? [{ name: formData.fileName, url: formData.fileUrl }] : []}
              onFilesChange={handleFilesChange}
              onFileDownload={handleDownloadFile}
              description="Format yang didukung: PDF, DOC, DOCX (Max 10MB)"
            />
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button variant="outline" onClick={handleCancel}>
{canEdit ? 'Batal' : 'Tutup'}
          </Button>
          {canEdit && (
            <Button onClick={handleSave} disabled={!isFormValid}>
              Simpan
            </Button>
          )}
          {!canEdit && formData.fileName && (
            <Button onClick={handleDownloadFile}>
              <Download className="w-4 h-4 mr-2" />
              Download File
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuratPemberitahuanDialog;