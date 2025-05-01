import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';
import { AuthContextType, AuthSession, AuthUser } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: session, status } = useSession();
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cast session to our custom type
  const typedSession = session as AuthSession | null;
  
  // Derive user from session
  const user = useMemo(() => typedSession?.user || null, [typedSession]);

  // Compute authentication state
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  // Sign in function with error handling
  const signIn = async (provider?: string, options?: any) => {
    try {
      setIsLoading(true);
      setError(null);
      await nextAuthSignIn(provider, options);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function with error handling
  const signOut = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await nextAuthSignOut();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up function (implement based on your backend)
  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Sign up failed');
      }

      // Automatically sign in after successful sign up
      await signIn('credentials', { email, password });
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Password reset request failed');
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (data: Partial<AuthUser>) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Profile update failed');
      }

      // Refresh the session to get updated data
      // Note: You might need to implement a custom solution based on your setup
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Clear error when status changes
  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [status]);

  const contextValue = useMemo(
    () => ({
      user,
      session: typedSession,
      status,
      error,
      signIn,
      signOut,
      signUp,
      resetPassword,
      updateProfile,
      isLoading,
      isAuthenticated,
      isAdmin,
    }),
    [user, typedSession, status, error, isLoading, isAuthenticated, isAdmin]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 