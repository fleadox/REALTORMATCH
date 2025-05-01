import { Session, User } from 'next-auth';

export interface AuthUser extends User {
  id: string;
  email: string;
  name?: string | null;
  role?: string;
  image?: string | null;
}

export interface AuthSession extends Session {
  user: AuthUser;
  expires: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  error: Error | null;
  signIn: (provider?: string, options?: any) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
} 