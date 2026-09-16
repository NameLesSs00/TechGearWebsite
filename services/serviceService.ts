import apiClient, { resolveImageUrl, isValidGuid, normalizeSlug } from "@/lib/apiClient";

interface ServiceDetailItem {
  id: string;
  description: string;
}

interface ServiceTechnology {
  id: string;
  name: string;
  image: string | null;
}

export interface ServiceApiItem {
  id: string;
  photoUrl: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  title: string;
  subTitle: string | null;
  description: string | null;
  slug: string;
  resolvedLanguage: string | null;
  serviceDetails: ServiceDetailItem[];
  technologies: ServiceTechnology[];
}

export interface ServiceApiResponse {
  success: boolean;
  data: {
    items: ServiceApiItem[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  message: string | null;
  errors: string | null;
  traceId: string | null;
}

export interface ServiceByIdResponse {
  success: boolean;
  data: ServiceApiItem;
  message: string | null;
  errors: string | null;
  traceId: string | null;
}

export const normalizeServiceSlug = normalizeSlug;

export const serviceService = {
  getServices: async (language: string = "en", page: number = 1, pageSize: number = 20): Promise<ServiceApiItem[]> => {
    try {
      const response = await apiClient.get<ServiceApiResponse>("/api/services", {
        params: {
          page,
          pageSize,
        },
        headers: {
          "Accept-Language": language,
        },
      });

      if (response.data?.success && Array.isArray(response.data?.data?.items)) {
        return response.data.data.items.map((service) => ({
          ...service,
          photoUrl: resolveImageUrl(service.photoUrl),
          slug: service.slug || normalizeSlug(service.title),
          technologies: (service.technologies ?? []).map((technology) => ({
            ...technology,
            image: resolveImageUrl(technology.image),
          })),
        }));
      }

      return [];
    } catch (error) {
      console.error("Error fetching services:", error);
      return [];
    }
  },

  getServiceById: async (id: string, language: string = "en"): Promise<ServiceApiItem | null> => {
    const trimmedId = id?.trim();

    if (!trimmedId || !isValidGuid(trimmedId)) {
      return null;
    }

    try {
      const response = await apiClient.get<ServiceByIdResponse>(`/api/services/${trimmedId}`, {
        headers: {
          "Accept-Language": language,
        },
      });

      if (response.data?.success && response.data?.data) {
        const service = response.data.data;

        return {
          ...service,
          photoUrl: resolveImageUrl(service.photoUrl),
          slug: service.slug || normalizeSlug(service.title),
          technologies: (service.technologies ?? []).map((technology) => ({
            ...technology,
            image: resolveImageUrl(technology.image),
          })),
        };
      }

      return null;
    } catch (error) {
      console.warn(`Ignoring invalid service request for ${trimmedId}:`, error);
      return null;
    }
  },

  getServiceBySlug: async (slug: string, language: string = "en"): Promise<ServiceApiItem | null> => {
    const trimmedSlug = slug?.trim();

    if (!trimmedSlug) {
      return null;
    }

    try {
      // Try to get service by slug endpoint if available
      const response = await apiClient.get<ServiceByIdResponse>(`/api/services/slug/${trimmedSlug}`, {
        headers: {
          "Accept-Language": language,
        },
      });

      if (response.data?.success && response.data?.data) {
        const service = response.data.data;

        return {
          ...service,
          photoUrl: resolveImageUrl(service.photoUrl),
          slug: service.slug || normalizeSlug(service.title),
          technologies: (service.technologies ?? []).map((technology) => ({
            ...technology,
            image: resolveImageUrl(technology.image),
          })),
        };
      }

      return null;
    } catch (error) {
      // Fallback: fetch all services and find by slug
      console.warn(`Service slug endpoint not available, fetching all services`);
      
      try {
        const allServices = await serviceService.getServices(language, 1, 100);
        const matchedService = allServices.find(
          (service) => service.slug === trimmedSlug || normalizeSlug(service.title) === trimmedSlug
        );
        
        return matchedService || null;
      } catch (fallbackError) {
        console.error(`Error fetching service by slug ${trimmedSlug}:`, fallbackError);
        return null;
      }
    }
  },
};
