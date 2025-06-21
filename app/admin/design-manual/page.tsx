'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, X, Eye, Code, ChevronRight } from 'lucide-react'

export default function DesignManual() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const copyToClipboard = async (text: string, itemId: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedItem(itemId)
    setTimeout(() => setCopiedItem(null), 2000)
  }

  const philosophyChecklist = [
    { title: 'Editorial Excellence', description: 'Every element earns its place through intention and purpose' },
    { title: 'Accessible Luxury', description: 'Sophistication without intimidation, elegance with approachability' },
    { title: 'Purposeful Minimalism', description: 'Space is luxury. Every element breathes.' },
    { title: 'Timeless Modernity', description: 'Classic principles meet contemporary execution' }
  ]

  const colors = [
    { 
      name: 'Luxury Black', 
      hex: '#171719', 
      rgb: 'rgb(23, 23, 25)', 
      usage: 'The foundation of elegance. Used for primary text, key CTAs, and moments of emphasis.',
      textColor: '#F1F1F1'
    },
    { 
      name: 'Soft White', 
      hex: '#F1F1F1', 
      rgb: 'rgb(241, 241, 241)', 
      usage: 'Breathing space. Our canvas for content and the voice of serenity.',
      textColor: '#171719'
    },
    { 
      name: 'Warm Gray', 
      hex: '#B5B5B3', 
      rgb: 'rgb(181, 181, 179)', 
      usage: 'Subtle sophistication. For secondary elements and gentle guidance.',
      textColor: '#171719'
    },
  ]

  const migrationSteps = [
    { title: 'Audit Current Design', description: 'Document all instances of rounded corners, gradients, emojis, and non-brand colors. Create a comprehensive list for systematic updating.' },
    { title: 'Establish Grid System', description: 'Implement 12-column grid with consistent gutters. All elements must align to this grid for visual harmony.' },
    { title: 'Typography Migration', description: 'Replace all fonts with Bodoni Moda for headlines and Inter for body text. Update sizing to match hierarchy.' },
    { title: 'Color Refinement', description: 'Strip all colors except our three-tone palette. No exceptions. Simplicity is sophistication.' },
    { title: 'Component Update', description: 'Rebuild each component following new standards. Start with highest-traffic elements.' },
    { title: 'Quality Assurance', description: 'Test across all breakpoints. Ensure every interaction maintains luxury standard.' }
  ]

  const qualityChecklist = [
    'Would this appear in Vogue?',
    'Does it breathe with space?',
    'Is every element necessary?',
    'Does it guide without pushing?',
    'Is the hierarchy crystal clear?',
    'Would Sandra approve?'
  ]

  const cssVariables = `/* CSS Variables */
--luxury-black: #171719;
--soft-white: #F1F1F1;
--warm-gray: #B5B5B3;

/* No border-radius */
border-radius: 0;

/* No gradients */
background: solid-color-only;

/* Sharp shadows only */
box-shadow: none;

/* Consistent spacing */
--space-unit: 20px;`

  return (
    <div className="min-h-screen bg-soft-white">
      {/* Hero Section */}
      <section className="h-screen relative flex items-center justify-center bg-luxury-black overflow-hidden">
        <div className="absolute font-bodoni text-[60vw] font-bold opacity-[0.03] text-soft-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 leading-[0.8]">
          01
        </div>
        <div className="text-center text-soft-white z-10 relative">
          <p className="font-inter text-xs font-light tracking-[3px] uppercase mb-10 opacity-80">
            Design Migration Manual
          </p>
          <h1 className="font-bodoni text-6xl md:text-8xl font-light tracking-[-0.06em] leading-[0.9] mb-5">
            SELFIE AI™
          </h1>
          <p className="font-['Playfair_Display'] italic text-4xl md:text-6xl opacity-90">
            Luxury Editorial System
          </p>
        </div>
      </section>

      {/* Design Philosophy */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute font-bodoni text-[300px] font-bold opacity-[0.03] -top-20 right-[10%] leading-none">
          01
        </div>
        <div className="max-w-7xl mx-auto px-8 md:px-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <h2 className="font-bodoni text-6xl font-light tracking-[-0.04em] leading-[0.9]">
                Design<br/>Philosophy
              </h2>
            </div>
            <div className="md:col-span-8">
              <p className="text-lg leading-relaxed font-light max-w-3xl">
                Our design system embodies the intersection of high fashion editorial and digital excellence. 
                Every pixel is considered, every interaction intentional. We don't just create interfaces—we 
                craft experiences that whisper luxury while maintaining the warmth of a trusted friend.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16">
                {philosophyChecklist.map((item, index) => (
                  <div key={index} className="flex gap-5">
                    <div className="w-6 h-6 border border-luxury-black flex-shrink-0 relative group cursor-pointer">
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Check className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-normal tracking-[2px] uppercase mb-2">{item.title}</h4>
                      <p className="text-warm-gray">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Identity */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute font-bodoni text-[300px] font-bold opacity-[0.03] -top-20 right-[10%] leading-none">
          02
        </div>
        <div className="max-w-7xl mx-auto px-8 md:px-16 relative z-10">
          <h2 className="font-bodoni text-6xl font-light tracking-[-0.04em] mb-20">Brand Identity</h2>
          
          {/* Color Architecture */}
          <h3 className="font-bodoni text-4xl font-normal tracking-[-0.02em] mt-20 mb-16">Color Architecture</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {colors.map((color, index) => (
              <div 
                key={index} 
                className="aspect-[3/4] relative overflow-hidden cursor-pointer group"
                style={{ backgroundColor: color.hex }}
              >
                <div className="absolute bottom-10 left-10 right-10" style={{ color: color.textColor }}>
                  <div className="font-bodoni text-3xl font-normal mb-2">{color.name}</div>
                  <div className="text-sm font-light tracking-wider opacity-80">{color.hex}</div>
                  <div className="text-sm leading-relaxed mt-5 opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    {color.usage}
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(color.hex, `color-${index}`)}
                  className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: color.textColor }}
                >
                  {copiedItem === `color-${index}` ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            ))}
          </div>

          {/* Typography System */}
          <h3 className="font-bodoni text-4xl font-normal tracking-[-0.02em] mt-32 mb-16">Typography Hierarchy</h3>
          
          <div className="bg-white border border-warm-gray/20 p-20 relative">
            <span className="absolute top-10 left-10 text-xs tracking-[2px] uppercase text-warm-gray">
              Bodoni Moda — Editorial Serif
            </span>
            <div className="font-bodoni font-light text-2xl tracking-[0.5em] my-16 leading-loose">
              ABCDEFGHIJKLMNOPQRSTUVWXYZ<br/>
              abcdefghijklmnopqrstuvwxyz<br/>
              0123456789
            </div>
            <div className="space-y-8">
              <div className="font-bodoni text-7xl font-light tracking-[-0.06em]">Headlines speak volumes</div>
              <div className="font-bodoni text-5xl font-light tracking-[-0.04em]">Section headers guide the eye</div>
              <div className="font-bodoni text-4xl font-normal tracking-[-0.02em]">Subheads create hierarchy</div>
            </div>
          </div>

          <div className="bg-white border border-warm-gray/20 p-20 relative mt-10">
            <span className="absolute top-10 left-10 text-xs tracking-[2px] uppercase text-warm-gray">
              Inter — Functional Sans
            </span>
            <div className="font-inter font-extralight text-2xl tracking-[0.5em] my-16 leading-loose">
              ABCDEFGHIJKLMNOPQRSTUVWXYZ<br/>
              abcdefghijklmnopqrstuvwxyz<br/>
              0123456789
            </div>
            <div className="space-y-6">
              <div className="text-xl font-extralight leading-relaxed">
                Body text flows naturally, creating a comfortable reading experience that never competes with the content.
              </div>
              <div className="text-base font-extralight leading-relaxed">
                Standard paragraph text maintains legibility across all devices while preserving the sophisticated aesthetic.
              </div>
              <div className="text-sm font-light tracking-wider uppercase">BUTTON TEXT AND LABELS</div>
            </div>
          </div>
        </div>
      </section>

      {/* Component Architecture */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute font-bodoni text-[300px] font-bold opacity-[0.03] -top-20 right-[10%] leading-none">
          03
        </div>
        <div className="max-w-7xl mx-auto px-8 md:px-16 relative z-10">
          <h2 className="font-bodoni text-6xl font-light tracking-[-0.04em] mb-20">
            Component<br/>Architecture
          </h2>

          {/* Button Hierarchy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
            <div>
              <h4 className="text-sm font-normal tracking-[2px] uppercase mb-5">Button Hierarchy</h4>
              <p className="font-extralight">
                Our buttons don't shout—they confidently invite. Each interaction state is carefully 
                considered to maintain elegance while providing clear feedback.
              </p>
            </div>
            <div className="bg-white p-16 border border-warm-gray/20">
              <div className="flex gap-8 flex-wrap">
                <button className="bg-luxury-black text-white px-16 py-4 hover:bg-warm-gray transition-colors duration-300 relative overflow-hidden group">
                  <span className="relative z-10">PRIMARY ACTION</span>
                </button>
                <button className="bg-transparent border border-luxury-black px-16 py-4 hover:bg-luxury-black hover:text-white transition-colors duration-300">
                  SECONDARY ACTION
                </button>
              </div>
            </div>
          </div>

          {/* Form Elements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
            <div>
              <h4 className="text-sm font-normal tracking-[2px] uppercase mb-5">Form Elements</h4>
              <p className="font-extralight">
                Minimal intervention, maximum clarity. Our forms guide without overwhelming, 
                using subtle cues and generous space.
              </p>
            </div>
            <div className="bg-white p-16 border border-warm-gray/20">
              <div className="space-y-10">
                <div>
                  <label className="block text-xs font-light tracking-[2px] uppercase mb-4">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Sandra Johnson"
                    className="w-full p-5 border-b border-warm-gray/20 focus:border-luxury-black outline-none transition-colors bg-transparent text-lg font-extralight"
                  />
                </div>
                <div>
                  <label className="block text-xs font-light tracking-[2px] uppercase mb-4">Your Message</label>
                  <textarea 
                    rows={3}
                    placeholder="Tell us about your brand vision..."
                    className="w-full p-5 border-b border-warm-gray/20 focus:border-luxury-black outline-none transition-colors bg-transparent text-lg font-extralight resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card Systems */}
          <h3 className="font-bodoni text-4xl font-normal tracking-[-0.02em] mt-24 mb-12">Card Systems</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: '01', category: 'Tool Suite', title: 'Photo Vault', description: 'Your curated collection of brand-defining imagery' },
              { number: '02', category: 'Analytics', title: 'Brand Notes', description: 'Strategic insights for your content evolution' },
              { number: '03', category: 'Creation', title: 'Feed Designer', description: 'Craft your visual narrative with intention' }
            ].map((card, index) => (
              <div key={index} className="bg-white overflow-hidden group cursor-pointer">
                <div className="aspect-[3/4] bg-warm-gray/10 relative">
                  <div className="absolute font-bodoni text-[200px] font-bold opacity-5 -top-10 -right-5 leading-none">
                    {card.number}
                  </div>
                </div>
                <div className="p-10">
                  <div className="text-xs tracking-[2px] uppercase text-warm-gray mb-5">{card.category}</div>
                  <h3 className="font-bodoni text-4xl font-normal mb-5">{card.title}</h3>
                  <p className="font-extralight mb-8">{card.description}</p>
                  <button className="bg-luxury-black text-white px-8 py-3 text-xs tracking-[2px] uppercase hover:bg-warm-gray transition-colors duration-300">
                    <span>OPEN {card.category.toUpperCase()}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pattern Transformation */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute font-bodoni text-[300px] font-bold opacity-[0.03] -top-20 right-[10%] leading-none">
          04
        </div>
        <div className="max-w-7xl mx-auto px-8 md:px-16 relative z-10">
          <h2 className="font-bodoni text-6xl font-light tracking-[-0.04em] mb-20">
            Pattern<br/>Transformation
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Before/After Examples */}
            <div className="aspect-square bg-[#E8E8E8] flex items-center justify-center p-16 relative">
              <span className="absolute top-8 left-8 bg-luxury-black text-white px-5 py-2 text-[11px] tracking-[1.5px] uppercase">
                Before
              </span>
              <div className="text-center">
                <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] p-8 rounded-[20px] text-white shadow-lg">
                  <h4 className="mb-2">🎨 Tool Name</h4>
                  <p className="mb-5">Exciting feature! ✨</p>
                  <button className="bg-white text-[#667eea] px-5 py-2 rounded-full">
                    Get Started →
                  </button>
                </div>
              </div>
            </div>
            
            <div className="aspect-square bg-white border border-warm-gray/20 flex items-center justify-center p-16 relative">
              <span className="absolute top-8 left-8 bg-white border border-luxury-black px-5 py-2 text-[11px] tracking-[1.5px] uppercase">
                After
              </span>
              <div className="text-center relative">
                <div className="absolute font-bodoni text-[120px] opacity-5 -top-5 right-5 font-bold leading-none">04</div>
                <h4 className="font-bodoni text-3xl mb-4">Tool Name</h4>
                <p className="text-luxury-black mb-8 font-extralight">Strategic feature description</p>
                <button className="bg-luxury-black text-white px-16 py-4 text-xs tracking-[2px] uppercase hover:bg-warm-gray transition-colors duration-300">
                  <span>BEGIN</span>
                </button>
              </div>
            </div>

            {/* Navigation Example */}
            <div className="aspect-square bg-[#E8E8E8] flex items-center justify-center p-16 relative">
              <span className="absolute top-8 left-8 bg-luxury-black text-white px-5 py-2 text-[11px] tracking-[1.5px] uppercase">
                Before
              </span>
              <nav className="bg-[#f8f9fa] p-5 rounded-lg">
                <ul className="flex gap-5 list-none">
                  <li>🏠 Home</li>
                  <li>📱 Tools</li>
                  <li>💰 Pricing</li>
                  <li>📧 Contact</li>
                </ul>
              </nav>
            </div>
            
            <div className="aspect-square bg-white border border-warm-gray/20 flex items-center justify-center p-16 relative">
              <span className="absolute top-8 left-8 bg-white border border-luxury-black px-5 py-2 text-[11px] tracking-[1.5px] uppercase">
                After
              </span>
              <nav className="border-b border-warm-gray/20 pb-5">
                <ul className="flex gap-16 list-none">
                  <li className="text-xs tracking-[2px] uppercase">Home</li>
                  <li className="text-xs tracking-[2px] uppercase">Tools</li>
                  <li className="text-xs tracking-[2px] uppercase">Pricing</li>
                  <li className="text-xs tracking-[2px] uppercase">Contact</li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Responsive Excellence */}
          <h3 className="font-bodoni text-4xl font-normal tracking-[-0.02em] mt-32 mb-16">Responsive Excellence</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { device: 'Mobile 375px', width: 'max-w-sm' },
              { device: 'Tablet 768px', width: 'max-w-md' },
              { device: 'Desktop 1440px', width: 'max-w-lg' }
            ].map((device, index) => (
              <div key={index} className="bg-white border-2 border-luxury-black p-10 relative">
                <span className="absolute -top-4 left-8 bg-white px-4 text-[11px] tracking-[1.5px] uppercase">
                  {device.device}
                </span>
                <div className="bg-soft-white min-h-[400px] p-8">
                  <h3 className="font-bodoni text-3xl text-center mb-10">Tool Suite</h3>
                  <div className="bg-white border border-warm-gray/20 p-8 relative">
                    <div className="absolute font-bodoni text-6xl opacity-5 -top-2 right-2 font-bold">01</div>
                    <h4 className="font-bodoni text-2xl mb-2">Photo Vault</h4>
                    <p className="text-sm text-warm-gray mb-5">Curated imagery</p>
                    <button className="bg-luxury-black text-white px-6 py-2 text-xs tracking-wider uppercase w-full">OPEN</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Excellence */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute font-bodoni text-[300px] font-bold opacity-[0.03] -top-20 right-[10%] leading-none">
          05
        </div>
        <div className="max-w-7xl mx-auto px-8 md:px-16 relative z-10">
          <h2 className="font-bodoni text-6xl font-light tracking-[-0.04em] mb-20">
            Implementation<br/>Excellence
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Migration Protocol */}
            <div>
              <h3 className="font-bodoni text-4xl font-normal mb-10">Migration Protocol</h3>
              <div className="space-y-12">
                {migrationSteps.map((step, index) => (
                  <div key={index} className="relative pl-24">
                    <div className="absolute left-0 top-0 font-bodoni text-7xl font-light opacity-10">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <h4 className="text-sm font-normal tracking-[2px] uppercase mb-3">{step.title}</h4>
                    <p className="font-extralight">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality Standards */}
            <div>
              <h3 className="font-bodoni text-4xl font-normal mb-10">Quality Standards</h3>
              <div className="bg-white p-16 border border-warm-gray/20">
                <h4 className="text-sm font-normal tracking-[2px] uppercase mb-10">The Vogue Test</h4>
                <div className="space-y-6">
                  {qualityChecklist.map((item, index) => (
                    <div key={index} className="flex gap-5">
                      <div className="w-6 h-6 border border-luxury-black flex-shrink-0 relative group cursor-pointer">
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Check className="w-4 h-4" />
                        </div>
                      </div>
                      <p className="font-extralight">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <h4 className="text-sm font-normal tracking-[2px] uppercase mt-16 mb-6">Technical Excellence</h4>
              <div className="bg-luxury-black text-soft-white p-10 font-mono text-sm">
                <button
                  onClick={() => copyToClipboard(cssVariables, 'css-vars')}
                  className="float-right text-soft-white/60 hover:text-soft-white"
                >
                  {copiedItem === 'css-vars' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
                <pre>{cssVariables}</pre>
              </div>
            </div>
          </div>

          {/* Design Excellence Manifesto */}
          <div className="mt-32 max-w-3xl">
            <h3 className="font-bodoni text-4xl font-normal mb-8">Design Excellence Manifesto</h3>
            <p className="text-xl leading-relaxed font-extralight mb-8">
              This is not just a style guide—it's a commitment to excellence. Every decision should elevate 
              the brand, every interaction should feel intentional, and every element should contribute to 
              the story of transformation that SELFIE AI™ represents.
            </p>
            <p className="text-xl leading-relaxed font-extralight">
              Remember: We're not just building a platform. We're crafting an experience that makes every 
              user feel like they have their own personal Vogue editor, guiding them toward their most 
              confident self.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-luxury-black text-soft-white py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
            <div className="md:col-span-1">
              <div className="font-bodoni text-5xl font-light tracking-[-0.02em] mb-5">SELFIE AI™</div>
              <p className="font-['Playfair_Display'] italic text-xl opacity-80">
                Where luxury meets personal transformation
              </p>
            </div>
            <div>
              <h4 className="text-sm font-normal tracking-[2px] uppercase mb-8 text-soft-white">Resources</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-warm-gray hover:text-soft-white transition-colors">Component Library</a></li>
                <li><a href="#" className="text-warm-gray hover:text-soft-white transition-colors">Brand Guidelines</a></li>
                <li><a href="#" className="text-warm-gray hover:text-soft-white transition-colors">Development Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-normal tracking-[2px] uppercase mb-8 text-soft-white">Support</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-warm-gray hover:text-soft-white transition-colors">Migration Help</a></li>
                <li><a href="#" className="text-warm-gray hover:text-soft-white transition-colors">Quality Standards</a></li>
                <li><a href="#" className="text-warm-gray hover:text-soft-white transition-colors">Contact Team</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-soft-white/20 flex justify-between items-center text-xs tracking-wider uppercase opacity-60">
            <div>© 2025 SELFIE AI™</div>
            <div>Design System v4.0</div>
          </div>
        </div>
      </footer>
    </div>
  )
} 