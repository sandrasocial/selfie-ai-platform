'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    console.log('🔐 Login attempt for:', email)

    try {
      const result = await signIn(email, password)
      
      console.log('🔐 Login result:', result)
      
      if (result.success) {
        console.log('✅ Login successful, redirecting to dashboard')
        router.push('/dashboard')
      } else {
        console.error('❌ Login failed:', result.error)
        setError(result.error || 'Login failed. Please try again.')
      }
    } catch (error) {
      console.error('❌ Login catch error:', (error as Error).message)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light tracking-wider mb-4" style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', color: '#171719' }}>
            SSELFIE
          </h1>
          <p className="text-sm font-light tracking-widest text-[#B5B5B3] uppercase">
            Where Confidence Meets AI
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white p-12 shadow-sm">
          <div className="mb-10">
            <h2 className="text-3xl font-light mb-4 tracking-tight" style={{ color: '#171719', letterSpacing: '-0.02em' }}>
              Hey, welcome back
            </h2>
            <p className="text-base font-light text-[#171719] leading-relaxed">
              Ready to dive back in? Just pop in your details and let's get you back to building that confident, amazing life of yours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-6 bg-[#F1F1F1] border-l-4 border-[#171719]">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-[#171719] mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-light text-[#171719]">
                    {error}
                  </p>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <label 
                htmlFor="email" 
                className="block text-sm font-normal tracking-wide text-[#171719] uppercase"
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
                disabled={loading}
                className="w-full p-4 bg-white border border-[#B5B5B3] text-[#171719] placeholder-[#B5B5B3] font-light focus:outline-none focus:border-[#171719] transition-colors duration-300"
                style={{ fontSize: '16px' }}
              />
            </div>
            
            <div className="space-y-3">
              <label 
                htmlFor="password" 
                className="block text-sm font-normal tracking-wide text-[#171719] uppercase"
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
                  disabled={loading}
                  className="w-full p-4 bg-white border border-[#B5B5B3] text-[#171719] placeholder-[#B5B5B3] font-light focus:outline-none focus:border-[#171719] transition-colors duration-300 pr-12"
                  style={{ fontSize: '16px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#B5B5B3] hover:text-[#171719] transition-colors duration-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#171719] text-white py-4 px-8 font-normal tracking-widest uppercase text-sm hover:bg-[#B5B5B3] transition-colors duration-300 disabled:opacity-50"
              style={{ letterSpacing: '0.1em' }}
            >
              {loading ? 'Signing You In...' : 'Sign In'}
            </button>
            
            <div className="pt-8 space-y-6 text-center">
              <Link 
                href="/auth/reset-password" 
                className="block text-sm font-light text-[#B5B5B3] hover:text-[#171719] transition-colors duration-300"
              >
                Forgot your password? No worries, happens to everyone.
              </Link>
              
              <div className="text-sm font-light text-[#B5B5B3]">
                New here?{' '}
                <Link 
                  href="/auth/signup" 
                  className="text-[#171719] hover:text-[#B5B5B3] transition-colors duration-300 font-normal"
                >
                  Create your account
                </Link>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-xs font-light tracking-widest text-[#B5B5B3] uppercase">
            Where every woman becomes the CEO of her own life
          </p>
        </div>
      </div>
    </div>
  )
}
