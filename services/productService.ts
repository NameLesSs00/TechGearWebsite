import apiClient, { resolveImageUrl } from "@/lib/apiClient";

export interface ProductApiItem {
  id: string;
  iconImageUrl: string | null;
  heroImageUrl: string | null;
  productLink: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  name: string;
  description?: string | null;
  ctaText?: string | null;
  featuresSummary?: string[];
  resolvedLanguage: string | null;
}

export interface ProductFeatureBlock {
  id: string;
  title: string | null;
  description: string | null;
  image: string | null;
  displayOrder: number;
}

export interface ProductReview {
  id: string;
  authorName: string | null;
  authorRole: string | null;
  company: string | null;
  authorAvatar: string | null;
  quote: string | null;
  displayOrder: number;
}

export interface ProductFaq {
  id: string;
  question: string | null;
  answer: string | null;
  displayOrder: number;
}

export interface ProductDetail extends ProductApiItem {
  featureBlocks: ProductFeatureBlock[];
  reviews: ProductReview[];
  faqs: ProductFaq[];
}

interface RawProductFeatureBlock {
  id?: string | null;
  title?: string | null;
  description?: string | null;
  image?: string | null;
  display_order?: number | null;
}

interface RawProductReview {
  id?: string | null;
  author_name?: string | null;
  author_role?: string | null;
  company?: string | null;
  author_avatar?: string | null;
  quote?: string | null;
  display_order?: number | null;
}

interface RawProductFaq {
  id?: string | null;
  question?: string | null;
  answer?: string | null;
  display_order?: number | null;
}

interface RawProductApiItem {
  id: string;
  iconImageUrl?: string | null;
  heroImageUrl?: string | null;
  productLink?: string | null;
  name?: string | null;
  ctaText?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  resolvedLanguage?: string | null;
  icon_image?: string | null;
  hero_image?: string | null;
  product_page_link?: string | null;
  title?: string | null;
  description?: string | null;
  cta_text?: string | null;
  features_summary?: string[] | null;
  feature_blocks?: RawProductFeatureBlock[] | null;
  reviews?: RawProductReview[] | null;
  faqs?: RawProductFaq[] | null;
  created_at?: string | null;
  updated_at?: string | null;
  resolved_language?: string | null;
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
  data: RawProductApiItem;
  message: string | null;
  errors: string | null;
  traceId: string | null;
}

function normalizeProduct(product: RawProductApiItem): ProductApiItem {
  return {
    id: product.id,
    iconImageUrl: resolveImageUrl(product.iconImageUrl ?? product.icon_image),
    heroImageUrl: resolveImageUrl(product.heroImageUrl ?? product.hero_image),
    productLink: product.productLink ?? product.product_page_link ?? null,
    createdAt: product.createdAt ?? product.created_at ?? null,
    updatedAt: product.updatedAt ?? product.updated_at ?? null,
    name: product.name ?? product.title ?? "",
    description: product.description ?? null,
    ctaText: product.ctaText ?? product.cta_text ?? null,
    featuresSummary: product.features_summary ?? [],
    resolvedLanguage: product.resolvedLanguage ?? product.resolved_language ?? null,
  };
}

function normalizeProductDetail(product: RawProductApiItem): ProductDetail {
  return {
    ...normalizeProduct(product),
    featureBlocks: (product.feature_blocks ?? [])
      .map((item) => ({
        id: item.id ?? "",
        title: item.title ?? null,
        description: item.description ?? null,
        image: resolveImageUrl(item.image),
        displayOrder: item.display_order ?? 0,
      }))
      .sort((a, b) => a.displayOrder - b.displayOrder),
    reviews: (product.reviews ?? [])
      .map((item) => ({
        id: item.id ?? "",
        authorName: item.author_name ?? null,
        authorRole: item.author_role ?? null,
        company: item.company ?? null,
        authorAvatar: resolveImageUrl(item.author_avatar),
        quote: item.quote ?? null,
        displayOrder: item.display_order ?? 0,
      }))
      .sort((a, b) => a.displayOrder - b.displayOrder),
    faqs: (product.faqs ?? [])
      .map((item) => ({
        id: item.id ?? "",
        question: item.question ?? null,
        answer: item.answer ?? null,
        displayOrder: item.display_order ?? 0,
      }))
      .sort((a, b) => a.displayOrder - b.displayOrder),
  };
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
        return response.data.data.items.map((product) => normalizeProduct(product as RawProductApiItem));
      }

      return [];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },

  getProductById: async (id: string, language: string = "en"): Promise<ProductDetail | null> => {
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
        return normalizeProductDetail(response.data.data);
      }

      return null;
    } catch (error) {
      console.error(`Error fetching product ${trimmedId}:`, error);
      return null;
    }
  }
};
