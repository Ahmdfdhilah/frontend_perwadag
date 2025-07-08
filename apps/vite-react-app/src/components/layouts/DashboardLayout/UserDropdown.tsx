// apps/vite-react-app/src/components/layouts/DashboardLayout/UserDropdown.tsx
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@workspace/ui/components/button';
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@workspace/ui/components/dropdown-menu';
import { Separator } from '@workspace/ui/components/separator';
import { Badge } from '@workspace/ui/components/badge';
import {
  ChevronDown,
  LogOut,
  User,
  Shield,
  Loader2
} from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';
import { useState } from 'react';
import { useAuth } from '@/components/Auth/AuthProvider';
import { fileUtils } from '@/utils/fileUtils';

interface UserDropdownProps {
  collapsed?: boolean;
  className?: string;
}

export function UserDropdown({ collapsed = false, className }: UserDropdownProps) {
  const { user, logout, loading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || user.email.charAt(0).toUpperCase();
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return 'User';
    return `${user.first_name} ${user.last_name || ''}`.trim() || user.email;
  };

  // Get user role display
  const getUserRole = () => {
    if (!user?.roles || user.roles.length === 0) return 'User';
    // Show the highest priority role (assuming admin > user)
    const roles = user.roles.map(r => r.name);
    if (roles.includes('admin')) return 'Admin';
    if (roles.includes('user')) return 'User';
    return roles[0] || 'User';
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation even if logout fails
      navigate('/login', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    return (
      <div className={cn("flex", collapsed ? "justify-center" : "justify-start", className)}>
        <div className="animate-pulse">
          <div className="h-8 w-8 bg-muted rounded-full"></div>
        </div>
      </div>
    );
  }

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
            disabled={loading || isLoggingOut}
          >
            <div className="relative">
              <Avatar className="h-6 w-6 flex-shrink-0">
                <AvatarImage src={fileUtils.getFullFileUrl(user?.avatar_file?.file_url || '')} alt={getUserDisplayName()} />
                <AvatarFallback className="text-xs">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              {/* MFA indicator */}
              {user.mfa_enabled && (
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
                    {user.mfa_enabled && (
                      <Shield className="h-3 w-3 text-green-500" />
                    )}
                    {!user.is_verified && (
                      <Badge variant="outline" className="text-xs py-0 px-1">
                        Unverified
                      </Badge>
                    )}
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
              <span className="text-xs text-muted-foreground">{user.email}</span>
              {user.employee_id && (
                <span className="text-xs text-muted-foreground">{user.employee_id}</span>
              )}
            </div>
          </DropdownMenuLabel>

          <Separator />

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