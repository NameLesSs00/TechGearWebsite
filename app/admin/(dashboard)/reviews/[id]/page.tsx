"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2, Save, Upload, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import { reviewService, ReviewApiItem } from "@/services/reviewService";

interface ImageUploadZoneProps {
  label: string;
  currentImageUrl: string | null;
  onUpload: (formData: FormData) => Promise<boolean>;
  onDelete: () => Promise<boolean>;
  fieldName: string;
}

function ImageUploadZone({ label, currentImageUrl, onUpload, onDelete, fieldName }: ImageUploadZoneProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatus("idle");
    const formData = new FormData();
    formData.append("Image", file);

    const success = await onUpload(formData);
    if (success) {
      setPreviewUrl(URL.createObjectURL(file));
      setStatus("success");
    } else {
      setStatus("error");
    }
    setUploading(false);
    setTimeout(() => setStatus("idle"), 3000);
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete the ${label}?`)) return;
    setDeleting(true);
    const success = await onDelete();
    if (success) {
      setPreviewUrl(null);
      setStatus("success");
      if (fileRef.current) fileRef.current.value = "";
    } else {
      setStatus("error");
    }
    setDeleting(false);
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-white text-sm">{label}</h4>
        {status === "success" && <CheckCircle className="w-4 h-4 text-green-400" />}
        {status === "error" && <AlertCircle className="w-4 h-4 text-red-400" />}
      </div>

      {previewUrl ? (
        <div className="relative w-full h-40 rounded-lg overflow-hidden bg-black/30">
          <Image src={previewUrl} alt={label} fill className="object-contain" unoptimized />
        </div>
      ) : (
        <div className="w-full h-40 rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center text-slate-500 text-sm">
          No image uploaded
        </div>
      )}

      <div className="flex gap-2">
        <label className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-colors cursor-pointer ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}>
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? "Uploading..." : "Upload"}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
            name={fieldName}
          />
        </label>
        {previewUrl && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 py-2.5 px-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditReviewPage({ params }: PageProps) {
  const router = useRouter();
  const [review, setReview] = useState<ReviewApiItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [id, setId] = useState<string>("");

  const [formData, setFormData] = useState({
    clientName: "",
    videoUrl: "",
    stars: 5,
    enContent: "",
    arContent: "",
  });

  useEffect(() => {
    const init = async () => {
      const { id: reviewId } = await params;
      setId(reviewId);

      const [enReview, arReview] = await Promise.all([
        reviewService.getReviewById(reviewId, "en"),
        reviewService.getReviewById(reviewId, "ar"),
      ]);

      if (enReview) {
        setReview(enReview);
        setFormData({
          clientName: enReview.clientName,
          videoUrl: enReview.videoUrl || "",
          stars: enReview.stars,
          enContent: enReview.reviewContent || "",
          arContent: arReview?.reviewContent || "",
        });
      }
      setLoading(false);
    };
    init();
  }, [params]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    setSaved(false);

    const payload = {
      id,
      clientName: formData.clientName,
      videoUrl: formData.videoUrl,
      stars: formData.stars,
      translations: [
        { languageCode: "en", reviewContent: formData.enContent },
        { languageCode: "ar", reviewContent: formData.arContent },
      ],
    };

    const success = await reviewService.updateReview(id, payload);
    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError("Failed to save changes. Please try again.");
    }
    setSaving(false);
  };

  const handleDeleteReview = async () => {
    if (!confirm("Are you sure you want to permanently delete this review? This cannot be undone.")) return;
    const success = await reviewService.deleteReview(id);
    if (success) {
      router.push("/admin/reviews");
    } else {
      setError("Failed to delete review.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#22D3EE]" />
      </div>
    );
  }

  if (!review) {
    return (
      <div className="text-center text-slate-400 pt-20">
        <p>Review not found.</p>
        <Link href="/admin/reviews" className="text-[#22D3EE] hover:underline mt-2 inline-block">Back to list</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/reviews"
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Edit Review</h2>
            <p className="text-slate-400 text-sm">{review.clientName}</p>
          </div>
        </div>
        <button
          onClick={handleDeleteReview}
          className="flex items-center gap-2 py-2 px-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete Review
        </button>
      </div>

      {/* General Info Section */}
      <div className="bg-[#000c24] border border-white/10 rounded-2xl p-6 md:p-8">
        <h3 className="text-lg font-bold text-white mb-6">General Information</h3>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Client Name</label>
              <input
                required
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Stars (1-5)</label>
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
            <h4 className="font-semibold text-white">Review Content</h4>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">English</label>
              <textarea
                rows={4}
                value={formData.enContent}
                onChange={(e) => setFormData({ ...formData, enContent: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Arabic</label>
              <textarea
                rows={4}
                dir="rtl"
                value={formData.arContent}
                onChange={(e) => setFormData({ ...formData, arContent: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-[#22D3EE] hover:bg-[#1bb8d1] text-[#000918] font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : saved ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Image Management Section */}
      <div className="bg-[#000c24] border border-white/10 rounded-2xl p-6 md:p-8">
        <h3 className="text-lg font-bold text-white mb-2">Image Management</h3>
        <p className="text-slate-400 text-sm mb-6">Upload the three distinct images for this review.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ImageUploadZone
            label="Client Image"
            currentImageUrl={review.client_image}
            fieldName="Image"
            onUpload={(fd) => reviewService.uploadClientImage(id, fd)}
            onDelete={() => reviewService.deleteClientImage(id)}
          />
          <ImageUploadZone
            label="Hero Image"
            currentImageUrl={review.hero_image}
            fieldName="Image"
            onUpload={(fd) => reviewService.uploadHeroImage(id, fd)}
            onDelete={() => reviewService.deleteHeroImage(id)}
          />
          <ImageUploadZone
            label="Icon Image"
            currentImageUrl={review.icon_image}
            fieldName="Image"
            onUpload={(fd) => reviewService.uploadIconImage(id, fd)}
            onDelete={() => reviewService.deleteIconImage(id)}
          />
        </div>
      </div>
    </div>
  );
}
