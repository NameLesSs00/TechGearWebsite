"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AdminError,
  AdminInput,
  AdminPageHeader,
  AdminPanel,
  AdminTextarea,
  LanguageTabs,
  SubmitButton,
} from "./AdminControls";
import { adminApi } from "@/services/adminApi";
import { withAdminNotice } from "@/lib/adminFeedback";

const LIST_PATH = "/admin/journeys";

interface JourneyFormState {
  displayOrder: number;
  yearOrDate: string;
  enTitle: string;
  arTitle: string;
  enDescription: string;
  arDescription: string;
}

const DEFAULT_FORM: JourneyFormState = {
  displayOrder: 1,
  yearOrDate: "",
  enTitle: "",
  arTitle: "",
  enDescription: "",
  arDescription: "",
};

export default function JourneyForm({ id }: { id?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<JourneyFormState>(DEFAULT_FORM);

  const set = (patch: Partial<JourneyFormState>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  // Load existing record when editing
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      adminApi.journeys.get(id, "en"),
      adminApi.journeys.get(id, "ar").catch(() => null),
    ])
      .then(([en, ar]) => {
        // Backend stores yearOrDate as a full date "2005-01-01" — extract just the year
        const rawYear = en.yearOrDate ?? "";
        const yearOnly = rawYear.match(/\b(19\d{2}|20\d{2})\b/)?.[0] ?? rawYear.split("-")[0] ?? rawYear;

        setForm({
          displayOrder: en.displayOrder,
          yearOrDate: yearOnly,
          enTitle: en.title ?? "",
          arTitle: ar?.title ?? "",
          enDescription: en.description ?? "",
          arDescription: ar?.description ?? "",
        });
      })
      .catch((err: any) => setError(err?.message ?? "Failed to load journey."))
      .finally(() => setLoading(false));
  }, [id]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const endpoint = id ? `/api/journeys/${id}` : "/api/journeys";
      const newId = await adminApi.journeys.saveForm(
        endpoint,
        id ? "put" : "post",
        {
          id,
          yearOrDate: form.yearOrDate,
          displayOrder: Number(form.displayOrder),
          image: undefined, // No image for journeys
          translations: [
            {
              languageCode: "en",
              title: form.enTitle,
              description: form.enDescription,
            },
            {
              languageCode: "ar",
              title: form.arTitle,
              description: form.arDescription,
            },
          ],
        }
      );

      const redirectPath = id
        ? LIST_PATH
        : `${LIST_PATH}/${newId}`;

      router.push(
        withAdminNotice(
          redirectPath,
          `Journey ${id ? "updated" : "created"} successfully.`
        )
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          err?.message ??
          "Failed to save journey."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="py-16 text-center text-slate-400">Loading journey...</div>
    );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader
        backHref={LIST_PATH}
        title={id ? "Edit Journey" : "Create Journey"}
        description="Manage timeline milestone data and localized content."
      />
      <AdminError message={error} />

      <form className="space-y-6" onSubmit={submit}>
        {/* Settings */}
        <AdminPanel title="Settings">
          <div className="grid gap-5 sm:grid-cols-2">
            <AdminInput
              label="Display Order"
              type="number"
              value={form.displayOrder}
              onChange={(value) => set({ displayOrder: Number(value) || 1 })}
            />
            <AdminInput
              required
              label="Year"
              type="text"
              value={form.yearOrDate}
              onChange={(value) => set({ yearOrDate: value })}
            />
          </div>
        </AdminPanel>

        {/* Localized Content */}
        <AdminPanel title="Localized Content">
          <LanguageTabs
            en={
              <>
                <AdminInput
                  required
                  label="Title"
                  value={form.enTitle}
                  onChange={(value) => set({ enTitle: value })}
                />
                <AdminTextarea
                  label="Description"
                  value={form.enDescription}
                  onChange={(value) => set({ enDescription: value })}
                />
              </>
            }
            ar={
              <>
                <AdminInput
                  dir="rtl"
                  label="Title"
                  value={form.arTitle}
                  onChange={(value) => set({ arTitle: value })}
                />
                <AdminTextarea
                  dir="rtl"
                  label="Description"
                  value={form.arDescription}
                  onChange={(value) => set({ arDescription: value })}
                />
              </>
            }
          />
        </AdminPanel>

        <div className="flex justify-end">
          <SubmitButton
            loading={saving}
            label={id ? "Save Journey" : "Create Journey"}
          />
        </div>
      </form>
    </div>
  );
}
