import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import type { ContentGeneration } from "@/types";

interface GenerateContentParams {
  image: File;
  mood: string;
}

interface UseContentGenerationOptions {
  onSuccess?: (content: ContentGeneration) => void;
  onError?: (error: any) => void;
}

export function useContentGeneration(options: UseContentGenerationOptions = {}) {
  const mutation = useMutation({
    mutationFn: async ({ image, mood }: GenerateContentParams): Promise<ContentGeneration> => {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("mood", mood);

      return apiRequest("POST", "/api/generate", formData);
    },
    onSuccess: options.onSuccess,
    onError: options.onError,
  });

  return {
    generateContent: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    data: mutation.data,
  };
}
