import React, { useState, useEffect } from 'react';
import { useRole } from '@/hooks/useRole';
import { useFormPermissions } from '@/hooks/useFormPermissions';
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
import { PerwadagCombobox } from '@/components/common/PerwadagCombobox';
import { Label } from '@workspace/ui/components/label';
import { MatriksResponse, MatriksFilterParams } from '@/services/matriks/types';
import { matriksService } from '@/services/matriks';
import { PageHeader } from '@/components/common/PageHeader';
import ListHeaderComposite from '@/components/common/ListHeaderComposite';
import MatriksTable from '@/components/Matriks/MatriksTable';
import MatriksCards from '@/components/Matriks/MatriksCards';
import MatriksDialog from '@/components/Matriks/MatriksDialog';
import { findPeriodeByYear } from '@/utils/yearUtils';
import { useYearOptions } from '@/hooks/useYearOptions';
import { formatIndonesianDateRange } from '@/utils/timeFormat';
import { exportAllMatriksToExcel } from '@/utils/excelExportUtils';
import { Download } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';

interface MatriksPageFilters {
  search: string;
  inspektorat: string;
  user_perwadag_id: string;
  tahun_evaluasi: string;
  has_file: string;
  is_completed: string;
  page: number;
  size: number;
  [key: string]: string | number;
}

const MatriksPage: React.FC = () => {
  const { isAdmin, isInspektorat, isPerwadag, user } = useRole();
  const { hasPageAccess, canEditForm } = useFormPermissions();
  const { toast } = useToast();

  // URL Filters configuration
  const { updateURL, getCurrentFilters } = useURLFilters<MatriksPageFilters>({
    defaults: {
      search: '',
      inspektorat: 'all',
      user_perwadag_id: 'all',
      tahun_evaluasi: 'all',
      has_file: 'all',
      is_completed: 'all',
      page: 1,
      size: 10,
    },
    cleanDefaults: true,
  });

  // Get current filters from URL
  const filters = getCurrentFilters();

  const [matriks, setMatriks] = useState<MatriksResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MatriksResponse | null>(null);
  const [dialogMode, setDialogMode] = useState<'edit' | 'view'>('edit');
  
  // Use optimized year options hook
  const { yearOptions, periodeEvaluasi } = useYearOptions();


  // Calculate access control using useFormPermissions
  const hasAccess = hasPageAccess('matriks');

  // Fetch matriks function
  const fetchMatriks = async () => {
    setLoading(true);
    try {
      const params: MatriksFilterParams = {
        page: filters.page,
        size: filters.size,
        search: filters.search || undefined,
        inspektorat: filters.inspektorat !== 'all' ? filters.inspektorat : undefined,
        user_perwadag_id: filters.user_perwadag_id !== 'all' ? filters.user_perwadag_id : undefined,
        tahun_evaluasi: filters.tahun_evaluasi !== 'all' ? parseInt(filters.tahun_evaluasi) : undefined,
        has_file: filters.has_file !== 'all' ? filters.has_file === 'true' : undefined,
        is_completed: filters.is_completed !== 'all' ? filters.is_completed === 'true' : undefined,
      };

      // Auto-apply role-based filtering
      if (isInspektorat() && user?.inspektorat && !params.inspektorat) {
        params.inspektorat = user.inspektorat;
      } else if (isPerwadag() && user?.id && !params.user_perwadag_id) {
        params.user_perwadag_id = user.id;
      }

      const response = await matriksService.getMatriksList(params);
      setMatriks(response.items);
      setTotalItems(response.total);
      setTotalPages(response.pages);
    } catch (error) {
      console.error('Failed to fetch matriks:', error);
    } finally {
      setLoading(false);
    }
  };


  // Effect to fetch data when filters change
  useEffect(() => {
    if (hasAccess) {
      fetchMatriks();
    }
  }, [filters.page, filters.size, filters.search, filters.inspektorat, filters.user_perwadag_id, filters.tahun_evaluasi, filters.has_file, filters.is_completed, hasAccess]);

  // Pagination - totalPages is now set from API response

  const handleEdit = (item: MatriksResponse) => {
    setSelectedItem(item);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleView = (item: MatriksResponse) => {
    setSelectedItem(item);
    setDialogMode('view');
    setIsDialogOpen(true);
  };


  // Function to fetch all matriks data for export (admin only)
  const fetchAllMatriksForExport = async () => {
    if (!isAdmin()) return [];

    try {
      const params: MatriksFilterParams = {
        // Remove page and size to get all data
        search: filters.search || undefined,
        inspektorat: filters.inspektorat !== 'all' ? filters.inspektorat : undefined,
        user_perwadag_id: filters.user_perwadag_id !== 'all' ? filters.user_perwadag_id : undefined,
        tahun_evaluasi: filters.tahun_evaluasi !== 'all' ? parseInt(filters.tahun_evaluasi) : undefined,
        has_file: filters.has_file !== 'all' ? filters.has_file === 'true' : undefined,
        is_completed: filters.is_completed !== 'all' ? filters.is_completed === 'true' : undefined,
      };

      const response = await matriksService.getMatriksList(params);

      // Sort by tahun_evaluasi (evaluation year) in descending order
      return response.items.sort((a, b) => b.tahun_evaluasi - a.tahun_evaluasi);
    } catch (error) {
      console.error('Failed to fetch all matriks for export:', error);
      return [];
    }
  };

  const handleExportAllExcel = async () => {
    if (!isAdmin()) {
      toast({
        title: 'Akses Ditolak',
        description: 'Hanya admin yang dapat mengunduh semua data matriks.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const allMatriks = await fetchAllMatriksForExport();
      if (allMatriks.length === 0) {
        toast({
          title: 'Tidak Ada Data',
          description: 'Tidak ada data matriks untuk diekspor.',
          variant: 'destructive'
        });
        return;
      }

      await exportAllMatriksToExcel(allMatriks, formatIndonesianDateRange, toast, filters.tahun_evaluasi);
    } catch (error) {
      console.error('Failed to export all matriks:', error);
    }
  };

  const handleSave = async (data: any) => {
    if (!selectedItem) return;

    try {
      const updateData = {
        temuan_rekomendasi: data.temuan_rekomendasi !== undefined ? {
          items: data.temuan_rekomendasi
        } : undefined,
      };

      await matriksService.updateMatriks(selectedItem.id, updateData);

      // Handle file upload if any
      if (data.file) {
        await matriksService.uploadFile(selectedItem.id, data.file);
      }

      setIsDialogOpen(false);
      setSelectedItem(null);
      fetchMatriks(); // Refresh the list

      toast({
        title: 'Berhasil diperbarui',
        description: `Data matriks ${selectedItem.nama_perwadag} telah diperbarui.`,
        variant: 'default'
      });
    } catch (error) {
      console.error('Failed to save matriks:', error);
    }
  };

  // Check if user can edit this item based on role and permissions
  const canEdit = (item: MatriksResponse) => {
    if (!canEditForm('matriks')) return false;

    // Check if the periode is locked or status is "tutup"
    const periode = findPeriodeByYear(periodeEvaluasi, item.tahun_evaluasi);
    if (periode?.is_locked || periode?.status === 'tutup') {
      return false;
    }

    if (isAdmin()) return true;
    if (isInspektorat()) {
      // Check if user can edit this matriks based on inspektorat
      return user?.inspektorat === item.inspektorat;
    }
    return false;
  };
  
  // Filter handlers
  const handleSearchChange = (search: string) => {
    updateURL({ search, page: 1 });
  };

  const handleInspektoratChange = (inspektorat: string) => {
    updateURL({ inspektorat, page: 1 });
  };

  const handlePerwadagChange = (user_perwadag_id: string) => {
    updateURL({ user_perwadag_id, page: 1 });
  };

  const handleTahunEvaluasiChange = (tahun_evaluasi: string) => {
    updateURL({ tahun_evaluasi, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateURL({ page });
  };

  const handleItemsPerPageChange = (value: string) => {
    updateURL({ size: parseInt(value), page: 1 });
  };

  // Generate composite title
  const getCompositeTitle = () => {
    let title = "Daftar Matriks";
    const activeFilters = [];

    if (filters.inspektorat !== 'all') {
      activeFilters.push(`Inspektorat ${filters.inspektorat}`);
    }

    if (filters.tahun_evaluasi !== 'all') {
      activeFilters.push(`Tahun ${filters.tahun_evaluasi}`);
    }

    if (filters.user_perwadag_id !== 'all') {
      activeFilters.push('Perwadag Terpilih');
    }

    if (activeFilters.length > 0) {
      title += " - " + activeFilters.join(" - ");
    }

    return title;
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
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Matriks"
        description={isPerwadag() ? "Lihat kondisi, kriteria dan rekomendasi evaluasi" : "Kelola data matriks evaluasi"}
        actions={
          isAdmin() && (
            <Button onClick={handleExportAllExcel} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Excel
            </Button>
          )
        }
      />

      <Filtering>
        <div className="space-y-2">
          <Label htmlFor="year-filter">Periode (Tahun)</Label>
          <Select value={filters.tahun_evaluasi} onValueChange={handleTahunEvaluasiChange}>
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

        {/* Only show inspektorat filter for admin */}
        {isAdmin() && (
          <div className="space-y-2">
            <Label htmlFor="inspektorat-filter">Inspektorat</Label>
            <Select value={filters.inspektorat} onValueChange={handleInspektoratChange}>
              <SelectTrigger id="inspektorat-filter">
                <SelectValue placeholder="Pilih inspektorat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Inspektorat</SelectItem>
                <SelectItem value="1">Inspektorat 1</SelectItem>
                <SelectItem value="2">Inspektorat 2</SelectItem>
                <SelectItem value="3">Inspektorat 3</SelectItem>
                <SelectItem value="4">Inspektorat 4</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Show perwadag filter for admin and inspektorat */}
        {(isAdmin() || isInspektorat()) && (
          <div className="space-y-2">
            <Label htmlFor="perwadag-filter">Perwadag</Label>
            <PerwadagCombobox
              value={filters.user_perwadag_id}
              onChange={handlePerwadagChange}
              inspektoratFilter={filters.inspektorat}
            />
          </div>
        )}
      </Filtering>

      <Card>
        <CardContent>
          <div className="space-y-4">
            <ListHeaderComposite
              title={getCompositeTitle()}
              subtitle="Kelola data matriks evaluasi berdasarkan filter yang dipilih"
            />

            <SearchContainer
              searchQuery={filters.search}
              onSearchChange={handleSearchChange}
              placeholder="Cari nama perwadag..."
            />

            {/* Desktop Table */}
            <div className="hidden lg:block">
              <MatriksTable
                data={matriks}
                loading={loading}
                onEdit={handleEdit}
                onView={handleView}
                canEdit={canEdit}
                userRole={isAdmin() ? 'admin' : isInspektorat() ? 'inspektorat' : 'perwadag'}
                currentPage={filters.page}
                itemsPerPage={filters.size}
              />
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
              <MatriksCards
                data={matriks}
                loading={loading}
                onEdit={handleEdit}
                onView={handleView}
                canEdit={canEdit}
                userRole={isAdmin() ? 'admin' : isInspektorat() ? 'inspektorat' : 'perwadag'}
                currentPage={filters.page}
                itemsPerPage={filters.size}
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

      {/* Edit/View Dialog */}
      <MatriksDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        item={selectedItem}
        onSave={dialogMode === 'edit' ? handleSave : undefined}
        mode={dialogMode}
      />
    </div>
  );
};

export default MatriksPage;