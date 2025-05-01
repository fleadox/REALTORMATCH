import { User } from '../context/AuthContext';

export interface AuthError {
  message: string;
  status: number;
}

export async function signIn(email: string, password: string): Promise<User> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to sign in');
  }

  return await response.json();
}

export async function signOut(): Promise<void> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to sign out');
  }
}

export async function resetPassword(email: string): Promise<void> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to reset password');
  }
}

export async function updatePassword(newPassword: string, token: string): Promise<void> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/update-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ password: newPassword }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update password');
  }
}

export async function getCurrentUser(token: string): Promise<User | null> {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
} 