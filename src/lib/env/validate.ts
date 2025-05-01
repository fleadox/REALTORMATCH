import { z } from 'zod';

const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_KEY: z.string().min(1),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),

  // Email Configuration
  EMAIL_SERVER_HOST: z.string().min(1),
  EMAIL_SERVER_PORT: z.string().transform((val) => parseInt(val, 10)),
  EMAIL_SERVER_USER: z.string().email(),
  EMAIL_SERVER_PASSWORD: z.string().min(1),
  EMAIL_FROM: z.string().email(),

  // Node Environment
  NODE_ENV: z.enum(['development', 'test', 'production']),
});

export function validateEnv() {
  try {
    const parsed = envSchema.parse(process.env);
    return {
      valid: true,
      env: parsed,
      error: null,
    };
  } catch (error) {
    return {
      valid: false,
      env: null,
      error: error instanceof Error ? error.message : 'Unknown validation error',
    };
  }
}

// This type will be used throughout the application
export type Env = z.infer<typeof envSchema>;

// Validate environment variables immediately
const { valid, error } = validateEnv();

// Throw error in development, log in production
if (!valid) {
  if (process.env.NODE_ENV === 'development') {
    throw new Error(`Invalid environment variables: ${error}`);
  } else {
    console.error('Invalid environment variables:', error);
  }
} 