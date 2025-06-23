import { createClient } from '@/utils/supabase/client'
import { UserProfile, UserProfileInsert, CreateUserData, AuthUser } from '@/types/user'
import { User } from '@supabase/supabase-js'

// Client-side auth utilities
export class AuthService {
  private supabase = createClient()

  // Sign up new user
  async signUp(userData: CreateUserData) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.full_name,
            marketing_consent: userData.marketing_consent,
            source: userData.source
          }
        }
      })

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  // Sign in user
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  // Sign out user
  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut()
      if (error) throw error
      return { success: true }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  // Reset password
  async resetPassword(email: string) {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) throw error
      return { success: true }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  // Update password
  async updatePassword(newPassword: string) {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error
      return { success: true }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await this.supabase.auth.getUser()
    return user
  }

  // Get current session
  async getCurrentSession() {
    const { data: { session } } = await this.supabase.auth.getSession()
    return session
  }

  // Listen to auth changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }
}

// User profile utilities
export class UserProfileService {
  private supabase = createClient()

  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return data
  }

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  // Update onboarding status
  async updateOnboardingStatus(userId: string, status: any) {
    return this.supabase.rpc('update_onboarding_step', {
      user_id_input: userId,
      step_data: status
    })
  }

  // Upgrade user tier
  async upgradeUserTier(userId: string, newTier: 'free' | 'starter' | 'collective' | 'vip') {
    return this.supabase.rpc('upgrade_user_tier', {
      user_id: userId,
      new_tier: newTier
    })
  }
}

// Lead tracking utilities
export class LeadTrackingService {
  private supabase = createClient()

  // Track lead magnet download
  async trackLeadMagnet(
    email: string, 
    magnetType: string, 
    source?: string, 
    metadata?: any
  ) {
    return this.supabase.rpc('track_lead_magnet', {
      email_input: email,
      magnet_type_input: magnetType,
      source_input: source,
      metadata_input: metadata
    })
  }

  // Save glow check result
  async saveGlowCheckResult(
    email: string,
    imageUrl: string,
    analysis: any,
    score: number,
    recommendations: string[]
  ) {
    return this.supabase.rpc('save_glow_check_result', {
      email_input: email,
      image_url_input: imageUrl,
      analysis_input: analysis,
      score_input: score,
      recommendations_input: recommendations
    })
  }

  // Track user session
  async trackUserSession(sessionData: {
    userId?: string
    pages: string[]
    actions: any[]
    deviceInfo?: any
    referrer?: string
  }) {
    const { data, error } = await this.supabase
      .from('user_sessions')
      .insert({
        user_id: sessionData.userId,
        pages_visited: sessionData.pages,
        actions_taken: sessionData.actions,
        device_info: sessionData.deviceInfo,
        referrer: sessionData.referrer
      })

    return { data, error }
  }
}

// Create service instances
export const authService = new AuthService()
export const userProfileService = new UserProfileService()
export const leadTrackingService = new LeadTrackingService()
