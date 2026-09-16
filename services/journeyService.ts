import apiClient from "@/lib/apiClient";

export interface Journey {
  id: string;
  yearOrDate: string;
  imageUrl: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string | null;
  title: string;
  description: string;
  resolvedLanguage: string;
}

export interface JourneysResponse {
  success: boolean;
  data: {
    items: Journey[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  message: string | null;
  errors: string | null;
  traceId: string | null;
}

const FALLBACK_JOURNEYS: Journey[] = [
  {
    id: "fallback-1",
    yearOrDate: "2019",
    imageUrl: null,
    displayOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: null,
    title: "Company Founded",
    description: "Tech Gear began with a clear mission: help businesses turn digital ideas into real growth.",
    resolvedLanguage: "en",
  },
  {
    id: "fallback-2",
    yearOrDate: "2021",
    imageUrl: null,
    displayOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: null,
    title: "Expanded Design & Development",
    description: "We deepened our focus on custom digital experiences, blending strategy, design, and engineering.",
    resolvedLanguage: "en",
  },
  {
    id: "fallback-3",
    yearOrDate: "2023",
    imageUrl: null,
    displayOrder: 3,
    createdAt: new Date().toISOString(),
    updatedAt: null,
    title: "Growth Across Industries",
    description: "Our team scaled to support more brands with web, mobile, and business software solutions.",
    resolvedLanguage: "en",
  },
  {
    id: "fallback-4",
    yearOrDate: "2025",
    imageUrl: null,
    displayOrder: 4,
    createdAt: new Date().toISOString(),
    updatedAt: null,
    title: "Building the Future",
    description: "We continue to create digital products that combine clarity, performance, and measurable impact.",
    resolvedLanguage: "en",
  },
];

export const journeyService = {
  getJourneys: async (language: string = "en", page: number = 1, pageSize: number = 20): Promise<Journey[]> => {
    try {
      const response = await apiClient.get<JourneysResponse>("/api/journeys", {
        params: {
          language,
          page,
          pageSize,
        },
      });

      if (response.data?.success && response.data?.data?.items && response.data.data.items.length > 0) {
        return response.data.data.items.sort((a, b) => a.displayOrder - b.displayOrder);
      }
      return FALLBACK_JOURNEYS;
    } catch (error) {
      console.warn("Error/timeout fetching journeys, using fallback data:", error);
      return FALLBACK_JOURNEYS;
    }
  },
};
