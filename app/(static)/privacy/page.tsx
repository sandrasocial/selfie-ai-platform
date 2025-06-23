'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ShieldCheck, Eye, User, Cog, FileText, Globe } from 'lucide-react'

const sections = [
  {
    title: "Information We Collect",
    icon: <User className="w-6 h-6" />,
    content: `We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.

Personal Information:
- Name and email address
- Profile information and preferences
- Payment and billing information
- Communication preferences

Usage Information:
- How you interact with our platform
- Content you create and share
- Device and browser information
- IP address and location data

AI Training Data:
- Content you submit for AI processing
- Feedback on AI-generated suggestions
- Usage patterns to improve our AI tools`
  },
  {
    title: "How We Use Your Information",
    icon: <Cog className="w-6 h-6" />,
    content: `We use the information we collect to provide, maintain, and improve our services.

Service Provision:
- Create and manage your account
- Process payments and transactions
- Provide customer support
- Send service-related communications

AI Enhancement:
- Train and improve our AI models
- Personalize content recommendations
- Optimize user experience
- Generate insights and analytics

Marketing (with your consent):
- Send promotional emails and updates
- Provide personalized recommendations
- Analyze service usage trends
- Conduct research and development`
  },
  {
    title: "Information Sharing",
    icon: <Globe className="w-6 h-6" />,
    content: `We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.

Service Providers:
- Payment processors for billing
- Cloud storage providers for data hosting
- Analytics services for service improvement
- Customer support platforms

Legal Requirements:
- When required by law or legal process
- To protect our rights and property
- To prevent fraud or security threats
- In connection with business transactions

Public Information:
- Content you choose to make public
- Profile information set to public
- Posts and comments in public forums`
  },
  {
    title: "Data Security",
    icon: <ShieldCheck className="w-6 h-6" />,
    content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

Security Measures:
- Encryption of data in transit and at rest
- Regular security assessments and updates
- Access controls and authentication
- Secure data centers and infrastructure

Data Retention:
- We retain personal information only as long as necessary
- Account data is retained while your account is active
- Deleted data is permanently removed from our systems
- Some information may be retained for legal compliance

Breach Response:
- We monitor for security incidents
- Affected users are notified of breaches
- We cooperate with law enforcement when required
- Regular security audits and improvements`
  },
  {
    title: "Your Privacy Rights",
    icon: <Eye className="w-6 h-6" />,
    content: `You have certain rights regarding your personal information, subject to applicable law.

Access and Control:
- View and update your account information
- Download a copy of your data
- Delete your account and associated data
- Control privacy and sharing settings

Marketing Communications:
- Opt out of promotional emails
- Manage notification preferences
- Control personalized recommendations
- Update communication settings

Data Portability:
- Export your content and data
- Transfer data to other services
- Receive data in a structured format
- Maintain access during transfers`
  },
  {
    title: "Cookies and Tracking",
    icon: <FileText className="w-6 h-6" />,
    content: `We use cookies and similar technologies to enhance your experience and analyze usage patterns.

Essential Cookies:
- Required for basic platform functionality
- Remember login status and preferences
- Enable security features
- Cannot be disabled

Analytics Cookies:
- Track usage patterns and performance
- Help us improve our services
- Provide insights on user behavior
- Can be controlled through settings

Marketing Cookies:
- Personalize content and advertisements
- Track campaign effectiveness
- Enable social media features
- Can be opted out through preferences

Cookie Management:
- Control cookies through browser settings
- Opt out of non-essential tracking
- Clear cookies and browsing data
- Review our detailed Cookie Policy`
  }
]

const highlights = [
  {
    title: "We don't sell your data",
    description: "Your personal information is never sold to third parties"
  },
  {
    title: "You control your data",
    description: "Access, update, or delete your information at any time"
  },
  {
    title: "Transparent practices",
    description: "Clear information about how we collect and use data"
  },
  {
    title: "Secure by design",
    description: "Industry-standard security measures protect your information"
  }
]

export default function PrivacyPage() {
  const [openSections, setOpenSections] = useState<number[]>([0])

  const toggleSection = (index: number) => {
    setOpenSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div className="min-h-screen bg-soft-white">
      {/* Header */}
      <div className="bg-luxury-black text-soft-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-bodoni text-4xl sm:text-5xl lg:text-6xl font-light mb-6">
            Privacy Policy
          </h1>
          <p className="font-inter text-lg sm:text-xl text-warm-gray max-w-2xl mx-auto leading-relaxed">
            Your privacy matters to us. Learn how we collect, use, and protect your information.
          </p>
          <p className="font-inter text-sm text-warm-gray mt-4">
            Last updated: January 2024
          </p>
        </div>
      </div>

      {/* Privacy Highlights */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {highlights.map((highlight, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm border border-warm-gray/10">
              <h3 className="font-bodoni text-xl font-light text-luxury-black mb-3">
                {highlight.title}
              </h3>
              <p className="font-inter text-sm text-deep-graphite leading-relaxed">
                {highlight.description}
              </p>
            </div>
          ))}
        </div>

        {/* Detailed Sections */}
        <div className="max-w-4xl mx-auto space-y-6">
          {sections.map((section, index) => (
            <div 
              key={index}
              className="border border-warm-gray/20 rounded-lg overflow-hidden bg-white shadow-sm"
            >
              <button
                onClick={() => toggleSection(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-soft-white/50 transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="text-deep-graphite">
                    {section.icon}
                  </div>
                  <h2 className="font-bodoni text-xl sm:text-2xl font-light text-luxury-black">
                    {section.title}
                  </h2>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 text-deep-graphite transition-transform duration-200 ${
                    openSections.includes(index) ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {openSections.includes(index) && (
                <div className="px-6 pb-6">
                  <div className="pt-4 border-t border-warm-gray/10">
                    <div className="font-inter text-deep-graphite leading-relaxed whitespace-pre-line">
                      {section.content}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto mt-16 p-8 bg-luxury-black rounded-lg text-center">
          <h3 className="font-bodoni text-2xl font-light text-soft-white mb-4">
            Privacy Questions?
          </h3>
          <p className="font-inter text-warm-gray mb-6">
            If you have questions about this Privacy Policy or our data practices, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="inline-flex items-center px-8 py-3 bg-soft-white text-luxury-black font-inter font-medium text-sm uppercase tracking-wider rounded-sm hover:bg-warm-gray hover:text-soft-white transition-all duration-200"
            >
              Contact Us
            </Link>
            <Link 
              href="/cookies"
              className="inline-flex items-center px-8 py-3 border border-soft-white text-soft-white font-inter font-medium text-sm uppercase tracking-wider rounded-sm hover:bg-soft-white hover:text-luxury-black transition-all duration-200"
            >
              Cookie Policy
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <div className="max-w-4xl mx-auto mt-12 flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-warm-gray/20">
          <Link 
            href="/"
            className="font-inter text-deep-graphite hover:text-luxury-black transition-colors duration-200"
          >
            ← Back to Home
          </Link>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link 
              href="/terms"
              className="font-inter text-deep-graphite hover:text-luxury-black transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <Link 
              href="/faq"
              className="font-inter text-deep-graphite hover:text-luxury-black transition-colors duration-200"
            >
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
