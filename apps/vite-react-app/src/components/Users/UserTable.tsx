import React from 'react';
import { User } from '@/services/users/types';
import { ROLE_LABELS } from '@/lib/constants';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Badge } from '@workspace/ui/components/badge';
import ActionDropdown  from '@/components/common/ActionDropdown';

interface UserTableProps {
  users: User[];
  loading?: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onView: (user: User) => void;
  currentPage?: number;
  itemsPerPage?: number;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  loading = false,
  onEdit,
  onDelete,
  onView,
  currentPage = 1,
  itemsPerPage = 10
}) => {
  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? 'default' : 'destructive'}>
        {isActive ? 'Aktif' : 'Tidak Aktif'}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    return (
      <Badge variant="secondary" className="text-xs">
        {ROLE_LABELS[role as keyof typeof ROLE_LABELS] || role}
      </Badge>
    );
  };


  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">No</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Jabatan</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Inspektorat</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-[30px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
              </TableRow>
            ))
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                Tidak ada user ditemukan
              </TableCell>
            </TableRow>
          ) : (
            users.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell className="text-center">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </TableCell>
                <TableCell>
                  <span className="font-medium">{user.nama}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.username}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.jabatan}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.email || '-'}</span>
                </TableCell>
                <TableCell>
                  {getRoleBadge(user.role)}
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {user.inspektorat || '-'}
                  </span>
                </TableCell>
                <TableCell>
                  {getStatusBadge(user.is_active)}
                </TableCell>
                <TableCell className="text-right">
                  <ActionDropdown
                    onView={() => onView(user)}
                    onEdit={() => onEdit(user)}
                    onDelete={() => onDelete(user)}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};