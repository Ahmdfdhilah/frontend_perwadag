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
import { ExternalLink } from 'lucide-react';
import { ExitMeeting } from '@/mocks/exitMeeting';
import { useRole } from '@/hooks/useRole';
import { formatIndonesianDate, formatIndonesianDateRange } from '@/utils/timeFormat';

interface ExitMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ExitMeeting | null;
  mode: 'view' | 'edit';
  onSave: (data: Partial<ExitMeeting>) => void;
}

const ExitMeetingDialog: React.FC<ExitMeetingDialogProps> = ({
  open,
  onOpenChange,
  item,
  mode,
  onSave,
}) => {
  const { isAdmin, isInspektorat } = useRole();
  const [formData, setFormData] = useState<Partial<ExitMeeting>>({});

  useEffect(() => {
    if (item && open) {
      setFormData({ ...item });
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


  const handleOpenLink = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const isEditable = mode === 'edit';
  const canEdit = (isAdmin() || isInspektorat()) && isEditable;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle>
            {mode === 'view' ? 'Lihat Exit Meeting' : 'Edit Exit Meeting'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-6">
            {/* Info Basic - Read Only */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Nama Perwadag</Label>
                <div className="p-3 bg-muted rounded-md">
                  {item?.perwadagName}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tanggal Evaluasi</Label>
                <div className="p-3 bg-muted rounded-md">
                  {item ? formatIndonesianDateRange(item.tanggalMulaiEvaluasi, item.tanggalAkhirEvaluasi) : '-'}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tanggal Exit Meeting</Label>
                <div className="p-3 bg-muted rounded-md">
                  {item ? formatIndonesianDate(item.tanggal) : '-'}
                </div>
              </div>
            </div>

            {/* Link Zoom - Editable */}
            <div className="space-y-2">
              <Label htmlFor="linkZoom">Link Zoom</Label>
              {canEdit ? (
                <div className="flex gap-2">
                  <Input
                    id="linkZoom"
                    value={formData.linkZoom || ''}
                    onChange={(e) => setFormData({ ...formData, linkZoom: e.target.value })}
                    placeholder="https://zoom.us/j/..."
                  />
                  {formData.linkZoom && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenLink(formData.linkZoom!)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="p-3 bg-muted rounded-md flex-1">
                    {item?.linkZoom || '-'}
                  </div>
                  {item?.linkZoom && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenLink(item.linkZoom!)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Link Daftar Hadir - Editable */}
            <div className="space-y-2">
              <Label htmlFor="linkDaftarHadir">Link Daftar Hadir</Label>
              {canEdit ? (
                <div className="flex gap-2">
                  <Input
                    id="linkDaftarHadir"
                    value={formData.linkDaftarHadir || ''}
                    onChange={(e) => setFormData({ ...formData, linkDaftarHadir: e.target.value })}
                    placeholder="https://forms.google.com/..."
                  />
                  {formData.linkDaftarHadir && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenLink(formData.linkDaftarHadir!)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="p-3 bg-muted rounded-md flex-1">
                    {item?.linkDaftarHadir || '-'}
                  </div>
                  {item?.linkDaftarHadir && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenLink(item.linkDaftarHadir!)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Bukti Images - Still using file uploads */}
            <div className="space-y-2">
              <Label>Bukti Hadir (Maksimal 2 gambar)</Label>
              <div>
                {item?.buktiImageUrls && item.buktiImageUrls.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {item.buktiImageUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Bukti ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md border"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-muted rounded-md text-muted-foreground">
                    Belum ada gambar
                  </div>
                )}
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

export default ExitMeetingDialog;