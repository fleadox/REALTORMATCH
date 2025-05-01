import NextAuth, { NextAuthOptions, User } from 'next-auth';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from "next-auth/providers/email";
import { env } from '@/lib/env';
import { supabaseAdmin } from '@/lib/supabase/client';
import { sendVerificationEmail, sendWelcomeEmail } from "@/lib/email/config";
import type { Database } from '@/types/supabase';

// Define the auth configuration
const authOptions: NextAuthOptions = {
  // Configure the Supabase adapter
  adapter: SupabaseAdapter({
    url: env.supabaseUrl,
    secret: env.supabaseServiceKey,
  }),

  // Session configuration
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  // Configure providers
  providers: [
    // Email/Password provider
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        // Sign in with Supabase
        const { data: { user }, error } = await supabaseAdmin.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error || !user) {
          throw new Error(error?.message || 'Invalid credentials');
        }

        return {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.full_name || null,
          role: user.user_metadata?.role || 'user',
        } as User;
      }
    }),

    // Google OAuth provider
    GoogleProvider({
      clientId: env.googleClientId,
      clientSecret: env.googleClientSecret,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),

    EmailProvider({
      server: {
        host: env.emailConfig.host,
        port: env.emailConfig.port,
        auth: {
          user: env.emailConfig.auth.user,
          pass: env.emailConfig.auth.pass,
        },
      },
      from: env.emailConfig.from,
      sendVerificationRequest: async ({ identifier, url }) => {
        await sendVerificationEmail(identifier, url);
      },
    }),
  ],

  // Custom pages configuration
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/new-user'
  },

  // Callbacks for customizing the auth flow
  callbacks: {
    // JWT callback - runs whenever a JWT is created or updated
    async jwt({ token, user, account }) {
      if (user) {
        // Add user role and other metadata to the token
        token.role = user.role;
        token.id = user.id;
      }
      if (account) {
        // Add OAuth provider info to the token
        token.provider = account.provider;
      }
      return token;
    },

    // Session callback - runs whenever a session is checked
    async session({ session, token }) {
      if (token) {
        // Add user role and other metadata to the session
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },

    // Sign in callback - runs before sign in is completed
    async signIn({ user, account }) {
      // Allow sign in if email is verified or using OAuth
      if (account?.provider === 'credentials') {
        const { data: { user: supabaseUser } } = await supabaseAdmin.auth.getUser();
        return !!supabaseUser?.email_confirmed_at;
      }
      return true;
    },

    // Redirect callback - runs before redirecting
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },

  // Events handling
  events: {
    async signIn({ user, account }) {
      // Log successful sign in
      console.log('User signed in:', user.email);
    },
    async signOut({ token }) {
      // Log sign out
      console.log('User signed out:', token.email);
    },
    async createUser({ user }) {
      if (user.email) {
        await sendWelcomeEmail(user.email, user.name || undefined);
      }
    },
    async linkAccount({ user, account }) {
      // Log account linking
      console.log('Account linked:', user.email, account.provider);
    },
    async session({ token }) {
      // Log session updates
      console.log('Session updated:', token.email);
    }
  },

  // Debug mode in development
  debug: env.isDevelopment,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST, authOptions }; 