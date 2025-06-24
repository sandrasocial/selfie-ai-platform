'use client'

import React from 'react'
import { Navigation, Footer } from '@/components/global'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  className?: string
  userId?: string
}

export function DashboardLayout({
  children,
  title = 'Dashboard',
  subtitle,
  className = '',
  userId,
}: DashboardLayoutProps) {
  return (
    <>
      <Navigation />

      <div className={`min-h-screen bg-luxury-black pt-20 ${className}`}>
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-24">
          {/* Header */}
          {(title || subtitle) && (
            <div className="mb-16 text-center">
              <h1 className="mb-6 font-bodoni text-5xl text-soft-white md:text-7xl">{title}</h1>
              {subtitle && (
                <p className="mx-auto max-w-2xl font-inter text-lg text-soft-white/80">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Main Content */}
          <div className="space-y-8">{children}</div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default DashboardLayout
