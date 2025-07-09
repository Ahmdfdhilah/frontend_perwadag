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
import { Textarea } from '@workspace/ui/components/textarea';
import { Badge } from '@workspace/ui/components/badge';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Matriks } from '@/mocks/matriks';

interface MatriksViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Matriks | null;
}

const MatriksViewDialog: React.FC<MatriksViewDialogProps> = ({
  open,
  onOpenChange,
  item,
}) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Diisi':
        return 'default';
      case 'Belum Diisi':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle>Detail Matriks</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tanggal</Label>
                <Input
                  value={item ? format(new Date(item.tanggal), 'dd MMMM yyyy', { locale: id }) : ''}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex items-center h-10">
                  {item && (
                    <Badge variant={getStatusBadgeVariant(item.status)}>
                      {item.status}
                    </Badge>
                  )}
                </div>
              </div>
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
              <Label>Temuan</Label>
              <Textarea
                value={item?.temuan || ''}
                disabled
                className="bg-muted resize-none"
                rows={6}
                placeholder={item?.status === 'Belum Diisi' ? 'Belum ada temuan yang diisi' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label>Rekomendasi</Label>
              <Textarea
                value={item?.rekomendasi || ''}
                disabled
                className="bg-muted resize-none"
                rows={6}
                placeholder={item?.status === 'Belum Diisi' ? 'Belum ada rekomendasi yang diisi' : ''}
              />
            </div>

            {item?.status === 'Belum Diisi' && (
              <div className="bg-muted/50 border border-muted rounded-md p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Catatan:</strong> Matriks ini belum diisi oleh Inspektorat yang bertanggung jawab. 
                  Temuan dan rekomendasi akan tersedia setelah inspektorat melengkapi data audit.
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button variant="outline" onClick={handleClose}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MatriksViewDialog;