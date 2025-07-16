import React, { useState, useEffect } from 'react';
import { useRole } from '@/hooks/useRole';
import { useURLFilters } from '@/hooks/useURLFilters';
import { useToast } from '@workspace/ui/components/sonner';
import { MeetingResponse, MeetingFilterParams } from '@/services/meeting/types';
import { meetingService } from '@/services/meeting';
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
import { PageHeader } from '@/components/common/PageHeader';
import ListHeaderComposite from '@/components/common/ListHeaderComposite';
import EntryMeetingTable from '@/components/EntryMeeting/EntryMeetingTable';
import EntryMeetingCards from '@/components/EntryMeeting/EntryMeetingCards';
import EntryMeetingDialog from '@/components/EntryMeeting/EntryMeetingDialog';

interface EntryMeetingPageFilters {
  search: string;
  inspektorat: string;
  user_perwadag_id: string;
  tahun_evaluasi: string;
  has_files: string;
  has_date: string;
  has_links: string;
  is_completed: string;
  page: number;
  size: number;
  [key: string]: string | number;
}

const EntryMeetingPage: React.FC = () => {
  const { isAdmin, isInspektorat, isPerwadag } = useRole();
  const { toast } = useToast();
  
  // URL Filters configuration
  const { updateURL, getCurrentFilters } = useURLFilters<EntryMeetingPageFilters>({
    defaults: {
      search: '',
      inspektorat: 'all',
      user_perwadag_id: 'all',
      tahun_evaluasi: 'all',
      has_files: 'all',
      has_date: 'all',
      has_links: 'all',
      is_completed: 'all',
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MeetingResponse | null>(null);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit'>('view');

  // Calculate access control
  const hasAccess = isAdmin() || isInspektorat() || isPerwadag();

  // Fetch meetings function
  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const params: MeetingFilterParams = {
        page: filters.page,
        size: filters.size,
        search: filters.search || undefined,
        meeting_type: "ENTRY",
        inspektorat: filters.inspektorat !== 'all' ? filters.inspektorat : undefined,
        user_perwadag_id: filters.user_perwadag_id !== 'all' ? filters.user_perwadag_id : undefined,
        tahun_evaluasi: filters.tahun_evaluasi !== 'all' ? parseInt(filters.tahun_evaluasi) : undefined,
        has_files: filters.has_files !== 'all' ? filters.has_files === 'true' : undefined,
        has_date: filters.has_date !== 'all' ? filters.has_date === 'true' : undefined,
        has_links: filters.has_links !== 'all' ? filters.has_links === 'true' : undefined,
        is_completed: filters.is_completed !== 'all' ? filters.is_completed === 'true' : undefined,
      };

      const response = await meetingService.getMeetingList(params);
      setMeetings(response.items);
      setTotalItems(response.total);
    } catch (error) {
      console.error('Failed to fetch meetings:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat data entry meeting. Silakan coba lagi.',
        variant: 'destructive'
      });
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

  // Pagination
  const totalPages = Math.ceil(totalItems / filters.size);

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
        link_zoom: data.link_zoom || undefined,
        link_daftar_hadir: data.link_daftar_hadir || undefined,
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
        description: `Data entry meeting ${editingItem.nama_perwadag} telah diperbarui.`,
        variant: 'default'
      });
    } catch (error) {
      console.error('Failed to save meeting:', error);
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

  const handleStatusChange = (status: string, type: 'has_files' | 'has_date' | 'has_links' | 'is_completed') => {
    updateURL({ [type]: status, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateURL({ page });
  };

  const handleItemsPerPageChange = (value: string) => {
    updateURL({ size: parseInt(value), page: 1 });
  };

  // Generate composite title
  const getCompositeTitle = () => {
    let title = "Daftar Entry Meeting";
    const activeFilters = [];
    
    if (filters.inspektorat !== 'all') {
      activeFilters.push(`Inspektorat ${filters.inspektorat}`);
    }
    
    if (filters.tahun_evaluasi !== 'all') {
      activeFilters.push(`Tahun ${filters.tahun_evaluasi}`);
    }
    
    if (filters.is_completed !== 'all') {
      activeFilters.push(filters.is_completed === 'true' ? 'Lengkap' : 'Belum Lengkap');
    }
    
    if (activeFilters.length > 0) {
      title += " - " + activeFilters.join(" - ");
    }
    
    return title;
  };

  const canEdit = (item: MeetingResponse) => {
    if (isAdmin()) return true;
    if (isInspektorat()) {
      // Check if user can edit this meeting based on inspektorat
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
        title="Entry Meeting"
        description="Kelola data entry meeting audit"
      />

      <Filtering>
        <div className="space-y-2">
          <Label htmlFor="tahun-filter">Tahun Evaluasi</Label>
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

        <div className="space-y-2">
          <Label htmlFor="status-filter">Status Kelengkapan</Label>
          <Select value={filters.is_completed} onValueChange={(value) => handleStatusChange(value, 'is_completed')}>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="true">Lengkap</SelectItem>
              <SelectItem value="false">Belum Lengkap</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="files-filter">Status Files</Label>
          <Select value={filters.has_files} onValueChange={(value) => handleStatusChange(value, 'has_files')}>
            <SelectTrigger id="files-filter">
              <SelectValue placeholder="Pilih status files" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="true">Ada Files</SelectItem>
              <SelectItem value="false">Belum Ada Files</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Filtering>

      <Card>
        <CardContent>
          <div className="space-y-4">
            <ListHeaderComposite
              title={getCompositeTitle()}
              subtitle="Kelola data entry meeting audit berdasarkan filter yang dipilih"
            />

            <SearchContainer
              searchQuery={filters.search}
              onSearchChange={handleSearchChange}
              placeholder="Cari nama perwadag..."
            />

            {/* Desktop Table */}
            <div className="hidden md:block">
              <EntryMeetingTable
                data={meetings}
                loading={loading}
                onView={handleView}
                onEdit={handleEdit}
                canEdit={canEdit}
              />
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              <EntryMeetingCards
                data={meetings}
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
      <EntryMeetingDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        item={editingItem}
        mode={dialogMode}
        onSave={handleSave}
      />
    </div>
  );
};

export default EntryMeetingPage;