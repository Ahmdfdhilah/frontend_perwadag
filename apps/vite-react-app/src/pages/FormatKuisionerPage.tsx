import React, { useState, useEffect } from 'react';
import { useRole } from '@/hooks/useRole';
import { useURLFilters } from '@/hooks/useURLFilters';
import { useToast } from '@workspace/ui/components/sonner';
import Filtering from '@/components/common/Filtering';
import SearchContainer from '@/components/common/SearchContainer';
import Pagination from '@/components/common/Pagination';
import { Card, CardContent } from '@workspace/ui/components/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@workspace/ui/components/select';
import { Label } from '@workspace/ui/components/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@workspace/ui/components/alert-dialog';
import { FormatKuisionerResponse, FormatKuisionerFilterParams } from '@/services/formatKuisioner/types';
import { formatKuisionerService } from '@/services/formatKuisioner';
import { PageHeader } from '@/components/common/PageHeader';
import ListHeaderComposite from '@/components/common/ListHeaderComposite';
import QuestionnaireTable from '@/components/FormatKuisioner/FormatKuisionerTable';
import QuestionnaireCards from '@/components/FormatKuisioner/FormatKuisionerCards';
import QuestionnaireDialog from '@/components/FormatKuisioner/FormatKuisionerDialog';
import { Button } from '@workspace/ui/components/button';
import { Plus } from 'lucide-react';
import { getDefaultYearOptions } from '@/utils/yearUtils';

interface QuestionnaireTemplatePageFilters {
  search: string;
  tahun: string;
  has_file: string;
  page: number;
  size: number;
  [key: string]: string | number;
}

const QuestionnaireTemplatePage: React.FC = () => {
  const { isAdmin, isInspektorat, isPerwadag } = useRole();
  const { toast } = useToast();

  // URL Filters configuration
  const { updateURL, getCurrentFilters } = useURLFilters<QuestionnaireTemplatePageFilters>({
    defaults: {
      search: '',
      tahun: 'all',
      has_file: 'all',
      page: 1,
      size: 10,
    },
    cleanDefaults: true,
  });

  // Get current filters from URL
  const filters = getCurrentFilters();

  const [templates, setTemplates] = useState<FormatKuisionerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FormatKuisionerResponse | null>(null);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit'>('view');
  const [yearOptions, setYearOptions] = useState<{ value: string; label: string }[]>([{ value: 'all', label: 'Semua Tahun' }]);
  
  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<FormatKuisionerResponse | null>(null);

  // Fetch year options function
  const fetchYearOptions = async () => {
    try {
      const options = await getDefaultYearOptions();
      setYearOptions(options);
    } catch (error) {
      console.error('Failed to fetch year options:', error);
    }
  };

  // Calculate access control
  const hasAccess = isAdmin() || isInspektorat() || isPerwadag();

  // Fetch templates function
  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const params: FormatKuisionerFilterParams = {
        page: filters.page,
        size: filters.size,
        search: filters.search || undefined,
        tahun: filters.tahun !== 'all' ? parseInt(filters.tahun) : undefined,
        has_file: filters.has_file !== 'all' ? filters.has_file === 'true' : undefined,
      };

      const response = await formatKuisionerService.getFormatKuisionerList(params);
      setTemplates(response.items);
      setTotalItems(response.total);
      setTotalPages(response.pages);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (hasAccess) {
      fetchTemplates();
      fetchYearOptions();
    }
  }, [filters.page, filters.size, filters.search, filters.tahun, filters.has_file, hasAccess]);

  // Pagination is handled by totalPages state from API response

  const handleView = (item: FormatKuisionerResponse) => {
    setEditingItem(item);
    setDialogMode('view');
    setIsDialogOpen(true);
  };

  const handleEdit = (item: FormatKuisionerResponse) => {
    if (!isAdmin()) return;
    setEditingItem(item);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    if (!isAdmin()) return;
    setEditingItem(null);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleDelete = (item: FormatKuisionerResponse) => {
    if (!isAdmin()) return;
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      await formatKuisionerService.deleteFormatKuisioner(itemToDelete.id);
      fetchTemplates(); // Refresh the list
      toast({
        title: 'Berhasil dihapus',
        description: `Template "${itemToDelete.nama_template}" telah dihapus.`,
        variant: 'default'
      });
    } catch (error) {
      console.error('Failed to delete template:', error);
     
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (editingItem) {
        // Update existing template
        const updateData = {
          nama_template: data.nama_template !== undefined ? data.nama_template : undefined,
          deskripsi: data.deskripsi !== undefined ? data.deskripsi : undefined,
          tahun: data.tahun !== undefined ? data.tahun : undefined,
        };
        await formatKuisionerService.updateFormatKuisioner(editingItem.id, updateData);
        
        // Handle file upload if any
        if (data.file) {
          await formatKuisionerService.uploadFile(editingItem.id, data.file);
        }
        
        toast({
          title: 'Berhasil diperbarui',
          description: `Template "${data.nama_template}" telah diperbarui.`,
          variant: 'default'
        });
      } else {
        // Create new template
        await formatKuisionerService.createFormatKuisioner({
          nama_template: data.nama_template,
          deskripsi: data.deskripsi,
          tahun: data.tahun,
        }, data.file);
        
        toast({
          title: 'Berhasil ditambahkan',
          description: `Template "${data.nama_template}" telah ditambahkan.`,
          variant: 'default'
        });
      }
      
      setIsDialogOpen(false);
      setEditingItem(null);
      fetchTemplates(); // Refresh the list
    } catch (error) {
      console.error('Failed to save template:', error);
    }
  };

  // Filter handlers
  const handleSearchChange = (search: string) => {
    updateURL({ search, page: 1 });
  };

  const handleYearChange = (tahun: string) => {
    updateURL({ tahun, page: 1 });
  };

  const handleHasFileChange = (has_file: string) => {
    updateURL({ has_file, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateURL({ page });
  };

  const handleItemsPerPageChange = (value: string) => {
    updateURL({ size: parseInt(value), page: 1 });
  };

  // Generate composite title
  const getCompositeTitle = () => {
    let title = "Template Kuesioner";
    const activeFilters = [];
    
    if (filters.tahun !== 'all') {
      activeFilters.push(`Tahun ${filters.tahun}`);
    }
    
    if (filters.has_file !== 'all') {
      activeFilters.push(filters.has_file === 'true' ? 'Dengan File' : 'Tanpa File');
    }
    
    if (activeFilters.length > 0) {
      title += " - " + activeFilters.join(" - ");
    }
    
    return title;
  };

  const canEdit = () => {
    return isAdmin();
  };

  const canDelete = () => {
    return isAdmin();
  };

  // Check access after all hooks have been called
  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Akses Ditolak</h2>
          <p className="text-muted-foreground">
            Anda tidak memiliki akses untuk melihat halaman ini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Template Kuesioner"
        description="Template kuesioner yang dapat digunakan untuk evaluasi"
        actions={
          <Button variant="default" onClick={isAdmin() ? handleAdd : undefined}>
            <Plus className='w-4'/>
            Tambah Template
          </Button>
        }
      />

      <Filtering>
        <div className="space-y-2">
          <Label htmlFor="year-filter">Tahun</Label>
          <Select value={filters.tahun} onValueChange={handleYearChange}>
            <SelectTrigger id="year-filter">
              <SelectValue placeholder="Pilih tahun" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="file-filter">Status File</Label>
          <Select value={filters.has_file} onValueChange={handleHasFileChange}>
            <SelectTrigger id="file-filter">
              <SelectValue placeholder="Pilih status file" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="true">Dengan File</SelectItem>
              <SelectItem value="false">Tanpa File</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Filtering>

      <Card>
        <CardContent>
          <div className="space-y-4">
            <ListHeaderComposite
              title={getCompositeTitle()}
              subtitle="Template kuesioner yang dapat digunakan untuk evaluasi"
            />

            <SearchContainer
              searchQuery={filters.search}
              onSearchChange={handleSearchChange}
              placeholder="Cari nama template atau deskripsi..."
            />

            {/* Desktop Table */}
            <div className="hidden lg:block">
              <QuestionnaireTable
                data={templates}
                loading={loading}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canEdit={canEdit}
                canDelete={canDelete}
              />
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
              <QuestionnaireCards
                data={templates}
                loading={loading}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canEdit={canEdit}
                canDelete={canDelete}
              />
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={filters.page}
                totalPages={totalPages}
                itemsPerPage={filters.size}
                totalItems={totalItems}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Dialog */}
      <QuestionnaireDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        item={editingItem}
        mode={dialogMode}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus template "{itemToDelete?.nama_template}"? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default QuestionnaireTemplatePage;