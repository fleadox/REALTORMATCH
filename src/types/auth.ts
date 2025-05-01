import { Session, User } from 'next-auth';
import { SignInOptions } from 'next-auth/react';

export interface AuthUser extends Omit<User, 'emailVerified'> {
  id: string;
  email: string;
  name?: string | null;
  role?: string;
  image?: string | null;
  emailVerified: Date | null;
}

export interface AuthSession extends Session {
  user: AuthUser;
  expires: string;
}

export interface SignInCredentials extends SignInOptions {
  email: string;
  password: string;
  redirect?: boolean;
  [key: string]: any; // Required for compatibility with SignInOptions
}

export interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  error: Error | null;
  signIn: (provider: string, options?: SignInOptions) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
} 