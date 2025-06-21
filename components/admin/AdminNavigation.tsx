'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import {
  LayoutDashboard,
  Target,
  Users,
  Palette,
  MessageSquare,
  FileText,
  Code2,
  TestTube,
  Workflow,
  Calendar,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Plus,
  Eye,
  Settings,
  LogOut
} from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface NavSection {
  title: string
  items: NavItem[]
}

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navigationSections: NavSection[] = [
  {
    title: 'OPERATIONS',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Command Center', href: '/admin/command-center', icon: Target },
      { label: 'Agent Hub', href: '/admin/agent-hub', icon: Users }
    ]
  },
  {
    title: 'RESOURCES',
    items: [
      { label: 'Design Manual', href: '/admin/design-manual', icon: Palette },
      { label: 'Voice Guidelines', href: '/admin/voice-guidelines', icon: MessageSquare },
      { label: 'Project Overview', href: '/admin/project-overview', icon: FileText }
    ]
  },
  {
    title: 'TECHNICAL',
    items: [
      { label: 'Tech Stack', href: '/admin/tech-stack', icon: Code2 },
      { label: 'Testing Hub', href: '/admin/testing-hub', icon: TestTube },
      { label: 'Automation', href: '/admin/automation', icon: Workflow }
    ]
  },
  {
    title: 'CONTENT',
    items: [
      { label: 'Content Calendar', href: '/admin/content-calendar', icon: Calendar }
    ]
  }
]

interface AdminNavigationProps {
  className?: string
}

export default function AdminNavigation({ className = '' }: AdminNavigationProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [collapsedSections, setCollapsedSections] = useState<string[]>([])
  const [readyTaskCount, setReadyTaskCount] = useState(0)

  // Fetch ready task count
  useEffect(() => {
    fetchReadyTaskCount()
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('ready_tasks_nav')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'admin_tasks', filter: 'ready_for_review=eq.true' }, 
        () => {
          fetchReadyTaskCount()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchReadyTaskCount = async () => {
    try {
      const { count, error } = await supabase
        .from('admin_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('ready_for_review', true)

      if (!error && count !== null) {
        setReadyTaskCount(count)
      }
    } catch (error) {
      console.error('Error fetching ready task count:', error)
    }
  }

  const toggleSection = (sectionTitle: string) => {
    setCollapsedSections(prev => 
      prev.includes(sectionTitle)
        ? prev.filter(s => s !== sectionTitle)
        : [...prev, sectionTitle]
    )
  }

  const isActive = (href: string) => {
    return pathname === href
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 bg-luxury-black text-soft-white lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Navigation Sidebar */}
      <nav
        className={`
          fixed top-0 left-0 h-full w-[280px] bg-luxury-black text-soft-white z-50
          transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          ${className}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-soft-white/10">
            <div className="flex items-center justify-between">
              <Link href="/admin/dashboard" className="block">
                <h1 className="text-2xl font-bodoni">SELFIE AI™</h1>
                <p className="text-sm text-warm-gray mt-1">Admin</p>
              </Link>
              <button
                onClick={closeMobileMenu}
                className="p-1 text-soft-white/60 hover:text-soft-white lg:hidden"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="flex-1 overflow-y-auto py-6 nav-scroll">
            {navigationSections.map((section) => (
              <div key={section.title} className="mb-6">
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full px-6 py-2 flex items-center justify-between text-warm-gray hover:text-soft-white transition-colors"
                >
                  <span className="text-xs tracking-wider">{section.title}</span>
                  {collapsedSections.includes(section.title) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronUp className="w-4 h-4" />
                  )}
                </button>
                
                <div className={`section-collapse ${collapsedSections.includes(section.title) ? 'collapsed' : 'expanded'}`}>
                  <div className="mt-1">
                    {section.items.map((item) => {
                      const Icon = item.icon
                      const active = isActive(item.href)
                      
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMobileMenu}
                          className={`
                            relative flex items-center gap-3 px-6 py-3 text-sm
                            transition-all duration-200
                            ${active 
                              ? 'text-luxury-black bg-soft-white' 
                              : 'text-soft-white/80 hover:text-soft-white hover:bg-soft-white/5'
                            }
                          `}
                        >
                          {active && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-luxury-black active-indicator" />
                          )}
                          <Icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="border-t border-soft-white/10 p-6">
            <h3 className="text-xs tracking-wider text-warm-gray mb-4">QUICK ACTIONS</h3>
            <div className="space-y-2">
              <Link
                href="/admin/agent-hub"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 bg-soft-white/10 hover:bg-soft-white/20 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Create New Task</span>
              </Link>
              
              <Link
                href="/admin/agent-hub"
                onClick={closeMobileMenu}
                className="flex items-center justify-between px-4 py-3 bg-soft-white/10 hover:bg-soft-white/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">View Ready Tasks</span>
                </div>
                {readyTaskCount > 0 && (
                  <span className="bg-soft-white text-luxury-black text-xs px-2 py-1 font-medium">
                    {readyTaskCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* User Section */}
          <div className="border-t border-soft-white/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-warm-gray/20 flex items-center justify-center">
                <span className="text-lg font-bodoni">S</span>
              </div>
              <div>
                <p className="text-sm font-medium">Sandra</p>
                <p className="text-xs text-warm-gray">Founder</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <Link
                href="/admin/settings"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-3 py-2 text-sm text-soft-white/80 hover:text-soft-white hover:bg-soft-white/5 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
              
              <button
                onClick={() => {
                  // Handle sign out
                  closeMobileMenu()
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-soft-white/80 hover:text-soft-white hover:bg-soft-white/5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <style jsx>{`
        /* Smooth scroll for navigation sections */
        .nav-scroll {
          scrollbar-width: thin;
          scrollbar-color: #B5B5B3 transparent;
        }

        .nav-scroll::-webkit-scrollbar {
          width: 4px;
        }

        .nav-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .nav-scroll::-webkit-scrollbar-thumb {
          background-color: #B5B5B3;
          border-radius: 0;
        }

        .nav-scroll::-webkit-scrollbar-thumb:hover {
          background-color: #F1F1F1;
        }

        /* Smooth transitions for collapsible sections */
        .section-collapse {
          overflow: hidden;
          transition: max-height 0.3s ease-in-out;
        }

        .section-collapse.collapsed {
          max-height: 0;
        }

        .section-collapse.expanded {
          max-height: 500px;
        }

        /* Active page indicator animation */
        .active-indicator {
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        /* Mobile menu slide animation */
        .mobile-menu-enter {
          animation: slideFromLeft 0.3s ease-out;
        }

        .mobile-menu-exit {
          animation: slideToLeft 0.3s ease-out;
        }

        @keyframes slideFromLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes slideToLeft {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </>
  )
} 