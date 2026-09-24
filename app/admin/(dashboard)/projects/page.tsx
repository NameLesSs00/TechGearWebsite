import Link from "next/link";
import { Plus, Edit2, Layers, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import DeleteAction from "../_components/DeleteAction";
import { projectService } from "@/services/projectService";

export default async function AdminProjectsPage() {
  let projects: Awaited<ReturnType<typeof projectService.getProjects>> = { items: [], page: 1, pageSize: 20, totalCount: 0, totalPages: 0 };
  try {
    projects = await projectService.getProjects("en", null, 1, 100);
  } catch { }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Projects</h2>
          <p className="text-slate-400 text-sm">Manage your portfolio projects.</p>
        </div>
        <Link
          href="/admin/projects/create"
          className="flex items-center gap-2 bg-[#22D3EE] hover:bg-[#1bb8d1] text-[#000918] font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Project
        </Link>
      </div>

      <div className="bg-[#000c24] border border-white/10 rounded-2xl overflow-hidden">
        {projects.items.length === 0 ? (
          <div className="p-16 text-center text-slate-400 flex flex-col items-center gap-3">
            <Layers className="w-12 h-12 text-white/20" />
            <p>No projects yet. Click &quot;Create Project&quot; to add one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs text-slate-400 uppercase bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium">Preview</th>
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium text-center">Images</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {projects.items.map((project) => (
                  <tr key={project.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-white/5 shrink-0">
                        {project.heroImageUrl
                          ? <Image src={project.heroImageUrl} alt={project.title} fill className="object-cover" unoptimized />
                          : <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">—</div>
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-white max-w-[180px] truncate">{project.title}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2.5 py-1 bg-[#22D3EE]/10 text-[#22D3EE] rounded-full border border-[#22D3EE]/20">
                        {project.categoryName || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-400">{project.images?.length ?? 0}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="inline-flex items-center gap-1 text-[#22D3EE] hover:text-white transition-colors text-sm"
                        >
                          <Edit2 className="w-4 h-4" /> Edit
                        </Link>
                        <DeleteAction id={project.id} type="project" title={project.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
