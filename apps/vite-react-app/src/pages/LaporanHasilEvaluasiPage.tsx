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
import { LaporanHasilResponse, LaporanHasilFilterParams } from '@/services/laporanHasil/types';
import { laporanHasilService } from '@/services/laporanHasil';
import { emailTemplateService } from '@/services/emailTemplate';
import { PageHeader } from '@/components/common/PageHeader';
import ListHeaderComposite from '@/components/common/ListHeaderComposite';
import LaporanHasilEvaluasiTable from '@/components/LaporanHasilEvaluasi/LaporanHasilEvaluasiTable';
import LaporanHasilEvaluasiCards from '@/components/LaporanHasilEvaluasi/LaporanHasilEvaluasiCards';
import LaporanHasilEvaluasiDialog from '@/components/LaporanHasilEvaluasi/LaporanHasilEvaluasiDialog';
import { getDefaultYearOptions, findPeriodeByYear } from '@/utils/yearUtils';
import { periodeEvaluasiService } from '@/services/periodeEvaluasi';
import { PeriodeEvaluasi } from '@/services/periodeEvaluasi/types';

interface LaporanHasilEvaluasiPageFilters {
  search: string;
  inspektorat: string;
  user_perwadag_id: string;
  tahun_evaluasi: string;
  has_file: string;
  has_nomor: string;
  is_completed: string;
  page: number;
  size: number;
  [key: string]: string | number;
}

const LaporanHasilEvaluasiPage: React.FC = () => {
  const { isAdmin, isInspektorat, isPerwadag, user } = useRole();
  const { hasPageAccess, canEditForm } = useFormPermissions();
  const { toast } = useToast();

  // URL Filters configuration
  const { updateURL, getCurrentFilters } = useURLFilters<LaporanHasilEvaluasiPageFilters>({
    defaults: {
      search: '',
      inspektorat: 'all',
      user_perwadag_id: 'all',
      tahun_evaluasi: 'all',
      has_file: 'all',
      has_nomor: 'all',
      is_completed: 'all',
      page: 1,
      size: 10,
    },
    cleanDefaults: true,
  });

  // Get current filters from URL
  const filters = getCurrentFilters();

  const [laporanHasil, setLaporanHasil] = useState<LaporanHasilResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LaporanHasilResponse | null>(null);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit'>('view');
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
  const hasAccess = hasPageAccess('laporan_hasil_evaluasi');

  // Fetch laporan hasil function
  const fetchLaporanHasil = async () => {
    setLoading(true);
    try {
      const params: LaporanHasilFilterParams = {
        page: filters.page,
        size: filters.size,
        search: filters.search || undefined,
        inspektorat: filters.inspektorat !== 'all' ? filters.inspektorat : undefined,
        user_perwadag_id: filters.user_perwadag_id !== 'all' ? filters.user_perwadag_id : undefined,
        tahun_evaluasi: filters.tahun_evaluasi !== 'all' ? parseInt(filters.tahun_evaluasi) : undefined,
        has_file: filters.has_file !== 'all' ? filters.has_file === 'true' : undefined,
        has_nomor: filters.has_nomor !== 'all' ? filters.has_nomor === 'true' : undefined,
        is_completed: filters.is_completed !== 'all' ? filters.is_completed === 'true' : undefined,
      };

      // Auto-apply role-based filtering
      if (isInspektorat() && user?.inspektorat && !params.inspektorat) {
        params.inspektorat = user.inspektorat;
      } else if (isPerwadag() && user?.id && !params.user_perwadag_id) {
        params.user_perwadag_id = user.id;
      }

      const response = await laporanHasilService.getLaporanHasilList(params);
      setLaporanHasil(response.items);
      setTotalItems(response.total);
      setTotalPages(response.pages);
    } catch (error) {
      console.error('Failed to fetch laporan hasil:', error);
    } finally {
      setLoading(false);
    }
  };


  // Effect to fetch data when filters change
  useEffect(() => {
    if (hasAccess) {
      fetchLaporanHasil();
      fetchYearOptions();
      fetchPeriodeEvaluasi();
    }
  }, [filters.page, filters.size, filters.search, filters.inspektorat, filters.user_perwadag_id, filters.tahun_evaluasi, filters.has_file, filters.has_nomor, filters.is_completed, hasAccess]);

  // Pagination is handled by totalPages state from API response

  const handleView = (item: LaporanHasilResponse) => {
    setEditingItem(item);
    setDialogMode('view');
    setIsDialogOpen(true);
  };

  const handleEdit = (item: LaporanHasilResponse) => {
    setEditingItem(item);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleSave = async (data: any) => {
    if (!editingItem) return;

    try {
      const updateData = {
        nomor_laporan: data.nomor_laporan !== undefined ? data.nomor_laporan : undefined,
        tanggal_laporan: data.tanggal_laporan !== undefined ? data.tanggal_laporan : undefined,
      };

      await laporanHasilService.updateLaporanHasil(editingItem.id, updateData);

      // Handle file upload if any
      if (data.files && data.files.length > 0) {
        await laporanHasilService.uploadFile(editingItem.id, data.files[0]);
      }

      setIsDialogOpen(false);
      setEditingItem(null);
      fetchLaporanHasil(); // Refresh the list

      toast({
        title: 'Berhasil diperbarui',
        description: `Data laporan hasil evaluasi ${editingItem.nama_perwadag} telah diperbarui.`,
        variant: 'default'
      });
    } catch (error) {
      console.error('Failed to save laporan hasil:', error);
    }
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
    let title = "Daftar Laporan Hasil Evaluasi";
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

    if (filters.is_completed !== 'all') {
      activeFilters.push(filters.is_completed === 'true' ? 'Lengkap' : 'Belum Lengkap');
    }

    if (activeFilters.length > 0) {
      title += " - " + activeFilters.join(" - ");
    }

    return title;
  };

  const canEdit = (item: LaporanHasilResponse) => {
    if (!canEditForm('laporan_hasil_evaluasi')) return false;
    
    // Check if the periode is locked or status is "tutup"
    const periode = findPeriodeByYear(periodeEvaluasi, item.tahun_evaluasi);
    if (periode?.is_locked || periode?.status === 'tutup') {
      return false;
    }
    
    if (isAdmin()) return true;
    if (isInspektorat()) {
      // Check if user can edit this laporan based on inspektorat
      return user?.inspektorat === item.inspektorat;
    }
    if (isPerwadag()) {
      // Check if user can edit their own laporan
      return user?.id === item.surat_tugas_info?.nama_perwadag;
    }
    return false;
  };

  // Function to compose email using template API
  const handleComposeEmail = async (item: LaporanHasilResponse) => {
    try {
      // Use template API to compose email
      const composedEmail = await emailTemplateService.composeEmailForLaporanHasil(item.id);
      
      // Open Gmail with composed content
      window.open(composedEmail.gmail_url, '_blank');

      // Show success toast
      toast({
        title: 'Email Client Dibuka',
        description: `Email untuk laporan ${item.nama_perwadag} telah dibuka di Gmail menggunakan template aktif. ${item.has_file ? 'Silakan lampirkan file dokumen secara manual.' : 'Perhatian: File dokumen belum tersedia.'}`,
        variant: 'default'
      });

    } catch (error) {
      console.error('Failed to compose email:', error);
    }
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
        title="Laporan Hasil Evaluasi"
        description="Kelola data laporan hasil evaluasi audit"
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
              subtitle="Kelola data laporan hasil evaluasi berdasarkan filter yang dipilih"
            />

            <SearchContainer
              searchQuery={filters.search}
              onSearchChange={handleSearchChange}
              placeholder="Cari nama perwadag, nomor laporan..."
            />

            {/* Desktop Table */}
            <div className="hidden lg:block">
              <LaporanHasilEvaluasiTable
                data={laporanHasil}
                loading={loading}
                onView={handleView}
                onEdit={handleEdit}
                onComposeEmail={handleComposeEmail}
                canEdit={canEdit}
                currentPage={filters.page}
                itemsPerPage={filters.size}
              />
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
              <LaporanHasilEvaluasiCards
                data={laporanHasil}
                loading={loading}
                onView={handleView}
                onEdit={handleEdit}
                onComposeEmail={handleComposeEmail}
                canEdit={canEdit}
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

      {/* Dialog */}
      <LaporanHasilEvaluasiDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        item={editingItem}
        mode={dialogMode}
        onSave={handleSave}
      />
    </div>
  );
};

export default LaporanHasilEvaluasiPage;