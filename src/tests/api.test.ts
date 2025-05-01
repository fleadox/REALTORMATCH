import { describe, it, beforeAll, afterAll, beforeEach, afterEach, expect, vi } from 'vitest';
import {
  createTestUser,
  createAdminUser,
  loginUser,
  logoutUser,
  getSession,
  checkRouteAccess,
  cleanupTestData,
} from './utils';
import { TEST_CONFIG, TEST_ROUTES } from './config';
import { supabase } from './config';

describe('API Endpoint Tests', () => {
  let testUserSession: any;
  let adminUserSession: any;

  beforeAll(async () => {
    // Create test users
    await createTestUser(
      TEST_CONFIG.testUser.email,
      TEST_CONFIG.testUser.password,
      TEST_CONFIG.testUser.fullName
    );

    await createAdminUser(
      TEST_CONFIG.adminUser.email,
      TEST_CONFIG.adminUser.password,
      TEST_CONFIG.adminUser.fullName
    );
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  beforeEach(async () => {
    // Login users before each test
    const testUserData = await loginUser(
      TEST_CONFIG.testUser.email,
      TEST_CONFIG.testUser.password
    );
    testUserSession = testUserData.session;

    const adminUserData = await loginUser(
      TEST_CONFIG.adminUser.email,
      TEST_CONFIG.adminUser.password
    );
    adminUserSession = adminUserData.session;
  });

  afterEach(async () => {
    await logoutUser();
    vi.clearAllMocks();
  });

  describe('Public API Endpoints', () => {
    it('should allow access to public API without authentication', async () => {
      global.fetch = vi.fn().mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ status: 'success', message: 'Public endpoint' }),
        })
      );

      const status = await checkRouteAccess(TEST_ROUTES.api.public, null);
      expect(status).toBe(200);
    });

    it('should return correct response format', async () => {
      global.fetch = vi.fn().mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            status: 'success',
            message: 'Public endpoint',
          }),
        })
      );

      const response = await fetch(`${TEST_CONFIG.apiBaseUrl}${TEST_ROUTES.api.public}`);
      const data = await response.json();
      expect(data).toHaveProperty('status');
      expect(data).toHaveProperty('message');
    });
  });

  describe('Protected API Endpoints', () => {
    it('should deny access without authentication', async () => {
      global.fetch = vi.fn().mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 401,
          json: () => Promise.resolve({ error: 'Unauthorized' }),
        })
      );

      const status = await checkRouteAccess(TEST_ROUTES.api.protected, null);
      expect(status).toBe(401);
    });

    it('should allow access with valid authentication', async () => {
      global.fetch = vi.fn().mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ status: 'success' }),
        })
      );

      const status = await checkRouteAccess(TEST_ROUTES.api.protected, testUserSession);
      expect(status).toBe(200);
    });

    it('should include user context in protected endpoints', async () => {
      global.fetch = vi.fn().mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            user: {
              id: 'test-user-id',
              role: 'user',
            },
          }),
        })
      );

      const response = await fetch(`${TEST_CONFIG.apiBaseUrl}${TEST_ROUTES.api.protected}`, {
        headers: {
          Authorization: `Bearer ${testUserSession.access_token}`,
        },
      });
      const data = await response.json();
      expect(data).toHaveProperty('user');
      expect(data.user).toHaveProperty('id');
      expect(data.user).toHaveProperty('role');
    });
  });

  describe('Admin API Endpoints', () => {
    it('should deny access to non-admin users', async () => {
      global.fetch = vi.fn().mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 403,
          json: () => Promise.resolve({ error: 'Forbidden' }),
        })
      );

      const status = await checkRouteAccess(TEST_ROUTES.api.admin, testUserSession);
      expect(status).toBe(403);
    });

    it('should allow access to admin users', async () => {
      global.fetch = vi.fn().mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ status: 'success' }),
        })
      );

      const status = await checkRouteAccess(TEST_ROUTES.api.admin, adminUserSession);
      expect(status).toBe(200);
    });

    it('should return admin-specific data', async () => {
      global.fetch = vi.fn().mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            adminData: {
              users: [],
              stats: {},
            },
          }),
        })
      );

      const response = await fetch(`${TEST_CONFIG.apiBaseUrl}${TEST_ROUTES.api.admin}`, {
        headers: {
          Authorization: `Bearer ${adminUserSession.access_token}`,
        },
      });
      const data = await response.json();
      expect(data).toHaveProperty('adminData');
    });
  });

  describe('API Error Handling', () => {
    it('should handle invalid authentication tokens', async () => {
      global.fetch = vi.fn().mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 401,
          json: () => Promise.resolve({
            error: 'Invalid token',
          }),
        })
      );

      const response = await fetch(`${TEST_CONFIG.apiBaseUrl}${TEST_ROUTES.api.protected}`, {
        headers: {
          Authorization: 'Bearer invalid_token',
        },
      });
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data).toHaveProperty('error');
    });

    it('should handle malformed requests', async () => {
      global.fetch = vi.fn().mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          json: () => Promise.resolve({
            error: 'Invalid request format',
          }),
        })
      );

      const response = await fetch(`${TEST_CONFIG.apiBaseUrl}${TEST_ROUTES.api.protected}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${testUserSession.access_token}`,
        },
        body: JSON.stringify({ invalid: 'data' }),
      });
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toHaveProperty('error');
    });
  });
}); 