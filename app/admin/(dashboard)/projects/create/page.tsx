"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2, Upload, X } from "lucide-react";
import { projectService } from "@/services/projectService";
import { projectCategoryService, ProjectCategory } from "@/services/projectCategoryService";

export default function CreateProjectPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    categoryId: "",
    projectLink: "",
    enTitle: "", enDescription: "", enIndustry: "", enProjectType: "", enServices: "", enPlatform: "",
    arTitle: "", arDescription: "", arIndustry: "", arProjectType: "", arServices: "", arPlatform: "",
  });

  const [iconFile, setIconFile] = useState<File | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    projectCategoryService.getAllCategories("en").then(setCategories).catch(() => { });
  }, []);

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setIconFile(f); setIconPreview(URL.createObjectURL(f)); }
  };
  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setHeroFile(f); setHeroPreview(URL.createObjectURL(f)); }
  };
  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setGalleryFiles(prev => [...prev, ...files]);
  };
  const removeGalleryFile = (idx: number) => setGalleryFiles(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryId) { setError("Please select a category."); return; }
    setError(""); setLoading(true);

    try {
      const fd = new FormData();
      fd.append("CategoryId", form.categoryId);
      if (form.projectLink) fd.append("ProjectLink", form.projectLink);
      if (iconFile) fd.append("IconImage", iconFile);
      if (heroFile) fd.append("HeroImage", heroFile);
      galleryFiles.forEach(f => fd.append("Images", f));

      const enTrans = JSON.stringify({ languageCode: "en", title: form.enTitle, description: form.enDescription, industry: form.enIndustry, projectType: form.enProjectType, services: form.enServices, platform: form.enPlatform });
      const arTrans = JSON.stringify({ languageCode: "ar", title: form.arTitle, description: form.arDescription, industry: form.arIndustry, projectType: form.arProjectType, services: form.arServices, platform: form.arPlatform });
      fd.append("Translations", enTrans);
      fd.append("Translations", arTrans);

      const newId = await projectService.createProject(fd);
      router.push(`/admin/projects/${newId}`);
    } catch (err: any) {
      setError(err?.message || "Failed to create project.");
    } finally {
      setLoading(false);
    }
  };

  const textInput = (label: string, key: keyof typeof form, dir?: string) => (
    <div key={key}>
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      <input type="text" dir={dir} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all text-sm" />
    </div>
  );

  const textareaInput = (label: string, key: keyof typeof form, dir?: string) => (
    <div key={key}>
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      <textarea rows={3} dir={dir} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all text-sm" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/admin/projects" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Create Project</h2>
          <p className="text-slate-400 text-sm">Fill in the details and upload images for the new project.</p>
        </div>
      </div>

      {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-200">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-[#000c24] border border-white/10 rounded-2xl p-6 space-y-5">
          <h3 className="text-base font-bold text-white">Basic Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category <span className="text-red-400">*</span></label>
              <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all text-sm">
                <option className="bg-[#000c24] text-white" value="">Select a category...</option>
                {categories.map(c => <option className="bg-[#000c24] text-white" key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            {textInput("Project Link (URL)", "projectLink")}
          </div>
        </div>

        {/* Images */}
        <div className="bg-[#000c24] border border-white/10 rounded-2xl p-6 space-y-5">
          <h3 className="text-base font-bold text-white">Images</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Icon */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Icon Image</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-[#22D3EE]/30 transition-colors overflow-hidden">
                {iconPreview
                  ? <Image src={iconPreview} alt="Icon" width={128} height={128} className="w-full h-full object-contain" unoptimized />
                  : <><Upload className="w-5 h-5 text-slate-500 mb-1" /><span className="text-xs text-slate-500">Icon Image</span></>
                }
                <input type="file" accept="image/*" className="hidden" onChange={handleIconChange} />
              </label>
            </div>
            {/* Hero */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Hero Image</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-[#22D3EE]/30 transition-colors overflow-hidden">
                {heroPreview
                  ? <Image src={heroPreview} alt="Hero" width={300} height={128} className="w-full h-full object-cover" unoptimized />
                  : <><Upload className="w-5 h-5 text-slate-500 mb-1" /><span className="text-xs text-slate-500">Hero Image</span></>
                }
                <input type="file" accept="image/*" className="hidden" onChange={handleHeroChange} />
              </label>
            </div>
          </div>
          {/* Gallery */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Gallery Images</label>
            <div className="flex flex-wrap gap-3">
              {galleryFiles.map((f, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden bg-black/30 group">
                  <Image src={URL.createObjectURL(f)} alt={`img-${idx}`} fill className="object-cover" unoptimized />
                  <button type="button" onClick={() => removeGalleryFile(idx)} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
              <label className="w-20 h-20 border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#22D3EE]/30 transition-colors">
                <Plus className="w-5 h-5 text-slate-500" />
                <span className="text-xs text-slate-500 mt-1">Add</span>
                <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryChange} />
              </label>
            </div>
          </div>
        </div>

        {/* English */}
        <div className="bg-[#000c24] border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2"><span className="text-xs bg-white/10 px-2 py-0.5 rounded">EN</span> English Content</h3>
          {textInput("Title *", "enTitle")}
          {textareaInput("Description", "enDescription")}
          <div className="grid grid-cols-2 gap-4">
            {textInput("Industry", "enIndustry")}
            {textInput("Project Type", "enProjectType")}
            {textInput("Services", "enServices")}
            {textInput("Platform", "enPlatform")}
          </div>
        </div>

        {/* Arabic */}
        <div className="bg-[#000c24] border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2"><span className="text-xs bg-white/10 px-2 py-0.5 rounded">AR</span> Arabic Content</h3>
          {textInput("Title", "arTitle", "rtl")}
          {textareaInput("Description", "arDescription", "rtl")}
          <div className="grid grid-cols-2 gap-4">
            {textInput("Industry", "arIndustry", "rtl")}
            {textInput("Project Type", "arProjectType", "rtl")}
            {textInput("Services", "arServices", "rtl")}
            {textInput("Platform", "arPlatform", "rtl")}
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 bg-[#22D3EE] hover:bg-[#1bb8d1] text-[#000918] font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-70">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {loading ? "Creating…" : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
}

// needed by JSX
import { Plus } from "lucide-react";
