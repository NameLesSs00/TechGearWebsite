import apiClient, { resolveImageUrl, isValidGuid } from "@/lib/apiClient";

export interface ServiceFeature {
  id: string;
  imageUrl: string | null;
  name: string;
  displayOrder: number;
}

export interface ServiceApiItem {
  id: string;
  iconImageUrl: string | null;
  serviceImageUrl: string | null;
  title: string;
  subtitle: string | null;
  description: string | null;
  resolvedLanguage: string | null;
  whatWeDeliver: string[];
  features: ServiceFeature[];
  createdAt: string | null;
  updatedAt: string | null;
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

export interface ServiceTranslation {
  languageCode: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface WhatWeDeliverTranslation {
  languageCode: string;
  text: string;
}

export interface FeatureTranslation {
  languageCode: string;
  name: string;
}
export const serviceService = {
  // Queries
  getServices: async (language: string = "en", page: number = 1, pageSize: number = 20): Promise<ServiceApiItem[]> => {
    try {
      const response = await apiClient.get<ServiceApiResponse>("/api/services", {
        params: { page, pageSize },
        headers: { "Accept-Language": language },
      });

      if (response.data?.success && Array.isArray(response.data?.data?.items)) {
        return response.data.data.items.map((service) => ({
          ...service,
          iconImageUrl: resolveImageUrl(service.iconImageUrl),
          serviceImageUrl: resolveImageUrl(service.serviceImageUrl),
          features: (service.features ?? []).map((feature) => ({
            ...feature,
            imageUrl: resolveImageUrl(feature.imageUrl),
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
    if (!trimmedId || !isValidGuid(trimmedId)) return null;

    try {
      const response = await apiClient.get<ServiceByIdResponse>(`/api/services/${trimmedId}`, {
        headers: { "Accept-Language": language },
      });

      if (response.data?.success && response.data?.data) {
        const service = response.data.data;
        return {
          ...service,
          iconImageUrl: resolveImageUrl(service.iconImageUrl),
          serviceImageUrl: resolveImageUrl(service.serviceImageUrl),
          features: (service.features ?? []).map((feature) => ({
            ...feature,
            imageUrl: resolveImageUrl(feature.imageUrl),
          })),
        };
      }
      return null;
    } catch (error) {
      console.warn(`Ignoring invalid service request for ${trimmedId}:`, error);
      return null;
    }
  },

  // Service Management
  createService: async (translations: ServiceTranslation[]) => {
    const response = await apiClient.post("/api/services", { translations });
    return response.data;
  },

  updateService: async (id: string, translations: ServiceTranslation[]) => {
    const response = await apiClient.put(`/api/services/${id}`, { id, translations });
    return response.data;
  },

  deleteService: async (id: string) => {
    const response = await apiClient.delete(`/api/services/${id}`);
    return response.data;
  },

  // Image Management
  updateServiceIcon: async (id: string, iconImage: File) => {
    const formData = new FormData();
    formData.append("IconImage", iconImage);
    const response = await apiClient.put(`/api/services/${id}/icon`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteServiceIcon: async (id: string) => {
    const response = await apiClient.delete(`/api/services/${id}/icon`);
    return response.data;
  },

  updateServiceImage: async (id: string, serviceImage: File) => {
    const formData = new FormData();
    formData.append("ServiceImage", serviceImage);
    const response = await apiClient.put(`/api/services/${id}/service-image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteServiceImage: async (id: string) => {
    const response = await apiClient.delete(`/api/services/${id}/service-image`);
    return response.data;
  },

  // What We Deliver Management
  addWhatWeDeliver: async (id: string, translations: WhatWeDeliverTranslation[], displayOrder: number) => {
    const response = await apiClient.post(`/api/services/${id}/what-we-deliver`, { translations, displayOrder });
    return response.data;
  },

  updateWhatWeDeliver: async (id: string, itemId: string, translations: WhatWeDeliverTranslation[], displayOrder: number) => {
    const response = await apiClient.put(`/api/services/${id}/what-we-deliver/${itemId}`, { id: itemId, translations, displayOrder });
    return response.data;
  },

  deleteWhatWeDeliver: async (id: string, itemId: string) => {
    const response = await apiClient.delete(`/api/services/${id}/what-we-deliver/${itemId}`);
    return response.data;
  },

  reorderWhatWeDeliver: async (id: string, items: { id: string, displayOrder: number }[]) => {
    const response = await apiClient.put(`/api/services/${id}/what-we-deliver/reorder`, { items });
    return response.data;
  },

  // Features Management
  addFeature: async (id: string, featureImage: File | null, translations: FeatureTranslation[], displayOrder: number) => {
    const formData = new FormData();
    if (featureImage) {
      formData.append("FeatureImage", featureImage);
    }
    translations.forEach((t) => {
      formData.append("Translations", JSON.stringify(t));
    });
    formData.append("DisplayOrder", displayOrder.toString());

    const response = await apiClient.post(`/api/services/${id}/features`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateFeature: async (id: string, featureId: string, translations: FeatureTranslation[], displayOrder: number) => {
    const response = await apiClient.put(`/api/services/${id}/features/${featureId}`, { id: featureId, translations, displayOrder });
    return response.data;
  },

  deleteFeature: async (id: string, featureId: string) => {
    const response = await apiClient.delete(`/api/services/${id}/features/${featureId}`);
    return response.data;
  },

  updateFeatureImage: async (id: string, featureId: string, featureImage: File) => {
    const formData = new FormData();
    formData.append("FeatureImage", featureImage);
    const response = await apiClient.put(`/api/services/${id}/features/${featureId}/image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  reorderFeatures: async (id: string, items: { id: string, displayOrder: number }[]) => {
    const response = await apiClient.put(`/api/services/${id}/features/reorder`, { items });
    return response.data;
  }
};
