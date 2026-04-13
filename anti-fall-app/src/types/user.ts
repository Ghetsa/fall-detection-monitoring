export interface AppUser {
  uid: string;
  fullName: string;
  email: string;
  role: 'admin' | 'customer';
  phone?: string;
  address?: string;
  createdAt?: any;
}
