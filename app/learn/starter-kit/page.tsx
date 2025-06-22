'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CheckCircle, Lock, Play, Clock, Download } from 'lucide-react'

const modules = [
  {
    id: 1,
    title: "Foundation: Your Selfie Brand Blueprint",
    description: "Discover your unique visual story and define your brand pillars",
    duration: "45 min",
    lessons: 6,
    status: "completed",
    preview: true,
    videoUrl: "/api/video/module-1-preview"
  },
  {
    id: 2,
    title: "Photo Strategy: Creating Your Visual Library",
    description: "Master the art of selfie-taking and build a content library",
    duration: "60 min",
    lessons: 8,
    status: "current",
    preview: false,
    videoUrl: "/api/video/module-2"
  },
  {
    id: 3,
    title: "Content Planning: From Camera Roll to Calendar",
    description: "Turn your photos into a strategic content plan",
    duration: "50 min",
    lessons: 7,
    status: "locked",
    preview: false,
    videoUrl: "/api/video/module-3"
  },
  {
    id: 4,
    title: "Platform Optimization: Instagram Mastery",
    description: "Optimize your Instagram for maximum brand impact",
    duration: "55 min",
    lessons: 9,
    status: "locked",
    preview: false,
    videoUrl: "/api/video/module-4"
  },
  {
    id: 5,
    title: "LinkedIn Personal Branding",
    description: "Professional selfie strategies for LinkedIn success",
    duration: "40 min",
    lessons: 6,
    status: "locked",
    preview: false,
    videoUrl: "/api/video/module-5"
  },
  {
    id: 6,
    title: "Community Building Through Authenticity",
    description: "Turn followers into a genuine community",
    duration: "45 min",
    lessons: 7,
    status: "locked",
    preview: false,
    videoUrl: "/api/video/module-6"
  },
  {
    id: 7,
    title: "Monetization: Your Selfie Sells",
    description: "Convert your personal brand into income streams",
    duration: "65 min",
    lessons: 10,
    status: "locked",
    preview: false,
    videoUrl: "/api/video/module-7"
  },
  {
    id: 8,
    title: "Advanced Techniques: Pro-Level Selfies",
    description: "Lighting, angles, and editing like a professional",
    duration: "50 min",
    lessons: 8,
    status: "locked",
    preview: false,
    videoUrl: "/api/video/module-8"
  },
  {
    id: 9,
    title: "Brand Expansion: Beyond Social Media",
    description: "Extend your brand to email, speaking, and partnerships",
    duration: "40 min",
    lessons: 6,
    status: "locked",
    preview: false,
    videoUrl: "/api/video/module-9"
  },
  {
    id: 10,
    title: "Scaling Your Influence",
    description: "Systems and strategies for sustainable growth",
    duration: "55 min",
    lessons: 9,
    status: "locked",
    preview: false,
    videoUrl: "/api/video/module-10"
  },
  {
    id: 11,
    title: "Crisis Management & Reputation Protection",
    description: "Handle challenges while maintaining authenticity",
    duration: "35 min",
    lessons: 5,
    status: "locked",
    preview: false,
    videoUrl: "/api/video/module-11"
  },
  {
    id: 12,
    title: "Mastery: Your Personal Brand Empire",
    description: "Final strategies for long-term brand success",
    duration: "60 min",
    lessons: 8,
    status: "locked",
    preview: false,
    videoUrl: "/api/video/module-12"
  }
]

export default function StarterKitCoursePage() {
  const [selectedModule, setSelectedModule] = useState(1)
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'current':
        return <Play className="h-5 w-5 text-blue-500" />
      default:
        return <Lock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50'
      case 'current':
        return 'border-blue-200 bg-blue-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <div className="min-h-screen bg-white">
      
      {/* Navigation */}
      <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="font-cormorant text-2xl font-semibold text-black">
              SELFIE AI™
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/dashboard" className="font-neue text-gray-700 hover:text-black transition-colors">
                Dashboard
              </Link>
              <Link href="/learn/starter-kit" className="font-neue text-black font-medium">
                Starter Kit
              </Link>
              <Link href="/chat/sandra" className="font-neue text-gray-700 hover:text-black transition-colors">
                Sandra AI
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-cormorant text-4xl md:text-6xl font-bold text-black mb-4">
            Starter Kit Course
          </h1>
          <p className="font-neue text-xl text-gray-600 mb-6">
            Transform your selfies into a powerful personal brand in 12 comprehensive modules
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="font-neue text-gray-600">10+ Hours Content</span>
            </div>
            <div className="flex items-center space-x-2">
              <Play className="h-4 w-4 text-gray-500" />
              <span className="font-neue text-gray-600">88 Video Lessons</span>
            </div>
            <div className="flex items-center space-x-2">
              <Download className="h-4 w-4 text-gray-500" />
              <span className="font-neue text-gray-600">Workbooks Included</span>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Bar */}
      <section className="py-6 px-4 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-neue font-semibold text-gray-900">Course Progress</h3>
            <span className="font-neue text-sm text-gray-600">1 of 12 modules completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" style={{width: '8.33%'}}></div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Module List */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <h2 className="font-cormorant text-2xl font-semibold mb-6">Course Modules</h2>
                <div className="space-y-3">
                  {modules.map((module) => (
                    <div 
                      key={module.id}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedModule === module.id 
                          ? 'border-black bg-gray-50' 
                          : getStatusColor(module.status)
                      } ${module.status === 'locked' ? 'opacity-60' : 'hover:border-gray-300'}`}
                      onClick={() => module.status !== 'locked' && setSelectedModule(module.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(module.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-neue font-semibold text-sm mb-1">
                            Module {module.id}: {module.title}
                          </h3>
                          <p className="font-neue text-xs text-gray-600 mb-2">
                            {module.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{module.duration}</span>
                            <span>{module.lessons} lessons</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Module Content */}
            <div className="lg:col-span-2">
              {selectedModule && (
                <div className="bg-white">
                  {(() => {
                    const module = modules.find(m => m.id === selectedModule)
                    if (!module) return null
                    
                    return (
                      <div>
                        {/* Module Header */}
                        <div className="mb-8">
                          <div className="flex items-center space-x-3 mb-4">
                            {getStatusIcon(module.status)}
                            <h1 className="font-cormorant text-3xl font-bold text-black">
                              Module {module.id}: {module.title}
                            </h1>
                          </div>
                          <p className="font-neue text-lg text-gray-600 mb-4">
                            {module.description}
                          </p>
                          <div className="flex items-center space-x-6 text-sm">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="font-neue text-gray-600">{module.duration}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Play className="h-4 w-4 text-gray-500" />
                              <span className="font-neue text-gray-600">{module.lessons} lessons</span>
                            </div>
                          </div>
                        </div>

                        {/* Video Player */}
                        <div className="mb-8">
                          <div className="aspect-video bg-black rounded-xl flex items-center justify-center">
                            {module.status === 'locked' ? (
                              <div className="text-center text-white">
                                <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                <p className="font-neue">Complete previous modules to unlock</p>
                              </div>
                            ) : (
                              <div className="text-center text-white">
                                <Play className="h-16 w-16 mx-auto mb-4 text-white hover:text-blue-300 cursor-pointer transition-colors" />
                                <p className="font-neue">Click to start Module {module.id}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Module Actions */}
                        {module.status !== 'locked' && (
                          <div className="flex space-x-4 mb-8">
                            <Link 
                              href={`/learn/starter-kit/module/${module.id}`}
                              className="bg-black text-white font-neue font-medium px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                              {module.status === 'completed' ? 'Review Module' : 'Start Module'}
                            </Link>
                            <button className="border border-gray-300 text-gray-700 font-neue font-medium px-6 py-3 rounded-lg hover:border-gray-400 transition-colors">
                              Download Workbook
                            </button>
                          </div>
                        )}

                        {/* Module Content Preview */}
                        <div className="bg-gray-50 rounded-xl p-6">
                          <h3 className="font-cormorant text-xl font-semibold mb-4">What You'll Learn</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            {module.id === 1 && (
                              <>
                                <div className="flex items-start space-x-3">
                                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                  <span className="font-neue text-gray-700">Define your authentic brand voice</span>
                                </div>
                                <div className="flex items-start space-x-3">
                                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                  <span className="font-neue text-gray-700">Create your visual brand identity</span>
                                </div>
                                <div className="flex items-start space-x-3">
                                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                  <span className="font-neue text-gray-700">Map your brand pillars</span>
                                </div>
                                <div className="flex items-start space-x-3">
                                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                  <span className="font-neue text-gray-700">Analyze your competition</span>
                                </div>
                              </>
                            )}
                            {module.id === 2 && (
                              <>
                                <div className="flex items-start space-x-3">
                                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                  <span className="font-neue text-gray-700">Master selfie lighting techniques</span>
                                </div>
                                <div className="flex items-start space-x-3">
                                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                  <span className="font-neue text-gray-700">Create a content photo library</span>
                                </div>
                                <div className="flex items-start space-x-3">
                                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                  <span className="font-neue text-gray-700">Plan batch photo sessions</span>
                                </div>
                                <div className="flex items-start space-x-3">
                                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                  <span className="font-neue text-gray-700">Organize your photo vault</span>
                                </div>
                              </>
                            )}
                            {/* Add specific learning outcomes for other modules as needed */}
                            {module.id > 2 && (
                              <>
                                <div className="flex items-start space-x-3">
                                  <Lock className="h-5 w-5 text-gray-400 mt-0.5" />
                                  <span className="font-neue text-gray-500">Complete previous modules to unlock</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
