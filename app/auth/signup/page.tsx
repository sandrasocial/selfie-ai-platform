'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { validateEmail } from '@/lib/email-validation'

export default function AuthSignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [emailMarketing, setEmailMarketing] = useState(true)
  
  const { user, signUp } = useAuth()
  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    // Email validation to prevent bounces
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      setError(emailValidation.error || 'Please enter a valid email address')
      setIsLoading(false)
      return
    }

    // Password validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    if (!agreedToTerms) {
      setError('Please agree to the terms and conditions')
      setIsLoading(false)
      return
    }

    try {
      const result = await signUp(email, password, fullName)

      if (result.success) {
        setSuccess('Account created! Check your email for the confirmation link.')
        // Track signup with marketing preferences
        if (typeof window !== 'undefined') {
          // You can add analytics tracking here
          console.log('User signed up:', { email, fullName, emailMarketing })
        }
      } else {
        setError(result.error || 'Failed to create account')
      }
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  if (user) {
    return null // Will redirect
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
              Ready to get started?
            </h2>
            <p className="text-base font-light text-[#171719] leading-relaxed">
              Let's create your account so you can start building that confident, amazing version of yourself. This is gonna be good.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-8">
            {/* Error/Success Messages */}
            {error && (
              <div className="p-6 bg-[#F1F1F1] border-l-4 border-[#171719]">
                <p className="text-sm font-light text-[#171719]">
                  {error}
                </p>
              </div>
            )}
            
            {success && (
              <div className="p-6 bg-[#F1F1F1] border-l-4 border-[#171719]">
                <p className="text-sm font-light text-[#171719]">
                  {success}
                </p>
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-3">
              <label 
                htmlFor="fullName" 
                className="block text-sm font-normal tracking-wide text-[#171719] uppercase"
                style={{ letterSpacing: '0.1em' }}
              >
                Your Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder="What should we call you?"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isLoading}
                className="w-full p-4 bg-white border border-[#B5B5B3] text-[#171719] placeholder-[#B5B5B3] font-light focus:outline-none focus:border-[#171719] transition-colors duration-300"
                style={{ fontSize: '16px' }}
              />
            </div>
            
            {/* Email */}
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
                disabled={isLoading}
                className="w-full p-4 bg-white border border-[#B5B5B3] text-[#171719] placeholder-[#B5B5B3] font-light focus:outline-none focus:border-[#171719] transition-colors duration-300"
                style={{ fontSize: '16px' }}
              />
            </div>
            
            {/* Password */}
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
                  autoComplete="new-password"
                  placeholder="Create a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
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
              <p className="text-xs font-light text-[#B5B5B3]">
                At least 6 characters, please
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-3">
              <label 
                htmlFor="confirmPassword" 
                className="block text-sm font-normal tracking-wide text-[#171719] uppercase"
                style={{ letterSpacing: '0.1em' }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Type it again to be sure"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full p-4 bg-white border border-[#B5B5B3] text-[#171719] placeholder-[#B5B5B3] font-light focus:outline-none focus:border-[#171719] transition-colors duration-300 pr-12"
                  style={{ fontSize: '16px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#B5B5B3] hover:text-[#171719] transition-colors duration-300"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Email Marketing Consent */}
            <div className="flex items-start space-x-4 py-2">
              <input
                id="emailMarketing"
                type="checkbox"
                checked={emailMarketing}
                onChange={(e) => setEmailMarketing(e.target.checked)}
                className="mt-1 w-5 h-5 border-2 border-[#B5B5B3] focus:outline-none checked:bg-[#171719] checked:border-[#171719]"
              />
              <label htmlFor="emailMarketing" className="text-sm font-light text-[#171719] leading-relaxed">
                Send me weekly tips and updates (you can unsubscribe anytime)
              </label>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start space-x-4 py-2">
              <input
                id="agreedToTerms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-5 h-5 border-2 border-[#B5B5B3] focus:outline-none checked:bg-[#171719] checked:border-[#171719]"
                required
              />
              <label htmlFor="agreedToTerms" className="text-sm font-light text-[#171719] leading-relaxed">
                I agree to the{' '}
                <Link href="/terms" className="underline hover:text-[#B5B5B3] transition-colors duration-300">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="underline hover:text-[#B5B5B3] transition-colors duration-300">
                  Privacy Policy
                </Link>
              </label>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#171719] text-white py-4 px-8 font-normal tracking-widest uppercase text-sm hover:bg-[#B5B5B3] transition-colors duration-300 disabled:opacity-50"
              style={{ letterSpacing: '0.1em' }}
            >
              {isLoading ? 'Creating Your Account...' : 'Create Account'}
            </button>
            
            <div className="pt-8 space-y-6 text-center">
              <div className="text-sm font-light text-[#B5B5B3]">
                Already have an account?{' '}
                <Link 
                  href="/auth/login" 
                  className="text-[#171719] hover:text-[#B5B5B3] transition-colors duration-300 font-normal"
                >
                  Sign in here
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
