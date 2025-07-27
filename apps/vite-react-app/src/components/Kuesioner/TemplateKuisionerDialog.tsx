import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Separator } from '@workspace/ui/components/separator';
import {
  FileText,
  Info,
} from 'lucide-react';
import { FormatKuisionerResponse } from '@/services/formatKuisioner/types';
import { formatKuisionerService } from '@/services/formatKuisioner';
import FileUpload from '@/components/common/FileUpload';

interface TemplateKuisionerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TemplateKuisionerDialog: React.FC<TemplateKuisionerDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [activeTemplate, setActiveTemplate] = useState<FormatKuisionerResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchActiveTemplate = useCallback(async () => {
    try {
      setLoading(true);
      const response = await formatKuisionerService.getActiveTemplate();
      setActiveTemplate(response);
    } catch (error) {
      console.error('Error fetching active template:', error);
      setActiveTemplate(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch active template when dialog opens
  useEffect(() => {
    if (open) {
      fetchActiveTemplate();
    }
  }, [open, fetchActiveTemplate]);


  const handleFileDownload = async (file: { name: string; url?: string; viewUrl?: string }) => {
    if (!activeTemplate?.id) return;

    try {
      const blob = await formatKuisionerService.downloadTemplate(activeTemplate.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (sizeInBytes: number) => {
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle className="text-xl font-semibold">
            Template Kuisioner Aktif
          </DialogTitle>
        </DialogHeader>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {loading ? (
            // Loading skeleton
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            </div>
          ) : activeTemplate ? (
            <div className="space-y-6">
              {/* Template Context Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Informasi Template
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Template Name and Description */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{activeTemplate.nama_template}</h3>
                    {activeTemplate.deskripsi && (
                      <p className="text-muted-foreground mb-3">{activeTemplate.deskripsi}</p>
                    )}
                  </div>

                  {/* File Metadata */}
                  {activeTemplate.has_file && activeTemplate.file_metadata && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-medium mb-2">Detail File</h4>
                        <div className="flex flex-col gap-3 text-sm">
                          <div>
                            <span className="font-medium">Nama File: </span>
                            <span className="text-muted-foreground">
                              {activeTemplate.file_metadata.original_filename || activeTemplate.file_metadata.filename}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Ukuran: </span>
                            <span className="text-muted-foreground">
                              {formatFileSize(activeTemplate.file_metadata.size)}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Tipe: </span>
                            <span className="text-muted-foreground">
                              {activeTemplate.file_metadata.content_type}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Diunggah: </span>
                            <span className="text-muted-foreground">
                              {formatDate(activeTemplate.file_metadata.uploaded_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* File Download Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Template File
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUpload
                    label="File Template"
                    existingFiles={activeTemplate.has_file ? [{
                      name: activeTemplate.file_metadata?.original_filename || activeTemplate.file_metadata?.filename || activeTemplate.nama_template,
                      url: activeTemplate.file_urls?.file_url,
                      viewUrl: activeTemplate.file_urls?.file_url,
                      size: activeTemplate.file_metadata?.size
                    }] : []}
                    mode="view"
                    disabled={true}
                    showPreview={true}
                    allowRemove={false}
                    onFileDownload={handleFileDownload}
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            // No active template found
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-lg mb-2">Tidak ada template aktif</h3>
              <p className="text-muted-foreground">
                Belum ada template kuisioner yang diaktifkan
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateKuisionerDialog;