"use client";

import { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';
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
  initialUser?: User | null;
}

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

export function AuthProvider({ children, initialSession, initialUser }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (initialUser) {
      logger.debug('Using initial user from server');
      return mapSupabaseUserToAuthUser(initialUser);
    } else if (initialSession?.user) {
      logger.debug('Using initial session from server');
      return mapSupabaseUserToAuthUser(initialSession.user);
    }
    return null;
  });

  const [loading, setLoading] = useState(!initialSession && !initialUser); // Don't load if we have initial data
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // Check if user has actually changed before updating state
  const handleUserUpdate = (newUser: AuthUser | null) => {
    setUser(prev => {
      // Simple deep equality check using JSON.stringify
      // This is efficient enough for small user objects
      if (JSON.stringify(prev) === JSON.stringify(newUser)) {
        return prev;
      }
      return newUser;
    });
  };

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        logger.debug({ event, hasSession: !!session }, 'Auth state changed');

        if (session?.user) {
          handleUserUpdate(mapSupabaseUserToAuthUser(session.user));
        } else {
          handleUserUpdate(null);
        }

        setLoading(false);
        setError(null);
      }
    );

    // If no initial data, get current session
    if (!initialSession && !initialUser) {
      supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (error) {
          logger.error({ error }, 'Error getting session');
          setError(error.message);
        } else if (session?.user) {
          handleUserUpdate(mapSupabaseUserToAuthUser(session.user));
        }
        setLoading(false);
      });
    }

    return () => subscription.unsubscribe();
  }, [supabase.auth, initialSession, initialUser]);

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
      handleUserUpdate(user ? {
        ...user,
        displayName: preferences.displayName || user.displayName,
        preferredLanguage: preferences.preferredLanguage || user.preferredLanguage,
      } : null);

      setError(null);
    } catch (err) {
      logger.error({ error: err }, 'Unexpected preferences update error');
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
    }
  };

  // Memoize value to prevent consumers from re-rendering when nothing changed
  // We use the custom implementation of user setter to ensure user object reference
  // stays stable if content is same.
  const value = useMemo(() => ({
    user,
    loading,
    error,
    updatePreferences,
  }), [user, loading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};