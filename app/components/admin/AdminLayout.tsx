'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Settings, 
  BarChart3, 
  MessageSquare, 
  Palette, 
  FileText, 
  Shield,
  LogOut,
  ChevronDown,
  Calendar,
  Camera,
  Bot,
  TestTube,
  Command,
  Activity,
  Zap
} from 'lucide-react'

interface AdminUser {
  id: string
  email: string
  full_name?: string
  role: string
  is_admin: boolean
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function getUser() {
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !authUser) {
          router.push('/admin/login')
          return
        }

        // Get user profile to check admin status
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', authUser.id)
          .single()

        if (profileError || !profile?.is_admin) {
          router.push('/admin/login')
          return
        }

        setUser({
          id: authUser.id,
          email: authUser.email!,
          full_name: profile.full_name,
          role: profile.role,
          is_admin: profile.is_admin
        })
      } catch (error) {
        console.error('Error checking admin access:', error)
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [router, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { 
      name: 'Content Management', 
      icon: FileText,
      children: [
        { name: 'Design Manual', href: '/admin/design-manual' },
        { name: 'Voice Guidelines', href: '/admin/voice-guidelines' },
        { name: 'Project Overview', href: '/admin/project-overview' },
      ]
    },
    {
      name: 'AI Agents',
      icon: Bot,
      children: [
        { name: 'Agent Hub', href: '/admin/agent-hub' },
        { name: 'Agent Chat', href: '/admin/agent-chat' },
        { name: 'Agent Activity', href: '/admin/agent-activity' },
      ]
    },
    {
      name: 'Tools & Testing',
      icon: TestTube,
      children: [
        { name: 'Testing Hub', href: '/admin/testing-hub' },
        { name: 'Command Center', href: '/admin/command-center' },
        { name: 'Tech Stack', href: '/admin/tech-stack' },
      ]
    },
    {
      name: 'Analytics',
      icon: BarChart3,
      children: [
        { name: 'Platform Analytics', href: '/admin/analytics' },
        { name: 'User Activity', href: '/admin/user-activity' },
        { name: 'Content Performance', href: '/admin/content-performance' },
      ]
    },
    {
      name: 'Platform Tools',
      icon: Zap,
      children: [
        { name: 'Content Calendar', href: '/admin/content-calendar' },
        { name: 'Automation', href: '/admin/automation' },
        { name: 'User Management', href: '/admin/users' },
      ]
    },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center">
        <div className="text-center">
          <div className="font-bodoni text-2xl text-[#171719] mb-4">SELFIE AI™</div>
          <div className="text-sm text-[#B5B5B3]">Loading admin panel...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#171719]/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#171719] transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-[#F1F1F1]/10">
            <div className="font-bodoni text-xl text-[#F1F1F1] tracking-[-0.02em]">
              SELFIE AI™
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-[#F1F1F1] hover:text-[#B5B5B3]"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <div className="space-y-1">
                    <div className="flex items-center px-3 py-2 text-[#B5B5B3] text-sm font-medium">
                      <item.icon size={16} className="mr-3" />
                      {item.name}
                    </div>
                    <div className="ml-6 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-3 py-2 text-sm rounded-none transition-colors ${
                            pathname === child.href
                              ? 'bg-[#F1F1F1]/10 text-[#F1F1F1]'
                              : 'text-[#B5B5B3] hover:text-[#F1F1F1] hover:bg-[#F1F1F1]/5'
                          }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-none transition-colors ${
                      pathname === item.href
                        ? 'bg-[#F1F1F1]/10 text-[#F1F1F1]'
                        : 'text-[#B5B5B3] hover:text-[#F1F1F1] hover:bg-[#F1F1F1]/5'
                    }`}
                  >
                    <item.icon size={16} className="mr-3" />
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* User info */}
          <div className="border-t border-[#F1F1F1]/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#F1F1F1]/10 flex items-center justify-center text-[#F1F1F1] text-sm font-medium">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-medium text-[#F1F1F1]">
                    {user?.full_name || 'Admin'}
                  </div>
                  <div className="text-xs text-[#B5B5B3]">{user?.role}</div>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="text-[#B5B5B3] hover:text-[#F1F1F1] transition-colors"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-72">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-[#F1F1F1] border-b border-[#171719]/10">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-[#171719] hover:text-[#B5B5B3]"
            >
              <Menu size={20} />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-[#B5B5B3]">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
