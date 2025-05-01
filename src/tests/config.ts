import { createClient } from '@supabase/supabase-js';

export const TEST_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  apiBaseUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api`,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  testUser: {
    email: 'test@example.com',
    password: 'Test@123456',
    fullName: 'Test User',
  },
  adminUser: {
    email: 'admin@example.com',
    password: 'Admin@123456',
    fullName: 'Admin User',
  },
};

export const supabase = createClient(
  TEST_CONFIG.supabaseUrl,
  TEST_CONFIG.supabaseAnonKey
);

export const TEST_ROUTES = {
  public: [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/reset-password',
  ],
  protected: [
    '/dashboard',
    '/profile',
    '/settings',
  ],
  admin: [
    '/admin',
    '/admin/users',
  ],
  api: {
    public: '/api/public',
    protected: '/api/protected',
    admin: '/api/admin',
  },
}; 