'use client'

import { useState, useEffect, useContext, createContext, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'
import { UserProfile } from '@/types/user'
import { userProfileService } from '@/lib/auth'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  // Load user profile
  const loadUserProfile = async (userId: string) => {
    const userProfile = await userProfileService.getUserProfile(userId)
    setProfile(userProfile)
  }

  // Refresh profile data
  const refreshProfile = async () => {
    if (user) {
      await loadUserProfile(user.id)
    }
  }

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await loadUserProfile(session.user.id)
      }
      
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await loadUserProfile(session.user.id)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const signIn = async (email: string, password: string) => {
    console.log('🔐 Starting sign in for:', email)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      console.log('🔐 Sign in response:', { data: !!data, error: error?.message })

      if (error) {
        console.error('🔐 Sign in error:', error.message)
        throw error
      }
      
      console.log('✅ Sign in successful')
      return { success: true }
    } catch (error) {
      console.error('🔐 Sign in catch error:', (error as Error).message)
      return { success: false, error: (error as Error).message }
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    console.log('📝 Starting sign up for:', email)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })

      console.log('📝 Sign up response:', { data: !!data, error: error?.message })

      if (error) {
        console.error('📝 Sign up error:', error.message)
        throw error
      }
      
      console.log('✅ Sign up successful')
      return { success: true }
    } catch (error) {
      console.error('📝 Sign up catch error:', (error as Error).message)
      return { success: false, error: (error as Error).message }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { success: false, error: 'No user logged in' }
    
    const result = await userProfileService.updateUserProfile(user.id, updates)
    
    if (result.success) {
      // Refresh profile data
      await refreshProfile()
    }
    
    return result
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook to require authentication
export function useRequireAuth() {
  const { user, loading } = useAuth()
  
  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/auth/login'
    }
  }, [user, loading])

  return { user, loading }
}

// Hook to require admin access
export function useRequireAdmin() {
  const { user, profile, loading } = useAuth()
  
  useEffect(() => {
    if (!loading) {
      if (!user) {
        window.location.href = '/auth/login'
      } else if (!profile?.is_admin) {
        window.location.href = '/dashboard'
      }
    }
  }, [user, profile, loading])

  return { user, profile, loading }
}
