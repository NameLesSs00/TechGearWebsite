"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminError, AdminInput, AdminPageHeader, AdminPanel, AdminTextarea, AdminToggle, LanguageTabs, SubmitButton } from "../_components/AdminControls";
import { adminApi } from "@/services/adminApi";

export default function FaqForm({ id }: { id?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ displayOrder: 1, isActive: true, enQuestion: "", arQuestion: "", enAnswer: "", arAnswer: "" });

  useEffect(() => {
    if (!id) return;
    Promise.all([adminApi.faqs.get(id, "en"), adminApi.faqs.get(id, "ar").catch(() => null)])
      .then(([en, ar]) => setForm({
        displayOrder: en.displayOrder,
        isActive: en.isActive,
        enQuestion: en.question ?? "",
        arQuestion: ar?.question ?? "",
        enAnswer: en.answer ?? "",
        arAnswer: ar?.answer ?? "",
      }))
      .catch((err) => setError(err?.message ?? "Failed to load FAQ."))
      .finally(() => setLoading(false));
  }, [id]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ...(id ? { id } : {}),
      displayOrder: Number(form.displayOrder),
      isActive: form.isActive,
      translations: [
        { languageCode: "en", question: form.enQuestion, answer: form.enAnswer },
        { languageCode: "ar", question: form.arQuestion, answer: form.arAnswer },
      ],
    };

    try {
      if (id) {
        await adminApi.faqs.update(id, payload);
        router.push("/admin/faqs");
      } else {
        const newId = await adminApi.faqs.create(payload);
        router.push(`/admin/faqs/${newId}`);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? "Failed to save FAQ.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-16 text-center text-slate-400">Loading FAQ...</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminPageHeader backHref="/admin/faqs" title={id ? "Edit FAQ" : "Create FAQ"} description="Write both English and Arabic content for a consistent public FAQ." />
      <AdminError message={error} />
      <form className="space-y-6" onSubmit={submit}>
        <AdminPanel title="Settings">
          <div className="grid gap-5 md:grid-cols-2">
            <AdminInput label="Display Order" type="number" value={form.displayOrder} onChange={(value) => setForm({ ...form, displayOrder: Number(value) || 1 })} />
            <AdminToggle label="Active" checked={form.isActive} onChange={(checked) => setForm({ ...form, isActive: checked })} />
          </div>
        </AdminPanel>
        <AdminPanel title="Content">
          <LanguageTabs
            en={<><AdminInput required label="Question" value={form.enQuestion} onChange={(value) => setForm({ ...form, enQuestion: value })} /><AdminTextarea required label="Answer" value={form.enAnswer} onChange={(value) => setForm({ ...form, enAnswer: value })} /></>}
            ar={<><AdminInput dir="rtl" label="Question" value={form.arQuestion} onChange={(value) => setForm({ ...form, arQuestion: value })} /><AdminTextarea dir="rtl" label="Answer" value={form.arAnswer} onChange={(value) => setForm({ ...form, arAnswer: value })} /></>}
          />
        </AdminPanel>
        <div className="flex justify-end"><SubmitButton loading={saving} label={id ? "Save FAQ" : "Create FAQ"} /></div>
      </form>
    </div>
  );
}

