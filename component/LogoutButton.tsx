"use client";

import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    // Navigate to the server-side logout route which clears the cookie
    // via Set-Cookie header before redirecting to /admin/login.
    // This avoids the race condition of client-side cookie deletion.
    window.location.href = "/admin/logout";
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-colors text-left"
    >
      <LogOut className="w-5 h-5" />
      Log out
    </button>
  );
}
