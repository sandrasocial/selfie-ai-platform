'use client'

import { Code, Clock, Database, Zap } from 'lucide-react'

export default function TechStack() {
  return (
    <div className="min-h-screen bg-soft-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 border border-warm-gray/20">
          <div className="text-center">
            <Code className="w-16 h-16 text-luxury-black mx-auto mb-4" />
            <h1 className="text-4xl font-bodoni text-luxury-black mb-4">
              Tech Stack
            </h1>
            <p className="text-xl text-warm-gray mb-8">
              Technology architecture and infrastructure overview
            </p>
            
            <div className="bg-soft-white p-6 rounded-none border border-warm-gray/20">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-warm-gray" />
                <span className="font-semibold">Coming Soon</span>
              </div>
              <p className="text-warm-gray">
                This page will be migrated from the legacy system and will include:
              </p>
              <ul className="mt-4 space-y-2 text-sm text-warm-gray">
                <li>• Detailed technology stack breakdown</li>
                <li>• Infrastructure architecture diagrams</li>
                <li>• API documentation and endpoints</li>
                <li>• Performance monitoring tools</li>
                <li>• Security and compliance overview</li>
              </ul>
            </div>
            
            <div className="mt-8 flex gap-4 justify-center">
              <a 
                href="/admin/project-overview" 
                className="bg-luxury-black text-white px-6 py-3 hover:bg-black transition-colors"
              >
                View Project Overview
              </a>
              <a 
                href="/admin/dashboard" 
                className="bg-soft-white text-luxury-black px-6 py-3 border border-warm-gray/20 hover:bg-warm-gray/10 transition-colors"
              >
                Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 