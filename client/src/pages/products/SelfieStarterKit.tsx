import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function SelfieStarterKit() {
  return (
    <div className="min-h-screen bg-[#F1F1F1]" style={{ fontFamily: 'Neue Einstellung, sans-serif' }}>
      <Header />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://i.postimg.cc/wMP7QtTN/IMG-8435-jpg.jpg)' }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-6xl lg:text-8xl mb-12 text-white leading-tight font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Selfie smarter.<br />
            Show up bolder.
          </h1>
          <Link href="/checkout/starter-kit">
            <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#171719] text-lg px-12 py-4 font-normal uppercase tracking-wide transition-all duration-300" style={{ fontFamily: 'Neue Einstellung, sans-serif', borderRadius: '0px' }}>
              GET THE KIT – $67
            </Button>
          </Link>
        </div>
      </section>

      {/* BEFORE & AFTER TRANSFORMATION */}
      <section className="px-6 py-24 bg-[#F1F1F1]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="text-center">
              <div className="mb-8">
                <img 
                  src="https://i.postimg.cc/XNt6zt4j/1.png" 
                  alt="Before the kit"
                  className="w-full max-w-md mx-auto"
                />
              </div>
              <h3 className="text-2xl mb-4 text-[#4C4B4B] font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Before: overwhelmed, hiding, unsure
              </h3>
            </div>
            <div className="text-center">
              <div className="mb-8">
                <img 
                  src="https://i.postimg.cc/d05zmx5K/2.png" 
                  alt="After the kit"
                  className="w-full max-w-md mx-auto"
                />
              </div>
              <h3 className="text-2xl mb-4 text-[#4C4B4B] font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                After: branded, bold, booked.
              </h3>
            </div>
          </div>

          {/* Overlay Quote */}
          <div className="text-center mt-20">
            <blockquote className="text-3xl text-[#171719] italic leading-relaxed font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              "Your camera roll tells your story. Let's rewrite it."
            </blockquote>
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE THE KIT */}
      <section className="px-6 py-24 bg-[#4C4B4B]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl text-center mb-20 text-white font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            What's Inside The Kit
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Lighting setup */}
            <div className="group cursor-pointer transition-transform hover:scale-105 duration-300">
              <div 
                className="aspect-square bg-cover bg-center mb-6 relative"
                style={{ backgroundImage: 'url(https://i.postimg.cc/rwgGZ6jy/flatlay-overlay-Url.png)' }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white text-2xl text-center font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    Lighting Setup
                  </h3>
                </div>
              </div>
            </div>

            {/* Caption scripts */}
            <div className="group cursor-pointer transition-transform hover:scale-105 duration-300">
              <div 
                className="aspect-square bg-cover bg-center mb-6 relative"
                style={{ backgroundImage: 'url(https://i.postimg.cc/PxvRkfVQ/story-Image1.png)' }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white text-2xl text-center font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    Caption Scripts
                  </h3>
                </div>
              </div>
            </div>

            {/* Preset formulas */}
            <div className="group cursor-pointer transition-transform hover:scale-105 duration-300">
              <div 
                className="aspect-square bg-cover bg-center mb-6 relative"
                style={{ backgroundImage: 'url(https://i.postimg.cc/R0KtrjQn/story-Image2.png)' }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white text-2xl text-center font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    Preset Formulas
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YOUR STORY MATTERS */}
      <section className="px-6 py-24 bg-[#F1F1F1]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className="relative">
              <img 
                src="https://i.postimg.cc/0jv5My39/final-Quote-Image-1.png" 
                alt="Story"
                className="w-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40" />
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <h3 className="text-white text-3xl lg:text-4xl text-center leading-tight font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  "I started with one mirror selfie at 11PM—just to feel something again."
                </h3>
              </div>
            </div>

            {/* Text */}
            <div className="space-y-8">
              <p className="text-xl text-[#4C4B4B] leading-relaxed font-light" style={{ fontFamily: 'Neue Einstellung, sans-serif' }}>
                What came next wasn't magic—it was small steps. Lighting tricks. Posing hacks. Finally pressing POST.
              </p>
              <p className="text-xl text-[#4C4B4B] leading-relaxed font-light" style={{ fontFamily: 'Neue Einstellung, sans-serif' }}>
                That's what this kit gives you: a way back to yourself, one selfie at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MIRROR SELFIE SOCIAL PROOF GRID */}
      <section className="px-6 py-24 bg-[#171719]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl mb-12 text-white font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Real moments. Real confidence. Real content.
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
            <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: 'url(https://i.postimg.cc/Fz2HJ2Dg/IMG-3479.jpg)' }} />
            <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: 'url(https://i.postimg.cc/wMP7QtTN/IMG-8435-jpg.jpg)' }} />
          </div>

          <Link href="/checkout/starter-kit">
            <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#171719] text-lg px-12 py-4 font-normal uppercase tracking-wide transition-all duration-300" style={{ fontFamily: 'Neue Einstellung, sans-serif', borderRadius: '0px' }}>
              START YOURS → $67
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}