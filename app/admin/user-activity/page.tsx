'use client'

import { useState } from 'react'
import { 
  Activity, 
  Users, 
  MessageSquare, 
  Eye, 
  Clock, 
  TrendingUp,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'
import AdminLayout from '@/app/components/admin/AdminLayout'

export default function UserActivity() {
  const [timeFilter, setTimeFilter] = useState('24h')
  const [activityFilter, setActivityFilter] = useState('all')
  const [loading, setLoading] = useState(false)

  const activities = [
    {
      id: 1,
      user: 'Sarah M.',
      email: 'sarah.m@email.com',
      action: 'Started Selfie Starter Kit Course',
      timestamp: '2 minutes ago',
      type: 'course',
      details: 'Module 1: Foundation Basics'
    },
    {
      id: 2,
      user: 'Jessica L.',
      email: 'jessica.l@email.com',
      action: 'Generated Personalized Workbook',
      timestamp: '5 minutes ago',
      type: 'content',
      details: 'Brand Style: Coastal Elegance'
    },
    {
      id: 3,
      user: 'Emma K.',
      email: 'emma.k@email.com',
      action: 'Chat with Sandra AI',
      timestamp: '8 minutes ago',
      type: 'ai',
      details: 'Photography tips discussion'
    },
    {
      id: 4,
      user: 'Rachel D.',
      email: 'rachel.d@email.com',
      action: 'Completed Onboarding',
      timestamp: '12 minutes ago',
      type: 'profile',
      details: 'Brand profile 85% complete'
    },
    {
      id: 5,
      user: 'Amy S.',
      email: 'amy.s@email.com',
      action: 'Downloaded Course Materials',
      timestamp: '15 minutes ago',
      type: 'download',
      details: 'Starter Kit PDF resources'
    },
    {
      id: 6,
      user: 'Lisa W.',
      email: 'lisa.w@email.com',
      action: 'Updated Profile Settings',
      timestamp: '18 minutes ago',
      type: 'profile',
      details: 'Changed aesthetic preferences'
    },
    {
      id: 7,
      user: 'Maria G.',
      email: 'maria.g@email.com',
      action: 'Shared Course Progress',
      timestamp: '22 minutes ago',
      type: 'social',
      details: 'Completed 3 out of 5 modules'
    },
    {
      id: 8,
      user: 'Jennifer H.',
      email: 'jennifer.h@email.com',
      action: 'Used Studio Tools',
      timestamp: '25 minutes ago',
      type: 'tools',
      details: 'Lighting calculator accessed'
    }
  ]

  const stats = [
    { label: 'Active Users (24h)', value: '234', change: '+12%', icon: Users },
    { label: 'Course Interactions', value: '89', change: '+8%', icon: Eye },
    { label: 'AI Conversations', value: '156', change: '+23%', icon: MessageSquare },
    { label: 'Avg. Session Time', value: '12m', change: '+5%', icon: Clock }
  ]

  const getActivityIcon = (type: string) => {
    const iconProps = { size: 16, className: "text-white" }
    
    switch (type) {
      case 'course':
        return <Eye {...iconProps} />
      case 'content':
        return <Download {...iconProps} />
      case 'ai':
        return <MessageSquare {...iconProps} />
      case 'profile':
        return <Users {...iconProps} />
      case 'tools':
        return <Activity {...iconProps} />
      default:
        return <Activity {...iconProps} />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'course':
        return 'bg-blue-500'
      case 'content':
        return 'bg-green-500'
      case 'ai':
        return 'bg-purple-500'
      case 'profile':
        return 'bg-orange-500'
      case 'tools':
        return 'bg-pink-500'
      case 'social':
        return 'bg-indigo-500'
      default:
        return 'bg-gray-500'
    }
  }

  const filteredActivities = activities.filter(activity => 
    activityFilter === 'all' || activity.type === activityFilter
  )

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bodoni text-[#171719] mb-2">User Activity</h1>
            <p className="text-[#B5B5B3]">See what everyone's up to right now</p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <button
              onClick={() => setLoading(true)}
              className="flex items-center gap-2 px-4 py-2 border border-[#B5B5B3]/20 hover:bg-[#F1F1F1] transition-colors"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-[#171719] text-white hover:bg-[#171719]/90 transition-colors">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 border border-[#B5B5B3]/20">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="w-5 h-5 text-[#B5B5B3]" />
                <span className="text-sm text-green-600">{stat.change}</span>
              </div>
              <div className="text-3xl font-bodoni text-[#171719] mb-1">{stat.value}</div>
              <div className="text-sm text-[#B5B5B3]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-4 py-2 border border-[#B5B5B3]/20 focus:border-[#171719] outline-none"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          
          <select
            value={activityFilter}
            onChange={(e) => setActivityFilter(e.target.value)}
            className="px-4 py-2 border border-[#B5B5B3]/20 focus:border-[#171719] outline-none"
          >
            <option value="all">All Activities</option>
            <option value="course">Course Activity</option>
            <option value="content">Content Generation</option>
            <option value="ai">AI Interactions</option>
            <option value="profile">Profile Updates</option>
            <option value="tools">Tool Usage</option>
            <option value="social">Social Actions</option>
          </select>
        </div>

        {/* Activity Feed */}
        <div className="bg-white border border-[#B5B5B3]/20">
          <div className="p-6 border-b border-[#B5B5B3]/20">
            <h3 className="text-xl font-bodoni text-[#171719]">Recent Activity</h3>
          </div>
          
          <div className="divide-y divide-[#B5B5B3]/20">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-[#F1F1F1]/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-[#171719] font-medium">{activity.action}</h4>
                      <span className="text-sm text-[#B5B5B3] flex-shrink-0">{activity.timestamp}</span>
                    </div>
                    
                    <div className="text-sm text-[#B5B5B3] mb-1">
                      <span className="font-medium text-[#171719]">{activity.user}</span> • {activity.email}
                    </div>
                    
                    {activity.details && (
                      <div className="text-sm text-[#B5B5B3]">{activity.details}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredActivities.length === 0 && (
            <div className="p-12 text-center">
              <Activity className="w-12 h-12 text-[#B5B5B3] mx-auto mb-4" />
              <p className="text-[#B5B5B3]">No activities found for the selected filters</p>
            </div>
          )}
        </div>

        {/* Activity Summary */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Actions */}
          <div className="bg-white p-6 border border-[#B5B5B3]/20">
            <h3 className="text-xl font-bodoni text-[#171719] mb-4">Most Popular Actions</h3>
            <div className="space-y-3">
              {[
                { action: 'Course Progression', count: 89, percentage: 45 },
                { action: 'Sandra AI Chats', count: 67, percentage: 34 },
                { action: 'Workbook Generation', count: 54, percentage: 27 },
                { action: 'Profile Updates', count: 43, percentage: 22 },
                { action: 'Tool Usage', count: 32, percentage: 16 }
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#171719]">{item.action}</span>
                    <span className="text-sm text-[#B5B5B3]">{item.count}</span>
                  </div>
                  <div className="w-full bg-[#B5B5B3]/20 h-2">
                    <div 
                      className="bg-[#171719] h-2 transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Engagement */}
          <div className="bg-white p-6 border border-[#B5B5B3]/20">
            <h3 className="text-xl font-bodoni text-[#171719] mb-4">Engagement Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#B5B5B3]">Daily Active Users</span>
                <span className="text-[#171719] font-medium">234</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#B5B5B3]">Average Session Duration</span>
                <span className="text-[#171719] font-medium">12m 34s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#B5B5B3]">Course Completion Rate</span>
                <span className="text-[#171719] font-medium">68%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#B5B5B3]">AI Interaction Rate</span>
                <span className="text-[#171719] font-medium">45%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#B5B5B3]">Return User Rate</span>
                <span className="text-[#171719] font-medium">73%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
