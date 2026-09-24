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

export default function DeleteAction({ id, type, title }: DeleteActionProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const itemName = title ? `"${title}"` : "this item";
    if (!window.confirm(`Are you sure you want to delete ${itemName}? This cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      if (type === "project") {
        await projectService.deleteProject(id);
      } else if (type === "review") {
        await reviewService.deleteReview(id);
      } else if (type === "service") {
        await serviceService.deleteService(id);
      }
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to delete.");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors text-sm disabled:opacity-50"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      Delete
    </button>
  );
}
