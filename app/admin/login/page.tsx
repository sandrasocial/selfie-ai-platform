'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      let result
      if (mode === 'signin') {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        })
      } else {
        result = await supabase.auth.signUp({
          email,
          password,
        })
      }

      if (result.error) {
        if (result.error.message.includes('Invalid login credentials')) {
          setError('Hmm, that email and password combo isn\'t working. Double check?')
        } else if (result.error.message.includes('Email not confirmed')) {
          setError('Check your email for the confirmation link, then try again')
        } else if (result.error.message.includes('Password should be at least')) {
          setError('Password needs to be stronger than that')
        } else {
          setError('Something went wrong. Give it another shot?')
        }
      } else {
        if (mode === 'signup') {
          setError('')
          setMode('signin')
          // Show success message for signup
        } else {
          router.push('/admin')
          router.refresh()
        }
      }
    } catch (err) {
      setError('Something went wrong on our end. Try again in a moment?')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-soft-white flex">
      {/* Left side - Hero */}
      <div className="hidden lg:flex lg:flex-1 bg-luxury-black relative overflow-hidden">
        <div className="absolute font-bodoni text-[40vw] font-bold opacity-[0.03] text-soft-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 leading-[0.8]">
          AI
        </div>
        
        <div className="relative z-10 flex flex-col justify-center p-16 text-soft-white">
          <div className="max-w-md">
            <h1 className="font-bodoni text-6xl font-light tracking-[-0.04em] leading-[0.9] mb-8">
              SELFIE AI™
            </h1>
            <p className="text-xl font-extralight leading-relaxed mb-8">
              Your personal editorial team. Always available, never judgemental.
            </p>
            <div className="space-y-4 text-warm-gray">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 border border-soft-white flex-shrink-0 mt-1"></div>
                <p className="font-extralight">AI agents that actually get your vision</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 border border-soft-white flex-shrink-0 mt-1"></div>
                <p className="font-extralight">Tools that make you look like you have a team</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 border border-soft-white flex-shrink-0 mt-1"></div>
                <p className="font-extralight">Your brand, but elevated</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-12 text-center">
            <h1 className="font-bodoni text-4xl font-light tracking-[-0.04em] text-luxury-black mb-2">
              SELFIE AI™
            </h1>
            <p className="text-warm-gray font-extralight">Admin Access</p>
          </div>

          <div className="bg-white border border-warm-gray/20 p-12">
            <div className="mb-10">
              <h2 className="font-bodoni text-4xl font-light tracking-[-0.02em] text-luxury-black mb-4">
                {mode === 'signin' ? 'Welcome Back' : 'Join The Team'}
              </h2>
              <p className="text-warm-gray font-extralight">
                {mode === 'signin' 
                  ? 'Ready to make some magic happen?' 
                  : 'Let\'s get you set up with admin access'
                }
              </p>
            </div>

            {error && (
              <div className="mb-8 p-4 border border-warm-gray/20 bg-soft-white">
                <p className="text-luxury-black font-extralight">{error}</p>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-8">
              <div>
                <label className="block text-xs font-light tracking-[2px] uppercase text-warm-gray mb-4">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sandra@selfieai.co"
                  disabled={isLoading}
                  className="w-full p-5 border-b border-warm-gray/20 focus:border-luxury-black outline-none transition-colors bg-transparent text-lg font-extralight placeholder:text-warm-gray/60 disabled:opacity-50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-light tracking-[2px] uppercase text-warm-gray mb-4">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your secure password"
                    disabled={isLoading}
                    className="w-full p-5 pr-12 border-b border-warm-gray/20 focus:border-luxury-black outline-none transition-colors bg-transparent text-lg font-extralight placeholder:text-warm-gray/60 disabled:opacity-50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-5 text-warm-gray hover:text-luxury-black transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full bg-luxury-black text-soft-white py-5 text-xs tracking-[2px] uppercase font-light hover:bg-warm-gray transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {isLoading 
                    ? 'WORKING ON IT...' 
                    : mode === 'signin' 
                      ? 'SIGN IN' 
                      : 'CREATE ACCOUNT'
                  }
                </span>
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-warm-gray/20">
              <p className="text-center text-warm-gray font-extralight">
                {mode === 'signin' ? 'Need an account?' : 'Already have access?'}
                {' '}
                <button
                  onClick={() => {
                    setMode(mode === 'signin' ? 'signup' : 'signin')
                    setError('')
                  }}
                  className="text-luxury-black hover:text-warm-gray transition-colors underline decoration-1 underline-offset-4"
                  disabled={isLoading}
                >
                  {mode === 'signin' ? 'Join the team' : 'Sign in instead'}
                </button>
              </p>
            </div>

            {mode === 'signin' && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    // Handle forgot password
                    setError('Check your email for reset instructions')
                  }}
                  className="text-warm-gray hover:text-luxury-black transition-colors text-sm font-extralight underline decoration-1 underline-offset-4"
                  disabled={isLoading}
                >
                  Forgot your password?
                </button>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="mt-8 text-center">
            <p className="text-xs tracking-[1px] uppercase text-warm-gray font-extralight">
              Admin Portal — SELFIE AI™
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
