'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Toast from './Toast';

export default function AuthNotifications() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

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
      setNotification({
        message: 'Successfully signed in!',
        type: 'success',
      });
      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete('auth_success');
      router.replace(url.pathname + url.search, { scroll: false });
    }
  }, [searchParams, router]);

  if (!notification) return null;

  return (
    <Toast
      message={notification.message}
      type={notification.type}
      onClose={() => setNotification(null)}
    />
  );
}
