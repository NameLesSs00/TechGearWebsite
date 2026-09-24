import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { HelpCircle, Home, Mail, MessageSquare, Milestone, Package, Users, Wrench, FolderKanban, Handshake, Layers } from "lucide-react";
import LogoutButton from "@/component/LogoutButton";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/projects", label: "Projects", icon: Layers },
  { href: "/admin/project-categories", label: "Project Categories", icon: FolderKanban },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/journeys", label: "Journeys", icon: Milestone },
  { href: "/admin/partners", label: "Partners", icon: Handshake },
  { href: "/admin/team-members", label: "Team Members", icon: Users },
  { href: "/admin/contact-messages", label: "Contact Messages", icon: Mail },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex bg-[#000918]">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/10 bg-[#000c24] flex flex-col">
        <div className="p-6 border-b border-white/10 flex items-center justify-center">
          <Link href="/" className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            TECH<span className="text-[#22D3EE]">GEAR</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen max-w-full overflow-x-hidden">
        <header className="h-20 border-b border-white/10 flex items-center px-8 bg-[#000918]/80 backdrop-blur-md sticky top-0 z-10">
          <h1 className="text-xl font-semibold">Tech Gear Admin</h1>
        </header>
        
        <div className="p-8 flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
