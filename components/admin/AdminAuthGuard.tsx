'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
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
  
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    checkUserAuth()
  }, [])

  const checkUserAuth = async () => {
    try {
      // Get the current user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !authUser) {
        // Not authenticated - redirect to admin login
        router.push('/admin/login')
        return
      }

      // Get user profile to check if they have admin/VIP access
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('tier, email')
        .eq('id', authUser.id)
        .single()

      if (profileError || !profile) {
        setError('Unable to verify admin access. Please contact support.')
        setLoading(false)
        return
      }

      // Check if user has admin access (VIP tier for now)
      if (profile.tier !== 'vip') {
        setError('Access denied. Admin privileges required.')
        setLoading(false)
        return
      }

      // User is authenticated and has admin access
      setUser({
        id: authUser.id,
        email: authUser.email || profile.email,
        tier: profile.tier
      })
      
    } catch (err) {
      console.error('Admin auth check failed:', err)
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
