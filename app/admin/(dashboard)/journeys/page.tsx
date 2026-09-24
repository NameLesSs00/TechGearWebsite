"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Edit2, Milestone, Plus, Trash2 } from "lucide-react";
import { AdminEmptyState, AdminError, AdminPageHeader, AdminTable } from "../_components/AdminControls";
import { Journey, adminApi } from "@/services/adminApi";

export default function AdminJourneysPage() {
  const [items, setItems] = useState<Journey[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.journeys.list("en", 1, 100)
      .then((data) => setItems(data.items.sort((a, b) => a.displayOrder - b.displayOrder)))
      .catch((err) => setError(err?.message ?? "Failed to load journeys."))
      .finally(() => setLoading(false));
  }, []);

  const remove = async (item: Journey) => {
    if (!confirm(`Delete "${item.title ?? item.yearOrDate ?? "this journey"}"?`)) return;
    await adminApi.journeys.remove(item.id);
    setItems((current) => current.filter((row) => row.id !== item.id));
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader actionHref="/admin/journeys/create" actionIcon={<Plus className="h-4 w-4" />} actionLabel="Create Journey" title="Journeys" description="Manage company timeline milestones." />
      <AdminError message={error} />
      {loading ? <div className="py-16 text-center text-slate-400">Loading journeys...</div> : items.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#000c24]"><AdminEmptyState icon={<Milestone className="h-12 w-12" />} title="No journeys yet" /></div>
      ) : (
        <AdminTable>
          <thead className="border-b border-white/10 bg-white/5 text-xs uppercase text-slate-400">
            <tr><th className="px-6 py-4">Image</th><th className="px-6 py-4">Title</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Order</th><th className="px-6 py-4 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4"><div className="relative h-12 w-16 rounded-lg bg-white/5">{item.imageUrl ? <Image src={item.imageUrl} alt={item.title ?? ""} fill className="rounded-lg object-cover" unoptimized /> : null}</div></td>
                <td className="px-6 py-4 font-medium text-white">{item.title ?? "-"}</td>
                <td className="px-6 py-4 text-slate-400">{item.yearOrDate ?? "-"}</td>
                <td className="px-6 py-4 text-slate-400">{item.displayOrder}</td>
                <td className="px-6 py-4 text-right"><div className="flex justify-end gap-3"><Link className="inline-flex items-center gap-1 text-[#22D3EE] hover:text-white" href={`/admin/journeys/${item.id}`}><Edit2 className="h-4 w-4" />Edit</Link><button className="inline-flex items-center gap-1 text-red-400 hover:text-red-300" type="button" onClick={() => remove(item)}><Trash2 className="h-4 w-4" />Delete</button></div></td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}
    </div>
  );
}

