// apps/vite-react-app/src/components/layouts/DashboardLayout/UserDropdown.tsx
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@workspace/ui/components/button';
import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@workspace/ui/components/dropdown-menu';
import { Separator } from '@workspace/ui/components/separator';
import { Badge } from '@workspace/ui/components/badge';
import {
  ChevronDown,
  LogOut,
  User,
  Shield,
  Loader2,
  UserCheck,
  Building2
} from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';
import { useState } from 'react';
import { useRole } from '@/hooks/useRole';

interface UserDropdownProps {
  collapsed?: boolean;
  className?: string;
}

export function UserDropdown({ collapsed = false, className }: UserDropdownProps) {
  // const { user, logout, loading } = useAuth();
  const { currentRole, availableRoles, changeRole } = useRole();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigate = useNavigate();
  // Dummy user data for prototyping
  const dummyUser = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    mfa_enabled: true,
    is_verified: true,
    roles: [{ id: 'perwadag', name: 'perwadag', label: 'Atdag Tokyo', description: 'Trade supervision and regulation role' }]
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    const firstName = dummyUser.first_name || '';
    const lastName = dummyUser.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || dummyUser.email.charAt(0).toUpperCase();
  };

  // Get user display name
  const getUserDisplayName = () => {
    return `${dummyUser.first_name} ${dummyUser.last_name || ''}`.trim() || dummyUser.email;
  };

  // Get user role display
  const getUserRole = () => {
    return dummyUser.roles.length > 0 ? dummyUser.roles[0].label : currentRole.label;
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      // await logout();
      // For prototyping, just simulate logout
      console.log('Logout clicked');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleRoleChange = (roleId: string) => {
    changeRole(roleId);
  };

  const getRoleIcon = (roleId: string) => {
    switch (roleId) {
      case 'admin':
        return <Shield className="mr-2 h-4 w-4" />;
      case 'inspektorat':
        return <UserCheck className="mr-2 h-4 w-4" />;
      case 'perwadag':
        return <Building2 className="mr-2 h-4 w-4" />;
      default:
        return null;
    }
  };

  // Remove loading state for prototyping
  // if (!user) {
  //   return (
  //     <div className={cn("flex", collapsed ? "justify-center" : "justify-start", className)}>
  //       <div className="animate-pulse">
  //         <div className="h-8 w-8 bg-muted rounded-full"></div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className={cn("flex", collapsed ? "justify-center" : "justify-start", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "p-2 hover:bg-transparent",
              collapsed ? "flex items-center justify-center" : "flex items-center space-x-2 w-full"
            )}
            disabled={isLoggingOut}
          >
            <div className="relative">
              <Avatar className="h-6 w-6 flex-shrink-0">
                {/* <AvatarImage src={fileUtils.getFullFileUrl(user?.avatar_file?.file_url || '')} alt={getUserDisplayName()} /> */}
                <AvatarFallback className="text-xs">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              {/* MFA indicator */}
              {dummyUser.mfa_enabled && (
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border border-background flex items-center justify-center">
                  <Shield className="h-2 w-2 text-white" />
                </div>
              )}
            </div>
            {!collapsed && (
              <>
                <div className="flex flex-col items-start flex-1 min-w-0">
                  <span className="text-sm font-medium text-sidebar-foreground truncate">
                    {getUserDisplayName()}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground truncate">
                      {getUserRole()}
                    </span>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align={collapsed ? "center" : "end"} className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <span className="font-medium">{getUserDisplayName()}</span>
              <span className="text-xs text-muted-foreground">{dummyUser.email}</span>
              <span className="text-xs text-muted-foreground">{getUserRole()}</span>
            </div>
          </DropdownMenuLabel>

          <Separator />

          <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
            Switch Role
          </DropdownMenuLabel>

          {availableRoles.map((role) => (
            <DropdownMenuItem
              key={role.id}
              onClick={() => handleRoleChange(role.id)}
              className={cn(
                "flex items-center",
                currentRole.id === role.id && "bg-accent"
              )}
            >
              {getRoleIcon(role.id)}
              <span>{role.label}</span>
              {currentRole.id === role.id && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  Active
                </Badge>
              )}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Signing out...</span>
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}