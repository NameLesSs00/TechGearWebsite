"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Edit2, Plus, Trash2, Users } from "lucide-react";
import { AdminEmptyState, AdminError, AdminPageHeader, AdminTable } from "../_components/AdminControls";
import { TeamMember, adminApi } from "@/services/adminApi";

export default function AdminTeamMembersPage() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.teamMembers.list("en", 1, 100)
      .then((data) => setItems(data.items.sort((a, b) => a.displayOrder - b.displayOrder)))
      .catch((err) => setError(err?.message ?? "Failed to load team members."))
      .finally(() => setLoading(false));
  }, []);

  const remove = async (item: TeamMember) => {
    if (!confirm(`Delete "${item.name ?? "this team member"}"?`)) return;
    await adminApi.teamMembers.remove(item.id);
    setItems((current) => current.filter((row) => row.id !== item.id));
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader actionHref="/admin/team-members/create" actionIcon={<Plus className="h-4 w-4" />} actionLabel="Create Member" title="Team Members" description="Manage people shown in the About page team area." />
      <AdminError message={error} />
      {loading ? <div className="py-16 text-center text-slate-400">Loading team members...</div> : items.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#000c24]"><AdminEmptyState icon={<Users className="h-12 w-12" />} title="No team members yet" /></div>
      ) : (
        <AdminTable>
          <thead className="border-b border-white/10 bg-white/5 text-xs uppercase text-slate-400">
            <tr><th className="px-6 py-4">Photo</th><th className="px-6 py-4">Name</th><th className="px-6 py-4">Job Title</th><th className="px-6 py-4">Order</th><th className="px-6 py-4 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4"><div className="relative h-12 w-12 overflow-hidden rounded-full bg-white/5">{item.imageUrl ? <Image src={item.imageUrl} alt={item.name ?? ""} fill className="object-cover" unoptimized /> : null}</div></td>
                <td className="px-6 py-4 font-medium text-white">{item.name ?? "-"}</td>
                <td className="px-6 py-4 text-slate-400">{item.jobTitle ?? "-"}</td>
                <td className="px-6 py-4 text-slate-400">{item.displayOrder}</td>
                <td className="px-6 py-4 text-right"><div className="flex justify-end gap-3"><Link className="inline-flex items-center gap-1 text-[#22D3EE] hover:text-white" href={`/admin/team-members/${item.id}`}><Edit2 className="h-4 w-4" />Edit</Link><button className="inline-flex items-center gap-1 text-red-400 hover:text-red-300" type="button" onClick={() => remove(item)}><Trash2 className="h-4 w-4" />Delete</button></div></td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}
    </div>
  );
}

