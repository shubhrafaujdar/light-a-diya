"use client";

import { useAuth } from "@/hooks/useAuth";

export default function AuthButton() {
  const { user, loading, signIn, signOut } = useAuth();

  const handleLogin = async () => {
    await signIn();
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="py-2 px-4 rounded-md bg-gray-200 text-gray-500">
        Loading...
      </div>
    );
  }

  return user ? (
    <div className="flex items-center gap-4">
      <p>Hey, {user.displayName}!</p>
      <button 
        onClick={handleLogout} 
        className="py-2 px-4 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
      >
        Logout
      </button>
    </div>
  ) : (
    <button 
      onClick={handleLogin} 
      className="py-2 px-4 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
    >
      Login with Google
    </button>
  );
}
