"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Loader2, Plus, X, GripVertical, Trash2, CheckCircle, AlertCircle
} from "lucide-react";
import { serviceService, ServiceApiItem, ServiceFeature } from "@/services/serviceService";
import { ConfirmModal } from "@/component/ConfirmModal";
import {
  AdminError, AdminInput, AdminPageHeader, AdminPanel, AdminTextarea,
  DeleteButton, ImagePicker, LanguageTabs, SubmitButton,
} from "../../_components/AdminControls";

interface DeliverItem { id: string; enText: string; arText: string; displayOrder: number; }

function WhatWeDeliverSection({ serviceId, initialItems }: { serviceId: string; initialItems: DeliverItem[] }) {
  const [items, setItems] = useState<DeliverItem[]>(initialItems);
  const [adding, setAdding] = useState(false);
  const [newEn, setNewEn] = useState("");
  const [newAr, setNewAr] = useState("");
  const [saving, setSaving] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<DeliverItem | null>(null);
  const [statusMap, setStatusMap] = useState<Record<string, "success" | "error">>({});

  const flash = (id: string, s: "success" | "error") => {
    setStatusMap(m => ({ ...m, [id]: s }));
    setTimeout(() => setStatusMap(m => { const n = { ...m }; delete n[id]; return n; }), 3000);
  };

  const handleAdd = async () => {
    if (!newEn.trim()) return;
    setSaving(true);
    try {
      const res = await serviceService.addWhatWeDeliver(serviceId, [
        { languageCode: "en", text: newEn },
        { languageCode: "ar", text: newAr },
      ], items.length + 1);
      if (res?.success && res?.data) {
        setItems(prev => [...prev, { id: res.data!, enText: newEn, arText: newAr, displayOrder: prev.length + 1 }]);
        setNewEn(""); setNewAr(""); setAdding(false);
      }
    } catch { }
    setSaving(false);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    const item = itemToDelete;
    setItemToDelete(null);
    try {
      const res = await serviceService.deleteWhatWeDeliver(serviceId, item.id);
      if (res?.success) setItems(prev => prev.filter(i => i.id !== item.id));
      else flash(item.id, "error");
    } catch { flash(item.id, "error"); }
  };

  return (
    <div className="bg-[#000c24] border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-white">What We Deliver</h3>
        <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 text-sm text-[#22D3EE] hover:text-white transition-colors">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/10 rounded-xl group">
            <GripVertical className="w-4 h-4 text-slate-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm truncate">{item.enText}</p>
              {item.arText && <p className="text-slate-500 text-xs truncate" dir="rtl">{item.arText}</p>}
            </div>
            {statusMap[item.id] === "success" && <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />}
            {statusMap[item.id] === "error" && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
            <button type="button" onClick={() => setItemToDelete(item)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all shrink-0">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {items.length === 0 && !adding && (
          <p className="text-slate-500 text-sm text-center py-4">No items yet. Click &quot;Add Item&quot; to start.</p>
        )}
      </div>

      {adding && (
        <div className="mt-4 p-4 bg-white/[0.03] border border-[#22D3EE]/20 rounded-xl space-y-3">
          <input type="text" placeholder="English text" value={newEn} onChange={e => setNewEn(e.target.value)}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#22D3EE]/50 transition-all" />
          <input type="text" placeholder="Arabic text" dir="rtl" value={newAr} onChange={e => setNewAr(e.target.value)}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#22D3EE]/50 transition-all" />
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => { setAdding(false); setNewEn(""); setNewAr(""); }} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">Cancel</button>
            <button type="button" onClick={handleAdd} disabled={saving || !newEn.trim()} className="flex items-center gap-1.5 px-4 py-2 bg-[#22D3EE] text-[#000918] text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add
            </button>
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Delete this item?"
      />
    </div>
  );
}

function FeaturesSection({ serviceId, initialFeatures }: { serviceId: string; initialFeatures: ServiceFeature[] }) {
  const [features, setFeatures] = useState<ServiceFeature[]>(initialFeatures);
  const [adding, setAdding] = useState(false);
  const [newEnName, setNewEnName] = useState("");
  const [newArName, setNewArName] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newFilePreview, setNewFilePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [featureToDelete, setFeatureToDelete] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setNewFile(file); setNewFilePreview(URL.createObjectURL(file)); }
  };

  const handleAdd = async () => {
    setSaving(true);
    try {
      const res = await serviceService.addFeature(
        serviceId, newFile,
        [{ languageCode: "en", name: newEnName }, { languageCode: "ar", name: newArName }],
        features.length + 1
      );
      if (res?.success && res?.data) {
        setFeatures(prev => [...prev, {
          id: res.data, imageUrl: newFilePreview,
          name: newEnName, displayOrder: prev.length + 1
        }]);
        setNewEnName(""); setNewArName(""); setNewFile(null); setNewFilePreview(null); setAdding(false);
      }
    } catch { }
    setSaving(false);
  };

  const confirmDelete = async () => {
    if (!featureToDelete) return;
    const featureId = featureToDelete;
    setFeatureToDelete(null);
    try {
      const res = await serviceService.deleteFeature(serviceId, featureId);
      if (res?.success) setFeatures(prev => prev.filter(f => f.id !== featureId));
    } catch { }
  };

  const handleImageUpdate = async (featureId: string, file: File) => {
    const res = await serviceService.updateFeatureImage(serviceId, featureId, file);
    if (res?.success) {
      setFeatures(prev => prev.map(f => f.id === featureId ? { ...f, imageUrl: URL.createObjectURL(file) } : f));
    }
    return res?.success === true;
  };

  return (
    <div className="bg-[#000c24] border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-white">Features</h3>
        <button type="button" onClick={() => setAdding(true)} className="flex items-center gap-1.5 text-sm text-[#22D3EE] hover:text-white transition-colors">
          <Plus className="w-4 h-4" /> Add Feature
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {features.map((feature) => (
          <div key={feature.id} className="relative group bg-white/[0.03] border border-white/10 rounded-xl p-4 flex flex-col items-center gap-2 text-center">
            <button type="button" onClick={() => setFeatureToDelete(feature.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all">
              <X className="w-4 h-4" />
            </button>
            {feature.imageUrl
              ? <div className="relative w-12 h-12"><Image src={feature.imageUrl} alt={feature.name} fill className="object-contain" unoptimized /></div>
              : <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-slate-600 text-xs">No img</div>
            }
            <p className="text-white text-xs font-medium leading-tight">{feature.name}</p>
            <label className="text-xs text-slate-500 hover:text-[#22D3EE] cursor-pointer transition-colors">
              Replace image
              <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpdate(feature.id, f); }} />
            </label>
          </div>
        ))}
      </div>

      {features.length === 0 && !adding && (
        <p className="text-slate-500 text-sm text-center py-4">No features yet. Click &quot;Add Feature&quot; to start.</p>
      )}

      {adding && (
        <div className="mt-4 p-4 bg-white/[0.03] border border-[#22D3EE]/20 rounded-xl space-y-3">
          <div className="flex gap-4 items-start">
            <label className="shrink-0 w-20 h-20 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#22D3EE]/30 transition-colors">
              {newFilePreview
                ? <Image src={newFilePreview} alt="preview" width={80} height={80} className="w-full h-full object-contain rounded-xl" unoptimized />
                : <><Plus className="w-5 h-5 text-slate-500 mb-1" /><span className="text-xs text-slate-500">Icon</span></>
              }
              <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            </label>
            <div className="flex-1 space-y-2">
              <input type="text" placeholder="Feature name (EN)" value={newEnName} onChange={e => setNewEnName(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#22D3EE]/50 transition-all" />
              <input type="text" placeholder="Feature name (AR)" dir="rtl" value={newArName} onChange={e => setNewArName(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#22D3EE]/50 transition-all" />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => { setAdding(false); setNewEnName(""); setNewArName(""); setNewFile(null); setNewFilePreview(null); }} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">Cancel</button>
            <button type="button" onClick={handleAdd} disabled={saving || !newEnName.trim()} className="flex items-center gap-1.5 px-4 py-2 bg-[#22D3EE] text-[#000918] text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add
            </button>
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={!!featureToDelete}
        onClose={() => setFeatureToDelete(null)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Delete this feature?"
      />
    </div>
  );
}

export default function ServiceEditor({ serviceId }: { serviceId?: string }) {
  const router = useRouter();
  const [service, setService] = useState<ServiceApiItem | null>(null);
  const [loading, setLoading] = useState(Boolean(serviceId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [serviceImageFile, setServiceImageFile] = useState<File | null>(null);
  const [serviceImageUrl, setServiceImageUrl] = useState<string | null>(null);

  const [form, setForm] = useState({
    enTitle: "", enSubtitle: "", enDescription: "",
    arTitle: "", arSubtitle: "", arDescription: "",
  });

  const [deliverItems, setDeliverItems] = useState<{ id: string; enText: string; arText: string; displayOrder: number }[]>([]);

  useEffect(() => {
    if (!serviceId) return;
    const load = async () => {
      setLoading(true);
      try {
        const [en, ar] = await Promise.all([
          serviceService.getServiceById(serviceId, "en"),
          serviceService.getServiceById(serviceId, "ar").catch(() => null),
        ]);
        if (en) {
          setService(en);
          setIconUrl(en.iconImageUrl);
          setServiceImageUrl(en.serviceImageUrl);
          setForm({
            enTitle: en.title || "", enSubtitle: en.subtitle || "", enDescription: en.description || "",
            arTitle: ar?.title || "", arSubtitle: ar?.subtitle || "", arDescription: ar?.description || "",
          });
          const enItems = en.whatWeDeliver || [];
          const arItems = ar?.whatWeDeliver || [];
          setDeliverItems(enItems.map((text, i) => ({
            id: `legacy-${i}`,
            enText: text,
            arText: arItems[i] || "",
            displayOrder: i + 1,
          })));
        }
      } catch (err) {
        setError("Failed to load service details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [serviceId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload = [
        { languageCode: "en", title: form.enTitle, subtitle: form.enSubtitle, description: form.enDescription },
        { languageCode: "ar", title: form.arTitle, subtitle: form.arSubtitle, description: form.arDescription },
      ];

      if (serviceId) {
        await serviceService.updateService(serviceId, payload);
        if (iconFile) await serviceService.updateServiceIcon(serviceId, iconFile);
        if (serviceImageFile) await serviceService.updateServiceImage(serviceId, serviceImageFile);
        router.push("/admin/services");
      } else {
        const res = await serviceService.createService(payload);
        if (res?.success && res?.data) {
          const newId = res.data;
          if (iconFile) await serviceService.updateServiceIcon(newId, iconFile);
          if (serviceImageFile) await serviceService.updateServiceImage(newId, serviceImageFile);
          router.push(`/admin/services/${newId}`); // Redirect to edit mode so they can add features
        } else {
          setError(res?.message || "Failed to create service.");
        }
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to save service.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!serviceId) return;
    setIsConfirmOpen(false);
    try {
      await serviceService.deleteService(serviceId);
      router.push("/admin/services");
    } catch (err) {
      setError("Failed to delete service.");
    }
  };

  if (loading) return <div className="py-16 text-center text-slate-400">Loading service...</div>;

  const realDeliverItems = deliverItems.filter(i => !i.id.startsWith("legacy-"));

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <AdminPageHeader
        backHref="/admin/services"
        title={serviceId ? "Edit Service" : "Create Service"}
        description={serviceId ? "Manage service data and features." : "Add a new service and upload its images."}
      >
        {serviceId ? <DeleteButton onClick={() => setIsConfirmOpen(true)} label="Delete Service" /> : null}
      </AdminPageHeader>
      <AdminError message={error} />

      <form onSubmit={handleSave} className="space-y-6">
        <AdminPanel title="General Information">
          <LanguageTabs
            en={
              <>
                <AdminInput required label="Title" value={form.enTitle} onChange={v => setForm({ ...form, enTitle: v })} />
                <AdminInput required label="Subtitle" value={form.enSubtitle} onChange={v => setForm({ ...form, enSubtitle: v })} />
                <AdminTextarea required label="Description" value={form.enDescription} onChange={v => setForm({ ...form, enDescription: v })} />
              </>
            }
            ar={
              <>
                <AdminInput required dir="rtl" label="Title" value={form.arTitle} onChange={v => setForm({ ...form, arTitle: v })} />
                <AdminInput required dir="rtl" label="Subtitle" value={form.arSubtitle} onChange={v => setForm({ ...form, arSubtitle: v })} />
                <AdminTextarea required dir="rtl" label="Description" value={form.arDescription} onChange={v => setForm({ ...form, arDescription: v })} />
              </>
            }
          />
        </AdminPanel>

        <AdminPanel title="Images">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImagePicker label="Icon Image (Homepage Card)" currentUrl={iconUrl} file={iconFile} onChange={setIconFile} compact />
            <ImagePicker label="Service Image (Detail Page)" currentUrl={serviceImageUrl} file={serviceImageFile} onChange={setServiceImageFile} compact />
          </div>
        </AdminPanel>

        <div className="flex justify-end">
          <SubmitButton loading={saving} label={serviceId ? "Save Changes" : "Create Service"} />
        </div>
      </form>

      {serviceId && service && (
        <div className="space-y-6 mt-8">
          <WhatWeDeliverSection serviceId={serviceId} initialItems={realDeliverItems} />
          <FeaturesSection serviceId={serviceId} initialFeatures={service.features ?? []} />
        </div>
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message="Are you sure you want to permanently delete this service?"
      />
    </div>
  );
}
