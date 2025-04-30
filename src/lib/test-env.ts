export function checkEnvVariables() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  console.log('Environment Variables Check:');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Not Set');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Not Set');

  return {
    supabaseUrl: !!supabaseUrl,
    supabaseAnonKey: !!supabaseAnonKey
  };
} 