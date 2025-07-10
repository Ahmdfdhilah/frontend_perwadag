import React, { useState, useEffect, useRef } from 'react';
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
import { ExternalLink, Upload, X } from 'lucide-react';
import { EntryMeeting } from '@/mocks/entryMeeting';
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
  const [daftarHadirFile, setDaftarHadirFile] = useState<File | null>(null);
  const [buktiHadirFiles, setBuktiHadirFiles] = useState<File[]>([]);
  const daftarHadirRef = useRef<HTMLInputElement>(null);
  const buktiHadirRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (item && open) {
      setFormData({ ...item });
    } else {
      setFormData({});
      setDaftarHadirFile(null);
      setBuktiHadirFiles([]);
    }
  }, [item, open]);

  const handleSave = () => {
    const dataToSave = {
      ...formData,
      daftarHadirFile,
      buktiHadirFiles,
    };
    onSave(dataToSave);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };


  const handleOpenLink = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleDaftarHadirFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDaftarHadirFile(file);
    }
  };

  const handleBuktiHadirFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setBuktiHadirFiles(prev => [...prev, ...files].slice(0, 2));
    }
  };

  const removeBuktiHadirFile = (index: number) => {
    setBuktiHadirFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeDaftarHadirFile = () => {
    setDaftarHadirFile(null);
    if (daftarHadirRef.current) {
      daftarHadirRef.current.value = '';
    }
  };

  const isEditable = mode === 'edit';
  const canEdit = (isAdmin() || isInspektorat()) && isEditable;


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

            {/* Upload Daftar Hadir */}
            <div className="space-y-2">
              <Label>Upload Daftar Hadir</Label>
              {canEdit ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => daftarHadirRef.current?.click()}
                      className="w-full justify-start"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {daftarHadirFile ? daftarHadirFile.name : 'Pilih file daftar hadir'}
                    </Button>
                    {daftarHadirFile && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeDaftarHadirFile}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <input
                    ref={daftarHadirRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleDaftarHadirFileChange}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground">
                    Format yang didukung: PDF, DOC, DOCX, JPG, PNG (Max 5MB)
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-muted rounded-md text-muted-foreground">
                  {item?.linkDaftarHadir ? 'File daftar hadir telah diupload' : 'Belum ada file daftar hadir'}
                </div>
              )}
            </div>

            {/* Upload Bukti Hadir */}
            <div className="space-y-2">
              <Label>Upload Bukti Hadir (Maksimal 2 gambar)</Label>
              {canEdit ? (
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => buktiHadirRef.current?.click()}
                    className="w-full justify-start"
                    disabled={buktiHadirFiles.length >= 2}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {buktiHadirFiles.length === 0 ? 'Pilih gambar bukti hadir' : `Tambah gambar (${buktiHadirFiles.length}/2)`}
                  </Button>
                  <input
                    ref={buktiHadirRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleBuktiHadirFileChange}
                    className="hidden"
                  />
                  {buktiHadirFiles.length > 0 && (
                    <div className="space-y-2">
                      {buktiHadirFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                          <span className="text-sm truncate">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeBuktiHadirFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Format gambar: JPG, PNG, GIF (Max 5MB per file)
                  </p>
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