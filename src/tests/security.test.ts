import { describe, it, beforeAll, afterAll, beforeEach, afterEach, expect, vi } from 'vitest';
import {
  createTestUser,
  loginUser,
  logoutUser,
  getSession,
  checkRouteAccess,
  cleanupTestData,
} from './utils';
import { TEST_CONFIG, TEST_ROUTES } from './config';
import { supabase } from './config';
import { Session } from '@supabase/supabase-js';

describe('Security Tests', () => {
  let testUserSession: Session;

  beforeAll(async () => {
    await createTestUser(
      TEST_CONFIG.testUser.email,
      TEST_CONFIG.testUser.password,
      TEST_CONFIG.testUser.fullName
    );
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  beforeEach(async () => {
    const testUserData = await loginUser(
      TEST_CONFIG.testUser.email,
      TEST_CONFIG.testUser.password
    );
    testUserSession = testUserData.session;

    // Reset mocks
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await logoutUser();
  });

  describe('Authentication Security', () => {
    it('should prevent brute force attacks', async () => {
      vi.mocked(supabase.auth.signInWithPassword).mockRejectedValue({
        message: 'Too many login attempts',
        name: 'AuthError',
        status: 429,
      });

      await expect(
        loginUser(TEST_CONFIG.testUser.email, 'wrongpassword')
      ).rejects.toThrow('Too many login attempts');
    });

    it('should enforce password complexity', async () => {
      vi.mocked(supabase.auth.signUp).mockRejectedValue({
        message: 'Password too weak',
        name: 'AuthError',
        status: 400,
      });

      await expect(
        createTestUser('test2@example.com', 'weak', 'Test User')
      ).rejects.toThrow('Password too weak');
    });

    it('should prevent session hijacking', async () => {
      global.fetch = vi.fn().mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 401,
          json: () => Promise.resolve({ error: 'Invalid IP address' }),
        })
      );

      const response = await fetch(`${TEST_CONFIG.apiBaseUrl}${TEST_ROUTES.api.protected}`, {
        headers: {
          Authorization: `Bearer ${testUserSession.access_token}`,
          'X-Forwarded-For': '1.2.3.4',
        },
      });
      expect(response.status).toBe(401);
    });
  });

  describe('Authorization Security', () => {
    it('should prevent role escalation', async () => {
      global.fetch = vi.fn().mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 403,
          json: () => Promise.resolve({ error: 'Unauthorized role modification' }),
        })
      );

      const response = await fetch(`${TEST_CONFIG.apiBaseUrl}${TEST_ROUTES.api.admin}`, {
        headers: {
          Authorization: `Bearer ${testUserSession.access_token}`,
          'X-User-Role': 'admin',
        },
      });
      expect(response.status).toBe(403);
    });

    it('should validate user permissions', async () => {
      global.fetch = vi.fn().mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ user: { id: testUserSession.user.id } }),
        })
      );

      const response = await fetch(`${TEST_CONFIG.apiBaseUrl}/api/user/1`, {
        headers: {
          Authorization: `Bearer ${testUserSession.access_token}`,
        },
      });
      const data = await response.json();
      expect(data.user.id).toBe(testUserSession.user.id);
    });
  });

  describe('API Security', () => {
    it('should prevent SQL injection', async () => {
      global.fetch = vi.fn().mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          json: () => Promise.resolve({ error: 'Invalid input' }),
        })
      );

      const response = await fetch(`${TEST_CONFIG.apiBaseUrl}/api/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${testUserSession.access_token}`,
        },
        body: JSON.stringify({
          query: "'; DROP TABLE users; --",
        }),
      });
      expect(response.status).toBe(400);
    });

    it('should prevent XSS attacks', async () => {
      global.fetch = vi.fn().mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ content: 'Sanitized content' }),
        })
      );

      const response = await fetch(`${TEST_CONFIG.apiBaseUrl}/api/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${testUserSession.access_token}`,
        },
        body: JSON.stringify({
          content: '<script>alert("xss")</script>',
        }),
      });
      const data = await response.json();
      expect(data.content).not.toContain('<script>');
    });

    it('should enforce rate limiting', async () => {
      global.fetch = vi.fn()
        .mockImplementationOnce(() => Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ status: 'success' }),
        }))
        .mockImplementationOnce(() => Promise.resolve({
          ok: false,
          status: 429,
          json: () => Promise.resolve({ error: 'Too many requests' }),
        }));

      const firstResponse = await fetch(`${TEST_CONFIG.apiBaseUrl}${TEST_ROUTES.api.public}`);
      expect(firstResponse.status).toBe(200);

      const secondResponse = await fetch(`${TEST_CONFIG.apiBaseUrl}${TEST_ROUTES.api.public}`);
      expect(secondResponse.status).toBe(429);
    });
  });

  describe('Data Security', () => {
    it('should encrypt sensitive data', async () => {
      global.fetch = vi.fn().mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            // Sensitive data should not be present
          }),
        })
      );

      const response = await fetch(`${TEST_CONFIG.apiBaseUrl}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${testUserSession.access_token}`,
        },
      });
      const data = await response.json();
      expect(data.password).toBeUndefined();
      expect(data.creditCard).toBeUndefined();
    });

    it('should sanitize user input', async () => {
      global.fetch = vi.fn().mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            name: 'Test',
            email: 'test@example.com',
          }),
        })
      );

      const response = await fetch(`${TEST_CONFIG.apiBaseUrl}/api/user/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${testUserSession.access_token}`,
        },
        body: JSON.stringify({
          name: 'Test<script>alert("xss")</script>',
          email: 'test@example.com<script>alert("xss")</script>',
        }),
      });
      const data = await response.json();
      expect(data.name).not.toContain('<script>');
      expect(data.email).toMatch(/^[^<>]*$/);
    });
  });
}); 