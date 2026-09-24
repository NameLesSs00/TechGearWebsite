import apiClient, { resolveMediaUrl } from "@/lib/apiClient";

export interface ReviewApiItem {
  id: string;
  clientName: string;
  videoUrl: string | null;
  stars: number;
  client_image: string | null;
  hero_image: string | null;
  icon_image: string | null;
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

export interface ReviewResponse {
  success: boolean;
  data: ReviewApiItem | null;
  message: string | null;
  errors: string | null;
  traceId: string | null;
}

export interface BaseResponse {
  success: boolean;
  data: string | null;
  message: string | null;
  errors: string | null;
  traceId: string | null;
}

export const reviewService = {
  getReviews: async (language: string = "en", page: number = 1, pageSize: number = 20): Promise<ReviewApiItem[]> => {
    try {
      const response = await apiClient.get<ReviewsResponse>("/api/reviews", {
        params: {
          language,
          page,
          pageSize,
        },
      });

      if (response.data?.success && Array.isArray(response.data?.data?.items)) {
        return response.data.data.items.map((review) => ({
          ...review,
          client_image: resolveMediaUrl(review.client_image),
          hero_image: resolveMediaUrl(review.hero_image),
          icon_image: resolveMediaUrl(review.icon_image),
          videoUrl: resolveMediaUrl(review.videoUrl),
        }));
      }

      return [];
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  },

  getReviewById: async (id: string, language: string = "en"): Promise<ReviewApiItem | null> => {
    try {
      const response = await apiClient.get<ReviewResponse>(`/api/reviews/${id}`, {
        params: { language },
      });
      if (response.data?.success && response.data.data) {
        const review = response.data.data;
        return {
          ...review,
          client_image: resolveMediaUrl(review.client_image),
          hero_image: resolveMediaUrl(review.hero_image),
          icon_image: resolveMediaUrl(review.icon_image),
          videoUrl: resolveMediaUrl(review.videoUrl),
        };
      }
      return null;
    } catch (error) {
      console.error(`Error fetching review with id ${id}:`, error);
      return null;
    }
  },

  createReview: async (data: any): Promise<string | null> => {
    try {
      const response = await apiClient.post<BaseResponse>("/api/reviews", data);
      if (response.data?.success) {
        return response.data.data; // returns the new ID
      }
      return null;
    } catch (error) {
      console.error("Error creating review:", error);
      return null;
    }
  },

  updateReview: async (id: string, data: any): Promise<boolean> => {
    try {
      const response = await apiClient.put<BaseResponse>(`/api/reviews/${id}`, data);
      return response.data?.success === true;
    } catch (error) {
      console.error(`Error updating review with id ${id}:`, error);
      return false;
    }
  },

  deleteReview: async (id: string): Promise<boolean> => {
    try {
      const response = await apiClient.delete<BaseResponse>(`/api/reviews/${id}`);
      return response.data?.success === true;
    } catch (error) {
      console.error(`Error deleting review with id ${id}:`, error);
      return false;
    }
  },

  // Image Upload Methods
  uploadClientImage: async (id: string, formData: FormData): Promise<boolean> => {
    try {
      const response = await apiClient.put<BaseResponse>(`/api/reviews/${id}/images/client`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data?.success === true;
    } catch (error) {
      console.error(`Error uploading client image for review ${id}:`, error);
      return false;
    }
  },

  deleteClientImage: async (id: string): Promise<boolean> => {
    try {
      const response = await apiClient.delete<BaseResponse>(`/api/reviews/${id}/images/client`);
      return response.data?.success === true;
    } catch (error) {
      console.error(`Error deleting client image for review ${id}:`, error);
      return false;
    }
  },

  uploadHeroImage: async (id: string, formData: FormData): Promise<boolean> => {
    try {
      const response = await apiClient.put<BaseResponse>(`/api/reviews/${id}/images/hero`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data?.success === true;
    } catch (error) {
      console.error(`Error uploading hero image for review ${id}:`, error);
      return false;
    }
  },

  deleteHeroImage: async (id: string): Promise<boolean> => {
    try {
      const response = await apiClient.delete<BaseResponse>(`/api/reviews/${id}/images/hero`);
      return response.data?.success === true;
    } catch (error) {
      console.error(`Error deleting hero image for review ${id}:`, error);
      return false;
    }
  },

  uploadIconImage: async (id: string, formData: FormData): Promise<boolean> => {
    try {
      const response = await apiClient.put<BaseResponse>(`/api/reviews/${id}/images/icon`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data?.success === true;
    } catch (error) {
      console.error(`Error uploading icon image for review ${id}:`, error);
      return false;
    }
  },

  deleteIconImage: async (id: string): Promise<boolean> => {
    try {
      const response = await apiClient.delete<BaseResponse>(`/api/reviews/${id}/images/icon`);
      return response.data?.success === true;
    } catch (error) {
      console.error(`Error deleting icon image for review ${id}:`, error);
      return false;
    }
  },
};
