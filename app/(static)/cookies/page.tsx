'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Cog, BarChart3, Megaphone, ShieldCheck, Globe } from 'lucide-react'

const cookieTypes = [
  {
    title: "Essential Cookies",
    icon: <ShieldCheck className="w-6 h-6" />,
    required: true,
    description: "These cookies are necessary for the website to function and cannot be switched off.",
    details: `Essential cookies enable core functionality such as:

- User authentication and login sessions
- Security and fraud prevention
- Website navigation and basic features
- Remembering your preferences and settings
- Shopping cart functionality (if applicable)
- Load balancing and performance optimization

Without these cookies, our service cannot function properly. They are set in response to actions made by you which amount to a request for services, such as logging in or filling in forms.

These cookies do not store any personally identifiable information and are automatically deleted when you close your browser or after a period of inactivity.`,
    examples: [
      "Session ID cookies",
      "Authentication tokens",
      "Security cookies",
      "Load balancer cookies",
      "CSRF protection tokens"
    ]
  },
  {
    title: "Analytics Cookies",
    icon: <BarChart3 className="w-6 h-6" />,
    required: false,
    description: "Help us understand how visitors interact with our website by collecting anonymous information.",
    details: `Analytics cookies help us improve our service by providing insights into:

- Which pages are most popular
- How long visitors spend on our site
- How visitors navigate through our site
- Which features are used most frequently
- Technical issues and error rates
- Performance optimization opportunities

We use this information to:
- Improve user experience
- Optimize website performance
- Identify and fix technical issues
- Understand user preferences
- Make data-driven product decisions

All analytics data is aggregated and anonymized. We do not track individual users or store personally identifiable information in these cookies.`,
    examples: [
      "Google Analytics cookies",
      "Page view tracking",
      "Session duration tracking",
      "Bounce rate measurement",
      "Conversion tracking"
    ]
  },
  {
    title: "Marketing Cookies",
    icon: <Megaphone className="w-6 h-6" />,
    required: false,
    description: "Used to track visitors across websites to display relevant and engaging advertisements.",
    details: `Marketing cookies enable us to:

- Show you relevant advertisements
- Limit the number of times you see an ad
- Measure the effectiveness of advertising campaigns
- Provide personalized content recommendations
- Enable social media features and sharing
- Track conversion from advertisements

These cookies may be set by us or third-party advertising partners. They help us:
- Reduce irrelevant advertising
- Show you ads for products you might be interested in
- Measure return on advertising investment
- Provide better user experience through personalization

You can opt out of marketing cookies without affecting the core functionality of our website.`,
    examples: [
      "Google Ads cookies",
      "Facebook Pixel",
      "Retargeting cookies",
      "Affiliate tracking",
      "Social media cookies"
    ]
  },
  {
    title: "Preference Cookies",
    icon: <Cog className="w-6 h-6" />,
    required: false,
    description: "Remember information that changes the way the website behaves or looks for you.",
    details: `Preference cookies remember your choices and settings to provide a personalized experience:

- Language and region preferences
- Currency and timezone settings
- Theme preferences (dark/light mode)
- Layout and display options
- Accessibility settings
- Previously viewed content
- Form data and inputs

These cookies help us:
- Remember your preferences between visits
- Provide a consistent user experience
- Save you time by not having to re-enter information
- Customize content based on your interests
- Improve accessibility and usability

Preference cookies enhance your experience but are not essential for the website to function.`,
    examples: [
      "Language preference cookies",
      "Theme selection cookies",
      "Region/timezone cookies",
      "Accessibility preference cookies",
      "UI customization cookies"
    ]
  }
]

const thirdPartyServices = [
  {
    name: "Google Analytics",
    purpose: "Website analytics and performance tracking",
    type: "Analytics",
    optOut: "https://tools.google.com/dlpage/gaoptout"
  },
  {
    name: "Google Ads",
    purpose: "Advertising and conversion tracking",
    type: "Marketing",
    optOut: "https://adssettings.google.com/"
  },
  {
    name: "Facebook Pixel",
    purpose: "Social media advertising and analytics",
    type: "Marketing",
    optOut: "https://www.facebook.com/settings?tab=ads"
  },
  {
    name: "Stripe",
    purpose: "Payment processing and fraud prevention",
    type: "Essential",
    optOut: "Required for service functionality"
  }
]

export default function CookiesPage() {
  const [openSections, setOpenSections] = useState<number[]>([0])
  const [cookieSettings, setCookieSettings] = useState({
    essential: true,
    analytics: true,
    marketing: false,
    preferences: true
  })

  const toggleSection = (index: number) => {
    setOpenSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const handleCookieToggle = (type: string) => {
    if (type === 'essential') return // Essential cookies cannot be disabled
    
    setCookieSettings(prev => ({
      ...prev,
      [type]: !prev[type as keyof typeof prev]
    }))
  }

  const saveSettings = () => {
    // Here you would typically save the settings to localStorage or send to your backend
    console.log('Cookie settings saved:', cookieSettings)
    alert('Cookie preferences saved successfully!')
  }

  return (
    <div className="min-h-screen bg-soft-white">
      {/* Header */}
      <div className="bg-luxury-black text-soft-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-bodoni text-4xl sm:text-5xl lg:text-6xl font-light mb-6">
            Cookie Policy
          </h1>
          <p className="font-inter text-lg sm:text-xl text-warm-gray max-w-2xl mx-auto leading-relaxed">
            Learn about how we use cookies and similar technologies to improve your experience.
          </p>
          <p className="font-inter text-sm text-warm-gray mt-4">
            Last updated: January 2024
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* What are Cookies */}
        <div className="mb-12 p-6 bg-white rounded-lg border border-warm-gray/20">
          <h2 className="font-bodoni text-2xl font-light text-luxury-black mb-4">
            What are Cookies?
          </h2>
          <p className="font-inter text-deep-graphite leading-relaxed mb-4">
            Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
            They are widely used to make websites work more efficiently and provide information to website owners.
          </p>
          <p className="font-inter text-deep-graphite leading-relaxed">
            We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts. 
            You can control cookie settings through your browser or our preference center.
          </p>
        </div>

        {/* Cookie Settings Panel */}
        <div className="mb-12 p-6 bg-luxury-black rounded-lg text-soft-white">
          <h2 className="font-bodoni text-2xl font-light mb-6">
            Cookie Preferences
          </h2>
          <p className="font-inter text-warm-gray mb-6">
            Manage your cookie preferences below. Essential cookies cannot be disabled as they are required for the website to function.
          </p>
          
          <div className="space-y-4 mb-6">
            {cookieTypes.map((cookie, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-soft-white/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-warm-gray">
                    {cookie.icon}
                  </div>
                  <div>
                    <h3 className="font-inter font-medium text-soft-white">
                      {cookie.title}
                    </h3>
                    <p className="font-inter text-sm text-warm-gray">
                      {cookie.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {cookie.required ? (
                    <span className="text-xs font-inter text-warm-gray px-3 py-1 bg-soft-white/10 rounded">
                      Required
                    </span>
                  ) : (
                    <button
                      onClick={() => handleCookieToggle(cookie.title.toLowerCase().split(' ')[0])}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        cookieSettings[cookie.title.toLowerCase().split(' ')[0] as keyof typeof cookieSettings]
                          ? 'bg-soft-white'
                          : 'bg-warm-gray'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-luxury-black transition-transform ${
                          cookieSettings[cookie.title.toLowerCase().split(' ')[0] as keyof typeof cookieSettings]
                            ? 'translate-x-6'
                            : 'translate-x-1'
                        }`}
                      />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={saveSettings}
            className="w-full px-6 py-3 bg-soft-white text-luxury-black font-inter font-medium text-sm uppercase tracking-wider rounded-sm hover:bg-warm-gray hover:text-soft-white transition-all duration-200"
          >
            Save Preferences
          </button>
        </div>

        {/* Detailed Cookie Information */}
        <div className="space-y-6 mb-12">
          <h2 className="font-bodoni text-3xl font-light text-luxury-black text-center mb-8">
            Cookie Categories
          </h2>
          
          {cookieTypes.map((cookie, index) => (
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
                    {cookie.icon}
                  </div>
                  <div>
                    <h3 className="font-bodoni text-xl font-light text-luxury-black">
                      {cookie.title}
                      {cookie.required && (
                        <span className="ml-2 text-xs font-inter text-deep-graphite px-2 py-1 bg-warm-gray/20 rounded">
                          Required
                        </span>
                      )}
                    </h3>
                    <p className="font-inter text-sm text-deep-graphite">
                      {cookie.description}
                    </p>
                  </div>
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
                    <div className="font-inter text-deep-graphite leading-relaxed whitespace-pre-line mb-6">
                      {cookie.details}
                    </div>
                    
                    <div>
                      <h4 className="font-inter font-medium text-luxury-black mb-3">
                        Examples of {cookie.title}:
                      </h4>
                      <ul className="list-disc list-inside font-inter text-sm text-deep-graphite space-y-1">
                        {cookie.examples.map((example, i) => (
                          <li key={i}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Third-party Services */}
        <div className="mb-12">
          <h2 className="font-bodoni text-3xl font-light text-luxury-black text-center mb-8">
            Third-party Services
          </h2>
          
          <div className="overflow-x-auto bg-white rounded-lg border border-warm-gray/20">
            <table className="w-full">
              <thead className="bg-soft-white">
                <tr>
                  <th className="px-6 py-3 text-left font-inter font-medium text-luxury-black">Service</th>
                  <th className="px-6 py-3 text-left font-inter font-medium text-luxury-black">Purpose</th>
                  <th className="px-6 py-3 text-left font-inter font-medium text-luxury-black">Type</th>
                  <th className="px-6 py-3 text-left font-inter font-medium text-luxury-black">Opt-out</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-gray/10">
                {thirdPartyServices.map((service, index) => (
                  <tr key={index} className="hover:bg-soft-white/50">
                    <td className="px-6 py-4 font-inter font-medium text-luxury-black">
                      {service.name}
                    </td>
                    <td className="px-6 py-4 font-inter text-sm text-deep-graphite">
                      {service.purpose}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-inter rounded ${
                        service.type === 'Essential' 
                          ? 'bg-luxury-black text-soft-white'
                          : service.type === 'Analytics'
                          ? 'bg-deep-graphite text-soft-white'
                          : 'bg-warm-gray text-luxury-black'
                      }`}>
                        {service.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {service.optOut.startsWith('http') ? (
                        <a 
                          href={service.optOut}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-inter text-sm text-deep-graphite hover:text-luxury-black underline"
                        >
                          Opt-out Link
                        </a>
                      ) : (
                        <span className="font-inter text-sm text-warm-gray">
                          {service.optOut}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Browser Controls */}
        <div className="mb-12 p-6 bg-white rounded-lg border border-warm-gray/20">
          <h2 className="font-bodoni text-2xl font-light text-luxury-black mb-4">
            Browser Cookie Controls
          </h2>
          <p className="font-inter text-deep-graphite leading-relaxed mb-4">
            Most web browsers allow you to control cookies through their settings. You can:
          </p>
          <ul className="list-disc list-inside font-inter text-deep-graphite space-y-2 mb-4">
            <li>View what cookies are stored on your device</li>
            <li>Delete cookies individually or all at once</li>
            <li>Block cookies from specific websites</li>
            <li>Block third-party cookies</li>
            <li>Set cookies to be deleted when you close your browser</li>
          </ul>
          <p className="font-inter text-sm text-warm-gray">
            Note: Disabling cookies may affect the functionality of our website and reduce your user experience.
          </p>
        </div>

        {/* Contact Section */}
        <div className="p-8 bg-luxury-black rounded-lg text-center">
          <h3 className="font-bodoni text-2xl font-light text-soft-white mb-4">
            Questions about Cookies?
          </h3>
          <p className="font-inter text-warm-gray mb-6">
            If you have questions about our use of cookies or this policy, please contact us.
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
              href="/terms"
              className="font-inter text-deep-graphite hover:text-luxury-black transition-colors duration-200"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
