import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Card, CardContent } from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import {
  FileText,
} from 'lucide-react';
import { FormatKuisionerResponse } from '@/services/formatKuisioner/types';
import { formatKuisionerService } from '@/services/formatKuisioner';
import { useToast } from '@workspace/ui/components/sonner';
import FileUpload from '@/components/common/FileUpload';

interface TemplateKuisionerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TemplateKuisionerDialog: React.FC<TemplateKuisionerDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const [latestTemplate, setLatestTemplate] = useState<FormatKuisionerResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchLatestTemplate = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        page: 1,
        size: 1,
      };

      const response = await formatKuisionerService.getFormatKuisionerList(params);

      if (response.items && response.items.length > 0) {
        // Get the latest template by sorting by created_at
        const sortedTemplates = response.items.sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setLatestTemplate(sortedTemplates[0]);
      } else {
        setLatestTemplate(null);
      }

    } catch (error) {
      console.error('Error fetching latest template:', error);
      setLatestTemplate(null);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch latest template when dialog opens
  useEffect(() => {
    if (open) {
      fetchLatestTemplate();
    }
  }, [open]);


  const handleFileDownload = async (file: { name: string; url?: string; viewUrl?: string }) => {
    if (!latestTemplate?.id) return;

    try {
      const blob = await formatKuisionerService.downloadTemplate(latestTemplate.id);
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


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle className="text-xl font-semibold">
            Template Kuisioner Terbaru
          </DialogTitle>
        </DialogHeader>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            // Loading skeleton
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : latestTemplate ? (
            // Latest template display
            <FileUpload
              label="File Template"
              existingFiles={latestTemplate.has_file ? [{
                name: latestTemplate.file_metadata?.original_filename || latestTemplate.file_metadata?.filename || latestTemplate.nama_template,
                url: latestTemplate.file_urls?.file_url,
                viewUrl: latestTemplate.file_urls?.file_url,
                size: latestTemplate.file_metadata?.size
              }] : []}
              mode="view"
              disabled={true}
              showPreview={true}
              allowRemove={false}
              onFileDownload={handleFileDownload}
            />
          ) : (
            // No template found
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-lg mb-2">Tidak ada template ditemukan</h3>
              <p className="text-muted-foreground">
                Belum ada template kuisioner yang tersedia
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateKuisionerDialog;