import AdminLayout from '@/app/components/admin/AdminLayout'

export default function AdminPage() {
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-16">
          <h1 className="text-4xl font-bodoni text-[#171719] mb-4">Welcome to SELFIE AI™ Admin</h1>
          <p className="text-[#B5B5B3] mb-8">Your command center for managing the platform</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 border border-[#171719]/10">
              <h3 className="font-bodoni text-xl text-[#171719] mb-2">Content Management</h3>
              <p className="text-[#B5B5B3] text-sm">Manage design guidelines and content strategy</p>
            </div>
            <div className="bg-white p-6 border border-[#171719]/10">
              <h3 className="font-bodoni text-xl text-[#171719] mb-2">AI Agents</h3>
              <p className="text-[#B5B5B3] text-sm">Monitor and manage AI agent performance</p>
            </div>
            <div className="bg-white p-6 border border-[#171719]/10">
              <h3 className="font-bodoni text-xl text-[#171719] mb-2">Analytics</h3>
              <p className="text-[#B5B5B3] text-sm">Track platform performance and user engagement</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
} 