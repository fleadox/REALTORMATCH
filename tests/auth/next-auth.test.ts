import { describe, beforeAll, afterAll, it, expect, beforeEach } from 'vitest';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../src/app/api/auth/[...nextauth]/route';
import { TEST_CONFIG, initTestEnvironment, cleanupTestData, resetMocks } from '../config/test-setup';
import type { NextAuthOptions } from 'next-auth';
import type { TestJWT, TestSession, TestUser } from '../types/auth';
import type { IncomingMessage } from 'http';
import type { ServerResponse } from 'http';
import type { User } from 'next-auth';

// Mock JWT token with required properties
const createMockJWT = (overrides: Partial<TestJWT> = {}): TestJWT => ({
  id: 'test-id',
  sub: 'test-id',
  email: TEST_CONFIG.auth.testUser.email,
  name: 'Test User',
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
  jti: 'test-jwt-id',
  ...overrides,
});

// Simple mock request/response
const createMockReqRes = () => {
  const req = {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
    query: {},
    cookies: {},
    url: '/',
  } as unknown as IncomingMessage & { cookies: Record<string, string> };

  const res = {
    setHeader: () => {},
    getHeader: () => null,
    status: () => ({ end: () => {} }),
  } as unknown as ServerResponse;

  return { req, res };
};

describe('Next.js Authentication Tests', () => {
  beforeAll(async () => {
    await initTestEnvironment();
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  beforeEach(() => {
    resetMocks();
  });

  describe('Auth.js Configuration', () => {
    it('should have valid configuration', () => {
      expect(authOptions).toBeDefined();
      expect(authOptions.providers).toBeDefined();
      expect(authOptions.callbacks).toBeDefined();
    });

    it('should have required callbacks', () => {
      const requiredCallbacks = [
        'signIn',
        'session',
        'jwt',
      ] as const;

      requiredCallbacks.forEach(callback => {
        expect(authOptions.callbacks?.[callback]).toBeDefined();
      });
    });
  });

  describe('Session Handling', () => {
    it('should create a valid session', async () => {
      const { req, res } = createMockReqRes();

      const session = await getServerSession(req, res, authOptions);

      expect(session).toBeDefined();
      expect(session?.user).toBeDefined();
    });

    it('should handle session callbacks', async () => {
      const mockSession: TestSession = {
        user: {
          id: 'test-id',
          email: TEST_CONFIG.auth.testUser.email,
          name: 'Test User',
          emailVerified: new Date(),
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };

      const mockToken = createMockJWT();

      const result = await authOptions.callbacks?.session?.({
        session: mockSession,
        token: mockToken,
        user: mockSession.user as User,
        newSession: null,
        trigger: 'update',
      });

      expect(result).toBeDefined();
      expect(result?.user).toBeDefined();
      expect(result?.user?.id).toBe(mockToken.sub);
    });
  });

  describe('JWT Handling', () => {
    it('should handle JWT callbacks', async () => {
      const mockToken = createMockJWT();
      const mockUser: TestUser = {
        id: 'test-id',
        email: TEST_CONFIG.auth.testUser.email,
        name: 'Test User',
        emailVerified: new Date(),
      };

      const result = await authOptions.callbacks?.jwt?.({
        token: mockToken,
        user: mockUser as User,
        account: null,
        profile: undefined,
        isNewUser: false,
      });

      expect(result).toBeDefined();
      expect(result?.sub).toBe(mockToken.sub);
      expect(result?.email).toBe(mockToken.email);
    });

    it('should handle token refresh', async () => {
      const mockToken = createMockJWT({
        exp: Math.floor(Date.now() / 1000) - 3600, // Expired token
      });

      const result = await authOptions.callbacks?.jwt?.({
        token: mockToken,
        user: null as unknown as User,
        account: null,
        profile: undefined,
        isNewUser: false,
      });

      expect(result).toBeDefined();
      expect(result?.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
    });
  });

  describe('Protected Routes', () => {
    it('should protect routes with valid session', async () => {
      const { req, res } = createMockReqRes();
      req.cookies['next-auth.session-token'] = 'valid-token';

      const session = await getServerSession(req, res, authOptions);

      expect(session).toBeDefined();
      expect(session?.user).toBeDefined();
    });

    it('should reject requests without session', async () => {
      const { req, res } = createMockReqRes();

      const session = await getServerSession(req, res, authOptions);

      expect(session).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid tokens', async () => {
      const { req, res } = createMockReqRes();
      req.cookies['next-auth.session-token'] = 'invalid-token';

      const session = await getServerSession(req, res, authOptions);

      expect(session).toBeNull();
    });

    it('should handle expired sessions', async () => {
      const { req, res } = createMockReqRes();
      req.cookies['next-auth.session-token'] = 'expired-token';

      const session = await getServerSession(req, res, authOptions);

      expect(session).toBeNull();
    });
  });
}); 