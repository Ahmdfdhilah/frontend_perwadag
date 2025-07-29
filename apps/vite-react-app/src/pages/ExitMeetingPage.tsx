import React, { useState, useEffect } from 'react';
import { useRole } from '@/hooks/useRole';
import { useFormPermissions } from '@/hooks/useFormPermissions';
import { useURLFilters } from '@/hooks/useURLFilters';
import { useToast } from '@workspace/ui/components/sonner';
import { MeetingResponse, MeetingFilterParams } from '@/services/meeting/types';
import { meetingService } from '@/services/meeting';
import { findPeriodeByYear } from '@/utils/yearUtils';
import { useYearOptions } from '@/hooks/useYearOptions';
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
import { PerwadagCombobox } from '@/components/common/PerwadagCombobox';
import { Label } from '@workspace/ui/components/label';
import { PageHeader } from '@/components/common/PageHeader';
import ListHeaderComposite from '@/components/common/ListHeaderComposite';
import ExitMeetingTable from '@/components/ExitMeeting/ExitMeetingTable';
import ExitMeetingCards from '@/components/ExitMeeting/ExitMeetingCards';
import ExitMeetingDialog from '@/components/ExitMeeting/ExitMeetingDialog';

interface ExitMeetingPageFilters {
  search: string;
  inspektorat: string;
  user_perwadag_id: string;
  tahun_evaluasi: string;
  page: number;
  size: number;
  [key: string]: string | number;
}

const ExitMeetingPage: React.FC = () => {
  const { isAdmin, isInspektorat, isPerwadag, user } = useRole();
  const { hasPageAccess, canEditForm } = useFormPermissions();
  const { toast } = useToast();

  // URL Filters configuration
  const { updateURL, getCurrentFilters } = useURLFilters<ExitMeetingPageFilters>({
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

  const [meetings, setMeetings] = useState<MeetingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MeetingResponse | null>(null);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit'>('view');
  const { yearOptions, periodeEvaluasi } = useYearOptions();


  // Calculate access control using useFormPermissions
  const hasAccess = hasPageAccess('exit_meeting');

  // Fetch meetings function
  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const params: MeetingFilterParams = {
        page: filters.page,
        size: filters.size,
        search: filters.search || undefined,
        meeting_type: "EXIT",
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

      const response = await meetingService.getMeetingList(params);
      setMeetings(response.items);
      setTotalItems(response.total);
      setTotalPages(response.pages);
    } catch (error) {
      console.error('Failed to fetch meetings:', error);
    } finally {
      setLoading(false);
    }
  };


  // Effect to fetch meetings when filters change
  useEffect(() => {
    if (hasAccess) {
      fetchMeetings();
    }
  }, [filters.page, filters.size, filters.search, filters.inspektorat, filters.user_perwadag_id, filters.tahun_evaluasi, filters.has_files, filters.has_date, filters.has_links, filters.is_completed, hasAccess]);

  // Pagination is handled by totalPages state from API response

  const handleView = (item: MeetingResponse) => {
    setEditingItem(item);
    setDialogMode('view');
    setIsDialogOpen(true);
  };

  const handleEdit = (item: MeetingResponse) => {
    setEditingItem(item);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleSave = async (data: any) => {
    if (!editingItem) return;

    try {
      const updateData = {
        tanggal_meeting: data.tanggal_meeting,
        link_zoom: data.link_zoom !== undefined ? data.link_zoom : undefined,
        link_daftar_hadir: data.link_daftar_hadir !== undefined ? data.link_daftar_hadir : undefined,
      };

      await meetingService.updateMeeting(editingItem.id, updateData);

      // Handle file uploads if any
      if (data.files && data.files.length > 0) {
        await meetingService.uploadFiles(editingItem.id, data.files);
      }

      setIsDialogOpen(false);
      setEditingItem(null);
      fetchMeetings(); // Refresh the list

      toast({
        title: 'Berhasil diperbarui',
        description: `Data exit meeting ${editingItem.nama_perwadag} telah diperbarui.`,
        variant: 'default'
      });
    } catch (error) {
      console.error('Failed to save meeting:', error);
    }
  };

  // Filter handlers
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
    let title = "Daftar Exit Meeting";
    const activeFilters = [];

    if (filters.inspektorat !== 'all') {
      activeFilters.push(`Inspektorat ${filters.inspektorat}`);
    }

    if (filters.tahun_evaluasi !== 'all') {
      activeFilters.push(`Tahun ${filters.tahun_evaluasi}`);
    }

    if (filters.user_perwadag_id !== 'all') {
      activeFilters.push(`Perwadag Terpilih`);
    }

    if (activeFilters.length > 0) {
      title += " - " + activeFilters.join(" - ");
    }

    return title;
  };

  const canEdit = (item?: MeetingResponse) => {
    if (!canEditForm('exit_meeting')) return false;

    // Check if the periode is locked or status is "tutup"
    if (item) {
      const periode = findPeriodeByYear(periodeEvaluasi, item.tahun_evaluasi);
      if (periode?.is_locked || periode?.status === 'tutup') {
        return false;
      }
    }

    if (isAdmin()) return true;
    if (isInspektorat()) {
      // Check if user can edit this meeting based on inspektorat
      return item ? user?.inspektorat === item.inspektorat : true;
    }
    if (isPerwadag()) {
      // Check if user can edit their own meeting
      return true;
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
        title="Exit Meeting"
        description="Kelola data exit meeting evaluasi"
      />

      <Filtering>
        <div className="space-y-2">
          <Label htmlFor="tahun-filter">Tahun Evaluasi</Label>
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
              subtitle="Kelola data exit meeting evaluasi berdasarkan filter yang dipilih"
            />

            {/* Desktop Table */}
            <div className="hidden lg:block">
              <ExitMeetingTable
                data={meetings}
                loading={loading}
                onView={handleView}
                onEdit={handleEdit}
                canEdit={canEdit}
                currentPage={filters.page}
                itemsPerPage={filters.size}
              />
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
              <ExitMeetingCards
                data={meetings}
                loading={loading}
                onView={handleView}
                onEdit={handleEdit}
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
      <ExitMeetingDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        item={editingItem}
        mode={dialogMode}
        onSave={handleSave}
      />
    </div>
  );
};

export default ExitMeetingPage;