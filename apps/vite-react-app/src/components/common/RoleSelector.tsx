import React from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setRole } from '@/redux/features/roleSlice';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Badge } from '@workspace/ui/components/badge';
import { UserCheck, Shield, Building2 } from 'lucide-react';

const roleIcons = {
  admin: Shield,
  inspektorat: UserCheck,
  perwadag: Building2,
};

const RoleSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentRole, availableRoles } = useAppSelector((state) => state.role);

  const handleRoleChange = (roleId: string) => {
    dispatch(setRole(roleId));
  };

  const getRoleIcon = (roleId: string) => {
    const Icon = roleIcons[roleId as keyof typeof roleIcons];
    return Icon ? <Icon className="w-4 h-4" /> : null;
  };

  const getRoleBadgeVariant = (roleId: string) => {
    switch (roleId) {
      case 'admin':
        return 'destructive';
      case 'inspektorat':
        return 'secondary';
      case 'perwadag':
        return 'default';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Role:</span>
        <Badge variant={getRoleBadgeVariant(currentRole.id)} className="flex items-center gap-1">
          {getRoleIcon(currentRole.id)}
          {currentRole.label}
        </Badge>
      </div>
      
      <Select value={currentRole.id} onValueChange={handleRoleChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          {availableRoles.map((role) => (
            <SelectItem key={role.id} value={role.id}>
              <div className="flex items-center gap-2">
                {getRoleIcon(role.id)}
                <div className="flex flex-col">
                  <span className="font-medium">{role.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {role.description}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default RoleSelector;