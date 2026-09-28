import apiClient, { filterRequestedLanguage, languageRequestConfig, resolveImageUrl } from "@/lib/apiClient";

export interface TeamMember {
  id: string;
  imageUrl: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string | null;
  name: string;
  jobTitle: string;
  resolvedLanguage: string;
}

export interface TeamMembersResponse {
  success: boolean;
  data: {
    items: TeamMember[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  message: string | null;
  errors: string | null;
  traceId: string | null;
}

export const teamMemberService = {
  getTeamMembers: async (language: string = "en", page: number = 1, pageSize: number = 20): Promise<TeamMember[]> => {
    try {
      const response = await apiClient.get<TeamMembersResponse>("/api/team-members", languageRequestConfig(language, { page, pageSize }));

      if (response.data?.success && response.data?.data?.items) {
        return filterRequestedLanguage(response.data.data.items, language).map((member) => ({
          ...member,
          imageUrl: resolveImageUrl(member.imageUrl),
        }));
      }

      return [];
    } catch (error) {
      console.warn("Error/timeout fetching team members:", error);
      return [];
    }
  },
};
