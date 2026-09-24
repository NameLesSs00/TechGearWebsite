"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { projectService } from "@/services/projectService";
import { reviewService } from "@/services/reviewService";
import { serviceService } from "@/services/serviceService";

interface DeleteActionProps {
  id: string;
  type: "project" | "review" | "service";
  title?: string;
}

import { ConfirmModal } from "@/component/ConfirmModal";

export default function DeleteAction({ id, type, title }: DeleteActionProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const itemName = title ? `"${title}"` : "this item";

  const handleDeleteClick = () => {
    setIsConfirmOpen(true);
  };

  const listPath = type === "project" ? "/admin/projects" : type === "review" ? "/admin/reviews" : "/admin/services";

  const handleConfirmDelete = async () => {
    setIsConfirmOpen(false);
    setLoading(true);
    try {
      if (type === "project") {
        await projectService.deleteProject(id);
      } else if (type === "review") {
        await reviewService.deleteReview(id);
      } else if (type === "service") {
        await serviceService.deleteService(id);
      }
      router.push(listPath);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to delete.");
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleDeleteClick}
        disabled={loading}
        className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors text-sm disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        Delete
      </button>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${itemName}? This cannot be undone.`}
      />

      <ConfirmModal
        isOpen={!!errorMsg}
        onClose={() => setErrorMsg("")}
        onConfirm={() => {}}
        title="Error"
        message={errorMsg}
        isAlertOnly={true}
      />
    </>
  );
}
