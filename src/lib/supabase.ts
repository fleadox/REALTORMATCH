import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Environment Variables:', {
    VITE_SUPABASE_URL: supabaseUrl,
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? 'Set' : 'Not Set',
    processEnv: process.env,
    importMetaEnv: import.meta.env
  });
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Create admin client for privileged operations
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    })
  : null;