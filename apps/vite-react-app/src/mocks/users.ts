import { Role } from './roles';

export interface User {
  id: string;
  email: string;
  nip: string;
  name: string;
  phone: string;
  address: string;
  avatar?: string;
  roles: Role[];
  perwadagId?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const USERS_DATA: User[] = [
  {
    id: 'USR001',
    email: 'admin@perwadag.go.id',
    nip: '198501012000011001',
    name: 'Administrator System',
    phone: '+62812345678901',
    address: 'Jakarta Pusat, DKI Jakarta',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    roles: [{ id: 'admin', name: 'admin', label: 'Administrator', description: 'Full system access' }],
    isActive: true,
    lastLogin: new Date('2024-01-15T10:30:00'),
    createdAt: new Date('2024-01-01T00:00:00'),
    updatedAt: new Date('2024-01-15T10:30:00')
  },
  {
    id: 'USR002',
    email: 'inspektorat1@perwadag.go.id',
    nip: '198702152001012002',
    name: 'Dr. Siti Nurhaliza',
    phone: '+62812345678902',
    address: 'Jakarta Selatan, DKI Jakarta',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c72c?w=40&h=40&fit=crop&crop=face',
    roles: [{ id: 'inspektorat', name: 'inspektorat', label: 'Inspektorat I', description: 'Inspection and monitoring role' }],
    isActive: true,
    lastLogin: new Date('2024-01-14T09:15:00'),
    createdAt: new Date('2024-01-02T00:00:00'),
    updatedAt: new Date('2024-01-14T09:15:00')
  },
  {
    id: 'USR003',
    email: 'moscow@perwadag.go.id',
    nip: '198903203002013003',
    name: 'Ahmad Fauzi',
    phone: '+62812345678903',
    address: 'Jakarta Timur, DKI Jakarta',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    roles: [{ id: 'perwadag', name: 'perwadag', label: 'Atdag Moscow', description: 'Trade supervision and regulation role' }],
    perwadagId: 'PWD001',
    isActive: true,
    lastLogin: new Date('2024-01-13T14:20:00'),
    createdAt: new Date('2024-01-03T00:00:00'),
    updatedAt: new Date('2024-01-13T14:20:00')
  },
  {
    id: 'USR004',
    email: 'washington@perwadag.go.id',
    nip: '198804104003014004',
    name: 'Maria Santos',
    phone: '+62812345678904',
    address: 'Jakarta Barat, DKI Jakarta',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    roles: [{ id: 'perwadag', name: 'perwadag', label: 'Atdag Washington', description: 'Trade supervision and regulation role' }],
    perwadagId: 'PWD002',
    isActive: true,
    lastLogin: new Date('2024-01-12T16:45:00'),
    createdAt: new Date('2024-01-04T00:00:00'),
    updatedAt: new Date('2024-01-12T16:45:00')
  },
  {
    id: 'USR005',
    email: 'vancouver@perwadag.go.id',
    nip: '198905255004015005',
    name: 'Budi Santoso',
    phone: '+62812345678905',
    address: 'Bandung, Jawa Barat',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
    roles: [{ id: 'perwadag', name: 'perwadag', label: 'Atdag Vancouver', description: 'Trade supervision and regulation role' }],
    perwadagId: 'PWD003',
    isActive: true,
    lastLogin: new Date('2024-01-11T08:30:00'),
    createdAt: new Date('2024-01-05T00:00:00'),
    updatedAt: new Date('2024-01-11T08:30:00')
  },
  {
    id: 'USR006',
    email: 'madrid@perwadag.go.id',
    nip: '199006306005016006',
    name: 'Elena Rodriguez',
    phone: '+62812345678906',
    address: 'Surabaya, Jawa Timur',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face',
    roles: [{ id: 'perwadag', name: 'perwadag', label: 'Atdag Madrid', description: 'Trade supervision and regulation role' }],
    perwadagId: 'PWD004',
    isActive: false,
    lastLogin: new Date('2024-01-05T12:00:00'),
    createdAt: new Date('2024-01-06T00:00:00'),
    updatedAt: new Date('2024-01-10T10:00:00')
  },
  {
    id: 'USR007',
    email: 'johannesburg@perwadag.go.id',
    nip: '199107177006017007',
    name: 'Rudi Hermawan',
    phone: '+62812345678907',
    address: 'Yogyakarta, DI Yogyakarta',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=40&h=40&fit=crop&crop=face',
    roles: [{ id: 'perwadag', name: 'perwadag', label: 'Atdag Johannesburg', description: 'Trade supervision and regulation role' }],
    perwadagId: 'PWD005',
    isActive: true,
    lastLogin: new Date('2024-01-10T15:20:00'),
    createdAt: new Date('2024-01-07T00:00:00'),
    updatedAt: new Date('2024-01-10T15:20:00')
  },
  {
    id: 'USR008',
    email: 'cairo@perwadag.go.id',
    nip: '199208288007018008',
    name: 'Fatima Al-Zahra',
    phone: '+62812345678908',
    address: 'Medan, Sumatera Utara',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face',
    roles: [{ id: 'perwadag', name: 'perwadag', label: 'Atdag Cairo', description: 'Trade supervision and regulation role' }],
    perwadagId: 'PWD006',
    isActive: true,
    lastLogin: new Date('2024-01-09T11:10:00'),
    createdAt: new Date('2024-01-08T00:00:00'),
    updatedAt: new Date('2024-01-09T11:10:00')
  },
  {
    id: 'USR009',
    email: 'osaka@perwadag.go.id',
    nip: '199309099008019009',
    name: 'Hiroshi Tanaka',
    phone: '+62812345678909',
    address: 'Makassar, Sulawesi Selatan',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    roles: [{ id: 'perwadag', name: 'perwadag', label: 'Atdag Tokyo', description: 'Trade supervision and regulation role' }],
    perwadagId: 'PWD007',
    isActive: true,
    lastLogin: new Date('2024-01-08T13:45:00'),
    createdAt: new Date('2024-01-09T00:00:00'),
    updatedAt: new Date('2024-01-08T13:45:00')
  },
  {
    id: 'USR010',
    email: 'dubai@perwadag.go.id',
    nip: '199410104009020010',
    name: 'Ahmed Al-Rashid',
    phone: '+62812345678910',
    address: 'Denpasar, Bali',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    roles: [{ id: 'perwadag', name: 'perwadag', label: 'Atdag Dubai', description: 'Trade supervision and regulation role' }],
    perwadagId: 'PWD008',
    isActive: true,
    lastLogin: new Date('2024-01-07T09:30:00'),
    createdAt: new Date('2024-01-10T00:00:00'),
    updatedAt: new Date('2024-01-07T09:30:00')
  },
  {
    id: 'USR011',
    email: 'inspektorat2@perwadag.go.id',
    nip: '199511155010021011',
    name: 'Drs. Bambang Suryanto',
    phone: '+62812345678911',
    address: 'Semarang, Jawa Tengah',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
    roles: [{ id: 'inspektorat', name: 'inspektorat', label: 'Inspektorat II', description: 'Inspection and monitoring role' }],
    isActive: true,
    lastLogin: new Date('2024-01-06T14:15:00'),
    createdAt: new Date('2024-01-11T00:00:00'),
    updatedAt: new Date('2024-01-06T14:15:00')
  },
  {
    id: 'USR012',
    email: 'paris@perwadag.go.id',
    nip: '199612266011022012',
    name: 'Pierre Dubois',
    phone: '+62812345678912',
    address: 'Palembang, Sumatera Selatan',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    roles: [{ id: 'perwadag', name: 'perwadag', label: 'Atdag Paris', description: 'Trade supervision and regulation role' }],
    perwadagId: 'PWD009',
    isActive: true,
    lastLogin: new Date('2024-01-05T16:20:00'),
    createdAt: new Date('2024-01-12T00:00:00'),
    updatedAt: new Date('2024-01-05T16:20:00')
  }
];

export const getUser = (id: string): User | undefined => {
  return USERS_DATA.find(user => user.id === id);
};

export const getUsersByRole = (roleName: string): User[] => {
  return USERS_DATA.filter(user => user.roles.some(role => role.name === roleName));
};

export const getUsersByPerwadag = (perwadagId: string): User[] => {
  return USERS_DATA.filter(user => user.perwadagId === perwadagId);
};

export const getActiveUsers = (): User[] => {
  return USERS_DATA.filter(user => user.isActive);
};

export const searchUsers = (query: string): User[] => {
  const lowercaseQuery = query.toLowerCase();
  return USERS_DATA.filter(user => 
    user.name.toLowerCase().includes(lowercaseQuery) ||
    user.email.toLowerCase().includes(lowercaseQuery) ||
    user.nip.includes(lowercaseQuery)
  );
};