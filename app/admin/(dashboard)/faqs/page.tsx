"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Edit2, HelpCircle, Plus, Trash2 } from "lucide-react";
import { AdminEmptyState, AdminError, AdminPageHeader, AdminTable } from "../_components/AdminControls";
import { FaqItem, adminApi } from "@/services/adminApi";
import { ConfirmModal } from "@/component/ConfirmModal";

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [itemToDelete, setItemToDelete] = useState<FaqItem | null>(null);

  useEffect(() => {
    adminApi.faqs.list("en", 1, 100)
      .then((data) => setFaqs(data.items.sort((a, b) => a.displayOrder - b.displayOrder)))
      .catch((err) => setError(err?.message ?? "Failed to load FAQs."))
      .finally(() => setLoading(false));
  }, []);

  const confirmRemove = async () => {
    if (!itemToDelete) return;
    const faq = itemToDelete;
    setItemToDelete(null);
    try {
      await adminApi.faqs.remove(faq.id);
      setFaqs((items) => items.filter((item) => item.id !== faq.id));
    } catch (err: any) {
      setError(err?.message ?? "Failed to delete FAQ.");
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader actionHref="/admin/faqs/create" actionIcon={<Plus className="h-4 w-4" />} actionLabel="Create FAQ" title="FAQs" description="Manage global website frequently asked questions." />
      <AdminError message={error} />
      {loading ? <div className="py-16 text-center text-slate-400">Loading FAQs...</div> : faqs.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#000c24]">
          <AdminEmptyState icon={<HelpCircle className="h-12 w-12" />} title="No FAQs yet" />
        </div>
      ) : (
        <AdminTable>
          <thead className="border-b border-white/10 bg-white/5 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Question</th>
              <th className="px-6 py-4 font-medium">Order</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {faqs.map((faq) => (
              <tr key={faq.id}>
                <td className="max-w-[520px] truncate px-6 py-4 font-medium text-white">{faq.question}</td>
                <td className="px-6 py-4 text-slate-400">{faq.displayOrder}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full border px-2.5 py-1 text-xs ${faq.isActive ? "border-green-500/20 bg-green-500/10 text-green-400" : "border-white/10 bg-white/5 text-slate-500"}`}>
                    {faq.isActive ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <Link className="inline-flex items-center gap-1 text-[#22D3EE] hover:text-white" href={`/admin/faqs/${faq.id}`}><Edit2 className="h-4 w-4" />Edit</Link>
                    <button className="inline-flex items-center gap-1 text-red-400 hover:text-red-300" type="button" onClick={() => setItemToDelete(faq)}><Trash2 className="h-4 w-4" />Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}
      <ConfirmModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmRemove}
        title="Confirm Deletion"
        message={`Delete "${itemToDelete?.question ?? "this FAQ"}"?`}
      />
    </div>
  );
}

