'use client'

import { useState } from 'react'
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  Package, 
  FileText,
  Camera,
  Star,
  TrendingUp,
  Calendar,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react'
import PreviewNotificationWidget from '@/components/dashboard/PreviewNotificationWidget'

export default function AdminDashboard() {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null)
  
  // Visual inspiration images
  const coastalImages = [
    { id: 1, url: 'https://i.postimg.cc/tC1JZ53k/103.png', alt: 'Coastal vista' },
    { id: 2, url: 'https://i.postimg.cc/Zqj4DBP0/119.png', alt: 'Ocean waves' },
    { id: 3, url: 'https://i.postimg.cc/wMn6cCXV/113.png', alt: 'Beach scene' },
    { id: 4, url: 'https://i.postimg.cc/wvTT6cxh/110.png', alt: 'Coastal landscape' },
    { id: 5, url: 'https://i.postimg.cc/52SXbtqW/128.png', alt: 'Ocean view' },
    { id: 6, url: 'https://i.postimg.cc/zXmvhhx1/132.png', alt: 'Beach horizon' }
  ]

  // Gallery strip images
  const galleryImages = [
    { id: 1, url: 'https://i.postimg.cc/CxGjhqkJ/109.png', alt: 'Gallery 1' },
    { id: 2, url: 'https://i.postimg.cc/t4zXWjWy/105.png', alt: 'Gallery 2' },
    { id: 3, url: 'https://i.postimg.cc/Dfs31h3D/121.png', alt: 'Gallery 3' },
    { id: 4, url: 'https://i.postimg.cc/YCRXQnST/15.png', alt: 'Gallery 4' },
    { id: 5, url: 'https://i.postimg.cc/hvX1tcdK/sandra-portrait.png', alt: 'Sandra Portrait' }
  ]

  const stats = [
    { label: 'Total Users', value: '1,234', icon: Users, change: '+12%' },
    { label: 'Revenue', value: '$45,678', icon: DollarSign, change: '+23%' },
    { label: 'Active Glow Checks', value: '456', icon: Camera, change: '+8%' },
    { label: 'Conversion Rate', value: '23%', icon: TrendingUp, change: '+5%' }
  ]

  const recentActivity = [
    { user: 'Sarah M.', action: 'Completed Glow Check', time: '2 minutes ago' },
    { user: 'Jessica L.', action: 'Purchased Selfie Starter Kit', time: '15 minutes ago' },
    { user: 'Emma K.', action: 'Downloaded Free Guide', time: '1 hour ago' },
    { user: 'Rachel D.', action: 'Joined VIP Program', time: '2 hours ago' }
  ]

  return (
    <div className="min-h-screen bg-soft-white">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bodoni text-luxury-black mb-2">Admin Dashboard</h1>
          <p className="text-warm-gray">Okay, let's see how things are going today.</p>
        </div>

        {/* Preview Notification Widget */}
        <PreviewNotificationWidget />

        {/* Visual Inspiration Widget - Updated heading */}
        <div className="mb-12">
          <h2 className="text-2xl font-bodoni text-luxury-black mb-4">Today's Vibe</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-0.5">
            {coastalImages.map((image) => (
              <div
                key={image.id}
                className="relative aspect-square overflow-hidden cursor-pointer"
                onMouseEnter={() => setHoveredImage(image.id.toString())}
                onMouseLeave={() => setHoveredImage(null)}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    hoveredImage === image.id.toString() ? 'grayscale-0' : 'grayscale'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid - Updated heading */}
        <div className="mb-4">
          <h2 className="text-2xl font-bodoni text-luxury-black mb-4">How We're Doing</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 border border-warm-gray/20">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="w-5 h-5 text-warm-gray" />
                <span className="text-sm text-warm-gray">{stat.change}</span>
              </div>
              <p className="text-3xl font-bodoni text-luxury-black mb-1">{stat.value}</p>
              <p className="text-sm text-warm-gray">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Admin Tools - Updated heading */}
            <div className="mb-8">
              <h2 className="text-2xl font-bodoni text-luxury-black mb-4">Your Toolkit</h2>
            </div>
            
            {/* Project Cards with Featured Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Featured Image Card */}
              <div className="relative h-64 overflow-hidden group cursor-pointer">
                <img
                  src="https://i.postimg.cc/dQ5q8mbb/22.png"
                  alt="Featured project"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/70 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-xl font-bodoni text-white mb-1">Where the magic happens</h3>
                  <p className="text-soft-white/80 text-sm">Access all your tools in one place</p>
                </div>
              </div>

              {/* Tool Cards */}
              <div className="space-y-4">
                <div className="bg-white p-4 border border-warm-gray/20 hover:border-luxury-black transition-colors duration-300 cursor-pointer">
                  <h4 className="font-medium text-luxury-black mb-1">Your playbook for everything</h4>
                  <p className="text-sm text-warm-gray">All the project details in one spot</p>
                </div>
                <div className="bg-white p-4 border border-warm-gray/20 hover:border-luxury-black transition-colors duration-300 cursor-pointer">
                  <h4 className="font-medium text-luxury-black mb-1">Chat with your AI squad</h4>
                  <p className="text-sm text-warm-gray">Get help from your digital team</p>
                </div>
                <div className="bg-white p-4 border border-warm-gray/20 hover:border-luxury-black transition-colors duration-300 cursor-pointer">
                  <h4 className="font-medium text-luxury-black mb-1">How to keep it gorgeous</h4>
                  <p className="text-sm text-warm-gray">Design rules and visual standards</p>
                </div>
                <div className="bg-white p-4 border border-warm-gray/20 hover:border-luxury-black transition-colors duration-300 cursor-pointer">
                  <h4 className="font-medium text-luxury-black mb-1">Sound like you, always</h4>
                  <p className="text-sm text-warm-gray">Voice guidelines and copy rules</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 border border-warm-gray/20">
              <h3 className="text-xl font-bodoni text-luxury-black mb-4">What's happening now</h3>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-soft-white">
                    <div>
                      <p className="text-luxury-black">{activity.user}</p>
                      <p className="text-sm text-warm-gray">{activity.action}</p>
                    </div>
                    <span className="text-xs text-warm-gray">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Brand Gallery Strip - Updated heading */}
            <div>
              <h3 className="text-xl font-bodoni text-luxury-black mb-4">Your Look Book</h3>
              <div className="relative overflow-hidden">
                <div className="flex space-x-1 animate-scroll">
                  {galleryImages.map((image) => (
                    <div
                      key={image.id}
                      className="relative h-32 w-48 flex-shrink-0 overflow-hidden cursor-pointer"
                      onMouseEnter={() => setHoveredImage(`gallery-${image.id}`)}
                      onMouseLeave={() => setHoveredImage(null)}
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        className={`w-full h-full object-cover transition-all duration-500 ${
                          hoveredImage === `gallery-${image.id}` ? 'grayscale-0 scale-110' : 'grayscale'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mood Widget */}
            <div className="relative h-80 overflow-hidden group cursor-pointer">
              <img
                src="https://i.postimg.cc/nhDpf8Xx/35.png"
                alt="Today's mood"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/80 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bodoni text-white mb-2">Today's Brand Mood</h3>
                <p className="text-soft-white mb-4">Coastal Elegance</p>
                <button className="text-white border border-white px-4 py-2 hover:bg-white hover:text-luxury-black transition-colors duration-300 w-fit">
                  Change it up
                </button>
              </div>
            </div>

            {/* Quick Actions - Updated heading */}
            <div className="bg-white p-6 border border-warm-gray/20">
              <h3 className="text-xl font-bodoni text-luxury-black mb-4">Let's Do This</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 border border-warm-gray/20 hover:bg-luxury-black hover:text-white transition-colors duration-300">
                  <span className="flex items-center gap-3">
                    <FileText className="w-4 h-4" />
                    Create something new
                  </span>
                </button>
                <button className="w-full text-left p-3 border border-warm-gray/20 hover:bg-luxury-black hover:text-white transition-colors duration-300">
                  <span className="flex items-center gap-3">
                    <Users className="w-4 h-4" />
                    Check on your people
                  </span>
                </button>
                <button className="w-full text-left p-3 border border-warm-gray/20 hover:bg-luxury-black hover:text-white transition-colors duration-300">
                  <span className="flex items-center gap-3">
                    <Calendar className="w-4 h-4" />
                    Plan your next post
                  </span>
                </button>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white p-6 border border-warm-gray/20">
              <h3 className="text-xl font-bodoni text-luxury-black mb-4">Today's Performance</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-warm-gray">Engagement Rate</span>
                    <span className="text-sm text-luxury-black font-medium">87%</span>
                  </div>
                  <div className="h-2 bg-warm-gray/20">
                    <div className="h-full bg-luxury-black" style={{ width: '87%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-warm-gray">Content Quality</span>
                    <span className="text-sm text-luxury-black font-medium">92%</span>
                  </div>
                  <div className="h-2 bg-warm-gray/20">
                    <div className="h-full bg-luxury-black" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 