'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, ArrowRight, Eye, EyeOff, Lock } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

function ResetPasswordContent() {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [mode, setMode] = useState<'request' | 'reset'>('request')
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // Check if this is a password reset callback
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')
    const type = hashParams.get('type')

    if (type === 'recovery' && accessToken) {
      setMode('reset')
    }
  }, [])

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    console.log('🔄 Requesting password reset for:', email)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      console.log('🔄 Password reset response:', { error: error?.message })

      if (error) {
        console.error('🔄 Password reset error:', error.message)
        throw error
      }

      console.log('✅ Password reset email sent')
      setSuccess('Password reset email sent! Check your inbox.')
    } catch (error) {
      console.error('🔄 Password reset catch error:', (error as Error).message)
      setError(`Password reset failed: ${(error as Error).message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      setSuccess('Password updated successfully!')
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-soft-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl text-luxury-black mb-2">
            {mode === 'request' ? 'Reset Password' : 'Create New Password'}
          </h1>
          <p className="font-sans text-luxury-black/70">
            {mode === 'request' 
              ? 'Enter your email to receive password reset instructions'
              : 'Enter your new password below'
            }
          </p>
        </div>

        {/* Reset Form */}
        <div className="bg-white p-8 border border-luxury-black/10">
          {mode === 'request' ? (
            <form onSubmit={handleRequestReset} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block font-sans text-sm font-medium text-luxury-black mb-2">
                  Email Address
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
                    'Sending Reset Email...'
                  ) : (
                    <>
                      Send Reset Email
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordReset} className="space-y-6">
              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block font-sans text-sm font-medium text-luxury-black mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-black/50 w-5 h-5" />
                  <input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 border border-luxury-black/20 text-luxury-black placeholder-luxury-black/50 focus:outline-none focus:border-luxury-black"
                    placeholder="Enter new password"
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
                  Confirm New Password
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
                    placeholder="Confirm new password"
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
                    'Updating Password...'
                  ) : (
                    <>
                      Update Password
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </form>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="font-sans text-luxury-black/70 hover:text-luxury-black underline underline-offset-4"
            >
              Back to Sign In
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
