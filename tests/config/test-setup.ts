import { createClient } from '@supabase/supabase-js';
import { authConfig } from '../../src/config/auth';
import { vi } from 'vitest';

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_KEY = 'test-service-key';

// Test environment variables
export const TEST_CONFIG = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceKey: process.env.SUPABASE_SERVICE_KEY!,
  },
  auth: {
    testUser: {
      email: 'test@example.com',
      password: 'Test123!@#',
      name: 'Test User',
    },
    admin: {
      email: 'admin@example.com',
      password: 'Admin123!@#',
    },
  },
};

// Create mock Supabase client
const mockSupabaseClient = {
  auth: {
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn(),
    refreshSession: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    updateUser: vi.fn(),
    admin: {
      createUser: vi.fn(),
    },
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn(),
  })),
};

// Create Supabase client for tests
export const supabase = createClient(
  TEST_CONFIG.supabase.url,
  TEST_CONFIG.supabase.serviceKey
);

// Test cleanup function
export const cleanupTestData = async () => {
  await supabase
    .from('users')
    .delete()
    .in('email', [TEST_CONFIG.auth.testUser.email, TEST_CONFIG.auth.admin.email]);

  await supabase
    .from('sessions')
    .delete()
    .eq('user_id', TEST_CONFIG.auth.testUser.email);
};

// Initialize test environment
export const initTestEnvironment = async () => {
  await cleanupTestData();
  
  // Create test users
  await supabase.auth.admin.createUser({
    email: TEST_CONFIG.auth.testUser.email,
    password: TEST_CONFIG.auth.testUser.password,
    user_metadata: { name: TEST_CONFIG.auth.testUser.name },
  });

  await supabase.auth.admin.createUser({
    email: TEST_CONFIG.auth.admin.email,
    password: TEST_CONFIG.auth.admin.password,
    user_metadata: { role: 'admin' },
  });
};

// Mock request/response
export const createMockRequest = () => ({
  headers: {},
  method: 'GET',
  query: {},
  cookies: {},
});

export const createMockResponse = () => ({
  setHeader: vi.fn(),
  getHeader: vi.fn(),
  status: vi.fn().mockReturnThis(),
});

// Reset all mocks before each test
export const resetMocks = () => {
  vi.clearAllMocks();
}; 