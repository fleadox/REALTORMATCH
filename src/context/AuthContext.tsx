import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import { createClient, UserIdentity as SupabaseUserIdentity } from '@supabase/supabase-js';
import { UserProfile, ConnectedAccount, Session } from '../types/user';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export interface User {
  id: string;
  email: string;
  token: string;
  user_metadata: {
    role?: string;
    full_name?: string;
    phone?: string;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  verifyResetToken: (token: string) => Promise<boolean>;
  updateProfile: (data: { full_name?: string; phone?: string }) => Promise<boolean>;
  changeEmail: (newEmail: string, password: string) => Promise<boolean>;
  deleteAccount: (password: string) => Promise<boolean>;
  getConnectedAccounts: () => Promise<ConnectedAccount[]>;
  unlinkProvider: (provider: string) => Promise<boolean>;
  getSessions: () => Promise<Session[]>;
  revokeSession: (sessionId: string) => Promise<boolean>;
  exportUserData: () => Promise<Blob>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface UserIdentity extends SupabaseUserIdentity {
  provider: string;
  id: string;
}

interface SessionData {
  id: string;
  user_id: string;
  user_agent?: string;
  ip_address?: string;
  created_at: string;
  last_active_at?: string;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email!,
          token: data.session?.access_token || '',
          user_metadata: data.user.user_metadata,
        });
        toast.success('Successfully signed in');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login error:', err);
      const message = err instanceof Error ? err.message : 'Failed to sign in';
      toast.error(message);
      setError(err instanceof Error ? err : new Error(message));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      toast.success('Successfully signed out');
    } catch (err) {
      console.error('Logout error:', err);
      const message = err instanceof Error ? err.message : 'Failed to sign out';
      toast.error(message);
      setError(err instanceof Error ? err : new Error(message));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        toast.success('Registration successful! Please check your email to verify your account.');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Registration error:', err);
      const message = err instanceof Error ? err.message : 'Failed to register';
      toast.error(message);
      setError(err instanceof Error ? err : new Error(message));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${import.meta.env.VITE_APP_URL}/auth/reset-password`,
      });

      if (error) throw error;

      toast.success('Password reset instructions sent to your email');
      return true;
    } catch (err) {
      console.error('Password reset error:', err);
      const message = err instanceof Error ? err.message : 'Failed to send reset email';
      toast.error(message);
      setError(err instanceof Error ? err : new Error(message));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyResetToken = async (token: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'recovery',
      });

      if (error) throw error;

      if (data.user) {
        toast.success('Token verified successfully');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Token verification error:', err);
      const message = err instanceof Error ? err.message : 'Failed to verify token';
      toast.error(message);
      setError(err instanceof Error ? err : new Error(message));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success('Password updated successfully');
      return true;
    } catch (err) {
      console.error('Password update error:', err);
      const message = err instanceof Error ? err.message : 'Failed to update password';
      toast.error(message);
      setError(err instanceof Error ? err : new Error(message));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: { full_name?: string; phone?: string }) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: data.full_name,
          phone: data.phone,
        },
      });

      if (error) throw error;

      // Update local user state
      if (user) {
        setUser({
          ...user,
          user_metadata: {
            ...user.user_metadata,
            ...data,
          },
        });
      }

      return true;
    } catch (err) {
      console.error('Profile update error:', err);
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      toast.error(message);
      setError(err instanceof Error ? err : new Error(message));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const changeEmail = async (newEmail: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password,
      });

      if (signInError) throw new Error('Invalid password');

      const { error } = await supabase.auth.updateUser({ email: newEmail });

      if (error) throw error;

      toast.success('Verification email sent to your new email address');
      return true;
    } catch (err) {
      console.error('Email change error:', err);
      const message = err instanceof Error ? err.message : 'Failed to change email';
      toast.error(message);
      setError(err instanceof Error ? err : new Error(message));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async (password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password,
      });

      if (signInError) throw new Error('Invalid password');

      const { error } = await supabase.auth.admin.deleteUser(user?.id || '');

      if (error) throw error;

      setUser(null);
      toast.success('Your account has been deleted');
      return true;
    } catch (err) {
      console.error('Account deletion error:', err);
      const message = err instanceof Error ? err.message : 'Failed to delete account';
      toast.error(message);
      setError(err instanceof Error ? err : new Error(message));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getConnectedAccounts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('auth_identities')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;

      return (data || []) as ConnectedAccount[];
    } catch (err) {
      console.error('Get connected accounts error:', err);
      const message = err instanceof Error ? err.message : 'Failed to get connected accounts';
      toast.error(message);
      setError(err instanceof Error ? err : new Error(message));
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const unlinkProvider = async (provider: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Get the identity ID for the provider
      const { data: identities, error: identityError } = await supabase
        .from('auth_identities')
        .select('identity_id')
        .eq('user_id', user?.id)
        .eq('provider', provider)
        .single();

      if (identityError) throw identityError;

      const identity: SupabaseUserIdentity = {
        id: identities.identity_id,
        user_id: user?.id || '',
        identity_data: {
          provider,
          sub: user?.id || ''
        },
        provider,
        created_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        identity_id: identities.identity_id
      };

      const { error } = await supabase.auth.unlinkIdentity(identity);

      if (error) throw error;

      toast.success(`Unlinked ${provider} account`);
      return true;
    } catch (err) {
      console.error('Unlink provider error:', err);
      const message = err instanceof Error ? err.message : 'Failed to unlink provider';
      toast.error(message);
      setError(err instanceof Error ? err : new Error(message));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getSessions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get current session
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      // Get all sessions for the user from the database
      const { data: sessions, error: sessionsError } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user?.id);

      if (sessionsError) throw sessionsError;

      return (sessions as SessionData[]).map((session) => ({
        id: session.id,
        user_agent: session.user_agent || 'Unknown',
        ip_address: session.ip_address || 'Unknown',
        created_at: session.created_at,
        last_active_at: session.last_active_at || session.created_at,
        is_current: currentSession?.access_token === session.id
      }));
    } catch (err) {
      console.error('Get sessions error:', err);
      const message = err instanceof Error ? err.message : 'Failed to get sessions';
      toast.error(message);
      setError(err instanceof Error ? err : new Error(message));
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const revokeSession = async (sessionId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // First try to sign out the session using Supabase Auth
      await supabase.auth.admin.signOut(sessionId);

      // Then remove it from our sessions table
      const { error } = await supabase
        .from('user_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      toast.success('Session revoked successfully');
      return true;
    } catch (err) {
      console.error('Revoke session error:', err);
      const message = err instanceof Error ? err.message : 'Failed to revoke session';
      toast.error(message);
      setError(err instanceof Error ? err : new Error(message));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const exportUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch user data from various sources
      const [profile, sessions, connectedAccounts] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user?.id).single(),
        getSessions(),
        getConnectedAccounts(),
      ]);

      const userData = {
        profile: profile.data,
        user: {
          id: user?.id,
          email: user?.email,
          created_at: new Date().toISOString(), // Use current date as fallback
          user_metadata: user?.user_metadata,
        },
        sessions,
        connected_accounts: connectedAccounts,
      };

      // Convert to JSON and create blob
      const blob = new Blob([JSON.stringify(userData, null, 2)], {
        type: 'application/json',
      });

      return blob;
    } catch (err) {
      console.error('Export data error:', err);
      const message = err instanceof Error ? err.message : 'Failed to export data';
      toast.error(message);
      setError(err instanceof Error ? err : new Error(message));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    logout,
    register,
    resetPassword,
    updatePassword,
    verifyResetToken,
    updateProfile,
    changeEmail,
    deleteAccount,
    getConnectedAccounts,
    unlinkProvider,
    getSessions,
    revokeSession,
    exportUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};