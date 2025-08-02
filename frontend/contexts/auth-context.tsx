"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session, login as apiLogin, logout as apiLogout, getCurrentUser, getSession, setSession } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session on mount
    const initAuth = async () => {
      const session = getSession();
      if (session?.access) {
        try {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
          // Set cookie for middleware
          document.cookie = 'has_session=true; path=/';
        } catch (error) {
          // Token might be expired, clear session
          apiLogout();
          document.cookie = 'has_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
      }
      setLoading(false);
    };
    
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiLogin(email, password);
    setUser(response.user);
    // Set cookie for middleware
    document.cookie = 'has_session=true; path=/';
    router.push('/');
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
    // Remove cookie
    document.cookie = 'has_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };

  const refreshUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
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