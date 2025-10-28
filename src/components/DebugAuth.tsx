"use client";

import { useState } from 'react';
import { authService } from '@/lib/auth';
import { AuthUser } from '@/types';

interface DebugResult {
  user?: AuthUser | null;
  error?: string;
}

export default function DebugAuth() {
  const [result, setResult] = useState<DebugResult | null>(null);
  const [loading, setLoading] = useState(false);

  const testSession = async () => {
    setLoading(true);
    try {
      // Test direct Supabase client access
      const { createClient } = await import('@/lib/supabase');
      const supabase = createClient();
      
      console.log('Direct Supabase test...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      const result = {
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id,
        error: error?.message,
        accessToken: session?.access_token ? 'present' : 'missing'
      };
      
      console.log('Direct session result:', result);
      setResult(result);
    } catch (error) {
      console.error('Debug test error:', error);
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 border rounded shadow-lg max-w-sm z-50">
      <h3 className="font-bold mb-2">🔍 Auth Debug</h3>
      <button
        onClick={testSession}
        disabled={loading}
        className="bg-white text-red-500 px-3 py-1 rounded text-sm mb-2 font-bold"
      >
        {loading ? 'Testing...' : 'Test Session'}
      </button>
      {result && (
        <pre className="text-xs bg-white text-black p-2 rounded overflow-auto max-h-32">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
      <div className="text-xs mt-2 opacity-75">
        Always visible - red box
      </div>
    </div>
  );
}