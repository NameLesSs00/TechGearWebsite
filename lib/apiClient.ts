import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
const ImageUrl = "https://tech-gear-backend-site.premiumasp.net"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://tech-gear-backend-site.premiumasp.net";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Variable to store current language (will be set by the app)
let currentLanguage: string = "en";

/**
 * Set the current language for all API requests
 * This should be called when language changes in the app
 */
export function setApiLanguage(language: string) {
  currentLanguage = language;
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
 * Utility function to normalize slugs
 */
export function normalizeSlug(value?: string | null): string {
  if (!value) {
    return "";
  }

  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default apiClient;
