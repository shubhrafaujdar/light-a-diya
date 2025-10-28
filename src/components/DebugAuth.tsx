"use client";

import { useState } from 'react';
import { authService } from '@/lib/auth';

export default function DebugAuth() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testSession = async () => {
    setLoading(true);
    try {
      const user = await authService.getCurrentUser();
      setResult(user);
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 border rounded shadow-lg max-w-sm">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <button
        onClick={testSession}
        disabled={loading}
        className="bg-blue-500 text-white px-3 py-1 rounded text-sm mb-2"
      >
        {loading ? 'Testing...' : 'Test Session'}
      </button>
      {result && (
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}