'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const agents = [
  {
    id: 'diana',
    name: 'Diana',
    role: 'Director',
    description: 'Orchestrates projects, delegates tasks',
    avatar: '👑',
    color: 'bg-purple-100 text-purple-800',
    personality: 'Strategic, organized, and results-driven'
  },
  // Maya temporarily disabled due to deployment conflicts
  // {
  //   id: 'maya',
  //   name: 'Maya',
  //   role: 'Developer',
  //   description: 'Writes code, builds features',
  //   avatar: '💻',
  //   color: 'bg-blue-100 text-blue-800',
  //   personality: 'Technical, detail-oriented, and solution-focused'
  // },
  {
    id: 'victoria',
    name: 'Victoria',
    role: 'Designer',
    description: 'Creates beautiful designs',
    avatar: '🎨',
    color: 'bg-pink-100 text-pink-800',
    personality: 'Creative, aesthetic, and brand-conscious'
  },
  {
    id: 'rachel',
    name: 'Rachel',
    role: 'Copywriter',
    description: 'Writes in your brand voice',
    avatar: '✍️',
    color: 'bg-green-100 text-green-800',
    personality: 'Expressive, brand-aware, and audience-focused'
  },
  {
    id: 'quinn',
    name: 'Quinn',
    role: 'QA',
    description: 'Tests everything perfectly',
    avatar: '🔍',
    color: 'bg-orange-100 text-orange-800',
    personality: 'Meticulous, thorough, and quality-focused'
  },
  {
    id: 'ava',
    name: 'Ava',
    role: 'Automation',
    description: 'Connects systems',
    avatar: '⚡',
    color: 'bg-yellow-100 text-yellow-800',
    personality: 'Efficient, systematic, and integration-minded'
  }
];

export default function AgentChatSelectionPage() {
  return (
    <div className="min-h-screen bg-soft-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bodoni text-luxury-black mb-4">Agent Chat</h1>
          <p className="text-warm-gray text-lg">Choose an AI agent to collaborate with</p>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <Link
              key={agent.id}
              href={`/admin/agent-chat/${agent.id}`}
              className="group block"
            >
              <div className="bg-white border border-warm-gray/20 rounded-lg p-6 hover:border-luxury-black transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${agent.color}`}>
                    {agent.avatar}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bodoni text-luxury-black">{agent.name}</h3>
                      <ArrowRight className="w-5 h-5 text-warm-gray group-hover:text-luxury-black transition-colors" />
                    </div>
                    
                    <p className="text-sm font-medium text-luxury-black mb-1">{agent.role}</p>
                    <p className="text-sm text-warm-gray mb-3">{agent.description}</p>
                    
                    <div className="text-xs text-warm-gray italic">
                      "{agent.personality}"
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Features Overview */}
        <div className="mt-16 bg-white border border-warm-gray/20 rounded-lg p-8">
          <h2 className="text-2xl font-bodoni text-luxury-black mb-6">Chat Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-luxury-black text-white flex items-center justify-center text-sm">
                1
              </div>
              <div>
                <h3 className="font-medium text-luxury-black mb-1">Direct Chat</h3>
                <p className="text-sm text-warm-gray">Talk directly with each agent using their unique personality</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-luxury-black text-white flex items-center justify-center text-sm">
                2
              </div>
              <div>
                <h3 className="font-medium text-luxury-black mb-1">Agent Handoffs</h3>
                <p className="text-sm text-warm-gray">Seamlessly transfer conversations between agents</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-luxury-black text-white flex items-center justify-center text-sm">
                3
              </div>
              <div>
                <h3 className="font-medium text-luxury-black mb-1">Copy & Share</h3>
                <p className="text-sm text-warm-gray">Copy code, copy, and content with one click</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-luxury-black text-white flex items-center justify-center text-sm">
                4
              </div>
              <div>
                <h3 className="font-medium text-luxury-black mb-1">Diana Review</h3>
                <p className="text-sm text-warm-gray">Send any work to Diana for strategic review</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-luxury-black text-white flex items-center justify-center text-sm">
                5
              </div>
              <div>
                <h3 className="font-medium text-luxury-black mb-1">Task Tracking</h3>
                <p className="text-sm text-warm-gray">Monitor task status and progress in real-time</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-luxury-black text-white flex items-center justify-center text-sm">
                6
              </div>
              <div>
                <h3 className="font-medium text-luxury-black mb-1">Mobile Ready</h3>
                <p className="text-sm text-warm-gray">Chat with agents on any device, anywhere</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 