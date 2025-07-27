import React from 'react';
import { User } from '@/services/users/types';
import { ROLE_LABELS } from '@/lib/constants';
import { Card, CardContent } from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import ActionDropdown  from '@/components/common/ActionDropdown';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { 
  Mail, 
  Calendar, 
  Building
} from 'lucide-react';

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
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        isActive
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {isActive ? 'Aktif' : 'Tidak Aktif'}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const getRoleStyle = (role: string) => {
      switch (role) {
        case 'ADMIN':
          return 'bg-blue-100 text-blue-800';
        case 'INSPEKTORAT':
          return 'bg-purple-100 text-purple-800';
        case 'PERWADAG':
          return 'bg-orange-100 text-orange-800';
        default:
          return 'bg-gray-100 text-gray-800';
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
          return 'bg-emerald-100 text-emerald-800';
        case 'Inspektorat 2':
          return 'bg-cyan-100 text-cyan-800';
        case 'Inspektorat 3':
          return 'bg-amber-100 text-amber-800';
        case 'Inspektorat 4':
          return 'bg-rose-100 text-rose-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getInspektoratStyle(inspektorat)}`}>
        {inspektorat}
      </span>
    );
  };


  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24 mt-1" />
                    <div className="flex items-center space-x-2 mt-1">
                      <Skeleton className="h-5 w-12" />
                    </div>
                  </div>
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Skeleton className="w-4 h-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-32" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="w-4 h-4" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <div className="flex items-start space-x-2">
                  <Skeleton className="w-4 h-4 mt-0.5" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <div>
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <div className="flex items-center space-x-2 pt-2 border-t">
                  <Skeleton className="w-3 h-3" />
                  <Skeleton className="h-3 w-32" />
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
      <div className="text-center py-8 text-muted-foreground">
        Tidak ada user ditemukan
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {users.map((user, index) => (
        <Card key={user.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            {/* Header with Number and Actions */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </span>
                <div>
                  <h3 className="font-medium text-sm">{user.nama}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{user.username}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusBadge(user.is_active)}
                  </div>
                </div>
              </div>
              <ActionDropdown
                onView={() => onView(user)}
                onEdit={() => onEdit(user)}
                onDelete={() => onDelete(user)}
              />
            </div>


            {/* Jabatan */}
            <div className="mb-2">
              <p className="text-sm font-medium">{user.jabatan}</p>
            </div>

            {/* Email */}
            {user.email && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                <Mail className="w-4 h-4" />
                <span className="truncate">{user.email}</span>
              </div>
            )}


            {/* Inspektorat */}
            {user.inspektorat && (
              <div className="flex items-start space-x-2 text-sm text-muted-foreground mb-2">
                <Building className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="flex items-center space-x-2">
                  <span>Inspektorat:</span>
                  {getInspektoratSpan(user.inspektorat)}
                </div>
              </div>
            )}

            {/* Role */}
            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-1">Role:</p>
              {getRoleBadge(user.role)}
            </div>

            {/* Created At */}
            <div className="flex items-center space-x-2 text-xs text-muted-foreground pt-2 border-t">
              <Calendar className="w-3 h-3" />
              <span>
                Dibuat: {format(new Date(user.created_at), 'dd MMM yyyy', { locale: id })}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};