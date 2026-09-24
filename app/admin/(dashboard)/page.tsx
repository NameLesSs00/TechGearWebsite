import { cookies } from "next/headers";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  // Note: we can decode the token or fetch user info, but for now we'll just show a welcome.

  return (
    <div className="space-y-6">
      <div className="bg-[#000c24] border border-white/10 p-8 rounded-2xl flex flex-col items-center justify-center text-center py-20">
        <div className="w-16 h-16 bg-[#22D3EE]/10 rounded-full flex items-center justify-center mb-4 border border-[#22D3EE]/30">
          <svg className="w-8 h-8 text-[#22D3EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Welcome to Tech Gear Admin</h2>
        <p className="text-slate-400 max-w-md mx-auto">
          You have successfully logged in. Select an option from the sidebar to manage your content.
        </p>
      </div>
    </div>
  );
}
