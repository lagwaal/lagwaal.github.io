import React, { createContext, useContext, useState, useEffect } from 'react';
import { isAdminAuthenticated, setAdminAuth, getSettings } from '../utils/storage';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(isAdminAuthenticated());
  }, []);

  const login = (password: string): boolean => {
    const settings = getSettings();
    if (password === settings.adminPassword) {
      setAdminAuth(true);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setAdminAuth(false);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
