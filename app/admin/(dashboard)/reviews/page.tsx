import { reviewService } from "@/services/reviewService";
import Link from "next/link";
import { Plus, Edit2, Star, MessageSquare } from "lucide-react";
import DeleteAction from "../_components/DeleteAction";

export default async function AdminReviewsPage() {
  const reviews = await reviewService.getReviews("en", 1, 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Reviews</h2>
          <p className="text-slate-400 text-sm">Manage client testimonials and case studies.</p>
        </div>
        <Link
          href="/admin/reviews/create"
          className="flex items-center gap-2 bg-[#22D3EE] hover:bg-[#1bb8d1] text-[#000918] font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Review
        </Link>
      </div>

      <div className="bg-[#000c24] border border-white/10 rounded-2xl overflow-hidden">
        {reviews.length === 0 ? (
          <div className="p-16 text-center text-slate-400 flex flex-col items-center gap-3">
            <MessageSquare className="w-12 h-12 text-white/20" />
            <p>No reviews found. Click &quot;Create Review&quot; to add one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs text-slate-400 uppercase bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium">Client Name</th>
                  <th className="px-6 py-4 font-medium">Rating</th>
                  <th className="px-6 py-4 font-medium">Assets</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 font-medium text-white">{review.clientName}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{review.stars}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 text-xs">
                        <span className={`px-2 py-1 rounded-md border ${review.client_image ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-white/5 text-slate-500 border-white/10"}`}>
                          Client
                        </span>
                        <span className={`px-2 py-1 rounded-md border ${review.hero_image ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-white/5 text-slate-500 border-white/10"}`}>
                          Hero
                        </span>
                        <span className={`px-2 py-1 rounded-md border ${review.icon_image ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-white/5 text-slate-500 border-white/10"}`}>
                          Icon
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/admin/reviews/${review.id}`}
                          className="inline-flex items-center gap-1 text-[#22D3EE] hover:text-white transition-colors text-sm"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Link>
                        <DeleteAction id={review.id} type="review" title={review.clientName} />
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
