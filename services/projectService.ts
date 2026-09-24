import apiClient, { resolveImageUrl } from "@/lib/apiClient";

// Legacy enum removed: categories are now dynamic strings

export interface ProjectImage {
  id: string;
  imageUrl: string;
  isFeatured: boolean;
  displayOrder: number;
}

export interface Project {
  id: string;
  categoryId: string;
  categoryName: string;
  iconImageUrl: string;
  heroImageUrl: string;
  projectLink: string;
  featuredImageUrl: string;
  images: ProjectImage[];
  createdAt: string;
  updatedAt: string | null;
  title: string;
  description: string;
  industry: string;
  projectType: string;
  services: string;
  platform: string;
  resolvedLanguage: string;
}

export interface PaginatedProjects {
  items: Project[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
  errors: unknown;
  traceId: string | null;
}

function normalizeProject(project: Project): Project {
  return {
    ...project,
    iconImageUrl: resolveImageUrl(project.iconImageUrl),
    heroImageUrl: resolveImageUrl(project.heroImageUrl),
    featuredImageUrl: resolveImageUrl(project.featuredImageUrl),
    images: (project.images ?? []).map((projectImage) => ({
      ...projectImage,
      imageUrl: resolveImageUrl(projectImage.imageUrl),
    })),
  };
}

export const projectService = {
  getProjects: async (
    language: string = "en",
    categoryId: string | null = null,
    page: number = 1,
    pageSize: number = 20,
  ): Promise<PaginatedProjects> => {
    const params: Record<string, string | number> = {
      page,
      pageSize,
    };

    if (categoryId !== null) {
      params.categoryId = categoryId;
    }

    const response = await apiClient.get<ApiResponse<PaginatedProjects>>("/api/projects", { 
      params,
      headers: {
        "Accept-Language": language,
      },
    });
    const data = response.data?.data;

    if (!response.data?.success || !data || !Array.isArray(data.items)) {
      throw new Error(response.data?.message ?? "Failed to load projects");
    }

    return {
      ...data,
      items: data.items.map(normalizeProject),
    };
  },

  getProjectById: async (id: string, language: string = "en"): Promise<Project> => {
    const trimmedId = id.trim();

    if (!trimmedId) {
      throw new Error("Project ID is required");
    }

    const response = await apiClient.get<ApiResponse<Project>>(`/api/projects/${trimmedId}`, {
      headers: {
        "Accept-Language": language,
      },
    });

    if (!response.data?.success || !response.data?.data) {
      throw new Error(response.data?.message ?? "Project not found");
    }

    return normalizeProject(response.data.data);
  },

  createProject: async (formData: FormData): Promise<string> => {
    const response = await apiClient.post<ApiResponse<string>>("/api/projects", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (!response.data?.success) {
      throw new Error(response.data?.message ?? "Failed to create project");
    }
    return response.data.data;
  },

  updateProject: async (id: string, formData: FormData): Promise<void> => {
    const response = await apiClient.put<ApiResponse<string>>(`/api/projects/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (!response.data?.success) {
      throw new Error(response.data?.message ?? "Failed to update project");
    }
  },

  deleteProject: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<string>>(`/api/projects/${id}`);
    if (response.data && response.data.success === false) {
      throw new Error(response.data.message ?? "Failed to delete project");
    }
  },
};

export function getProjectMainImage(project: Project): string {
  if (project.heroImageUrl) return project.heroImageUrl;
  if (project.featuredImageUrl) return project.featuredImageUrl;
  return project.images?.find((img) => img.displayOrder === 0)?.imageUrl || "";
}
