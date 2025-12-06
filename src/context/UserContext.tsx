"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '@/lib/auth';
import { AuthUser } from '@/types';
import { logger } from '@/lib/logger';

interface UserContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  error: null,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        logger.debug('Getting initial session');

        // Test direct Supabase client
        const { createClient } = await import('@/lib/supabase');
        const supabase = createClient();
        const { data: { session }, error: directError } = await supabase.auth.getSession();

        logger.debug({
          hasSession: !!session,
          hasUser: !!session?.user,
          userId: session?.user?.id,
          error: directError?.message,
          cookiesPresent: document.cookie.includes('sb-lyimmxrlenbzpnxvqmet-auth-token')
        }, 'Direct Supabase test');

        const { user: authUser, error: authError } = await authService.getCurrentUser();

        logger.debug({ user: authUser, error: authError }, 'AuthService result');

        if (authError) {
          setError(authError);
        } else {
          setUser(authUser);
          setError(null);
        }
      } catch (err) {
        logger.error({ error: err }, 'Error getting initial session');
        setError(err instanceof Error ? err.message : 'Authentication error');
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = authService.onAuthStateChange((authUser) => {
      logger.debug({ user: authUser }, 'Auth state changed');
      setUser(authUser);
      setError(null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    error,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
