import React, { useState, useEffect } from 'react';
import { useRole } from '@/hooks/useRole';
import { useURLFilters } from '@/hooks/useURLFilters';
import { useToast } from '@workspace/ui/components/sonner';
import { SuratTugasResponse, SuratTugasFilterParams } from '@/services/suratTugas/types';
import { suratTugasService } from '@/services/suratTugas';
import { userService } from '@/services/users';
import { PerwadagSummary, PerwadagSearchParams } from '@/services/users/types';
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
import { Combobox } from '@workspace/ui/components/combobox';
import { Label } from '@workspace/ui/components/label';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import ListHeaderComposite from '@/components/common/ListHeaderComposite';
import SuratTugasTable from '@/components/SuratTugas/SuratTugasTable';
import SuratTugasCards from '@/components/SuratTugas/SuratTugasCards';
import SuratTugasDialog from '@/components/SuratTugas/SuratTugasDialog';
import SuratTugasViewDialog from '@/components/SuratTugas/SuratTugasViewDialog';
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SuratTugasResponse | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<SuratTugasResponse | null>(null);
  const [itemToDelete, setItemToDelete] = useState<SuratTugasResponse | null>(null);
  const [availablePerwadag, setAvailablePerwadag] = useState<PerwadagSummary[]>([]);
  const [perwadagSearchValue, setPerwadagSearchValue] = useState('');

  // Calculate access control
  const hasAccess = isAdmin() || isInspektorat() || isPerwadag();
  const canCreateEdit = isAdmin() || isInspektorat();

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
    } catch (error) {
      console.error('Failed to fetch surat tugas:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat data surat tugas. Silakan coba lagi.',
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
      fetchSuratTugasList();
      fetchAvailablePerwadag();
    }
  }, [filters.page, filters.size, filters.search, filters.inspektorat, filters.user_perwadag_id, filters.evaluation_status, filters.is_evaluation_active, filters.tahun_evaluasi, hasAccess]);

  // Pagination
  const totalPages = Math.ceil(totalItems / filters.size);

  const handleView = (item: SuratTugasResponse) => {
    setViewingItem(item);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (item: SuratTugasResponse) => {
    setEditingItem(item);
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
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleSave = async (data: any) => {
    try {
      if (editingItem) {
        // Update existing surat tugas
        const updateData = {
          tanggal_evaluasi_mulai: data.tanggal_evaluasi_mulai,
          tanggal_evaluasi_selesai: data.tanggal_evaluasi_selesai,
          no_surat: data.no_surat,
          nama_pengedali_mutu: data.nama_pengedali_mutu,
          nama_pengendali_teknis: data.nama_pengendali_teknis,
          nama_ketua_tim: data.nama_ketua_tim,
        };

        await suratTugasService.updateSuratTugas(editingItem.id, updateData);

        // Handle file upload if any
        if (data.file) {
          await suratTugasService.uploadFile(editingItem.id, data.file);
        }

        toast({
          title: 'Berhasil diperbarui',
          description: `Surat tugas ${data.no_surat} telah diperbarui.`,
          variant: 'default'
        });
      } else {
        // Create new surat tugas
        const createData = {
          user_perwadag_id: data.user_perwadag_id,
          tanggal_evaluasi_mulai: data.tanggal_evaluasi_mulai,
          tanggal_evaluasi_selesai: data.tanggal_evaluasi_selesai,
          no_surat: data.no_surat,
          nama_pengedali_mutu: data.nama_pengedali_mutu,
          nama_pengendali_teknis: data.nama_pengendali_teknis,
          nama_ketua_tim: data.nama_ketua_tim,
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
      setEditingItem(null);
      fetchSuratTugasList(); // Refresh the list
    } catch (error) {
      console.error('Failed to save surat tugas:', error);
      
      // Extract error message if available
      let errorMessage = 'Gagal menyimpan surat tugas. Pastikan semua field sudah diisi dengan benar.';
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
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
      const selectedPerwadag = availablePerwadag.find(p => p.id === filters.user_perwadag_id);
      if (selectedPerwadag) {
        activeFilters.push(`Perwadag ${selectedPerwadag.nama}`);
      }
    }

    if (filters.evaluation_status !== 'all') {
      const statusLabels = {
        'DRAFT': 'Draft',
        'ACTIVE': 'Aktif',
        'COMPLETED': 'Selesai',
        'CANCELLED': 'Dibatalkan'
      };
      activeFilters.push(statusLabels[filters.evaluation_status as keyof typeof statusLabels] || filters.evaluation_status);
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
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Surat Tugas"
        description="Kelola data surat tugas audit"
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
              <SelectItem value="all">Semua Tahun</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
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
      </Filtering>

      <Card>
        <CardContent>
          <div className="space-y-4">
            <ListHeaderComposite
              title={getCompositeTitle()}
              subtitle="Kelola data surat tugas audit berdasarkan filter yang dipilih"
            />

            <SearchContainer
              searchQuery={filters.search}
              onSearchChange={handleSearchChange}
              placeholder="Cari nomor surat, nama perwadag, atau nama petugas..."
            />

            {/* Desktop Table */}
            <div className="hidden md:block">
              <SuratTugasTable
                data={suratTugasList}
                loading={loading}
                onView={handleView}
                onEdit={canCreateEdit ? handleEdit : undefined}
                onDelete={canCreateEdit ? handleDelete : undefined}
                isPerwadag={isPerwadag()}
              />
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              <SuratTugasCards
                data={suratTugasList}
                loading={loading}
                onView={handleView}
                onEdit={canCreateEdit ? handleEdit : undefined}
                onDelete={canCreateEdit ? handleDelete : undefined}
                isPerwadag={isPerwadag()}
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

      {/* Edit/Create Dialog */}
      <SuratTugasDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingItem={editingItem}
        onSave={handleSave}
        availablePerwadag={availablePerwadag}
      />

      {/* View Dialog */}
      <SuratTugasViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        item={viewingItem}
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