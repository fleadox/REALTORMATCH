import React, { createContext, useContext, useState, useEffect } from 'react';
import { users, User } from '../utils/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Initialize with mock user
    setUser(users[0]);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - always succeed with test credentials
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    // Mock registration - always succeed
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.isAdmin || false,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};