import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Credentials Provider
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios');
        }

        try {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          if (!user || !user.password) {
            throw new Error('Credenciais inválidas');
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            throw new Error('Credenciais inválidas');
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
            plan: user.plan,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow all sign ins for now
      console.log('Sign in attempt:', { user, account, profile });
      return true;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },

    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        console.log('JWT token creation:', { user, account });
        token.id = user.id;
        token.role = (user as any).role || 'USER';
        token.plan = (user as any).plan || 'FREE';
      }

      // Return previous token if the access token has not expired yet
      return token;
    },

    async session({ session, token }) {
      console.log('Session creation:', { session, token });
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role;
        session.user.plan = token.plan;
      }

      return session;
    },
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('User signed in:', user.email);
      
      // Track sign in event
      if (isNewUser) {
        console.log('New user registered:', user.email);
        
        // You can add analytics tracking here
        // await trackEvent('user_registered', { userId: user.id });
      }
    },

    async signOut({ token }) {
      console.log('User signed out:', token?.email);
      
      // Track sign out event
      // await trackEvent('user_signed_out', { userId: token?.id });
    },

    async createUser({ user }) {
      console.log('User created:', user.email);
      
      // User created successfully - basic setup complete
      console.log('User registration completed for:', user.email);
    },
  },

  debug: process.env.NODE_ENV === 'development',
};

export default authOptions;