
import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function PresetBundles() {
  const [selectedBundle, setSelectedBundle] = useState('all');

  const presets = [
    {
      id: 'bare',
      name: 'Bare Bundle',
      price: 5,
      description: 'Clean, minimal editing for authentic, natural looks',
      previewImage: '/api/placeholder/300/400',
      features: ['5 Lightroom Presets', 'Mobile & Desktop Compatible', 'Video Tutorial Included']
    },
    {
      id: 'glow',
      name: 'Glow Bundle', 
      price: 5,
      description: 'Warm, luminous tones for that perfect golden hour glow',
      previewImage: '/api/placeholder/300/400',
      features: ['5 Lightroom Presets', 'Mobile & Desktop Compatible', 'Video Tutorial Included']
    },
    {
      id: 'skin',
      name: 'Skin Bundle',
      price: 5,
      description: 'Perfect skin tones and smooth complexion enhancement',
      previewImage: '/api/placeholder/300/400',
      features: ['5 Lightroom Presets', 'Mobile & Desktop Compatible', 'Video Tutorial Included']
    },
    {
      id: 'selfie-glow',
      name: 'Selfie Glow-Up Bundle',
      price: 5,
      description: 'The ultimate selfie enhancement collection',
      previewImage: '/api/placeholder/300/400',
      features: ['8 Lightroom Presets', 'Mobile & Desktop Compatible', 'Bonus Editing Guide']
    }
  ];

  const testimonials = [
    {
      name: "Rachel Green",
      content: "These presets completely transformed my Instagram aesthetic. My engagement has tripled!",
      rating: 5
    },
    {
      name: "Sophia Martinez", 
      content: "The Glow Bundle is pure magic. Every photo looks like it was taken by a professional.",
      rating: 5
    },
    {
      name: "Ashley Chen",
      content: "I've tried so many presets, but these are the only ones that actually work on every photo.",
      rating: 5
    }
  ];

  const totalValue = presets.reduce((sum, preset) => sum + preset.price, 0);
  const bundlePrice = 15;
  const savings = totalValue - bundlePrice;

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      <Header />

      {/* Hero Section */}
      <section className="px-6 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 
            className="text-5xl lg:text-6xl xl:text-7xl mb-8 leading-tight text-[#171719] font-normal"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Lightroom Preset Collection
          </h1>
          <p 
            className="text-xl lg:text-2xl text-[#4C4B4B] mb-12 max-w-3xl mx-auto leading-relaxed font-light"
            style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
          >
            Professional-grade presets designed to give your photos that signature editorial look in one click. Used by thousands of content creators worldwide.
          </p>
          <div className="flex items-center justify-center gap-3 mb-16">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#171719] text-[#171719]" />
              ))}
            </div>
            <span 
              className="text-sm text-[#4C4B4B] font-light"
              style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
            >
              4.9/5 from 12,847 customers
            </span>
          </div>
        </div>
      </section>

      {/* Bundle Selection */}
      <section className="px-6 mb-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => setSelectedBundle('individual')}
              className={`p-8 border text-left transition-all duration-300 hover:scale-105 ${
                selectedBundle === 'individual' 
                  ? 'border-[#171719] bg-white shadow-sm' 
                  : 'border-[#B5B5B3] hover:border-[#171719] bg-white'
              }`}
            >
              <h3 
                className="text-2xl mb-3 text-[#171719] font-normal"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Individual Presets
              </h3>
              <p 
                className="text-[#4C4B4B] mb-4 font-light"
                style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
              >
                Choose your favorite bundles separately
              </p>
              <div 
                className="text-3xl font-normal text-[#171719]"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                $5 each
              </div>
            </button>
            
            <button
              onClick={() => setSelectedBundle('all')}
              className={`p-8 border text-left relative transition-all duration-300 hover:scale-105 ${
                selectedBundle === 'all' 
                  ? 'border-[#171719] bg-white shadow-sm' 
                  : 'border-[#B5B5B3] hover:border-[#171719] bg-white'
              }`}
            >
              <div 
                className="absolute -top-3 -right-3 bg-[#171719] text-white px-4 py-2 text-xs font-normal uppercase tracking-wide"
                style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
              >
                Save ${savings}
              </div>
              <h3 
                className="text-2xl mb-3 text-[#171719] font-normal"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Complete Collection
              </h3>
              <p 
                className="text-[#4C4B4B] mb-4 font-light"
                style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
              >
                All 4 preset bundles included
              </p>
              <div className="flex items-baseline gap-3">
                <span 
                  className="text-lg text-[#B5B5B3] line-through font-light"
                  style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                >
                  ${totalValue}
                </span>
                <span 
                  className="text-3xl font-normal text-[#171719]"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  ${bundlePrice}
                </span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Preset Grid */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-4xl lg:text-5xl text-center mb-16 text-[#171719] font-normal"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Choose Your Style
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {presets.map((preset) => (
              <div key={preset.id} className="bg-[#F1F1F1] border border-[#B5B5B3] hover:shadow-md hover:scale-105 transition-all duration-300">
                <div className="aspect-[3/4] bg-[#B5B5B3] relative overflow-hidden">
                  <img 
                    src={preset.previewImage} 
                    alt={preset.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <span 
                      className="text-white font-light text-sm uppercase tracking-wide"
                      style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                    >
                      Preview
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 
                    className="text-xl mb-2 text-[#171719] font-normal"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    {preset.name}
                  </h3>
                  <p 
                    className="text-sm text-[#4C4B4B] mb-6 font-light leading-relaxed"
                    style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                  >
                    {preset.description}
                  </p>
                  <ul className="space-y-2 mb-8">
                    {preset.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-[#4C4B4B] flex-shrink-0" />
                        <span 
                          className="text-sm text-[#4C4B4B] font-light"
                          style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {selectedBundle === 'individual' && (
                    <Link href={`/checkout/preset-${preset.id}`}>
                      <Button 
                        className="w-full bg-[#171719] text-white hover:bg-[#4C4B4B] font-normal uppercase tracking-wide text-sm py-3 transition-colors duration-300"
                        style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                      >
                        Buy Now - ${preset.price}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {selectedBundle === 'all' && (
            <div className="text-center mt-16">
              <Link href="/checkout/preset-bundle-all">
                <Button 
                  size="lg" 
                  className="bg-[#171719] text-white hover:bg-[#4C4B4B] px-12 py-4 text-lg font-normal uppercase tracking-wide transition-colors duration-300"
                  style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                >
                  Get All Presets for ${bundlePrice}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Before/After Examples */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 
            className="text-4xl lg:text-5xl text-center mb-16 text-[#171719] font-normal"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            See The Transformation
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="aspect-square bg-[#B5B5B3] rounded-sm mb-6"></div>
              <h3 
                className="text-xl mb-2 text-[#171719] font-normal"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Before
              </h3>
              <p 
                className="text-[#4C4B4B] text-sm font-light"
                style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
              >
                Raw, unedited photo
              </p>
            </div>
            <div className="text-center">
              <div className="aspect-square bg-[#B5B5B3] rounded-sm mb-6"></div>
              <h3 
                className="text-xl mb-2 text-[#171719] font-normal"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                After
              </h3>
              <p 
                className="text-[#4C4B4B] text-sm font-light"
                style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
              >
                With Glow Bundle applied
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 
            className="text-4xl lg:text-5xl text-center mb-16 text-[#171719] font-normal"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            What Creators Are Saying
          </h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-[#F1F1F1] border border-[#B5B5B3] p-8 text-center hover:shadow-md hover:scale-105 transition-all duration-300">
                <div className="flex justify-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#171719] text-[#171719]" />
                  ))}
                </div>
                <blockquote 
                  className="text-lg mb-6 leading-relaxed text-[#4C4B4B] italic font-normal"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  "{testimonial.content}"
                </blockquote>
                <div 
                  className="font-normal text-[#171719]"
                  style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                >
                  {testimonial.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 bg-[#171719] text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 
            className="text-4xl lg:text-5xl mb-8 font-normal"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Transform Your Photos Today
          </h2>
          <p 
            className="text-xl text-white/80 mb-12 font-light leading-relaxed"
            style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
          >
            Join thousands of creators who've elevated their content with our presets.
          </p>
          <div className="space-y-6">
            <Link href="/checkout/preset-bundle-all">
              <Button 
                size="lg" 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#171719] px-12 py-4 text-lg font-normal uppercase tracking-wide transition-all duration-300"
                style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
              >
                Get Complete Collection - ${bundlePrice}
              </Button>
            </Link>
            <div 
              className="text-sm text-white/60 font-light"
              style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
            >
              ✓ Instant download • ✓ 30-day guarantee • ✓ Works with Lightroom & Lightroom Mobile
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
