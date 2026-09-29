import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
const ImageUrl = "https://tech-gear-backend-site.premiumasp.net"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://tech-gear-backend-site.premiumasp.net";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

type ApiSuccessBody = {
  success?: boolean;
  message?: string | null;
};

type ApiResponseLike = {
  status: number;
  data?: unknown;
};

function isApiSuccessBody(data: unknown): data is ApiSuccessBody {
  return typeof data === "object" && data !== null && "success" in data;
}

export function getApiErrorMessage(data: unknown, fallback: string): string {
  if (typeof data === "object" && data !== null && "message" in data) {
    const message = (data as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return fallback;
}

export function isSuccessfulApiResponse(response: ApiResponseLike): boolean {
  if (isApiSuccessBody(response.data) && response.data.success === false) {
    return false;
  }

  return response.status >= 200 && response.status < 300;
}

export function assertApiSuccess(response: ApiResponseLike, fallback: string): void {
  if (!isSuccessfulApiResponse(response)) {
    throw new Error(getApiErrorMessage(response.data, fallback));
  }
}

export function normalizeMutationResponse<T extends ApiSuccessBody>(
  response: ApiResponseLike,
  fallback: string,
): T {
  assertApiSuccess(response, fallback);

  if (isApiSuccessBody(response.data)) {
    return response.data as T;
  }

  return {
    success: true,
    message: null,
  } as T;
}

// Variable to store current language (will be set by the app)
let currentLanguage: string = "en";

/**
 * Set the current language for all API requests
 * This should be called when language changes in the app
 */
export function setApiLanguage(language: string) {
  currentLanguage = language;
}

/**
 * Utility to get a cookie value by name (client-side only)
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return null;
}


// Request interceptor to automatically add Accept-Language header
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add Accept-Language header to all requests
    if (!config.headers) {
      config.headers = {} as any;
    }

    // Only add Accept-Language if it's not already present
    if (!config.headers['Accept-Language']) {
      config.headers['Accept-Language'] = currentLanguage;
    }

    // Attach admin token if it exists
    const token = getCookie('admin_token');
    if (token && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // A missing detail route can be handled by service-level list fallbacks.
    if (error.response?.status !== 404 && !error.response) {
      console.warn("API unavailable:", error.code || error.message);
    } else if (error.response?.status !== 404) {
      console.error("API Error:", error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Utility function to resolve image URLs
 */
export function resolveImageUrl(imageUrl?: string | null): string {
  if (!imageUrl) {
    return "";
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // Use the remote backend server for images since they are not hosted on localhost
  return `${ImageUrl}${imageUrl}`;
}

/**
 * Utility function to resolve media URLs (images, videos, etc.)
 */
export function resolveMediaUrl(url?: string | null): string {
  return resolveImageUrl(url);
}

/**
 * Utility function to validate GUID
 */
export function isValidGuid(value?: string | null): boolean {
  if (!value) {
    return false;
  }

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value.trim()
  );
}

/**
 * Utility function to normalize slugs. Supports Arabic and other non-Latin
 * letters so translated entity names can safely be used in URLs.
 */
export function normalizeSlug(value?: string | null): string {
  return createSlug(value);
}

export function createSlug(value?: string | null): string {
  if (!value) {
    return "";
  }

  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/(^-|-$)/g, "");
}

export function buildEntitySlug(id?: string | null, title?: string | null): string {
  const cleanId = id?.trim();
  const slug = createSlug(title);

  if (!cleanId) {
    return slug;
  }

  return slug ? `${cleanId}-${slug}` : cleanId;
}

export function buildPublicEntitySlug(title?: string | null, fallbackId?: string | null): string {
  return createSlug(title) || fallbackId?.trim() || "";
}

export function extractEntityId(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  const guidPattern = "[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}";
  const match = trimmed.match(new RegExp(`^(${guidPattern})(?:-|$)`, "i"));
  return match?.[1] ?? null;
}

export function matchesEntitySlug(
  value: string,
  entity: { id?: string | null },
  title?: string | null,
): boolean {
  const id = entity.id?.trim();
  if (id && (value === id || extractEntityId(value) === id)) {
    return true;
  }

  return createSlug(title) === value;
}

export function hasRequestedLanguage(
  item: { resolvedLanguage?: string | null; resolved_language?: string | null },
  language: string,
): boolean {
  const resolved = item.resolvedLanguage ?? item.resolved_language;
  return !resolved || resolved.toLowerCase() === language.toLowerCase();
}

export function filterRequestedLanguage<T extends { resolvedLanguage?: string | null; resolved_language?: string | null }>(
  items: T[],
  language: string,
): T[] {
  return items.filter((item) => hasRequestedLanguage(item, language));
}

export function languageRequestConfig(language: string, params: Record<string, string | number | null | undefined> = {}) {
  return {
    params: { ...params, language },
    headers: { "Accept-Language": language },
  };
}

export default apiClient;
