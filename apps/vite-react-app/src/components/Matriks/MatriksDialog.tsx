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
import { Upload, Download, File, X } from 'lucide-react';
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (item && open) {
      setFormData({
        ...item,
      });
    } else {
      setFormData({});
    }
    setSelectedFile(null);
  }, [item, open]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create blob URL for preview
      const fileUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        uploadFile: file.name,
        uploadFileUrl: fileUrl,
      });
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFormData({
      ...formData,
      uploadFile: undefined,
      uploadFileUrl: undefined,
    });
  };

  const handleSave = () => {
    const dataToSave = { ...formData };
    if (selectedFile) {
      // In a real app, you would upload the file to a server here
      dataToSave.uploadFile = selectedFile.name;
      dataToSave.uploadFileUrl = formData.uploadFileUrl;
    }
    onSave(dataToSave);
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
              <Label htmlFor="file-upload">Upload Dokumen Matriks</Label>
              
              {/* Current file display */}
              {formData.uploadFile && !selectedFile && (
                <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                  <div className="flex items-center space-x-2">
                    <File className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formData.uploadFile}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {formData.uploadFileUrl && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(formData.uploadFileUrl, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* New file selection */}
              {selectedFile && (
                <div className="flex items-center justify-between p-3 border rounded-md bg-green-50">
                  <div className="flex items-center space-x-2">
                    <File className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800">{selectedFile.name}</span>
                    <span className="text-xs text-green-600">(Baru)</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* File input */}
              <div className="mt-2">
                <Input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  onChange={handleFileSelect}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Pilih file PDF, DOC, DOCX, XLS, atau XLSX (maksimal 10MB)
                </p>
              </div>

              {/* Upload button alternative */}
              {!formData.uploadFile && !selectedFile && (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Belum ada file yang dipilih
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Pilih File
                  </Button>
                </div>
              )}
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