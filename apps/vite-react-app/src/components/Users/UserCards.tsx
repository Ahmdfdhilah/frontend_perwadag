import React from 'react';
import { User } from '@/mocks/users';
import { PERWADAG_DATA } from '@/mocks/perwadag';
import { Card, CardContent } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@workspace/ui/components/avatar';
import ActionDropdown  from '@/components/common/ActionDropdown';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard,
  Building
} from 'lucide-react';

interface UserCardsProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onView: (user: User) => void;
}

export const UserCards: React.FC<UserCardsProps> = ({
  users,
  onEdit,
  onDelete,
  onView
}) => {
  const getPerwadagName = (perwadagId?: string) => {
    if (!perwadagId) return null;
    const perwadag = PERWADAG_DATA.find(p => p.id === perwadagId);
    return perwadag?.name || null;
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? 'default' : 'destructive'} className="text-xs">
        {isActive ? 'Active' : 'Inactive'}
      </Badge>
    );
  };

  const getRolesBadges = (roles: User['roles']) => {
    return (
      <div className="flex flex-wrap gap-1">
        {roles.map((role) => (
          <Badge key={role.id} variant="secondary" className="text-xs">
            {role.label}
          </Badge>
        ))}
      </div>
    );
  };


  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No users found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <Card key={user.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            {/* Header with Avatar and Actions */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : (
                    <AvatarFallback className="text-sm">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h3 className="font-medium text-sm">{user.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusBadge(user.isActive)}
                  </div>
                </div>
              </div>
              <ActionDropdown
                onView={() => onView(user)}
                onEdit={() => onEdit(user)}
                onDelete={() => onDelete(user)}
              />
            </div>

            {/* NIP */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
              <CreditCard className="w-4 h-4" />
              <span>NIP: {user.nip}</span>
            </div>

            {/* Email */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
              <Mail className="w-4 h-4" />
              <span className="truncate">{user.email}</span>
            </div>

            {/* Phone */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
              <Phone className="w-4 h-4" />
              <span>{user.phone}</span>
            </div>

            {/* Address */}
            <div className="flex items-start space-x-2 text-sm text-muted-foreground mb-3">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{user.address}</span>
            </div>

            {/* Perwadag */}
            {getPerwadagName(user.perwadagId) && (
              <div className="flex items-start space-x-2 text-sm text-muted-foreground mb-3">
                <Building className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{getPerwadagName(user.perwadagId)}</span>
              </div>
            )}

            {/* Roles */}
            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-1">Roles:</p>
              {getRolesBadges(user.roles)}
            </div>

            {/* Last Login */}
            <div className="flex items-center space-x-2 text-xs text-muted-foreground pt-2 border-t">
              <Calendar className="w-3 h-3" />
              <span>
                Last login: {user.lastLogin ? 
                  format(user.lastLogin, 'dd MMM yyyy, HH:mm', { locale: id }) : 
                  'Never'
                }
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};