'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface SearchResult {
  id: string
  type: 'tool' | 'content' | 'action' | 'page'
  title: string
  description: string
  href: string
  icon: string
}

interface DashboardSearchProps {
  isOpen: boolean
  onClose: () => void
}

export function DashboardSearch({ isOpen, onClose }: DashboardSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const searchData: SearchResult[] = [
    {
      id: 'selfie',
      type: 'tool',
      title: 'Take Selfie',
      description: 'Capture your daily confidence moment',
      href: '/tools/selfie',
      icon: '📸'
    },
    {
      id: 'glow-check',
      type: 'tool',
      title: 'Glow Check',
      description: 'AI-powered beauty analysis',
      href: '/tools/glow-check',
      icon: '✨'
    },
    {
      id: 'caption-generator',
      type: 'tool',
      title: 'Caption Generator',
      description: 'AI-generated captions for your posts',
      href: '/tools/caption',
      icon: '✍️'
    },
    {
      id: 'brand-guidelines',
      type: 'page',
      title: 'Brand Guidelines',
      description: 'Your visual identity rules',
      href: '/brand',
      icon: '📋'
    },
    {
      id: 'content-calendar',
      type: 'page',
      title: 'Content Calendar',
      description: 'Plan and schedule your content',
      href: '/content',
      icon: '📅'
    },
    {
      id: 'analytics',
      type: 'page',
      title: 'Analytics',
      description: 'Track your growth and engagement',
      href: '/analytics',
      icon: '📊'
    },
    {
      id: 'future-self',
      type: 'tool',
      title: 'Future Self Generator',
      description: 'Create your transformation vision',
      href: '/tools/future-self',
      icon: '🔮'
    },
    {
      id: 'voice-training',
      type: 'page',
      title: 'Voice Training',
      description: 'Develop your unique brand voice',
      href: '/learn/voice',
      icon: '🎤'
    }
  ]

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (query.trim() === '') {
      setResults([])
      return
    }

    const filteredResults = searchData.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    )

    setResults(filteredResults.slice(0, 6))
    setSelectedIndex(0)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      window.location.href = results[selectedIndex].href
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-luxury-black/50 z-50 flex items-start justify-center pt-20">
      <div className="bg-soft-white w-full max-w-2xl mx-4 max-h-96 overflow-hidden">
        {/* Search Input */}
        <div className="p-6 border-b border-warm-gray/20">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search tools, content, or actions..."
            className="w-full bg-transparent text-luxury-black text-lg placeholder-warm-gray focus:outline-none"
          />
        </div>

        {/* Search Results */}
        <div className="max-h-80 overflow-y-auto">
          {results.length > 0 ? (
            results.map((result, index) => (
              <Link key={result.id} href={result.href}>
                <div
                  className={`p-4 flex items-center gap-4 transition-colors cursor-pointer ${
                    index === selectedIndex
                      ? 'bg-luxury-black text-soft-white'
                      : 'hover:bg-[#FAFAFA]'
                  }`}
                  onClick={onClose}
                >
                  <span className="text-2xl">{result.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium mb-1">{result.title}</div>
                    <div className="text-sm opacity-70">{result.description}</div>
                  </div>
                  <div className={`text-xs tracking-wider uppercase px-2 py-1 ${
                    index === selectedIndex
                      ? 'bg-soft-white text-luxury-black'
                      : 'bg-warm-gray text-luxury-black'
                  }`}>
                    {result.type}
                  </div>
                </div>
              </Link>
            ))
          ) : query.trim() !== '' ? (
            <div className="p-8 text-center text-warm-gray">
              <div className="text-4xl mb-4">🔍</div>
              <div className="text-lg mb-2">No results found</div>
              <div className="text-sm">Try searching for tools, content, or actions</div>
            </div>
          ) : (
            <div className="p-8 text-center text-warm-gray">
              <div className="text-4xl mb-4">💫</div>
              <div className="text-lg mb-2">Start typing to search</div>
              <div className="text-sm">Find tools, content, and actions quickly</div>
            </div>
          )}
        </div>

        {/* Search Footer */}
        <div className="p-4 border-t border-warm-gray/20 bg-[#FAFAFA] text-xs text-warm-gray">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <span>↑↓ Navigate</span>
              <span>Enter Select</span>
              <span>Esc Close</span>
            </div>
            <div>
              {results.length} result{results.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
