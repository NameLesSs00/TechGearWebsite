"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AdminError,
  AdminInput,
  AdminPageHeader,
  AdminPanel,
  AdminTextarea,
  DeleteButton,
  ImagePicker,
  LanguageTabs,
  SubmitButton,
} from "../../_components/AdminControls";
import { reviewService } from "@/services/reviewService";
import { ConfirmModal } from "@/component/ConfirmModal";

export default function ReviewEditor({ reviewId }: { reviewId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(Boolean(reviewId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [clientImageFile, setClientImageFile] = useState<File | null>(null);
  const [clientImageUrl, setClientImageUrl] = useState<string | null>(null);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
  const [iconImageFile, setIconImageFile] = useState<File | null>(null);
  const [iconImageUrl, setIconImageUrl] = useState<string | null>(null);

  const [form, setForm] = useState({
    clientName: "",
    videoUrl: "",
    stars: 5,
    enContent: "",
    arContent: "",
  });

  useEffect(() => {
    if (!reviewId) return;
    const load = async () => {
      setLoading(true);
      try {
        const [en, ar] = await Promise.all([
          reviewService.getReviewById(reviewId, "en"),
          reviewService.getReviewById(reviewId, "ar").catch(() => null),
        ]);
        if (en) {
          setClientImageUrl(en.client_image ?? null);
          setHeroImageUrl(en.hero_image ?? null);
          setIconImageUrl(en.icon_image ?? null);
          setForm({
            clientName: en.clientName ?? "",
            videoUrl: en.videoUrl ?? "",
            stars: en.stars ?? 5,
            enContent: en.reviewContent ?? "",
            arContent: ar?.reviewContent ?? "",
          });
        }
      } catch (err: any) {
        setError("Failed to load review details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [reviewId]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload = {
        clientName: form.clientName,
        videoUrl: form.videoUrl,
        stars: form.stars,
        translations: [
          { languageCode: "en", reviewContent: form.enContent },
          { languageCode: "ar", reviewContent: form.arContent },
        ],
      };

      if (reviewId) {
        await reviewService.updateReview(reviewId, payload);
        
        if (clientImageFile) {
          const fd = new FormData(); fd.append("Image", clientImageFile);
          await reviewService.uploadClientImage(reviewId, fd);
        }
        if (heroImageFile) {
          const fd = new FormData(); fd.append("Image", heroImageFile);
          await reviewService.uploadHeroImage(reviewId, fd);
        }
        if (iconImageFile) {
          const fd = new FormData(); fd.append("Image", iconImageFile);
          await reviewService.uploadIconImage(reviewId, fd);
        }
        
        router.push("/admin/reviews");
      } else {
        const newId = await reviewService.createReview(payload);
        if (newId) {
          if (clientImageFile) {
            const fd = new FormData(); fd.append("Image", clientImageFile);
            await reviewService.uploadClientImage(newId, fd);
          }
          if (heroImageFile) {
            const fd = new FormData(); fd.append("Image", heroImageFile);
            await reviewService.uploadHeroImage(newId, fd);
          }
          if (iconImageFile) {
            const fd = new FormData(); fd.append("Image", iconImageFile);
            await reviewService.uploadIconImage(newId, fd);
          }
          router.push("/admin/reviews");
        } else {
          throw new Error("Failed to create review. No ID returned.");
        }
      }
    } catch (err: any) {
      setError(err?.message ?? "Failed to save review.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!reviewId) return;
    setIsConfirmOpen(false);
    try {
      await reviewService.deleteReview(reviewId);
      router.push("/admin/reviews");
    } catch (err) {
      setError("Failed to delete review.");
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-slate-400">Loading review...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminPageHeader
        backHref="/admin/reviews"
        title={reviewId ? "Edit Review" : "Create Review"}
        description={reviewId ? "Modify an existing client review." : "Add a new client testimonial."}
      >
        {reviewId ? <DeleteButton onClick={() => setIsConfirmOpen(true)} label="Delete Review" /> : null}
      </AdminPageHeader>
      <AdminError message={error} />

      <form className="space-y-6" onSubmit={handleSubmit}>
        <AdminPanel title="General Information">
          <div className="grid gap-5 md:grid-cols-2">
            <AdminInput
              required
              label="Client Name"
              value={form.clientName}
              onChange={(v) => setForm({ ...form, clientName: v })}
            />
            <AdminInput
              required
              type="number"
              label="Stars (1-5)"
              value={form.stars}
              onChange={(v) => setForm({ ...form, stars: Number(v) || 5 })}
            />
            <div className="md:col-span-2">
              <AdminInput
                label="Video URL (Optional)"
                type="url"
                value={form.videoUrl}
                onChange={(v) => setForm({ ...form, videoUrl: v })}
              />
            </div>
          </div>
        </AdminPanel>

        <AdminPanel title="Localized Content">
          <LanguageTabs
            en={
              <AdminTextarea
                required
                label="English Review Content"
                value={form.enContent}
                onChange={(v) => setForm({ ...form, enContent: v })}
              />
            }
            ar={
              <AdminTextarea
                required
                dir="rtl"
                label="Arabic Review Content"
                value={form.arContent}
                onChange={(v) => setForm({ ...form, arContent: v })}
              />
            }
          />
        </AdminPanel>

        <AdminPanel title="Images">
          <div className="grid gap-5 md:grid-cols-3">
            <ImagePicker
              label="Client Image"
              currentUrl={clientImageUrl}
              file={clientImageFile}
              onChange={setClientImageFile}
              compact
            />
            <ImagePicker
              label="Hero Image"
              currentUrl={heroImageUrl}
              file={heroImageFile}
              onChange={setHeroImageFile}
              compact
            />
            <ImagePicker
              label="Icon Image"
              currentUrl={iconImageUrl}
              file={iconImageFile}
              onChange={setIconImageFile}
              compact
            />
          </div>
        </AdminPanel>

        <div className="flex justify-end">
          <SubmitButton loading={saving} label={reviewId ? "Save Changes" : "Create Review"} />
        </div>
      </form>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message="Are you sure you want to permanently delete this review?"
      />
    </div>
  );
}
