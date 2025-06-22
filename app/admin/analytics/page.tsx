'use client'

import { useState } from 'react'
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  Eye, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Download,
  Filter
} from 'lucide-react'
import AdminLayout from '@/app/components/admin/AdminLayout'

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('overview')

  const metrics = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'revenue', name: 'Revenue', icon: DollarSign },
    { id: 'content', name: 'Content', icon: Eye }
  ]

  const stats = [
    {
      title: "Total Users",
      value: "2,847",
      change: "+12.5%",
      trend: "up",
      period: "vs last month"
    },
    {
      title: "Active Users",
      value: "1,249",
      change: "+8.2%",
      trend: "up",
      period: "this month"
    },
    {
      title: "Revenue",
      value: "$24,567",
      change: "+23.1%",
      trend: "up",
      period: "this month"
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "-0.8%",
      trend: "down",
      period: "vs last month"
    }
  ]

  const topPages = [
    { page: "/", views: 12847, change: "+5.2%" },
    { page: "/learn/starter-kit", views: 8923, change: "+12.1%" },
    { page: "/chat/sandra", views: 6751, change: "+8.7%" },
    { page: "/studio", views: 4892, change: "+3.4%" },
    { page: "/dashboard", views: 3264, change: "+15.2%" }
  ]

  const userActivity = [
    { action: "Course Started", count: 234, percentage: 45 },
    { action: "Workbook Generated", count: 187, percentage: 36 },
    { action: "Sandra AI Chat", count: 156, percentage: 30 },
    { action: "Profile Completed", count: 98, percentage: 19 },
    { action: "Premium Upgrade", count: 43, percentage: 8 }
  ]

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bodoni text-[#171719] mb-2">Platform Analytics</h1>
            <p className="text-[#B5B5B3]">See how your platform's doing and what's working</p>
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
              Export
            </button>
          </div>
        </div>

        {/* Metric Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {metrics.map((metric) => (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id)}
              className={`flex items-center gap-2 px-4 py-2 whitespace-nowrap transition-colors ${
                selectedMetric === metric.id
                  ? 'bg-[#171719] text-white'
                  : 'bg-white border border-[#B5B5B3]/20 text-[#171719] hover:bg-[#171719]/5'
              }`}
            >
              <metric.icon size={16} />
              {metric.name}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 border border-[#B5B5B3]/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-[#B5B5B3]">{stat.title}</h3>
                <div className={`flex items-center gap-1 text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {stat.change}
                </div>
              </div>
              <div className="text-3xl font-bodoni text-[#171719] mb-1">{stat.value}</div>
              <div className="text-xs text-[#B5B5B3]">{stat.period}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart Placeholder */}
          <div className="bg-white p-6 border border-[#B5B5B3]/20">
            <h3 className="text-xl font-bodoni text-[#171719] mb-4">User Growth</h3>
            <div className="h-64 bg-[#F1F1F1] flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-[#B5B5B3] mx-auto mb-2" />
                <p className="text-[#B5B5B3]">Chart visualization coming soon</p>
              </div>
            </div>
          </div>

          {/* Top Pages */}
          <div className="bg-white p-6 border border-[#B5B5B3]/20">
            <h3 className="text-xl font-bodoni text-[#171719] mb-4">Top Pages</h3>
            <div className="space-y-3">
              {topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-[#B5B5B3]/10">
                  <div>
                    <div className="font-medium text-[#171719]">{page.page}</div>
                    <div className="text-sm text-[#B5B5B3]">{page.views.toLocaleString()} views</div>
                  </div>
                  <div className="text-sm text-green-600">{page.change}</div>
                </div>
              ))}
            </div>
          </div>

          {/* User Activity */}
          <div className="bg-white p-6 border border-[#B5B5B3]/20">
            <h3 className="text-xl font-bodoni text-[#171719] mb-4">User Activity</h3>
            <div className="space-y-4">
              {userActivity.map((activity, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#171719]">{activity.action}</span>
                    <span className="text-sm text-[#B5B5B3]">{activity.count}</span>
                  </div>
                  <div className="w-full bg-[#B5B5B3]/20 h-2">
                    <div 
                      className="bg-[#171719] h-2 transition-all duration-500"
                      style={{ width: `${activity.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Chart Placeholder */}
          <div className="bg-white p-6 border border-[#B5B5B3]/20">
            <h3 className="text-xl font-bodoni text-[#171719] mb-4">Revenue Breakdown</h3>
            <div className="h-64 bg-[#F1F1F1] flex items-center justify-center">
              <div className="text-center">
                <DollarSign className="w-12 h-12 text-[#B5B5B3] mx-auto mb-2" />
                <p className="text-[#B5B5B3]">Revenue chart coming soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="mt-8 bg-white border border-[#B5B5B3]/20">
          <div className="p-6 border-b border-[#B5B5B3]/20">
            <h3 className="text-xl font-bodoni text-[#171719]">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { time: '2 minutes ago', event: 'New user signup', user: 'sarah.m@email.com', type: 'user' },
                { time: '5 minutes ago', event: 'Course completed', user: 'jessica.l@email.com', type: 'course' },
                { time: '12 minutes ago', event: 'Payment received', user: 'emma.k@email.com', type: 'payment' },
                { time: '18 minutes ago', event: 'Workbook generated', user: 'rachel.d@email.com', type: 'content' },
                { time: '25 minutes ago', event: 'Sandra AI chat started', user: 'amy.s@email.com', type: 'ai' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-[#B5B5B3]/10">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'user' ? 'bg-blue-500' :
                      activity.type === 'course' ? 'bg-green-500' :
                      activity.type === 'payment' ? 'bg-yellow-500' :
                      activity.type === 'content' ? 'bg-purple-500' :
                      'bg-pink-500'
                    }`} />
                    <div>
                      <div className="text-[#171719]">{activity.event}</div>
                      <div className="text-sm text-[#B5B5B3]">{activity.user}</div>
                    </div>
                  </div>
                  <div className="text-sm text-[#B5B5B3]">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
