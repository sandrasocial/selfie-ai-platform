'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  tier: string
}

interface AdminAuthGuardProps {
  children: React.ReactNode
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    checkUserAuth()
  }, [])

  const checkUserAuth = async () => {
    console.log('🔍 AdminAuthGuard: Starting auth check...')
    
    try {
      // Get the current user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      console.log('🔍 Auth user check:', { user: authUser?.email, error: authError?.message })
      
      if (authError || !authUser) {
        console.log('❌ No auth user, redirecting to login')
        // Not authenticated - redirect to admin login
        router.push('/admin/login')
        return
      }

      // Check if user has admin email patterns (temporary solution)
      const adminEmails = ['sandra@selfieai.co', 'ssa@ssasocial.com']
      const isAdminEmail = adminEmails.includes(authUser.email || '')
      console.log('🔍 Admin email check:', { email: authUser.email, isAdmin: isAdminEmail })
      
      if (!isAdminEmail) {
        console.log('❌ Not admin email, denying access')
        setError('Access denied. Admin email required.')
        setLoading(false)
        return
      }

      // Try to get user profile, but don't fail if it doesn't work due to RLS
      try {
        console.log('🔍 Attempting profile query...')
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('tier, email')
          .eq('id', authUser.id)
          .single()

        console.log('🔍 Profile query result:', { profile, error: profileError?.message })

        // If profile exists and has VIP tier, great
        if (!profileError && profile && profile.tier === 'vip') {
          console.log('✅ Profile found with VIP tier, granting access')
          setUser({
            id: authUser.id,
            email: authUser.email || profile.email,
            tier: profile.tier
          })
          setLoading(false)
          return
        }
      } catch (profileErr) {
        // Profile query failed, but that's okay for admin emails
        console.log('⚠️ Profile query failed:', profileErr)
      }

      // For admin emails, allow access even without profile check
      if (isAdminEmail) {
        console.log('✅ Admin email detected, granting access without profile check')
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          tier: 'admin'
        })
        setLoading(false)
        return
      }

      // If we get here, deny access
      console.log('❌ Denying access - no valid admin credentials')
      setError('Access denied. Admin privileges required.')
      
    } catch (err) {
      console.error('❌ Admin auth check failed:', err)
      setError('Authentication error. Please try logging in again.')
    } finally {
      setLoading(false)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-soft-white flex items-center justify-center">
        <div className="text-center">
          <div className="font-bodoni text-3xl text-luxury-black mb-4">SELFIE AI™</div>
          <div className="text-warm-gray font-extralight">Verifying admin access...</div>
          <div className="mt-4">
            <div className="w-8 h-8 border-2 border-luxury-black border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-soft-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="font-bodoni text-3xl text-luxury-black mb-4">SELFIE AI™</div>
          <div className="text-warm-gray font-extralight mb-6">{error}</div>
          <button
            onClick={() => router.push('/admin/login')}
            className="bg-luxury-black text-soft-white px-8 py-3 text-xs tracking-[2px] uppercase font-light hover:bg-warm-gray transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  // User is authenticated and authorized - render children
  return <>{children}</>
}
