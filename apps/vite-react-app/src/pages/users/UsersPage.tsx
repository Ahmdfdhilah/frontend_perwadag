import React, { useState, useMemo } from 'react';
import { useRole } from '@/hooks/useRole';
import { useToast } from '@workspace/ui/components/sonner';
import { User, USERS_DATA } from '@/mocks/users';
import { ROLES } from '@/mocks/roles';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@workspace/ui/components/select';
import { Label } from '@workspace/ui/components/label';
import { Plus } from 'lucide-react';
import { UserTable } from '@/components/Users/UserTable';
import { UserCards } from '@/components/Users/UserCards';
import { UserDialog } from '@/components/Users/UserDialog';
import { PageHeader } from '@/components/common/PageHeader';
import SearchContainer from '@/components/common/SearchContainer';
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

const UsersPage: React.FC = () => {
  const { isAdmin } = useRole();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(USERS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Check access - only admin can access this page
  if (!isAdmin()) {
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

  // Filter and search users
  const filteredUsers = useMemo(() => {
    let filtered = [...users];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.nip.includes(query) ||
        user.phone.includes(query)
      );
    }

    // Role filter
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user =>
        user.roles.some(role => role.id === selectedRole)
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      const isActive = selectedStatus === 'active';
      filtered = filtered.filter(user => user.isActive === isActive);
    }

    // Sort by name
    filtered.sort((a, b) => a.name.localeCompare(b.name));

    return filtered;
  }, [users, searchQuery, selectedRole, selectedStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleView = (user: User) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      setUserToDelete(null);
      toast({
        title: 'User berhasil dihapus',
        description: `User ${userToDelete.name} telah dihapus dari sistem.`,
        variant: 'default'
      });
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  const handleSave = (userData: User) => {
    if (editingUser) {
      // Update existing user
      setUsers(prev => prev.map(u => u.id === editingUser.id ? userData : u));
      toast({
        title: 'User berhasil diperbarui',
        description: `Data user ${userData.name} telah diperbarui.`,
        variant: 'default'
      });
    } else {
      // Create new user
      setUsers(prev => [...prev, userData]);
      toast({
        title: 'User berhasil dibuat',
        description: `User ${userData.name} telah ditambahkan ke sistem.`,
        variant: 'default'
      });
    }
    setIsDialogOpen(false);
    setEditingUser(null);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Kelola pengguna sistem, peran, dan hak akses"
        actions={
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah User
          </Button>
        }
      />

      <Filtering>
        <div className="space-y-2">
          <Label htmlFor="role-filter">Role</Label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger id="role-filter">
              <SelectValue placeholder="Pilih role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Role</SelectItem>
              {ROLES.map(role => (
                <SelectItem key={role.id} value={role.id}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status-filter">Status</Label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
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
        <CardContent className="p-6">
          <div className="space-y-4">
            <SearchContainer
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="Cari nama, email, NIP, atau telepon..."
            />

            {/* Desktop Table */}
            <div className="hidden md:block">
              <UserTable
                users={paginatedUsers}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              <UserCards
                users={paginatedUsers}
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
                totalItems={filteredUsers.length}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* User Dialog */}
      <UserDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingUser={editingUser}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. User{' '}
              <span className="font-semibold">{userToDelete?.name}</span> akan dihapus
              secara permanen dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteUser}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UsersPage;