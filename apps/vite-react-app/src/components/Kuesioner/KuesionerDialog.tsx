import React, { useState, useEffect } from 'react';
import { useFormPermissions } from '@/hooks/useFormPermissions';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Button } from '@workspace/ui/components/button';
import { Label } from '@workspace/ui/components/label';
import { Input } from '@workspace/ui/components/input';
import DatePicker from '@/components/common/DatePicker';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { KuisionerResponse } from '@/services/kuisioner/types';
import { formatIndonesianDateRange } from '@/utils/timeFormat';
import FileUpload from '@/components/common/FileUpload';
import { kuisionerService } from '@/services/kuisioner';

interface KuesionerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: KuisionerResponse | null;
  mode: 'view' | 'edit';
  onSave: (data: any) => void;
}

const KuesionerDialog: React.FC<KuesionerDialogProps> = ({
  open,
  onOpenChange,
  item,
  mode,
  onSave,
}) => {
  const { canEditForm } = useFormPermissions();
  const [formData, setFormData] = useState<any>({});
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<Array<{ name: string; url?: string; viewUrl?: string }>>([]);

  useEffect(() => {
    if (item && open) {
      setFormData({
        tanggal_kuisioner: item.tanggal_kuisioner,
        link_dokumen_data_dukung: item.link_dokumen_data_dukung || '',
      });
      setSelectedDate(item.tanggal_kuisioner ? new Date(item.tanggal_kuisioner) : undefined);

      // Set existing files for display
      if (item.has_file && item.file_metadata) {
        setExistingFiles([{
          name: item.file_metadata.original_filename || item.file_metadata.filename || 'Kuesioner',
          url: item.file_urls?.download_url,
          viewUrl: item.file_urls?.file_url
        }]);
      } else {
        setExistingFiles([]);
      }
    } else {
      setFormData({
        tanggal_kuisioner: '',
        link_dokumen_data_dukung: '',
      });
      setSelectedDate(undefined);
      setUploadFiles([]);
      setExistingFiles([]);
    }
  }, [item, open]);

  const handleSave = () => {
    const dataToSave = {
      tanggal_kuisioner: selectedDate ? selectedDate.toISOString().split('T')[0] : formData.tanggal_kuisioner,
      link_dokumen_data_dukung: formData.link_dokumen_data_dukung,
      files: uploadFiles,
    };
    onSave(dataToSave);
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
      const blob = await kuisionerService.downloadFile(item.id);
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
  const canEdit = canEditForm('kuesioner') && isEditable;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle>
            {mode === 'view' ? 'Lihat Kuesioner' : 'Edit Kuesioner'}
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
              <Label htmlFor="tanggal_kuisioner">Tanggal Kuesioner</Label>
              {canEdit ? (
                <DatePicker
                  value={selectedDate}
                  onChange={setSelectedDate}
                  placeholder="Pilih tanggal kuesioner"
                  disabled={!canEdit}
                />
              ) : (
                <div className="p-3 bg-muted rounded-md">
                  {item?.tanggal_kuisioner ? format(new Date(item.tanggal_kuisioner), "dd MMMM yyyy", { locale: id }) : '-'}
                </div>
              )}
            </div>

            {/* Link Dokumen Data Dukung */}
            <div className="space-y-2">
              <Label htmlFor="link_dokumen_data_dukung">Link Dokumen Data Dukung</Label>
              {canEdit ? (
                <Input
                  id="link_dokumen_data_dukung"
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={formData.link_dokumen_data_dukung || ''}
                  onChange={(e) => setFormData((prev: any) => ({ 
                    ...prev, 
                    link_dokumen_data_dukung: e.target.value 
                  }))}
                />
              ) : (
                <div className="p-3 bg-muted rounded-md">
                  {item?.link_dokumen_data_dukung ? (
                    <a
                      href={item.link_dokumen_data_dukung}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline break-all"
                    >
                      {item.link_dokumen_data_dukung}
                    </a>
                  ) : (
                    '-'
                  )}
                </div>
              )}
            </div>

            {/* Upload File Kuesioner */}
            <FileUpload
              label="Upload File Kuesioner"
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

export default KuesionerDialog;