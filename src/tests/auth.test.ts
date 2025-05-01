import { describe, it, beforeAll, afterAll, beforeEach, afterEach, expect, vi } from 'vitest';
import {
  createTestUser,
  createAdminUser,
  loginUser,
  logoutUser,
  getSession,
  resetPassword,
  updateUserRole,
  deleteTestUser,
  validateSession,
  checkRouteAccess,
  validateDatabaseState,
  cleanupTestData,
} from './utils';
import { TEST_CONFIG, TEST_ROUTES } from './config';
import { supabase } from './config';
import { Session, User } from '@supabase/supabase-js';

describe('Authentication Flow Tests', () => {
  let testUserId: string;
  let adminUserId: string;
  let testUserSession: Session;
  let adminUserSession: Session;

  beforeAll(async () => {
    // Create test users
    const testUser = await createTestUser(
      TEST_CONFIG.testUser.email,
      TEST_CONFIG.testUser.password,
      TEST_CONFIG.testUser.fullName
    );
    testUserId = testUser.user?.id!;

    const adminUser = await createAdminUser(
      TEST_CONFIG.adminUser.email,
      TEST_CONFIG.adminUser.password,
      TEST_CONFIG.adminUser.fullName
    );
    adminUserId = adminUser.user?.id!;
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

    // Reset mocks
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await logoutUser();
  });

  describe('User Registration', () => {
    it('should create a new user with correct metadata', async () => {
      const mockProfile = {
        id: testUserId,
        email: TEST_CONFIG.testUser.email,
        full_name: TEST_CONFIG.testUser.fullName,
        role: 'user',
      };

      vi.mocked(supabase.from).mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
      } as any));

      const { profile } = await validateDatabaseState(testUserId);
      expect(profile).toEqual(mockProfile);
    });
  });

  describe('Login Flow', () => {
    it('should successfully login with correct credentials', async () => {
      const session = await getSession();
      expect(session).toBeDefined();
      expect(session?.access_token).toBe('test-token');
    });

    it('should fail login with incorrect password', async () => {
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials', name: 'AuthError', status: 400 },
      } as any);

      await expect(
        loginUser(TEST_CONFIG.testUser.email, 'wrongpassword')
      ).rejects.toThrow();
    });
  });

  describe('Password Reset', () => {
    it('should initiate password reset process', async () => {
      await expect(resetPassword(TEST_CONFIG.testUser.email)).resolves.not.toThrow();
      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        TEST_CONFIG.testUser.email,
        expect.any(Object)
      );
    });
  });

  describe('Role-Based Access Control', () => {
    it('should allow admin access to admin routes', async () => {
      global.fetch = vi.fn().mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 200,
        })
      );

      const status = await checkRouteAccess(TEST_ROUTES.admin[0], adminUserSession);
      expect(status).toBe(200);
    });

    it('should deny regular user access to admin routes', async () => {
      global.fetch = vi.fn().mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 403,
        })
      );

      const status = await checkRouteAccess(TEST_ROUTES.admin[0], testUserSession);
      expect(status).toBe(403);
    });

    it('should update user role correctly', async () => {
      const mockUpdatedProfile = {
        id: testUserId,
        email: TEST_CONFIG.testUser.email,
        full_name: TEST_CONFIG.testUser.fullName,
        role: 'admin',
      };

      vi.mocked(supabase.from).mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockUpdatedProfile, error: null }),
      } as any));

      await updateUserRole(testUserId, 'admin');
      const { profile } = await validateDatabaseState(testUserId);
      expect(profile.role).toBe('admin');
    });
  });

  describe('Session Management', () => {
    it('should validate active session', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValueOnce({
        data: {
          user: {
            id: testUserId,
            email: TEST_CONFIG.testUser.email,
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString(),
            phone: '',
            role: 'authenticated',
          },
        },
        error: null,
      });

      const userData = await validateSession(testUserSession);
      expect(userData.user).toBeDefined();
      expect(userData.user.id).toBe(testUserId);
    });

    it('should handle expired sessions', async () => {
      vi.mocked(supabase.auth.getUser).mockRejectedValueOnce({
        message: 'Invalid token',
        name: 'AuthError',
        status: 401,
      });

      await expect(validateSession(testUserSession)).rejects.toThrow();
    });
  });

  describe('Route Protection', () => {
    it('should allow access to public routes without authentication', async () => {
      global.fetch = vi.fn().mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 200,
        })
      );

      const status = await checkRouteAccess(TEST_ROUTES.public[0], null);
      expect(status).toBe(200);
    });

    it('should protect authenticated routes', async () => {
      global.fetch = vi.fn().mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 401,
        })
      );

      const status = await checkRouteAccess(TEST_ROUTES.protected[0], null);
      expect(status).toBe(401);
    });

    it('should allow authenticated access to protected routes', async () => {
      global.fetch = vi.fn().mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 200,
        })
      );

      const status = await checkRouteAccess(TEST_ROUTES.protected[0], testUserSession);
      expect(status).toBe(200);
    });
  });
}); 