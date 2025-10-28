"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

interface SessionTestData {
  hasSession?: boolean;
  hasUser?: boolean;
  userId?: string;
  error?: string;
  rawSession?: Session | null;
}

export default function DirectAuthTest() {
  const [sessionData, setSessionData] = useState<SessionTestData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testDirectSession = async () => {
      try {
        const supabase = createClient();
        console.log('Direct test: Getting session...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('Direct test result:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          userId: session?.user?.id,
          error: error?.message,
          cookies: document.cookie
        });
        
        setSessionData({
          hasSession: !!session,
          hasUser: !!session?.user,
          userId: session?.user?.id,
          error: error?.message,
          rawSession: session
        });
      } catch (error) {
        console.error('Direct test error:', error);
        setSessionData({ error: error instanceof Error ? error.message : 'Unknown error' });
      } finally {
        setLoading(false);
      }
    };

    testDirectSession();
  }, []);

  if (loading) return <div>Testing direct session...</div>;

  return (
    <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 p-4 rounded max-w-sm text-xs">
      <h3 className="font-bold mb-2">Direct Supabase Test</h3>
      <pre className="whitespace-pre-wrap overflow-auto max-h-32">
        {JSON.stringify(sessionData, null, 2)}
      </pre>
    </div>
  );
}