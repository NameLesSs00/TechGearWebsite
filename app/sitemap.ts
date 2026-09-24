import type { MetadataRoute } from "next";
import { getFullUrl } from "@/lib/seo";
import { serviceService, type ServiceApiItem } from "@/services/serviceService";
import { projectService, type Project } from "@/services/projectService";
import { productService, type ProductApiItem } from "@/services/productService";

const SITEMAP_PAGE_SIZE = 100;

type PageResult<T> = {
  items: T[];
  totalPages?: number;
};

async function getAllPages<T>(
  fetchPage: (page: number, pageSize: number) => Promise<PageResult<T>>,
): Promise<T[]> {
  const items: T[] = [];
  let page = 1;

  while (true) {
    const result = await fetchPage(page, SITEMAP_PAGE_SIZE);
    items.push(...result.items);

    if (
      (result.totalPages !== undefined && page >= result.totalPages) ||
      result.items.length < SITEMAP_PAGE_SIZE
    ) {
      return items;
    }

    page += 1;
  }
}

function getLastModified(updatedAt: string | null): Date | undefined {
  if (!updatedAt) {
    return undefined;
  }

  const date = new Date(updatedAt);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function createDynamicRoute(
  baseUrl: string,
  path: string,
  updatedAt: string | null,
): MetadataRoute.Sitemap[number] {
  const lastModified = getLastModified(updatedAt);

  return {
    url: `${baseUrl}/${path}`,
    ...(lastModified ? { lastModified } : {}),
    changeFrequency: "monthly",
    priority: 0.7,
  };
}

async function getServiceItems(): Promise<ServiceApiItem[]> {
  try {
    return await getAllPages(async (page, pageSize) => ({
      items: await serviceService.getServices("en", page, pageSize),
    }));
  } catch {
    return [];
  }
}

async function getProjectItems(): Promise<Project[]> {
  try {
    return await getAllPages(async (page, pageSize) => {
      const result = await projectService.getProjects("en", null, page, pageSize);
      return {
        items: result.items,
        totalPages: result.totalPages,
      };
    });
  } catch {
    return [];
  }
}

async function getProductItems(): Promise<ProductApiItem[]> {
  try {
    return await getAllPages(async (page, pageSize) => ({
      items: await productService.getProducts("en", page, pageSize),
    }));
  } catch {
    return [];
  }
}

function deduplicateRoutes(routes: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  return Array.from(new Map(routes.map((route) => [route.url, route])).values());
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getFullUrl("");

  // Static public pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/aboutus`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/products`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contactus`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const [services, projects, products] = await Promise.all([
    getServiceItems(),
    getProjectItems(),
    getProductItems(),
  ]);

  const serviceRoutes = services.map((service) =>
    createDynamicRoute(baseUrl, `services/${service.id}`, service.updatedAt),
  );
  const projectRoutes = projects.map((project) =>
    createDynamicRoute(baseUrl, `projects/${project.id}`, project.updatedAt),
  );
  const productRoutes = products.map((product) =>
    createDynamicRoute(baseUrl, `products/${product.id}`, product.updatedAt),
  );

  return deduplicateRoutes([
    ...staticRoutes,
    ...serviceRoutes,
    ...projectRoutes,
    ...productRoutes,
  ]);
}
