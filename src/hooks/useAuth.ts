'use client';

import { useState, useEffect } from 'react';
import { authService } from '@/lib/auth';
import { AuthState, Language } from '@/types';

export const useAuth = (): AuthState & {
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  updatePreferences: (preferences: { preferredLanguage?: Language; displayName?: string }) => Promise<void>;
} => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { user, error } = await authService.getCurrentUser();
        
        if (error) {
          setAuthState(prev => ({ ...prev, error, loading: false }));
          return;
        }

        setAuthState({ user, loading: false, error: null });
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
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      setAuthState({ user, loading: false, error: null });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await authService.signInWithGoogle();

      if (error) {
        setAuthState(prev => ({ ...prev, error, loading: false }));
      }
      // Note: The actual user state will be updated via the auth state change listener
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
      
      const { error } = await authService.signOut();
      
      if (error) {
        setAuthState(prev => ({ ...prev, error, loading: false }));
      }
      // Note: The user state will be updated via the auth state change listener
    } catch (error) {
      setAuthState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Sign out failed', 
        loading: false 
      }));
    }
  };

  const updatePreferences = async (preferences: { preferredLanguage?: Language; displayName?: string }) => {
    if (!authState.user) {
      setAuthState(prev => ({ ...prev, error: 'User must be signed in to update preferences' }));
      return;
    }

    try {
      const { error } = await authService.updateUserPreferences(authState.user.id, preferences);
      
      if (error) {
        setAuthState(prev => ({ ...prev, error }));
        return;
      }

      // Update local state optimistically
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? {
          ...prev.user,
          ...preferences,
        } : null,
        error: null,
      }));
    } catch (error) {
      setAuthState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to update preferences' 
      }));
    }
  };

  return {
    ...authState,
    signIn,
    signOut,
    updatePreferences,
  };
};