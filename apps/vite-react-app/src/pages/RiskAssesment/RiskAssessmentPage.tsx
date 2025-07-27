import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '@/hooks/useRole';
import { useFormPermissions } from '@/hooks/useFormPermissions';
import { useURLFilters } from '@/hooks/useURLFilters';
import { PenilaianRisikoResponse, PenilaianRisikoFilterParams } from '@/services/penilaianRisiko/types';
import { penilaianRisikoService } from '@/services/penilaianRisiko';
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
import { PageHeader } from '@/components/common/PageHeader';
import ListHeaderComposite from '@/components/common/ListHeaderComposite';
import PeriodeManagementDialog from '@/components/common/PeriodeManagementDialog';
import RiskAssessmentTable from '@/components/RiskAssesment/RiskAssessmentTable';
import RiskAssessmentCards from '@/components/RiskAssesment/RiskAssessmentCards';
import { Settings } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { useToast } from '@workspace/ui/components/sonner';
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
import { getDefaultYearOptions } from '@/utils/yearUtils';
import { riskAssessmentStateManager } from '@/utils/urlStateUtils';

interface RiskAssessmentPageFilters {
  search: string;
  inspektorat: string;
  user_perwadag_id: string;
  tahun: string;
  sort_by: string;
  page: number;
  size: number;
  [key: string]: string | number;
}

const RiskAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, isInspektorat, isPerwadag, user } = useRole();
  const { hasPageAccess, canEditForm } = useFormPermissions();
  const { toast } = useToast();

  // URL Filters configuration
  const { updateURL, getCurrentFilters, getShareableURL } = useURLFilters<RiskAssessmentPageFilters>({
    defaults: {
      search: '',
      inspektorat: 'all',
      user_perwadag_id: 'all',
      tahun: 'all',
      sort_by: 'skor_tertinggi',
      page: 1,
      size: 10,
    },
    cleanDefaults: true,
  });

  // Get current filters from URL
  const filters = getCurrentFilters();

  const [riskAssessments, setRiskAssessments] = useState<PenilaianRisikoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isPeriodeDialogOpen, setIsPeriodeDialogOpen] = useState(false);
  const [yearOptions, setYearOptions] = useState<{ value: string; label: string }[]>([{ value: 'all', label: 'Semua Tahun' }]);
  const [itemToDelete, setItemToDelete] = useState<PenilaianRisikoResponse | null>(null);

  // Fetch year options function
  const fetchYearOptions = async () => {
    try {
      const options = await getDefaultYearOptions();
      setYearOptions(options);
    } catch (error) {
      console.error('Failed to fetch year options:', error);
    }
  };

  // Calculate access control based on permissions
  const hasAccess = hasPageAccess('risk_assessment');

  // Fetch risk assessments function
  const fetchRiskAssessments = async () => {
    setLoading(true);
    try {
      const params: PenilaianRisikoFilterParams = {
        page: filters.page,
        size: filters.size,
        search: filters.search || undefined,
        inspektorat: filters.inspektorat !== 'all' ? filters.inspektorat : undefined,
        user_perwadag_id: filters.user_perwadag_id !== 'all' ? filters.user_perwadag_id : undefined,
        tahun: filters.tahun !== 'all' ? parseInt(filters.tahun) : undefined,
        sort_by: filters.sort_by as "skor_tertinggi" | "skor_terendah" | "nama" | "created_at",
      };

      // Auto-apply role-based filtering
      if (isInspektorat() && user?.inspektorat && !params.inspektorat) {
        // If inspektorat user and no specific inspektorat filter, apply their inspektorat
        params.inspektorat = user.inspektorat;
      } else if (isPerwadag() && user?.id && !params.user_perwadag_id) {
        // If perwadag user and no specific perwadag filter, apply their user ID
        params.user_perwadag_id = user.id;
      }

      const response = await penilaianRisikoService.getPenilaianRisiko(params);
      setRiskAssessments(response.items);
      setTotalItems(response.total);
      setTotalPages(response.pages);
    } catch (error) {
      console.error('Failed to fetch risk assessments:', error);
    } finally {
      setLoading(false);
    }
  };


  // Check for saved filters and restore them on mount
  useEffect(() => {
    // Only restore if we're on the correct page
    if (location.pathname === '/penilaian-resiko' && riskAssessmentStateManager.hasSaved()) {
      riskAssessmentStateManager.restore(
        (path) => navigate(path, { replace: true }),
        true // Clear after use
      );
    }
  }, [navigate, location.pathname]);

  // Effect to fetch data when filters change
  useEffect(() => {
    if (hasAccess) {
      fetchRiskAssessments();
      fetchYearOptions();
    }
  }, [filters.page, filters.size, filters.search, filters.inspektorat, filters.user_perwadag_id, filters.tahun, filters.sort_by, hasAccess]);

  // Pagination is handled by totalPages state from API response

  const handleView = (item: PenilaianRisikoResponse) => {
    // Save current URL state before navigation
    riskAssessmentStateManager.save(getShareableURL());
    navigate(`/penilaian-resiko/${item.id}`);
  };

  const handleEdit = (item: PenilaianRisikoResponse) => {
    // Save current URL state before navigation
    riskAssessmentStateManager.save(getShareableURL());
    navigate(`/penilaian-resiko/${item.id}/edit`);
  };

  const handleDelete = (item: PenilaianRisikoResponse) => {
    setItemToDelete(item);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      // Create null kriteria_data to "delete" only user inputable data
      const nullKriteriaData = {
        tren_capaian: {
          tahun_pembanding_1: itemToDelete.kriteria_data.tren_capaian.tahun_pembanding_1,
          tahun_pembanding_2: itemToDelete.kriteria_data.tren_capaian.tahun_pembanding_2,
          capaian_tahun_1: null,
          capaian_tahun_2: null,
        },
        realisasi_anggaran: {
          tahun_pembanding: itemToDelete.kriteria_data.realisasi_anggaran.tahun_pembanding,
          realisasi: null,
          pagu: null,
        },
        tren_ekspor: {
          tahun_pembanding: itemToDelete.kriteria_data.tren_ekspor.tahun_pembanding,
          deskripsi: null,
        },
        audit_itjen: {
          tahun_pembanding: itemToDelete.kriteria_data.audit_itjen.tahun_pembanding,
          pilihan: null,
        },
        perjanjian_perdagangan: {
          tahun_pembanding: itemToDelete.kriteria_data.perjanjian_perdagangan.tahun_pembanding,
          pilihan: null,
        },
        peringkat_ekspor: {
          tahun_pembanding: itemToDelete.kriteria_data.peringkat_ekspor.tahun_pembanding,
          deskripsi: null,
        },
        persentase_ik: {
          tahun_pembanding: itemToDelete.kriteria_data.persentase_ik.tahun_pembanding,
          ik_tidak_tercapai: null,
          total_ik: null,
        },
        realisasi_tei: {
          tahun_pembanding: itemToDelete.kriteria_data.realisasi_tei.tahun_pembanding,
          nilai_realisasi: null,
          nilai_potensi: null,
        },
      };

      await penilaianRisikoService.updatePenilaianRisiko(itemToDelete.id, {
        kriteria_data: nullKriteriaData,
        catatan: null,
        auto_calculate: true,
      });

      toast({
        title: 'Berhasil',
        description: `Data penilaian risiko ${itemToDelete.nama_perwadag} berhasil dihapus.`,
        variant: 'default',
      });

      // Refresh the data
      fetchRiskAssessments();
      setItemToDelete(null);
    } catch (error) {
      console.error('Failed to delete risk assessment:', error);
     
    }
  };

  const handleInspektoratChange = (inspektorat: string) => {
    updateURL({ inspektorat, page: 1 });
  };

  const handlePerwadagChange = (user_perwadag_id: string) => {
    updateURL({ user_perwadag_id, page: 1 });
  };

  const handleTahunChange = (tahun: string) => {
    updateURL({ tahun, page: 1 });
  };


  const handleSortByChange = (sort_by: string) => {
    updateURL({ sort_by, page: 1 });
  };

  const handleSearchChange = (search: string) => {
    updateURL({ search, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateURL({ page });
  };

  const handleItemsPerPageChange = (value: string) => {
    updateURL({ size: parseInt(value), page: 1 });
  };

  // Generate composite title
  const getCompositeTitle = () => {
    let title = "Daftar Penilaian Risiko";
    const activeFilters = [];

    if (filters.inspektorat !== 'all') {
      activeFilters.push(`Inspektorat ${filters.inspektorat}`);
    }

    if (filters.tahun !== 'all') {
      activeFilters.push(`Tahun ${filters.tahun}`);
    }

    if (filters.user_perwadag_id !== 'all') {
      activeFilters.push('Perwadag Terpilih');
    }


    if (activeFilters.length > 0) {
      title += " - " + activeFilters.join(" - ");
    }

    return title;
  };

  const canEdit = () => {
    return canEditForm('risk_assessment');
  };

  // Helper function to check if a record can be edited based on periode status
  const canEditRecord = (item: PenilaianRisikoResponse) => {
    if (!canEdit()) return false;
    
    // Check if the periode is locked or status is "tutup"
    if (item.periode_info?.is_locked || item.periode_info?.status === 'tutup') {
      return false;
    }
    
    return true;
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
        title="Penilaian Risiko"
        description="Kelola data penilaian risiko evaluasi"
        actions={
          isAdmin() ? (
            <Button
              variant="default"
              onClick={() => setIsPeriodeDialogOpen(true)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Manajemen Periode
            </Button>
          ) : undefined
        }
      />

      <Filtering>
        <div className="space-y-2">
          <Label htmlFor="tahun-filter">Periode (Tahun)</Label>
          <Select value={filters.tahun} onValueChange={handleTahunChange}>
            <SelectTrigger id="tahun-filter">
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
            />
          </div>
        )}


        <div className="space-y-2">
          <Label htmlFor="sort-filter">Urutkan</Label>
          <Select value={filters.sort_by} onValueChange={handleSortByChange}>
            <SelectTrigger id="sort-filter">
              <SelectValue placeholder="Pilih urutan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="skor_tertinggi">Skor Tertinggi</SelectItem>
              <SelectItem value="skor_terendah">Skor Terendah</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Filtering>

      <Card>
        <CardContent>
          <div className="space-y-4">
            <ListHeaderComposite
              title={getCompositeTitle()}
              subtitle="Kelola data penilaian risiko berdasarkan filter yang dipilih"
            />

            <SearchContainer
              searchQuery={filters.search}
              onSearchChange={handleSearchChange}
              placeholder="Cari nama perwadag..."
            />

            {/* Desktop Table */}
            <div className="hidden lg:block">
              <RiskAssessmentTable
                data={riskAssessments}
                loading={loading}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canEdit={canEditRecord}
              />
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
              <RiskAssessmentCards
                data={riskAssessments}
                loading={loading}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canEdit={canEditRecord}
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

      {/* Periode Management Dialog */}
      <PeriodeManagementDialog
        open={isPeriodeDialogOpen}
        onOpenChange={setIsPeriodeDialogOpen}
        onRefresh={fetchRiskAssessments}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus Isi Input</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data input penilaian risiko{' '}
              <strong>{itemToDelete?.nama_perwadag}</strong> akan dihapus dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RiskAssessmentPage;