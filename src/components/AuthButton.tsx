"use client";

import { useUser } from "../context/UserContext";
import { supabase } from "../lib/supabase";

export default function AuthButton() {
  const { user } = useUser();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return user ? (
    <div className="flex items-center gap-4">
      <p>Hey, {user.email}!</p>
      <button onClick={handleLogout} className="py-2 px-4 rounded-md bg-red-500 text-white">
        Logout
      </button>
    </div>
  ) : (
    <button onClick={handleLogin} className="py-2 px-4 rounded-md bg-blue-500 text-white">
      Login with Google
    </button>
  );
}
