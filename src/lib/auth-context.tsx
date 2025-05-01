import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { logger } from './logger';

interface AuthState {
  user: any | null;
  session: any | null;
  loading: boolean;
  error: Error | null;
  lastFetched: number;
}

type AuthAction =
  | { type: 'SET_USER'; payload: any }
  | { type: 'SET_SESSION'; payload: any }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null }
  | { type: 'CLEAR_AUTH' };

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
  error: null,
  lastFetched: 0,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, lastFetched: Date.now() };
    case 'SET_SESSION':
      return { ...state, session: action.payload, lastFetched: Date.now() };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_AUTH':
      return { ...initialState, loading: false };
    default:
      return state;
  }
}

const AuthContext = createContext<{
  state: AuthState;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const refreshSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (session) {
        dispatch({ type: 'SET_SESSION', payload: session });
        dispatch({ type: 'SET_USER', payload: session.user });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error as Error });
      await logger.logError({
        error: 'Session refresh failed',
        severity: 'error',
        timestamp: new Date().toISOString(),
        context: { error }
      });
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      dispatch({ type: 'SET_SESSION', payload: data.session });
      dispatch({ type: 'SET_USER', payload: data.user });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error as Error });
      await logger.logError({
        error: 'Sign in failed',
        severity: 'error',
        timestamp: new Date().toISOString(),
        context: { email, error }
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      dispatch({ type: 'CLEAR_AUTH' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error as Error });
      await logger.logError({
        error: 'Sign out failed',
        severity: 'error',
        timestamp: new Date().toISOString(),
        context: { error }
      });
    }
  }, []);

  // Auto-refresh session when needed
  useEffect(() => {
    const shouldRefresh = Date.now() - state.lastFetched > CACHE_DURATION;
    if (shouldRefresh) {
      refreshSession();
    }
  }, [state.lastFetched, refreshSession]);

  // Set up auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          dispatch({ type: 'SET_SESSION', payload: session });
          dispatch({ type: 'SET_USER', payload: session?.user });
        } else if (event === 'SIGNED_OUT') {
          dispatch({ type: 'CLEAR_AUTH' });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ state, signIn, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 