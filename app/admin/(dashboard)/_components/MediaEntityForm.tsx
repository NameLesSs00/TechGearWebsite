"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminError, AdminInput, AdminPageHeader, AdminPanel, AdminTextarea, ImagePicker, LanguageTabs, SubmitButton } from "./AdminControls";
import { adminApi } from "@/services/adminApi";

type EntityKind = "journey" | "partner" | "teamMember";

const config = {
  journey: { listPath: "/admin/journeys", singular: "Journey", plural: "Journeys" },
  partner: { listPath: "/admin/partners", singular: "Partner", plural: "Partners" },
  teamMember: { listPath: "/admin/team-members", singular: "Team Member", plural: "Team Members" },
};

export default function MediaEntityForm({ id, kind }: { id?: string; kind: EntityKind }) {
  const router = useRouter();
  const meta = config[kind];
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [form, setForm] = useState({
    displayOrder: 1,
    yearOrDate: "",
    logoUrl: "",
    enName: "",
    arName: "",
    enJobTitle: "",
    arJobTitle: "",
    enTitle: "",
    arTitle: "",
    enDescription: "",
    arDescription: "",
  });

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);
      try {
        if (kind === "journey") {
          const [en, ar] = await Promise.all([adminApi.journeys.get(id, "en"), adminApi.journeys.get(id, "ar").catch(() => null)]);
          setImageUrl(en.imageUrl);
          setForm((current) => ({
            ...current,
            displayOrder: en.displayOrder,
            yearOrDate: en.yearOrDate ?? "",
            enTitle: en.title ?? "",
            arTitle: ar?.title ?? "",
            enDescription: en.description ?? "",
            arDescription: ar?.description ?? "",
          }));
        } else if (kind === "partner") {
          const [en, ar] = await Promise.all([adminApi.partners.get(id, "en"), adminApi.partners.get(id, "ar").catch(() => null)]);
          setImageUrl(en.imageUrl);
          setForm((current) => ({ ...current, logoUrl: en.logoUrl ?? "", enName: en.name ?? "", arName: ar?.name ?? "" }));
        } else {
          const [en, ar] = await Promise.all([adminApi.teamMembers.get(id, "en"), adminApi.teamMembers.get(id, "ar").catch(() => null)]);
          setImageUrl(en.imageUrl);
          setForm((current) => ({
            ...current,
            displayOrder: en.displayOrder,
            enName: en.name ?? "",
            arName: ar?.name ?? "",
            enJobTitle: en.jobTitle ?? "",
            arJobTitle: ar?.jobTitle ?? "",
          }));
        }
      } catch (err: any) {
        setError(err?.message ?? `Failed to load ${meta.singular.toLowerCase()}.`);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, kind, meta.singular]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (kind === "journey") {
        const endpoint = id ? `/api/journeys/${id}` : "/api/journeys";
        const newId = await adminApi.journeys.saveForm(endpoint, id ? "put" : "post", {
          id,
          yearOrDate: form.yearOrDate,
          displayOrder: Number(form.displayOrder),
          image: imageFile,
          translations: [
            { languageCode: "en", title: form.enTitle, description: form.enDescription },
            { languageCode: "ar", title: form.arTitle, description: form.arDescription },
          ],
        });
        router.push(id ? meta.listPath : `${meta.listPath}/${newId}`);
      } else if (kind === "partner") {
        const endpoint = id ? `/api/partners/${id}` : "/api/partners";
        const newId = await adminApi.partners.saveForm(endpoint, id ? "put" : "post", {
          id,
          image: imageFile,
          logoUrl: form.logoUrl,
          translations: [
            { languageCode: "en", name: form.enName },
            { languageCode: "ar", name: form.arName },
          ],
        });
        router.push(id ? meta.listPath : `${meta.listPath}/${newId}`);
      } else {
        const endpoint = id ? `/api/team-members/${id}` : "/api/team-members";
        const newId = await adminApi.teamMembers.saveForm(endpoint, id ? "put" : "post", {
          id,
          displayOrder: Number(form.displayOrder),
          image: imageFile,
          translations: [
            { languageCode: "en", name: form.enName, jobTitle: form.enJobTitle },
            { languageCode: "ar", name: form.arName, jobTitle: form.arJobTitle },
          ],
        });
        router.push(id ? meta.listPath : `${meta.listPath}/${newId}`);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? `Failed to save ${meta.singular.toLowerCase()}.`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-16 text-center text-slate-400">Loading {meta.singular.toLowerCase()}...</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminPageHeader backHref={meta.listPath} title={id ? `Edit ${meta.singular}` : `Create ${meta.singular}`} description={`Manage ${meta.singular.toLowerCase()} data and localized content.`} />
      <AdminError message={error} />

      <form className="space-y-6" onSubmit={submit}>
        <AdminPanel title="Media And Settings">
          <div className="grid gap-5 md:grid-cols-2">
            {kind !== "partner" ? <AdminInput label="Display Order" type="number" value={form.displayOrder} onChange={(value) => setForm({ ...form, displayOrder: Number(value) || 1 })} /> : null}
            {kind === "journey" ? <AdminInput label="Year Or Date" value={form.yearOrDate} onChange={(value) => setForm({ ...form, yearOrDate: value })} /> : null}
            {kind === "partner" ? <AdminInput label="Logo URL" value={form.logoUrl} onChange={(value) => setForm({ ...form, logoUrl: value })} /> : null}
            <div className={kind === "partner" ? "md:col-span-2" : ""}>
              <ImagePicker label="Image" currentUrl={imageUrl} file={imageFile} onChange={setImageFile} />
            </div>
          </div>
        </AdminPanel>

        <AdminPanel title="Localized Content">
          {kind === "journey" ? (
            <LanguageTabs
              en={<><AdminInput required label="Title" value={form.enTitle} onChange={(value) => setForm({ ...form, enTitle: value })} /><AdminTextarea label="Description" value={form.enDescription} onChange={(value) => setForm({ ...form, enDescription: value })} /></>}
              ar={<><AdminInput dir="rtl" label="Title" value={form.arTitle} onChange={(value) => setForm({ ...form, arTitle: value })} /><AdminTextarea dir="rtl" label="Description" value={form.arDescription} onChange={(value) => setForm({ ...form, arDescription: value })} /></>}
            />
          ) : kind === "partner" ? (
            <LanguageTabs
              en={<AdminInput required label="Name" value={form.enName} onChange={(value) => setForm({ ...form, enName: value })} />}
              ar={<AdminInput dir="rtl" label="Name" value={form.arName} onChange={(value) => setForm({ ...form, arName: value })} />}
            />
          ) : (
            <LanguageTabs
              en={<><AdminInput required label="Name" value={form.enName} onChange={(value) => setForm({ ...form, enName: value })} /><AdminInput label="Job Title" value={form.enJobTitle} onChange={(value) => setForm({ ...form, enJobTitle: value })} /></>}
              ar={<><AdminInput dir="rtl" label="Name" value={form.arName} onChange={(value) => setForm({ ...form, arName: value })} /><AdminInput dir="rtl" label="Job Title" value={form.arJobTitle} onChange={(value) => setForm({ ...form, arJobTitle: value })} /></>}
            />
          )}
        </AdminPanel>

        <div className="flex justify-end"><SubmitButton loading={saving} label={id ? `Save ${meta.singular}` : `Create ${meta.singular}`} /></div>
      </form>
    </div>
  );
}

