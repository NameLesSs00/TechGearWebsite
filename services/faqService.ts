import apiClient from "@/lib/apiClient";

export interface FaqItem {
  id: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  question: string;
  answer: string;
  resolvedLanguage: string;
}

export interface FaqResponse {
  success: boolean;
  data: {
    items: FaqItem[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  message: string | null;
  errors: string | null;
  traceId: string | null;
}

export const faqService = {
  getFaqs: async (language: string = "ar", page: number = 1, pageSize: number = 20): Promise<FaqItem[]> => {
    try {
      const response = await apiClient.get<FaqResponse>("/api/faqs", {
        params: {
          language,
          page,
          pageSize,
        },
      });

      if (response.data.success && response.data.data.items) {
        return response.data.data.items;
      }

      throw new Error(response.data.message || "Failed to fetch FAQs");
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      throw error;
    }
  },
};
