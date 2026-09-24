"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminError, AdminPageHeader, AdminPanel, AdminToggle, DeleteButton } from "../../_components/AdminControls";
import { ContactMessage, adminApi } from "@/services/adminApi";
import { ConfirmModal } from "@/component/ConfirmModal";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ContactMessageDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [message, setMessage] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    adminApi.contactMessages.get(id)
      .then(setMessage)
      .catch((err) => setError(err?.message ?? "Failed to load message."))
      .finally(() => setLoading(false));
  }, [id]);

  const updateRead = async (checked: boolean) => {
    if (!message) return;
    setSaving(true);
    try {
      await adminApi.contactMessages.updateRead(id, checked);
      setMessage({ ...message, isRead: checked });
    } catch (err: any) {
      setError(err?.message ?? "Failed to update message.");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveClick = () => setIsConfirmOpen(true);

  const confirmRemove = async () => {
    setIsConfirmOpen(false);
    await adminApi.contactMessages.remove(id);
    router.push("/admin/contact-messages");
  };

  if (loading) return <div className="py-16 text-center text-slate-400">Loading message...</div>;
  if (!message) return <div className="py-16 text-center text-slate-400">Message not found.</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminPageHeader backHref="/admin/contact-messages" title={message.subject ?? "Contact Message"} description={`From ${message.name ?? "Unknown"} on ${new Date(message.createdAt).toLocaleString()}`}>
        <DeleteButton loading={saving} label="Delete Message" onClick={handleRemoveClick} />
      </AdminPageHeader>
      <AdminError message={error} />
      <AdminPanel title="Message Status">
        <AdminToggle label="Mark as read" checked={message.isRead} onChange={updateRead} />
      </AdminPanel>
      <AdminPanel title="Contact Details">
        <dl className="grid gap-4 text-sm md:grid-cols-2">
          <div><dt className="text-slate-500">Name</dt><dd className="mt-1 text-white">{message.name ?? "-"}</dd></div>
          <div><dt className="text-slate-500">Email</dt><dd className="mt-1 text-white">{message.email ?? "-"}</dd></div>
          <div><dt className="text-slate-500">Phone</dt><dd className="mt-1 text-white">{message.phone ?? "-"}</dd></div>
          <div><dt className="text-slate-500">Subject</dt><dd className="mt-1 text-white">{message.subject ?? "-"}</dd></div>
        </dl>
      </AdminPanel>
      <AdminPanel title="Message">
        <p className="whitespace-pre-wrap leading-7 text-slate-200">{message.message ?? "-"}</p>
      </AdminPanel>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmRemove}
        title="Confirm Deletion"
        message="Delete this contact message?"
      />
    </div>
  );
}

