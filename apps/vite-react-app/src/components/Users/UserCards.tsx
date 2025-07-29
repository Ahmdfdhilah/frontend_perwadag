import React from 'react';
import { User } from '@/services/users/types';
import { ROLE_LABELS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import ActionDropdown from '@/components/common/ActionDropdown';

interface UserCardsProps {
  users: User[];
  loading?: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onView: (user: User) => void;
  currentPage?: number;
  itemsPerPage?: number;
}

export const UserCards: React.FC<UserCardsProps> = ({
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


  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="w-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-8 w-24" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm">
                <div>
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-8 mt-1" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-32 mt-1" />
                </div>
                <div>
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-40 mt-1" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20 mt-1" />
                </div>
                <div>
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-16 mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Tidak ada user ditemukan.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {users.map((user, index) => (
        <Card key={user.id} className="w-full gap-0">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-semibold">
                {user.nama}
              </CardTitle>
              <ActionDropdown
                onView={() => onView(user)}
                onEdit={() => onEdit(user)}
                onDelete={() => onDelete(user)}
                showView={true}
                showEdit={true}
                showDelete={true}
              />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">No:</span>
                <span className="ml-2">{(currentPage - 1) * itemsPerPage + index + 1}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Username:</span>
                <span className="ml-2">{user.username}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Email:</span>
                <span className="ml-2">{user.email || '-'}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Jabatan:</span>
                <span className="ml-2">{user.jabatan || '-'}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Role:</span>
                <span className="ml-2">{getRoleBadge(user.role)}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Inspektorat:</span>
                <span className="ml-2">{user.inspektorat ? getInspektoratSpan(user.inspektorat) : '-'}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Status:</span>
                <span className="ml-2">
                  {getStatusBadge(user.is_active)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};