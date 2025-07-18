import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Card, CardContent } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { 
  Search, 
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';

interface TemplateKuisionerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TemplateKuisionerDialog: React.FC<TemplateKuisionerDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [templates, setTemplates] = useState<FormatKuisioner[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchTemplates = useCallback(async (pageNum: number = 1, isLoadMore: boolean = false) => {
    try {
      if (!isLoadMore) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const params = {
        page: pageNum,
        size: 10,
        search: debouncedSearch || undefined,
        tahun: selectedYear !== 'all' ? parseInt(selectedYear) : undefined,
      };
      
      const response = await formatKuisionerService.getFormatKuisionerList(params);
      
      if (isLoadMore) {
        setTemplates(prev => [...prev, ...response.items]);
      } else {
        setTemplates(response.items);
      }
      
      setHasMore(response.page < response.total);
      setTotal(response.total);
      setPage(pageNum);
      
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat template kuisioner. Silakan coba lagi.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [debouncedSearch, selectedYear]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchTemplates(page + 1, true);
    }
  };

  // Reset when dialog opens
  useEffect(() => {
    if (open) {
      setSearch('');
      setSelectedYear('all');
      setTemplates([]);
      setPage(1);
      setHasMore(true);
      fetchTemplates(1, false);
    }
  }, [open]);

  // Trigger search when debounced search or year changes
  useEffect(() => {
    if (open) {
      setPage(1);
      fetchTemplates(1, false);
    }
  }, [debouncedSearch, selectedYear, fetchTemplates]);

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

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 5; i--) {
      years.push(i);
    }
    return years;
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
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle className="text-xl font-semibold">
            Daftar Template Kuisioner
          </DialogTitle>
        </DialogHeader>

        {/* Search and Filter Section */}
        <div className="flex-shrink-0 py-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari template kuisioner..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Year Filter */}
            <div className="w-full sm:w-48">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tahun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tahun</SelectItem>
                  {generateYearOptions().map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results count */}
          <div className="text-sm text-muted-foreground">
            {loading && templates.length === 0 ? (
              'Memuat template...'
            ) : (
              `Menampilkan ${templates.length} dari ${total} template kuisioner`
            )}
          </div>
        </div>

        {/* Content Area with Scroll */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            {/* Templates List */}
            {templates.length > 0 ? (
              templates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                          <h3 className="font-medium text-sm sm:text-base truncate">
                            {template.nama_template}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {template.tahun}
                          </Badge>
                        </div>
                        
                        {template.deskripsi && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {template.deskripsi}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Dibuat {formatDate(template.created_at)}</span>
                          </div>
                          {template.updated_at && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Diperbarui {formatDate(template.updated_at)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewTemplate(template)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          <span className="hidden sm:inline">Lihat</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadTemplate(template)}
                          className="flex items-center gap-1"
                        >
                          <Download className="h-3 w-3" />
                          <span className="hidden sm:inline">Download</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : loading && templates.length === 0 ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
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
              ))
            ) : (
              // No results
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-lg mb-2">Tidak ada template ditemukan</h3>
                <p className="text-muted-foreground">
                  {search || selectedYear !== 'all' 
                    ? 'Coba ubah kata kunci pencarian atau filter tahun'
                    : 'Belum ada template kuisioner yang tersedia'
                  }
                </p>
              </div>
            )}

            {/* Load More Button */}
            {hasMore && templates.length > 0 && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="flex items-center gap-2"
                >
                  {loadingMore ? 'Memuat...' : 'Muat Lebih Banyak'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateKuisionerDialog;