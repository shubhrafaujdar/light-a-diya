"use client";

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { logger } from '@/lib/logger';

export default function AuthCallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const authSuccess = searchParams.get('auth_success');

    if (authSuccess === '1') {
      logger.debug('Detected auth success, refreshing session');

      // Force a session refresh to pick up the new authentication state
      const refreshAuth = async () => {
        try {
          // Refresh the session to sync with server-side cookies
          const { error } = await supabase.auth.refreshSession();

          if (error) {
            logger.error({ error }, 'Session refresh error');
          } else {
            logger.debug('Session refreshed successfully');
          }

          // Clean up the URL by removing the auth_success parameter
          const url = new URL(window.location.href);
          url.searchParams.delete('auth_success');

          // Replace the current URL without the parameter (no page reload)
          router.replace(url.pathname + url.search);

        } catch (error) {
          logger.error({ error }, 'Unexpected error in auth callback handler');
        }
      };

      // Small delay to ensure the page has fully loaded
      setTimeout(refreshAuth, 100);
    }
  }, [searchParams, router, supabase.auth]);

  // This component doesn't render anything
  return null;
}