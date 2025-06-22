import Link from 'next/link'

export default function ContactPage() {
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
              <Link href="/" className="font-neue text-gray-700 hover:text-black transition-colors">
                Home
              </Link>
              <Link href="/about" className="font-neue text-gray-700 hover:text-black transition-colors">
                About
              </Link>
              <Link href="/contact" className="font-neue text-black font-medium">
                Contact
              </Link>
              <Link href="/freebie/selfie-guide" className="font-neue text-gray-700 hover:text-black transition-colors">
                Free Guide
              </Link>
              <Link href="/login" className="font-neue text-gray-700 hover:text-black transition-colors">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-cormorant text-5xl md:text-7xl font-bold text-black mb-6">
            Let's Connect
          </h1>
          <p className="font-neue text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Have questions about building your personal brand? We're here to help.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block font-neue text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block font-neue text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Your last name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block font-neue text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block font-neue text-sm font-medium text-gray-700 mb-2">
                  What's this about?
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Choose a topic</option>
                  <option value="general">General Question</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="press">Press & Media</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block font-neue text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Tell us how we can help..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white font-neue font-semibold py-4 px-8 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Alternative Contact Methods */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-cormorant text-3xl font-semibold text-center text-black mb-12">
            Other Ways to Reach Us
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="font-cormorant text-xl font-semibold mb-2">Chat with Sandra AI</h3>
              <p className="font-neue text-gray-600 mb-4">
                Get instant answers to your personal branding questions
              </p>
              <Link 
                href="/chat/sandra"
                className="inline-block bg-blue-50 text-blue-700 font-neue font-medium px-4 py-2 rounded-full hover:bg-blue-100 transition-colors"
              >
                Start Chat
              </Link>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="font-cormorant text-xl font-semibold mb-2">Email Support</h3>
              <p className="font-neue text-gray-600 mb-4">
                Direct email for detailed questions
              </p>
              <a 
                href="mailto:hello@selfie-ai.com"
                className="inline-block bg-green-50 text-green-700 font-neue font-medium px-4 py-2 rounded-full hover:bg-green-100 transition-colors"
              >
                hello@selfie-ai.com
              </a>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-cormorant text-xl font-semibold mb-2">Follow Us</h3>
              <p className="font-neue text-gray-600 mb-4">
                Connect with us on social media
              </p>
              <a 
                href="https://instagram.com/sandraselfieai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-purple-50 text-purple-700 font-neue font-medium px-4 py-2 rounded-full hover:bg-purple-100 transition-colors"
              >
                @sandraselfieai
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Response Time */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-cormorant text-2xl font-semibold text-black mb-4">
            We'll Get Back to You
          </h2>
          <p className="font-neue text-gray-600">
            We typically respond within 24 hours during business days. For urgent technical issues, 
            try our chat support for faster assistance.
          </p>
        </div>
      </section>
    </div>
  )
} 