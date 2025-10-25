'use client';

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase';
import { AuthUser, AuthState } from '@/types';

export const useAuth = (): AuthState & {
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
} => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          setAuthState(prev => ({ ...prev, error: error.message, loading: false }));
          return;
        }

        const authUser = session?.user ? mapSupabaseUserToAuthUser(session.user) : null;
        setAuthState({ user: authUser, loading: false, error: null });
      } catch (error) {
        setAuthState(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : 'Authentication error', 
          loading: false 
        }));
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const authUser = session?.user ? mapSupabaseUserToAuthUser(session.user) : null;
        setAuthState({ user: authUser, loading: false, error: null });
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const signIn = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }));
      }
    } catch (error) {
      setAuthState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Sign in failed', 
        loading: false 
      }));
    }
  };

  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }));
      } else {
        setAuthState({ user: null, loading: false, error: null });
      }
    } catch (error) {
      setAuthState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Sign out failed', 
        loading: false 
      }));
    }
  };

  return {
    ...authState,
    signIn,
    signOut,
  };
};

// Helper function to map Supabase User to AuthUser
const mapSupabaseUserToAuthUser = (user: User): AuthUser => {
  return {
    id: user.id,
    email: user.email,
    displayName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    preferredLanguage: 'english', // Default, can be updated from user preferences
  };
};