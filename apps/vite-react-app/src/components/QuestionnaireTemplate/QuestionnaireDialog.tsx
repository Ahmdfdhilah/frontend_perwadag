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
import { FormatKuisionerResponse } from '@/services/formatKuisioner/types';
import { Download } from 'lucide-react';
import FileUpload from '@/components/common/FileUpload';

interface QuestionnaireFormData {
  nama_template: string;
  deskripsi: string;
  tahun: number;
  file?: File;
}

interface QuestionnaireDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: FormatKuisionerResponse | null;
  mode: 'view' | 'edit';
  onSave: (data: QuestionnaireFormData) => void;
}

const QuestionnaireDialog: React.FC<QuestionnaireDialogProps> = ({
  open,
  onOpenChange,
  item,
  mode,
  onSave,
}) => {
  const { isAdmin } = useRole();
  const [formData, setFormData] = useState<QuestionnaireFormData>({
    nama_template: '',
    deskripsi: '',
    tahun: new Date().getFullYear(),
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const isCreating = !item;
  const isEditable = mode === 'edit' && isAdmin();

  useEffect(() => {
    if (item && open) {
      setFormData({
        nama_template: item.nama_template,
        deskripsi: item.deskripsi || '',
        tahun: item.tahun,
      });
    } else {
      // Initialize empty form for new template
      setFormData({
        nama_template: '',
        deskripsi: '',
        tahun: new Date().getFullYear(),
      });
      setUploadFile(null);
    }
  }, [item, open]);

  const handleSave = () => {
    // Admin-only validation for creating/editing template
    if (!isAdmin()) {
      alert('Hanya admin yang dapat mengelola template kuesioner');
      return;
    }

    // Validation for required fields
    if (!formData.nama_template) {
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

    const dataToSave = {
      ...formData,
      file: uploadFile || undefined,
    };
    onSave(dataToSave);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleUploadFileChange = (files: File[]) => {
    setUploadFile(files[0] || null);
  };

  const handleDownloadTemplate = () => {
    if (item?.file_urls?.download_url) {
      const link = document.createElement('a');
      link.href = item.file_urls.download_url;
      link.download = item.file_metadata?.original_filename || `template_${item.nama_template}.pdf`;
      link.click();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle>
            {mode === 'view' ? 'Lihat Template Kuesioner' : isCreating ? 'Tambah Template Kuesioner' : 'Edit Template Kuesioner'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nama_template">Nama Template</Label>
              <Input
                id="nama_template"
                value={formData.nama_template || ''}
                onChange={(e) => setFormData({ ...formData, nama_template: e.target.value })}
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

            <FileUpload
              label="Upload Dokumen Template"
              accept=".pdf,.doc,.docx"
              multiple={false}
              maxSize={10 * 1024 * 1024} // 10MB
              maxFiles={1}
              files={uploadFile ? [uploadFile] : []}
              existingFiles={item?.has_file ? [{
                name: item.file_metadata?.original_filename || item.nama_template,
                url: item.file_urls?.file_url,
                size: item.file_metadata?.size_mb ? Math.round(item.file_metadata.size_mb * 1024 * 1024) : undefined
              }] : []}
              mode={isEditable ? 'edit' : 'view'}
              disabled={!isEditable}
              onFilesChange={handleUploadFileChange}
              description="Format yang didukung: PDF, DOC, DOCX (Max 10MB)"
            />
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button variant="outline" onClick={handleCancel}>
            {mode === 'view' ? 'Tutup' : 'Batal'}
          </Button>
          {mode === 'view' && item?.has_file && (
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