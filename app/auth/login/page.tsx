'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'

export default function AuthLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [success, setSuccess] = useState('')
  
  const supabase = createClientComponentClient()
  const router = useRouter()

  // Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/dashboard')
      }
    }
    checkAuth()
  }, [router, supabase])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

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
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        })
      }

      if (result.error) {
        if (result.error.message.includes('Invalid login credentials')) {
          setError('Email or password incorrect. Try again?')
        } else if (result.error.message.includes('Email not confirmed')) {
          setError('Check your email for the confirmation link first!')
        } else if (result.error.message.includes('Password should be at least')) {
          setError('Password needs to be at least 6 characters')
        } else if (result.error.message.includes('User already registered')) {
          setError('Account already exists. Try signing in instead.')
        } else {
          setError(result.error.message)
        }
      } else {
        if (mode === 'signup') {
          if (result.data.user && !result.data.session) {
            setSuccess('Check your email to confirm your account!')
            setMode('signin')
          } else {
            router.push('/dashboard')
          }
        } else {
          router.push('/dashboard')
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex">
      {/* Left side - Hero */}
      <div className="hidden lg:flex lg:flex-1 bg-[#171719] relative overflow-hidden">
        <div className="absolute font-cormorant text-[30vw] font-light opacity-[0.05] text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 leading-[0.8]">
          SELFIE
        </div>
        
        <div className="relative z-10 flex flex-col justify-center p-16 text-white">
          <div className="max-w-md">
            <h1 className="font-cormorant text-6xl font-light tracking-wide leading-[0.9] mb-8">
              SELFIE AI™
            </h1>
            <p className="text-xl font-light leading-relaxed mb-8 text-[#E8E8E8]">
              Your personal brand studio. Always available, never judgemental.
            </p>
            <div className="space-y-6 text-[#B5B5B3]">
              <div className="flex items-start gap-4">
                <Sparkles className="w-5 h-5 mt-1 flex-shrink-0" />
                <p className="font-light">AI-powered selfie coaching & editing</p>
              </div>
              <div className="flex items-start gap-4">
                <Sparkles className="w-5 h-5 mt-1 flex-shrink-0" />
                <p className="font-light">Professional brand tools made simple</p>
              </div>
              <div className="flex items-start gap-4">
                <Sparkles className="w-5 h-5 mt-1 flex-shrink-0" />
                <p className="font-light">Your confidence, elevated</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-cormorant text-[#171719] mb-3 font-light">
              {mode === 'signin' ? 'Welcome Back' : 'Join Selfie AI'}
            </h2>
            <p className="text-[#8A8A8A] font-light">
              {mode === 'signin' 
                ? 'Ready to create some magic?' 
                : 'Ready to transform your selfie game?'
              }
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm font-light">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm font-light">
              {success}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-light text-[#171719] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A8A8A]" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-[#E8E8E8] focus:border-[#171719] outline-none transition-colors font-light"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-light text-[#171719] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A8A8A]" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-[#E8E8E8] focus:border-[#171719] outline-none transition-colors font-light"
                  placeholder={mode === 'signin' ? 'Your password' : 'Create a password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A8A] hover:text-[#171719] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#171719] text-white py-3 px-4 hover:bg-[#2A2A2A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-light tracking-wide flex items-center justify-center gap-2"
            >
              {isLoading ? (
                'Please wait...'
              ) : (
                <>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin')
                setError('')
                setSuccess('')
              }}
              className="text-[#8A8A8A] hover:text-[#171719] transition-colors font-light"
            >
              {mode === 'signin' 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Sign in'
              }
            </button>
          </div>

          <div className="text-center pt-4 border-t border-[#E8E8E8]">
            <Link 
              href="/"
              className="text-sm text-[#8A8A8A] hover:text-[#171719] transition-colors font-light"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
