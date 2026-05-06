export interface Notification {
  id: string;
  customerId: string;
  lansiaId: string;
  title: string;
  description: string;
  type: 'danger' | 'warning' | 'safe';
  isRead: boolean;
  createdAt: unknown;
}
