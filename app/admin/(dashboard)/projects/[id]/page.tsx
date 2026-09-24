"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2, Save, CheckCircle, Trash2, Upload, X, Plus } from "lucide-react";
import { projectService, Project } from "@/services/projectService";
import { projectCategoryService, ProjectCategory } from "@/services/projectCategoryService";
import { ConfirmModal } from "@/component/ConfirmModal";

interface PageProps { params: Promise<{ id: string }>; }

export default function EditProjectPage({ params }: PageProps) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [arProject, setArProject] = useState<Project | null>(null);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [id, setId] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [form, setForm] = useState({
    categoryId: "", projectLink: "",
    enTitle: "", enDescription: "", enIndustry: "", enProjectType: "", enServices: "", enPlatform: "",
    arTitle: "", arDescription: "", arIndustry: "", arProjectType: "", arServices: "", arPlatform: "",
  });

  const [newIconFile, setNewIconFile] = useState<File | null>(null);
  const [newHeroFile, setNewHeroFile] = useState<File | null>(null);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { id: pid } = await params;
      setId(pid);
      const [en, ar, cats] = await Promise.all([
        projectService.getProjectById(pid, "en").catch(() => null),
        projectService.getProjectById(pid, "ar").catch(() => null),
        projectCategoryService.getAllCategories("en").catch(() => [] as ProjectCategory[]),
      ]);
      if (en) {
        setProject(en); setArProject(ar);
        setIconPreview(en.iconImageUrl || null);
        setHeroPreview(en.heroImageUrl || null);
        setForm({
          categoryId: en.categoryId || "",
          projectLink: en.projectLink || "",
          enTitle: en.title || "", enDescription: en.description || "",
          enIndustry: en.industry || "", enProjectType: en.projectType || "",
          enServices: en.services || "", enPlatform: en.platform || "",
          arTitle: ar?.title || "", arDescription: ar?.description || "",
          arIndustry: ar?.industry || "", arProjectType: ar?.projectType || "",
          arServices: ar?.services || "", arPlatform: ar?.platform || "",
        });
      }
      setCategories(cats);
      setLoading(false);
    };
    init();
  }, [params]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSaving(true); setSaved(false);
    try {
      const fd = new FormData();
      fd.append("Id", id);
      fd.append("CategoryId", form.categoryId);
      if (form.projectLink) fd.append("ProjectLink", form.projectLink);
      if (newIconFile) fd.append("IconImage", newIconFile);
      if (newHeroFile) fd.append("HeroImage", newHeroFile);
      newGalleryFiles.forEach(f => fd.append("Images", f));
      fd.append("Translations", JSON.stringify({ languageCode: "en", title: form.enTitle, description: form.enDescription, industry: form.enIndustry, projectType: form.enProjectType, services: form.enServices, platform: form.enPlatform }));
      fd.append("Translations", JSON.stringify({ languageCode: "ar", title: form.arTitle, description: form.arDescription, industry: form.arIndustry, projectType: form.arProjectType, services: form.arServices, platform: form.arPlatform }));
      await projectService.updateProject(id, fd);
      setSaved(true);
      setNewIconFile(null); setNewHeroFile(null); setNewGalleryFiles([]);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err?.message || "Failed to save changes.");
    }
    setSaving(false);
  };

  const handleDeleteClick = () => {
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setIsConfirmOpen(false);
    try {
      await projectService.deleteProject(id);
      router.push("/admin/projects");
    } catch { setError("Failed to delete project."); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-64"><Loader2 className="w-8 h-8 animate-spin text-[#22D3EE]" /></div>;
  if (!project) return <div className="text-center text-slate-400 pt-20"><p>Project not found.</p><Link href="/admin/projects" className="text-[#22D3EE] mt-2 inline-block">Back</Link></div>;

  const inp = (label: string, key: keyof typeof form, dir?: string) => (
    <div key={key}>
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      <input type="text" dir={dir} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all text-sm" />
    </div>
  );
  const ta = (label: string, key: keyof typeof form, dir?: string) => (
    <div key={key}>
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      <textarea rows={3} dir={dir} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all text-sm" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/projects" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Edit Project</h2>
            <p className="text-slate-400 text-sm">{project.title}</p>
          </div>
        </div>
        <button onClick={handleDeleteClick} className="flex items-center gap-2 py-2 px-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm transition-colors">
          <Trash2 className="w-4 h-4" /> Delete
        </button>
      </div>

      {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-200">{error}</div>}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-[#000c24] border border-white/10 rounded-2xl p-6 space-y-5">
          <h3 className="text-base font-bold text-white">Basic Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all text-sm">
                {categories.map(c => <option className="bg-[#000c24] text-white" key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            {inp("Project Link", "projectLink")}
          </div>
        </div>

        {/* Images */}
        <div className="bg-[#000c24] border border-white/10 rounded-2xl p-6 space-y-5">
          <h3 className="text-base font-bold text-white">Images</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Icon Image</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-[#22D3EE]/30 transition-colors overflow-hidden">
                {iconPreview ? <Image src={iconPreview} alt="Icon" width={128} height={128} className="w-full h-full object-contain" unoptimized /> : <><Upload className="w-5 h-5 text-slate-500 mb-1" /><span className="text-xs text-slate-500">Replace Icon</span></>}
                <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setNewIconFile(f); setIconPreview(URL.createObjectURL(f)); } }} />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Hero Image</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-[#22D3EE]/30 transition-colors overflow-hidden">
                {heroPreview ? <Image src={heroPreview} alt="Hero" width={300} height={128} className="w-full h-full object-cover" unoptimized /> : <><Upload className="w-5 h-5 text-slate-500 mb-1" /><span className="text-xs text-slate-500">Replace Hero</span></>}
                <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setNewHeroFile(f); setHeroPreview(URL.createObjectURL(f)); } }} />
              </label>
            </div>
          </div>

          {/* Existing gallery */}
          {project.images && project.images.length > 0 && (
            <div>
              <p className="text-sm font-medium text-slate-300 mb-3">Current Gallery ({project.images.length} images)</p>
              <div className="flex flex-wrap gap-3">
                {project.images.map(img => (
                  <div key={img.id} className="relative w-20 h-20 rounded-lg overflow-hidden bg-black/30">
                    <Image src={img.imageUrl} alt="gallery" fill className="object-cover" unoptimized />
                    {img.isFeatured && <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] bg-[#22D3EE]/80 text-black font-bold py-0.5">Featured</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add more gallery */}
          <div>
            <p className="text-sm font-medium text-slate-300 mb-3">Add Gallery Images</p>
            <div className="flex flex-wrap gap-3">
              {newGalleryFiles.map((f, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden bg-black/30 group">
                  <Image src={URL.createObjectURL(f)} alt={`new-${idx}`} fill className="object-cover" unoptimized />
                  <button type="button" onClick={() => setNewGalleryFiles(prev => prev.filter((_, i) => i !== idx))} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
              <label className="w-20 h-20 border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#22D3EE]/30 transition-colors">
                <Plus className="w-5 h-5 text-slate-500" />
                <span className="text-xs text-slate-500 mt-1">Add</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={e => setNewGalleryFiles(prev => [...prev, ...Array.from(e.target.files || [])])} />
              </label>
            </div>
          </div>
        </div>

        {/* English */}
        <div className="bg-[#000c24] border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2"><span className="text-xs bg-white/10 px-2 py-0.5 rounded">EN</span> English</h3>
          {inp("Title", "enTitle")}
          {ta("Description", "enDescription")}
          <div className="grid grid-cols-2 gap-4">
            {inp("Industry", "enIndustry")}{inp("Project Type", "enProjectType")}
            {inp("Services", "enServices")}{inp("Platform", "enPlatform")}
          </div>
        </div>

        {/* Arabic */}
        <div className="bg-[#000c24] border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2"><span className="text-xs bg-white/10 px-2 py-0.5 rounded">AR</span> Arabic</h3>
          {inp("Title", "arTitle", "rtl")}
          {ta("Description", "arDescription", "rtl")}
          <div className="grid grid-cols-2 gap-4">
            {inp("Industry", "arIndustry", "rtl")}{inp("Project Type", "arProjectType", "rtl")}
            {inp("Services", "arServices", "rtl")}{inp("Platform", "arPlatform", "rtl")}
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-[#22D3EE] hover:bg-[#1bb8d1] text-[#000918] font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-70">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : saved ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </form>
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Permanently delete this project? This cannot be undone."
      />
    </div>
  );
}
