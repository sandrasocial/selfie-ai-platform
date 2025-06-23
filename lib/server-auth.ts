import { createClient as createServerClient } from '@/utils/supabase/server'
import { UserProfile, UserProfileInsert } from '@/types/user'

// Server-side auth utilities
export class ServerAuthService {
  // Create client lazily to avoid build-time cookies() call
  private getSupabase() {
    return createServerClient()
  }

  // Get current user from session
  async getCurrentUser() {
    try {
      const supabase = this.getSupabase()
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return user
    } catch (error) {
      console.error('[ServerAuthService] Get current user error:', error)
      return null
    }
  }

  // Check if user is admin
  async isAdmin(userId: string): Promise<boolean> {
    try {
      const supabase = this.getSupabase()
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('is_admin, role')
        .eq('user_id', userId)
        .single()

      if (error) throw error
      return profile?.is_admin === true || profile?.role === 'super_admin'
    } catch (error) {
      console.error('[ServerAuthService] Check admin error:', error)
      return false
    }
  }

  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const supabase = this.getSupabase()
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) throw error
      return profile as UserProfile
    } catch (error) {
      console.error('[ServerAuthService] Get profile error:', error)
      return null
    }
  }
}

// Server-side user profile service
export class ServerUserProfileService {
  // Create client lazily to avoid build-time cookies() call
  private getSupabase() {
    return createServerClient()
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const supabase = this.getSupabase()
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found
          return null
        }
        throw error
      }

      return profile as UserProfile
    } catch (error) {
      console.error('[ServerUserProfileService] Get profile error:', error)
      return null
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfileInsert>): Promise<UserProfile | null> {
    try {
      const supabase = this.getSupabase()
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      return profile as UserProfile
    } catch (error) {
      console.error('[ServerUserProfileService] Update profile error:', error)
      return null
    }
  }

  async createUserProfile(profileData: UserProfileInsert): Promise<UserProfile | null> {
    try {
      const supabase = this.getSupabase()
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .insert(profileData)
        .select()
        .single()

      if (error) throw error
      return profile as UserProfile
    } catch (error) {
      console.error('[ServerUserProfileService] Create profile error:', error)
      return null
    }
  }
}

// Export factory functions instead of instances to avoid build-time cookies() calls
export const getServerAuthService = () => new ServerAuthService()
export const getServerUserProfileService = () => new ServerUserProfileService()

// Export instances for backwards compatibility (but these should be avoided)
export const serverAuthService = {
  getCurrentUser: () => getServerAuthService().getCurrentUser(),
  isAdmin: (userId: string) => getServerAuthService().isAdmin(userId),
  getUserProfile: (userId: string) => getServerAuthService().getUserProfile(userId),
}

export const serverUserProfileService = {
  getUserProfile: (userId: string) => getServerUserProfileService().getUserProfile(userId),
  updateUserProfile: (userId: string, updates: any) => getServerUserProfileService().updateUserProfile(userId, updates),
  createUserProfile: (profileData: any) => getServerUserProfileService().createUserProfile(profileData),
}
