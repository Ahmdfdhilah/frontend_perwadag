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
import { PerwadagCombobox } from '@/components/common/PerwadagCombobox';
import { Label } from '@workspace/ui/components/label';
import { MatriksResponse, MatriksFilterParams, TindakLanjutStatus } from '@/services/matriks/types';
import { matriksService } from '@/services/matriks';
import { PageHeader } from '@/components/common/PageHeader';
import ListHeaderComposite from '@/components/common/ListHeaderComposite';
import TindakLanjutMatriksTable from '@/components/TindakLanjutMatriks/TindakLanjutMatriksTable';
import TindakLanjutMatriksCards from '@/components/TindakLanjutMatriks/TindakLanjutMatriksCards';
import TindakLanjutMatriksDialog from '@/components/TindakLanjutMatriks/TindakLanjutMatriksDialog';
import { useYearOptions } from '@/hooks/useYearOptions';

interface TindakLanjutMatriksPageFilters {
  search: string;
  inspektorat: string;
  user_perwadag_id: string;
  tahun_evaluasi: string;
  status_tindak_lanjut: string;
  page: number;
  size: number;
  [key: string]: string | number;
}

const TindakLanjutMatriksPage: React.FC = () => {
  const { isAdmin, isInspektorat, isPimpinan, isPerwadag, user } = useRole();
  const { toast } = useToast();

  // URL Filters configuration
  const { updateURL, getCurrentFilters } = useURLFilters<TindakLanjutMatriksPageFilters>({
    defaults: {
      search: '',
      inspektorat: 'all',
      user_perwadag_id: 'all',
      tahun_evaluasi: 'all',
      status_tindak_lanjut: 'all',
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
  const { yearOptions } = useYearOptions();

  // Calculate access control - all authenticated users can view tindak lanjut matriks
  const hasAccess = true;

  // Fetch tindak lanjut matriks function - only finished matriks with tindak lanjut data
  const fetchTindakLanjutMatriks = async () => {
    setLoading(true);
    try {
      const params: MatriksFilterParams = {
        page: filters.page,
        size: filters.size,
        search: filters.search || undefined,
        inspektorat: filters.inspektorat !== 'all' ? filters.inspektorat : undefined,
        user_perwadag_id: filters.user_perwadag_id !== 'all' ? filters.user_perwadag_id : undefined,
        tahun_evaluasi: filters.tahun_evaluasi !== 'all' ? parseInt(filters.tahun_evaluasi) : undefined,
        status: 'FINISHED', // Only show finished matriks for tindak lanjut
      };

      // Auto-apply role-based filtering
      if ((isInspektorat() || isPimpinan()) && user?.inspektorat && !params.inspektorat) {
        params.inspektorat = user.inspektorat;
      } else if (isPerwadag() && user?.id && !params.user_perwadag_id) {
        params.user_perwadag_id = user.id;
      }

      const response = await matriksService.getMatriksList(params);

      // Filter results to only show matriks with tindak lanjut data
      const matriksWithTindakLanjut = response.items.filter(item =>
        item.temuan_rekomendasi_summary?.data &&
        item.temuan_rekomendasi_summary.data.length > 0
      );

      // Apply additional tindak lanjut status filter if specified
      if (filters.status_tindak_lanjut !== 'all') {
        const filteredMatriks = matriksWithTindakLanjut.filter(item => {
          const hasStatus = item.temuan_rekomendasi_summary?.data?.some(tr =>
            tr.status_tindak_lanjut === filters.status_tindak_lanjut
          );
          return hasStatus;
        });
        setMatriks(filteredMatriks);
        setTotalItems(filteredMatriks.length);
        setTotalPages(Math.ceil(filteredMatriks.length / filters.size));
      } else {
        setMatriks(matriksWithTindakLanjut);
        setTotalItems(matriksWithTindakLanjut.length);
        setTotalPages(Math.ceil(matriksWithTindakLanjut.length / filters.size));
      }
    } catch (error) {
      console.error('Failed to fetch tindak lanjut matriks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (hasAccess) {
      fetchTindakLanjutMatriks();
    }
  }, [filters.page, filters.size, filters.search, filters.inspektorat, filters.user_perwadag_id, filters.tahun_evaluasi, filters.status_tindak_lanjut, hasAccess]);

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

  const handleSave = async () => {
    if (!selectedItem) return;

    try {
      // Refresh data and update selected item
      await fetchTindakLanjutMatriks();

      // Update the selected item with fresh data from backend
      const updatedItem = await matriksService.getMatriksById(selectedItem.id);
      setSelectedItem(updatedItem);
    } catch (error) {
      console.error('Failed to save tindak lanjut:', error);
    }
  };

  const handleTindakLanjutStatusChange = async (newStatus: TindakLanjutStatus) => {
    if (!selectedItem) return;

    try {
      await matriksService.updateTindakLanjutStatus(selectedItem.id, { status_tindak_lanjut: newStatus });

      // Refresh data and update selected item
      await fetchTindakLanjutMatriks();

      // Update the selected item with fresh data from backend
      const updatedItem = await matriksService.getMatriksById(selectedItem.id);
      setSelectedItem(updatedItem);

      const statusLabels = {
        'DRAFTING': 'Draft Tindak Lanjut',
        'CHECKING': 'Review Ketua Tim',
        'VALIDATING': 'Review Pengendali',
        'FINISHED': 'Selesai'
      };

      toast({
        title: 'Status tindak lanjut berhasil diubah',
        description: `Status tindak lanjut telah diubah ke ${statusLabels[newStatus]}.`,
        variant: 'default'
      });
    } catch (error) {
      console.error('Failed to change tindak lanjut status:', error);
      toast({
        title: 'Gagal mengubah status',
        description: 'Terjadi kesalahan saat mengubah status tindak lanjut.',
        variant: 'destructive'
      });
    }
  };

  // Check if user can edit tindak lanjut content
  const canEdit = (item: MatriksResponse) => {
    return item.user_permissions?.can_edit_tindak_lanjut && item.is_editable;
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

  const handleStatusTindakLanjutChange = (status_tindak_lanjut: string) => {
    updateURL({ status_tindak_lanjut, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateURL({ page });
  };

  const handleItemsPerPageChange = (value: string) => {
    updateURL({ size: parseInt(value), page: 1 });
  };

  // Generate composite title
  const getCompositeTitle = () => {
    let title = "Daftar Tindak Lanjut Matriks";
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

    if (filters.status_tindak_lanjut !== 'all') {
      const statusLabels = {
        'DRAFTING': 'Draft Tindak Lanjut',
        'CHECKING': 'Review Ketua Tim',
        'VALIDATING': 'Review Pengendali',
        'FINISHED': 'Selesai'
      };
      activeFilters.push(`Status: ${statusLabels[filters.status_tindak_lanjut as TindakLanjutStatus] || filters.status_tindak_lanjut}`);
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
        title="Tindak Lanjut Matriks"
        description={isPerwadag() ? "Kelola tindak lanjut evaluasi matriks Anda" : "Monitor dan kelola tindak lanjut evaluasi matriks"}
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

        <div className="space-y-2">
          <Label htmlFor="status-tl-filter">Status Tindak Lanjut</Label>
          <Select value={filters.status_tindak_lanjut} onValueChange={handleStatusTindakLanjutChange}>
            <SelectTrigger id="status-tl-filter">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="DRAFTING">Draft Tindak Lanjut</SelectItem>
              <SelectItem value="CHECKING">Review Ketua Tim</SelectItem>
              <SelectItem value="VALIDATING">Review Pengendali</SelectItem>
              <SelectItem value="FINISHED">Selesai</SelectItem>
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
        {(isAdmin() || isInspektorat() || isPimpinan()) && (
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
              subtitle="Kelola data tindak lanjut matriks evaluasi berdasarkan filter yang dipilih"
            />

            <SearchContainer
              searchQuery={filters.search}
              onSearchChange={handleSearchChange}
              placeholder="Cari nama perwadag..."
            />

            {/* Desktop Table */}
            <div className="hidden lg:block">
              <TindakLanjutMatriksTable
                data={matriks}
                loading={loading}
                onEdit={handleEdit}
                onView={handleView}
                canEdit={canEdit}
                currentPage={filters.page}
                itemsPerPage={filters.size}
              />
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
              <TindakLanjutMatriksCards
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
      <TindakLanjutMatriksDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        item={selectedItem}
        onSave={dialogMode === 'edit' ? handleSave : undefined}
        onStatusChange={handleTindakLanjutStatusChange}
        mode={dialogMode}
      />
    </div>
  );
};

export default TindakLanjutMatriksPage;