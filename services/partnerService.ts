import apiClient, { resolveImageUrl } from "@/lib/apiClient";

export interface Partner {
  id: string;
  imageUrl: string;
  logoUrl: string;
  createdAt: string;
  updatedAt: string | null;
  name: string;
  resolvedLanguage: string;
}

export interface PartnersResponse {
  success: boolean;
  data: {
    items: Partner[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  message: string | null;
  errors: string | null;
  traceId: string | null;
}

export const partnerService = {
  getPartners: async (language: string = "en", page: number = 1, pageSize: number = 20): Promise<Partner[]> => {
    try {
      const response = await apiClient.get<PartnersResponse>("/api/partners", {
        params: {
          language,
          page,
          pageSize,
        },
      });

      if (response.data.success && response.data.data.items) {
        return response.data.data.items.map((partner) => ({
          ...partner,
          imageUrl: resolveImageUrl(partner.imageUrl),
          logoUrl: resolveImageUrl(partner.logoUrl),
        }));
      }

      throw new Error(response.data.message || "Failed to fetch partners");
    } catch (error) {
      console.error("Error fetching partners:", error);
      throw error;
    }
  },
};
