export type UserTier = 'free' | 'starter' | 'collective' | 'vip'
export type AIModelStatus = 'pending' | 'training' | 'ready' | 'failed'

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          user_id: string
          email: string
          full_name: string | null
          role: string
          is_admin: boolean
          avatar_url: string | null
          metadata: Record<string, any>
          tier: UserTier
          onboarding_status: Record<string, any>
          ai_model_status: AIModelStatus
          goals: Record<string, any>[]
          brand_vibe: string | null
          future_self_unlocked: string[] | null
          confidence_scores: Record<string, any>[]
          last_glow_check: string | null
          phone: string | null
          birth_date: string | null
          location: string | null
          instagram_handle: string | null
          website_url: string | null
          bio: string | null
          preferences: Record<string, any>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          full_name?: string | null
          role?: string
          is_admin?: boolean
          avatar_url?: string | null
          metadata?: Record<string, any>
          tier?: UserTier
          onboarding_status?: Record<string, any>
          ai_model_status?: AIModelStatus
          goals?: Record<string, any>[]
          brand_vibe?: string | null
          future_self_unlocked?: string[] | null
          confidence_scores?: Record<string, any>[]
          last_glow_check?: string | null
          phone?: string | null
          birth_date?: string | null
          location?: string | null
          instagram_handle?: string | null
          website_url?: string | null
          bio?: string | null
          preferences?: Record<string, any>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          full_name?: string | null
          role?: string
          is_admin?: boolean
          avatar_url?: string | null
          metadata?: Record<string, any>
          tier?: UserTier
          onboarding_status?: Record<string, any>
          ai_model_status?: AIModelStatus
          goals?: Record<string, any>[]
          brand_vibe?: string | null
          future_self_unlocked?: string[] | null
          confidence_scores?: Record<string, any>[]
          last_glow_check?: string | null
          phone?: string | null
          birth_date?: string | null
          location?: string | null
          instagram_handle?: string | null
          website_url?: string | null
          bio?: string | null
          preferences?: Record<string, any>
          created_at?: string
          updated_at?: string
        }
      }
      future_self_images: {
        Row: {
          id: string
          user_id: string
          image_url: string
          scenario: string
          prompt_used: string | null
          created_at: string
          is_featured: boolean
          metadata: Record<string, any>
        }
        Insert: {
          id?: string
          user_id: string
          image_url: string
          scenario: string
          prompt_used?: string | null
          created_at?: string
          is_featured?: boolean
          metadata?: Record<string, any>
        }
        Update: {
          id?: string
          user_id?: string
          image_url?: string
          scenario?: string
          prompt_used?: string | null
          created_at?: string
          is_featured?: boolean
          metadata?: Record<string, any>
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          metric_type: string
          value: Record<string, any>
          recorded_at: string
          notes: string | null
        }
        Insert: {
          id?: string
          user_id: string
          metric_type: string
          value: Record<string, any>
          recorded_at?: string
          notes?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          metric_type?: string
          value?: Record<string, any>
          recorded_at?: string
          notes?: string | null
        }
      }
      lead_magnets: {
        Row: {
          id: string
          email: string
          magnet_type: string
          downloaded_at: string
          user_id: string | null
          source: string | null
          metadata: Record<string, any>
        }
        Insert: {
          id?: string
          email: string
          magnet_type: string
          downloaded_at?: string
          user_id?: string | null
          source?: string | null
          metadata?: Record<string, any>
        }
        Update: {
          id?: string
          email?: string
          magnet_type?: string
          downloaded_at?: string
          user_id?: string | null
          source?: string | null
          metadata?: Record<string, any>
        }
      }
      glow_check_results: {
        Row: {
          id: string
          user_id: string | null
          email: string
          image_url: string | null
          analysis_results: Record<string, any>
          score: number | null
          recommendations: string[] | null
          created_at: string
          is_anonymous: boolean
        }
        Insert: {
          id?: string
          user_id?: string | null
          email: string
          image_url?: string | null
          analysis_results: Record<string, any>
          score?: number | null
          recommendations?: string[] | null
          created_at?: string
          is_anonymous?: boolean
        }
        Update: {
          id?: string
          user_id?: string | null
          email?: string
          image_url?: string | null
          analysis_results?: Record<string, any>
          score?: number | null
          recommendations?: string[] | null
          created_at?: string
          is_anonymous?: boolean
        }
      }
      email_sequences: {
        Row: {
          id: string
          user_id: string | null
          email: string
          sequence_type: string
          current_step: number
          completed: boolean
          started_at: string
          last_sent_at: string | null
          metadata: Record<string, any>
        }
        Insert: {
          id?: string
          user_id?: string | null
          email: string
          sequence_type: string
          current_step?: number
          completed?: boolean
          started_at?: string
          last_sent_at?: string | null
          metadata?: Record<string, any>
        }
        Update: {
          id?: string
          user_id?: string | null
          email?: string
          sequence_type?: string
          current_step?: number
          completed?: boolean
          started_at?: string
          last_sent_at?: string | null
          metadata?: Record<string, any>
        }
      }
      user_sessions: {
        Row: {
          id: string
          user_id: string | null
          session_start: string
          session_end: string | null
          pages_visited: string[] | null
          actions_taken: Record<string, any>
          device_info: Record<string, any> | null
          referrer: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          session_start?: string
          session_end?: string | null
          pages_visited?: string[] | null
          actions_taken?: Record<string, any>
          device_info?: Record<string, any> | null
          referrer?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          session_start?: string
          session_end?: string | null
          pages_visited?: string[] | null
          actions_taken?: Record<string, any>
          device_info?: Record<string, any> | null
          referrer?: string | null
        }
      }
    }
    Functions: {
      upgrade_user_tier: {
        Args: {
          user_id: string
          new_tier: UserTier
        }
        Returns: void
      }
      track_lead_magnet: {
        Args: {
          email_input: string
          magnet_type_input: string
          source_input?: string
          metadata_input?: Record<string, any>
        }
        Returns: string
      }
      save_glow_check_result: {
        Args: {
          email_input: string
          image_url_input: string
          analysis_input: Record<string, any>
          score_input: number
          recommendations_input: string[]
        }
        Returns: string
      }
      update_onboarding_step: {
        Args: {
          user_id_input: string
          step_data: Record<string, any>
        }
        Returns: void
      }
    }
  }
}