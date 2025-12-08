import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;
  const nextParam = requestUrl.searchParams.get('next');

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch {
              // Handle cookie setting errors in middleware
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: '', ...options });
            } catch {
              // Handle cookie removal errors in middleware
            }
          },
        },
      }
    );

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        logger.error({ error }, 'Session exchange error');
        return NextResponse.redirect(`${origin}/?auth_error=${encodeURIComponent(error.message)}`);
      }

      // Create or update user profile after successful authentication
      if (data.user) {
        const userProfile = {
          id: data.user.id,
          email: data.user.email,
          google_id: data.user.user_metadata?.provider_id || data.user.user_metadata?.sub,
          display_name: data.user.user_metadata?.full_name ||
            data.user.user_metadata?.name ||
            data.user.email?.split('@')[0] ||
            'User',
          preferred_language: 'english',
        };

        const { error: upsertError } = await supabase
          .from('users')
          .upsert(userProfile, {
            onConflict: 'id',
            ignoreDuplicates: false,
          });

        if (upsertError) {
          logger.error({ error: upsertError }, 'Profile upsert error');
          // Don't fail the auth flow, just log the error
        }
      }
    } catch (err) {
      logger.error({ error: err }, 'Unexpected error in auth callback');
      return NextResponse.redirect(`${origin}/?auth_error=${encodeURIComponent('Authentication failed')}`);
    }
  }

  // Redirect to home page or 'next' URL after successful authentication

  // check for cookie fallback
  const cookieStore = await cookies();
  const nextCookie = cookieStore.get('auth-redirect-path')?.value;

  const next = nextCookie ? decodeURIComponent(nextCookie) : nextParam;

  if (nextCookie) {
    // Clean up the cookie
    cookieStore.delete('auth-redirect-path');
  }

  if (next && next.startsWith('/')) {
    return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(`${origin}/?auth_success=true`);
}
