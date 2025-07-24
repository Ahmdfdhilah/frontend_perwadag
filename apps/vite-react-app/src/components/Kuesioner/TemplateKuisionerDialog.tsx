import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { 
  FileText, 
  Calendar, 
  Eye,
  Download
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { FormatKuisioner } from '@/services/formatKuisioner/types';
import { formatKuisionerService } from '@/services/formatKuisioner';
import { useToast } from '@workspace/ui/components/sonner';

interface TemplateKuisionerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TemplateKuisionerDialog: React.FC<TemplateKuisionerDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const [latestTemplate, setLatestTemplate] = useState<FormatKuisioner | null>(null);
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

  const handleViewTemplate = (template: FormatKuisioner) => {
    if (template.link_template) {
      window.open(template.link_template, '_blank');
    }
  };

  const handleDownloadTemplate = (template: FormatKuisioner) => {
    if (template.link_template) {
      const link = document.createElement('a');
      link.href = template.link_template;
      link.download = `${template.nama_template}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };


  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: id });
    } catch {
      return dateString;
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
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                      <h3 className="font-medium text-sm sm:text-base truncate">
                        {latestTemplate.nama_template}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {latestTemplate.tahun}
                      </Badge>
                    </div>
                    
                    {latestTemplate.deskripsi && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {latestTemplate.deskripsi}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Dibuat {formatDate(latestTemplate.created_at)}</span>
                      </div>
                      {latestTemplate.updated_at && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Diperbarui {formatDate(latestTemplate.updated_at)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewTemplate(latestTemplate)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      <span className="hidden sm:inline">Lihat</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadTemplate(latestTemplate)}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      <span className="hidden sm:inline">Download</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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