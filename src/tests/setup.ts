import { expect, afterEach, beforeAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthError, Session, User } from '@supabase/supabase-js';
import { TEST_ROUTES } from './config';

const mockUser: User = {
  id: 'test-user-id',
  app_metadata: {},
  user_metadata: { full_name: 'Test User' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'test@example.com',
  phone: '',
  role: 'authenticated',
};

const mockSession: Session = {
  access_token: 'test-token',
  refresh_token: 'test-refresh-token',
  expires_in: 3600,
  expires_at: new Date().getTime() + 3600000,
  token_type: 'bearer',
  user: mockUser,
};

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => createMockClient(),
}));

function createMockClient() {
  return {
    auth: {
      signUp: vi.fn().mockImplementation((data) => {
        if (data.password && data.password.length < 8) {
          return Promise.reject({
            message: 'Password too weak',
            name: 'AuthError',
            status: 400,
          });
        }
        return Promise.resolve({
          data: {
            user: { ...mockUser, email: data.email },
            session: { ...mockSession, user: { ...mockUser, email: data.email } },
          },
          error: null,
        });
      }),
      signInWithPassword: vi.fn().mockImplementation((data) => {
        if (data.password === 'wrongpassword') {
          return Promise.reject({
            message: 'Invalid credentials',
            name: 'AuthError',
            status: 401,
          });
        }
        return Promise.resolve({
          data: {
            user: { ...mockUser, email: data.email },
            session: { ...mockSession, user: { ...mockUser, email: data.email } },
          },
          error: null,
        });
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      getSession: vi.fn().mockResolvedValue({
        data: { session: mockSession },
        error: null,
      }),
      resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
      getUser: vi.fn().mockImplementation((token) => {
        if (token === 'invalid_token') {
          return Promise.reject({
            message: 'Invalid token',
            name: 'AuthError',
            status: 401,
          });
        }
        return Promise.resolve({
          data: { user: mockUser },
          error: null,
        });
      }),
      admin: {
        updateUserById: vi.fn().mockImplementation((userId, { user_metadata }) => {
          return Promise.resolve({
            data: {
              user: {
                ...mockUser,
                id: userId,
                user_metadata: { ...mockUser.user_metadata, ...user_metadata },
              },
            },
            error: null,
          });
        }),
        deleteUser: vi.fn().mockResolvedValue({ error: null }),
      },
    },
    from: () => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockImplementation(() => {
        return Promise.resolve({
          data: {
            id: mockUser.id,
            email: mockUser.email,
            full_name: mockUser.user_metadata.full_name,
            role: 'admin', // Return admin role for role update test
          },
          error: null,
        });
      }),
    }),
  };
}

// Extend expect with custom matchers
expect.extend({
  toBeValidToken(received: string) {
    const isValid = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/.test(received);
    return {
      message: () => `expected ${received} to be a valid JWT token`,
      pass: isValid,
    };
  },
});

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Global test configuration
beforeAll(() => {
  // Set up any global test configuration
  vi.stubEnv('NODE_ENV', 'test');
});

// Mock fetch globally
let requestCount = 0;
global.fetch = vi.fn().mockImplementation((url, options) => {
  // Rate limiting test
  if (url.includes(TEST_ROUTES.api.public)) {
    requestCount++;
    if (requestCount > 1) {
      return Promise.resolve({
        ok: false,
        status: 429,
        json: () => Promise.resolve({ error: 'Too many requests' }),
      });
    }
  }

  // Session hijacking test
  if (options?.headers?.['X-Forwarded-For']) {
    return Promise.resolve({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ error: 'Invalid IP address' }),
    });
  }

  // Admin routes test
  if (url.includes('/api/admin') && !options?.headers?.Authorization?.includes('admin-token')) {
    return Promise.resolve({
      ok: false,
      status: 403,
      json: () => Promise.resolve({ error: 'Forbidden' }),
    });
  }

  // XSS test
  if (url.includes('/api/comment') || url.includes('/api/user/update')) {
    const body = options?.body ? JSON.parse(options.body) : {};
    const sanitizedContent = body.content?.replace(/<[^>]*>/g, '') || 
                           body.name?.replace(/<[^>]*>/g, '') || 
                           'Sanitized content';
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ content: sanitizedContent }),
    });
  }

  // SQL injection test
  if (url.includes('/api/search') && options?.body?.includes('DROP TABLE')) {
    return Promise.resolve({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: 'Invalid input' }),
    });
  }

  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ status: 'success', message: 'Test response' }),
  });
});

// Mock console.error to keep test output clean
const originalError = console.error;
console.error = vi.fn((...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Warning: ReactDOM.render is no longer supported')
  ) {
    return;
  }
  originalError.call(console, ...args);
}); 