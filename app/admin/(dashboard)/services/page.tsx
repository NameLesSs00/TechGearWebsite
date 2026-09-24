import { serviceService } from "@/services/serviceService";
import Link from "next/link";
import { Plus, Edit2, Wrench, CheckCircle, XCircle } from "lucide-react";
import DeleteAction from "../_components/DeleteAction";

export default async function AdminServicesPage() {
  const services = await serviceService.getServices("en", 1, 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Services</h2>
          <p className="text-slate-400 text-sm">Manage the services shown on your website.</p>
        </div>
        <Link
          href="/admin/services/create"
          className="flex items-center gap-2 bg-[#22D3EE] hover:bg-[#1bb8d1] text-[#000918] font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Service
        </Link>
      </div>

      <div className="bg-[#000c24] border border-white/10 rounded-2xl overflow-hidden">
        {services.length === 0 ? (
          <div className="p-16 text-center text-slate-400 flex flex-col items-center gap-3">
            <Wrench className="w-12 h-12 text-white/20" />
            <p>No services found. Click &quot;Create Service&quot; to add one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs text-slate-400 uppercase bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Subtitle</th>
                  <th className="px-6 py-4 font-medium text-center">Icon</th>
                  <th className="px-6 py-4 font-medium text-center">Image</th>
                  <th className="px-6 py-4 font-medium text-center">Delivers</th>
                  <th className="px-6 py-4 font-medium text-center">Features</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium text-white max-w-[200px] truncate">{service.title}</td>
                    <td className="px-6 py-4 text-slate-400 max-w-[200px] truncate">{service.subtitle || "—"}</td>
                    <td className="px-6 py-4 text-center">
                      {service.iconImageUrl
                        ? <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
                        : <XCircle className="w-4 h-4 text-slate-600 mx-auto" />}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {service.serviceImageUrl
                        ? <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
                        : <XCircle className="w-4 h-4 text-slate-600 mx-auto" />}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-slate-300">{service.whatWeDeliver?.length ?? 0}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-slate-300">{service.features?.length ?? 0}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/services/${service.id}`}
                          className="inline-flex items-center gap-1 text-[#22D3EE] hover:text-white transition-colors text-sm"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Link>
                        <DeleteAction id={service.id} type="service" title={service.title} />
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
