'use client'

import { useState, useEffect } from 'react'
import AdminNavigation from '@/components/admin/AdminNavigation'
import AgentAutoRunner from '@/components/admin/AgentAutoRunner'
import AdminAuthGuard from '@/components/admin/AdminAuthGuard'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarWidth, setSidebarWidth] = useState('280px')

  // Listen for changes to the sidebar width
  useEffect(() => {
    const handleStorageChange = () => {
      const isCollapsed = localStorage.getItem('admin-nav-collapsed')
      setSidebarWidth(isCollapsed === 'true' ? '80px' : '280px')
    }

    // Set initial width
    handleStorageChange()

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange)
    
    // Also listen for custom events (for same-tab updates)
    const handleCustomStorage = () => handleStorageChange()
    window.addEventListener('admin-nav-toggle', handleCustomStorage)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('admin-nav-toggle', handleCustomStorage)
    }
  }, [])

  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen bg-soft-white text-luxury-black">
        <AdminNavigation />
        <main className="flex-1">
          {children}
        </main>
        <AgentAutoRunner />
      </div>
    </AdminAuthGuard>
  )
} 