export interface ContentGeneration {
  id: number;
  userId?: number;
  imageUrl: string;
  mood: string;
  captions: string[];
  affirmations: string[];
  poseTips: string[];
  lightingAdvice: string;
  storyCaption: string;
  hashtags: string;
  recommendedFormat: string;
  createdAt?: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName?: string;
  plan: "free" | "pro";
  uploadsThisMonth: number;
}
