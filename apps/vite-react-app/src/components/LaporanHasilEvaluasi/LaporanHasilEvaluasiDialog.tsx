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
import { CalendarIcon, Download } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@workspace/ui/lib/utils';
import { LaporanHasilResponse } from '@/services/laporanHasil/types';
import { useFormPermissions } from '@/hooks/useFormPermissions';
import { formatIndonesianDateRange } from '@/utils/timeFormat';
import FileUpload from '@/components/common/FileUpload';

interface LaporanHasilEvaluasiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: LaporanHasilResponse | null;
  mode: 'view' | 'edit';
  onSave: (data: any) => void;
}

const LaporanHasilEvaluasiDialog: React.FC<LaporanHasilEvaluasiDialogProps> = ({
  open,
  onOpenChange,
  item,
  mode,
  onSave,
}) => {
  const { canEditForm } = useFormPermissions();
  const [formData, setFormData] = useState<any>({});
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  useEffect(() => {
    if (item && open) {
      setFormData({
        nomor_laporan: item.nomor_laporan || '',
        tanggal_laporan: item.tanggal_laporan,
      });
      setSelectedDate(item.tanggal_laporan ? new Date(item.tanggal_laporan) : undefined);
    } else {
      setFormData({
        nomor_laporan: '',
        tanggal_laporan: '',
      });
      setSelectedDate(undefined);
      setUploadFile(null);
    }
  }, [item, open]);

  const handleSave = () => {
    const dataToSave = {
      nomor_laporan: formData.nomor_laporan,
      tanggal_laporan: selectedDate ? selectedDate.toISOString().split('T')[0] : formData.tanggal_laporan,
      file: uploadFile,
    };
    onSave(dataToSave);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleUploadFileChange = (files: File[]) => {
    setUploadFile(files[0] || null);
  };

  const handleDownloadFile = () => {
    if (item?.file_urls?.download_url) {
      const link = document.createElement('a');
      link.href = item.file_urls.download_url;
      link.download = item.file_metadata?.original_filename || 'laporan-hasil-evaluasi';
      link.click();
    }
  };

  const handleViewFile = () => {
    if (item?.file_urls?.view_url) {
      window.open(item.file_urls.view_url, '_blank');
    }
  };

  const isEditable = mode === 'edit';
  const canEdit = canEditForm('laporan_hasil_evaluasi') && isEditable;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle>
            {mode === 'view' ? 'Lihat Laporan Hasil Evaluasi' : 'Edit Laporan Hasil Evaluasi'}
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
              <Label htmlFor="nomor_laporan">Nomor Laporan</Label>
              {canEdit ? (
                <Input
                  id="nomor_laporan"
                  value={formData.nomor_laporan || ''}
                  onChange={(e) => setFormData({ ...formData, nomor_laporan: e.target.value })}
                  placeholder="LHE/001/2024"
                />
              ) : (
                <div className="p-3 bg-muted rounded-md">
                  {item?.nomor_laporan || '-'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tanggal_laporan">Tanggal Laporan</Label>
              {canEdit ? (
                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "dd MMMM yyyy", { locale: id })
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                    </Button>
                  </PopoverTrigger>
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
                </Popover>
              ) : (
                <div className="p-3 bg-muted rounded-md">
                  {item?.tanggal_laporan ? format(new Date(item.tanggal_laporan), "dd MMMM yyyy", { locale: id }) : '-'}
                </div>
              )}
            </div>

            {/* Current File Display */}
            {item?.has_file && (
              <div className="space-y-2">
                <Label>File Laporan Saat Ini</Label>
                <div className="p-3 bg-muted rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.file_metadata?.original_filename || 'Laporan Hasil Evaluasi'}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.file_metadata?.size_mb ? `${item.file_metadata.size_mb.toFixed(2)} MB` : ''}
                        {item.file_metadata?.uploaded_at ? ` • Uploaded ${format(new Date(item.file_metadata.uploaded_at), 'dd MMM yyyy')}` : ''}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {item.file_urls?.view_url && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleViewFile}
                        >
                          View
                        </Button>
                      )}
                      {item.file_urls?.download_url && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleDownloadFile}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* File Upload */}
            {canEdit && (
              <FileUpload
                label="Upload File Laporan (Optional)"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                multiple={false}
                maxSize={10 * 1024 * 1024} // 10MB
                files={uploadFile ? [uploadFile] : []}
                mode="edit"
                onFilesChange={handleUploadFileChange}
                description="Format yang didukung: PDF, DOC, DOCX, XLS, XLSX (Max 10MB)"
              />
            )}

            {/* Status Information */}
            <div className="space-y-2">
              <Label>Status Kelengkapan</Label>
              <div className="p-3 bg-muted rounded-md">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item?.is_completed
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item?.is_completed ? 'Lengkap' : 'Belum Lengkap'}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({item?.completion_percentage || 0}% lengkap)
                  </span>
                </div>
              </div>
            </div>
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

export default LaporanHasilEvaluasiDialog;