import { Database } from './supabase/supabase'

// Extract types from Database
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert']
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']

export type FutureSelfImage = Database['public']['Tables']['future_self_images']['Row']
export type FutureSelfImageInsert = Database['public']['Tables']['future_self_images']['Insert']
export type FutureSelfImageUpdate = Database['public']['Tables']['future_self_images']['Update']

export type UserProgress = Database['public']['Tables']['user_progress']['Row']
export type UserProgressInsert = Database['public']['Tables']['user_progress']['Insert']
export type UserProgressUpdate = Database['public']['Tables']['user_progress']['Update']

export type LeadMagnet = Database['public']['Tables']['lead_magnets']['Row']
export type LeadMagnetInsert = Database['public']['Tables']['lead_magnets']['Insert']
export type LeadMagnetUpdate = Database['public']['Tables']['lead_magnets']['Update']

export type GlowCheckResult = Database['public']['Tables']['glow_check_results']['Row']
export type GlowCheckResultInsert = Database['public']['Tables']['glow_check_results']['Insert']
export type GlowCheckResultUpdate = Database['public']['Tables']['glow_check_results']['Update']

export type EmailSequence = Database['public']['Tables']['email_sequences']['Row']
export type EmailSequenceInsert = Database['public']['Tables']['email_sequences']['Insert']
export type EmailSequenceUpdate = Database['public']['Tables']['email_sequences']['Update']

export type UserSession = Database['public']['Tables']['user_sessions']['Row']
export type UserSessionInsert = Database['public']['Tables']['user_sessions']['Insert']
export type UserSessionUpdate = Database['public']['Tables']['user_sessions']['Update']

// Additional utility types
export type UserTier = Database['public']['Tables']['user_profiles']['Row']['tier']
export type AIModelStatus = Database['public']['Tables']['user_profiles']['Row']['ai_model_status']

// Auth related types
export interface AuthUser {
  id: string
  email: string | undefined
  user_metadata: {
    full_name?: string
    avatar_url?: string
  }
}

// Onboarding flow types
export interface OnboardingStatus {
  step: number
  completed: boolean
  welcome_seen: boolean
  goals_set?: boolean
  brand_vibe_set?: boolean
  tier_selected?: boolean
  payment_completed?: boolean
}

// User preferences types
export interface UserPreferences {
  notifications: boolean
  email_marketing: boolean
  weekly_tips: boolean
  sms_updates?: boolean
  push_notifications?: boolean
}

// Progress tracking types
export type ProgressMetricType = 
  | 'confidence_score'
  | 'selfie_count'
  | 'glow_check_score'
  | 'module_completion'
  | 'engagement_score'
  | 'brand_consistency'

export interface ProgressValue {
  score?: number
  count?: number
  percentage?: number
  milestone?: string
  details?: Record<string, any>
}

// Lead magnet types
export type MagnetType = 
  | 'glow_check'
  | 'selfie_guide'
  | 'starter_preview'
  | 'branded_preview'
  | 'vip_preview'
  | 'weekly_tips'

// Email sequence types
export type SequenceType = 
  | 'welcome'
  | 'starter_kit'
  | 'branded'
  | 'vip'
  | 'weekly_tips'
  | 're_engagement'

// Glow Check analysis types
export interface GlowCheckAnalysis {
  overall_score: number
  lighting: {
    score: number
    feedback: string
  }
  angle: {
    score: number
    feedback: string
  }
  expression: {
    score: number
    feedback: string
  }
  background: {
    score: number
    feedback: string
  }
  composition: {
    score: number
    feedback: string
  }
  brand_alignment?: {
    score: number
    feedback: string
  }
}

// Session tracking types
export interface SessionAction {
  type: string
  timestamp: string
  page: string
  details?: Record<string, any>
}

export interface DeviceInfo {
  userAgent: string
  screenSize: string
  browser: string
  os: string
  isMobile: boolean
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// User creation types
export interface CreateUserData {
  email: string
  password: string
  full_name?: string
  marketing_consent?: boolean
  source?: string
}

// Profile update types
export interface ProfileUpdateData {
  full_name?: string
  phone?: string
  birth_date?: string
  location?: string
  instagram_handle?: string
  website_url?: string
  bio?: string
  brand_vibe?: string
  goals?: any[]
  preferences?: UserPreferences
}
