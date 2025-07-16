import React from 'react';
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
import { Download, File } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { SuratTugas } from '@/mocks/suratTugas';

interface SuratTugasViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: SuratTugas | null;
}

const SuratTugasViewDialog: React.FC<SuratTugasViewDialogProps> = ({
  open,
  onOpenChange,
  item,
}) => {
  const handleDownloadFile = () => {
    if (item?.fileUrl && item?.fileName) {
      const link = document.createElement('a');
      link.href = item.fileUrl;
      link.download = item.fileName;
      link.click();
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle>Lihat Surat Tugas</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Nomor Surat Tugas</Label>
              <Input
                value={item?.nomor || ''}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label>Nama Perwadag</Label>
              <Input
                value={item?.perwadagName || ''}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tanggal Mulai Evaluasi</Label>
                <Input
                  value={item ? format(new Date(item.tanggalPelaksanaanEvaluasi), 'dd MMMM yyyy', { locale: id }) : ''}
                  disabled
                  className="bg-muted"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Tanggal Selesai Evaluasi</Label>
                <Input
                  value={item?.tanggalSelesaiEvaluasi ? format(new Date(item.tanggalSelesaiEvaluasi), 'dd MMMM yyyy', { locale: id }) : 'Belum ditentukan'}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Nama Pengendali Mutu</Label>
              <Input
                value={item?.pengendaliMutu || ''}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label>Nama Pengendali Teknis</Label>
              <Input
                value={item?.pengendaliTeknis || ''}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label>Nama Ketua Tim</Label>
              <Input
                value={item?.ketuaTim || ''}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label>Informasi Surat Tugas</Label>
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                Klik tombol "Download" di bawah untuk mengunduh surat tugas.
              </div>
            </div>

            <div className="space-y-2">
              <Label>File Surat Tugas</Label>
              <div className="flex gap-2">
                <Input
                  value={item?.fileName || 'Tidak ada file'}
                  disabled
                  className="bg-muted flex-1"
                />
                {item?.fileName && (
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
              {item?.fileName && (
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <File className="w-3 h-3" />
                  File: {item.fileName}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Tutup
          </Button>
          {item?.fileName && (
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

export default SuratTugasViewDialog;