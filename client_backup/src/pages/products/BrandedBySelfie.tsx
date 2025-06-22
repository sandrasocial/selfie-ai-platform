
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function BrandedBySelfie() {
  return (
    <div className="min-h-screen bg-[#F1F1F1]" className="font-neue">
      <Header />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://i.postimg.cc/wMP7QtTN/IMG-8435-jpg.jpg)' }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <h1 
            className="text-5xl lg:text-7xl xl:text-8xl font-normal mb-8 text-white leading-tight"
            className="font-cormorant"
          >
            You're not just a brand.<br />
            You're the whole story.
          </h1>
          <p 
            className="text-xl lg:text-2xl text-white mb-12 max-w-4xl mx-auto leading-relaxed font-light"
            className="font-neue"
          >
            Branded by Selfie™ is your step-by-step guide to build a personal brand that feels real, looks high-end, and gets attention.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/checkout/branded-by-selfie">
              <Button 
                className="bg-[#171719] border-2 border-[#171719] text-white hover:bg-white hover:text-[#171719] text-lg px-12 py-4 font-normal uppercase tracking-wide"
                className="font-neue"
              >
                GET STARTED
              </Button>
            </Link>
            <Button 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#171719] text-lg px-12 py-4 font-normal uppercase tracking-wide"
              className="font-neue"
            >
              SEE WHAT'S INSIDE
            </Button>
          </div>
        </div>
      </section>

      {/* WHAT YOU'LL LEARN */}
      <section className="px-6 py-20 bg-[#F1F1F1]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 
              className="text-5xl lg:text-6xl font-normal mb-8 text-[#171719]"
              className="font-cormorant"
            >
              Build a Brand That Feels Like You
            </h2>
            <p 
              className="text-xl text-[#4C4B4B] max-w-3xl mx-auto leading-relaxed font-light"
              className="font-neue"
            >
              This isn't about faking it or being perfect.<br />
              It's about getting clear on your story, your message, and how to show up with confidence and style.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group cursor-pointer transition-all hover:scale-105">
              <div className="bg-white border border-[#B5B5B3] p-8 h-full group-hover:shadow-lg transition-shadow">
                <h3 
                  className="text-2xl font-normal mb-6 text-[#171719]"
                  className="font-cormorant"
                >
                  Know Your Message
                </h3>
                <p 
                  className="text-[#4C4B4B] leading-relaxed font-light"
                  className="font-neue"
                >
                  Find your niche, your voice, and what makes you different. Get crystal clear on who you serve and how you help them.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group cursor-pointer transition-all hover:scale-105">
              <div className="bg-white border border-[#B5B5B3] p-8 h-full group-hover:shadow-lg transition-shadow">
                <h3 
                  className="text-2xl font-normal mb-6 text-[#171719]"
                  className="font-cormorant"
                >
                  Create Powerful Content
                </h3>
                <p 
                  className="text-[#4C4B4B] leading-relaxed font-light"
                  className="font-neue"
                >
                  Use real scripts and tools that make your audience pay attention. Learn the exact formulas that get saves and shares.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group cursor-pointer transition-all hover:scale-105">
              <div className="bg-white border border-[#B5B5B3] p-8 h-full group-hover:shadow-lg transition-shadow">
                <h3 
                  className="text-2xl font-normal mb-6 text-[#171719]"
                  className="font-cormorant"
                >
                  Look Like a Brand
                </h3>
                <p 
                  className="text-[#4C4B4B] leading-relaxed font-light"
                  className="font-neue"
                >
                  Learn how to create a clean, beautiful style — from selfies to posts. Master the visual identity that commands respect.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SANDRA */}
      <section className="px-6 py-20 bg-[#4C4B4B]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative">
              <img 
                src="https://i.postimg.cc/0jv5My39/final-Quote-Image-1.png" 
                alt="Sandra"
                className="w-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30" />
            </div>

            {/* Text */}
            <div>
              <h2 
                className="text-4xl lg:text-5xl font-normal mb-8 text-white"
                className="font-cormorant"
              >
                Hi, I'm Sandra.
              </h2>
              <div className="space-y-6 text-white font-light text-lg leading-relaxed" className="font-neue">
                <p>I started from scratch. No fancy tools. Just a phone and a dream.</p>
                <p>Now I've built a personal brand seen by millions.</p>
                <p>This program is what I wish I had when I started. I'm giving it to you — so you can stop hiding and start showing up.</p>
              </div>
              <blockquote 
                className="text-2xl lg:text-3xl text-white italic font-normal mt-12 leading-relaxed border-l-4 border-white pl-6"
                className="font-cormorant"
              >
                "Your face, your words, your story — they're not too much. They're your power."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="px-6 py-20 bg-[#F1F1F1]">
        <div className="max-w-4xl mx-auto">
          <h2 
            className="text-5xl lg:text-6xl font-normal text-center mb-16 text-[#171719]"
            className="font-cormorant"
          >
            What's Inside
          </h2>
          <div className="bg-white border border-[#B5B5B3] p-12">
            <div className="grid md:grid-cols-2 gap-8">
              {[
                'Brand Clarity Workbook',
                'Real caption formulas and hooks',
                'Selfie strategy & confidence tools',
                'Content batching system',
                'Canva templates & presets',
                'Weekly action steps',
                'Lifetime access',
                'No monthly fees'
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-6 h-6 bg-[#171719]" />
                  <span 
                    className="text-[#4C4B4B] text-lg font-light"
                    className="font-neue"
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 py-20 bg-[#171719]">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-5xl lg:text-6xl font-normal text-center mb-16 text-white"
            className="font-cormorant"
          >
            What Other Women Are Saying
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 border border-[#B5B5B3]">
              <blockquote 
                className="text-xl text-[#4C4B4B] mb-6 italic leading-relaxed font-normal"
                className="font-cormorant"
              >
                "I finally feel like my brand is ME."
              </blockquote>
              <div className="text-[#4C4B4B] font-light" className="font-neue">
                <div className="font-normal">Sarah M.</div>
                <div className="text-sm">Business Coach</div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-8 border border-[#B5B5B3]">
              <blockquote 
                className="text-xl text-[#4C4B4B] mb-6 italic leading-relaxed font-normal"
                className="font-cormorant"
              >
                "My posts are getting saved and shared like crazy."
              </blockquote>
              <div className="text-[#4C4B4B] font-light" className="font-neue">
                <div className="font-normal">Jessica L.</div>
                <div className="text-sm">Wellness Expert</div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-8 border border-[#B5B5B3]">
              <blockquote 
                className="text-xl text-[#4C4B4B] mb-6 italic leading-relaxed font-normal"
                className="font-cormorant"
              >
                "I booked my first 1:1 client the same week I started posting with Sandra's strategy."
              </blockquote>
              <div className="text-[#4C4B4B] font-light" className="font-neue">
                <div className="font-normal">Amanda R.</div>
                <div className="text-sm">Life Coach</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="px-6 py-20 bg-[#F1F1F1]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 
            className="text-5xl lg:text-6xl font-normal mb-8 text-[#171719]"
            className="font-cormorant"
          >
            Get Branded by Selfie™ for $397
          </h2>
          <p 
            className="text-xl text-[#4C4B4B] mb-12 font-light"
            className="font-neue"
          >
            One-time payment | Start today | Lifetime access
          </p>

          <Link href="/checkout/branded-by-selfie">
            <Button 
              className="bg-[#171719] border-2 border-[#171719] text-white hover:bg-white hover:text-[#171719] text-xl px-16 py-6 font-normal uppercase tracking-wide mb-8"
              className="font-neue"
            >
              JOIN NOW
            </Button>
          </Link>

          <p 
            className="text-[#4C4B4B] font-light"
            className="font-neue"
          >
            14-day refund policy. No risk. Real results.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
