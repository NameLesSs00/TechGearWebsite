import apiClient, { isValidGuid, resolveImageUrl } from "@/lib/apiClient";

export enum ProjectCategory {
  Mobile = 0,
  Web = 1,
  Desktop = 2,
}

interface ProjectImage {
  id: string;
  imageUrl: string;
  displayOrder: number;
}

export interface Project {
  id: string;
  photoUrl: string;
  image: string;
  liveDemoUrl: string;
  category: number;
  serviceId: string;
  serviceTitle: string;
  createdAt: string;
  updatedAt: string | null;
  languageCode: string;
  resolvedLanguage: string;
  title: string;
  description: string;
  slug: string;
  industry: string;
  projectType: string;
  includes: string;
  projectImages: ProjectImage[];
  images: string[];
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
    photoUrl: resolveImageUrl(project.photoUrl),
    image: resolveImageUrl(project.image),
    slug: project.slug || project.id,
    projectImages: (project.projectImages ?? []).map((projectImage) => ({
      ...projectImage,
      imageUrl: resolveImageUrl(projectImage.imageUrl),
    })),
    images: (project.images ?? []).map((image) => resolveImageUrl(image)),
  };
}

export const projectService = {
  getProjects: async (
    language: string = "en",
    category: ProjectCategory | null = null,
    page: number = 1,
    pageSize: number = 20,
  ): Promise<PaginatedProjects> => {
    const params: Record<string, string | number> = {
      page,
      pageSize,
    };

    if (category !== null) {
      params.category = category;
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

  getProjectBySlug: async (slug: string, language: string = "en"): Promise<Project | null> => {
    const trimmedSlug = slug.trim();

    if (!trimmedSlug) {
      return null;
    }

    if (isValidGuid(trimmedSlug)) {
      try {
        return await projectService.getProjectById(trimmedSlug, language);
      } catch {
        return null;
      }
    }

    try {
      // Try to get project by slug endpoint if available
      const response = await apiClient.get<ApiResponse<Project>>(`/api/projects/slug/${encodeURIComponent(trimmedSlug)}`, {
        headers: {
          "Accept-Language": language,
        },
      });

      if (response.data?.success && response.data?.data) {
        return normalizeProject(response.data.data);
      }

      return null;
    } catch (error) {
      // Fallback: fetch all projects and find by slug
      console.warn(`Project slug endpoint not available, fetching all projects`);
      
      try {
        const result = await projectService.getProjects(language, null, 1, 100);
        const requestedSlug = decodeURIComponent(trimmedSlug).trim().toLowerCase();
        const matchedProject = result.items.find(
          (project) =>
            project.slug?.trim().toLowerCase() === requestedSlug ||
            project.id?.trim().toLowerCase() === requestedSlug
        );
        
        if (matchedProject) {
          return matchedProject;
        }
        
        return null;
      } catch (fallbackError) {
        console.error(`Error fetching project list while resolving slug ${trimmedSlug}:`, fallbackError);
        return null;
      }
    }
  },
};

export function getProjectMainImage(project: Project): string {
  return (
    project.projectImages?.find((projectImage) => projectImage.displayOrder === 0)?.imageUrl ||
    project.image ||
    project.photoUrl
  );
}
