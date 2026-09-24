import { serviceService } from "@/services/serviceService";
import { productService } from "@/services/productService";
import { projectService } from "@/services/projectService";
import { normalizeSlug } from "@/lib/apiClient";

/**
 * Extract locale from pathname
 * Examples: /en/services -> "en", /ar/products/slug -> "ar"
 */
export function getLocaleFromPathname(pathname: string): "en" | "ar" {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];
  
  if (firstSegment === "ar" || firstSegment === "en") {
    return firstSegment;
  }
  
  return "en"; // default
}

/**
 * Extract resource type and slug from pathname
 * Examples: 
 * /en/services/web-development -> { resource: "services", slug: "web-development" }
 * /ar/products/product-slug -> { resource: "products", slug: "product-slug" }
 */
function getResourceFromPathname(pathname: string): { 
  resource: string | null; 
  slug: string | null; 
} {
  const segments = pathname.split("/").filter(Boolean);
  
  // Remove locale if present
  const pathSegments = segments[0] === "en" || segments[0] === "ar" 
    ? segments.slice(1) 
    : segments;
  
  if (pathSegments.length === 0) {
    return { resource: null, slug: null };
  }
  
  const resource = pathSegments[0];
  const slug = pathSegments[1] || null;
  
  return { resource, slug };
}

/**
 * Switch language for a given pathname, preserving the same content
 * This function fetches the translated slug when necessary
 */
export async function switchLocaleInPathname(
  pathname: string,
  newLocale: "en" | "ar"
): Promise<string> {
  const currentLocale = getLocaleFromPathname(pathname);
  
  // If already on the target locale, return as is
  if (currentLocale === newLocale) {
    return pathname;
  }
  
  const { resource, slug } = getResourceFromPathname(pathname);
  
  // Handle home page
  if (!resource) {
    return `/${newLocale}`;
  }
  
  // Handle list pages (no slug)
  if (!slug) {
    return `/${newLocale}/${resource}`;
  }
  
  // Handle detail pages with slug - need to get translated slug
  try {
    let translatedSlug = slug;
    
    if (resource === "services") {
      const allServices = await serviceService.getServices(currentLocale, 1, 100);
      const service = allServices.find((s) => normalizeSlug(s.title) === slug || s.id === slug);
      if (service) {
        const translatedService = await serviceService.getServiceById(service.id, newLocale);
        if (translatedService?.title) {
          translatedSlug = normalizeSlug(translatedService.title);
        }
      }
    } else if (resource === "products") {
      const allProducts = await productService.getProducts(currentLocale, 1, 100);
      const product = allProducts.find((p) => normalizeSlug(p.name) === slug || p.id === slug);
      if (product) {
        const translatedProduct = await productService.getProductById(product.id, newLocale);
        if (translatedProduct?.name) {
          translatedSlug = normalizeSlug(translatedProduct.name);
        }
      }
    } else if (resource === "projects") {
      const allProjects = await projectService.getProjects(currentLocale, null, 1, 100);
      const project = allProjects.items.find((p) => normalizeSlug(p.title) === slug || p.id === slug);
      if (project) {
        const translatedProject = await projectService.getProjectById(project.id, newLocale);
        if (translatedProject?.title) {
          translatedSlug = normalizeSlug(translatedProject.title);
        }
      }
    }
    
    return `/${newLocale}/${resource}/${translatedSlug}`;
  } catch (error) {
    console.error("Error switching locale:", error);
    // Fallback: just change the locale part of the URL
    return `/${newLocale}/${resource}/${slug}`;
  }
}

/**
 * Build a locale-aware URL
 */
function buildLocaleUrl(locale: string, path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  
  // If path is empty, return just locale
  if (!cleanPath) {
    return `/${locale}`;
  }
  
  return `/${locale}/${cleanPath}`;
}
