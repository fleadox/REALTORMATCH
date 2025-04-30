import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { users, User } from '../utils/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const STORAGE_KEY = 'auth_state';

export function useAuth() {
  const [state, setState] = useState<AuthState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {
      user: null,
      isAuthenticated: false,
      isAdmin: false
    };
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Find user in mock data
      const user = users.find(u => u.email === email);

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Update state
      setState({
        user,
        isAuthenticated: true,
        isAdmin: user.email === 'admin@georgiarealty.pro'
      });

      toast.success('Welcome back!');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to login');
      return false;
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if user exists
      if (users.some(u => u.email === email)) {
        throw new Error('Email already registered');
      }

      // In a real app, we would create a new user here
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to register');
      return false;
    }
  };

  const logout = () => {
    setState({
      user: null,
      isAuthenticated: false,
      isAdmin: false
    });
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return {
    ...state,
    login,
    register,
    logout
  };
}