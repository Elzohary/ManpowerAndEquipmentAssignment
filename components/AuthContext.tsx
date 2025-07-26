import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'hr' | 'manager' | 'employee';
  badgeNumber: string;
  department: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (requiredRoles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: Record<string, User> = {
  'admin@company.com': {
    id: '1',
    name: 'John Admin',
    email: 'admin@company.com',
    role: 'admin',
    badgeNumber: 'ADM001',
    department: 'Administration'
  },
  'hr@company.com': {
    id: '2',
    name: 'Sarah HR',
    email: 'hr@company.com',
    role: 'hr',
    badgeNumber: 'HR001',
    department: 'Human Resources'
  },
  'manager@company.com': {
    id: '3',
    name: 'Mike Manager',
    email: 'manager@company.com',
    role: 'manager',
    badgeNumber: 'MNG001',
    department: 'Operations'
  },
  'employee@company.com': {
    id: '4',
    name: 'Jane Employee',
    email: 'employee@company.com',
    role: 'employee',
    badgeNumber: 'EMP001',
    department: 'Engineering'
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simple mock authentication
    const foundUser = mockUsers[email];
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const hasPermission = (requiredRoles: string[]): boolean => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}