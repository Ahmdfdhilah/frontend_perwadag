import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Badge } from '@workspace/ui/components/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@workspace/ui/components/avatar';
import { User } from '@/services/users/types';
import { PERWADAG_DATA } from '@/mocks/perwadag';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { 
  Mail, 
  Phone, 
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

  const getPerwadagName = (perwadagId?: string) => {
    if (!perwadagId) return 'Tidak ada';
    const perwadag = PERWADAG_DATA.find(p => p.id === perwadagId);
    return perwadag?.name || 'Tidak ada';
  };

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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detail User</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Header */}
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="text-lg">
                {user.nama.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold">{user.nama}</h2>
              <div className="flex items-center gap-2 mt-2">
                {getStatusBadge(user.is_active)}
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Informasi Dasar
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">ID</p>
                    <p className="text-sm text-muted-foreground">{user.id}</p>
                  </div>
                </div>

                {user.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                )}

                {user.inspektorat && (
                  <div className="flex items-center space-x-3">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Inspektorat</p>
                      <p className="text-sm text-muted-foreground">{user.inspektorat}</p>
                    </div>
                  </div>
                )}

                {user.wilayah && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Wilayah</p>
                      <p className="text-sm text-muted-foreground">{user.wilayah}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* System Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Informasi Sistem
              </h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-1">Peran</p>
                  {getRoleBadge(user.role)}
                </div>

                {user.perwadag_id && (
                  <div className="flex items-center space-x-3">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Perwadag</p>
                      <p className="text-sm text-muted-foreground">{getPerwadagName(user.perwadag_id)}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Dibuat</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(user.created_at), 'dd MMM yyyy, HH:mm', { locale: id })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Diperbarui</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(user.updated_at), 'dd MMM yyyy, HH:mm', { locale: id })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};