"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { serviceService } from "@/services/serviceService";

export default function CreateServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    enTitle: "", enSubtitle: "", enDescription: "",
    arTitle: "", arSubtitle: "", arDescription: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await serviceService.createService([
        { languageCode: "en", title: form.enTitle, subtitle: form.enSubtitle, description: form.enDescription },
        { languageCode: "ar", title: form.arTitle, subtitle: form.arSubtitle, description: form.arDescription },
      ]);

      if (result?.success && result?.data) {
        router.push(`/admin/services/${result.data}`);
      } else {
        setError(result?.message || "Failed to create service. Please try again.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const field = (label: string, key: keyof typeof form, dir?: string) => (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">{label} <span className="text-red-400">*</span></label>
      <input
        required
        type="text"
        dir={dir}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all"
      />
    </div>
  );

  const textarea = (label: string, key: keyof typeof form, dir?: string) => (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">{label} <span className="text-red-400">*</span></label>
      <textarea
        required
        rows={3}
        dir={dir}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all"
      />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/services" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Create Service</h2>
          <p className="text-slate-400 text-sm">After saving, you will be redirected to add images and more details.</p>
        </div>
      </div>

      <div className="bg-[#000c24] border border-white/10 rounded-2xl p-6 md:p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-200">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* English */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded">EN</span> English Content
            </h3>
            {field("Title", "enTitle")}
            {field("Subtitle", "enSubtitle")}
            {textarea("Description", "enDescription")}
          </div>

          {/* Arabic */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded">AR</span> Arabic Content
            </h3>
            {field("Title", "arTitle", "rtl")}
            {field("Subtitle", "arSubtitle", "rtl")}
            {textarea("Description", "arDescription", "rtl")}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-[#22D3EE] hover:bg-[#1bb8d1] text-[#000918] font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save & Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
