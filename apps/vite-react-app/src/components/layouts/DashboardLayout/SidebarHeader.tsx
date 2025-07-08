import { Link } from 'react-router-dom';
import { Button } from '@workspace/ui/components/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';
import logo from '@/assets/logo.png';
import logoMini from '@/assets/logoMini.png';

interface SidebarHeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function SidebarHeader({ collapsed, onToggleCollapse }: SidebarHeaderProps) {
  return (
    <>
      <div className={cn("flex h-16 items-center flex-shrink-0 border-b border-sidebar-border", collapsed ? "px-3 justify-center" : "px-6 justify-between")}>
        <Link to="/admin" className={cn("flex items-center", collapsed ? "justify-center" : "space-x-2")}>
          {!collapsed ? (
            <img src={logo} className='w-35' alt="logo okoce" />
          ) : (
            <img src={logoMini} className='w-35' alt="logo okoce" />
          )
          }
        </Link>
        {!collapsed && (
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:flex h-8 w-8 p-0 flex-shrink-0"
            onClick={onToggleCollapse}
            title="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {collapsed && (
        <div className="flex justify-center px-3 py-2 border-b border-sidebar-border flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onToggleCollapse}
            title="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
}