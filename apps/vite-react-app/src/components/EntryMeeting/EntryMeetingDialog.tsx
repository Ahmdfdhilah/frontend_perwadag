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
import { Badge } from '@workspace/ui/components/badge';
import { CalendarIcon, Upload, Download, File, ExternalLink, X, Image } from 'lucide-react';
import { EntryMeeting, getEntryMeetingStatus } from '@/mocks/entryMeeting';
import { useRole } from '@/hooks/useRole';
import { formatIndonesianDate, formatIndonesianDateRange } from '@/utils/timeFormat';

interface EntryMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: EntryMeeting | null;
  mode: 'view' | 'edit';
  onSave: (data: Partial<EntryMeeting>) => void;
}

const EntryMeetingDialog: React.FC<EntryMeetingDialogProps> = ({
  open,
  onOpenChange,
  item,
  mode,
  onSave,
}) => {
  const { isAdmin, isInspektorat } = useRole();
  const [formData, setFormData] = useState<Partial<EntryMeeting>>({});

  useEffect(() => {
    if (item && open) {
      setFormData({...item});
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

  const handleFileUpload = (field: 'daftarHadir', file: File) => {
    const fileUrl = URL.createObjectURL(file);
    const fileName = file.name;
    setFormData({ 
      ...formData, 
      [field]: fileName,
      [`${field}Url`]: fileUrl
    });
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newImages: string[] = [];
    const newImageUrls: string[] = [];
    
    Array.from(files).slice(0, 2).forEach(file => {
      const fileUrl = URL.createObjectURL(file);
      newImages.push(file.name);
      newImageUrls.push(fileUrl);
    });
    
    setFormData({
      ...formData,
      buktiImages: [...(formData.buktiImages || []), ...newImages].slice(0, 2),
      buktiImageUrls: [...(formData.buktiImageUrls || []), ...newImageUrls].slice(0, 2)
    });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...(formData.buktiImages || [])];
    const newImageUrls = [...(formData.buktiImageUrls || [])];
    
    newImages.splice(index, 1);
    newImageUrls.splice(index, 1);
    
    setFormData({
      ...formData,
      buktiImages: newImages,
      buktiImageUrls: newImageUrls
    });
  };

  const handleDownloadFile = (fileName: string, fileUrl: string) => {
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.click();
    }
  };

  const handleOpenLink = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const isEditable = mode === 'edit';
  const canEdit = (isAdmin() || isInspektorat()) && isEditable;

  const status = item ? getEntryMeetingStatus(item) : 'Belum Upload';
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Lengkap': return 'default';
      case 'Sebagian': return 'secondary';
      case 'Belum Upload': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle>
            {mode === 'view' ? 'Lihat Entry Meeting' : 'Edit Entry Meeting'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-6">
            {/* Info Basic - Read Only */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nama Perwadag</Label>
                <div className="p-3 bg-muted rounded-md">
                  {item?.perwadagName}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status Upload</Label>
                <div>
                  <Badge variant={getStatusBadgeVariant(status)}>
                    {status}
                  </Badge>
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
                <Label>Tanggal Entry Meeting</Label>
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

            {/* Daftar Hadir - Editable */}
            <div className="space-y-2">
              <Label>Daftar Hadir</Label>
              {canEdit ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('daftarHadir', file);
                      }}
                      className="hidden"
                      id="daftar-hadir-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('daftar-hadir-upload')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                  </div>
                  {formData.daftarHadir && (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                      <File className="h-4 w-4" />
                      <span className="flex-1 text-sm">{formData.daftarHadir}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadFile(formData.daftarHadir!, formData.daftarHadirUrl!)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {item?.daftarHadir ? (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                      <File className="h-4 w-4" />
                      <span className="flex-1 text-sm">{item.daftarHadir}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadFile(item.daftarHadir!, item.daftarHadirUrl!)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="p-3 bg-muted rounded-md text-muted-foreground">
                      Belum ada file
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bukti Images - Editable */}
            <div className="space-y-2">
              <Label>Bukti Hadir (Maksimal 2 gambar)</Label>
              {canEdit ? (
                <div className="space-y-2">
                  {(formData.buktiImages?.length || 0) < 2 && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageUpload(e.target.files)}
                        className="hidden"
                        id="bukti-image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('bukti-image-upload')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Gambar ({formData.buktiImages?.length || 0}/2)
                      </Button>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    {formData.buktiImageUrls?.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Bukti ${index + 1}`}
                          className="w-full h-32 object-cover rounded-md border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
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
              )}
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

export default EntryMeetingDialog;