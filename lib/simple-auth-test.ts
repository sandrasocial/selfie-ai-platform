/**
 * Simple Auth Test - Emergency bypass for complex auth flow
 * Use this to test basic Supabase auth without profile complications
 */

import { createClient } from '@/utils/supabase/client'

export class SimpleAuthTest {
  private supabase = createClient()

  // Test basic signup without complex profile logic
  async testSignUp(email: string, password: string, fullName: string = 'Test User') {
    console.log('🧪 SimpleAuth: Testing signup for:', email)

    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        console.error('❌ SimpleAuth: Signup error:', error.message)
        return { success: false, error: error.message }
      }

      console.log('✅ SimpleAuth: Signup successful')
      console.log('👤 User:', data.user?.email)

      return { success: true, user: data.user }
    } catch (error) {
      console.error('❌ SimpleAuth: Signup catch:', (error as Error).message)
      return { success: false, error: (error as Error).message }
    }
  }

  // Test basic signin without complex profile logic
  async testSignIn(email: string, password: string) {
    console.log('🧪 SimpleAuth: Testing signin for:', email)

    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('❌ SimpleAuth: Signin error:', error.message)
        return { success: false, error: error.message }
      }

      console.log('✅ SimpleAuth: Signin successful')
      console.log('👤 User:', data.user?.email)
      console.log('🔑 Session exists:', !!data.session)

      return { success: true, user: data.user, session: data.session }
    } catch (error) {
      console.error('❌ SimpleAuth: Signin catch:', (error as Error).message)
      return { success: false, error: (error as Error).message }
    }
  }

  // Test if current user exists
  async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await this.supabase.auth.getUser()

      if (error) {
        console.error('❌ SimpleAuth: Get user error:', error.message)
        return null
      }

      console.log('👤 SimpleAuth: Current user:', user?.email || 'None')
      return user
    } catch (error) {
      console.error('❌ SimpleAuth: Get user catch:', (error as Error).message)
      return null
    }
  }

  // Test profile existence (without complex loading)
  async testProfileExists(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('id, email, full_name, tier')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('❌ SimpleAuth: Profile check error:', error.message)
        return { exists: false, error: error.message }
      }

      console.log('✅ SimpleAuth: Profile exists:', data.email)
      return { exists: true, profile: data }
    } catch (error) {
      console.error('❌ SimpleAuth: Profile check catch:', (error as Error).message)
      return { exists: false, error: (error as Error).message }
    }
  }

  // Sign out
  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut()

      if (error) {
        console.error('❌ SimpleAuth: Signout error:', error.message)
        return { success: false, error: error.message }
      }

      console.log('✅ SimpleAuth: Signed out successfully')
      return { success: true }
    } catch (error) {
      console.error('❌ SimpleAuth: Signout catch:', (error as Error).message)
      return { success: false, error: (error as Error).message }
    }
  }
}

// Create instance for easy use
export const simpleAuth = new SimpleAuthTest()

// Add to window for browser console testing
if (typeof window !== 'undefined') {
  ;(window as any).simpleAuth = simpleAuth
}
