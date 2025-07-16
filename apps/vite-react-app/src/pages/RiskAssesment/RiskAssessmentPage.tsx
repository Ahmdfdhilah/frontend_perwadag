import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '@/hooks/useRole';
import { useURLFilters } from '@/hooks/useURLFilters';
import { useToast } from '@workspace/ui/components/sonner';
import { PenilaianRisikoResponse, PenilaianRisikoFilterParams } from '@/services/penilaianRisiko/types';
import { penilaianRisikoService } from '@/services/penilaianRisiko';
import { userService } from '@/services/users';
import { PerwadagSummary, PerwadagSearchParams } from '@/services/users/types';
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
import { Combobox } from '@workspace/ui/components/combobox';
import { Label } from '@workspace/ui/components/label';
import { PageHeader } from '@/components/common/PageHeader';
import ListHeaderComposite from '@/components/common/ListHeaderComposite';
import PeriodeManagementDialog from '@/components/common/PeriodeManagementDialog';
import RiskAssessmentTable from '@/components/RiskAssesment/RiskAssessmentTable';
import RiskAssessmentCards from '@/components/RiskAssesment/RiskAssessmentCards';
import { Settings } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { getDefaultYearOptions } from '@/utils/yearUtils';

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
  const { toast } = useToast();

  // URL Filters configuration
  const { updateURL, getCurrentFilters } = useURLFilters<RiskAssessmentPageFilters>({
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
  const [availablePerwadag, setAvailablePerwadag] = useState<PerwadagSummary[]>([]);
  const [perwadagSearchValue, setPerwadagSearchValue] = useState('');
  const [isPeriodeDialogOpen, setIsPeriodeDialogOpen] = useState(false);
  const [yearOptions, setYearOptions] = useState<{ value: string; label: string }[]>([{ value: 'all', label: 'Semua Tahun' }]);

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
    } catch (error) {
      console.error('Failed to fetch risk assessments:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat data penilaian risiko. Silakan coba lagi.',
        variant: 'destructive'
      });
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
      fetchRiskAssessments();
      fetchAvailablePerwadag();
      fetchYearOptions();
    }
  }, [filters.page, filters.size, filters.search, filters.inspektorat, filters.user_perwadag_id, filters.tahun, filters.sort_by, hasAccess]);

  // Pagination
  const totalPages = Math.ceil(totalItems / filters.size);

  const handleView = (item: PenilaianRisikoResponse) => {
    navigate(`/penilaian-resiko/${item.id}`);
  };

  const handleEdit = (item: PenilaianRisikoResponse) => {
    navigate(`/penilaian-resiko/${item.id}/edit`);
  };

  const handleDelete = (item: PenilaianRisikoResponse) => {
    console.log('Delete:', item);
    // Implement delete logic
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

  const canEdit = () => {
    if (isAdmin()) return true;
    if (isInspektorat()) {
      // Check if user can edit this assessment based on inspektorat
      return true; // Implement proper logic based on user's inspektorat
    }
    return false;
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
        description="Kelola data penilaian risiko audit"
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
                canEdit={canEdit}
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

      {/* Periode Management Dialog */}
      <PeriodeManagementDialog
        open={isPeriodeDialogOpen}
        onOpenChange={setIsPeriodeDialogOpen}
        onRefresh={fetchRiskAssessments}
      />
    </div>
  );
};

export default RiskAssessmentPage;