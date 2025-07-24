import React, { useState, useEffect } from 'react';
import { useRole } from '@/hooks/useRole';
import { useURLFilters } from '@/hooks/useURLFilters';
import { useToast } from '@workspace/ui/components/sonner';
import { EmailTemplate } from '@/services/emailTemplate/types';
import { emailTemplateService } from '@/services/emailTemplate';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import { Label } from '@workspace/ui/components/label';
import { Plus } from 'lucide-react';
import { EmailTemplateTable } from '@/components/EmailTemplate/EmailTemplateTable';
import { EmailTemplateCards } from '@/components/EmailTemplate/EmailTemplateCards';
import { EmailTemplateDialog } from '@/components/EmailTemplate/EmailTemplateDialog';
import { PageHeader } from '@/components/common/PageHeader';
import ListHeaderComposite from '@/components/common/ListHeaderComposite';
import Filtering from '@/components/common/Filtering';
import Pagination from '@/components/common/Pagination';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@workspace/ui/components/select';

interface EmailTemplatePageFilters {
  status: string;
  page: number;
  size: number;
  [key: string]: string | number;
}

const EmailTemplatesPage: React.FC = () => {
  const { isAdmin } = useRole();
  const { toast } = useToast();
  
  // URL Filters configuration
  const { updateURL, getCurrentFilters } = useURLFilters<EmailTemplatePageFilters>({
    defaults: {
      status: 'all',
      page: 1,
      size: 10,
    },
    cleanDefaults: true,
  });

  // Get current filters from URL
  const filters = getCurrentFilters();
  
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'view' | 'create' | 'edit'>('create');
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<EmailTemplate | null>(null);
  const [activatingTemplate, setActivatingTemplate] = useState<EmailTemplate | null>(null);

  // Calculate access control
  const hasAccess = isAdmin();

  // Fetch templates function
  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await emailTemplateService.getAllTemplates({
        page: filters.page,
        size: filters.size
      });
      
      let filteredTemplates = response.items;

      // Apply client-side status filter
      if (filters.status !== 'all') {
        filteredTemplates = filteredTemplates.filter(template =>
          filters.status === 'active' ? template.is_active : !template.is_active
        );
      }

      setTemplates(filteredTemplates);
      setTotalItems(response.total);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch templates when filters change
  useEffect(() => {
    if (hasAccess) {
      fetchTemplates();
    }
  }, [filters.page, filters.size, filters.status, hasAccess]);

  // Pagination
  const totalPages = Math.ceil(totalItems / filters.size);

  // Handlers
  const handleCreate = () => {
    setSelectedTemplate(null);
    setDialogMode('create');
    setIsDialogOpen(true);
  };

  const handleEdit = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleView = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setDialogMode('view');
    setIsDialogOpen(true);
  };

  const handleActivate = async (template: EmailTemplate) => {
    if (template.is_active) return;
    
    setActivatingTemplate(template);
    try {
      await emailTemplateService.activateTemplate(template.id);
      await fetchTemplates();
      toast({
        title: 'Template Diaktifkan',
        description: `Template "${template.name}" telah diaktifkan.`,
        variant: 'default'
      });
    } catch (error) {
      console.error('Failed to activate template:', error);
    } finally {
      setActivatingTemplate(null);
    }
  };

  const handleDelete = (template: EmailTemplate) => {
    if (template.is_active) {
      toast({
        title: 'Tidak Dapat Menghapus',
        description: 'Template yang sedang aktif tidak dapat dihapus.',
        variant: 'destructive'
      });
      return;
    }
    setTemplateToDelete(template);
  };

  const confirmDelete = async () => {
    if (!templateToDelete) return;

    try {
      await emailTemplateService.deleteTemplate(templateToDelete.id);
      await fetchTemplates();
      toast({
        title: 'Template Dihapus',
        description: `Template "${templateToDelete.name}" telah dihapus.`,
        variant: 'default'
      });
    } catch (error) {
      console.error('Failed to delete template:', error);
    } finally {
      setTemplateToDelete(null);
    }
  };

  const handleSave = async () => {
    await fetchTemplates();
    setIsDialogOpen(false);
    setSelectedTemplate(null);
  };

  // Filter handlers
  const handleStatusChange = (status: string) => {
    updateURL({ status, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateURL({ page });
  };

  const handleItemsPerPageChange = (value: string) => {
    updateURL({ size: parseInt(value), page: 1 });
  };

  // Generate composite title
  const getCompositeTitle = () => {
    let title = "Template Email";
    const activeFilters = [];

    if (filters.status !== 'all') {
      activeFilters.push(filters.status === 'active' ? 'Aktif' : 'Tidak Aktif');
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
        title="Template Email"
        description="Kelola template email untuk laporan hasil evaluasi"
        actions={
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Template
          </Button>
        }
      />

      <Filtering>
        <div className="space-y-2">
          <Label htmlFor="status-filter">Status</Label>
          <Select value={filters.status} onValueChange={handleStatusChange}>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Tidak Aktif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Filtering>

      <Card>
        <CardContent>
          <div className="space-y-4">
            <ListHeaderComposite
              title={getCompositeTitle()}
              subtitle="Kelola template email berdasarkan filter yang dipilih"
            />


            {/* Desktop Table */}
            <div className="hidden lg:block">
              <EmailTemplateTable
                data={templates}
                loading={loading}
                onView={handleView}
                onEdit={handleEdit}
                onActivate={handleActivate}
                onDelete={handleDelete}
                activatingTemplate={activatingTemplate}
              />
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
              <EmailTemplateCards
                data={templates}
                loading={loading}
                onView={handleView}
                onEdit={handleEdit}
                onActivate={handleActivate}
                onDelete={handleDelete}
                activatingTemplate={activatingTemplate}
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

      {/* Unified Dialog */}
      <EmailTemplateDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        mode={dialogMode}
        template={selectedTemplate}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!templateToDelete} onOpenChange={() => setTemplateToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Template</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus template "{templateToDelete?.name}"?
              Aksi ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EmailTemplatesPage;