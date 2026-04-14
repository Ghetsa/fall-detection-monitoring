import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

type AppRole = 'admin' | 'customer';

type AppToken = {
  email?: string | null;
  fullname?: string | null;
  image?: string | null;
  role?: AppRole;
  type?: string;
};

type OAuthUserPayload = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

async function upsertOAuthUser(
  profile: OAuthUserPayload,
  provider: string
): Promise<AppToken> {
  if (!profile.email) {
    throw new Error('OAuth account does not have an email address.');
  }

  const uid = profile.email.toLowerCase();
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const userData = userSnap.data();

    return {
      email: userData.email ?? profile.email,
      fullname: userData.fullName ?? profile.name,
      image: userData.photoURL ?? profile.image,
      role: userData.role === 'admin' ? 'admin' : 'customer',
      type: provider,
    };
  }

  await setDoc(
    userRef,
    {
      uid,
      fullName: profile.name || 'OAuth User',
      email: profile.email,
      photoURL: profile.image || '',
      role: 'customer',
      provider,
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );

  return {
    email: profile.email,
    fullname: profile.name || 'OAuth User',
    image: profile.image || null,
    role: 'customer',
    type: provider,
  };
}

const providers = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  providers,
  callbacks: {
    async jwt({ token, account, user }) {
      if (
        account?.provider === 'google' ||
        account?.provider === 'github'
      ) {
        const oauthUser = await upsertOAuthUser(
          {
            name: user?.name ?? token.name,
            email: user?.email ?? token.email,
            image: user?.image ?? null,
          },
          account.provider
        );

        token.email = oauthUser.email;
        token.name = oauthUser.fullname ?? undefined;
        token.picture = oauthUser.image ?? undefined;
        (token as AppToken).fullname = oauthUser.fullname;
        (token as AppToken).role = oauthUser.role;
        (token as AppToken).type = oauthUser.type;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email ?? session.user.email ?? '';
        session.user.name = token.name ?? session.user.name ?? '';
        session.user.image = token.picture ?? session.user.image ?? null;
        (session.user as AppToken).fullname =
          (token as AppToken).fullname ?? session.user.name ?? '';
        (session.user as AppToken).role =
          (token as AppToken).role ?? 'customer';
        (session.user as AppToken).type = (token as AppToken).type ?? 'oauth';
      }

      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
};

export default NextAuth(authOptions);
