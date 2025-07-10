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
import { Download } from 'lucide-react';
import FileUpload from '@/components/common/FileUpload';

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
  const [dokumenFiles, setDokumenFiles] = useState<File[]>([]);
  const [existingDokumen, setExistingDokumen] = useState<Array<{ name: string; url?: string }>>([]);
  
  const isCreating = !item;
  const isEditable = mode === 'edit' && isAdmin();

  useEffect(() => {
    if (item && open) {
      setFormData({
        ...item,
      });
      
      // Set existing files for display
      setExistingDokumen(item.dokumen ? [{ name: item.dokumen, url: item.dokumen }] : []);
    } else {
      // Initialize empty form for new template
      setFormData({
        no: 0,
        nama: '',
        deskripsi: '',
        tahun: new Date().getFullYear(),
        dokumen: '',
      });
      setDokumenFiles([]);
      setExistingDokumen([]);
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
      dokumenFiles,
    };
    onSave(dataToSave);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleDokumenFilesChange = (files: File[]) => {
    setDokumenFiles(files);
  };

  const handleExistingDokumenRemove = (index: number) => {
    setExistingDokumen(prev => prev.filter((_, i) => i !== index));
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

            <FileUpload
              label="Upload Dokumen Template"
              accept=".pdf,.doc,.docx"
              multiple={false}
              maxSize={10 * 1024 * 1024} // 10MB
              maxFiles={1}
              files={dokumenFiles}
              existingFiles={existingDokumen}
              mode={isEditable ? 'edit' : 'view'}
              disabled={!isEditable}
              onFilesChange={handleDokumenFilesChange}
              onExistingFileRemove={handleExistingDokumenRemove}
              description="Format yang didukung: PDF, DOC, DOCX (Max 10MB)"
            />
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