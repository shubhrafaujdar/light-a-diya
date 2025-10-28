import { createServerSupabaseClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

function getRedirectUrl(request: NextRequest, path: string = '/'): string {
  const { origin } = new URL(request.url);
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto');
  const host = request.headers.get('host');
  const isLocalEnv = process.env.NODE_ENV === 'development';
  
  console.log('Redirect URL debug:', {
    origin,
    forwardedHost,
    forwardedProto,
    host,
    isLocalEnv,
    path
  });
  
  let redirectUrl: string;
  
  if (isLocalEnv) {
    // Development environment
    redirectUrl = `${origin}${path}`;
  } else {
    // For production, always use the known Vercel domain
    redirectUrl = `https://light-a-diya.vercel.app${path}`;
  }
  
  console.log('Final redirect URL:', redirectUrl);
  return redirectUrl;
}

export async function GET(request: NextRequest) {
  console.log('=== AUTH CALLBACK ROUTE HIT ===');
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';
  
  console.log('Callback params:', { code: code?.substring(0, 10) + '...', next });

  if (code) {
    const supabase = await createServerSupabaseClient();
    
    try {
      console.log('Auth callback: Exchanging code for session...');
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      console.log('Auth callback: Exchange result:', { 
        hasUser: !!data?.user, 
        hasSession: !!data?.session, 
        userId: data?.user?.id,
        accessToken: data?.session?.access_token ? 'present' : 'missing',
        refreshToken: data?.session?.refresh_token ? 'present' : 'missing',
        error: error?.message 
      });
      
      if (error) {
        console.error('Auth callback error:', error);
        return NextResponse.redirect(getRedirectUrl(request, `/auth/auth-code-error?error=${encodeURIComponent(error.message)}`));
      }

      if (data.user) {
        console.log('Auth callback: Creating user profile...');
        // Create or update user profile in our users table
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

        // Upsert user profile (create if doesn't exist, update if it does)
        const { error: profileError } = await supabase
          .from('users')
          .upsert(userProfile, {
            onConflict: 'id',
            ignoreDuplicates: false,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Don't fail the auth flow for profile errors, just log them
        } else {
          console.log('Auth callback: User profile created/updated successfully');
        }
      }
      
      const redirectUrl = getRedirectUrl(request, next);
      
      // Add debug info to the redirect URL so we can see what happened
      const debugUrl = new URL(redirectUrl);
      debugUrl.searchParams.set('auth_debug', 'success');
      debugUrl.searchParams.set('user_id', data?.user?.id || 'none');
      debugUrl.searchParams.set('has_session', data?.session ? 'yes' : 'no');
      
      console.log('Auth callback: Redirecting to:', debugUrl.toString());
      return NextResponse.redirect(debugUrl.toString());
    } catch (error) {
      console.error('Unexpected auth callback error:', error);
      return NextResponse.redirect(getRedirectUrl(request, `/auth/auth-code-error?error=${encodeURIComponent('Unexpected authentication error')}`));
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(getRedirectUrl(request, `/auth/auth-code-error?error=${encodeURIComponent('No authorization code provided')}`));
}