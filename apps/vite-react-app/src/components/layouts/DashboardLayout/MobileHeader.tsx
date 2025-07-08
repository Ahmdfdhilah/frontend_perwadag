import { Button } from '@workspace/ui/components/button';
import { UserDropdown } from './UserDropdown';
import NotificationSheet from '@/components/common/NotificationSheet';
import { Menu, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { pushNotificationService } from '@/services/pushService';

interface MobileHeaderProps {
  onOpenSidebar: () => void;
}

export function MobileHeader({ onOpenSidebar }: MobileHeaderProps) {
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
      <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-3 shadow-sm md:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenSidebar}
          className="h-8 w-8 p-0"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-x-2">
          {/* Wrapper div untuk notification button dengan relative positioning */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 flex items-center justify-center" 
              onClick={handleNotificationClick}
            >
              <Bell className="h-4 w-4" />
            </Button>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 min-w-[16px] rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center font-medium">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
          <UserDropdown collapsed={true} className="h-8 w-8 flex items-center justify-center" />
        </div>
      </header>

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