import { AgentActivityDashboard } from '@/components/admin/AgentActivityDashboard'

export default function AgentActivityPage() {
  return (
    <div className="min-h-screen bg-soft-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-bodoni text-4xl mb-2">Agent Activity Monitor</h1>
          <p className="text-warm-gray">
            Track agent productivity, code changes, and project progress
          </p>
        </div>
        
        <AgentActivityDashboard />
      </div>
    </div>
  )
} 