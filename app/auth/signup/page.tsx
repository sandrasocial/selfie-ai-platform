'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

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

    // Validation
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
    <div className="min-h-screen bg-soft-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl text-luxury-black mb-2">
            Create Your Account
          </h1>
          <p className="font-sans text-luxury-black/70">
            Start your journey to confident selfies with SELFIE AI™
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white p-8 border border-luxury-black/10">
          <form onSubmit={handleSignup} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block font-sans text-sm font-medium text-luxury-black mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-black/50 w-5 h-5" />
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-luxury-black/20 text-luxury-black placeholder-luxury-black/50 focus:outline-none focus:border-luxury-black"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block font-sans text-sm font-medium text-luxury-black mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-black/50 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-luxury-black/20 text-luxury-black placeholder-luxury-black/50 focus:outline-none focus:border-luxury-black"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block font-sans text-sm font-medium text-luxury-black mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-black/50 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 border border-luxury-black/20 text-luxury-black placeholder-luxury-black/50 focus:outline-none focus:border-luxury-black"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-luxury-black/50 hover:text-luxury-black"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-luxury-black/60 mt-1">
                Must be at least 6 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block font-sans text-sm font-medium text-luxury-black mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-black/50 w-5 h-5" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 border border-luxury-black/20 text-luxury-black placeholder-luxury-black/50 focus:outline-none focus:border-luxury-black"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-luxury-black/50 hover:text-luxury-black"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Email Marketing Consent */}
            <div className="flex items-start space-x-3">
              <input
                id="emailMarketing"
                type="checkbox"
                checked={emailMarketing}
                onChange={(e) => setEmailMarketing(e.target.checked)}
                className="mt-1 w-4 h-4 text-luxury-black border-luxury-black/20 focus:ring-luxury-black"
              />
              <label htmlFor="emailMarketing" className="font-sans text-sm text-luxury-black/80">
                I want to receive weekly selfie tips and updates from SELFIE AI™
              </label>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start space-x-3">
              <input
                id="agreedToTerms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-luxury-black border-luxury-black/20 focus:ring-luxury-black"
                required
              />
              <label htmlFor="agreedToTerms" className="font-sans text-sm text-luxury-black/80">
                I agree to the{' '}
                <Link href="/terms" className="underline underline-offset-4 hover:text-luxury-black">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="underline underline-offset-4 hover:text-luxury-black">
                  Privacy Policy
                </Link>
                *
              </label>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="text-red-600 text-sm font-sans">
                {error}
              </div>
            )}
            
            {success && (
              <div className="text-green-600 text-sm font-sans">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-luxury-black text-soft-white font-sans font-medium py-3 px-4 hover:bg-luxury-black/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors group"
            >
              <span className="flex items-center justify-center">
                {isLoading ? (
                  'Creating Account...'
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="font-sans text-luxury-black/70 hover:text-luxury-black underline underline-offset-4"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="font-sans text-luxury-black/70 hover:text-luxury-black underline underline-offset-4"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
