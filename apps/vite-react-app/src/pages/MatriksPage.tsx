import React, { useState, useMemo } from 'react';
import { useRole } from '@/hooks/useRole';
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
import {
  MATRIKS_DATA,
  YEARS_MATRIKS,
  Matriks
} from '@/mocks/matriks';
import { PERWADAG_DATA } from '@/mocks/perwadag';
import { INSPEKTORATS } from '@/mocks/riskAssessment';
import { PageHeader } from '@/components/common/PageHeader';
import MatriksAdminTable from '@/components/Matriks/MatriksAdminTable';
import MatriksPerwadagTable from '@/components/Matriks/MatriksPerwadagTable';
import MatriksAdminCards from '@/components/Matriks/MatriksAdminCards';
import MatriksPerwadagCards from '@/components/Matriks/MatriksPerwadagCards';
import MatriksDialog from '@/components/Matriks/MatriksDialog';
import MatriksViewDialog from '@/components/Matriks/MatriksViewDialog';

const MatriksPage: React.FC = () => {
  const { isAdmin, isInspektorat, isPerwadag } = useRole();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedInspektorat, setSelectedInspektorat] = useState<string>('all');
  const [selectedPerwadag, setSelectedPerwadag] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Matriks | null>(null);
  const [viewingItem, setViewingItem] = useState<Matriks | null>(null);

  // Check access - only admin, inspektorat, and perwadag can access this page
  const hasAccess = isAdmin() || isInspektorat() || isPerwadag();

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

  // Get available perwadag based on role
  const availablePerwadag = useMemo(() => {
    if (isAdmin()) {
      return PERWADAG_DATA;
    }
    if (isInspektorat()) {
      // For demo, assume inspektorat 1
      return PERWADAG_DATA.filter(p => p.inspektorat === 1);
    }
    if (isPerwadag()) {
      // For demo, assume current user is PWD001
      return PERWADAG_DATA.filter(p => p.id === 'PWD001');
    }
    return [];
  }, [isAdmin, isInspektorat, isPerwadag]);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = [...MATRIKS_DATA];

    // Filter by search query
    if (searchQuery) {
      if (isPerwadag()) {
        // For perwadag, search in temuan and rekomendasi
        filtered = filtered.filter(item =>
          item.perwadagName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.temuan.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.rekomendasi.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } else {
        // For admin/inspektorat, search in name and status
        filtered = filtered.filter(item =>
          item.perwadagName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.status.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
    }

    // Filter by year
    if (selectedYear !== 'all') {
      filtered = filtered.filter(item => item.year === parseInt(selectedYear));
    }

    // Filter by inspektorat (only for admin)
    if (isAdmin() && selectedInspektorat !== 'all') {
      filtered = filtered.filter(item => item.inspektorat === parseInt(selectedInspektorat));
    }

    // Filter by perwadag (for admin and inspektorat)
    if ((isAdmin() || isInspektorat()) && selectedPerwadag !== 'all') {
      filtered = filtered.filter(item => item.perwadagId === selectedPerwadag);
    }

    // Role-based filtering
    if (isInspektorat()) {
      // For demo, show inspektorat 1 data
      filtered = filtered.filter(item => item.inspektorat === 1);
    }

    if (isPerwadag()) {
      // For demo, show only PWD001 data
      filtered = filtered.filter(item => item.perwadagId === 'PWD001');
    }

    // Sort by tanggal (newest first)
    filtered.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

    return filtered;
  }, [searchQuery, selectedYear, selectedInspektorat, selectedPerwadag, isAdmin, isInspektorat, isPerwadag]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleView = (item: Matriks) => {
    setViewingItem(item);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (item: Matriks) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleSave = (data: Partial<Matriks>) => {
    console.log('Save:', data);
    // Implement save logic
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const canEdit = (item: Matriks) => {
    return isInspektorat() && item.inspektorat === 1;
  };

  const isAdminOrInspektorat = isAdmin() || isInspektorat();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Matriks"
        description={isPerwadag() ? "Lihat temuan dan rekomendasi audit" : "Kelola data matriks audit"}
      />

      <Filtering>
        <div className="space-y-2">
          <Label htmlFor="year-filter">Periode (Tahun)</Label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger id="year-filter">
              <SelectValue placeholder="Pilih tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tahun</SelectItem>
              {YEARS_MATRIKS.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Only show inspektorat filter for admin */}
        {isAdmin() && (
          <div className="space-y-2">
            <Label htmlFor="inspektorat-filter">Inspektorat</Label>
            <Select value={selectedInspektorat} onValueChange={setSelectedInspektorat}>
              <SelectTrigger id="inspektorat-filter">
                <SelectValue placeholder="Pilih inspektorat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Inspektorat</SelectItem>
                {INSPEKTORATS.map(inspektorat => (
                  <SelectItem key={inspektorat.value} value={inspektorat.value.toString()}>
                    {inspektorat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Show perwadag filter for admin and inspektorat */}
        {(isAdmin() || isInspektorat()) && (
          <div className="space-y-2">
            <Label htmlFor="perwadag-filter">Perwadag</Label>
            <Select value={selectedPerwadag} onValueChange={setSelectedPerwadag}>
              <SelectTrigger id="perwadag-filter">
                <SelectValue placeholder="Pilih perwadag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Perwadag</SelectItem>
                {availablePerwadag.map(perwadag => (
                  <SelectItem key={perwadag.id} value={perwadag.id}>
                    {perwadag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </Filtering>

      <Card>
        <CardContent>
          <div className="space-y-4">
            <SearchContainer
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder={
                isPerwadag() 
                  ? "Cari nama perwadag, temuan, atau rekomendasi..." 
                  : "Cari nama perwadag atau status..."
              }
            />

            {/* Desktop Table */}
            <div className="hidden md:block">
              {isAdminOrInspektorat ? (
                <MatriksAdminTable
                  data={paginatedData}
                  onView={isAdmin() ? handleView : undefined}
                  onEdit={handleEdit}
                  canEdit={canEdit}
                />
              ) : (
                <MatriksPerwadagTable
                  data={paginatedData}
                />
              )}
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              {isAdminOrInspektorat ? (
                <MatriksAdminCards
                  data={paginatedData}
                  onView={isAdmin() ? handleView : undefined}
                  onEdit={handleEdit}
                  canEdit={canEdit}
                />
              ) : (
                <MatriksPerwadagCards
                  data={paginatedData}
                />
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={filteredData.length}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Dialog - Only for Admin */}
      {isAdmin() && (
        <MatriksViewDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          item={viewingItem}
        />
      )}

      {/* Edit Dialog - Only for Inspektorat */}
      {isInspektorat() && (
        <MatriksDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          item={editingItem}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default MatriksPage;