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
import ActionDropdown from '@/components/common/ActionDropdown';

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
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${isActive
        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
        }`}>
        {isActive ? 'Aktif' : 'Tidak Aktif'}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const getRoleStyle = (role: string) => {
      switch (role) {
        case 'ADMIN':
          return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
        case 'PIMPINAN':
          return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
        case 'INSPEKTORAT':
          return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
        case 'PERWADAG':
          return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
      }
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleStyle(role)}`}>
        {ROLE_LABELS[role as keyof typeof ROLE_LABELS] || role}
      </span>
    );
  };

  const getInspektoratSpan = (inspektorat: string) => {
    const getInspektoratStyle = (inspektorat: string) => {
      switch (inspektorat) {
        case 'Inspektorat 1':
          return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100';
        case 'Inspektorat 2':
          return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100';
        case 'Inspektorat 3':
          return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100';
        case 'Inspektorat 4':
          return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-100';
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
      }
    };

    return (
      <span className={`px-1 py-1 rounded-full text-xs font-medium ${getInspektoratStyle(inspektorat)}`}>
        {inspektorat}
      </span>
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
                  {user.nama}
                </TableCell>
                <TableCell>
                  {user.username}
                </TableCell>
                <TableCell>
                  {user.jabatan}
                </TableCell>
                <TableCell>
                  {user.email || '-'}
                </TableCell>
                <TableCell>
                  {getRoleBadge(user.role)}
                </TableCell>
                <TableCell>
                  {user.inspektorat ? getInspektoratSpan(user.inspektorat) : '-'}
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