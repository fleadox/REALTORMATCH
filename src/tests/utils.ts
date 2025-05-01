import { supabase, TEST_CONFIG } from './config';
import { UserSession } from '../types/middleware';

export async function createTestUser(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: 'user',
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function createAdminUser(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: 'admin',
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession(): Promise<UserSession | null> {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session as UserSession | null;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${TEST_CONFIG.baseUrl}/auth/reset-password`,
  });
  if (error) throw error;
}

export async function updateUserRole(userId: string, role: string) {
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { role },
  });
  if (error) throw error;
}

export async function deleteTestUser(userId: string) {
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) throw error;
}

export async function validateSession(session: UserSession) {
  const { data, error } = await supabase.auth.getUser(session.access_token);
  if (error) throw error;
  return data;
}

export async function checkRouteAccess(path: string, session: UserSession | null) {
  const response = await fetch(`${TEST_CONFIG.baseUrl}${path}`, {
    headers: session ? {
      Authorization: `Bearer ${session.access_token}`,
    } : {},
  });
  return response.status;
}

export async function validateDatabaseState(userId: string) {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  const { data: sessions, error: sessionsError } = await supabase
    .from('user_sessions')
    .select('*')
    .eq('user_id', userId);

  if (profileError) throw profileError;
  if (sessionsError) throw sessionsError;

  return {
    profile,
    sessions,
  };
}

export async function cleanupTestData() {
  // Delete test users
  const { data: users, error: usersError } = await supabase
    .from('profiles')
    .select('id')
    .or(`email.eq.${TEST_CONFIG.testUser.email},email.eq.${TEST_CONFIG.adminUser.email}`);

  if (usersError) throw usersError;

  for (const user of users || []) {
    await deleteTestUser(user.id);
  }

  // Clean up sessions
  const { error: sessionsError } = await supabase
    .from('user_sessions')
    .delete()
    .or(`user_id.in.(${users?.map(u => u.id).join(',')})`);

  if (sessionsError) throw sessionsError;
} 