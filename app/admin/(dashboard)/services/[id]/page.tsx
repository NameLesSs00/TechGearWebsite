"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, Loader2, Save, Upload, Trash2, CheckCircle,
  AlertCircle, Plus, X, GripVertical
} from "lucide-react";
import { serviceService, ServiceApiItem, ServiceFeature } from "@/services/serviceService";

// ─── Reusable Image Upload Zone ───────────────────────────────────────────────
function ImageUploadZone({
  label, currentUrl, fieldName, onUpload, onDelete,
}: {
  label: string;
  currentUrl: string | null;
  fieldName: string;
  onUpload: (file: File) => Promise<boolean>;
  onDelete: () => Promise<boolean>;
}) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const fileRef = useRef<HTMLInputElement>(null);

  const flash = (s: "success" | "error") => {
    setStatus(s);
    setTimeout(() => setStatus("idle"), 3000);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ok = await onUpload(file);
    if (ok) { setPreview(URL.createObjectURL(file)); flash("success"); }
    else flash("error");
    setUploading(false);
  };

  const handleDelete = async () => {
    if (!confirm(`Delete ${label}?`)) return;
    setDeleting(true);
    const ok = await onDelete();
    if (ok) { setPreview(null); if (fileRef.current) fileRef.current.value = ""; flash("success"); }
    else flash("error");
    setDeleting(false);
  };

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-white">{label}</span>
        {status === "success" && <CheckCircle className="w-4 h-4 text-green-400" />}
        {status === "error" && <AlertCircle className="w-4 h-4 text-red-400" />}
      </div>
      {preview
        ? <div className="relative w-full h-36 rounded-lg overflow-hidden bg-black/30"><Image src={preview} alt={label} fill className="object-contain" unoptimized /></div>
        : <div className="w-full h-36 rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center text-slate-500 text-sm">No image</div>
      }
      <div className="flex gap-2">
        <label className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm cursor-pointer transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? "Uploading…" : "Upload"}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} name={fieldName} />
        </label>
        {preview && (
          <button onClick={handleDelete} disabled={deleting} className="flex items-center gap-1 py-2 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm transition-colors disabled:opacity-50">
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── What We Deliver Item ─────────────────────────────────────────────────────
interface DeliverItem { id: string; enText: string; arText: string; displayOrder: number; }

function WhatWeDeliverSection({ serviceId, initialItems }: { serviceId: string; initialItems: DeliverItem[] }) {
  const [items, setItems] = useState<DeliverItem[]>(initialItems);
  const [adding, setAdding] = useState(false);
  const [newEn, setNewEn] = useState("");
  const [newAr, setNewAr] = useState("");
  const [saving, setSaving] = useState(false);
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

  const handleDelete = async (item: DeliverItem) => {
    if (!confirm("Delete this item?")) return;
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
            <button onClick={() => handleDelete(item)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all shrink-0">
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
            <button onClick={() => { setAdding(false); setNewEn(""); setNewAr(""); }} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">Cancel</button>
            <button onClick={handleAdd} disabled={saving || !newEn.trim()} className="flex items-center gap-1.5 px-4 py-2 bg-[#22D3EE] text-[#000918] text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────
function FeaturesSection({ serviceId, initialFeatures }: { serviceId: string; initialFeatures: ServiceFeature[] }) {
  const [features, setFeatures] = useState<ServiceFeature[]>(initialFeatures);
  const [adding, setAdding] = useState(false);
  const [newEnName, setNewEnName] = useState("");
  const [newArName, setNewArName] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newFilePreview, setNewFilePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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

  const handleDelete = async (featureId: string) => {
    if (!confirm("Delete this feature?")) return;
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
        <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 text-sm text-[#22D3EE] hover:text-white transition-colors">
          <Plus className="w-4 h-4" /> Add Feature
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {features.map((feature) => (
          <div key={feature.id} className="relative group bg-white/[0.03] border border-white/10 rounded-xl p-4 flex flex-col items-center gap-2 text-center">
            <button onClick={() => handleDelete(feature.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all">
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
                : <><Upload className="w-5 h-5 text-slate-500 mb-1" /><span className="text-xs text-slate-500">Icon</span></>
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
            <button onClick={() => { setAdding(false); setNewEnName(""); setNewArName(""); setNewFile(null); setNewFilePreview(null); }} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">Cancel</button>
            <button onClick={handleAdd} disabled={saving || !newEnName.trim()} className="flex items-center gap-1.5 px-4 py-2 bg-[#22D3EE] text-[#000918] text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Edit Page ───────────────────────────────────────────────────────────
interface PageProps { params: Promise<{ id: string }>; }

export default function EditServicePage({ params }: PageProps) {
  const router = useRouter();
  const [service, setService] = useState<ServiceApiItem | null>(null);
  const [arService, setArService] = useState<ServiceApiItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [id, setId] = useState("");

  const [form, setForm] = useState({
    enTitle: "", enSubtitle: "", enDescription: "",
    arTitle: "", arSubtitle: "", arDescription: "",
  });

  const [deliverItems, setDeliverItems] = useState<{ id: string; enText: string; arText: string; displayOrder: number }[]>([]);

  useEffect(() => {
    const init = async () => {
      const { id: sid } = await params;
      setId(sid);
      const [en, ar] = await Promise.all([
        serviceService.getServiceById(sid, "en"),
        serviceService.getServiceById(sid, "ar"),
      ]);
      if (en) {
        setService(en);
        setArService(ar);
        setForm({
          enTitle: en.title || "", enSubtitle: en.subtitle || "", enDescription: en.description || "",
          arTitle: ar?.title || "", arSubtitle: ar?.subtitle || "", arDescription: ar?.description || "",
        });
        // Merge EN/AR what-we-deliver — API returns flat strings per language
        const enItems = en.whatWeDeliver || [];
        const arItems = ar?.whatWeDeliver || [];
        // We don't have IDs from the list, so we can only show them.
        // IDs come from POST response; existing ones need re-fetching via individual endpoints.
        // For now, we show them read-only and allow adding new ones.
        setDeliverItems(enItems.map((text, i) => ({
          id: `legacy-${i}`, // placeholder — not deleteable without real IDs
          enText: text,
          arText: arItems[i] || "",
          displayOrder: i + 1,
        })));
      }
      setLoading(false);
    };
    init();
  }, [params]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSaving(true); setSaved(false);
    const ok = await serviceService.updateService(id, [
      { languageCode: "en", title: form.enTitle, subtitle: form.enSubtitle, description: form.enDescription },
      { languageCode: "ar", title: form.arTitle, subtitle: form.arSubtitle, description: form.arDescription },
    ]);
    if (ok?.success) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    else setError(ok?.message || "Failed to save. Please try again.");
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("Permanently delete this service? This cannot be undone.")) return;
    const ok = await serviceService.deleteService(id);
    if (ok?.success) router.push("/admin/services");
    else setError("Failed to delete service.");
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <Loader2 className="w-8 h-8 animate-spin text-[#22D3EE]" />
    </div>
  );

  if (!service) return (
    <div className="text-center text-slate-400 pt-20">
      <p>Service not found.</p>
      <Link href="/admin/services" className="text-[#22D3EE] hover:underline mt-2 inline-block">Back to list</Link>
    </div>
  );

  // Real deliver items = ones not legacy (added during this session)
  const realDeliverItems = deliverItems.filter(i => !i.id.startsWith("legacy-"));

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/services" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Edit Service</h2>
            <p className="text-slate-400 text-sm">{service.title}</p>
          </div>
        </div>
        <button onClick={handleDelete} className="flex items-center gap-2 py-2 px-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm transition-colors">
          <Trash2 className="w-4 h-4" /> Delete Service
        </button>
      </div>

      {/* Section 1: General Info */}
      <div className="bg-[#000c24] border border-white/10 rounded-2xl p-6 md:p-8">
        <h3 className="text-lg font-bold text-white mb-6">General Information</h3>
        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-200">{error}</div>}

        <form onSubmit={handleSave} className="space-y-8">
          {/* EN */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white border-b border-white/10 pb-2 flex items-center gap-2">
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded">EN</span> English
            </h4>
            {(["enTitle", "enSubtitle", "enDescription"] as const).map((k) => (
              <div key={k}>
                <label className="block text-sm font-medium text-slate-300 mb-2 capitalize">{k.replace("en", "")}</label>
                {k === "enDescription"
                  ? <textarea rows={3} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all" />
                  : <input type="text" value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all" />
                }
              </div>
            ))}
          </div>
          {/* AR */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white border-b border-white/10 pb-2 flex items-center gap-2">
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded">AR</span> Arabic
            </h4>
            {(["arTitle", "arSubtitle", "arDescription"] as const).map((k) => (
              <div key={k}>
                <label className="block text-sm font-medium text-slate-300 mb-2 capitalize">{k.replace("ar", "")}</label>
                {k === "arDescription"
                  ? <textarea rows={3} dir="rtl" value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all" />
                  : <input type="text" dir="rtl" value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all" />
                }
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="flex items-center gap-2 bg-[#22D3EE] hover:bg-[#1bb8d1] text-[#000918] font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-70">
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : saved ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Section 2: Images */}
      <div className="bg-[#000c24] border border-white/10 rounded-2xl p-6 md:p-8">
        <h3 className="text-lg font-bold text-white mb-2">Images</h3>
        <p className="text-slate-400 text-sm mb-6">Icon appears on the homepage card; Service Image appears on the detail page.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ImageUploadZone
            label="Icon Image (Homepage Card)"
            currentUrl={service.iconImageUrl}
            fieldName="IconImage"
            onUpload={(file) => serviceService.updateServiceIcon(id, file).then(r => r?.success === true)}
            onDelete={() => serviceService.deleteServiceIcon(id).then(r => r?.success === true)}
          />
          <ImageUploadZone
            label="Service Image (Detail Page)"
            currentUrl={service.serviceImageUrl}
            fieldName="ServiceImage"
            onUpload={(file) => serviceService.updateServiceImage(id, file).then(r => r?.success === true)}
            onDelete={() => serviceService.deleteServiceImage(id).then(r => r?.success === true)}
          />
        </div>
      </div>

      {/* Section 3: What We Deliver */}
      <WhatWeDeliverSection
        serviceId={id}
        initialItems={realDeliverItems}
      />

      {/* Section 4: Features */}
      <FeaturesSection serviceId={id} initialFeatures={service.features ?? []} />
    </div>
  );
}
