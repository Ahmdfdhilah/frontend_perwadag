# Guide Logic Pages

Panduan lengkap untuk mengimplementasikan halaman-halaman di aplikasi Perwadag menggunakan services layer, URL builder, toasting, dan pola arsitektur yang konsisten.

## Overview

Dokumen ini berdasarkan implementasi `UsersPage.tsx` dan komponen-komponennya sebagai reference pattern untuk semua halaman CRUD dalam aplikasi.

## Table of Contents

1. [Page Structure Pattern](#page-structure-pattern)
2. [Services Layer Integration](#services-layer-integration)
3. [URL Filters Implementation](#url-filters-implementation)
4. [Toasting Pattern](#toasting-pattern)
5. [Component Architecture](#component-architecture)
6. [State Management](#state-management)
7. [Access Control](#access-control)
8. [Implementation Checklist](#implementation-checklist)

## Page Structure Pattern

### 1. Basic Page Structure

Setiap halaman CRUD mengikuti struktur dasar ini:

```typescript
// Example: SomePage.tsx
import React, { useState, useEffect } from 'react';
import { useRole } from '@/hooks/useRole';
import { useURLFilters } from '@/hooks/useURLFilters';
import { useToast } from '@workspace/ui/components/sonner';
import { SomeEntity, SomeFilterParams } from '@/services/someEntity/types';
import { someEntityService } from '@/services/someEntity';

// Interface untuk filter halaman
interface SomePageFilters {
  search: string;
  status: string;
  category: string;
  page: number;
  size: number;
  [key: string]: string | number;
}

const SomePage: React.FC = () => {
  // 1. Hooks untuk role dan toast
  const { isAdmin, isInspektorat, isPerwadag } = useRole();
  const { toast } = useToast();
  
  // 2. URL Filters configuration
  const { updateURL, getCurrentFilters } = useURLFilters<SomePageFilters>({
    defaults: {
      search: '',
      status: 'all',
      category: 'all',
      page: 1,
      size: 10,
    },
    cleanDefaults: true,
  });

  // 3. Get current filters from URL
  const filters = getCurrentFilters();
  
  // 4. State management
  const [entities, setEntities] = useState<SomeEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<SomeEntity | null>(null);
  
  // 5. Access control
  const hasAccess = isAdmin() || isInspektorat(); // Sesuaikan dengan kebutuhan
  
  // 6. Fetch function
  const fetchEntities = async () => {
    setLoading(true);
    try {
      const params: SomeFilterParams = {
        page: filters.page,
        size: filters.size,
        search: filters.search || undefined,
        status: filters.status !== 'all' ? filters.status : undefined,
        // Transform filters sesuai API requirements
      };

      const response = await someEntityService.getEntities(params);
      setEntities(response.items);
      setTotalItems(response.total);
    } catch (error) {
      console.error('Failed to fetch entities:', error);
    } finally {
      setLoading(false);
    }
  };

  // 7. Effect untuk fetch data saat filter berubah
  useEffect(() => {
    if (hasAccess) {
      fetchEntities();
    }
  }, [filters.page, filters.size, filters.search, filters.status, hasAccess]);

  // 8. Handlers untuk actions dan filters
  // ... (akan dijelaskan di bagian selanjutnya)

  // 9. Render component dengan access control
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
      {/* Page content */}
    </div>
  );
};
```

### 2. Standard Imports Pattern

```typescript
// React dan hooks
import React, { useState, useEffect } from 'react';

// Custom hooks
import { useRole } from '@/hooks/useRole';
import { useURLFilters } from '@/hooks/useURLFilters';
import { useToast } from '@workspace/ui/components/sonner';

// Types dan services
import { Entity, EntityFilterParams } from '@/services/entity/types';
import { entityService } from '@/services/entity';

// UI Components
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Label } from '@workspace/ui/components/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@workspace/ui/components/alert-dialog';

// Icons
import { Plus, Edit, Trash, Eye } from 'lucide-react';

// Custom components
import { EntityTable } from '@/components/Entity/EntityTable';
import { EntityCards } from '@/components/Entity/EntityCards';
import { EntityDialog } from '@/components/Entity/EntityDialog';
import { PageHeader } from '@/components/common/PageHeader';
import ListHeaderComposite from '@/components/common/ListHeaderComposite';
import SearchContainer from '@/components/common/SearchContainer';
import Filtering from '@/components/common/Filtering';
import Pagination from '@/components/common/Pagination';
```

## Services Layer Integration

### 1. Service Integration Pattern

```typescript
// 1. Import service dan types
import { entityService } from '@/services/entity';
import { Entity, EntityFilterParams, EntityCreate, EntityUpdate } from '@/services/entity/types';

// 2. Fetch function dengan error handling
const fetchEntities = async () => {
  setLoading(true);
  try {
    // Transform filters ke format yang diharapkan API
    const params: EntityFilterParams = {
      page: filters.page,
      size: filters.size,
      search: filters.search || undefined,
      // Filter specific transformations
      status: filters.status !== 'all' ? filters.status as 'ACTIVE' | 'INACTIVE' : undefined,
      category: filters.category !== 'all' ? filters.category : undefined,
    };

    const response = await entityService.getEntities(params);
    setEntities(response.items);
    setTotalItems(response.total);
  } catch (error) {
    console.error('Failed to fetch entities:', error);
    // Optional: Show error toast
    toast({
      title: 'Error',
      description: 'Gagal memuat data. Silakan coba lagi.',
      variant: 'destructive'
    });
  } finally {
    setLoading(false);
  }
};

// 3. Create/Update operations
const handleSave = async (entityData: any) => {
  try {
    if (editingEntity) {
      // Update existing entity
      await entityService.updateEntity(editingEntity.id, entityData);
      toast({
        title: 'Berhasil diperbarui',
        description: `Data ${entityData.nama || 'entity'} telah diperbarui.`,
        variant: 'default'
      });
    } else {
      // Create new entity
      await entityService.createEntity(entityData);
      toast({
        title: 'Berhasil dibuat',
        description: `Data ${entityData.nama || 'entity'} telah ditambahkan.`,
        variant: 'default'
      });
    }
    setIsDialogOpen(false);
    setEditingEntity(null);
    fetchEntities(); // Refresh the list
  } catch (error) {
    console.error('Failed to save entity:', error);
    // Error toasts handled by service layer
  }
};

// 4. Delete operation
const confirmDeleteEntity = async () => {
  if (entityToDelete) {
    try {
      await entityService.deleteEntity(entityToDelete.id);
      setEntityToDelete(null);
      fetchEntities(); // Refresh the list
      toast({
        title: 'Berhasil dihapus',
        description: `Data ${entityToDelete.nama || 'entity'} telah dihapus.`,
        variant: 'default'
      });
    } catch (error) {
      console.error('Failed to delete entity:', error);
      // Error toasts handled by service layer
    }
  }
};
```

### 2. Service Options Pattern

```typescript
// Menggunakan service options untuk customization
const fetchEntitiesWithOptions = async () => {
  try {
    const response = await entityService.getEntities(params, {
      showSuccessToast: false, // Tidak perlu toast untuk list
      showErrorToast: true,    // Tetap show error toast
    });
    // Handle response
  } catch (error) {
    // Handle error
  }
};
```

## URL Filters Implementation

### 1. Basic URL Filters Setup

```typescript
// 1. Define filter interface
interface EntityPageFilters {
  search: string;
  status: string;
  category: string;
  dateFrom: string;
  dateTo: string;
  page: number;
  size: number;
  [key: string]: string | number;
}

// 2. Initialize useURLFilters
const { updateURL, getCurrentFilters, resetFilters, hasActiveFilters } = useURLFilters<EntityPageFilters>({
  defaults: {
    search: '',
    status: 'all',
    category: 'all',
    dateFrom: '',
    dateTo: '',
    page: 1,
    size: 10,
  },
  cleanDefaults: true, // Remove default values from URL
});

// 3. Get current filters
const filters = getCurrentFilters();
```

### 2. Filter Handler Patterns

```typescript
// Search handler
const handleSearchChange = (search: string) => {
  updateURL({ search, page: 1 }); // Reset ke page 1 saat search
};

// Dropdown/Select handlers
const handleStatusChange = (status: string) => {
  updateURL({ status, page: 1 });
};

const handleCategoryChange = (category: string) => {
  updateURL({ category, page: 1 });
};

// Date range handlers
const handleDateFromChange = (dateFrom: string) => {
  updateURL({ dateFrom, page: 1 });
};

const handleDateToChange = (dateTo: string) => {
  updateURL({ dateTo, page: 1 });
};

// Pagination handlers
const handlePageChange = (page: number) => {
  updateURL({ page });
};

const handleItemsPerPageChange = (value: string) => {
  updateURL({ size: parseInt(value), page: 1 });
};

// Reset filters
const handleResetFilters = () => {
  resetFilters();
};
```

### 3. Filter to API Parameter Transformation

```typescript
// Transform filter values ke format yang diharapkan API
const buildApiParams = (filters: EntityPageFilters): EntityFilterParams => {
  return {
    page: filters.page,
    size: filters.size,
    search: filters.search || undefined,
    status: filters.status !== 'all' ? filters.status as 'ACTIVE' | 'INACTIVE' : undefined,
    category: filters.category !== 'all' ? filters.category : undefined,
    date_from: filters.dateFrom || undefined,
    date_to: filters.dateTo || undefined,
  };
};

// Gunakan dalam fetch function
const fetchEntities = async () => {
  setLoading(true);
  try {
    const params = buildApiParams(filters);
    const response = await entityService.getEntities(params);
    // Handle response
  } catch (error) {
    // Handle error
  } finally {
    setLoading(false);
  }
};
```

### 4. Composite Title with Active Filters

```typescript
// Generate dynamic title berdasarkan active filters
const getCompositeTitle = () => {
  let title = "Daftar Entity";
  const activeFilters = [];
  
  if (filters.status !== 'all') {
    const statusLabels = { active: 'Aktif', inactive: 'Tidak Aktif' };
    activeFilters.push(statusLabels[filters.status as keyof typeof statusLabels] || filters.status);
  }
  
  if (filters.category !== 'all') {
    const categoryLabels = { /* mapping categories */ };
    activeFilters.push(categoryLabels[filters.category as keyof typeof categoryLabels] || filters.category);
  }
  
  if (activeFilters.length > 0) {
    title += " - " + activeFilters.join(" - ");
  }
  
  return title;
};

// Gunakan dalam render
<ListHeaderComposite
  title={getCompositeTitle()}
  subtitle="Kelola data entity sistem"
/>
```

## Toasting Pattern

### 1. Toast Setup

```typescript
import { useToast } from '@workspace/ui/components/sonner';

const Component = () => {
  const { toast } = useToast();
  
  // ... component logic
};
```

### 2. Success Toast Patterns

```typescript
// Create success
toast({
  title: 'Berhasil dibuat',
  description: `${entityType} ${entityName} telah ditambahkan ke sistem.`,
  variant: 'default'
});

// Update success
toast({
  title: 'Berhasil diperbarui',
  description: `Data ${entityType} ${entityName} telah diperbarui.`,
  variant: 'default'
});

// Delete success
toast({
  title: 'Berhasil dihapus',
  description: `${entityType} ${entityName} telah dihapus dari sistem.`,
  variant: 'default'
});

// Upload success
toast({
  title: 'File berhasil diunggah',
  description: `File ${fileName} telah diunggah dan disimpan.`,
  variant: 'default'
});
```

### 3. Error Toast Patterns

```typescript
// Generic error
toast({
  title: 'Terjadi kesalahan',
  description: 'Gagal memproses permintaan. Silakan coba lagi.',
  variant: 'destructive'
});

// Specific operation error
toast({
  title: 'Gagal menyimpan data',
  description: 'Terjadi kesalahan saat menyimpan. Periksa koneksi dan coba lagi.',
  variant: 'destructive'
});

// Validation error
toast({
  title: 'Data tidak valid',
  description: 'Periksa kembali data yang diisi dan pastikan semua field required terisi.',
  variant: 'destructive'
});

// Access denied error
toast({
  title: 'Akses ditolak',
  description: 'Anda tidak memiliki izin untuk melakukan operasi ini.',
  variant: 'destructive'
});
```

### 4. Service Layer Toasting

```typescript
// Service layer akan handle error toasts secara otomatis
// Page level hanya perlu handle success cases
try {
  await entityService.createEntity(data);
  // Success toast
  toast({
    title: 'Berhasil dibuat',
    description: `Data ${data.nama} telah ditambahkan.`,
    variant: 'default'
  });
} catch (error) {
  // Error toast akan dihandle oleh service layer
  console.error('Create failed:', error);
}
```

## Component Architecture

### 1. Table Component Pattern

```typescript
// EntityTable.tsx
interface EntityTableProps {
  entities: Entity[];
  loading?: boolean;
  onView: (entity: Entity) => void;
  onEdit: (entity: Entity) => void;
  onDelete: (entity: Entity) => void;
}

export const EntityTable: React.FC<EntityTableProps> = ({
  entities,
  loading = false,
  onView,
  onEdit,
  onDelete
}) => {
  // Table implementation with:
  // - Loading states
  // - Empty states
  // - Action dropdown
  // - Responsive design
};
```

### 2. Cards Component Pattern

```typescript
// EntityCards.tsx
interface EntityCardsProps {
  entities: Entity[];
  loading?: boolean;
  onView: (entity: Entity) => void;
  onEdit: (entity: Entity) => void;
  onDelete: (entity: Entity) => void;
}

export const EntityCards: React.FC<EntityCardsProps> = ({
  entities,
  loading = false,
  onView,
  onEdit,
  onDelete
}) => {
  // Cards implementation untuk mobile view:
  // - Responsive grid
  // - Loading skeletons
  // - Empty states
  // - Action dropdown
};
```

### 3. Dialog Component Pattern

```typescript
// EntityDialog.tsx
interface EntityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingEntity: Entity | null;
  mode?: 'view' | 'edit' | 'create';
  onSave: (entityData: any) => void;
}

export const EntityDialog: React.FC<EntityDialogProps> = ({
  open,
  onOpenChange,
  editingEntity,
  mode = editingEntity ? 'edit' : 'create',
  onSave
}) => {
  // Dialog implementation dengan:
  // - Form handling
  // - Validation
  // - Loading states
  // - Mode switching (view/edit/create)
};
```

### 4. Common Components Usage

```typescript
// Page Header
<PageHeader
  title="Entity Management"
  description="Kelola data entity sistem"
  actions={
    <Button onClick={handleCreate}>
      <Plus className="w-4 h-4 mr-2" />
      Tambah Entity
    </Button>
  }
/>

// Filtering
<Filtering>
  <div className="space-y-2">
    <Label>Status</Label>
    <Select value={filters.status} onValueChange={handleStatusChange}>
      <SelectTrigger>
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

// Search Container
<SearchContainer
  searchQuery={filters.search}
  onSearchChange={handleSearchChange}
  placeholder="Cari nama, email, atau kode..."
/>

// Pagination
<Pagination
  currentPage={filters.page}
  totalPages={totalPages}
  itemsPerPage={filters.size}
  totalItems={totalItems}
  onPageChange={handlePageChange}
  onItemsPerPageChange={handleItemsPerPageChange}
/>
```

## State Management

### 1. Standard State Pattern

```typescript
// Data states
const [entities, setEntities] = useState<Entity[]>([]);
const [loading, setLoading] = useState(true);
const [totalItems, setTotalItems] = useState(0);

// Dialog states
const [isDialogOpen, setIsDialogOpen] = useState(false);
const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
const [viewingEntity, setViewingEntity] = useState<Entity | null>(null);

// Delete confirmation state
const [entityToDelete, setEntityToDelete] = useState<Entity | null>(null);

// Form states (if applicable)
const [formLoading, setFormLoading] = useState(false);
const [formErrors, setFormErrors] = useState<Record<string, string>>({});
```

### 2. Action Handlers Pattern

```typescript
// View handler
const handleView = (entity: Entity) => {
  setViewingEntity(entity);
  setIsViewDialogOpen(true);
};

// Edit handler
const handleEdit = (entity: Entity) => {
  setEditingEntity(entity);
  setIsDialogOpen(true);
};

// Create handler
const handleCreate = () => {
  setEditingEntity(null);
  setIsDialogOpen(true);
};

// Delete handler
const handleDelete = (entity: Entity) => {
  setEntityToDelete(entity);
};

// Cancel handlers
const handleCancelEdit = () => {
  setIsDialogOpen(false);
  setEditingEntity(null);
};

const handleCancelView = () => {
  setIsViewDialogOpen(false);
  setViewingEntity(null);
};

const handleCancelDelete = () => {
  setEntityToDelete(null);
};
```

## Access Control

### 1. Role-Based Access Pattern

```typescript
import { useRole } from '@/hooks/useRole';

const SomePage = () => {
  const { isAdmin, isInspektorat, isPerwadag } = useRole();
  
  // Define access rules
  const hasFullAccess = isAdmin();
  const hasReadAccess = isAdmin() || isInspektorat() || isPerwadag();
  const hasWriteAccess = isAdmin() || isInspektorat();
  
  // Early return jika tidak ada akses
  if (!hasReadAccess) {
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
  
  // Conditional rendering untuk actions
  return (
    <div>
      <PageHeader
        actions={
          hasWriteAccess && (
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Data
            </Button>
          )
        }
      />
      
      {/* Table dengan conditional actions */}
      <EntityTable
        entities={entities}
        onView={handleView}
        onEdit={hasWriteAccess ? handleEdit : undefined}
        onDelete={hasFullAccess ? handleDelete : undefined}
      />
    </div>
  );
};
```

### 2. Form Permissions Pattern

```typescript
import { useFormPermissions } from '@/hooks/useFormPermissions';

const EntityDialog = ({ mode, editingEntity }) => {
  const { canEditForm } = useFormPermissions();
  
  // Check form-specific permissions
  const canEdit = canEditForm('entity_management') && mode !== 'view';
  
  return (
    <EntityForm
      initialData={editingEntity}
      disabled={!canEdit}
      mode={mode}
    />
  );
};
```

## Implementation Checklist

### 1. Page Setup Checklist

- [ ] Import semua dependencies yang diperlukan
- [ ] Setup interface untuk PageFilters
- [ ] Initialize useRole hook
- [ ] Initialize useURLFilters hook dengan defaults
- [ ] Initialize useToast hook
- [ ] Setup service imports dan types
- [ ] Define state variables (entities, loading, dialogs, etc.)
- [ ] Implement access control dengan early return
- [ ] Setup useEffect untuk fetch data

### 2. Services Integration Checklist

- [ ] Implement fetchEntities function dengan error handling
- [ ] Transform filters ke API parameters
- [ ] Implement handleSave untuk create/update
- [ ] Implement handleDelete dengan confirmation
- [ ] Add appropriate success/error toasts
- [ ] Handle loading states

### 3. URL Filters Checklist

- [ ] Define filter defaults yang sesuai
- [ ] Implement filter change handlers
- [ ] Reset page ke 1 saat filter berubah
- [ ] Transform filter values untuk API
- [ ] Implement composite title generation
- [ ] Setup pagination handlers

### 4. Component Integration Checklist

- [ ] Setup PageHeader dengan title dan actions
- [ ] Implement Filtering component dengan filter controls
- [ ] Setup SearchContainer dengan search handler
- [ ] Implement responsive Table dan Cards components
- [ ] Setup Pagination component
- [ ] Implement dialog components (edit, view, delete)
- [ ] Add loading dan empty states

### 5. Final Testing Checklist

- [ ] Test semua filter combinations
- [ ] Test pagination functionality
- [ ] Test search functionality
- [ ] Test CRUD operations
- [ ] Test access control untuk different roles
- [ ] Test responsive design (desktop/mobile)
- [ ] Test error handling scenarios
- [ ] Verify toast notifications
- [ ] Test URL sharing dan bookmarking

## Example Usage Bahasa/Language

### Bahasa Indonesia Pattern

```typescript
// Toast messages
const indonesianToasts = {
  createSuccess: 'Berhasil dibuat',
  updateSuccess: 'Berhasil diperbarui', 
  deleteSuccess: 'Berhasil dihapus',
  createError: 'Gagal membuat data',
  updateError: 'Gagal memperbarui data',
  deleteError: 'Gagal menghapus data',
  loadError: 'Gagal memuat data'
};

// UI Labels
const indonesianLabels = {
  search: 'Cari...',
  filter: 'Filter',
  status: 'Status',
  actions: 'Aksi',
  create: 'Tambah',
  edit: 'Edit',
  delete: 'Hapus',
  view: 'Lihat',
  save: 'Simpan',
  cancel: 'Batal',
  loading: 'Memuat...',
  noData: 'Tidak ada data ditemukan',
  accessDenied: 'Akses Ditolak'
};

// Status labels
const statusLabels = {
  active: 'Aktif',
  inactive: 'Tidak Aktif',
  pending: 'Menunggu',
  approved: 'Disetujui',
  rejected: 'Ditolak'
};
```

Gunakan guide ini sebagai template untuk implementasi halaman-halaman baru dalam aplikasi Perwadag. Pattern ini telah terbukti konsisten dan maintainable berdasarkan implementasi UsersPage.tsx.