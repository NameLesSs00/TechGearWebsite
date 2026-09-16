import apiClient, { resolveImageUrl } from "@/lib/apiClient";

interface ProductDetailItem {
  id: string;
  description: string;
}

interface ProductImageItem {
  id: string;
  imageUrl: string | null;
  displayOrder: number;
}

export interface ProductApiItem {
  id: string;
  photoUrl: string | null;
  liveDemoUrl: string | null;
  category: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  title: string;
  description: string | null;
  slug: string;
  resolvedLanguage: string | null;
  productDetails: ProductDetailItem[];
  productImages: ProductImageItem[];
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
          photoUrl: resolveImageUrl(product.photoUrl),
          slug: product.slug || product.id,
          productImages: (product.productImages ?? []).map((image) => ({
            ...image,
            imageUrl: resolveImageUrl(image.imageUrl),
          })),
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
          photoUrl: resolveImageUrl(product.photoUrl),
          slug: product.slug || product.id,
          productImages: (product.productImages ?? []).map((image) => ({
            ...image,
            imageUrl: resolveImageUrl(image.imageUrl),
          })),
        };
      }

      return null;
    } catch (error) {
      console.error(`Error fetching product ${trimmedId}:`, error);
      return null;
    }
  },

  getProductBySlug: async (slug: string, language: string = "en"): Promise<ProductApiItem | null> => {
    const trimmedSlug = slug?.trim();

    if (!trimmedSlug) {
      return null;
    }

    try {
      // Try to get product by slug endpoint if available
      const response = await apiClient.get<ProductByIdResponse>(`/api/products/slug/${trimmedSlug}`, {
        headers: {
          "Accept-Language": language,
        },
      });

      if (response.data?.success && response.data?.data) {
        const product = response.data.data;

        return {
          ...product,
          photoUrl: resolveImageUrl(product.photoUrl),
          slug: product.slug || product.id,
          productImages: (product.productImages ?? []).map((image) => ({
            ...image,
            imageUrl: resolveImageUrl(image.imageUrl),
          })),
        };
      }

      return null;
    } catch (error) {
      // Fallback: fetch all products and find by slug
      console.warn(`Product slug endpoint not available, fetching all products`);
      
      try {
        const allProducts = await productService.getProducts(language, 1, 100);
        const matchedProduct = allProducts.find(
          (product) => product.slug === trimmedSlug || product.id === trimmedSlug
        );
        
        return matchedProduct || null;
      } catch (fallbackError) {
        console.error(`Error fetching product by slug ${trimmedSlug}:`, fallbackError);
        return null;
      }
    }
  },
};
