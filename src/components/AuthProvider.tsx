"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient } from '@/lib/supabase';
import { AuthUser } from '@/types';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
});

interface AuthProviderProps {
  children: ReactNode;
  initialSession?: Session | null;
}

export function AuthProvider({ children, initialSession }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(!initialSession); // Don't load if we have initial session
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // Helper function to map Supabase User to AuthUser
  const mapSupabaseUserToAuthUser = (user: User): AuthUser => {
    return {
      id: user.id,
      email: user.email,
      displayName: user.user_metadata?.full_name || 
                   user.user_metadata?.name || 
                   user.email?.split('@')[0] || 
                   'User',
      preferredLanguage: 'english',
    };
  };

  // Set initial user from server-side session
  useEffect(() => {
    if (initialSession?.user) {
      console.log('AuthProvider: Using initial session from server');
      setUser(mapSupabaseUserToAuthUser(initialSession.user));
      setLoading(false);
    }
  }, [initialSession]);

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider: Auth state changed:', { event, hasSession: !!session });
        
        if (session?.user) {
          setUser(mapSupabaseUserToAuthUser(session.user));
        } else {
          setUser(null);
        }
        
        setLoading(false);
        setError(null);
      }
    );

    // If no initial session, get current session
    if (!initialSession) {
      console.log('AuthProvider: No initial session, fetching current session...');
      supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (error) {
          console.error('AuthProvider: Error getting session:', error);
          setError(error.message);
        } else if (session?.user) {
          console.log('AuthProvider: Got session from client');
          setUser(mapSupabaseUserToAuthUser(session.user));
        }
        setLoading(false);
      });
    }

    return () => subscription.unsubscribe();
  }, [supabase.auth, initialSession]);

  const value = {
    user,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};