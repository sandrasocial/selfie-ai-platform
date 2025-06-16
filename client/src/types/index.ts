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
  id: number | string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  plan?: "free" | "pro" | "starter" | "branded" | "vip";
  uploadsThisMonth?: number;
  subscription?: {
    plan: string;
    status: string;
    isActive: boolean;
  };
}

export interface UserProfile {
  id?: string;
  userId: string;
  brandMission?: string;
  idealAudience?: string;
  targetAudience?: string;
  brandValues?: string;
  brandVoice?: string;
  toneVoice?: string;
  industry?: string;
  experienceLevel?: string;
  mainGoals?: string;
  visualAesthetic?: string;
  keywords?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface AccessData {
  hasAccess: boolean;
  reason?: string;
  upgradeRequired?: boolean;
  currentTier?: string;
  requiredTier?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SubscriptionData {
  isSubscribed: boolean;
  isExpired: boolean;
  planType: string;
  expiresInDays?: number | null;
}

export interface GeneratedContent {
  id: string;
  contentType: string;
  ai_content: {
    captions?: string[];
    hooks?: string[];
    story_slides?: string[];
    hashtags?: string[];
    seo_keywords?: string[];
    cta?: string;
    signature?: string;
    reel_prompt?: string;
    caption_template?: string;
  };
  createdAt: string;
}

export interface VaultImage {
  id: string;
  user_id: string;
  file_url: string;
  file_name?: string;
  tags?: string[];
  color_tone?: string;
  uploaded_at?: string;
}

export interface FeedImage {
  id: string;
  user_id: string;
  file_url: string;
  file_name?: string;
  order_index: number;
  tags?: string[];
  uploaded_at?: string;
}
