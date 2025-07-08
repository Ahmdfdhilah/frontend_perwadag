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
import { ExternalLink } from 'lucide-react';
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
  const handleOpenLink = () => {
    if (item?.linkDrive) {
      window.open(item.linkDrive, '_blank');
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
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

            <div className="space-y-2">
              <Label>Tanggal</Label>
              <Input
                value={item ? format(new Date(item.tanggal), 'dd MMMM yyyy', { locale: id }) : ''}
                disabled
                className="bg-muted"
              />
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
                Klik tombol "Buka Link" di bawah untuk melihat surat tugas.
              </div>
            </div>

            <div className="space-y-2">
              <Label>Link Drive Surat Tugas</Label>
              <div className="flex gap-2">
                <Input
                  value={item?.linkDrive || ''}
                  disabled
                  className="bg-muted"
                />
                {item?.linkDrive && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleOpenLink}
                    title="Buka Link"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Tutup
          </Button>
          {item?.linkDrive && (
            <Button onClick={handleOpenLink}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Buka Link
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuratTugasViewDialog;