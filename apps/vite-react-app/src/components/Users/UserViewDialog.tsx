import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Badge } from '@workspace/ui/components/badge';
import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar';
import { User } from '@/services/users/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { 
  Mail, 
  MapPin, 
  Calendar, 
  CreditCard,
  Building,
  Shield,
  User as UserIcon
} from 'lucide-react';

interface UserViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export const UserViewDialog: React.FC<UserViewDialogProps> = ({
  open,
  onOpenChange,
  user
}) => {
  if (!user) return null;


  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? 'default' : 'destructive'}>
        {isActive ? 'Aktif' : 'Tidak Aktif'}
      </Badge>
    );
  };

  const getRoleBadge = (role: User['role']) => {
    return (
      <Badge variant="secondary">
        {role}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Detail User</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* User Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
              <AvatarFallback className="text-sm sm:text-lg">
                {user.nama.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-semibold break-words">{user.nama}</h2>
              <div className="flex justify-center sm:justify-start items-center gap-2 mt-2">
                {getStatusBadge(user.is_active)}
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Basic Info */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                Informasi Dasar
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium">ID</p>
                    <p className="text-xs sm:text-sm text-muted-foreground break-all">{user.id}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <UserIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium">Username</p>
                    <p className="text-xs sm:text-sm text-muted-foreground break-all">@{user.username}</p>
                  </div>
                </div>

                {user.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium">Email</p>
                      <p className="text-xs sm:text-sm text-muted-foreground break-all">{user.email}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium">Tempat Lahir</p>
                    <p className="text-xs sm:text-sm text-muted-foreground break-words">{user.tempat_lahir}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium">Tanggal Lahir</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {format(new Date(user.tanggal_lahir), 'dd MMM yyyy', { locale: id })} ({user.age} tahun)
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Shield className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium">Pangkat</p>
                    <p className="text-xs sm:text-sm text-muted-foreground break-words">{user.pangkat}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Building className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium">Jabatan</p>
                    <p className="text-xs sm:text-sm text-muted-foreground break-words">{user.jabatan}</p>
                  </div>
                </div>

                {user.inspektorat && (
                  <div className="flex items-center space-x-3">
                    <Building className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium">Inspektorat</p>
                      <p className="text-xs sm:text-sm text-muted-foreground break-words">{user.inspektorat}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* System Info */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                Informasi Sistem
              </h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs sm:text-sm font-medium mb-1">Peran</p>
                  {getRoleBadge(user.role)}
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium">Dibuat</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {format(new Date(user.created_at), 'dd MMM yyyy, HH:mm', { locale: id })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium">Diperbarui</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {user.updated_at ? format(new Date(user.updated_at), 'dd MMM yyyy, HH:mm', { locale: id }) : '-'}
                    </p>
                  </div>
                </div>

                {user.last_login && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium">Login Terakhir</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {format(new Date(user.last_login), 'dd MMM yyyy, HH:mm', { locale: id })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};