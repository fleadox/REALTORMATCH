export function verifyEnv() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
  ] as const;

  const missingVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }

  // Verify Supabase URL format
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('https://')) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL must start with https://');
  }

  // Verify NEXTAUTH_URL format
  if (!process.env.NEXTAUTH_URL?.startsWith('http')) {
    throw new Error('NEXTAUTH_URL must be a valid URL');
  }

  console.log('✅ All environment variables are properly configured');
} 