"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
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
import { ProductDetail, adminApi } from "@/services/adminApi";

type SummaryItem = { id?: string | null; enText: string; arText: string; displayOrder: number };
type FeatureBlockItem = { id?: string | null; enTitle: string; arTitle: string; enDescription: string; arDescription: string; imageUrl?: string | null; imageFile?: File | null; displayOrder: number };
type ProductReviewItem = { id?: string | null; enAuthorName: string; arAuthorName: string; enAuthorRole: string; arAuthorRole: string; enCompany: string; arCompany: string; enQuote: string; arQuote: string; avatarUrl?: string | null; avatarFile?: File | null; displayOrder: number };
type ProductFaqItem = { id?: string | null; enQuestion: string; arQuestion: string; enAnswer: string; arAnswer: string; displayOrder: number };

function byOrder<T extends { display_order?: number; displayOrder?: number }>(items: T[] | null | undefined) {
  return [...(items ?? [])].sort((a, b) => (a.display_order ?? a.displayOrder ?? 0) - (b.display_order ?? b.displayOrder ?? 0));
}

function nextOrder(items: { displayOrder: number }[]) {
  return items.length + 1;
}

function SectionList({
  title,
  onAdd,
  note,
  children,
}: {
  title: string;
  onAdd?: () => void;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <AdminPanel title={title}>
      <div className="space-y-4">
        {note ? <p className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-100">{note}</p> : null}
        {children}
        {onAdd ? (
          <button className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm text-[#22D3EE] transition-colors hover:bg-white/10 hover:text-white" type="button" onClick={onAdd}>
            <Plus className="h-4 w-4" />
            Add item
          </button>
        ) : null}
      </div>
    </AdminPanel>
  );
}

export default function ProductEditor({ productId }: { productId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(Boolean(productId));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [heroUrl, setHeroUrl] = useState<string | null>(null);
  const [iconUrl, setIconUrl] = useState<string | null>(null);

  const [form, setForm] = useState({
    productLink: "",
    enTitle: "",
    arTitle: "",
    enDescription: "",
    arDescription: "",
    enCtaText: "",
    arCtaText: "",
  });
  const [summaries, setSummaries] = useState<SummaryItem[]>([]);
  const [blocks, setBlocks] = useState<FeatureBlockItem[]>([]);
  const [reviews, setReviews] = useState<ProductReviewItem[]>([]);
  const [faqs, setFaqs] = useState<ProductFaqItem[]>([]);

  useEffect(() => {
    if (!productId) return;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [en, ar] = await Promise.all([
          adminApi.products.get(productId, "en"),
          adminApi.products.get(productId, "ar").catch(() => null as ProductDetail | null),
        ]);
        setHeroUrl(en.hero_image);
        setIconUrl(en.icon_image);
        setForm({
          productLink: en.product_page_link ?? "",
          enTitle: en.title ?? "",
          arTitle: ar?.title ?? "",
          enDescription: en.description ?? "",
          arDescription: ar?.description ?? "",
          enCtaText: en.cta_text ?? "",
          arCtaText: ar?.cta_text ?? "",
        });

        const arSummaries = ar?.features_summary ?? [];
        setSummaries((en.features_summary ?? []).map((text, index) => ({ enText: text, arText: arSummaries[index] ?? "", displayOrder: index + 1 })));

        const arBlocks = byOrder(ar?.feature_blocks);
        setBlocks(byOrder(en.feature_blocks).map((item, index) => {
          const arItem = arBlocks.find((candidate) => candidate.id === item.id) ?? arBlocks[index];
          return {
            id: item.id,
            enTitle: item.title ?? "",
            arTitle: arItem?.title ?? "",
            enDescription: item.description ?? "",
            arDescription: arItem?.description ?? "",
            imageUrl: item.image,
            displayOrder: item.display_order,
          };
        }));

        const arReviews = byOrder(ar?.reviews);
        setReviews(byOrder(en.reviews).map((item, index) => {
          const arItem = arReviews.find((candidate) => candidate.id === item.id) ?? arReviews[index];
          return {
            id: item.id,
            enAuthorName: item.author_name ?? "",
            arAuthorName: arItem?.author_name ?? "",
            enAuthorRole: item.author_role ?? "",
            arAuthorRole: arItem?.author_role ?? "",
            enCompany: item.company ?? "",
            arCompany: arItem?.company ?? "",
            enQuote: item.quote ?? "",
            arQuote: arItem?.quote ?? "",
            avatarUrl: item.author_avatar,
            displayOrder: item.display_order,
          };
        }));

        const arFaqs = byOrder(ar?.faqs);
        setFaqs(byOrder(en.faqs).map((item, index) => {
          const arItem = arFaqs.find((candidate) => candidate.id === item.id) ?? arFaqs[index];
          return {
            id: item.id,
            enQuestion: item.question ?? "",
            arQuestion: arItem?.question ?? "",
            enAnswer: item.answer ?? "",
            arAnswer: arItem?.answer ?? "",
            displayOrder: item.display_order,
          };
        }));
      } catch (err: any) {
        setError(err?.message ?? "Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [productId]);

  const basePayload = (id?: string) => ({
    ...(id ? { id } : {}),
    productLink: form.productLink,
    translations: [
      { languageCode: "en", title: form.enTitle, description: form.enDescription, ctaText: form.enCtaText },
      { languageCode: "ar", title: form.arTitle, description: form.arDescription, ctaText: form.arCtaText },
    ],
  });

  const nestedPayload = () => ({
    featuresSummary: summaries.map((item) => ({
      id: item.id ?? null,
      displayOrder: item.displayOrder,
      translations: [
        { languageCode: "en", text: item.enText },
        { languageCode: "ar", text: item.arText },
      ],
    })),
    featureBlocks: blocks.map((item) => ({
      id: item.id ?? null,
      displayOrder: item.displayOrder,
      translations: [
        { languageCode: "en", title: item.enTitle, description: item.enDescription },
        { languageCode: "ar", title: item.arTitle, description: item.arDescription },
      ],
    })),
    reviews: reviews.map((item) => ({
      id: item.id ?? null,
      displayOrder: item.displayOrder,
      translations: [
        { languageCode: "en", authorName: item.enAuthorName, authorRole: item.enAuthorRole, company: item.enCompany, quote: item.enQuote },
        { languageCode: "ar", authorName: item.arAuthorName, authorRole: item.arAuthorRole, company: item.arCompany, quote: item.arQuote },
      ],
    })),
    faqs: faqs.map((item) => ({
      id: item.id ?? null,
      displayOrder: item.displayOrder,
      translations: [
        { languageCode: "en", question: item.enQuestion, answer: item.enAnswer },
        { languageCode: "ar", question: item.arQuestion, answer: item.arAnswer },
      ],
    })),
  });

  const buildCreatePayload = () => ({
    ...basePayload(),
    ...nestedPayload(),
  });

  const buildUpdatePayload = (id: string) => ({
    ...basePayload(id),
    featureBlocks: blocks.filter((item) => item.id).map((item) => ({
      id: item.id,
      displayOrder: item.displayOrder,
      translations: [
        { languageCode: "en", title: item.enTitle, description: item.enDescription },
        { languageCode: "ar", title: item.arTitle, description: item.arDescription },
      ],
    })),
    reviews: reviews.filter((item) => item.id).map((item) => ({
      id: item.id,
      displayOrder: item.displayOrder,
      translations: [
        { languageCode: "en", authorName: item.enAuthorName, authorRole: item.enAuthorRole, company: item.enCompany, quote: item.enQuote },
        { languageCode: "ar", authorName: item.arAuthorName, authorRole: item.arAuthorRole, company: item.arCompany, quote: item.arQuote },
      ],
    })),
    faqs: faqs.filter((item) => item.id).map((item) => ({
      id: item.id,
      displayOrder: item.displayOrder,
      translations: [
        { languageCode: "en", question: item.enQuestion, answer: item.enAnswer },
        { languageCode: "ar", question: item.arQuestion, answer: item.arAnswer },
      ],
    })),
  });

  const saveChildImages = async (id: string) => {
    await Promise.all([
      ...blocks.filter((item) => item.id && item.imageFile).map((item) => adminApi.products.updateFeatureBlockImage(id, item.id!, item.imageFile!)),
      ...reviews.filter((item) => item.id && item.avatarFile).map((item) => adminApi.products.updateReviewAvatar(id, item.id!, item.avatarFile!)),
    ]);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSaved(false);
    setSaving(true);

    try {
      if (productId) {
        await adminApi.products.update(productId, buildUpdatePayload(productId));
        await adminApi.products.updateImages(productId, heroFile, iconFile);
        await saveChildImages(productId);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        const newId = await adminApi.products.create(buildCreatePayload());
        await adminApi.products.updateImages(newId, heroFile, iconFile);
        router.push(`/admin/products/${newId}`);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!productId || !confirm("Permanently delete this product? This cannot be undone.")) return;
    setSaving(true);
    try {
      await adminApi.products.remove(productId);
      router.push("/admin/products");
    } catch (err: any) {
      setError(err?.message ?? "Failed to delete product.");
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-slate-400">Loading product...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      <AdminPageHeader
        backHref="/admin/products"
        title={productId ? "Edit Product" : "Create Product"}
        description={productId ? form.enTitle || "Manage product content and assets." : "Create the product, then continue editing any generated nested assets."}
      >
        {productId ? <DeleteButton loading={saving} label="Delete Product" onClick={handleDelete} /> : null}
      </AdminPageHeader>

      <AdminError message={error} />

      <form className="space-y-6" onSubmit={handleSubmit}>
        <AdminPanel title="General">
          <div className="grid gap-5 md:grid-cols-2">
            <AdminInput label="Product Link" value={form.productLink} onChange={(value) => setForm({ ...form, productLink: value })} placeholder="https://..." />
            <ImagePicker label="Icon Image" currentUrl={iconUrl} file={iconFile} onChange={setIconFile} compact />
            <div className="md:col-span-2">
              <ImagePicker label="Hero Image" currentUrl={heroUrl} file={heroFile} onChange={setHeroFile} />
            </div>
          </div>
        </AdminPanel>

        <AdminPanel title="Product Copy">
          <LanguageTabs
            en={
              <>
                <AdminInput required label="Title" value={form.enTitle} onChange={(value) => setForm({ ...form, enTitle: value })} />
                <AdminTextarea label="Description" value={form.enDescription} onChange={(value) => setForm({ ...form, enDescription: value })} />
                <AdminInput label="CTA Text" value={form.enCtaText} onChange={(value) => setForm({ ...form, enCtaText: value })} />
              </>
            }
            ar={
              <>
                <AdminInput dir="rtl" label="Title" value={form.arTitle} onChange={(value) => setForm({ ...form, arTitle: value })} />
                <AdminTextarea dir="rtl" label="Description" value={form.arDescription} onChange={(value) => setForm({ ...form, arDescription: value })} />
                <AdminInput dir="rtl" label="CTA Text" value={form.arCtaText} onChange={(value) => setForm({ ...form, arCtaText: value })} />
              </>
            }
          />
        </AdminPanel>

        <SectionList
          title="Feature Summary"
          note={productId ? "The backend returns feature summaries without IDs, so they are only sent when creating a product." : undefined}
          onAdd={!productId ? () => setSummaries([...summaries, { enText: "", arText: "", displayOrder: nextOrder(summaries) }]) : undefined}
        >
          {summaries.map((item, index) => (
            <div key={index} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">Summary #{index + 1}</span>
                <button className="text-red-400 hover:text-red-300" type="button" onClick={() => setSummaries(summaries.filter((_, i) => i !== index))}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <AdminInput label="English Text" value={item.enText} onChange={(value) => setSummaries(summaries.map((row, i) => i === index ? { ...row, enText: value } : row))} />
                <AdminInput dir="rtl" label="Arabic Text" value={item.arText} onChange={(value) => setSummaries(summaries.map((row, i) => i === index ? { ...row, arText: value } : row))} />
              </div>
            </div>
          ))}
        </SectionList>

        <SectionList
          title="Feature Blocks"
          note={productId ? "New feature blocks must be created with the product. Existing blocks with backend IDs can be edited here." : undefined}
          onAdd={!productId ? () => setBlocks([...blocks, { enTitle: "", arTitle: "", enDescription: "", arDescription: "", displayOrder: nextOrder(blocks) }]) : undefined}
        >
          {blocks.map((item, index) => (
            <div key={index} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">Feature Block #{index + 1}</span>
                <button className="text-red-400 hover:text-red-300" type="button" onClick={() => setBlocks(blocks.filter((_, i) => i !== index))}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <AdminInput label="English Title" value={item.enTitle} onChange={(value) => setBlocks(blocks.map((row, i) => i === index ? { ...row, enTitle: value } : row))} />
                <AdminInput dir="rtl" label="Arabic Title" value={item.arTitle} onChange={(value) => setBlocks(blocks.map((row, i) => i === index ? { ...row, arTitle: value } : row))} />
                <AdminTextarea label="English Description" value={item.enDescription} onChange={(value) => setBlocks(blocks.map((row, i) => i === index ? { ...row, enDescription: value } : row))} />
                <AdminTextarea dir="rtl" label="Arabic Description" value={item.arDescription} onChange={(value) => setBlocks(blocks.map((row, i) => i === index ? { ...row, arDescription: value } : row))} />
                {item.id ? <ImagePicker label="Block Image" currentUrl={item.imageUrl} file={item.imageFile ?? null} onChange={(file) => setBlocks(blocks.map((row, i) => i === index ? { ...row, imageFile: file } : row))} compact /> : null}
              </div>
            </div>
          ))}
        </SectionList>

        <SectionList
          title="Product Reviews"
          note={productId ? "New product reviews must be created with the product. Existing reviews with backend IDs can be edited here." : undefined}
          onAdd={!productId ? () => setReviews([...reviews, { enAuthorName: "", arAuthorName: "", enAuthorRole: "", arAuthorRole: "", enCompany: "", arCompany: "", enQuote: "", arQuote: "", displayOrder: nextOrder(reviews) }]) : undefined}
        >
          {reviews.map((item, index) => (
            <div key={index} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">Review #{index + 1}</span>
                <button className="text-red-400 hover:text-red-300" type="button" onClick={() => setReviews(reviews.filter((_, i) => i !== index))}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <AdminInput label="English Author" value={item.enAuthorName} onChange={(value) => setReviews(reviews.map((row, i) => i === index ? { ...row, enAuthorName: value } : row))} />
                <AdminInput dir="rtl" label="Arabic Author" value={item.arAuthorName} onChange={(value) => setReviews(reviews.map((row, i) => i === index ? { ...row, arAuthorName: value } : row))} />
                <AdminInput label="English Role" value={item.enAuthorRole} onChange={(value) => setReviews(reviews.map((row, i) => i === index ? { ...row, enAuthorRole: value } : row))} />
                <AdminInput dir="rtl" label="Arabic Role" value={item.arAuthorRole} onChange={(value) => setReviews(reviews.map((row, i) => i === index ? { ...row, arAuthorRole: value } : row))} />
                <AdminInput label="English Company" value={item.enCompany} onChange={(value) => setReviews(reviews.map((row, i) => i === index ? { ...row, enCompany: value } : row))} />
                <AdminInput dir="rtl" label="Arabic Company" value={item.arCompany} onChange={(value) => setReviews(reviews.map((row, i) => i === index ? { ...row, arCompany: value } : row))} />
                <AdminTextarea label="English Quote" value={item.enQuote} onChange={(value) => setReviews(reviews.map((row, i) => i === index ? { ...row, enQuote: value } : row))} />
                <AdminTextarea dir="rtl" label="Arabic Quote" value={item.arQuote} onChange={(value) => setReviews(reviews.map((row, i) => i === index ? { ...row, arQuote: value } : row))} />
                {item.id ? <ImagePicker label="Author Avatar" currentUrl={item.avatarUrl} file={item.avatarFile ?? null} onChange={(file) => setReviews(reviews.map((row, i) => i === index ? { ...row, avatarFile: file } : row))} compact /> : null}
              </div>
            </div>
          ))}
        </SectionList>

        <SectionList
          title="Product FAQs"
          note={productId ? "New product FAQs must be created with the product. Existing FAQs with backend IDs can be edited here." : undefined}
          onAdd={!productId ? () => setFaqs([...faqs, { enQuestion: "", arQuestion: "", enAnswer: "", arAnswer: "", displayOrder: nextOrder(faqs) }]) : undefined}
        >
          {faqs.map((item, index) => (
            <div key={index} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">FAQ #{index + 1}</span>
                <button className="text-red-400 hover:text-red-300" type="button" onClick={() => setFaqs(faqs.filter((_, i) => i !== index))}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <AdminInput label="English Question" value={item.enQuestion} onChange={(value) => setFaqs(faqs.map((row, i) => i === index ? { ...row, enQuestion: value } : row))} />
                <AdminInput dir="rtl" label="Arabic Question" value={item.arQuestion} onChange={(value) => setFaqs(faqs.map((row, i) => i === index ? { ...row, arQuestion: value } : row))} />
                <AdminTextarea label="English Answer" value={item.enAnswer} onChange={(value) => setFaqs(faqs.map((row, i) => i === index ? { ...row, enAnswer: value } : row))} />
                <AdminTextarea dir="rtl" label="Arabic Answer" value={item.arAnswer} onChange={(value) => setFaqs(faqs.map((row, i) => i === index ? { ...row, arAnswer: value } : row))} />
              </div>
            </div>
          ))}
        </SectionList>

        <div className="flex justify-end">
          <SubmitButton label={productId ? "Save Product" : "Create Product"} loading={saving} saved={saved} />
        </div>
      </form>
    </div>
  );
}
