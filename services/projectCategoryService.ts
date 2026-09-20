import apiClient from "@/lib/apiClient";

export interface ProjectCategoryTranslation {
  languageCode: string;
  name: string;
}

export interface ProjectCategory {
  id: string;
  name: string;
  resolvedLanguage: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface ProjectCategoryResponse {
  success: boolean;
  data: {
    items: ProjectCategory[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  message: string | null;
  errors: string | null;
  traceId: string | null;
}

export interface SingleProjectCategoryResponse {
  success: boolean;
  data: ProjectCategory;
  message: string | null;
  errors: string | null;
  traceId: string | null;
}

export interface CreateProjectCategoryDto {
  translations: ProjectCategoryTranslation[];
}

export interface UpdateProjectCategoryDto {
  id: string;
  translations: ProjectCategoryTranslation[];
}

export const projectCategoryService = {
  getAllCategories: async (language: string = "ar", page: number = 1, pageSize: number = 100): Promise<ProjectCategory[]> => {
    const response = await apiClient.get<ProjectCategoryResponse>("/api/project-categories", {
      params: { language, page, pageSize },
    });
    if (response.data.success && response.data.data?.items) {
      return response.data.data.items;
    }
    throw new Error(response.data.message || "Failed to fetch project categories");
  },

  getCategoryById: async (id: string, language: string = "ar"): Promise<ProjectCategory> => {
    const response = await apiClient.get<SingleProjectCategoryResponse>(`/api/project-categories/${id}`, {
      params: { language },
    });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to fetch project category");
  },

  createCategory: async (data: CreateProjectCategoryDto): Promise<string> => {
    const response = await apiClient.post("/api/project-categories", data);
    if (response.data.success) {
      return response.data.data as string;
    }
    throw new Error(response.data.message || "Failed to create project category");
  },

  updateCategory: async (id: string, data: UpdateProjectCategoryDto): Promise<void> => {
    const response = await apiClient.put(`/api/project-categories/${id}`, data);
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update project category");
    }
  },

  deleteCategory: async (id: string): Promise<void> => {
    const response = await apiClient.delete(`/api/project-categories/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete project category");
    }
  },
};
