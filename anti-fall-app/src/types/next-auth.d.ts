import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      uid?: string;
      fullname?: string | null;
      role?: 'admin' | 'customer';
      type?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    uid?: string;
    fullname?: string | null;
    role?: 'admin' | 'customer';
    type?: string;
  }
}
