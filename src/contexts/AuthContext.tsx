import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Initialize default users if not exists
    const usersJson = localStorage.getItem('users');
    if (!usersJson) {
      const defaultUsers: User[] = [
        {
          id: '1',
          username: 'admin',
          password: 'admin123',
          role: 'admin',
          name: 'Administrador',
          email: 'admin@example.com',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          username: 'empleado',
          password: 'empleado123',
          role: 'employee',
          name: 'Empleado Demo',
          email: 'empleado@example.com',
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem('users', JSON.stringify(defaultUsers));
    }

    // Check for existing session
    const sessionUser = localStorage.getItem('currentUser');
    if (sessionUser) {
      setUser(JSON.parse(sessionUser));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const usersJson = localStorage.getItem('users');
    if (!usersJson) return false;

    const users: User[] = JSON.parse(usersJson);
    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
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

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
