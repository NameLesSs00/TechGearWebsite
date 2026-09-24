"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, Mail, Trash2 } from "lucide-react";
import { AdminEmptyState, AdminError, AdminPageHeader, AdminTable } from "../_components/AdminControls";
import { ContactMessage, adminApi } from "@/services/adminApi";

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi.contactMessages.list(1, 100)
      .then((data) => setMessages(data.items))
      .catch((err) => setError(err?.message ?? "Failed to load contact messages."))
      .finally(() => setLoading(false));
  }, []);

  const remove = async (message: ContactMessage) => {
    if (!confirm(`Delete message from ${message.name ?? message.email ?? "this contact"}?`)) return;
    await adminApi.contactMessages.remove(message.id);
    setMessages((items) => items.filter((item) => item.id !== message.id));
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Contact Messages" description="Review contact form submissions and mark messages as read." />
      <AdminError message={error} />
      {loading ? <div className="py-16 text-center text-slate-400">Loading messages...</div> : messages.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#000c24]"><AdminEmptyState icon={<Mail className="h-12 w-12" />} title="No messages yet" /></div>
      ) : (
        <AdminTable>
          <thead className="border-b border-white/10 bg-white/5 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Contact</th>
              <th className="px-6 py-4 font-medium">Subject</th>
              <th className="px-6 py-4 font-medium">Received</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {messages.map((message) => (
              <tr key={message.id} className={!message.isRead ? "bg-[#22D3EE]/5" : ""}>
                <td className="px-6 py-4">
                  <p className="font-medium text-white">{message.name ?? "-"}</p>
                  <p className="text-xs text-slate-500">{message.email}</p>
                </td>
                <td className="max-w-[360px] truncate px-6 py-4 text-slate-300">{message.subject ?? "-"}</td>
                <td className="px-6 py-4 text-slate-500">{new Date(message.createdAt).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full border px-2.5 py-1 text-xs ${message.isRead ? "border-white/10 bg-white/5 text-slate-400" : "border-[#22D3EE]/20 bg-[#22D3EE]/10 text-[#22D3EE]"}`}>
                    {message.isRead ? "Read" : "Unread"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <Link className="inline-flex items-center gap-1 text-[#22D3EE] hover:text-white" href={`/admin/contact-messages/${message.id}`}><Eye className="h-4 w-4" />Open</Link>
                    <button className="inline-flex items-center gap-1 text-red-400 hover:text-red-300" type="button" onClick={() => remove(message)}><Trash2 className="h-4 w-4" />Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}
    </div>
  );
}

