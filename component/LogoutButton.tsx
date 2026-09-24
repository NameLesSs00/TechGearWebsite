"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    authService.removeToken();
    router.push("/admin/login");
    router.refresh();
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
