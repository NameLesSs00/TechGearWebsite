"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Edit2, FolderKanban, Loader2, Plus, Save, Trash2, X } from "lucide-react";
import { AdminEmptyState, AdminError, AdminPageHeader, AdminTable } from "../_components/AdminControls";
import { projectCategoryService, ProjectCategory } from "@/services/projectCategoryService";
import { ConfirmModal } from "@/component/ConfirmModal";

function EditRow({
  cat,
  onSave,
  onCancel,
}: {
  cat: ProjectCategory;
  onSave: (enName: string, arName: string) => Promise<void>;
  onCancel: () => void;
}) {
  const [enName, setEnName] = useState(cat.name);
  const [arName, setArName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await onSave(enName, arName);
    setLoading(false);
  };

  return (
    <tr className="bg-[#22D3EE]/5">
      <td className="px-6 py-3" colSpan={2}>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            type="text"
            value={enName}
            onChange={(event) => setEnName(event.target.value)}
            placeholder="English name"
            className="flex-1 rounded-lg border border-[#22D3EE]/30 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[#22D3EE]/60"
          />
          <input
            type="text"
            dir="rtl"
            value={arName}
            onChange={(event) => setArName(event.target.value)}
            placeholder="Arabic name"
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[#22D3EE]/50"
          />
        </div>
      </td>
      <td className="px-6 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <button type="button" onClick={onCancel} className="p-2 text-slate-400 transition-colors hover:text-white">
            <X className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || !enName.trim()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#22D3EE] px-3 py-1.5 text-sm font-semibold text-[#000918] transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save
          </button>
        </div>
      </td>
    </tr>
  );
}

function AddRow({
  onAdd,
  onCancel,
}: {
  onAdd: (enName: string, arName: string) => Promise<void>;
  onCancel: () => void;
}) {
  const [enName, setEnName] = useState("");
  const [arName, setArName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!enName.trim()) return;
    setLoading(true);
    await onAdd(enName, arName);
    setLoading(false);
  };

  return (
    <tr className="border-t border-[#22D3EE]/20 bg-[#22D3EE]/5">
      <td className="px-6 py-3" colSpan={2}>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            autoFocus
            type="text"
            value={enName}
            onChange={(event) => setEnName(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && handleAdd()}
            placeholder="English name (required)"
            className="flex-1 rounded-lg border border-[#22D3EE]/30 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[#22D3EE]/60"
          />
          <input
            type="text"
            dir="rtl"
            value={arName}
            onChange={(event) => setArName(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && handleAdd()}
            placeholder="Arabic name"
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[#22D3EE]/50"
          />
        </div>
      </td>
      <td className="px-6 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <button type="button" onClick={onCancel} className="p-2 text-slate-400 transition-colors hover:text-white">
            <X className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleAdd}
            disabled={loading || !enName.trim()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#22D3EE] px-3 py-1.5 text-sm font-semibold text-[#000918] transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminProjectCategoriesPage() {
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMap, setStatusMap] = useState<Record<string, "success" | "error">>({});
  const [globalError, setGlobalError] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState("");

  const flash = (id: string, status: "success" | "error") => {
    setStatusMap((current) => ({ ...current, [id]: status }));
    setTimeout(() => {
      setStatusMap((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
    }, 3000);
  };

  useEffect(() => {
    projectCategoryService
      .getAllCategories("en", 1, 100)
      .then(setCategories)
      .catch(() => setGlobalError("Failed to load categories."))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (enName: string, arName: string) => {
    try {
      const newId = await projectCategoryService.createCategory({
        translations: [
          { languageCode: "en", name: enName },
          ...(arName.trim() ? [{ languageCode: "ar", name: arName }] : []),
        ],
      });
      setCategories((current) => [
        ...current,
        { id: newId, name: enName, resolvedLanguage: "en", createdAt: new Date().toISOString(), updatedAt: null },
      ]);
      setAdding(false);
    } catch {
      setGlobalError("Failed to create category.");
    }
  };

  const handleUpdate = async (cat: ProjectCategory, enName: string, arName: string) => {
    try {
      await projectCategoryService.updateCategory(cat.id, {
        id: cat.id,
        translations: [
          { languageCode: "en", name: enName },
          ...(arName.trim() ? [{ languageCode: "ar", name: arName }] : []),
        ],
      });
      setCategories((current) => current.map((item) => (item.id === cat.id ? { ...item, name: enName } : item)));
      setEditingId(null);
      flash(cat.id, "success");
    } catch {
      flash(cat.id, "error");
    }
  };

  const handleDeleteClick = (cat: ProjectCategory) => {
    setDeleteConfirmId(cat.id);
    setDeleteConfirmName(cat.name);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    const catId = deleteConfirmId;
    setDeleteConfirmId(null);
    try {
      await projectCategoryService.deleteCategory(catId);
      setCategories((current) => current.filter((item) => item.id !== catId));
    } catch {
      flash(catId, "error");
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Project Categories" description="Manage the categories used to filter projects.">
        {!adding ? (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#22D3EE] px-4 py-2.5 text-sm font-semibold text-[#000918] transition-colors hover:bg-[#1bb8d1]"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        ) : null}
      </AdminPageHeader>

      <AdminError message={globalError} />

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-[#000c24] py-16">
          <Loader2 className="h-7 w-7 animate-spin text-[#22D3EE]" />
        </div>
      ) : (
        <AdminTable>
          <thead className="border-b border-white/10 bg-white/5 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Category Name (EN)</th>
              <th className="px-6 py-4 font-medium">Created</th>
              <th className="px-6 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {adding ? <AddRow onAdd={handleAdd} onCancel={() => setAdding(false)} /> : null}

            {categories.length === 0 && !adding ? (
              <tr>
                <td colSpan={3}>
                  <AdminEmptyState
                    icon={<FolderKanban className="h-12 w-12" />}
                    title="No categories yet"
                    description="Click Add Category to create one."
                  />
                </td>
              </tr>
            ) : (
              categories.map((cat) =>
                editingId === cat.id ? (
                  <EditRow key={cat.id} cat={cat} onSave={(en, ar) => handleUpdate(cat, en, ar)} onCancel={() => setEditingId(null)} />
                ) : (
                  <tr key={cat.id} className="transition-colors hover:bg-white/[0.025]">
                    <td className="px-6 py-4 font-medium text-white">
                      <div className="flex items-center gap-2">
                        {cat.name}
                        {statusMap[cat.id] === "success" ? <CheckCircle className="h-4 w-4 text-green-400" /> : null}
                        {statusMap[cat.id] === "error" ? <AlertCircle className="h-4 w-4 text-red-400" /> : null}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(cat.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setEditingId(cat.id)}
                          className="flex items-center gap-1 text-sm text-[#22D3EE] transition-colors hover:text-white"
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(cat)}
                          className="flex items-center gap-1 text-sm text-red-400 transition-colors hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ),
              )
            )}
          </tbody>
        </AdminTable>
      )}
      <ConfirmModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={`Delete "${deleteConfirmName}"? This may affect projects assigned to this category.`}
      />
    </div>
  );
}

