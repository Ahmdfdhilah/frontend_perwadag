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
  QUESTIONNAIRE_TEMPLATE_DATA,
  YEARS_QUESTIONNAIRE,
  QuestionnaireTemplate
} from '@/mocks/questionnaireTemplate';
import { PageHeader } from '@/components/common/PageHeader';
import ListHeaderComposite from '@/components/common/ListHeaderComposite';
import QuestionnaireTable from '@/components/QuestionnaireTemplate/QuestionnaireTable';
import QuestionnaireCards from '@/components/QuestionnaireTemplate/QuestionnaireCards';
import QuestionnaireDialog from '@/components/QuestionnaireTemplate/QuestionnaireDialog';

const QuestionnaireTemplatePage: React.FC = () => {
  const { isAdmin, isInspektorat, isPerwadag } = useRole();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<QuestionnaireTemplate | null>(null);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit'>('view');

  // All users can access template viewing, only admin can manage
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

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = [...QUESTIONNAIRE_TEMPLATE_DATA];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by year
    if (selectedYear !== 'all') {
      filtered = filtered.filter(item => item.tahun === parseInt(selectedYear));
    }

    // Sort by no (ascending)
    filtered.sort((a, b) => a.no - b.no);

    return filtered;
  }, [searchQuery, selectedYear]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleView = (item: QuestionnaireTemplate) => {
    setEditingItem(item);
    setDialogMode('view');
    setIsDialogOpen(true);
  };

  const handleEdit = (item: QuestionnaireTemplate) => {
    if (!isAdmin()) return;
    setEditingItem(item);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    if (!isAdmin()) return;
    setEditingItem(null);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleDelete = (item: QuestionnaireTemplate) => {
    if (!isAdmin()) return;
    if (confirm(`Apakah Anda yakin ingin menghapus template "${item.nama}"?`)) {
      console.log('Delete:', item);
      // Implement delete logic here
    }
  };

  const handleSave = (data: Partial<QuestionnaireTemplate>) => {
    console.log('Save:', data);
    // Implement save logic here
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  // Generate composite title
  const getCompositeTitle = () => {
    let title = "Template Kuesioner";
    const filters = [];
    
    if (selectedYear !== 'all') {
      filters.push(selectedYear);
    }
    
    if (filters.length > 0) {
      title += " - " + filters.join(" - ");
    }
    
    return title;
  };

  const canEdit = () => {
    return isAdmin();
  };

  const canDelete = () => {
    return isAdmin();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Template Kuesioner"
        description="Template kuesioner yang dapat digunakan untuk evaluasi audit"
      />

      <Filtering>
        <div className="space-y-2">
          <Label htmlFor="year-filter">Tahun</Label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger id="year-filter">
              <SelectValue placeholder="Pilih tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tahun</SelectItem>
              {YEARS_QUESTIONNAIRE.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Filtering>

      <Card>
        <CardContent>
          <div className="space-y-4">
            <ListHeaderComposite
              title={getCompositeTitle()}
              subtitle="Template kuesioner yang dapat digunakan untuk evaluasi audit"
              onAdd={isAdmin() ? handleAdd : undefined}
              addLabel="Tambah Template"
            />

            <SearchContainer
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="Cari nama template atau deskripsi..."
            />

            {/* Desktop Table */}
            <div className="hidden md:block">
              <QuestionnaireTable
                data={paginatedData}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canEdit={canEdit}
                canDelete={canDelete}
              />
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              <QuestionnaireCards
                data={paginatedData}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canEdit={canEdit}
                canDelete={canDelete}
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
      <QuestionnaireDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        item={editingItem}
        mode={dialogMode}
        onSave={handleSave}
      />
    </div>
  );
};

export default QuestionnaireTemplatePage;