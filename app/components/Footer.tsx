'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source: 'footer' }),
      })

      if (response.ok) {
        setSubmitMessage('Check your email for your free guide.')
        setEmail('')
      } else {
        setSubmitMessage('Something went wrong. Try again?')
      }
    } catch (error) {
      setSubmitMessage('Something went wrong. Try again?')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <footer className="bg-[#171719] text-[#F1F1F1]">
      {/* Main Footer Content */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-24 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-5">
            <div className="font-bodoni text-2xl md:text-3xl tracking-[-0.02em] mb-6">
              SELFIE AI™
            </div>
            <p className="font-inter text-[#F1F1F1]/70 mb-8 leading-[1.6]">
              Your phone is all you need to build a brand that works. Join thousands of women who stopped waiting for perfect and started showing up as themselves.
            </p>
            
            {/* Newsletter Signup */}
            <form onSubmit={handleEmailSubmit} className="max-w-md">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-[#F1F1F1]/10 border border-[#F1F1F1]/20 text-[#F1F1F1] placeholder:text-[#F1F1F1]/50 focus:outline-none focus:border-[#F1F1F1]/40"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#F1F1F1] text-[#171719] font-inter text-[11px] uppercase tracking-[0.2em] hover:bg-[#F1F1F1]/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'SENDING...' : 'SUBSCRIBE'}
                </button>
              </div>
              {submitMessage && (
                <p className={`mt-3 text-sm ${
                  submitMessage.includes('Check') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {submitMessage}
                </p>
              )}
            </form>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Platform */}
            <div>
              <h3 className="font-inter text-[12px] uppercase tracking-[0.3em] text-[#F1F1F1] mb-4">
                Platform
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="font-inter text-sm text-[#F1F1F1]/70 hover:text-[#F1F1F1] transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="font-inter text-sm text-[#F1F1F1]/70 hover:text-[#F1F1F1] transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="font-inter text-sm text-[#F1F1F1]/70 hover:text-[#F1F1F1] transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/chat/sandra" className="font-inter text-sm text-[#F1F1F1]/70 hover:text-[#F1F1F1] transition-colors">
                    Sandra AI
                  </Link>
                </li>
              </ul>
            </div>

            {/* Tools */}
            <div>
              <h3 className="font-inter text-[12px] uppercase tracking-[0.3em] text-[#F1F1F1] mb-4">
                Tools
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/tools/photo-vault" className="font-inter text-sm text-[#F1F1F1]/70 hover:text-[#F1F1F1] transition-colors">
                    Photo Vault
                  </Link>
                </li>
                <li>
                  <Link href="/tools/photo-studio" className="font-inter text-sm text-[#F1F1F1]/70 hover:text-[#F1F1F1] transition-colors">
                    Photo Studio
                  </Link>
                </li>
                <li>
                  <Link href="/tools/content-calendar" className="font-inter text-sm text-[#F1F1F1]/70 hover:text-[#F1F1F1] transition-colors">
                    Content Calendar
                  </Link>
                </li>
                <li>
                  <Link href="/selfie-score" className="font-inter text-sm text-[#F1F1F1]/70 hover:text-[#F1F1F1] transition-colors">
                    Selfie Score
                  </Link>
                </li>
              </ul>
            </div>

            {/* Products */}
            <div>
              <h3 className="font-inter text-[12px] uppercase tracking-[0.3em] text-[#F1F1F1] mb-4">
                Products
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/freebie/selfie-guide" className="font-inter text-sm text-[#F1F1F1]/70 hover:text-[#F1F1F1] transition-colors">
                    Free Guide
                  </Link>
                </li>
                <li>
                  <Link href="/products/starter-kit" className="font-inter text-sm text-[#F1F1F1]/70 hover:text-[#F1F1F1] transition-colors">
                    Starter Kit
                  </Link>
                </li>
                <li>
                  <Link href="/products/branded-by-selfie" className="font-inter text-sm text-[#F1F1F1]/70 hover:text-[#F1F1F1] transition-colors">
                    Branded by SELFIE
                  </Link>
                </li>
                <li>
                  <Link href="/vip/apply" className="font-inter text-sm text-[#F1F1F1]/70 hover:text-[#F1F1F1] transition-colors">
                    VIP Program
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-inter text-[12px] uppercase tracking-[0.3em] text-[#F1F1F1] mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/contact" className="font-inter text-sm text-[#F1F1F1]/70 hover:text-[#F1F1F1] transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/stories" className="font-inter text-sm text-[#F1F1F1]/70 hover:text-[#F1F1F1] transition-colors">
                    Stories
                  </Link>
                </li>
                <li>
                  <Link href="/affiliates" className="font-inter text-sm text-[#F1F1F1]/70 hover:text-[#F1F1F1] transition-colors">
                    Affiliates
                  </Link>
                </li>
                <li>
                  <Link href="/admin/login" className="font-inter text-sm text-[#F1F1F1]/70 hover:text-[#F1F1F1] transition-colors">
                    Admin Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#F1F1F1]/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-24 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="font-inter text-xs text-[#F1F1F1]/50">
                © 2025 SELFIE AI™. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                <Link href="/privacy" className="font-inter text-xs text-[#F1F1F1]/50 hover:text-[#F1F1F1]/70 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="font-inter text-xs text-[#F1F1F1]/50 hover:text-[#F1F1F1]/70 transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <p className="font-inter text-xs text-[#F1F1F1]/50">
                Built with authenticity in Norway
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
