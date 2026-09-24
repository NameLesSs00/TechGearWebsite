import apiClient, { resolveImageUrl } from "@/lib/apiClient";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
  errors: unknown;
  traceId: string | null;
}

export interface PaginatedList<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface TranslationName {
  languageCode: string;
  name: string;
}

export interface ProductListItem {
  id: string;
  hero_image: string | null;
  icon_image: string | null;
  title: string | null;
  description: string | null;
  cta_text: string | null;
  product_page_link: string | null;
  created_at: string;
  updated_at: string | null;
  resolved_language: string | null;
}

export interface ProductFeatureBlock {
  id?: string | null;
  title: string | null;
  description: string | null;
  image: string | null;
  display_order: number;
}

export interface ProductReview {
  id?: string | null;
  author_name: string | null;
  author_role: string | null;
  company: string | null;
  author_avatar: string | null;
  quote: string | null;
  display_order: number;
}

export interface ProductFaq {
  id?: string | null;
  question: string | null;
  answer: string | null;
  display_order: number;
}

export interface ProductDetail extends ProductListItem {
  features_summary: string[] | null;
  feature_blocks: ProductFeatureBlock[] | null;
  reviews: ProductReview[] | null;
  faqs: ProductFaq[] | null;
}

export interface FaqItem {
  id: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  question: string | null;
  answer: string | null;
  resolvedLanguage: string | null;
}

export interface ContactMessage {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface Journey {
  id: string;
  yearOrDate: string | null;
  imageUrl: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string | null;
  title: string | null;
  description: string | null;
  resolvedLanguage: string | null;
}

export interface Partner {
  id: string;
  imageUrl: string | null;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
  name: string | null;
  resolvedLanguage: string | null;
}

export interface TeamMember {
  id: string;
  imageUrl: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string | null;
  name: string | null;
  jobTitle: string | null;
  resolvedLanguage: string | null;
}

function listFallback<T>(data?: PaginatedList<T> | null): PaginatedList<T> {
  return data ?? { items: [], page: 1, pageSize: 20, totalCount: 0, totalPages: 0 };
}

function languageConfig(language = "en") {
  return {
    params: { language },
    headers: { "Accept-Language": language },
  };
}

function appendJsonArray(formData: FormData, key: string, values: unknown[]) {
  values.forEach((value) => formData.append(key, JSON.stringify(value)));
}

function normalizeProduct<T extends ProductListItem | ProductDetail>(product: T): T {
  return {
    ...product,
    hero_image: resolveImageUrl(product.hero_image),
    icon_image: resolveImageUrl(product.icon_image),
    ...(Array.isArray((product as ProductDetail).feature_blocks)
      ? {
          feature_blocks: ((product as ProductDetail).feature_blocks ?? []).map((item) => ({
            ...item,
            image: resolveImageUrl(item.image),
          })),
        }
      : {}),
    ...(Array.isArray((product as ProductDetail).reviews)
      ? {
          reviews: ((product as ProductDetail).reviews ?? []).map((item) => ({
            ...item,
            author_avatar: resolveImageUrl(item.author_avatar),
          })),
        }
      : {}),
  } as T;
}

export const adminApi = {
  products: {
    list: async (language = "en", page = 1, pageSize = 20) => {
      const response = await apiClient.get<ApiResponse<PaginatedList<ProductListItem>>>("/api/products", {
        params: { language, page, pageSize },
        headers: { "Accept-Language": language },
      });
      const data = listFallback(response.data.data);
      return { ...data, items: data.items.map(normalizeProduct) };
    },
    get: async (id: string, language = "en") => {
      const response = await apiClient.get<ApiResponse<ProductDetail>>(`/api/products/${id}`, languageConfig(language));
      return normalizeProduct(response.data.data);
    },
    create: async (payload: unknown) => {
      const response = await apiClient.post<ApiResponse<string>>("/api/products", payload);
      if (!response.data.success) throw new Error(response.data.message ?? "Failed to create product");
      return response.data.data;
    },
    update: async (id: string, payload: unknown) => {
      const response = await apiClient.put<ApiResponse<string | null>>(`/api/products/${id}`, payload);
      if (!response.data.success) throw new Error(response.data.message ?? "Failed to update product");
    },
    remove: async (id: string) => {
      const response = await apiClient.delete<ApiResponse<string | null>>(`/api/products/${id}`);
      if (!response.data.success) throw new Error(response.data.message ?? "Failed to delete product");
    },
    updateImages: async (id: string, heroImage?: File | null, iconImage?: File | null) => {
      const formData = new FormData();
      if (heroImage) formData.append("HeroImage", heroImage);
      if (iconImage) formData.append("IconImage", iconImage);
      if (!heroImage && !iconImage) return;
      const response = await apiClient.put<ApiResponse<string | null>>(`/api/products/${id}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!response.data.success) throw new Error(response.data.message ?? "Failed to update product images");
    },
    deleteHero: async (id: string) => apiClient.delete(`/api/products/${id}/images/hero`),
    deleteIcon: async (id: string) => apiClient.delete(`/api/products/${id}/images/icon`),
    updateFeatureBlockImage: async (productId: string, featureBlockId: string, image: File) => {
      const formData = new FormData();
      formData.append("Image", image);
      await apiClient.put(`/api/products/${productId}/feature-blocks/${featureBlockId}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    updateReviewAvatar: async (productId: string, reviewId: string, avatar: File) => {
      const formData = new FormData();
      formData.append("Avatar", avatar);
      await apiClient.put(`/api/products/${productId}/reviews/${reviewId}/avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
  },

  faqs: {
    list: async (language = "en", page = 1, pageSize = 20) => {
      const response = await apiClient.get<ApiResponse<PaginatedList<FaqItem>>>("/api/faqs", {
        params: { language, page, pageSize },
        headers: { "Accept-Language": language },
      });
      return listFallback(response.data.data);
    },
    get: async (id: string, language = "en") => {
      const response = await apiClient.get<ApiResponse<FaqItem>>(`/api/faqs/${id}`, languageConfig(language));
      return response.data.data;
    },
    create: async (payload: unknown) => {
      const response = await apiClient.post<ApiResponse<string>>("/api/faqs", payload);
      if (!response.data.success) throw new Error(response.data.message ?? "Failed to create FAQ");
      return response.data.data;
    },
    update: async (id: string, payload: unknown) => {
      const response = await apiClient.put<ApiResponse<null>>(`/api/faqs/${id}`, payload);
      if (!response.data.success) throw new Error(response.data.message ?? "Failed to update FAQ");
    },
    remove: async (id: string) => apiClient.delete(`/api/faqs/${id}`),
  },

  contactMessages: {
    list: async (page = 1, pageSize = 20) => {
      const response = await apiClient.get<ApiResponse<PaginatedList<ContactMessage>>>("/api/contact-messages", {
        params: { page, pageSize },
      });
      return listFallback(response.data.data);
    },
    get: async (id: string) => {
      const response = await apiClient.get<ApiResponse<ContactMessage>>(`/api/contact-messages/${id}`);
      return response.data.data;
    },
    updateRead: async (id: string, isRead: boolean) => {
      await apiClient.put(`/api/contact-messages/${id}`, { id, isRead });
    },
    remove: async (id: string) => apiClient.delete(`/api/contact-messages/${id}`),
  },

  journeys: {
    list: async (language = "en", page = 1, pageSize = 100) => {
      const response = await apiClient.get<ApiResponse<PaginatedList<Journey>>>("/api/journeys", {
        params: { language, page, pageSize },
        headers: { "Accept-Language": language },
      });
      const data = listFallback(response.data.data);
      return { ...data, items: data.items.map((item) => ({ ...item, imageUrl: resolveImageUrl(item.imageUrl) })) };
    },
    get: async (id: string, language = "en") => {
      const response = await apiClient.get<ApiResponse<Journey>>(`/api/journeys/${id}`, languageConfig(language));
      return { ...response.data.data, imageUrl: resolveImageUrl(response.data.data.imageUrl) };
    },
    saveForm: async (endpoint: string, method: "post" | "put", data: { id?: string; yearOrDate: string; displayOrder: number; image?: File | null; imageUrl?: string; translations: unknown[] }) => {
      const formData = new FormData();
      if (data.id) formData.append("Id", data.id);
      formData.append("YearOrDate", data.yearOrDate);
      formData.append("DisplayOrder", String(data.displayOrder));
      if (data.image) formData.append("Image", data.image);
      if (data.imageUrl) formData.append("ImageUrl", data.imageUrl);
      appendJsonArray(formData, "Translations", data.translations);
      const response = await apiClient[method]<ApiResponse<string | null>>(endpoint, formData, { headers: { "Content-Type": "multipart/form-data" } });
      if (!response.data.success) throw new Error(response.data.message ?? "Failed to save journey");
      return response.data.data;
    },
    remove: async (id: string) => apiClient.delete(`/api/journeys/${id}`),
  },

  partners: {
    list: async (language = "en", page = 1, pageSize = 100) => {
      const response = await apiClient.get<ApiResponse<PaginatedList<Partner>>>("/api/partners", {
        params: { language, page, pageSize },
        headers: { "Accept-Language": language },
      });
      const data = listFallback(response.data.data);
      return { ...data, items: data.items.map((item) => ({ ...item, imageUrl: resolveImageUrl(item.imageUrl), logoUrl: resolveImageUrl(item.logoUrl) })) };
    },
    get: async (id: string, language = "en") => {
      const response = await apiClient.get<ApiResponse<Partner>>(`/api/partners/${id}`, languageConfig(language));
      return { ...response.data.data, imageUrl: resolveImageUrl(response.data.data.imageUrl), logoUrl: resolveImageUrl(response.data.data.logoUrl) };
    },
    saveForm: async (endpoint: string, method: "post" | "put", data: { id?: string; image?: File | null; imageUrl?: string; logoUrl?: string; translations: unknown[] }) => {
      const formData = new FormData();
      if (data.id) formData.append("Id", data.id);
      if (data.image) formData.append("Image", data.image);
      if (data.imageUrl) formData.append("ImageUrl", data.imageUrl);
      if (data.logoUrl) formData.append("LogoUrl", data.logoUrl);
      appendJsonArray(formData, "Translations", data.translations);
      const response = await apiClient[method]<ApiResponse<string | null>>(endpoint, formData, { headers: { "Content-Type": "multipart/form-data" } });
      if (!response.data.success) throw new Error(response.data.message ?? "Failed to save partner");
      return response.data.data;
    },
    remove: async (id: string) => apiClient.delete(`/api/partners/${id}`),
  },

  teamMembers: {
    list: async (language = "en", page = 1, pageSize = 100) => {
      const response = await apiClient.get<ApiResponse<PaginatedList<TeamMember>>>("/api/team-members", {
        params: { language, page, pageSize },
        headers: { "Accept-Language": language },
      });
      const data = listFallback(response.data.data);
      return { ...data, items: data.items.map((item) => ({ ...item, imageUrl: resolveImageUrl(item.imageUrl) })) };
    },
    get: async (id: string, language = "en") => {
      const response = await apiClient.get<ApiResponse<TeamMember>>(`/api/team-members/${id}`, languageConfig(language));
      return { ...response.data.data, imageUrl: resolveImageUrl(response.data.data.imageUrl) };
    },
    saveForm: async (endpoint: string, method: "post" | "put", data: { id?: string; image?: File | null; imageUrl?: string; displayOrder: number; translations: unknown[] }) => {
      const formData = new FormData();
      if (data.id) formData.append("Id", data.id);
      formData.append("DisplayOrder", String(data.displayOrder));
      if (data.image) formData.append("Image", data.image);
      if (data.imageUrl) formData.append("ImageUrl", data.imageUrl);
      appendJsonArray(formData, "Translations", data.translations);
      const response = await apiClient[method]<ApiResponse<string | null>>(endpoint, formData, { headers: { "Content-Type": "multipart/form-data" } });
      if (!response.data.success) throw new Error(response.data.message ?? "Failed to save team member");
      return response.data.data;
    },
    remove: async (id: string) => apiClient.delete(`/api/team-members/${id}`),
  },
};

