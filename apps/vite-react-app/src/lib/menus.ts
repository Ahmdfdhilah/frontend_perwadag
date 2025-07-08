import {
  Users,
  BarChart3,
  Calendar,
  Clock,
  UserPlus,
  Building2,
  Briefcase,
  ClipboardList,
  BookOpen,
  PlaneTakeoff,
  DollarSign,
  Activity,
  TrendingUp,
  Plus,
  ClockIcon,
  Target,
  Receipt,
  Kanban,
  AlertTriangle,
} from 'lucide-react';

// Role definitions
export type UserRole =
  | 'master_admin'
  | 'admin'
  | 'user'
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


export const hrisMenuItems: SidebarItem[] = [
  // Dashboard - Accessible to all authenticated users
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Kanban,
    allowedRoles: ['master_admin', 'admin', 'user', 'inspektorat', 'perwadag'],
  },

  // Risk Assessment - Only admin and inspektorat
  {
    title: 'Penilaian Risiko',
    href: '/penilaian-resiko',
    icon: AlertTriangle,
    allowedRoles: ['admin', 'inspektorat'],
  },

  // Activities & Events - All users can view, certain roles can create
  {
    title: 'Activities',
    icon: Activity,
    isPlaceholder: true,
    allowedRoles: ['master_admin', 'admin', 'user'],
    children: [
      {
        title: 'All Activities',
        href: '/activities',
        icon: Activity,
        allowedRoles: ['master_admin', 'admin', 'user'],
      },
      {
        title: 'Create Activity',
        href: '/activities/create',
        icon: Plus,
        allowedRoles: ['master_admin', 'admin', 'user'],
      },
    ],
  },

  // Time & Attendance - Role-based access
  {
    title: 'Attendance',
    icon: Clock,
    isPlaceholder: true,
    allowedRoles: ['master_admin', 'admin', 'user'],
    children: [
      {
        title: 'Check In/Out',
        href: '/attendance/checkin',
        icon: ClockIcon,
        allowedRoles: ['user'], // Only regular users can check in/out
      },
      {
        title: 'My Attendance',
        href: '/attendance',
        icon: Calendar,
        allowedRoles: ['user'], // Only regular users have personal attendance
      },
      {
        title: 'Monthly Summary',
        href: '/attendance/summary',
        icon: BarChart3,
        allowedRoles: ['user'], // Only regular users have personal summary
      },
      {
        title: 'Attendance Monitoring',
        href: '/attendance/monitoring',
        icon: Building2,
        allowedRoles: ['master_admin', 'admin'],
      },
    ],
  },

  // Work Planning - All users can create plans, supervisors+ can approve
  {
    title: 'Work Planning',
    icon: Target,
    isPlaceholder: true,
    allowedRoles: ['master_admin', 'admin', 'user'],
    children: [
      {
        title: 'Create Plan',
        href: '/work-plans/create',
        icon: Plus,
        allowedRoles: ['user'],
      },
      {
        title: 'My Work Plans',
        href: '/work-plans',
        icon: Briefcase,
        allowedRoles: ['user'],
      },
      {
        title: 'Plan Summary',
        href: '/work-plans/summary',
        icon: TrendingUp,
        allowedRoles: ['user'],
      },
      {
        title: 'Monitoring',
        href: '/work-plans/monitoring',
        icon: BarChart3,
        allowedRoles: ['master_admin', 'admin'],
      },
    ],
  },

  // Logbook - Users can create/view their own, admin/master admin can monitor
  {
    title: 'Daily Logbook',
    icon: BookOpen,
    isPlaceholder: true,
    allowedRoles: ['master_admin', 'admin', 'user'],
    children: [
      {
        title: 'Create Entry',
        href: '/logbook/create',
        icon: Plus,
        allowedRoles: ['user'],
      },
      {
        title: 'My Logbook',
        href: '/logbook',
        icon: BookOpen,
        allowedRoles: ['user'],
      },
      {
        title: 'Summary & Analytics',
        href: '/logbook/summary',
        icon: BarChart3,
        allowedRoles: ['user'],
      },
      {
        title: 'Monitoring',
        href: '/logbook/monitoring',
        icon: BarChart3,
        allowedRoles: ['master_admin', 'admin'],
      },
    ],
  },

  // Payroll
  {
    title: 'Payroll',
    icon: DollarSign,
    isPlaceholder: true,
    allowedRoles: ['master_admin', 'user'],
    children: [
      {
        title: 'My Payroll',
        href: '/payroll/my-payroll',
        icon: Receipt,
        allowedRoles: ['user'],
      },
      {
        title: 'Create Payroll',
        href: '/payroll/create',
        icon: Plus,
        allowedRoles: ['master_admin'],
      },
      {
        title: 'Payroll Monitoring',
        href: '/payroll/monitoring',
        icon: BarChart3,
        allowedRoles: ['master_admin'],
      },
    ],
  },

  // Leave Management - All users can request, supervisors+ can approve
  {
    title: 'Leave Requests',
    icon: PlaneTakeoff,
    isPlaceholder: true,
    allowedRoles: ['master_admin', 'admin', 'user'],
    children: [
      {
        title: 'Create Request',
        href: '/leave-requests/create',
        icon: Plus,
        allowedRoles: ['user'],
      },
      {
        title: 'My Requests',
        href: '/leave-requests',
        icon: ClipboardList,
        allowedRoles: ['user'],
      },
      {
        title: 'Leave Request Monitoring',
        href: '/leave-requests/monitoring',
        icon: BarChart3,
        allowedRoles: ['admin', 'master_admin'],
      }
    ],
  },

  // Organization Management - Admin and above
  {
    title: 'Organization',
    icon: Building2,
    isPlaceholder: true,
    allowedRoles: ['master_admin', 'admin',],
    children: [
      {
        title: 'Organization Units',
        href: '/organization-units',
        icon: Building2,
        allowedRoles: ['admin', 'master_admin'],
      },
      {
        title: 'Create Unit',
        href: '/organization-units/create',
        icon: Plus,
        allowedRoles: ['master_admin'],
      },
    ],
  },

  // User Management - Admin and Master Admin
  {
    title: 'User Management',
    icon: Users,
    isPlaceholder: true,
    allowedRoles: ['admin', 'master_admin'],
    children: [
      {
        title: 'All Users',
        href: '/users',
        icon: Users,
        allowedRoles: ['admin', 'master_admin'],
      },
      {
        title: 'Add User',
        href: '/users/create',
        icon: UserPlus,
        allowedRoles: ['master_admin'],
      },
    ],
  },

  // Reports & Analytics - Admin and above
  {
    title: 'Reports',
    icon: BarChart3,
    isPlaceholder: true,
    allowedRoles: ['master_admin', 'admin',],
    children: [
      {
        title: 'Attendance Reports',
        href: '/reports/attendance',
        icon: Clock,
        allowedRoles: ['master_admin', 'admin',],
      },
      {
        title: 'Leave Reports',
        href: '/reports/leave',
        icon: PlaneTakeoff,
        allowedRoles: ['master_admin', 'admin',],
      },
      {
        title: 'Payroll Reports',
        href: '/reports/payroll',
        icon: DollarSign,
        allowedRoles: ['master_admin'],
      },
      {
        title: 'Workplan Reports',
        href: '/reports/work-plans',
        icon: Target,
        allowedRoles: ['master_admin', 'admin',],
      },
      {
        title: 'Logbook Reports',
        href: '/reports/logbook',
        icon: TrendingUp,
        allowedRoles: ['master_admin', 'admin',],
      },
    ],
  }
];

// Helper function to get appropriate menu items based on user roles
export const getMenuItemsForUser = (userRoles: string[]): SidebarItem[] => {
  // If user has roles, combine basic items with filtered HRIS items
  const hrisItems = filterMenuByRoles(hrisMenuItems, userRoles);
  return [...hrisItems];
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
  menuItems: SidebarItem[] = hrisMenuItems
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
export default hrisMenuItems;