'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  const { signIn, user, profile, loading } = useAuth()
  const router = useRouter()

  // Auto-redirect if user is already authenticated
  useEffect(() => {
    if (user && profile && !loading) {
      console.log('✅ User already authenticated, redirecting to dashboard')
      router.push('/dashboard')
    }
  }, [user, profile, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoginLoading(true)

    console.log('🔐 Login attempt for:', email)

    try {
      const result = await signIn(email, password)

      console.log('🔐 Login result:', result)

      if (result.success) {
        console.log('✅ Login successful, auth state will handle redirect')
        // Don't redirect here - let the useEffect handle it when profile loads
      } else {
        console.error('❌ Login failed:', result.error)
        setError(result.error || 'Login failed. Please try again.')
        setLoginLoading(false)
      }
    } catch (error) {
      console.error('❌ Login catch error:', (error as Error).message)
      setError('An unexpected error occurred. Please try again.')
      setLoginLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F1F1F1] p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1
            className="mb-4 text-5xl font-light tracking-wider"
            style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', color: '#171719' }}
          >
            SSELFIE
          </h1>
          <p className="text-sm font-light uppercase tracking-widest text-[#B5B5B3]">
            Where Confidence Meets AI
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white p-12 shadow-sm">
          <div className="mb-10">
            <h2
              className="mb-4 text-3xl font-light tracking-tight"
              style={{ color: '#171719', letterSpacing: '-0.02em' }}
            >
              Hey, welcome back
            </h2>
            <p className="text-base font-light leading-relaxed text-[#171719]">
              Ready to dive back in? Just pop in your details and let's get you back to building
              that confident, amazing life of yours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="border-l-4 border-[#171719] bg-[#F1F1F1] p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="mt-0.5 flex-shrink-0 text-[#171719]" />
                  <p className="text-sm font-light text-[#171719]">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <label
                htmlFor="email"
                className="block text-sm font-normal uppercase tracking-wide text-[#171719]"
                style={{ letterSpacing: '0.1em' }}
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loginLoading}
                className="w-full border border-[#B5B5B3] bg-white p-4 font-light text-[#171719] placeholder-[#B5B5B3] transition-colors duration-300 focus:border-[#171719] focus:outline-none"
                style={{ fontSize: '16px' }}
              />
            </div>

            <div className="space-y-3">
              <label
                htmlFor="password"
                className="block text-sm font-normal uppercase tracking-wide text-[#171719]"
                style={{ letterSpacing: '0.1em' }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loginLoading}
                  className="w-full border border-[#B5B5B3] bg-white p-4 pr-12 font-light text-[#171719] placeholder-[#B5B5B3] transition-colors duration-300 focus:border-[#171719] focus:outline-none"
                  style={{ fontSize: '16px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transform text-[#B5B5B3] transition-colors duration-300 hover:text-[#171719]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-[#171719] px-8 py-4 text-sm font-normal uppercase tracking-widest text-white transition-colors duration-300 hover:bg-[#B5B5B3] disabled:opacity-50"
              style={{ letterSpacing: '0.1em' }}
            >
              {loginLoading ? 'Signing You In...' : 'Sign In'}
            </button>

            <div className="space-y-6 pt-8 text-center">
              <Link
                href="/auth/reset-password"
                className="block text-sm font-light text-[#B5B5B3] transition-colors duration-300 hover:text-[#171719]"
              >
                Forgot your password? No worries, happens to everyone.
              </Link>

              <div className="text-sm font-light text-[#B5B5B3]">
                New here?{' '}
                <Link
                  href="/auth/signup"
                  className="font-normal text-[#171719] transition-colors duration-300 hover:text-[#B5B5B3]"
                >
                  Create your account
                </Link>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-xs font-light uppercase tracking-widest text-[#B5B5B3]">
            Where every woman becomes the CEO of her own life
          </p>
        </div>
      </div>
    </div>
  )
}
