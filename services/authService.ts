import apiClient from "@/lib/apiClient";

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    expiresAt: string;
    email: string;
    role: string;
  };
  message: string | null;
  errors: string | null;
  traceId: string | null;
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/api/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  setToken: (token: string, expiresAt: string) => {
    const expires = new Date(expiresAt).toUTCString();
    document.cookie = `admin_token=${token}; expires=${expires}; path=/; SameSite=Strict`;
  },

  removeToken: () => {
    document.cookie = `admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  },
};
