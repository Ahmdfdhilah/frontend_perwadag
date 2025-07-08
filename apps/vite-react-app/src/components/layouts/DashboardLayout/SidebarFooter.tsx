import { Button } from '@workspace/ui/components/button';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { UserDropdown } from './UserDropdown';
import NotificationSheet from '@/components/common/NotificationSheet';
import { Bell } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { pushNotificationService } from '@/services/pushService';

interface SidebarFooterProps {
  collapsed: boolean;
}

export function SidebarFooter({ collapsed }: SidebarFooterProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isNotificationSheetOpen, setIsNotificationSheetOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user?.id) {
      loadUnreadCount();
    }
  }, [user?.id]);

  const loadUnreadCount = async () => {
    try {
      const response = await pushNotificationService.getNotificationHistory(1, 100);
      const unread = response.items.filter(item => !item.read_at).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  const handleNotificationClick = () => {
    setIsNotificationSheetOpen(true);
  };

  return (
    <>
      <div className={cn("border-t border-sidebar-border p-4 pt-3 flex-shrink-0 mt-auto", collapsed ? "space-y-3" : "space-y-3")}>
        <div className={cn("flex", collapsed ? "flex-col items-center space-y-2" : "items-center justify-between")}>
          <div className={cn("flex", collapsed ? "justify-center" : "justify-end")}>
            {/* Wrapper div untuk notification button dengan relative positioning */}
            <div className="relative">
              <Button variant="ghost" size="sm" onClick={handleNotificationClick}>
                <Bell className="h-4 w-4" />
              </Button>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 min-w-[16px] rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center font-medium">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
          </div>
          <div className={cn("flex", collapsed ? "justify-center" : "justify-start")}>
            <ThemeToggle />
          </div>
        </div>

        <UserDropdown collapsed={collapsed} />
      </div>

      <NotificationSheet 
        open={isNotificationSheetOpen} 
        onOpenChange={(open) => {
          setIsNotificationSheetOpen(open);
          if (!open) {
            loadUnreadCount();
          }
        }} 
      />
    </>
  );
}