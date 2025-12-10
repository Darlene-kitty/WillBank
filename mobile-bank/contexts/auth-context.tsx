import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { authService } from '@/services';
import { Client } from '@/types';

interface AuthContextType {
  user: Client | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  cin: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Protect routes
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(tabs)';

    if (!user && inAuthGroup) {
      // User is not authenticated but trying to access protected route
      router.replace('/login');
    } else if (user && !inAuthGroup && segments[0] !== 'login' && segments[0] !== 'register') {
      // User is authenticated but on auth screen
      router.replace('/(tabs)/');
    }
  }, [user, segments, isLoading]);

  const checkAuthStatus = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.client);
      router.replace('/(tabs)/');
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      setUser(response.client);
      router.replace('/(tabs)/');
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Refresh user error:', error);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
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
