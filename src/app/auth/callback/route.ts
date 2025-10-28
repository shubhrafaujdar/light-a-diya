import { createServerSupabaseClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

function getRedirectUrl(request: NextRequest, path: string = '/'): string {
  const { origin } = new URL(request.url);
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto');
  const host = request.headers.get('host');
  const isLocalEnv = process.env.NODE_ENV === 'development';
  
  if (isLocalEnv) {
    // Development environment
    return `${origin}${path}`;
  } else if (forwardedHost && forwardedProto) {
    // Production with proper forwarded headers (Vercel, Netlify, etc.)
    return `${forwardedProto}://${forwardedHost}${path}`;
  } else if (forwardedHost) {
    // Production with forwarded host but no proto (assume HTTPS)
    return `https://${forwardedHost}${path}`;
  } else if (host && !host.includes('localhost')) {
    // Production fallback using host header
    return `https://${host}${path}`;
  } else {
    // Final fallback to origin
    return `${origin}${path}`;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createServerSupabaseClient();
    
    try {
      console.log('Auth callback: Exchanging code for session...');
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      console.log('Auth callback: Exchange result:', { 
        hasUser: !!data?.user, 
        hasSession: !!data?.session, 
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
      
      return NextResponse.redirect(getRedirectUrl(request, next));
    } catch (error) {
      console.error('Unexpected auth callback error:', error);
      return NextResponse.redirect(getRedirectUrl(request, `/auth/auth-code-error?error=${encodeURIComponent('Unexpected authentication error')}`));
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(getRedirectUrl(request, `/auth/auth-code-error?error=${encodeURIComponent('No authorization code provided')}`));
}