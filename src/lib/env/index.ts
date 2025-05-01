import { validateEnv, type Env } from './validate';

class Environment {
  private static instance: Environment;
  private env: Env;

  private constructor() {
    const { valid, env, error } = validateEnv();
    if (!valid || !env) {
      throw new Error(`Environment validation failed: ${error}`);
    }
    this.env = env;
  }

  public static getInstance(): Environment {
    if (!Environment.instance) {
      Environment.instance = new Environment();
    }
    return Environment.instance;
  }

  // Supabase
  public get supabaseUrl() {
    return this.env.NEXT_PUBLIC_SUPABASE_URL;
  }

  public get supabaseAnonKey() {
    return this.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  }

  public get supabaseServiceKey() {
    return this.env.SUPABASE_SERVICE_KEY;
  }

  // Google OAuth
  public get googleClientId() {
    return this.env.GOOGLE_CLIENT_ID;
  }

  public get googleClientSecret() {
    return this.env.GOOGLE_CLIENT_SECRET;
  }

  // Email
  public get emailConfig() {
    return {
      host: this.env.EMAIL_SERVER_HOST,
      port: this.env.EMAIL_SERVER_PORT,
      auth: {
        user: this.env.EMAIL_SERVER_USER,
        pass: this.env.EMAIL_SERVER_PASSWORD,
      },
      from: this.env.EMAIL_FROM,
    };
  }

  // Environment
  public get nodeEnv() {
    return this.env.NODE_ENV;
  }

  public get isDevelopment() {
    return this.env.NODE_ENV === 'development';
  }

  public get isProduction() {
    return this.env.NODE_ENV === 'production';
  }

  public get isTest() {
    return this.env.NODE_ENV === 'test';
  }
}

// Export a singleton instance
export const env = Environment.getInstance();

// Export type for use in other files
export type { Env } from './validate'; 