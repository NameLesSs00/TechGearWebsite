"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Edit2, Package, Plus, Trash2 } from "lucide-react";
import { AdminEmptyState, AdminError, AdminPageHeader, AdminTable } from "../_components/AdminControls";
import { ProductListItem, adminApi } from "@/services/adminApi";
import { ConfirmModal } from "@/component/ConfirmModal";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [itemToDelete, setItemToDelete] = useState<ProductListItem | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.products.list("en", 1, 100);
      setProducts(data.items);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    const product = itemToDelete;
    setItemToDelete(null);
    try {
      await adminApi.products.remove(product.id);
      setProducts((current) => current.filter((item) => item.id !== product.id));
    } catch (err: any) {
      setError(err?.message ?? "Failed to delete product.");
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader actionHref="/admin/products/create" actionIcon={<Plus className="h-4 w-4" />} actionLabel="Create Product" title="Products" description="Manage product cards, detail content, media, reviews, and product FAQs." />
      <AdminError message={error} />

      {loading ? (
        <div className="py-16 text-center text-slate-400">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#000c24]">
          <AdminEmptyState icon={<Package className="h-12 w-12" />} title="No products yet" description="Create the first product to start filling the product area." />
        </div>
      ) : (
        <AdminTable>
          <thead className="border-b border-white/10 bg-white/5 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Preview</th>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">CTA</th>
              <th className="px-6 py-4 font-medium">Link</th>
              <th className="px-6 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((product) => (
              <tr key={product.id} className="transition-colors hover:bg-white/[0.025]">
                <td className="px-6 py-4">
                  <div className="relative h-12 w-20 overflow-hidden rounded-lg bg-white/5">
                    {product.hero_image || product.icon_image ? <Image src={product.hero_image || product.icon_image || ""} alt={product.title ?? "Product"} fill className="object-cover" unoptimized /> : null}
                  </div>
                </td>
                <td className="max-w-[260px] truncate px-6 py-4 font-medium text-white">{product.title ?? "Untitled"}</td>
                <td className="px-6 py-4 text-slate-400">{product.cta_text ?? "-"}</td>
                <td className="max-w-[240px] truncate px-6 py-4 text-slate-400">{product.product_page_link ?? "-"}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <Link className="inline-flex items-center gap-1 text-[#22D3EE] transition-colors hover:text-white" href={`/admin/products/${product.id}`}>
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Link>
                    <button className="inline-flex items-center gap-1 text-red-400 transition-colors hover:text-red-300" type="button" onClick={() => setItemToDelete(product)}>
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}
      <ConfirmModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={`Delete "${itemToDelete?.title ?? "this product"}"? This cannot be undone.`}
      />
    </div>
  );
}

