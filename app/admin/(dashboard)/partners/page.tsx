"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Edit2, Handshake, Plus, Trash2 } from "lucide-react";
import { AdminEmptyState, AdminError, AdminPageHeader, AdminTable } from "../_components/AdminControls";
import { Partner, adminApi } from "@/services/adminApi";

export default function AdminPartnersPage() {
  const [items, setItems] = useState<Partner[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.partners.list("en", 1, 100)
      .then((data) => setItems(data.items))
      .catch((err) => setError(err?.message ?? "Failed to load partners."))
      .finally(() => setLoading(false));
  }, []);

  const remove = async (item: Partner) => {
    if (!confirm(`Delete "${item.name ?? "this partner"}"?`)) return;
    await adminApi.partners.remove(item.id);
    setItems((current) => current.filter((row) => row.id !== item.id));
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader actionHref="/admin/partners/create" actionIcon={<Plus className="h-4 w-4" />} actionLabel="Create Partner" title="Partners" description="Manage partner and client logos." />
      <AdminError message={error} />
      {loading ? <div className="py-16 text-center text-slate-400">Loading partners...</div> : items.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#000c24]"><AdminEmptyState icon={<Handshake className="h-12 w-12" />} title="No partners yet" /></div>
      ) : (
        <AdminTable>
          <thead className="border-b border-white/10 bg-white/5 text-xs uppercase text-slate-400">
            <tr><th className="px-6 py-4">Image</th><th className="px-6 py-4">Name</th><th className="px-6 py-4">Logo URL</th><th className="px-6 py-4 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4"><div className="relative h-12 w-16 rounded-lg bg-white/5">{item.imageUrl || item.logoUrl ? <Image src={item.imageUrl || item.logoUrl || ""} alt={item.name ?? ""} fill className="rounded-lg object-contain" unoptimized /> : null}</div></td>
                <td className="px-6 py-4 font-medium text-white">{item.name ?? "-"}</td>
                <td className="max-w-[360px] truncate px-6 py-4 text-slate-400">{item.logoUrl ?? "-"}</td>
                <td className="px-6 py-4 text-right"><div className="flex justify-end gap-3"><Link className="inline-flex items-center gap-1 text-[#22D3EE] hover:text-white" href={`/admin/partners/${item.id}`}><Edit2 className="h-4 w-4" />Edit</Link><button className="inline-flex items-center gap-1 text-red-400 hover:text-red-300" type="button" onClick={() => remove(item)}><Trash2 className="h-4 w-4" />Delete</button></div></td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}
    </div>
  );
}

