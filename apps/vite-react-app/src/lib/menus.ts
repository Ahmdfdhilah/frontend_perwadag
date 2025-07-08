import { AlertTriangle, FileInput, Mail, MailWarningIcon, PhoneIncoming, PhoneOutgoing, UserPlus, Users } from "lucide-react";

// Role definitions
export type UserRole =
  | 'admin'
  | 'inspektorat'
  | 'perwadag';

export interface SidebarItem {
  title: string;
  href?: string;
  icon: any;
  children?: SidebarItem[];
  isPlaceholder?: boolean;
  allowedRoles: UserRole[];
  badge?: string;
}


export const menuItems: SidebarItem[] = [

  // Risk Assessment - Only admin and inspektorat
  {
    title: 'Penilaian Risiko',
    href: '/penilaian-resiko',
    icon: AlertTriangle,
    allowedRoles: ['admin', 'inspektorat'],
  },
  // Surat Tugas - Only admin and inspektorat, perwadag
  {
    title: 'Surat Tugas',
    href: '/surat-tugas',
    icon: Mail,
    allowedRoles: ['admin', 'inspektorat', 'perwadag'],
  },
  // Surat Pemberitahuan - Only admin and inspektorat, perwadag
  {
    title: 'Surat Pemberitahuan',
    href: '/surat-pemberitahuan',
    icon: MailWarningIcon,
    allowedRoles: ['admin', 'inspektorat', 'perwadag'],
  },
  // Entry Meeting - Only admin and inspektorat, perwadag
  {
    title: 'Entry Meeting',
    href: '/entry-meeting',
    icon: PhoneIncoming,
    allowedRoles: ['admin', 'inspektorat', 'perwadag'],
  },
  // Exit Meeting - Only admin and inspektorat, perwadag
  {
    title: 'Exit Meeting',
    href: '/exit-meeting',
    icon: PhoneOutgoing,
    allowedRoles: ['admin', 'inspektorat', 'perwadag'],
  },
  // Laporan Hasil - Only admin and inspektorat, perwadag
  {
    title: 'Laporan Hasil',
    href: '/laporan-hasil',
    icon: FileInput,
    allowedRoles: ['admin', 'inspektorat', 'perwadag'],
  },

  // User Management - Admin and Master Admin
  {
    title: 'User Management',
    icon: Users,
    isPlaceholder: true,
    allowedRoles: ['admin'],
    children: [
      {
        title: 'All Users',
        href: '/users',
        icon: Users,
        allowedRoles: ['admin'],
      },
      {
        title: 'Add User',
        href: '/users/create',
        icon: UserPlus,
        allowedRoles: ['admin'],
      },
    ],
  },
];

// Helper function to get appropriate menu items based on user roles
export const getMenuItemsForUser = (userRoles: string[]): SidebarItem[] => {
  // If user has roles, combine basic items with filtered items
  const items = filterMenuByRoles(menuItems, userRoles);
  return [...items];
};

// Helper function to filter menu items based on user roles
export const filterMenuByRoles = (
  menuItems: SidebarItem[],
  userRoles: string[]
): SidebarItem[] => {
  return menuItems
    .filter(item => {
      // If allowedRoles is empty, allow access to all authenticated users
      if (item.allowedRoles.length === 0) {
        return true;
      }
      // Check if user has any of the allowed roles for this menu item
      const hasAccess = item.allowedRoles.some(role => userRoles.includes(role));
      return hasAccess;
    })
    .map(item => {
      // If item has children, filter them too
      if (item.children) {
        const filteredChildren = filterMenuByRoles(item.children, userRoles);
        return {
          ...item,
          children: filteredChildren,
        };
      }
      return item;
    })
    .filter(item => {
      // Remove parent items that have no accessible children
      if (item.isPlaceholder && item.children) {
        return item.children.length > 0;
      }
      return true;
    });
};

// Helper function to check if user has access to specific route
export const hasRouteAccess = (
  path: string,
  userRoles: string[],
  menuItems: SidebarItem[]
): boolean => {
  for (const item of menuItems) {
    // Check direct match
    if (item.href === path) {
      // If allowedRoles is empty, allow access to all authenticated users
      if (item.allowedRoles.length === 0) {
        return true;
      }
      return item.allowedRoles.some(role => userRoles.includes(role));
    }

    // Check children
    if (item.children) {
      const childAccess = hasRouteAccess(path, userRoles, item.children);
      if (childAccess !== null) return childAccess;
    }
  }
  return false;
};

// Default export for backward compatibility
export default menuItems;