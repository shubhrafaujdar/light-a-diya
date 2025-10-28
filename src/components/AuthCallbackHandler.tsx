"use client";

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function AuthCallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const authSuccess = searchParams.get('auth_success');
    
    if (authSuccess === '1') {
      console.log('AuthCallbackHandler: Detected auth success, refreshing session...');
      
      // Force a session refresh to pick up the new authentication state
      const refreshAuth = async () => {
        try {
          // Refresh the session to sync with server-side cookies
          const { data, error } = await supabase.auth.refreshSession();
          
          if (error) {
            console.error('AuthCallbackHandler: Session refresh error:', error);
          } else {
            console.log('AuthCallbackHandler: Session refreshed successfully');
          }
          
          // Clean up the URL by removing the auth_success parameter
          const url = new URL(window.location.href);
          url.searchParams.delete('auth_success');
          
          // Replace the current URL without the parameter (no page reload)
          router.replace(url.pathname + url.search);
          
        } catch (error) {
          console.error('AuthCallbackHandler: Unexpected error:', error);
        }
      };

      // Small delay to ensure the page has fully loaded
      setTimeout(refreshAuth, 100);
    }
  }, [searchParams, router, supabase.auth]);

  // This component doesn't render anything
  return null;
}