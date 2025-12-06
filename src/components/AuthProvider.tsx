"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient } from '@/lib/supabase';
import { AuthUser } from '@/types';
import { User, Session } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  updatePreferences: (preferences: { preferredLanguage?: import('@/types').Language; displayName?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  updatePreferences: async () => {
    throw new Error('updatePreferences must be used within AuthProvider');
  },
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
      logger.debug('Using initial session from server');
      setUser(mapSupabaseUserToAuthUser(initialSession.user));
      setLoading(false);
    }
  }, [initialSession]);

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        logger.debug({ event, hasSession: !!session }, 'Auth state changed');

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
      logger.debug('No initial session, fetching current session');
      supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (error) {
          logger.error({ error }, 'Error getting session');
          setError(error.message);
        } else if (session?.user) {
          logger.debug('Got session from client');
          setUser(mapSupabaseUserToAuthUser(session.user));
        }
        setLoading(false);
      });
    }

    return () => subscription.unsubscribe();
  }, [supabase.auth, initialSession]);

  const updatePreferences = async (preferences: { preferredLanguage?: import('@/types').Language; displayName?: string }) => {
    if (!user) {
      setError('User must be signed in to update preferences');
      return;
    }

    try {
      const updates: Record<string, string> = {};

      if (preferences.preferredLanguage) {
        updates.preferred_language = preferences.preferredLanguage;
      }

      if (preferences.displayName) {
        updates.display_name = preferences.displayName;
      }

      if (Object.keys(updates).length === 0) {
        return;
      }

      updates.updated_at = new Date().toISOString();

      const { error: updateError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (updateError) {
        logger.error({ error: updateError }, 'Preferences update error');
        setError(updateError.message);
        return;
      }

      // Update local state optimistically
      setUser(prev => prev ? {
        ...prev,
        displayName: preferences.displayName || prev.displayName,
        preferredLanguage: preferences.preferredLanguage || prev.preferredLanguage,
      } : null);

      setError(null);
    } catch (err) {
      logger.error({ error: err }, 'Unexpected preferences update error');
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
    }
  };

  const value = {
    user,
    loading,
    error,
    updatePreferences,
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