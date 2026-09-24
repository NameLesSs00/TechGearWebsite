"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { reviewService } from "@/services/reviewService";

export default function CreateReviewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    clientName: "",
    videoUrl: "",
    stars: 5,
    enContent: "",
    arContent: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        clientName: formData.clientName,
        videoUrl: formData.videoUrl,
        stars: formData.stars,
        translations: [
          { languageCode: "en", reviewContent: formData.enContent },
          { languageCode: "ar", reviewContent: formData.arContent },
        ],
      };

      const newId = await reviewService.createReview(payload);
      
      if (newId) {
        // Redirect to the edit page where they can upload images
        router.push(`/admin/reviews/${newId}`);
      } else {
        setError("Failed to create review. Please check your inputs and try again.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/reviews" 
          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Create Review</h2>
          <p className="text-slate-400 text-sm">Add a new client testimonial.</p>
        </div>
      </div>

      <div className="bg-[#000c24] border border-white/10 rounded-2xl p-6 md:p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Client Name <span className="text-red-400">*</span></label>
              <input
                required
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all"
                placeholder="E.g. Acme Corp"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Stars (1-5) <span className="text-red-400">*</span></label>
              <input
                required
                type="number"
                min="1"
                max="5"
                value={formData.stars}
                onChange={(e) => setFormData({ ...formData, stars: parseInt(e.target.value) || 5 })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Video URL (Optional)</label>
            <input
              type="url"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all"
              placeholder="https://..."
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-lg font-semibold text-white">Review Content</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">English Content <span className="text-red-400">*</span></label>
              <textarea
                required
                rows={4}
                value={formData.enContent}
                onChange={(e) => setFormData({ ...formData, enContent: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Arabic Content <span className="text-red-400">*</span></label>
              <textarea
                required
                rows={4}
                dir="rtl"
                value={formData.arContent}
                onChange={(e) => setFormData({ ...formData, arContent: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all font-rubik"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-[#22D3EE] hover:bg-[#1bb8d1] text-[#000918] font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save & Continue to Images
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
