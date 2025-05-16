'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserProfile, LoginCredentials, RegisterData } from './types';
import * as api from './mock-api';
import { useToast } from '@/hooks/use-toast';
import { getDashboardPath } from './utils';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        const userData = await api.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Authentication check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const userData = await api.loginUser(credentials);
      setUser(userData);
      toast({
        title: 'Success',
        description: 'Logged in successfully',
      });
      
      // Role-based redirection
      const dashboardPath = getDashboardPath(userData.role);
      router.push(dashboardPath);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Login Failed',
          description: error.message,
          variant: 'destructive',
        });
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const userData = await api.registerUser(data);
      setUser(userData);
      toast({
        title: 'Success',
        description: 'Account created successfully',
      });
      
      // Role-based redirection
      const dashboardPath = getDashboardPath(userData.role);
      router.push(dashboardPath);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Registration Failed',
          description: error.message,
          variant: 'destructive',
        });
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logoutUser();
      setUser(null);
      toast({
        title: 'Success',
        description: 'Logged out successfully',
      });
      router.push('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to logout',
        variant: 'destructive',
      });
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    
    try {
      const updatedUser = await api.updateUserProfile(user.id, data);
      setUser(updatedUser);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteAccount = async () => {
    if (!user) return;
    
    try {
      await api.deleteUserAccount(user.id);
      setUser(null);
      toast({
        title: 'Success',
        description: 'Account deleted successfully',
      });
      router.push('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete account',
        variant: 'destructive',
      });
      throw error;
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
        updateProfile,
        deleteAccount,
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
