'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to admin dashboard
    router.replace('/admin/dashboard')
  }, [router])

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center">
      <div className="text-center">
        <div className="font-bodoni text-2xl text-[#171719] mb-4">SELFIE AI™</div>
        <div className="text-sm text-[#B5B5B3]">Redirecting to admin dashboard...</div>
      </div>
    </div>
  )
} 