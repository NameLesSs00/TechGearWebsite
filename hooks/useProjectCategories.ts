import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectCategoryService, CreateProjectCategoryDto, UpdateProjectCategoryDto } from "@/services/projectCategoryService";
import { useLanguage } from "@/context/LanguageContext";

const STALE_TIME = 60 * 60 * 1000; // 1 hour

export function useProjectCategories() {
  const { language } = useLanguage();

  return useQuery({
    queryKey: ["projectCategories", language],
    queryFn: () => projectCategoryService.getAllCategories(language, 1, 100),
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectCategoryDto) => projectCategoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectCategories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectCategoryDto }) => 
      projectCategoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectCategories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => projectCategoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectCategories"] });
    },
  });
}
