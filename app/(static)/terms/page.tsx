'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

const sections = [
  {
    title: "Agreement to Terms",
    content: `By accessing and using the SELFIE platform ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.

Our service is provided "as is" and we make no express or implied warranties regarding the use of our service. We do not guarantee the accuracy, completeness, or usefulness of any information provided through our service.`
  },
  {
    title: "Use License",
    content: `Permission is granted to temporarily access the SELFIE platform for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:

- modify or copy the materials
- use the materials for any commercial purpose or for any public display (commercial or non-commercial)
- attempt to decompile or reverse engineer any software contained on our platform
- remove any copyright or other proprietary notations from the materials

This license shall automatically terminate if you violate any of these restrictions and may be terminated by us at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.`
  },
  {
    title: "User Accounts",
    content: `When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.

You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.

We reserve the right to refuse service, terminate accounts, or cancel subscriptions in our sole discretion.`
  },
  {
    title: "Content and Intellectual Property",
    content: `Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for Content that you post to the Service, including its legality, reliability, and appropriateness.

By posting Content to the Service, You represent and warrant that:
- Your use of the Content does not infringe, violate or misappropriate the rights of any third party
- You have the legal right and authority to use and distribute the Content
- Your Content complies with these Terms of Service

We retain the right to remove or refuse to post any Content for any or no reason in our sole discretion.`
  },
  {
    title: "AI Tools and Services",
    content: `SELFIE provides AI-powered tools to assist with content creation and personal branding. While we strive for accuracy, AI-generated content may not always be perfect or suitable for your specific needs.

You acknowledge that:
- AI tools are provided as assistance and should be reviewed before use
- You are responsible for the final content you publish
- We do not guarantee the performance or results of AI-generated content
- AI services may be updated or modified without notice`
  },
  {
    title: "Payment and Subscriptions",
    content: `Some features of our Service may require payment. You agree to provide current, complete and accurate purchase and account information for all purchases made via our Service.

Subscription fees are billed in advance on a recurring basis. Your subscription will automatically renew unless cancelled before the renewal date.

We reserve the right to change our prices at any time. If we change subscription prices, we will provide you with reasonable notice of such changes.`
  },
  {
    title: "Privacy and Data Protection",
    content: `Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.

We collect and use information in accordance with our Privacy Policy. By using our Service, you consent to such processing and you warrant that all data provided by you is accurate.`
  },
  {
    title: "Prohibited Uses",
    content: `You may not use our Service:
- For any unlawful purpose or to solicit others to perform unlawful acts
- To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances
- To infringe upon or violate our intellectual property rights or the intellectual property rights of others
- To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate
- To submit false or misleading information
- To upload or transmit viruses or any other type of malicious code
- To spam, phish, pharm, pretext, spider, crawl, or scrape
- For any obscene or immoral purpose
- To interfere with or circumvent the security features of the Service`
  },
  {
    title: "Service Availability",
    content: `We do not guarantee that our Service will be available at all times. We may experience hardware, software, or other problems or need to perform maintenance related to the Service, resulting in interruptions, delays, or errors.

We reserve the right to change, revise, update, suspend, discontinue, or otherwise modify the Service at any time or for any reason without notice to you.`
  },
  {
    title: "Limitation of Liability",
    content: `In no event shall SELFIE, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.`
  },
  {
    title: "Termination",
    content: `We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever including but not limited to a breach of the Terms.

If you wish to terminate your account, you may simply discontinue using the Service.`
  },
  {
    title: "Changes to Terms",
    content: `We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.

By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms.`
  }
]

export default function TermsPage() {
  const [openSections, setOpenSections] = useState<number[]>([])

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
            Terms of Service
          </h1>
          <p className="font-inter text-lg sm:text-xl text-warm-gray max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before using our service
          </p>
          <p className="font-inter text-sm text-warm-gray mt-4">
            Last updated: January 2024
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div 
              key={index}
              className="border border-warm-gray/20 rounded-lg overflow-hidden bg-white shadow-sm"
            >
              <button
                onClick={() => toggleSection(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-soft-white/50 transition-colors duration-200"
              >
                <h2 className="font-bodoni text-xl sm:text-2xl font-light text-luxury-black">
                  {section.title}
                </h2>
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
        <div className="mt-16 p-8 bg-luxury-black rounded-lg text-center">
          <h3 className="font-bodoni text-2xl font-light text-soft-white mb-4">
            Questions about these terms?
          </h3>
          <p className="font-inter text-warm-gray mb-6">
            If you have any questions about these Terms of Service, please contact us.
          </p>
          <Link 
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-soft-white text-luxury-black font-inter font-medium text-sm uppercase tracking-wider rounded-sm hover:bg-warm-gray hover:text-soft-white transition-all duration-200"
          >
            Contact Us
          </Link>
        </div>

        {/* Navigation */}
        <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-warm-gray/20">
          <Link 
            href="/"
            className="font-inter text-deep-graphite hover:text-luxury-black transition-colors duration-200"
          >
            ← Back to Home
          </Link>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link 
              href="/privacy"
              className="font-inter text-deep-graphite hover:text-luxury-black transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/cookies"
              className="font-inter text-deep-graphite hover:text-luxury-black transition-colors duration-200"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
