import apiClient from "@/lib/apiClient";

export interface ContactMessagePayload {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  data: string; // ID of the created contact message
  message: string | null;
  errors: string | null;
  traceId: string | null;
}

export const contactService = {
  submitContactMessage: async (payload: ContactMessagePayload): Promise<string> => {
    try {
      const response = await apiClient.post<ContactResponse>("/api/contact-messages", payload);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || "Failed to submit contact message");
    } catch (error) {
      console.error("Error submitting contact message:", error);
      throw error;
    }
  },
};
