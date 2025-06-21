'use client'

import { useState } from 'react'
import { Search, Check, X, Copy, Mic, MessageSquare } from 'lucide-react'

export default function VoiceGuidelines() {
  const [searchTerm, setSearchTerm] = useState('')
  const [copiedItem, setCopiedItem] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'examples' | 'checklist' | 'reference'>('overview')

  const copyToClipboard = async (text: string, itemId: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedItem(itemId)
    setTimeout(() => setCopiedItem(null), 2000)
  }

  const voiceExamples = {
    good: [
      "Okay, so here's the thing about selfies...",
      "You know that feeling when you take 47 photos and hate them all? Yeah, me too.",
      "Listen, I get it. Showing up online feels weird at first.",
      "Can we talk about how nobody teaches us this stuff?",
      "So I was scrolling through my old photos and realized something...",
      "Let's fix this together",
      "You've got this. I know because I've been where you are."
    ],
    bad: [
      "Leverage your personal brand assets!",
      "Optimize your digital presence today!",
      "Unlock your full potential now!",
      "This will TRANSFORM your life!!!",
      "You are a goddess, embrace your power!",
      "Revolutionary AI-powered optimization!",
      "Curated visual narratives for success!"
    ]
  }

  const copyTransformations = [
    {
      category: 'Tool Descriptions',
      before: 'AI-powered selfie analyzer with Nordic beauty filters!',
      after: "Okay, so you know how we take like 100 selfies to get one good one? This fixes that. Upload your photo and I'll tell you exactly what's working."
    },
    {
      category: 'Headlines',
      before: 'Transform Your Personal Brand Today!',
      after: 'YOUR SELFIE IS YOUR BRAND'
    },
    {
      category: 'CTAs',
      before: 'Download Your Guide Now!',
      after: 'GET GUIDE'
    },
    {
      category: 'Error Messages',
      before: 'Please enter a valid email!',
      after: 'Hmm, check that email again?'
    },
    {
      category: 'About Copy',
      before: 'My journey of self-discovery through visual storytelling began...',
      after: "I built this because I was tired of taking bad photos and feeling invisible online."
    }
  ]

  const writingRules = [
    { rule: 'Use contractions', example: '"You\'re" not "You are"' },
    { rule: 'Simple words', example: '"use" not "utilize", "help" not "assist"' },
    { rule: 'Conversational flow', example: '"Wanna know a secret?" not "Here\'s insider information"' },
    { rule: 'Natural sentences', example: 'Start with "And", "But", "So" when it feels right' },
    { rule: 'No exclamation marks', example: 'Ever. Period.' },
    { rule: 'Short sentences mixed with longer ones', example: 'For rhythm and readability' }
  ]

  const voiceChecklist = [
    'Would Rachel from FRIENDS say this?',
    'Are there any exclamation marks to remove?',
    'Did I use simple, everyday words?',
    'Does it sound like talking to a friend?',
    'Is it warm without being fake?',
    'Are contractions used naturally?',
    'No corporate buzzwords?',
    'No generic empowerment speak?'
  ]

  const conversationStarters = {
    openings: [
      "Okay, real talk...",
      "So here's what I learned...",
      "Can I tell you something?",
      "You know what's funny?",
      "I used to think..."
    ],
    transitions: [
      "But here's the thing...",
      "And that's when I realized...",
      "So I started thinking...",
      "Which brings me to...",
      "Anyway, the point is..."
    ]
  }

  const quickReference = {
    instead: [
      { wrong: "Transform your life!", right: "Let's fix this together" },
      { wrong: "Unlock your potential!", right: "You've got this. I'll show you how" },
      { wrong: "Revolutionary AI technology!", right: "It's like having me help you 24/7" },
      { wrong: "Proven strategies for success!", right: "This is what actually works" },
      { wrong: "Join thousands of women!", right: "You're not alone in this" }
    ]
  }

  // Filter content based on search
  const filterContent = (content: any) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return JSON.stringify(content).toLowerCase().includes(searchLower)
  }

  return (
    <div className="min-h-screen bg-soft-white p-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-bodoni text-luxury-black mb-4">Voice & Copy Guidelines</h1>
        <p className="text-xl text-warm-gray">
          Sandra's voice = Rachel from FRIENDS + personal brand expertise. Warm, relatable, like your smartest friend.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
        <input
          type="text"
          placeholder="Search voice examples, rules, or phrases..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 border border-warm-gray/20 focus:border-luxury-black outline-none transition-colors text-lg"
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-8 border-b border-warm-gray/20 mb-12">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'examples', label: 'Examples' },
          { id: 'checklist', label: 'Checklist' },
          { id: 'reference', label: 'Quick Reference' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-4 text-sm tracking-[2px] uppercase transition-colors ${
              activeTab === tab.id 
                ? 'text-luxury-black border-b-2 border-luxury-black' 
                : 'text-warm-gray hover:text-luxury-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-12">
          {/* Voice Formula */}
          <section className="bg-white p-8 border border-warm-gray/20">
            <h2 className="text-2xl font-bodoni text-luxury-black mb-6">The Voice Formula</h2>
            <div className="text-center py-8">
              <span className="text-2xl font-bodoni">Rachel from FRIENDS</span>
              <span className="text-3xl mx-4">+</span>
              <span className="text-2xl font-bodoni">Personal Brand Expertise</span>
              <span className="text-3xl mx-4">=</span>
              <span className="text-2xl font-bodoni text-luxury-black">Sandra's Voice</span>
            </div>
            <p className="text-center text-warm-gray">
              Warm, relatable, like talking to your best friend who happens to know about style and business.
            </p>
          </section>

          {/* Writing Rules */}
          <section>
            <h2 className="text-2xl font-bodoni text-luxury-black mb-6">Writing Rules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {writingRules.map((rule, index) => (
                <div key={index} className="bg-white p-6 border border-warm-gray/20">
                  <h4 className="font-semibold text-luxury-black mb-2">{rule.rule}</h4>
                  <p className="text-warm-gray text-sm">{rule.example}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Tone Markers */}
          <section className="bg-luxury-black text-white p-8">
            <h2 className="text-2xl font-bodoni mb-6">Tone Markers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="font-semibold mb-1">Warm</p>
                <p className="text-sm opacity-80">but not sugary</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Confident</p>
                <p className="text-sm opacity-80">but not cocky</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Direct</p>
                <p className="text-sm opacity-80">but not harsh</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Funny</p>
                <p className="text-sm opacity-80">but not trying too hard</p>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'examples' && (
        <div className="space-y-12">
          {/* Good vs Bad Examples */}
          <section>
            <h2 className="text-2xl font-bodoni text-luxury-black mb-6">Voice Examples</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Good Examples */}
              <div className="bg-white p-8 border border-warm-gray/20">
                <div className="flex items-center gap-2 mb-6">
                  <Check className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-semibold text-luxury-black">Sandra Sounds Like</h3>
                </div>
                <div className="space-y-4">
                  {voiceExamples.good.filter(filterContent).map((example, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <button
                        onClick={() => copyToClipboard(example, `good-${index}`)}
                        className="text-warm-gray hover:text-luxury-black"
                      >
                        {copiedItem === `good-${index}` ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <p className="text-luxury-black">{example}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bad Examples */}
              <div className="bg-white p-8 border border-warm-gray/20">
                <div className="flex items-center gap-2 mb-6">
                  <X className="w-6 h-6 text-red-600" />
                  <h3 className="text-xl font-semibold text-luxury-black">Never Like This</h3>
                </div>
                <div className="space-y-4">
                  {voiceExamples.bad.filter(filterContent).map((example, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <X className="w-4 h-4 text-red-600 mt-1" />
                      <p className="text-warm-gray line-through">{example}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Copy Transformations */}
          <section>
            <h2 className="text-2xl font-bodoni text-luxury-black mb-6">Copy Transformations</h2>
            <div className="space-y-6">
              {copyTransformations.filter(filterContent).map((item, index) => (
                <div key={index} className="bg-white p-6 border border-warm-gray/20">
                  <h4 className="text-sm font-semibold tracking-[2px] uppercase text-warm-gray mb-4">
                    {item.category}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-red-600 mb-2">BEFORE:</p>
                      <p className="text-warm-gray line-through">{item.before}</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-600 mb-2">AFTER:</p>
                      <div className="flex items-start gap-2">
                        <p className="text-luxury-black flex-1">{item.after}</p>
                        <button
                          onClick={() => copyToClipboard(item.after, `trans-${index}`)}
                          className="text-warm-gray hover:text-luxury-black"
                        >
                          {copiedItem === `trans-${index}` ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {activeTab === 'checklist' && (
        <div className="space-y-12">
          {/* Voice Checklist */}
          <section className="bg-white p-8 border border-warm-gray/20">
            <h2 className="text-2xl font-bodoni text-luxury-black mb-6">Voice Checklist</h2>
            <p className="text-warm-gray mb-8">Before publishing any copy, check:</p>
            <div className="space-y-4">
              {voiceChecklist.map((item, index) => (
                <label key={index} className="flex items-center gap-4 cursor-pointer group">
                  <div className="w-6 h-6 border border-luxury-black group-hover:bg-luxury-black transition-colors relative">
                    <Check className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100" />
                  </div>
                  <span className="text-luxury-black">{item}</span>
                </label>
              ))}
            </div>
          </section>

          {/* The Sandra Test */}
          <section className="bg-luxury-black text-white p-8">
            <h2 className="text-2xl font-bodoni mb-6">The Sandra Test</h2>
            <p className="mb-6">Read your copy out loud. If it sounds like:</p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 mt-1" />
                <p>Your smartest friend giving advice over coffee = PERFECT</p>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-400 mt-1" />
                <p>A motivational speaker on stage = REWRITE</p>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-400 mt-1" />
                <p>A corporate website = REWRITE</p>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-400 mt-1" />
                <p>An Instagram guru = REWRITE</p>
              </div>
            </div>
          </section>

          {/* Conversation Starters */}
          <section>
            <h2 className="text-2xl font-bodoni text-luxury-black mb-6">Conversation Patterns</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 border border-warm-gray/20">
                <h3 className="font-semibold mb-4">Ways Sandra Opens</h3>
                <div className="space-y-2">
                  {conversationStarters.openings.map((starter, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-warm-gray" />
                      <p className="text-luxury-black">{starter}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-6 border border-warm-gray/20">
                <h3 className="font-semibold mb-4">How She Transitions</h3>
                <div className="space-y-2">
                  {conversationStarters.transitions.map((transition, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-warm-gray" />
                      <p className="text-luxury-black">{transition}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'reference' && (
        <div className="space-y-12">
          {/* Quick Reference */}
          <section>
            <h2 className="text-2xl font-bodoni text-luxury-black mb-6">Quick Reference Phrases</h2>
            <div className="space-y-4">
              {quickReference.instead.filter(filterContent).map((item, index) => (
                <div key={index} className="bg-white p-6 border border-warm-gray/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div>
                      <p className="text-xs text-red-600 mb-2">INSTEAD OF:</p>
                      <p className="text-warm-gray line-through">{item.wrong}</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-600 mb-2">SAY:</p>
                      <div className="flex items-center gap-2">
                        <p className="text-luxury-black font-medium">{item.right}</p>
                        <button
                          onClick={() => copyToClipboard(item.right, `ref-${index}`)}
                          className="text-warm-gray hover:text-luxury-black"
                        >
                          {copiedItem === `ref-${index}` ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Key Phrases Library */}
          <section className="bg-white p-8 border border-warm-gray/20">
            <h2 className="text-2xl font-bodoni text-luxury-black mb-6">Key Phrases Library</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Headlines (2-5 words)</h4>
                <div className="space-y-2">
                  {['YOUR SELFIE IS YOUR BRAND', 'LET\'S FIX THIS', 'TIME TO SHOW UP'].map((phrase, i) => (
                    <button
                      key={i}
                      onClick={() => copyToClipboard(phrase, `headline-${i}`)}
                      className="flex items-center gap-2 text-sm text-luxury-black hover:text-warm-gray"
                    >
                      <Copy className="w-3 h-3" />
                      {phrase}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">CTAs (2-3 words)</h4>
                <div className="space-y-2">
                  {['START HERE', 'GET GUIDE', 'SEE HOW', 'TELL ME MORE'].map((phrase, i) => (
                    <button
                      key={i}
                      onClick={() => copyToClipboard(phrase, `cta-${i}`)}
                      className="flex items-center gap-2 text-sm text-luxury-black hover:text-warm-gray"
                    >
                      <Copy className="w-3 h-3" />
                      {phrase}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Reassurance</h4>
                <div className="space-y-2">
                  {['You\'ve got this', 'I\'ll show you how', 'We do this together', 'No overwhelm'].map((phrase, i) => (
                    <button
                      key={i}
                      onClick={() => copyToClipboard(phrase, `reassure-${i}`)}
                      className="flex items-center gap-2 text-sm text-luxury-black hover:text-warm-gray"
                    >
                      <Copy className="w-3 h-3" />
                      {phrase}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Final Reminder */}
          <section className="bg-soft-white p-8 border-2 border-luxury-black">
            <h3 className="text-xl font-bodoni text-luxury-black mb-4">Final Reminder</h3>
            <p className="text-lg leading-relaxed">
              Sandra is successful and sophisticated, but she got there by being REAL. She doesn't talk down 
              to anyone or use fancy words to impress. She's the friend who made it and is reaching back to 
              help others climb up too.
            </p>
            <p className="text-lg font-semibold mt-4">
              When in doubt: How would you explain this to your best friend over lunch? That's Sandra's voice.
            </p>
          </section>
        </div>
      )}
    </div>
  )
} 