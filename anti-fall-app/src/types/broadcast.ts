export interface Broadcast {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'urgent';
  targetRole: 'all' | 'customer' | 'admin';
  createdBy: string;
  isActive: boolean;
  createdAt: unknown;
}
