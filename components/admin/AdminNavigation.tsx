'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Plus,
  Eye,
  Settings,
  LogOut,
  MessageCircle,
  Activity
} from 'lucide-react'

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
      { label: 'Agent Hub', href: '/admin/agent-hub', icon: Users },
      { label: 'Agent Chat', href: '/admin/agent-chat', icon: MessageCircle },
      { label: 'Agent Activity', href: '/admin/agent-activity', icon: Activity }
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
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Load collapsed state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('admin-nav-collapsed')
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState))
    }
  }, [])

  // Save collapsed state to localStorage
  const toggleCollapsed = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('admin-nav-collapsed', JSON.stringify(newState))
    
    // Dispatch custom event for layout to listen to
    window.dispatchEvent(new CustomEvent('admin-nav-toggle'))
  }

  // Fetch ready task count
  useEffect(() => {
    fetchReadyTaskCount()
    
    // Set up polling instead of real-time subscription
    const interval = setInterval(fetchReadyTaskCount, 30000) // Poll every 30 seconds

    return () => {
      clearInterval(interval)
    }
  }, [])

  const fetchReadyTaskCount = async () => {
    try {
      const response = await fetch('/api/admin/tasks?status=ready_for_preview')
      if (response.ok) {
        const tasks = await response.json()
        setReadyTaskCount(tasks.length)
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

  const sidebarWidth = isCollapsed ? '80px' : '280px'

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
          fixed top-0 left-0 h-full bg-luxury-black text-soft-white z-50
          transition-all duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          ${className}
        `}
        style={{ width: sidebarWidth }}
      >
        <div className="flex flex-col h-full relative">
          {/* Collapse/Expand Toggle Button */}
          <button
            onClick={toggleCollapsed}
            className="absolute -right-3 top-8 bg-luxury-black text-soft-white p-1 hover:bg-warm-gray transition-colors rounded-full border border-soft-white/20 hidden lg:flex items-center justify-center"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          {/* Header */}
          <div className="p-6 border-b border-soft-white/10">
            <div className="flex items-center justify-between">
              <Link href="/admin/dashboard" className="block">
                <h1 className={`font-bodoni transition-all duration-300 ${isCollapsed ? 'text-xl' : 'text-2xl'}`}>
                  {isCollapsed ? 'S' : 'SELFIE AI™'}
                </h1>
                {!isCollapsed && (
                  <p className="text-sm text-warm-gray mt-1">Admin</p>
                )}
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
                {!isCollapsed && (
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
                )}
                
                {!isCollapsed && (
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
                )}

                {/* Collapsed state - show only icons */}
                {isCollapsed && (
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
                            relative flex items-center justify-center px-3 py-3 text-sm
                            transition-all duration-200 group
                            ${active 
                              ? 'text-luxury-black bg-soft-white' 
                              : 'text-soft-white/80 hover:text-soft-white hover:bg-soft-white/5'
                            }
                          `}
                          title={item.label}
                        >
                          {active && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-luxury-black active-indicator" />
                          )}
                          <Icon className="w-5 h-5" />
                          
                          {/* Tooltip for collapsed state */}
                          <div className="absolute left-full ml-2 px-2 py-1 bg-luxury-black text-soft-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                            {item.label}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="border-t border-soft-white/10 p-6">
            {!isCollapsed && (
              <h3 className="text-xs tracking-wider text-warm-gray mb-4">QUICK ACTIONS</h3>
            )}
            <div className={`space-y-2 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
              <Link
                href="/admin/agent-hub"
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 px-4 py-3 bg-soft-white/10 hover:bg-soft-white/20 transition-colors ${
                  isCollapsed ? 'justify-center w-12 h-12 rounded' : ''
                }`}
                title={isCollapsed ? 'Create New Task' : undefined}
              >
                <Plus className="w-4 h-4" />
                {!isCollapsed && <span className="text-sm">Create New Task</span>}
              </Link>
              
              <Link
                href="/admin/agent-hub"
                onClick={closeMobileMenu}
                className={`flex items-center justify-between px-4 py-3 bg-soft-white/10 hover:bg-soft-white/20 transition-colors ${
                  isCollapsed ? 'justify-center w-12 h-12 rounded relative' : ''
                }`}
                title={isCollapsed ? 'View Ready Tasks' : undefined}
              >
                <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                  <Eye className="w-4 h-4" />
                  {!isCollapsed && <span className="text-sm">View Ready Tasks</span>}
                </div>
                {readyTaskCount > 0 && (
                  <span className={`bg-soft-white text-luxury-black text-xs px-2 py-1 font-medium ${
                    isCollapsed ? 'absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center' : ''
                  }`}>
                    {isCollapsed ? readyTaskCount : readyTaskCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* User Section */}
          <div className="border-t border-soft-white/10 p-6">
            {!isCollapsed ? (
              <>
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
              </>
            ) : (
              // Collapsed user section - just avatar
              <div className="flex justify-center">
                <div className="w-10 h-10 bg-warm-gray/20 flex items-center justify-center rounded-full">
                  <span className="text-lg font-bodoni">S</span>
                </div>
              </div>
            )}
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