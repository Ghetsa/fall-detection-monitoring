export interface Notification {
  id: string;
  customerId: string;
  lansiaId: string;
  lansiaName: string;
  title: string;
  description: string;
  type: 'danger' | 'warning' | 'safe';
  isRead: boolean;
  createdAt: any;
}
