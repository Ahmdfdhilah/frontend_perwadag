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
import { CalendarIcon, Upload, Download, File } from 'lucide-react';
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
    tanggalEvaluasi: undefined as Date | undefined,
    tanggalSuratPemberitahuan: undefined as Date | undefined,
    fileName: '',
    fileUrl: '',
  });

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
      status: formData.fileName ? 'uploaded' : 'not_uploaded',
      year: formData.tanggalEvaluasi.getFullYear(),
    };

    onSave?.(saveData);
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

  const isFormValid = formData.tanggalEvaluasi && formData.tanggalSuratPemberitahuan && formData.fileName;
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

            <div>
              <div className="space-y-2">
                <Label>Tanggal Surat {isEditing && '*'}</Label>
                {isEditing ? (
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

            {!isEditing && (
              <div className="space-y-2">
                <Label>Informasi Surat Pemberitahuan</Label>
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  Klik tombol "Download" di bawah untuk mengunduh surat pemberitahuan.
                </div>
              </div>
            )}

            {isEditing && (
              <div className="space-y-2">
                <Label>Informasi Upload Surat Pemberitahuan</Label>
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  Silakan upload file surat pemberitahuan. File yang didukung: PDF, DOC, DOCX.
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="fileUpload">File Surat Pemberitahuan {isEditing && '*'}</Label>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
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
                  </>
                ) : (
                  <Input
                    value={formData.fileName || 'Tidak ada file'}
                    disabled
                    className="bg-muted flex-1"
                  />
                )}
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
            {isEditing ? 'Batal' : 'Tutup'}
          </Button>
          {isEditing && (
            <Button onClick={handleSave} disabled={!isFormValid}>
              Simpan
            </Button>
          )}
          {!isEditing && formData.fileName && (
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