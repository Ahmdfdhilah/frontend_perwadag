import React, { useState, useEffect } from 'react';
import { useRole } from '@/hooks/useRole';
import { useFormPermissions } from '@/hooks/useFormPermissions';
import { useURLFilters } from '@/hooks/useURLFilters';
import { useToast } from '@workspace/ui/components/sonner';
import { SuratTugasResponse, SuratTugasFilterParams } from '@/services/suratTugas/types';
import { suratTugasService } from '@/services/suratTugas';
import Filtering from '@/components/common/Filtering';
import SearchContainer from '@/components/common/SearchContainer';
import Pagination from '@/components/common/Pagination';
import { Card, CardContent } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@workspace/ui/components/select';
import { PerwadagCombobox } from '@/components/common/PerwadagCombobox';
import { Label } from '@workspace/ui/components/label';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import ListHeaderComposite from '@/components/common/ListHeaderComposite';
import SuratTugasTable from '@/components/SuratTugas/SuratTugasTable';
import SuratTugasCards from '@/components/SuratTugas/SuratTugasCards';
import SuratTugasDialog from '@/components/SuratTugas/SuratTugasDialog';
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
import { findPeriodeByYear } from '@/utils/yearUtils';
import { useYearOptions } from '@/hooks/useYearOptions';

interface SuratTugasPageFilters {
  search: string;
  inspektorat: string;
  user_perwadag_id: string;
  tahun_evaluasi: string;
  page: number;
  size: number;
  [key: string]: string | number;
}

const SuratTugasPage: React.FC = () => {
  const { isAdmin, isInspektorat, isPerwadag, user } = useRole();
  const { hasPageAccess, canEditForm, canCreateForm, canDeleteForm } = useFormPermissions();
  const { toast } = useToast();

  // URL Filters configuration
  const { updateURL, getCurrentFilters } = useURLFilters<SuratTugasPageFilters>({
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

  const [suratTugasList, setSuratTugasList] = useState<SuratTugasResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SuratTugasResponse | null>(null);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'create'>('view');
  const [itemToDelete, setItemToDelete] = useState<SuratTugasResponse | null>(null);
  // Use optimized year options hook
  const { yearOptions, periodeEvaluasi } = useYearOptions();

  // Calculate access control based on permissions
  const hasAccess = hasPageAccess('surat_tugas');
  const canCreateEdit = canCreateForm('surat_tugas') || canEditForm('surat_tugas');
  const canEdit = canEditForm('surat_tugas');
  const canDelete = canDeleteForm('surat_tugas');

  // Check if individual item can be edited based on periode status
  const canEditItem = (item: SuratTugasResponse) => {
    if (!canEdit) {
      console.log('SuratTugas canEditItem: No edit permission');
      return false;
    }

    // Check if the periode is locked or status is "tutup"
    if (item.tahun_evaluasi) {
      const periode = findPeriodeByYear(periodeEvaluasi, item.tahun_evaluasi);
      console.log('SuratTugas canEditItem check:', {
        itemId: item.id,
        tahunEvaluasi: item.tahun_evaluasi,
        periode: periode,
        isLocked: periode?.is_locked,
        status: periode?.status
      });

      if (periode?.is_locked || periode?.status === 'tutup') {
        console.log('SuratTugas canEditItem: DISABLED - periode locked or tutup');
        return false;
      }
    }

    console.log('SuratTugas canEditItem: ENABLED');
    return true;
  };

  // Check if individual item can be deleted based on periode status
  const canDeleteItem = (item: SuratTugasResponse) => {
    if (!canDelete) {
      console.log('SuratTugas canDeleteItem: No delete permission');
      return false;
    }

    // Check if the periode is locked or status is "tutup"
    if (item.tahun_evaluasi) {
      const periode = findPeriodeByYear(periodeEvaluasi, item.tahun_evaluasi);
      console.log('SuratTugas canDeleteItem check:', {
        itemId: item.id,
        tahunEvaluasi: item.tahun_evaluasi,
        periode: periode,
        isLocked: periode?.is_locked,
        status: periode?.status
      });

      if (periode?.is_locked || periode?.status === 'tutup') {
        console.log('SuratTugas canDeleteItem: DISABLED - periode locked or tutup');
        return false;
      }
    }

    console.log('SuratTugas canDeleteItem: ENABLED');
    return true;
  };

  // Fetch surat tugas list function
  const fetchSuratTugasList = async () => {
    setLoading(true);
    try {
      const params: SuratTugasFilterParams = {
        page: filters.page,
        size: filters.size,
        search: filters.search || undefined,
        inspektorat: filters.inspektorat !== 'all' ? filters.inspektorat : undefined,
        user_perwadag_id: filters.user_perwadag_id !== 'all' ? filters.user_perwadag_id : undefined,
        tahun_evaluasi: filters.tahun_evaluasi !== 'all' ? parseInt(filters.tahun_evaluasi) : undefined,
      };

      // Auto-apply role-based filtering
      if (isInspektorat() && user?.inspektorat && !params.inspektorat) {
        // If inspektorat user and no specific inspektorat filter, apply their inspektorat
        params.inspektorat = user.inspektorat;
      } else if (isPerwadag() && user?.id && !params.user_perwadag_id) {
        // If perwadag user and no specific perwadag filter, apply their user ID
        params.user_perwadag_id = user.id;
      }

      const response = await suratTugasService.getSuratTugasList(params);
      setSuratTugasList(response.items);
      setTotalItems(response.total);
      setTotalPages(response.pages);
    } catch (error) {
      console.error('Failed to fetch surat tugas:', error);
    } finally {
      setLoading(false);
    }
  };


  // Effect to fetch data when filters change
  useEffect(() => {
    if (hasAccess) {
      fetchSuratTugasList();
    }
  }, [filters.page, filters.size, filters.search, filters.inspektorat, filters.user_perwadag_id, filters.evaluation_status, filters.is_evaluation_active, filters.tahun_evaluasi, hasAccess]);

  // Pagination is handled by totalPages state from API response

  const handleView = (item: SuratTugasResponse) => {
    setSelectedItem(item);
    setDialogMode('view');
    setIsDialogOpen(true);
  };

  const handleEdit = (item: SuratTugasResponse) => {
    setSelectedItem(item);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleDelete = (item: SuratTugasResponse) => {
    setItemToDelete(item);
  };

  const confirmDeleteSuratTugas = async () => {
    if (itemToDelete) {
      try {
        await suratTugasService.deleteSuratTugas(itemToDelete.id);
        setItemToDelete(null);
        fetchSuratTugasList(); // Refresh the list
        toast({
          title: 'Berhasil dihapus',
          description: `Surat tugas ${itemToDelete.no_surat} telah dihapus.`,
          variant: 'default'
        });
      } catch (error) {
        console.error('Failed to delete surat tugas:', error);
      }
    }
  };

  const handleCreate = () => {
    setSelectedItem(null);
    setDialogMode('create');
    setIsDialogOpen(true);
  };

  const handleSave = async (data: any) => {
    try {
      if (selectedItem && dialogMode === 'edit') {
        // Update existing surat tugas
        const updateData = {
          tanggal_evaluasi_mulai: data.tanggal_evaluasi_mulai !== undefined ? data.tanggal_evaluasi_mulai : undefined,
          tanggal_evaluasi_selesai: data.tanggal_evaluasi_selesai !== undefined ? data.tanggal_evaluasi_selesai : undefined,
          no_surat: data.no_surat !== undefined ? data.no_surat : undefined,
        };

        await suratTugasService.updateSuratTugas(selectedItem.id, updateData);

        // Handle file upload if any
        if (data.file) {
          await suratTugasService.uploadFile(selectedItem.id, data.file);
        }

        toast({
          title: 'Berhasil diperbarui',
          description: `Surat tugas ${data.no_surat} telah diperbarui.`,
          variant: 'default'
        });
      } else if (dialogMode === 'create') {
        // Create new surat tugas
        const createData = {
          user_perwadag_id: data.user_perwadag_id,
          tanggal_evaluasi_mulai: data.tanggal_evaluasi_mulai,
          tanggal_evaluasi_selesai: data.tanggal_evaluasi_selesai,
          no_surat: data.no_surat,
          file: data.file, // Include file in create request
        };

        await suratTugasService.createSuratTugas(createData);

        toast({
          title: 'Berhasil dibuat',
          description: `Surat tugas ${data.no_surat} telah dibuat.`,
          variant: 'default'
        });
      }

      setIsDialogOpen(false);
      setSelectedItem(null);
      fetchSuratTugasList(); // Refresh the list
    } catch (error) {
      console.error('Failed to save surat tugas:', error);
    }
  };

  // Filter handlers
  const handleSearchChange = (search: string) => {
    updateURL({ search, page: 1 });
  };

  const handleInspektoratChange = (inspektorat: string) => {
    updateURL({ inspektorat, page: 1 });
  };

  const handleTahunEvaluasiChange = (tahun_evaluasi: string) => {
    updateURL({ tahun_evaluasi, page: 1 });
  };

  const handlePerwadagChange = (user_perwadag_id: string) => {
    updateURL({ user_perwadag_id, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateURL({ page });
  };

  const handleItemsPerPageChange = (value: string) => {
    updateURL({ size: parseInt(value), page: 1 });
  };

  // Generate composite title
  const getCompositeTitle = () => {
    let title = "Daftar Surat Tugas";
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
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Surat Tugas"
        description="Kelola data surat tugas evaluasi"
        actions={
          canCreateEdit && (
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Surat Tugas
            </Button>
          )
        }
      />

      <Filtering>
        <div className="space-y-2">
          <Label htmlFor="tahun-filter">Periode (Tahun)</Label>
          <Select value={filters.tahun_evaluasi} onValueChange={handleTahunEvaluasiChange}>
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
              subtitle="Kelola data surat tugas evaluasi berdasarkan filter yang dipilih"
            />

            <SearchContainer
              searchQuery={filters.search}
              onSearchChange={handleSearchChange}
              placeholder="Cari nomor surat, nama perwadag, atau nama petugas..."
            />

            {/* Desktop Table */}
            <div className="hidden lg:block">
              <SuratTugasTable
                data={suratTugasList}
                loading={loading}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canEdit={canEditItem}
                canDelete={canDeleteItem}
                isPerwadag={isPerwadag()}
                currentPage={filters.page}
                itemsPerPage={filters.size}
              />
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
              <SuratTugasCards
                data={suratTugasList}
                loading={loading}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canEdit={canEditItem}
                canDelete={canDeleteItem}
                isPerwadag={isPerwadag()}
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
      <SuratTugasDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingItem={selectedItem}
        mode={dialogMode}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Surat tugas{' '}
              <span className="font-semibold">{itemToDelete?.no_surat}</span> akan dihapus
              secara permanen dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteSuratTugas}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus Surat Tugas
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SuratTugasPage;