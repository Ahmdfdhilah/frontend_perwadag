import { ScrollArea, ScrollBar } from '@workspace/ui/components/scroll-area';
import { SidebarHeader } from './SidebarHeader';
import { SidebarFooter } from './SidebarFooter';
import { SidebarMenuItem } from './SidebarMenuItem';
import { getMenuItemsForUser } from '@/lib/menus';

interface SidebarItem {
  title: string;
  href?: string;
  icon: any;
  children?: SidebarItem[];
  isPlaceholder?: boolean;
  allowedRoles?: string[];
  badge?: string;
}
import { cn } from '@workspace/ui/lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useMemo } from 'react';

interface SidebarContentProps {
  collapsed?: boolean;
  expandedMenus: string[];
  onToggleCollapse: () => void;
  onToggleSubmenu: (title: string) => void;
  onMenuClick: (item: SidebarItem) => void;
  onLinkClick: () => void;
}

export function SidebarContent({ 
  collapsed = false, 
  expandedMenus,
  onToggleCollapse,
  onToggleSubmenu,
  onMenuClick,
  onLinkClick 
}: SidebarContentProps) {
  // Get user roles from Redux store
  const user = useSelector((state: RootState) => state.auth.user);
  
  // Extract role names from user roles
  const userRoles = useMemo(() => {
    if (!user?.roles) return [];
    return user.roles.map(role => role.name);
  }, [user?.roles]);
  
  // Get appropriate menu items based on user roles
  const menuItems = useMemo(() => {
    return getMenuItemsForUser(userRoles) as SidebarItem[];
  }, [userRoles]);

  return (
    <div className="flex h-full flex-col">
      <SidebarHeader 
        collapsed={collapsed} 
        onToggleCollapse={onToggleCollapse} 
      />

      <div className="flex-1 overflow-hidden">
        <ScrollArea className={cn("h-full", !collapsed && "h-[75vh] w-[260px]")}>
          <div className={cn("p-4 pb-2", collapsed && "px-2")}>
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem 
                  key={item.title} 
                  item={item} 
                  collapsed={collapsed}
                  expandedMenus={expandedMenus}
                  onToggleSubmenu={onToggleSubmenu}
                  onMenuClick={onMenuClick}
                  onLinkClick={onLinkClick}
                />
              ))}
            </nav>
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>

      <SidebarFooter collapsed={collapsed} />
    </div>
  );
}