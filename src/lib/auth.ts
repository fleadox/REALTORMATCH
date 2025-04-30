import { AuthConfig } from "@auth/core";
import Google from "@auth/core/providers/google";
import Credentials from "@auth/core/providers/credentials";
import { compare } from "bcryptjs";
import { supabase } from "./supabase";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  password_hash: string;
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}

declare module "@auth/core/types" {
  interface Session {
    user: {
      id: string;
      role: string;
      email: string;
      name: string;
    }
  }
}

export const authConfig: AuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const { data: user, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', credentials.email)
            .single();

          if (error || !user) {
            return null;
          }

          const userProfile = user as UserProfile;
          const isValid = await compare(credentials.password, userProfile.password_hash);

          if (!isValid) {
            return null;
          }

          return {
            id: userProfile.id,
            email: userProfile.email,
            name: userProfile.full_name,
            role: userProfile.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
}; 