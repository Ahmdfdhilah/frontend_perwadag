import React, { useState, useEffect } from 'react';
import { useRole } from '@/hooks/useRole';
import { useFormPermissions } from '@/hooks/useFormPermissions';
import { useURLFilters } from '@/hooks/useURLFilters';
import { useToast } from '@workspace/ui/components/sonner';
import Filtering from '@/components/common/Filtering';
import Pagination from '@/components/common/Pagination';
import { Card, CardContent } from '@workspace/ui/components/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@workspace/ui/components/select';
import { Combobox } from '@workspace/ui/components/combobox';
import { Label } from '@workspace/ui/components/label';
import { SuratPemberitahuanResponse, SuratPemberitahuanFilterParams } from '@/services/suratPemberitahuan/types';
import { suratPemberitahuanService } from '@/services/suratPemberitahuan';
import { userService } from '@/services/users';
import { PerwadagSummary, PerwadagSearchParams } from '@/services/users/types';
import { PageHeader } from '@/components/common/PageHeader';
import ListHeaderComposite from '@/components/common/ListHeaderComposite';
import SearchContainer from '@/components/common/SearchContainer';
import SuratPemberitahuanTable from '@/components/SuratPemberitahuan/SuratPemberitahuanTable';
import SuratPemberitahuanCards from '@/components/SuratPemberitahuan/SuratPemberitahuanCards';
import SuratPemberitahuanDialog from '@/components/SuratPemberitahuan/SuratPemberitahuanDialog';
import { getDefaultYearOptions, findPeriodeByYear } from '@/utils/yearUtils';
import { periodeEvaluasiService } from '@/services/periodeEvaluasi';
import { PeriodeEvaluasi } from '@/services/periodeEvaluasi/types';

interface SuratPemberitahuanPageFilters {
  search: string;
  inspektorat: string;
  user_perwadag_id: string;
  tahun_evaluasi: string;
  page: number;
  size: number;
  [key: string]: string | number;
}

const SuratPemberitahuanPage: React.FC = () => {
  const { isAdmin, isInspektorat, isPerwadag, user } = useRole();
  const { hasPageAccess, canEditForm } = useFormPermissions();
  const { toast } = useToast();

  // URL Filters configuration
  const { updateURL, getCurrentFilters } = useURLFilters<SuratPemberitahuanPageFilters>({
    defaults: {
      search: '',
      inspektorat: 'all',
      user_perwadag_id: 'all',
      tahun_evaluasi: 'all',
      page: 1,
      size: 10,
    },
    cleanDefaults: true,
  });

  // Get current filters from URL
  const filters = getCurrentFilters();

  const [suratPemberitahuan, setSuratPemberitahuan] = useState<SuratPemberitahuanResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SuratPemberitahuanResponse | null>(null);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit'>('view');
  const [availablePerwadag, setAvailablePerwadag] = useState<PerwadagSummary[]>([]);
  const [perwadagSearchValue, setPerwadagSearchValue] = useState('');
  const [yearOptions, setYearOptions] = useState<{ value: string; label: string }[]>([{ value: 'all', label: 'Semua Tahun' }]);
  const [periodeEvaluasi, setPeriodeEvaluasi] = useState<PeriodeEvaluasi[]>([]);

  // Fetch year options function
  const fetchYearOptions = async () => {
    try {
      const options = await getDefaultYearOptions();
      setYearOptions(options);
    } catch (error) {
      console.error('Failed to fetch year options:', error);
    }
  };

  // Fetch periode evaluasi data
  const fetchPeriodeEvaluasi = async () => {
    try {
      const response = await periodeEvaluasiService.getPeriodeEvaluasi({ 
        size: 100 
      });
      setPeriodeEvaluasi(response.items);
    } catch (error) {
      console.error('Failed to fetch periode evaluasi:', error);
    }
  };

  // Calculate access control using useFormPermissions
  const hasAccess = hasPageAccess('surat_pemberitahuan');

  // Fetch surat pemberitahuan function
  const fetchSuratPemberitahuan = async () => {
    setLoading(true);
    try {
      const params: SuratPemberitahuanFilterParams = {
        page: filters.page,
        size: filters.size,
        search: filters.search || undefined,
        inspektorat: filters.inspektorat !== 'all' ? filters.inspektorat : undefined,
        user_perwadag_id: filters.user_perwadag_id !== 'all' ? filters.user_perwadag_id : undefined,
        tahun_evaluasi: filters.tahun_evaluasi !== 'all' ? parseInt(filters.tahun_evaluasi) : undefined,
      };

      // Auto-apply role-based filtering
      if (isInspektorat() && user?.inspektorat && !params.inspektorat) {
        params.inspektorat = user.inspektorat;
      } else if (isPerwadag() && user?.id && !params.user_perwadag_id) {
        params.user_perwadag_id = user.id;
      }

      const response = await suratPemberitahuanService.getSuratPemberitahuanList(params);
      setSuratPemberitahuan(response.items);
      setTotalItems(response.total);
    } catch (error) {
      console.error('Failed to fetch surat pemberitahuan:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available perwadag
  const fetchAvailablePerwadag = async () => {
    try {
      const params: PerwadagSearchParams = {};

      // If current user is inspektorat, filter by their inspektorat
      if (isInspektorat() && user?.inspektorat) {
        params.inspektorat = user.inspektorat;
      }

      const response = await userService.getPerwadagList(params);
      setAvailablePerwadag(response.items || []);
    } catch (error) {
      console.error('Failed to fetch perwadag list:', error);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (hasAccess) {
      fetchSuratPemberitahuan();
      fetchAvailablePerwadag();
      fetchYearOptions();
      fetchPeriodeEvaluasi();
    }
  }, [filters.page, filters.size, filters.search, filters.inspektorat, filters.user_perwadag_id, filters.tahun_evaluasi, hasAccess]);

  // Pagination
  const totalPages = Math.ceil(totalItems / filters.size);

  const handleView = (item: SuratPemberitahuanResponse) => {
    setSelectedItem(item);
    setDialogMode('view');
    setIsDialogOpen(true);
  };

  const handleEdit = (item: SuratPemberitahuanResponse) => {
    setSelectedItem(item);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleSave = async (data: any) => {
    if (!selectedItem) return;

    try {
      const updateData = {
        tanggal_surat_pemberitahuan: data.tanggal_surat_pemberitahuan || undefined,
      };

      await suratPemberitahuanService.updateSuratPemberitahuan(selectedItem.id, updateData);

      // Handle file upload if any
      if (data.files && data.files.length > 0) {
        await suratPemberitahuanService.uploadFile(selectedItem.id, data.files[0]);
      }

      setIsDialogOpen(false);
      setSelectedItem(null);
      fetchSuratPemberitahuan(); // Refresh the list

      toast({
        title: 'Berhasil diperbarui',
        description: `Data surat pemberitahuan ${selectedItem.nama_perwadag} telah diperbarui.`,
        variant: 'default'
      });
    } catch (error) {
      console.error('Failed to save surat pemberitahuan:', error);
      toast({
        title: 'Error',
        description: 'Gagal menyimpan data surat pemberitahuan. Silakan coba lagi.',
        variant: 'destructive'
      });
    }
  };

  // Check if user can edit this item based on role and permissions
  const canEdit = (item: SuratPemberitahuanResponse) => {
    if (!canEditForm('surat_pemberitahuan')) return false;
    
    // Check if the periode is locked or status is "tutup"
    const periode = findPeriodeByYear(periodeEvaluasi, item.tahun_evaluasi);
    if (periode?.is_locked || periode?.status === 'tutup') {
      return false;
    }
    
    if (isAdmin()) return true;
    if (isInspektorat()) {
      // Check if user can edit this surat pemberitahuan based on inspektorat
      return user?.inspektorat === item.inspektorat;
    }
    if (isPerwadag()) {
      // Check if user can edit their own surat pemberitahuan
      return user?.id === item.surat_tugas_info?.nama_perwadag;
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
    let title = "Daftar Surat Pemberitahuan";
    const activeFilters = [];

    if (filters.inspektorat !== 'all') {
      activeFilters.push(`Inspektorat ${filters.inspektorat}`);
    }

    if (filters.tahun_evaluasi !== 'all') {
      activeFilters.push(`Tahun ${filters.tahun_evaluasi}`);
    }

    if (filters.user_perwadag_id !== 'all') {
      const selectedPerwadag = availablePerwadag.find(p => p.id === filters.user_perwadag_id);
      if (selectedPerwadag) {
        activeFilters.push(`Perwadag ${selectedPerwadag.nama}`);
      }
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
        title="Surat Pemberitahuan"
        description="Kelola data surat pemberitahuan evaluasi"
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
                <SelectItem value="1">Inspektorat I</SelectItem>
                <SelectItem value="2">Inspektorat II</SelectItem>
                <SelectItem value="3">Inspektorat III</SelectItem>
                <SelectItem value="4">Inspektorat IV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Show perwadag filter for admin and inspektorat */}
        {(isAdmin() || isInspektorat()) && (
          <div className="space-y-2">
            <Label htmlFor="perwadag-filter">Perwadag</Label>
            <Combobox
              options={[
                { value: 'all', label: 'Semua Perwadag' },
                ...availablePerwadag
                  .filter(perwadag =>
                    perwadagSearchValue === '' ||
                    perwadag.nama.toLowerCase().includes(perwadagSearchValue.toLowerCase()) ||
                    perwadag.inspektorat?.toLowerCase().includes(perwadagSearchValue.toLowerCase())
                  )
                  .map(perwadag => ({
                    value: perwadag.id,
                    label: perwadag.nama,
                    description: perwadag.inspektorat || ''
                  }))
              ]}
              value={filters.user_perwadag_id}
              onChange={(value) => handlePerwadagChange(value.toString())}
              placeholder="Pilih perwadag"
              searchPlaceholder="Cari perwadag..."
              searchValue={perwadagSearchValue}
              onSearchChange={setPerwadagSearchValue}
              emptyMessage="Tidak ada perwadag yang ditemukan"
            />
          </div>
        )}
      </Filtering>

      <Card>
        <CardContent>
          <div className="space-y-4">
            <ListHeaderComposite
              title={getCompositeTitle()}
              subtitle="Kelola data surat pemberitahuan evaluasi berdasarkan filter yang dipilih"
            />

            <SearchContainer
              searchQuery={filters.search}
              onSearchChange={handleSearchChange}
              placeholder="Cari nama perwadag..."
            />

            {/* Desktop Table */}
            <div className="hidden lg:block">
              <SuratPemberitahuanTable
                data={suratPemberitahuan}
                loading={loading}
                onView={handleView}
                onEdit={handleEdit}
                canEdit={canEdit}
              />
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
              <SuratPemberitahuanCards
                data={suratPemberitahuan}
                loading={loading}
                onView={handleView}
                onEdit={handleEdit}
                canEdit={canEdit}
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

      {/* Dialog */}
      <SuratPemberitahuanDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        item={selectedItem}
        onSave={handleSave}
        mode={dialogMode}
      />
    </div>
  );
};

export default SuratPemberitahuanPage;