
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function SelfieUltimateGuide() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const poseSlides = [
    { title: "The Confidence Angle", tip: "Slightly angle your body away from camera, chin forward" },
    { title: "The Power Pose", tip: "Shoulders back, one hand on hip, direct eye contact" },
    { title: "The Natural Look", tip: "Soft smile, relaxed shoulders, gentle head tilt" }
  ];

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      <Header />
      
      {/* Intro Section */}
      <section className="py-20 px-6 bg-[#171719]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 
            className="text-6xl lg:text-7xl text-white"
            style={{ fontFamily: 'Cormorant Garamond' }}
          >
            Welcome to The Ultimate Selfie Guide
          </h1>
        </div>
      </section>

      {/* Lighting Section */}
      <section className="py-20 px-6 bg-[#F1F1F1]">
        <div className="max-w-4xl mx-auto">
          <h2 
            className="text-5xl mb-12 text-[#171719]"
            style={{ fontFamily: 'Cormorant Garamond' }}
          >
            Master Your Lighting
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 border border-[#B5B5B3]">
              <h3 
                className="text-xl mb-3 text-[#171719]"
                style={{ fontFamily: 'Cormorant Garamond' }}
              >
                Golden Hour Magic
              </h3>
              <p 
                className="text-[#4C4B4B]"
                style={{ fontFamily: 'Inter', fontWeight: 300 }}
              >
                Shoot during the hour after sunrise or before sunset for naturally flattering light
              </p>
            </div>
            
            <div className="bg-white p-6 border border-[#B5B5B3]">
              <h3 
                className="text-xl mb-3 text-[#171719]"
                style={{ fontFamily: 'Cormorant Garamond' }}
              >
                Window Light Setup
              </h3>
              <p 
                className="text-[#4C4B4B]"
                style={{ fontFamily: 'Inter', fontWeight: 300 }}
              >
                Position yourself at a 45-degree angle to a large window for soft, even lighting
              </p>
            </div>
            
            <div className="bg-white p-6 border border-[#B5B5B3]">
              <h3 
                className="text-xl mb-3 text-[#171719]"
                style={{ fontFamily: 'Cormorant Garamond' }}
              >
                Ring Light Hack
              </h3>
              <p 
                className="text-[#4C4B4B]"
                style={{ fontFamily: 'Inter', fontWeight: 300 }}
              >
                Use a ring light at eye level, 2-3 feet away for professional-looking selfies
              </p>
            </div>
          </div>
          
          <div className="bg-[#171719] p-8 text-white">
            <h3 
              className="text-2xl mb-4"
              style={{ fontFamily: 'Cormorant Garamond' }}
            >
              Pro Tip: The Phone Flashlight Trick
            </h3>
            <p 
              className="text-lg"
              style={{ fontFamily: 'Inter', fontWeight: 300 }}
            >
              In a pinch, have someone hold a phone flashlight at arms length to your side. 
              It creates beautiful, soft lighting that rivals professional setups.
            </p>
          </div>
        </div>
      </section>

      {/* Posing Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 
            className="text-5xl mb-12 text-[#171719]"
            style={{ fontFamily: 'Cormorant Garamond' }}
          >
            Poses That Never Fail
          </h2>
          
          {/* Desktop: Horizontal cards */}
          <div className="hidden md:flex gap-8 mb-8">
            {poseSlides.map((slide, index) => (
              <div 
                key={index}
                className="flex-1 bg-[#F1F1F1] p-6 border border-[#B5B5B3] cursor-pointer hover:bg-[#171719] hover:text-white transition-colors"
                onClick={() => setCurrentSlide(index)}
              >
                <h3 
                  className="text-xl mb-3"
                  style={{ fontFamily: 'Cormorant Garamond' }}
                >
                  {slide.title}
                </h3>
                <p 
                  style={{ fontFamily: 'Inter', fontWeight: 300 }}
                >
                  {slide.tip}
                </p>
              </div>
            ))}
          </div>
          
          {/* Mobile: Stacked cards */}
          <div className="md:hidden space-y-4 mb-8">
            {poseSlides.map((slide, index) => (
              <div 
                key={index}
                className="bg-[#F1F1F1] p-6 border border-[#B5B5B3]"
              >
                <h3 
                  className="text-xl mb-3 text-[#171719]"
                  style={{ fontFamily: 'Cormorant Garamond' }}
                >
                  {slide.title}
                </h3>
                <p 
                  className="text-[#4C4B4B]"
                  style={{ fontFamily: 'Inter', fontWeight: 300 }}
                >
                  {slide.tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editing Section */}
      <section className="py-20 px-6 bg-[#F1F1F1]">
        <div className="max-w-4xl mx-auto">
          <h2 
            className="text-5xl mb-12 text-[#171719]"
            style={{ fontFamily: 'Cormorant Garamond' }}
          >
            Simple Editing That Works
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 
                className="text-xl mb-4 text-[#171719]"
                style={{ fontFamily: 'Cormorant Garamond' }}
              >
                Before
              </h3>
              <div className="aspect-square bg-white border-2 border-[#171719] flex items-center justify-center">
                <span 
                  className="text-[#4C4B4B]"
                  style={{ fontFamily: 'Inter', fontWeight: 300 }}
                >
                  Raw selfie
                </span>
              </div>
            </div>
            
            <div>
              <h3 
                className="text-xl mb-4 text-[#171719]"
                style={{ fontFamily: 'Cormorant Garamond' }}
              >
                After
              </h3>
              <div className="aspect-square bg-white border-2 border-[#171719] flex items-center justify-center">
                <span 
                  className="text-[#4C4B4B]"
                  style={{ fontFamily: 'Inter', fontWeight: 300 }}
                >
                  Enhanced selfie
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 border border-[#B5B5B3]">
            <h3 
              className="text-2xl mb-4 text-[#171719]"
              style={{ fontFamily: 'Cormorant Garamond' }}
            >
              The 3-Step Edit Formula
            </h3>
            <div className="space-y-3">
              <p 
                className="text-[#4C4B4B]"
                style={{ fontFamily: 'Inter', fontWeight: 300 }}
              >
                1. Brighten: Increase exposure by 10-20%
              </p>
              <p 
                className="text-[#4C4B4B]"
                style={{ fontFamily: 'Inter', fontWeight: 300 }}
              >
                2. Warm: Add slight warmth to the temperature
              </p>
              <p 
                className="text-[#4C4B4B]"
                style={{ fontFamily: 'Inter', fontWeight: 300 }}
              >
                3. Enhance: Subtle clarity and texture adjustments
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Free Preset Teaser */}
      <section className="py-20 px-6 bg-[#171719]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="text-5xl mb-8 text-white"
            style={{ fontFamily: 'Cormorant Garamond' }}
          >
            Want my glow filter?
          </h2>
          
          <p 
            className="text-xl mb-12 text-white max-w-2xl mx-auto"
            style={{ fontFamily: 'Inter', fontWeight: 300 }}
          >
            Get the exact Lightroom presets I use to create that signature glow in every selfie
          </p>
          
          <Button 
            className="bg-white text-[#171719] hover:bg-transparent hover:text-white border border-white py-4 px-12 font-normal tracking-wide uppercase text-lg"
            style={{ borderRadius: 0 }}
            onClick={() => window.location.href = '/products/presets'}
          >
            GET THE $27 PRESET PACK
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
