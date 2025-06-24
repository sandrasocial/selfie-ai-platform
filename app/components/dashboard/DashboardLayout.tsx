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
  title = "Dashboard",
  subtitle,
  className = "",
  userId
}: DashboardLayoutProps) {
  return (
    <>
      <Navigation />
      
      <div className={`min-h-screen bg-luxury-black pt-20 ${className}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-24 py-16">
          
          {/* Header */}
          {(title || subtitle) && (
            <div className="text-center mb-16">
              <h1 className="font-bodoni text-5xl md:text-7xl text-soft-white mb-6">
                {title}
              </h1>
              {subtitle && (
                <p className="font-inter text-lg text-soft-white/80 max-w-2xl mx-auto">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Main Content */}
          <div className="space-y-8">
            {children}
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  )
}

export default DashboardLayout