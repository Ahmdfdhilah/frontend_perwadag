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
import { Textarea } from '@workspace/ui/components/textarea';
import { Matriks } from '@/mocks/matriks';

interface MatriksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Matriks | null;
  onSave: (data: Partial<Matriks>) => void;
}

const MatriksDialog: React.FC<MatriksDialogProps> = ({
  open,
  onOpenChange,
  item,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<Matriks>>({});

  useEffect(() => {
    if (item && open) {
      setFormData({
        ...item,
      });
    } else {
      setFormData({});
    }
  }, [item, open]);

  const handleSave = () => {
    onSave(formData);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle>Edit Matriks</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="temuan">Temuan</Label>
              <Textarea
                id="temuan"
                value={formData.temuan || ''}
                onChange={(e) => setFormData({ ...formData, temuan: e.target.value })}
                placeholder="Masukkan temuan audit..."
                rows={6}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rekomendasi">Rekomendasi</Label>
              <Textarea
                id="rekomendasi"
                value={formData.rekomendasi || ''}
                onChange={(e) => setFormData({ ...formData, rekomendasi: e.target.value })}
                placeholder="Masukkan rekomendasi..."
                rows={6}
                className="resize-none"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Batal
          </Button>
          <Button onClick={handleSave}>
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MatriksDialog;