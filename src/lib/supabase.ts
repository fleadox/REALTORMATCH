import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = 'https://vdditqxjenyrcgwghagq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkZGl0cXhqZW55cmNnd2doYWdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk5MjQwMDAsImV4cCI6MjAyNTUwMDAwMH0.Gy_MiBVjKgPrpFrVWnuJRIKiw_mCSMdo8u6hMeLzXYo';

// Production debug logging
if (import.meta.env.PROD) {
  console.log('Production Environment:', {
    url: supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
    anonKeyLength: supabaseAnonKey?.length,
    anonKeyPrefix: supabaseAnonKey?.substring(0, 20) + '...',
    envKeys: Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')),
    mode: import.meta.env.MODE,
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD
  });
}

// Create Supabase client with explicit configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'realtormatch.auth.token',
    storage: {
      getItem: (key) => {
        try {
          return localStorage.getItem(key);
        } catch (error) {
          console.error('Error reading from localStorage:', error);
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          console.error('Error writing to localStorage:', error);
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error('Error removing from localStorage:', error);
        }
      }
    }
  }
});

// Create admin client for privileged operations
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkZGl0cXhqZW55cmNnd2doYWdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjAyOTk2MCwiZXhwIjoyMDYxNjA1OTYwfQ.mCLoYCrQKlXe-ehNOkwcci6Ubb7kz7gOjSBT-jk3X-I';
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});