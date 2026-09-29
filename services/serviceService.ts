import apiClient, { filterRequestedLanguage, hasRequestedLanguage, isValidGuid, languageRequestConfig, normalizeMutationResponse, resolveImageUrl } from "@/lib/apiClient";

export interface ServiceFeature {
  id: string;
  imageUrl: string | null;
  name: string;
  displayOrder: number;
}

export interface ServiceDeliverable {
  id: string;
  name?: string | null;
  text?: string | null;
  displayOrder?: number | null;
}

export interface ServiceApiItem {
  id: string;
  iconImageUrl: string | null;
  serviceImageUrl: string | null;
  title: string;
  subtitle: string | null;
  description: string | null;
  resolvedLanguage: string | null;
  whatWeDeliver: Array<string | ServiceDeliverable>;
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

type ServiceMutationResponse<T = unknown> = {
  success: boolean;
  data: T;
  message?: string | null;
  errors?: unknown;
  traceId?: string | null;
};

export const serviceService = {
  // Queries
  getServices: async (language: string = "en", page: number = 1, pageSize: number = 20): Promise<ServiceApiItem[]> => {
    try {
      const response = await apiClient.get<ServiceApiResponse>("/api/services", languageRequestConfig(language, { page, pageSize }));

      if (response.data?.success && Array.isArray(response.data?.data?.items)) {
        return filterRequestedLanguage(response.data.data.items, language).map((service) => ({
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
        ...languageRequestConfig(language),
      });

      if (response.data?.success && response.data?.data) {
        const service = response.data.data;
        if (!hasRequestedLanguage(service, language)) return null;
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
    return normalizeMutationResponse<ServiceMutationResponse<string>>(response, "Failed to create service");
  },

  updateService: async (id: string, translations: ServiceTranslation[]) => {
    const response = await apiClient.put(`/api/services/${id}`, { id, translations });
    return normalizeMutationResponse<ServiceMutationResponse>(response, "Failed to update service");
  },

  deleteService: async (id: string) => {
    const response = await apiClient.delete(`/api/services/${id}`);
    return normalizeMutationResponse<ServiceMutationResponse>(response, "Failed to delete service");
  },

  // Image Management
  updateServiceIcon: async (id: string, iconImage: File) => {
    const formData = new FormData();
    formData.append("IconImage", iconImage);
    const response = await apiClient.put(`/api/services/${id}/icon`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeMutationResponse<ServiceMutationResponse>(response, "Failed to update service icon");
  },

  deleteServiceIcon: async (id: string) => {
    const response = await apiClient.delete(`/api/services/${id}/icon`);
    return normalizeMutationResponse<ServiceMutationResponse>(response, "Failed to delete service icon");
  },

  updateServiceImage: async (id: string, serviceImage: File) => {
    const formData = new FormData();
    formData.append("ServiceImage", serviceImage);
    const response = await apiClient.put(`/api/services/${id}/service-image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeMutationResponse<ServiceMutationResponse>(response, "Failed to update service image");
  },

  deleteServiceImage: async (id: string) => {
    const response = await apiClient.delete(`/api/services/${id}/service-image`);
    return normalizeMutationResponse<ServiceMutationResponse>(response, "Failed to delete service image");
  },

  // What We Deliver Management
  addWhatWeDeliver: async (id: string, translations: WhatWeDeliverTranslation[], displayOrder: number) => {
    const response = await apiClient.post(`/api/services/${id}/what-we-deliver`, { translations, displayOrder });
    return normalizeMutationResponse<ServiceMutationResponse<string>>(response, "Failed to add deliverable");
  },

  updateWhatWeDeliver: async (id: string, itemId: string, translations: WhatWeDeliverTranslation[], displayOrder: number) => {
    const response = await apiClient.put(`/api/services/${id}/what-we-deliver/${itemId}`, { id: itemId, translations, displayOrder });
    return normalizeMutationResponse<ServiceMutationResponse>(response, "Failed to update deliverable");
  },

  deleteWhatWeDeliver: async (id: string, itemId: string) => {
    const response = await apiClient.delete(`/api/services/${id}/what-we-deliver/${itemId}`);
    return normalizeMutationResponse<ServiceMutationResponse>(response, "Failed to delete deliverable");
  },

  reorderWhatWeDeliver: async (id: string, items: { id: string, displayOrder: number }[]) => {
    const response = await apiClient.put(`/api/services/${id}/what-we-deliver/reorder`, { items });
    return normalizeMutationResponse<ServiceMutationResponse>(response, "Failed to reorder deliverables");
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
    return normalizeMutationResponse<ServiceMutationResponse<string>>(response, "Failed to add feature");
  },

  updateFeature: async (id: string, featureId: string, translations: FeatureTranslation[], displayOrder: number) => {
    const response = await apiClient.put(`/api/services/${id}/features/${featureId}`, { id: featureId, translations, displayOrder });
    return normalizeMutationResponse<ServiceMutationResponse>(response, "Failed to update feature");
  },

  deleteFeature: async (id: string, featureId: string) => {
    const response = await apiClient.delete(`/api/services/${id}/features/${featureId}`);
    return normalizeMutationResponse<ServiceMutationResponse>(response, "Failed to delete feature");
  },

  updateFeatureImage: async (id: string, featureId: string, featureImage: File) => {
    const formData = new FormData();
    formData.append("FeatureImage", featureImage);
    const response = await apiClient.put(`/api/services/${id}/features/${featureId}/image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeMutationResponse<ServiceMutationResponse>(response, "Failed to update feature image");
  },

  reorderFeatures: async (id: string, items: { id: string, displayOrder: number }[]) => {
    const response = await apiClient.put(`/api/services/${id}/features/reorder`, { items });
    return normalizeMutationResponse<ServiceMutationResponse>(response, "Failed to reorder features");
  }
};
