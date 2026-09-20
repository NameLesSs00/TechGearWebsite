import { useQuery } from "@tanstack/react-query";
import { serviceService } from "@/services/serviceService";

export const useServices = (language: string) => {
  return useQuery({
    queryKey: ["services", language],
    queryFn: () => serviceService.getServices(language, 1, 50),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};
