import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if error is a Supabase error
export const isSupabaseError = (error: unknown): error is { message: string; status: number } => {
  return typeof error === 'object' && error !== null && 'message' in error && 'status' in error;
}; 