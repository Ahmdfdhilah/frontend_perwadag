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
  KUESIONER_DATA,
  YEARS_KUESIONER,
  Kuesioner
} from '@/mocks/kuesioner';
import { PERWADAG_DATA } from '@/mocks/perwadag';
import { INSPEKTORATS } from '@/mocks/riskAssessment';
import { PageHeader } from '@/components/common/PageHeader';
import KuesionerTable from '@/components/Kuesioner/KuesionerTable';
import KuesionerCards from '@/components/Kuesioner/KuesionerCards';
import KuesionerDialog from '@/components/Kuesioner/KuesionerDialog';

const KuesionerPage: React.FC = () => {
  const { isAdmin, isInspektorat, isPerwadag } = useRole();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedInspektorat, setSelectedInspektorat] = useState<string>('all');
  const [selectedPerwadag, setSelectedPerwadag] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Kuesioner | null>(null);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit'>('view');

  // Check access - only admin, inspektorat, and perwadag can access this page
  if (!isAdmin() && !isInspektorat() && !isPerwadag()) {
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
    let filtered = [...KUESIONER_DATA];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.perwadagName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.aspek.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by year
    if (selectedYear !== 'all') {
      filtered = filtered.filter(item => item.year === parseInt(selectedYear));
    }

    // Filter by inspektorat (only for admin)
    if (isAdmin() && selectedInspektorat !== 'all') {
      filtered = filtered.filter(item => item.inspektorat === parseInt(selectedInspektorat));
    }

    // Filter by perwadag
    if (selectedPerwadag !== 'all') {
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

  const handleView = (item: Kuesioner) => {
    setEditingItem(item);
    setDialogMode('view');
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Kuesioner) => {
    setEditingItem(item);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleSave = (data: Partial<Kuesioner>) => {
    console.log('Save:', data);
    // Implement save logic
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const canEdit = (item: Kuesioner) => {
    if (isAdmin()) return true;
    if (isInspektorat()) return item.inspektorat === 1;
    if (isPerwadag()) return item.perwadagId === 'PWD001';
    return false;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kuesioner"
        description="Kelola data kuesioner audit"
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
              {YEARS_KUESIONER.map(year => (
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
              placeholder="Cari nama perwadag atau aspek..."
            />

            {/* Desktop Table */}
            <div className="hidden md:block">
              <KuesionerTable
                data={paginatedData}
                onView={handleView}
                onEdit={handleEdit}
                canEdit={canEdit}
              />
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              <KuesionerCards
                data={paginatedData}
                onView={handleView}
                onEdit={handleEdit}
                canEdit={canEdit}
              />
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

      {/* Dialog */}
      <KuesionerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        item={editingItem}
        mode={dialogMode}
        onSave={handleSave}
        availablePerwadag={availablePerwadag}
      />
    </div>
  );
};

export default KuesionerPage;