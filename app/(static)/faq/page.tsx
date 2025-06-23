'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle, Cog, Users, CreditCard } from 'lucide-react'
import Link from 'next/link'

const faqCategories = [
  {
    name: "Getting Started",
    icon: <HelpCircle className="w-5 h-5" />,
    questions: [
      {
        question: "What is SELFIE and how does it work?",
        answer: `SELFIE is an AI-powered personal branding platform that helps you build your online presence from your phone. Our system combines proven growth strategies with AI tools to make content creation and brand building easier than ever.

We provide:
- AI-powered content suggestions
- Personal branding templates
- Growth strategy guidance
- Analytics and insights
- Community support`
      },
      {
        question: "How do I get started with SELFIE?",
        answer: `Getting started is simple:

1. Sign up for a free account
2. Complete your profile setup
3. Take our brand assessment
4. Start with our free guide
5. Begin creating content with AI assistance

Our onboarding process takes just a few minutes and includes step-by-step guidance to help you create your first post.`
      }
    ]
  },
  {
    name: "AI Tools & Features",
    icon: <Cog className="w-5 h-5" />,
    questions: [
      {
        question: "How does the AI content generation work?",
        answer: `Our AI learns your unique voice, style, and preferences to create personalized content suggestions:

- Analyzes your existing content and engagement
- Generates posts that match your brand voice
- Suggests trending topics in your niche
- Creates multiple variations for A/B testing
- Provides optimization recommendations

The AI gets smarter as you use it, creating increasingly personalized suggestions.`
      }
    ]
  }
]

export default function FAQPage() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className="min-h-screen bg-soft-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-luxury-black to-deep-graphite text-soft-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Everything you need to know about SELFIE and building your personal brand
          </p>
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {filteredCategories.map((category) => (
            <div key={category.name} className="bg-soft-white rounded-lg shadow-sm border border-warm-gray/10">
              <div className="p-6 border-b border-warm-gray/10">
                <div className="flex items-center space-x-3">
                  <div className="text-luxury-black">
                    {category.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-luxury-black">
                    {category.name}
                  </h2>
                </div>
              </div>
              
              <div className="divide-y divide-warm-gray/10">
                {category.questions.map((faq, index) => {
                  const questionId = `${category.name}-${index}`
                  const isOpen = openQuestion === questionId
                  
                  return (
                    <div key={index} className="p-6">
                      <button
                        onClick={() => setOpenQuestion(isOpen ? null : questionId)}
                        className="flex items-start justify-between w-full text-left group"
                      >
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="mt-1">
                            <HelpCircle className="w-5 h-5 text-deep-graphite flex-shrink-0" />
                          </div>
                          <h3 className="text-lg font-semibold text-luxury-black group-hover:text-deep-graphite transition-colors">
                            {faq.question}
                          </h3>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-warm-gray transition-transform flex-shrink-0 ml-4 ${
                            isOpen ? 'transform rotate-180' : ''
                          }`}
                        />
                      </button>
                      
                      {isOpen && (
                        <div className="mt-4 ml-8 text-warm-gray whitespace-pre-line">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-luxury-black to-deep-graphite text-soft-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Still have questions?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Our support team is here to help you succeed with your personal branding journey.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              href="/contact"
              className="bg-soft-white text-luxury-black px-8 py-4 rounded-lg font-semibold hover:bg-warm-gray/10 transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/community"
              className="border border-soft-white text-soft-white px-8 py-4 rounded-lg font-semibold hover:bg-soft-white/10 transition-colors"
            >
              Join Community
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
