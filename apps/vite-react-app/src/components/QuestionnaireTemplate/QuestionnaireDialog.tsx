import React, { useState, useEffect } from 'react';
import { useRole } from '@/hooks/useRole';
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
import { QuestionnaireTemplate } from '@/mocks/questionnaireTemplate';
import { Upload, X, Download } from 'lucide-react';

interface QuestionnaireDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: QuestionnaireTemplate | null;
  mode: 'view' | 'edit';
  onSave: (data: Partial<QuestionnaireTemplate>) => void;
}

const QuestionnaireDialog: React.FC<QuestionnaireDialogProps> = ({
  open,
  onOpenChange,
  item,
  mode,
  onSave,
}) => {
  const { isAdmin } = useRole();
  const [formData, setFormData] = useState<Partial<QuestionnaireTemplate>>({});
  const [dokumenFile, setDokumenFile] = useState<File | null>(null);
  const dokumenRef = React.useRef<HTMLInputElement>(null);
  
  const isCreating = !item;
  const isEditable = mode === 'edit' && isAdmin();

  useEffect(() => {
    if (item && open) {
      setFormData({
        ...item,
      });
      setDokumenFile(null);
    } else {
      // Initialize empty form for new template
      setFormData({
        no: 0,
        nama: '',
        deskripsi: '',
        tahun: new Date().getFullYear(),
        dokumen: '',
      });
      setDokumenFile(null);
    }
  }, [item, open]);

  const handleSave = () => {
    // Admin-only validation for creating/editing template
    if (!isAdmin()) {
      alert('Hanya admin yang dapat mengelola template kuesioner');
      return;
    }

    // Validation for required fields
    if (!formData.nama) {
      alert('Nama template harus diisi');
      return;
    }
    if (!formData.deskripsi) {
      alert('Deskripsi template harus diisi');
      return;
    }
    if (!formData.tahun) {
      alert('Tahun harus diisi');
      return;
    }
    if (!formData.no || formData.no <= 0) {
      alert('Nomor harus diisi dan lebih dari 0');
      return;
    }

    const dataToSave = {
      ...formData,
      dokumenFile,
    };
    onSave(dataToSave);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleDokumenFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDokumenFile(file);
    }
  };

  const removeDokumenFile = () => {
    setDokumenFile(null);
    if (dokumenRef.current) {
      dokumenRef.current.value = '';
    }
  };

  const handleDownloadTemplate = () => {
    if (formData.dokumen) {
      console.log('Download template:', formData.dokumen);
      // Implement download logic here
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle>
            {mode === 'view' ? 'Lihat Template Kuesioner' : isCreating ? 'Tambah Template Kuesioner' : 'Edit Template Kuesioner'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="no">No</Label>
              <Input
                id="no"
                type="number"
                value={formData.no || ''}
                onChange={(e) => setFormData({ ...formData, no: parseInt(e.target.value) || 0 })}
                disabled={!isEditable}
                className={!isEditable ? "bg-muted" : ""}
                placeholder="Nomor urut template"
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nama">Nama Template</Label>
              <Input
                id="nama"
                value={formData.nama || ''}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                disabled={!isEditable}
                className={!isEditable ? "bg-muted" : ""}
                placeholder="Nama template kuesioner"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi Template</Label>
              <Textarea
                id="deskripsi"
                value={formData.deskripsi || ''}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                disabled={!isEditable}
                className={!isEditable ? "bg-muted" : ""}
                placeholder="Deskripsi template kuesioner"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tahun">Tahun</Label>
              <Input
                id="tahun"
                type="number"
                value={formData.tahun || ''}
                onChange={(e) => setFormData({ ...formData, tahun: parseInt(e.target.value) || new Date().getFullYear() })}
                disabled={!isEditable}
                className={!isEditable ? "bg-muted" : ""}
                placeholder="Tahun"
                min="2000"
                max="2099"
              />
            </div>

            <div className="space-y-2">
              <Label>Upload Dokumen Template</Label>
              {isEditable ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => dokumenRef.current?.click()}
                      className="w-full justify-start"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {dokumenFile ? dokumenFile.name : 'Pilih file dokumen template'}
                    </Button>
                    {dokumenFile && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeDokumenFile}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <input
                    ref={dokumenRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleDokumenFileChange}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground">
                    Format yang didukung: PDF, DOC, DOCX (Max 10MB)
                  </p>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="p-3 bg-muted rounded-md flex-1">
                    {item?.dokumen ? `File: ${item.dokumen}` : 'Belum ada file template'}
                  </div>
                  {item?.dokumen && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadTemplate}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
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
          {mode === 'view' && formData.dokumen && (
            <Button onClick={handleDownloadTemplate}>
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>
          )}
          {mode === 'edit' && isAdmin() && (
            <Button onClick={handleSave}>
              Simpan
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionnaireDialog;