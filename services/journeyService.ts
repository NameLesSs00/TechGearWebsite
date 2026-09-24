import apiClient from "@/lib/apiClient";

export interface Journey {
  id: string;
  yearOrDate: string;
  imageUrl: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string | null;
  title: string;
  description: string;
  resolvedLanguage: string;
}

export interface JourneysResponse {
  success: boolean;
  data: {
    items: Journey[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  message: string | null;
  errors: string | null;
  traceId: string | null;
}

export interface JourneyResponse {
  success: boolean;
  data: Journey | null;
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

export const journeyService = {
  getJourneys: async (language: string = "en", page: number = 1, pageSize: number = 20): Promise<Journey[]> => {
    try {
      const response = await apiClient.get<JourneysResponse>("/api/journeys", {
        params: {
          language,
          page,
          pageSize,
        },
      });

      if (response.data?.success && response.data?.data?.items) {
        return response.data.data.items.sort((a, b) => a.displayOrder - b.displayOrder);
      }
      return [];
    } catch (error) {
      console.error("Error fetching journeys:", error);
      return [];
    }
  },

  getJourneyById: async (id: string, language: string = "en"): Promise<Journey | null> => {
    try {
      const response = await apiClient.get<JourneyResponse>(`/api/journeys/${id}`, {
        params: { language },
      });
      if (response.data?.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching journey with id ${id}:`, error);
      return null;
    }
  },

  createJourney: async (formData: FormData): Promise<string | null> => {
    try {
      const response = await apiClient.post<BaseResponse>("/api/journeys", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data?.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error("Error creating journey:", error);
      return null;
    }
  },

  updateJourney: async (id: string, formData: FormData): Promise<boolean> => {
    try {
      const response = await apiClient.put<BaseResponse>(`/api/journeys/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data?.success === true;
    } catch (error) {
      console.error(`Error updating journey with id ${id}:`, error);
      return false;
    }
  },

  deleteJourney: async (id: string): Promise<boolean> => {
    try {
      const response = await apiClient.delete<BaseResponse>(`/api/journeys/${id}`);
      return response.data?.success === true;
    } catch (error) {
      console.error(`Error deleting journey with id ${id}:`, error);
      return false;
    }
  },
};
