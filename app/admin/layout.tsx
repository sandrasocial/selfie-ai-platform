import AdminNavigation from '@/components/admin/AdminNavigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-soft-white">
      <AdminNavigation />
      <main className="lg:ml-[280px] min-h-screen">
        {children}
      </main>
    </div>
  )
} 