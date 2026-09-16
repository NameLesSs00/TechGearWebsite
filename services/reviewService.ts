import apiClient, { resolveMediaUrl } from "@/lib/apiClient";

export interface ReviewApiItem {
  id: string;
  clientName: string;
  coverImage: string | null;
  coverImageUrl: string | null;
  videoUrl: string | null;
  stars: number;
  createdAt: string | null;
  updatedAt: string | null;
  reviewContent: string;
  resolvedLanguage: string | null;
}

export interface ReviewsResponse {
  success: boolean;
  data: {
    items: ReviewApiItem[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  message: string | null;
  errors: string | null;
  traceId: string | null;
}

export const reviewService = {
  getReviews: async (language: string = "en", page: number = 1, pageSize: number = 20): Promise<ReviewApiItem[]> => {
    try {
      const response = await apiClient.get<ReviewsResponse>("/api/reviews", {
        params: {
          lang: language,
          page,
          pageSize,
        },
      });

      if (response.data?.success && Array.isArray(response.data?.data?.items)) {
        return response.data.data.items.map((review) => ({
          ...review,
          coverImage: resolveMediaUrl(review.coverImage),
          coverImageUrl: resolveMediaUrl(review.coverImageUrl),
          videoUrl: resolveMediaUrl(review.videoUrl),
        }));
      }

      return [];
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  },
};
