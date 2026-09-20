import apiClient, { resolveImageUrl } from "@/lib/apiClient";

export interface ProductApiItem {
  id: string;
  iconImageUrl: string | null;
  heroImageUrl: string | null;
  productLink: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  name: string;
  resolvedLanguage: string | null;
}

export interface ProductsResponse {
  success: boolean;
  data: {
    items: ProductApiItem[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  message: string | null;
  errors: string | null;
  traceId: string | null;
}

export interface ProductByIdResponse {
  success: boolean;
  data: ProductApiItem;
  message: string | null;
  errors: string | null;
  traceId: string | null;
}

export const productService = {
  getProducts: async (language: string = "en", page: number = 1, pageSize: number = 20): Promise<ProductApiItem[]> => {
    try {
      const response = await apiClient.get<ProductsResponse>("/api/products", {
        params: {
          page,
          pageSize,
        },
        headers: {
          "Accept-Language": language,
        },
      });

      if (response.data?.success && Array.isArray(response.data?.data?.items)) {
        return response.data.data.items.map((product) => ({
          ...product,
          iconImageUrl: resolveImageUrl(product.iconImageUrl),
          heroImageUrl: resolveImageUrl(product.heroImageUrl),
        }));
      }

      return [];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },

  getProductById: async (id: string, language: string = "en"): Promise<ProductApiItem | null> => {
    const trimmedId = id?.trim();

    if (!trimmedId) {
      return null;
    }

    try {
      const response = await apiClient.get<ProductByIdResponse>(`/api/products/${trimmedId}`, {
        headers: {
          "Accept-Language": language,
        },
      });

      if (response.data?.success && response.data?.data) {
        const product = response.data.data;

        return {
          ...product,
          iconImageUrl: resolveImageUrl(product.iconImageUrl),
          heroImageUrl: resolveImageUrl(product.heroImageUrl),
        };
      }

      return null;
    } catch (error) {
      console.error(`Error fetching product ${trimmedId}:`, error);
      return null;
    }
  }
};
