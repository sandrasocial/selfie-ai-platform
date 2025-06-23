// ========================================
// FAQ PAGE
// app/(static)/faq/page.tsx
// ========================================

'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const faqSections = [
    {
      title: 'Getting Started',
      items: [
        {
          id: 'right-for-me',
          question: 'Is SSELFIE right for me?',
          answer: "If you're tired of hiding behind your phone and ready to build a real personal brand, then yes. Doesn't matter if you're starting from zero or already have followers. We meet you where you are."
        },
        {
          id: 'tech-savvy',
          question: 'Do I need to be tech-savvy?',
          answer: "Nope. If you can take a selfie and post on Instagram, you can use SSELFIE. Everything is designed to be simple. Plus, we have tutorials for everything."
        },
        {
          id: 'see-results',
          question: 'How long until I see results?',
          answer: "Most women see changes in their confidence within days. Follower growth? Usually within 30 days if you follow the system. I built 120K in 90 days, but everyone's journey is different."
        }
      ]
    },
    {
      title: 'Tools & Features',
      items: [
        {
          id: 'glow-check',
          question: "What's The Glow Check?",
          answer: "It's our AI tool that analyzes your selfies and gives you honest feedback about lighting, angles, and style. Think of it as your personal photo coach. No harsh judgments, just helpful tips."
        },
        {
          id: 'ai-work',
          question: 'How does the AI work?',
          answer: "Our AI is trained specifically for personal branding. It analyzes what works in your photos and content, then gives you personalized recommendations. It's like having me look at every selfie, but faster."
        }
      ]
    },
    {
      title: 'Pricing & Payment',
      items: [
        {
          id: 'try-before-buy',
          question: 'Can I try before I buy?',
          answer: "The Glow Check is free to try. You can also grab our free guide to get a feel for what we're about. When you're ready for the full transformation, the paid programs are there."
        },
        {
          id: 'refunds',
          question: 'Do you offer refunds?',
          answer: "Because you get instant access to all digital content, we don't offer refunds. But I'm confident in what we've built. If you do the work, you'll see results."
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          id: 'get-stuck',
          question: 'What if I get stuck?',
          answer: "Email hello@sselfie.ai and we'll help you out. Usually within 24 hours. Plus, our community is amazing at helping each other."
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-soft-white py-20">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-20 relative">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 text-[15rem] font-playfair italic opacity-[0.03] pointer-events-none">
            ?
          </div>
          <h1 className="font-bodoni text-5xl md:text-6xl mb-6">Common Questions</h1>
          <p className="text-xl text-warm-gray max-w-2xl mx-auto">
            The stuff everyone asks, answered honestly. No corporate speak, just real talk.
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-12">
          {faqSections.map((section) => (
            <div key={section.title}>
              <h2 className="font-bodoni text-3xl mb-8">{section.title}</h2>
              <div className="space-y-4">
                {section.items.map((item) => (
                  <div
                    key={item.id}
                    className="border-b border-warm-gray/20 pb-6"
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full flex justify-between items-center text-left hover:opacity-70 transition-opacity"
                    >
                      <span className="text-lg pr-4">{item.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          openItems.includes(item.id) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openItems.includes(item.id) && (
                      <div className="mt-4 text-warm-gray">
                        <p>{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-20 text-center p-12 bg-white border border-warm-gray/20">
          <h3 className="font-bodoni text-3xl mb-4">Still have questions?</h3>
          <p className="text-lg mb-6">Let's chat. No question is too small.</p>
          <a
            href="mailto:hello@sselfie.ai"
            className="inline-block px-12 py-4 bg-luxury-black text-soft-white text-xs uppercase tracking-wider hover:opacity-80 transition-opacity"
          >
            Email Us
          </a>
        </div>
      </div>
    </div>
  )
}
