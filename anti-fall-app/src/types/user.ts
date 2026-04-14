export interface AppUser {
  uid: string;
  fullName: string;
  email: string;
  role: 'admin' | 'customer';
  phone?: string;
  address?: string;
  department?: string;
  relationship?: string;
  photoURL?: string;
  createdAt?: unknown;
}

export type AppUserFormData = Omit<AppUser, 'createdAt'>;
