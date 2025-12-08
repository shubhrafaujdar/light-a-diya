'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Toast from './Toast';
import { useAuth } from './AuthProvider';

export default function AuthNotifications() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // Check for pending redirect when user is authenticated
  useEffect(() => {
    if (user) {
      try {
        const redirectPath = localStorage.getItem('auth-redirect-path');

        if (redirectPath && redirectPath.startsWith('/')) {
          localStorage.removeItem('auth-redirect-path');
          // Use hard redirect to ensure it works
          window.location.href = redirectPath;
        }
      } catch (e) {
        // Ignore
      }
    }
  }, [user]);

  useEffect(() => {
    const authError = searchParams.get('auth_error');
    const authSuccess = searchParams.get('auth_success');

    if (authError) {
      setNotification({
        message: authError,
        type: 'error',
      });
      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete('auth_error');
      router.replace(url.pathname + url.search, { scroll: false });
    } else if (authSuccess) {
      // The redirect is now handled by the user effect above, 
      // but we should still clean up the URL and show success if no redirect happened

      // Short delay to allow the user effect to trigger first if needed
      const timer = setTimeout(() => {
        // Check if we still have the redirect path (meaning user effect hasn't fired or didn't find it yet)
        // But typically user effect runs when user loads.
        // Just show success generic message if we are still here.

        setNotification({
          message: 'Successfully signed in!',
          type: 'success',
        });
        // Clean up URL
        const url = new URL(window.location.href);
        url.searchParams.delete('auth_success');
        router.replace(url.pathname + url.search, { scroll: false });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [searchParams, router, user]);

  if (!notification) return null;

  return (
    <Toast
      message={notification.message}
      type={notification.type}
      onClose={() => setNotification(null)}
    />
  );
}
