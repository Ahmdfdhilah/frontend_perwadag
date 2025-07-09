import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  RISK_ASSESSMENTS,
  YEARS,
  INSPEKTORATS,
  RiskAssessment
} from '@/mocks/riskAssessment';
import { PageHeader } from '@/components/common/PageHeader';
import ListHeaderComposite from '@/components/common/ListHeaderComposite';
import RiskAssessmentTable from '@/components/RiskAssesment/RiskAssessmentTable';
import RiskAssessmentCards from '@/components/RiskAssesment/RiskAssessmentCards';

const RiskAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentRole } = useRole();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedInspektorat, setSelectedInspektorat] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('score-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate role values once to avoid any potential issues
  const userIsAdmin = currentRole.id === 'admin';
  const userIsInspektorat = currentRole.id === 'inspektorat';
  const hasAccess = userIsAdmin || userIsInspektorat;

  // Filter and sort data - always run this hook regardless of access
  const filteredData = useMemo(() => {
    let filtered = [...RISK_ASSESSMENTS];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.perwadagName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by year
    if (selectedYear !== 'all') {
      filtered = filtered.filter(item => item.year === parseInt(selectedYear));
    }

    // Filter by inspektorat (only for admin)
    if (userIsAdmin && selectedInspektorat !== 'all') {
      filtered = filtered.filter(item => item.inspektorat === parseInt(selectedInspektorat));
    }

    // For inspektorat role, only show data for their own inspektorat
    if (userIsInspektorat) {
      // In a real app, you would get the user's inspektorat from auth context
      // For now, we'll show inspektorat 1 data as example
      filtered = filtered.filter(item => item.inspektorat === 1);
    }

    // Sort data
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score-desc':
          return b.score - a.score;
        case 'score-asc':
          return a.score - b.score;
        case 'year-desc':
          return b.year - a.year;
        case 'year-asc':
          return a.year - b.year;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedYear, selectedInspektorat, sortBy, userIsAdmin, userIsInspektorat]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleView = (item: RiskAssessment) => {
    navigate(`/penilaian-resiko/${item.id}`);
  };

  const handleEdit = (item: RiskAssessment) => {
    navigate(`/penilaian-resiko/${item.id}/edit`);
  };

  const handleDelete = (item: RiskAssessment) => {
    console.log('Delete:', item);
    // Implement delete logic
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Generate composite title
  const getCompositeTitle = () => {
    let title = "Daftar Penilaian Risiko";
    const filters = [];
    
    if (userIsInspektorat) {
      filters.push("Inspektorat I");
    } else if (userIsAdmin && selectedInspektorat !== 'all') {
      filters.push(`Inspektorat ${selectedInspektorat}`);
    }
    
    if (selectedYear !== 'all') {
      filters.push(selectedYear);
    }
    
    if (filters.length > 0) {
      title += " - " + filters.join(" - ");
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
        title="Penilaian Risiko"
        description="Kelola data penilaian risiko audit"
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
              {YEARS.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Only show inspektorat filter for admin */}
        {userIsAdmin && (
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

        <div className="space-y-2">
          <Label htmlFor="sort-filter">Urutkan</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger id="sort-filter">
              <SelectValue placeholder="Pilih urutan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score-desc">Skor Tertinggi</SelectItem>
              <SelectItem value="score-asc">Skor Terendah</SelectItem>
              <SelectItem value="year-desc">Tahun Terbaru</SelectItem>
              <SelectItem value="year-asc">Tahun Terlama</SelectItem>
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
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="Cari nama perwadag..."
            />

            {/* Desktop Table */}
            <div className="hidden md:block">
              <RiskAssessmentTable
                data={paginatedData}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              <RiskAssessmentCards
                data={paginatedData}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
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
    </div>
  );
};

export default RiskAssessmentPage;