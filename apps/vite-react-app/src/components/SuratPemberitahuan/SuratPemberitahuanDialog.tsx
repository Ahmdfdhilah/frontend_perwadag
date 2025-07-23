import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Button } from '@workspace/ui/components/button';
import { Label } from '@workspace/ui/components/label';
import DatePicker from '@/components/common/DatePicker';
import { SuratPemberitahuanResponse } from '@/services/suratPemberitahuan/types';
import { useFormPermissions } from '@/hooks/useFormPermissions';
import { formatIndonesianDateRange } from '@/utils/timeFormat';
import FileUpload from '@/components/common/FileUpload';
import { suratPemberitahuanService } from '@/services/suratPemberitahuan';
import { format } from 'date-fns';
import { id } from 'date-fns/locale/id';

interface SuratPemberitahuanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: SuratPemberitahuanResponse | null;
  onSave?: (data: any) => void;
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
  const [formData, setFormData] = useState<any>({});
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<Array<{ name: string; url?: string; viewUrl?: string }>>([]);

  useEffect(() => {
    if (item && open) {
      setFormData({
        tanggal_surat_pemberitahuan: item.tanggal_surat_pemberitahuan,
      });
      setSelectedDate(item.tanggal_surat_pemberitahuan ? new Date(item.tanggal_surat_pemberitahuan) : undefined);

      // Set existing files for display
      if (item.has_file && item.file_metadata) {
        setExistingFiles([{
          name: item.file_metadata.original_filename || item.file_metadata.filename || 'Surat Pemberitahuan',
          url: item.file_urls?.download_url,
          viewUrl: item.file_urls?.file_url
        }]);
      } else {
        setExistingFiles([]);
      }
    } else {
      setFormData({
        tanggal_surat_pemberitahuan: '',
      });
      setSelectedDate(undefined);
      setUploadFiles([]);
      setExistingFiles([]);
    }
  }, [item, open]);

  const handleSave = () => {
    const dataToSave = {
      tanggal_surat_pemberitahuan: selectedDate ? selectedDate.toISOString().split('T')[0] : formData.tanggal_surat_pemberitahuan,
      files: uploadFiles,
    };
    onSave?.(dataToSave);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleUploadFilesChange = (files: File[]) => {
    setUploadFiles(files);
  };

  const handleExistingFilesRemove = (index: number) => {
    setExistingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileDownload = async (file: { name: string; url?: string; viewUrl?: string }) => {
    if (!item?.id) return;
    
    try {
      const blob = await suratPemberitahuanService.downloadFile(item.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };


  const isEditable = mode === 'edit';
  const canEdit = canEditForm('surat_pemberitahuan') && isEditable;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle>
            {canEdit ? 'Edit Surat Pemberitahuan' : 'Lihat Surat Pemberitahuan'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-6">
            {/* Basic Info - Read Only */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Nama Perwadag</Label>
                <div className="p-3 bg-muted rounded-md">
                  {item?.nama_perwadag}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Periode Evaluasi</Label>
              <div className="p-3 bg-muted rounded-md">
                {item ? formatIndonesianDateRange(item.tanggal_evaluasi_mulai, item.tanggal_evaluasi_selesai) : '-'}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tanggal_surat_pemberitahuan">Tanggal Surat Pemberitahuan</Label>
              {canEdit ? (
                <DatePicker
                  value={selectedDate}
                  onChange={setSelectedDate}
                  placeholder="Pilih tanggal"
                />
              ) : (
                <div className="p-3 bg-muted rounded-md">
                  {item?.tanggal_surat_pemberitahuan ? format(new Date(item.tanggal_surat_pemberitahuan), "dd MMMM yyyy", { locale: id }) : '-'}
                </div>
              )}
            </div>

            {/* Upload File Surat Pemberitahuan */}
            <FileUpload
              label="Upload File Surat Pemberitahuan"
              accept=".pdf,.doc,.docx"
              multiple={false}
              maxSize={10 * 1024 * 1024} // 10MB
              maxFiles={1}
              files={uploadFiles}
              existingFiles={existingFiles}
              mode={canEdit ? 'edit' : 'view'}
              disabled={!canEdit}
              onFilesChange={handleUploadFilesChange}
              onExistingFileRemove={handleExistingFilesRemove}
              onFileDownload={handleFileDownload}
              description="Format yang didukung: PDF, DOC, DOCX (Max 10MB per file)"
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

export default SuratPemberitahuanDialog;