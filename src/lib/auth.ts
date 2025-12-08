import { createClient } from './supabase';
import { AuthUser, Language } from '@/types';
import { User } from '@supabase/supabase-js';
import { logger } from './logger';

export class AuthService {
  private supabase = createClient();

  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle(redirectPath?: string): Promise<{ error?: string }> {
    try {
      const redirectTo = new URL(`${window.location.origin}/auth/callback`);

      // Use full URL if path provided, or current href if not
      const targetUrl = redirectPath
        ? (redirectPath.startsWith('http') ? redirectPath : `${window.location.origin}${redirectPath}`)
        : window.location.href;

      if (redirectPath) {
        redirectTo.searchParams.set('next', redirectPath);

        // Set a cookie as fallback/primary method for persistence across OAuth redirect
        document.cookie = `auth-redirect-path=${encodeURIComponent(redirectPath)}; path=/; max-age=300; SameSite=Lax`;

        // Also save to localStorage as a client-side backup
        try {
          localStorage.setItem('auth-redirect-path', redirectPath);
        } catch (e) {
          // Ignore
        }
      }

      const { error } = await this.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo.toString(),
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        logger.error({ error }, 'Google sign-in error');
        return { error: error.message };
      }

      return {};
    } catch (error) {
      logger.error({ error }, 'Unexpected sign-in error');
      return { error: 'An unexpected error occurred during sign-in' };
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<{ error?: string }> {
    try {
      const { error } = await this.supabase.auth.signOut();

      if (error) {
        logger.error({ error }, 'Sign-out error');
        return { error: error.message };
      }

      return {};
    } catch (error) {
      logger.error({ error }, 'Unexpected sign-out error');
      return { error: 'An unexpected error occurred during sign-out' };
    }
  }

  /**
   * Get the current user session
   */
  async getCurrentUser(): Promise<{ user: AuthUser | null; error?: string }> {
    try {
      logger.debug('Getting current session');

      // First try to refresh the session to sync with server-side cookies
      const { data: refreshData, error: refreshError } = await this.supabase.auth.refreshSession();

      if (refreshError) {
        logger.debug({ error: refreshError }, 'Refresh failed, trying getSession');
      } else if (refreshData.session) {
        logger.debug('Session refreshed successfully');
      }

      const { data: { session }, error } = await this.supabase.auth.getSession();

      logger.debug({
        hasSession: !!session,
        userId: session?.user?.id,
        error: error?.message
      }, 'Session data');

      if (error) {
        logger.error({ error }, 'Session error');
        return { user: null, error: error.message };
      }

      if (!session?.user) {
        logger.debug('No session found');
        return { user: null };
      }

      logger.debug('Session found, getting user profile');
      // Get user profile from our users table
      const userProfile = await this.getUserProfile(session.user.id);

      const result = userProfile || this.mapSupabaseUserToAuthUser(session.user);
      logger.debug({ user: result }, 'Final user result');

      return { user: result };
    } catch (error) {
      logger.error({ error }, 'Unexpected session error');
      return { user: null, error: 'Failed to get current user' };
    }
  }

  /**
   * Create or update user profile in our users table
   */
  async upsertUserProfile(user: User): Promise<{ error?: string }> {
    try {
      const userProfile = {
        id: user.id,
        email: user.email,
        google_id: user.user_metadata?.provider_id || user.user_metadata?.sub,
        display_name: user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split('@')[0] ||
          'User',
        preferred_language: 'english' as Language,
      };

      const { error } = await this.supabase
        .from('users')
        .upsert(userProfile, {
          onConflict: 'id',
          ignoreDuplicates: false,
        });

      if (error) {
        logger.error({ error }, 'Profile upsert error');
        return { error: error.message };
      }

      return {};
    } catch (error) {
      logger.error({ error }, 'Unexpected profile upsert error');
      return { error: 'Failed to save user profile' };
    }
  }

  /**
   * Get user profile from our users table
   */
  async getUserProfile(userId: string): Promise<AuthUser | null> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - user profile doesn't exist yet
          return null;
        }
        logger.error({ error }, 'Profile fetch error');
        return null;
      }

      return {
        id: data.id,
        email: data.email,
        displayName: data.display_name,
        preferredLanguage: data.preferred_language as Language,
      };
    } catch (error) {
      logger.error({ error }, 'Unexpected profile fetch error');
      return null;
    }
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(
    userId: string,
    preferences: { preferredLanguage?: Language; displayName?: string }
  ): Promise<{ error?: string }> {
    try {
      const updates: Record<string, string> = {};

      if (preferences.preferredLanguage) {
        updates.preferred_language = preferences.preferredLanguage;
      }

      if (preferences.displayName) {
        updates.display_name = preferences.displayName;
      }

      if (Object.keys(updates).length === 0) {
        return {};
      }

      updates.updated_at = new Date().toISOString();

      const { error } = await this.supabase
        .from('users')
        .update(updates)
        .eq('id', userId);

      if (error) {
        logger.error({ error }, 'Preferences update error');
        return { error: error.message };
      }

      return {};
    } catch (error) {
      logger.error({ error }, 'Unexpected preferences update error');
      return { error: 'Failed to update preferences' };
    }
  }

  /**
   * Map Supabase User to AuthUser (fallback when no profile exists)
   */
  private mapSupabaseUserToAuthUser(user: User): AuthUser {
    return {
      id: user.id,
      email: user.email,
      displayName: user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split('@')[0] ||
        'User',
      preferredLanguage: 'english',
    };
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return this.supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Ensure user profile exists in our database
        await this.upsertUserProfile(session.user);

        // Get the full user profile
        const userProfile = await this.getUserProfile(session.user.id);
        callback(userProfile || this.mapSupabaseUserToAuthUser(session.user));
      } else {
        callback(null);
      }
    });
  }
}

// Export singleton instance
export const authService = new AuthService();