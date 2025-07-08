import { ThemeToggle } from '@/components/common/ThemeToggle';
import { UserDropdown } from './UserDropdown';
import { cn } from '@workspace/ui/lib/utils';

interface SidebarFooterProps {
  collapsed: boolean;
}

export function SidebarFooter({ collapsed }: SidebarFooterProps) {


  return (
    <>
      <div className={cn("border-t border-sidebar-border p-4 pt-3 flex-shrink-0 mt-auto", collapsed ? "space-y-3" : "space-y-3")}>
        <div className={cn("flex", collapsed ? "flex-col items-center space-y-2" : "items-center justify-between")}>
          <div className={cn("flex", collapsed ? "justify-center" : "justify-start")}>
            <ThemeToggle />
          </div>
        </div>

        <UserDropdown collapsed={collapsed} />
      </div>
    </>
  );
}