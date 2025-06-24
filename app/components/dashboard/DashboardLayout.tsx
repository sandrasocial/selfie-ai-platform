'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface DashboardLayoutProps {
  children: ReactNode
  userId?: string
  showSidebar?: boolean
  title?: string
  subtitle?: string
  actions?: ReactNode
}

export function DashboardLayout({ 
  children, 
  userId,
  showSidebar = true, 
  title,
  subtitle,
  actions
}: DashboardLayoutProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-soft-white">
      {/* Header */}
      <header className="border-b border-warm-gray/20 bg-soft-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-luxury-black hover:text-warm-gray transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </button>
              
              {title && (
                <div>
                  <h1 className="text-xl font-serif text-luxury-black">{title}</h1>
                  {subtitle && (
                    <p className="text-sm text-warm-gray">{subtitle}</p>
                  )}
                </div>
              )}
            </div>
            
            {actions && (
              <div className="flex items-center space-x-4">
                {actions}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {showSidebar && (
          <aside className="w-64 min-h-screen bg-soft-white border-r border-warm-gray/20">
            <div className="p-6">
              <nav className="space-y-2">
                <SidebarLink href="/dashboard" label="Dashboard" icon="📊" />
                <SidebarLink href="/dashboard/content" label="Content" icon="📝" />
                <SidebarLink href="/dashboard/analytics" label="Analytics" icon="📈" />
                <SidebarLink href="/dashboard/brand" label="Brand Hub" icon="✨" />
                <SidebarLink href="/dashboard/automations" label="Automations" icon="⚡" />
                <SidebarLink href="/dashboard/settings" label="Settings" icon="⚙️" />
              </nav>
            </div>
          </aside>
        )}

        {/* Main content */}
        <main className={`flex-1 ${showSidebar ? 'ml-0' : ''}`}>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

interface SidebarLinkProps {
  href: string
  label: string
  icon: string
  active?: boolean
}

function SidebarLink({ href, label, icon, active = false }: SidebarLinkProps) {
  const router = useRouter()
  
  const handleClick = () => {
    router.push(href)
  }

  return (
    <button
      onClick={handleClick}
      className={`
        w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors
        ${active 
          ? 'bg-luxury-black text-soft-white' 
          : 'text-warm-gray hover:bg-warm-gray/10 hover:text-luxury-black'
        }
      `}
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  )
}
