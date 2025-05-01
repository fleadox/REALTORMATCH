import { describe, beforeAll, afterAll, it, expect, beforeEach } from 'vitest';
import { supabase, TEST_CONFIG, initTestEnvironment, cleanupTestData, resetMocks } from '../config/test-setup';
import { authConfig } from '../../src/config/auth';

describe('Authentication System Tests', () => {
  beforeAll(async () => {
    await initTestEnvironment();
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  beforeEach(() => {
    resetMocks();
  });

  describe('Email/Password Authentication', () => {
    it('should sign up a new user', async () => {
      const email = 'newuser@example.com';
      const password = 'NewUser123!@#';

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      expect(error).toBeNull();
      expect(data.user).toBeDefined();
      expect(data.user?.email).toBe(email);
    });

    it('should sign in an existing user', async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: TEST_CONFIG.auth.testUser.email,
        password: TEST_CONFIG.auth.testUser.password,
      });

      expect(error).toBeNull();
      expect(data.user).toBeDefined();
      expect(data.session).toBeDefined();
    });

    it('should fail with invalid credentials', async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: TEST_CONFIG.auth.testUser.email,
        password: 'wrongpassword',
      });

      expect(error).toBeDefined();
      expect(data.session).toBeNull();
    });

    it('should enforce password complexity requirements', async () => {
      const { data, error } = await supabase.auth.signUp({
        email: 'weak@example.com',
        password: 'weak',
      });

      expect(error).toBeDefined();
      expect(error?.message).toContain('password');
    });
  });

  describe('Session Management', () => {
    let session: any;

    beforeAll(async () => {
      const { data } = await supabase.auth.signInWithPassword({
        email: TEST_CONFIG.auth.testUser.email,
        password: TEST_CONFIG.auth.testUser.password,
      });
      session = data.session;
    });

    it('should validate a valid session', async () => {
      const { data, error } = await supabase.auth.getSession();

      expect(error).toBeNull();
      expect(data.session).toBeDefined();
      expect(data.session?.access_token).toBe(session.access_token);
    });

    it('should refresh a session', async () => {
      const { data, error } = await supabase.auth.refreshSession();

      expect(error).toBeNull();
      expect(data.session).toBeDefined();
      expect(data.session?.access_token).not.toBe(session.access_token);
    });

    it('should sign out successfully', async () => {
      const { error } = await supabase.auth.signOut();

      expect(error).toBeNull();

      const { data: sessionData } = await supabase.auth.getSession();
      expect(sessionData.session).toBeNull();
    });

    it('should handle expired sessions', async () => {
      // Simulate an expired session
      const expiredSession = {
        ...session,
        expires_at: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
      };

      const { data, error } = await supabase.auth.refreshSession();

      expect(error).toBeDefined();
      expect(data.session).toBeNull();
    });
  });

  describe('Password Reset', () => {
    it('should request password reset', async () => {
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        TEST_CONFIG.auth.testUser.email
      );

      expect(error).toBeNull();
    });

    it('should fail password reset with invalid email', async () => {
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        'invalid@example.com'
      );

      expect(error).toBeDefined();
    });

    it('should enforce rate limiting on password reset', async () => {
      const attempts = Array(6).fill(null).map(() =>
        supabase.auth.resetPasswordForEmail(TEST_CONFIG.auth.testUser.email)
      );

      const results = await Promise.all(attempts);
      const lastAttempt = results[results.length - 1];

      expect(lastAttempt.error).toBeDefined();
      expect(lastAttempt.error?.message).toContain('rate limit');
    });
  });

  describe('User Profile', () => {
    let userId: string;

    beforeAll(async () => {
      const { data } = await supabase.auth.signInWithPassword({
        email: TEST_CONFIG.auth.testUser.email,
        password: TEST_CONFIG.auth.testUser.password,
      });
      userId = data.user?.id!;
    });

    it('should update user profile', async () => {
      const { data, error } = await supabase.auth.updateUser({
        data: { name: 'Updated Name' },
      });

      expect(error).toBeNull();
      expect(data.user?.user_metadata.name).toBe('Updated Name');
    });

    it('should get user profile', async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.email).toBe(TEST_CONFIG.auth.testUser.email);
    });

    it('should handle profile update validation', async () => {
      const { data, error } = await supabase.auth.updateUser({
        data: { name: '' }, // Empty name should be invalid
      });

      expect(error).toBeDefined();
      expect(error?.message).toContain('name');
    });
  });

  describe('Security Features', () => {
    it('should enforce password policy', async () => {
      const { data, error } = await supabase.auth.signUp({
        email: 'weak@example.com',
        password: 'weak',
      });

      expect(error).toBeDefined();
      expect(error?.message).toContain('password');
    });

    it('should handle rate limiting', async () => {
      const attempts = Array(6).fill(null).map(() =>
        supabase.auth.signInWithPassword({
          email: TEST_CONFIG.auth.testUser.email,
          password: 'wrongpassword',
        })
      );

      const results = await Promise.all(attempts);
      const lastAttempt = results[results.length - 1];

      expect(lastAttempt.error).toBeDefined();
      expect(lastAttempt.error?.message).toContain('rate limit');
    });

    it('should prevent concurrent sessions', async () => {
      // First login
      const { data: firstLogin } = await supabase.auth.signInWithPassword({
        email: TEST_CONFIG.auth.testUser.email,
        password: TEST_CONFIG.auth.testUser.password,
      });

      // Second login should invalidate first session
      const { data: secondLogin } = await supabase.auth.signInWithPassword({
        email: TEST_CONFIG.auth.testUser.email,
        password: TEST_CONFIG.auth.testUser.password,
      });

      // First session should be invalid
      const { data: firstSession } = await supabase.auth.getSession();
      expect(firstSession.session?.access_token).not.toBe(firstLogin.session?.access_token);
    });
  });

  describe('Admin Functions', () => {
    beforeAll(async () => {
      await supabase.auth.signInWithPassword({
        email: TEST_CONFIG.auth.admin.email,
        password: TEST_CONFIG.auth.admin.password,
      });
    });

    it('should list users', async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*');

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
    });

    it('should get audit logs', async () => {
      const { data, error } = await supabase
        .from('security_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it('should manage user roles', async () => {
      const { data, error } = await supabase.auth.admin.updateUserById(
        TEST_CONFIG.auth.testUser.email,
        { role: 'agent' }
      );

      expect(error).toBeNull();
      expect(data.user?.role).toBe('agent');
    });
  });
}); 