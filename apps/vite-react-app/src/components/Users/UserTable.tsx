import React from 'react';
import { User } from '@/mocks/users';
import { PERWADAG_DATA } from '@/mocks/perwadag';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { Badge } from '@workspace/ui/components/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@workspace/ui/components/avatar';
import ActionDropdown  from '@/components/common/ActionDropdown';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onView: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onDelete,
  onView
}) => {
  const getPerwadagName = (perwadagId?: string) => {
    if (!perwadagId) return '-';
    const perwadag = PERWADAG_DATA.find(p => p.id === perwadagId);
    return perwadag?.name || '-';
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? 'default' : 'destructive'}>
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

  const getActions = (user: User) => [
    {
      label: 'View Details',
      onClick: () => onView(user),
    },
    {
      label: 'Edit',
      onClick: () => onEdit(user),
    },
    {
      label: 'Delete',
      onClick: () => onDelete(user),
      destructive: true,
    },
  ];

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Perwadag</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      {user.avatar ? (
                        <AvatarImage src={user.avatar} alt={user.name} />
                      ) : (
                        <AvatarFallback className="text-xs">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">NIP: {user.nip}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">{user.email}</p>
                    <p className="text-sm text-muted-foreground">{user.phone}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {getRolesBadges(user.roles)}
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {getPerwadagName(user.perwadagId)}
                  </span>
                </TableCell>
                <TableCell>
                  {getStatusBadge(user.isActive)}
                </TableCell>
                <TableCell>
                  {user.lastLogin ? (
                    <span className="text-sm text-muted-foreground">
                      {format(user.lastLogin, 'dd MMM yyyy, HH:mm', { locale: id })}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">Never</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <ActionDropdown actions={getActions(user)} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};