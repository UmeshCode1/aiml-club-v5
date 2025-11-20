'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { account } from '@/lib/appwrite';
import { Models } from 'appwrite';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  getRole: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      // Set a timeout to prevent infinite loading
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 5000)
      );
      
      const userPromise = account.get();
      const currentUser = await Promise.race([userPromise, timeout]) as Models.User<Models.Preferences>;
      setUser(currentUser);
    } catch (error) {
      // Silently fail - user is just not logged in or connection issue
      console.log('Auth check:', error instanceof Error ? error.message : 'Not authenticated');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();
      setUser(currentUser);
      toast.success('Login successful!');
      router.push('/admin');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error: any) {
      toast.error(error.message || 'Logout failed');
      throw error;
    }
  };

  const isAdmin = () => {
    if (!user) return false;
    const role = user.prefs?.role;
    return role === 'President' || role === 'Vice President' || role === 'Faculty';
  };

  const getRole = () => {
    if (!user) return null;
    return user.prefs?.role || null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAdmin,
        getRole,
      }}
    >
      {/* Always render children, don't block on auth loading */}
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
