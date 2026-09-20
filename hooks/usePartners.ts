import { useQuery } from "@tanstack/react-query";
import { partnerService } from "@/services/partnerService";

export const usePartners = (language: string) => {
  return useQuery({
    queryKey: ["partners", language],
    queryFn: () => partnerService.getPartners(language),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};
