export interface Role {
  id: string;
  name: string;
  label: string;
  description: string;
}

export const ROLES: Role[] = [
  {
    id: 'admin',
    name: 'admin',
    label: 'Administrator',
    description: 'Full system access'
  },
  {
    id: 'inspektorat',
    name: 'inspektorat',
    label: 'Inspektorat',
    description: 'Inspection and monitoring role'
  },
  {
    id: 'perwadag',
    name: 'perwadag',
    label: 'Perwadag',
    description: 'Trade supervision and regulation role'
  }
];

export const DEFAULT_ROLE = ROLES[0]; // admin as default