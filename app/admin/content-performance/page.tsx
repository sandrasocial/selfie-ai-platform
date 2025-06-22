'use client'

import { useState } from 'react'
import { 
  FileText, 
  Eye, 
  Download, 
  Star, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Users,
  MessageSquare,
  Play,
  BookOpen,
  Image
} from 'lucide-react'
import AdminLayout from '@/app/components/admin/AdminLayout'

export default function ContentPerformance() {
  const [timeRange, setTimeRange] = useState('7d')
  const [contentType, setContentType] = useState('all')

  const contentMetrics = [
    {
      title: "Course Completions",
      value: "89%",
      change: "+5.2%",
      trend: "up",
      period: "this week"
    },
    {
      title: "Workbook Downloads",
      value: "1,247",
      change: "+12.8%",
      trend: "up",
      period: "this week"
    },
    {
      title: "Average Rating",
      value: "4.8",
      change: "+0.2",
      trend: "up",
      period: "vs last week"
    },
    {
      title: "Content Engagement",
      value: "73%",
      change: "-2.1%",
      trend: "down",
      period: "this week"
    }
  ]

  const topContent = [
    {
      id: 1,
      title: "Selfie Starter Kit Course",
      type: "course",
      views: 2847,
      completions: 2134,
      rating: 4.9,
      engagement: 89,
      change: "+15.2%"
    },
    {
      id: 2,
      title: "Personalized Brand Workbook",
      type: "workbook",
      views: 1923,
      completions: 1456,
      rating: 4.7,
      engagement: 76,
      change: "+8.7%"
    },
    {
      id: 3,
      title: "Sandra AI Chat Experience",
      type: "ai",
      views: 1567,
      completions: 1234,
      rating: 4.8,
      engagement: 82,
      change: "+12.3%"
    },
    {
      id: 4,
      title: "Studio Lighting Calculator",
      type: "tool",
      views: 892,
      completions: 634,
      rating: 4.6,
      engagement: 71,
      change: "+5.4%"
    },
    {
      id: 5,
      title: "Brand Onboarding Flow",
      type: "onboarding",
      views: 756,
      completions: 623,
      rating: 4.5,
      engagement: 78,
      change: "+3.2%"
    }
  ]

  const recentFeedback = [
    {
      user: "Sarah M.",
      content: "Selfie Starter Kit Course",
      rating: 5,
      comment: "This course completely transformed how I approach selfie photography!",
      timestamp: "2 hours ago"
    },
    {
      user: "Jessica L.",
      content: "Personalized Brand Workbook",
      rating: 5,
      comment: "The personalization is incredible - it feels like it was made just for me.",
      timestamp: "4 hours ago"
    },
    {
      user: "Emma K.",
      content: "Sandra AI Chat",
      rating: 4,
      comment: "Sandra gives amazing advice, though sometimes responses feel a bit long.",
      timestamp: "6 hours ago"
    },
    {
      user: "Rachel D.",
      content: "Studio Tools",
      rating: 5,
      comment: "The lighting calculator saved me so much time during my photo shoots.",
      timestamp: "8 hours ago"
    }
  ]

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="w-4 h-4" />
      case 'workbook':
        return <FileText className="w-4 h-4" />
      case 'ai':
        return <MessageSquare className="w-4 h-4" />
      case 'tool':
        return <Image className="w-4 h-4" />
      case 'onboarding':
        return <Users className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getContentBadge = (type: string) => {
    const colors = {
      course: 'bg-blue-100 text-blue-800',
      workbook: 'bg-green-100 text-green-800',
      ai: 'bg-purple-100 text-purple-800',
      tool: 'bg-orange-100 text-orange-800',
      onboarding: 'bg-pink-100 text-pink-800'
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {type.toUpperCase()}
      </span>
    )
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ))
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bodoni text-[#171719] mb-2">Content Performance</h1>
            <p className="text-[#B5B5B3]">See what content's hitting and what's not</p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-[#B5B5B3]/20 focus:border-[#171719] outline-none"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-[#171719] text-white hover:bg-[#171719]/90 transition-colors">
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>

        {/* Content Type Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {[
            { id: 'all', name: 'All Content' },
            { id: 'course', name: 'Courses' },
            { id: 'workbook', name: 'Workbooks' },
            { id: 'ai', name: 'AI Interactions' },
            { id: 'tool', name: 'Tools' }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setContentType(type.id)}
              className={`px-4 py-2 whitespace-nowrap transition-colors ${
                contentType === type.id
                  ? 'bg-[#171719] text-white'
                  : 'bg-white border border-[#B5B5B3]/20 text-[#171719] hover:bg-[#171719]/5'
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {contentMetrics.map((metric, index) => (
            <div key={index} className="bg-white p-6 border border-[#B5B5B3]/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-[#B5B5B3]">{metric.title}</h3>
                <div className={`flex items-center gap-1 text-sm ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {metric.change}
                </div>
              </div>
              <div className="text-3xl font-bodoni text-[#171719] mb-1">{metric.value}</div>
              <div className="text-xs text-[#B5B5B3]">{metric.period}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Performing Content */}
          <div className="bg-white border border-[#B5B5B3]/20">
            <div className="p-6 border-b border-[#B5B5B3]/20">
              <h3 className="text-xl font-bodoni text-[#171719]">Top Performing Content</h3>
            </div>
            <div className="divide-y divide-[#B5B5B3]/20">
              {topContent.map((content) => (
                <div key={content.id} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getContentIcon(content.type)}
                      <div>
                        <h4 className="font-medium text-[#171719]">{content.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {getContentBadge(content.type)}
                          <div className="flex items-center gap-1">
                            {renderStars(Math.floor(content.rating))}
                            <span className="text-sm text-[#B5B5B3] ml-1">{content.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-green-600">{content.change}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-[#B5B5B3]">Views</div>
                      <div className="font-medium text-[#171719]">{content.views.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[#B5B5B3]">Completions</div>
                      <div className="font-medium text-[#171719]">{content.completions.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[#B5B5B3]">Engagement</div>
                      <div className="font-medium text-[#171719]">{content.engagement}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent User Feedback */}
          <div className="bg-white border border-[#B5B5B3]/20">
            <div className="p-6 border-b border-[#B5B5B3]/20">
              <h3 className="text-xl font-bodoni text-[#171719]">Recent Feedback</h3>
            </div>
            <div className="divide-y divide-[#B5B5B3]/20">
              {recentFeedback.map((feedback, index) => (
                <div key={index} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-medium text-[#171719]">{feedback.user}</div>
                      <div className="text-sm text-[#B5B5B3]">{feedback.content}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {renderStars(feedback.rating)}
                      </div>
                      <span className="text-xs text-[#B5B5B3]">{feedback.timestamp}</span>
                    </div>
                  </div>
                  <p className="text-sm text-[#171719] italic">"{feedback.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Analytics Chart Placeholder */}
        <div className="mt-8 bg-white p-6 border border-[#B5B5B3]/20">
          <h3 className="text-xl font-bodoni text-[#171719] mb-4">Content Engagement Over Time</h3>
          <div className="h-64 bg-[#F1F1F1] flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-[#B5B5B3] mx-auto mb-2" />
              <p className="text-[#B5B5B3]">Interactive engagement chart coming soon</p>
              <p className="text-sm text-[#B5B5B3] mt-1">Track content performance trends over time</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
