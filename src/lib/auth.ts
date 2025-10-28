import { createClient } from './supabase';
import { AuthUser, Language } from '@/types';
import { User } from '@supabase/supabase-js';

export class AuthService {
  private supabase = createClient();

  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle(): Promise<{ error?: string }> {
    try {
      const { error } = await this.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Google sign-in error:', error);
        return { error: error.message };
      }

      return {};
    } catch (error) {
      console.error('Unexpected sign-in error:', error);
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
        console.error('Sign-out error:', error);
        return { error: error.message };
      }

      return {};
    } catch (error) {
      console.error('Unexpected sign-out error:', error);
      return { error: 'An unexpected error occurred during sign-out' };
    }
  }

  /**
   * Get the current user session
   */
  async getCurrentUser(): Promise<{ user: AuthUser | null; error?: string }> {
    try {
      console.log('AuthService: Getting current session...');
      const { data: { session }, error } = await this.supabase.auth.getSession();
      
      console.log('AuthService: Session data:', { session: session?.user?.id, error });
      
      if (error) {
        console.error('Session error:', error);
        return { user: null, error: error.message };
      }

      if (!session?.user) {
        console.log('AuthService: No session found');
        return { user: null };
      }

      console.log('AuthService: Session found, getting user profile...');
      // Get user profile from our users table
      const userProfile = await this.getUserProfile(session.user.id);
      
      const result = userProfile || this.mapSupabaseUserToAuthUser(session.user);
      console.log('AuthService: Final user result:', result);
      
      return { user: result };
    } catch (error) {
      console.error('Unexpected session error:', error);
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
        console.error('Profile upsert error:', error);
        return { error: error.message };
      }

      return {};
    } catch (error) {
      console.error('Unexpected profile upsert error:', error);
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
        console.error('Profile fetch error:', error);
        return null;
      }

      return {
        id: data.id,
        email: data.email,
        displayName: data.display_name,
        preferredLanguage: data.preferred_language as Language,
      };
    } catch (error) {
      console.error('Unexpected profile fetch error:', error);
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
        console.error('Preferences update error:', error);
        return { error: error.message };
      }

      return {};
    } catch (error) {
      console.error('Unexpected preferences update error:', error);
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