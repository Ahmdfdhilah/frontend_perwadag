import { Link } from 'react-router-dom';
import { Button } from '@workspace/ui/components/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import logoLightMode from '@/assets/logoLightMode.png';
import logoDarkMode from '@/assets/logoDarkMode.png';
import logoMiniLightMode from '@/assets/logoMiniLightMode.png';
import logoMiniDarkMode from '@/assets/logoMiniDarkMode.png';

interface SidebarHeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function SidebarHeader({ collapsed, onToggleCollapse }: SidebarHeaderProps) {
  const { isDarkMode } = useTheme();
  
  return (
    <>
      <div className={cn("flex h-14 lg:h-16 items-center flex-shrink-0 border-b border-sidebar-border", collapsed ? "px-2 lg:px-3 justify-center" : "px-4 lg:px-6 justify-between")}>
        <Link to="/" className={cn("flex items-center min-w-0", collapsed ? "justify-center" : "space-x-2")}>
          <img 
            src={collapsed ? (isDarkMode ? logoMiniDarkMode : logoMiniLightMode) : (isDarkMode ? logoDarkMode : logoLightMode)} 
            className={cn("transition-all duration-300 object-contain", collapsed ? "w-7 h-7 lg:w-8 lg:h-8" : "w-32 lg:w-36 h-12")} 
            alt="logo kemendag" 
            width={collapsed ? "32" : "144"}
            height={collapsed ? "32" : "48"}
          />
        </Link>
        {!collapsed && (
          <Button
            variant="ghost"
            size="sm"
            className="hidden lg:flex h-11 w-11 p-0 flex-shrink-0"
            onClick={onToggleCollapse}
            title="Collapse sidebar"
          >
            <ChevronLeft className="h-3 w-3 lg:h-4 lg:w-4" />
          </Button>
        )}
      </div>

      {collapsed && (
        <div className="flex justify-center px-2 lg:px-3 py-2 border-b border-sidebar-border flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="h-11 w-11 p-0"
            onClick={onToggleCollapse}
            title="Expand sidebar"
          >
            <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4" />
          </Button>
        </div>
      )}
    </>
  );
}