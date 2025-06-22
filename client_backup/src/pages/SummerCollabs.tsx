import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/layout/Header';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

export default function SummerCollabs() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    collaborationType: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.company || !formData.email || !formData.collaborationType || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/collab-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSubmitted(true);
        toast({
          title: "Inquiry Submitted",
          description: "Thank you for your interest! We'll be in touch soon.",
          className: "bg-[#F5E6DC] border-[#F5E6DC] text-black",
        });

        // Reset form
        setFormData({
          name: '',
          company: '',
          email: '',
          collaborationType: '',
          message: ''
        });
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: "Please try again or email directly.",
        variant: "destructive",
      });
    }
  };

  const scrollToForm = () => {
    document.getElementById('collaboration-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMediaKitDownload = async () => {
    try {
      const response = await fetch('/api/download/media-kit');
      const result = await response.json();

      if (response.ok && result.success) {
        // Track analytics event
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'download', {
            event_category: 'engagement',
            event_label: 'media_kit_marbella',
            value: 1,
          });
        }

        // Open download in new tab
        window.open(result.downloadUrl, '_blank');

        toast({
          title: "Download Started",
          description: "Media kit download ready",
          className: "bg-[#F5E6DC] border-[#F5E6DC] text-black",
        });
      } else {
        throw new Error(result.message || 'Download failed');
      }
    } catch (error) {
      console.error('Media kit download error:', error);
      toast({
        title: "Download Error",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    }
  };

  const openLightbox = (media) => {
    setSelectedMedia(media);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setSelectedMedia(null);
    setLightboxOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      <Header />

      {/* Hero Section - Luxury Upgrade */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://i.postimg.cc/W4tbWRNr/45.png")',
          }}
        />
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(rgba(23, 23, 25, 0.5), rgba(23, 23, 25, 0.5))'
          }}
        />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <h1 
            className="text-6xl md:text-8xl lg:text-9xl mb-8 text-white leading-tight tracking-wide"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 'normal' }}
          >
            Sandra in Marbella
          </h1>

          <p 
            className="text-xl md:text-2xl text-white mb-12 max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: 'Neue Einstellung, Inter, sans-serif', fontWeight: 300 }}
          >
            "A summer of sun, stories, and brand storytelling."
          </p>

          <Button 
            onClick={scrollToForm}
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black text-lg px-12 py-4 font-normal tracking-wide uppercase"
            style={{ 
              borderRadius: 0,
              fontFamily: 'Neue Einstellung, Inter, sans-serif'
            }}
          >
            Partner With Me
          </Button>
        </div>
      </section>

      {/* About Sandra Block - with Split Background */}
      <section className="py-20 px-6 bg-[#F1F1F1] relative">
        {/* Subtle side visual */}
        <div 
          className="absolute right-0 top-0 w-1/3 h-full bg-cover bg-left opacity-5"
          style={{
            backgroundImage: 'url("https://i.postimg.cc/zBgDNnRG/44.png")',
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 
                className="text-5xl md:text-6xl mb-8 text-[#171719]"
                className="font-cormorant"
              >
                Hi, I'm Sandra.
              </h2>

              <div 
                className="text-xl text-[#4C4B4B] leading-relaxed space-y-6"
                style={{ fontFamily: 'Neue Einstellung, Inter, sans-serif', fontWeight: 300 }}
              >
                <p>Single mom. Branding coach. Creator.</p>
                <p>
                  With over 120K combined followers and a signature look that blends glam and grit, 
                  I help women turn their face into their brand.
                </p>
                <p>
                  This summer, I'm bringing my camera, content, and community to Marbella. 
                  Let's create magic together.
                </p>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div 
                className="aspect-square bg-cover bg-center"
                style={{
                  backgroundImage: 'url("https://i.postimg.cc/hvX1tcdK/sandra-portrait.png")',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats + Reach Preview - with Background Layer */}
      <section className="py-20 px-6 bg-[#B5B5B3] relative">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: 'url("https://i.postimg.cc/CxGjhqkJ/109.png")',
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/90 p-8 text-center">
              <h3 
                className="text-4xl font-normal mb-2 text-[#171719]"
                className="font-cormorant"
              >
                55,000+
              </h3>
              <p 
                className="text-[#4C4B4B] uppercase tracking-wide"
                style={{ fontFamily: 'Neue Einstellung, Inter, sans-serif', fontWeight: 300 }}
              >
                TikTok Followers
              </p>
            </div>

            <div className="bg-white/90 p-8 text-center">
              <h3 
                className="text-4xl font-normal mb-2 text-[#171719]"
                className="font-cormorant"
              >
                73,600+
              </h3>
              <p 
                className="text-[#4C4B4B] uppercase tracking-wide"
                style={{ fontFamily: 'Neue Einstellung, Inter, sans-serif', fontWeight: 300 }}
              >
                Instagram Followers
              </p>
            </div>

            <div className="bg-white/90 p-8 text-center">
              <h3 
                className="text-4xl font-normal mb-2 text-[#171719]"
                className="font-cormorant"
              >
                1.7M+
              </h3>
              <p 
                className="text-[#4C4B4B] uppercase tracking-wide"
                style={{ fontFamily: 'Neue Einstellung, Inter, sans-serif', fontWeight: 300 }}
              >
                Monthly Reach
              </p>
            </div>

            <div className="bg-white/90 p-8 text-center">
              <h3 
                className="text-4xl font-normal mb-2 text-[#171719]"
                className="font-cormorant"
              >
                High
              </h3>
              <p 
                className="text-[#4C4B4B] uppercase tracking-wide"
                style={{ fontFamily: 'Neue Einstellung, Inter, sans-serif', fontWeight: 300 }}
              >
                Engagement Rate
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <p 
              className="text-[#171719] mb-6"
              style={{ fontFamily: 'Neue Einstellung, Inter, sans-serif', fontWeight: 300 }}
            >
              Top audience location: Norway, Sweden, UK, US<br />
              Primary content: Beauty, branding, confidence, lifestyle
            </p>

            <Button 
              onClick={handleMediaKitDownload}
              className="bg-transparent border-2 border-[#171719] text-[#171719] hover:bg-[#171719] hover:text-white text-lg px-12 py-4 font-normal tracking-wide uppercase"
              style={{ 
                borderRadius: 0,
                fontFamily: 'Neue Einstellung, Inter, sans-serif'
              }}
            >
              Download Media Kit
            </Button>
          </div>
        </div>
      </section>

      {/* Content Examples Gallery */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-5xl md:text-6xl text-center mb-16 text-[#171719]"
            className="font-cormorant"
          >
            What brand storytelling looks like with me.
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group cursor-pointer" onClick={() => openLightbox({ media_type: 'IMAGE', media_url: 'https://i.postimg.cc/0QVy2L7N/Heroimagehomaepage_(1).png', caption: 'Behind the scenes filming' })}>
              <div 
                className="aspect-square bg-cover bg-center transition-transform duration-300 group-hover:scale-105 border border-[#B5B5B3]"
                style={{
                  backgroundImage: 'url("https://i.postimg.cc/0QVy2L7N/Heroimagehomaepage_(1).png")',
                }}
              />
              <p 
                className="text-center mt-4 text-[#4C4B4B] opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ fontFamily: 'Neue Einstellung, Inter, sans-serif', fontWeight: 300 }}
              >
                Behind the scenes filming
              </p>
            </div>

            <div className="group cursor-pointer" onClick={() => openLightbox({ media_type: 'VIDEO', media_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', caption: 'Viral content creation' })}>
              <div className="aspect-square bg-black flex items-center justify-center transition-transform duration-300 group-hover:scale-105 border border-[#B5B5B3]">
                <div className="text-white text-center">
                  <div className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
                  </div>
                  <p 
                    className="text-sm"
                    style={{ fontFamily: 'Neue Einstellung, Inter, sans-serif', fontWeight: 300 }}
                  >
                    TikTok Style Reel<br />
                    Coming Soon
                  </p>
                </div>
              </div>
              <p 
                className="text-center mt-4 text-[#4C4B4B] opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ fontFamily: 'Neue Einstellung, Inter, sans-serif', fontWeight: 300 }}
              >
                Viral content creation
              </p>
            </div>

            <div className="group cursor-pointer" onClick={() => openLightbox({ media_type: 'IMAGE', media_url: 'https://i.postimg.cc/N097BN8X/2.png', caption: 'Marbella lifestyle content' })}>
              <div 
                className="aspect-square bg-cover bg-center transition-transform duration-300 group-hover:scale-105 border border-[#B5B5B3]"
                style={{
                  backgroundImage: 'url("https://i.postimg.cc/N097BN8X/2.png")',
                }}
              />
              <p 
                className="text-center mt-4 text-[#4C4B4B] opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ fontFamily: 'Neue Einstellung, Inter, sans-serif', fontWeight: 300 }}
              >
                Marbella lifestyle content
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-20 px-6 bg-[#F1F1F1]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 
            className="text-4xl md:text-5xl mb-4 text-[#171719]"
            className="font-cormorant"
          >
            Brands I've partnered with:
          </h2>

          <p 
            className="text-xl text-[#4C4B4B] mb-12"
            style={{ fontFamily: 'Neue Einstellung, Inter, sans-serif', fontWeight: 300 }}
          >
            From global icons to boutique disruptors.
          </p>

          {/* Brand logos grid */}
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center">
            <div className="flex items-center justify-center h-24 md:h-28 p-4 bg-white transition-all duration-300 hover:scale-105 hover:shadow-md">
              <img 
                src="https://i.postimg.cc/mrVY3t3b/1.png" 
                alt="Brand Partner 1" 
                className="w-28 md:w-44 h-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300" 
              />
            </div>
            <div className="flex items-center justify-center h-24 md:h-28 p-4 bg-white transition-all duration-300 hover:scale-105 hover:shadow-md">
              <img 
                src="https://i.postimg.cc/fbM70x92/2.png" 
                alt="Brand Partner 2" 
                className="w-28 md:w-44 h-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300" 
              />
            </div>
            <div className="flex items-center justify-center h-24 md:h-28 p-4 bg-white transition-all duration-300 hover:scale-105 hover:shadow-md">
              <img 
                src="https://i.postimg.cc/RFFcg4Gw/3.png" 
                alt="Brand Partner 3" 
                className="w-28 md:w-44 h-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300" 
              />
            </div>
            <div className="flex items-center justify-center h-24 md:h-28 p-4 bg-white transition-all duration-300 hover:scale-105 hover:shadow-md">
              <img 
                src="https://i.postimg.cc/KzHtVwsw/4.png" 
                alt="Brand Partner 4" 
                className="w-28 md:w-44 h-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300" 
              />
            </div>
            <div className="flex items-center justify-center h-24 md:h-28 p-4 bg-white transition-all duration-300 hover:scale-105 hover:shadow-md">
              <img 
                src="https://i.postimg.cc/4yHpTPDd/5.png" 
                alt="Brand Partner 5" 
                className="w-28 md:w-44 h-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300" 
              />
            </div>
            <div className="flex items-center justify-center h-24 md:h-28 p-4 bg-white transition-all duration-300 hover:scale-105 hover:shadow-md">
              <img 
                src="https://i.postimg.cc/dDMrQdF9/6.png" 
                alt="Brand Partner 6" 
                className="w-28 md:w-44 h-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300" 
              />
            </div>
            <div className="flex items-center justify-center h-24 md:h-28 p-4 bg-white transition-all duration-300 hover:scale-105 hover:shadow-md">
              <img 
                src="https://i.postimg.cc/2j1t6Dmq/7.png" 
                alt="Brand Partner 7" 
                className="w-28 md:w-44 h-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300" 
              />
            </div>
            <div className="flex items-center justify-center h-24 md:h-28 p-4 bg-white transition-all duration-300 hover:scale-105 hover:shadow-md">
              <img 
                src="https://i.postimg.cc/jqBFnFdM/8.png" 
                alt="Brand Partner 8" 
                className="w-28 md:w-44 h-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300" 
              />
            </div>
            <div className="flex items-center justify-center h-24 md:h-28 p-4 bg-white transition-all duration-300 hover:scale-105 hover:shadow-md">
              <img 
                src="https://i.postimg.cc/fRNqBSdX/9.png" 
                alt="Brand Partner 9" 
                className="w-28 md:w-44 h-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300" 
              />
            </div>
            <div className="flex items-center justify-center h-24 md:h-28 p-4 bg-white transition-all duration-300 hover:scale-105 hover:shadow-md">
              <img 
                src="https://i.postimg.cc/CLD6GsRS/10.png" 
                alt="Brand Partner 10" 
                className="w-28 md:w-44 h-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300" 
              />
            </div>
            <div className="flex items-center justify-center h-24 md:h-28 p-4 bg-white transition-all duration-300 hover:scale-105 hover:shadow-md">
              <img 
                src="https://i.postimg.cc/rwNnbyGH/11.png" 
                alt="Brand Partner 11" 
                className="w-28 md:w-44 h-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300" 
              />
            </div>
            <div className="flex items-center justify-center h-24 md:h-28 p-4 bg-white transition-all duration-300 hover:scale-105 hover:shadow-md">
              <img 
                src="https://i.postimg.cc/Pqf3kG25/12.png" 
                alt="Brand Partner 12" 
                className="w-28 md:w-44 h-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* What I Offer - with Background */}
      <section className="py-20 px-6 bg-white relative">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: 'url("https://i.postimg.cc/cJTwYGDn/111.png")',
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <h2 
            className="text-5xl md:text-6xl text-center mb-16 text-[#171719]"
            className="font-cormorant"
          >
            What I Offer
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="border border-[#B5B5B3] p-8 bg-white/90">
              <h3 
                className="text-2xl mb-4 text-[#171719]"
                className="font-cormorant"
              >
                Content Feature
              </h3>
              <p 
                className="text-[#4C4B4B]"
                style={{ fontFamily: 'Neue Einstellung, Inter, sans-serif', fontWeight: 300 }}
              >
                1 Reel + 1 Story Mention + Tag
              </p>
            </div>

            <div className="border border-[#B5B5B3] p-8 bg-white/90">
              <h3 
                className="text-2xl mb-4 text-[#171719]"
                className="font-cormorant"
              >
                Editorial Set
              </h3>
              <p 
                className="text-[#4C4B4B]"
                style={{ fontFamily: 'Neue Einstellung, Inter, sans-serif', fontWeight: 300 }}
              >
                1 UGC video, 3 stills, brand styling
              </p>
            </div>

            <div className="border border-[#B5B5B3] p-8 bg-white/90">
              <h3 
                className="text-2xl mb-4 text-[#171719]"
                className="font-cormorant"
              >
                Full Campaign
              </h3>
              <p 
                className="text-[#4C4B4B]"
                style={{ fontFamily: 'Neue Einstellung, Inter, sans-serif', fontWeight: 300 }}
              >
                1-week activation, product placement, 5 assets
              </p>
            </div>

            <div className="border border-[#B5B5B3] p-8 bg-white/90">
              <h3 
                className="text-2xl mb-4 text-[#171719]"
                className="font-cormorant"
              >
                VIP Co-Creation
              </h3>
              <p 
                className="text-[#4C4B4B]"
                style={{ fontFamily: 'Neue Einstellung, Inter, sans-serif', fontWeight: 300 }}
              >
                Let's design something iconic together (custom quote)
              </p>
            </div>
          </div>

          <div className="bg-[#F1F1F1]/80 p-8 text-center rounded-sm">
            <p 
              className="text-[#4C4B4B] italic"
              style={{ fontFamily: 'Neue Einstellung, Inter, sans-serif', fontWeight: 300 }}
            >
              "All content is created and edited by me. I use my own camera gear, 
              editorial presets, and proven content strategy."
            </p>
          </div>
        </div>
      </section>

      {/* Collaboration Form */}
      <section id="collaboration-form" className="py-20 px-6 bg-[#B5B5B3]">
        <div className="max-w-2xl mx-auto">
          <h2 
            className="text-5xl md:text-6xl text-center mb-4 text-[#171719]"
            className="font-cormorant"
          >
            Let's Collaborate — Summer '25
          </h2>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6 mt-12">
              <div>
                <Input
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="bg-white border-[#171719] rounded-none p-4 text-lg"
                  style={{ fontFamily: 'Neue Einstellung, Inter, sans-serif' }}
                />
              </div>

              <div>
                <Input
                  placeholder="Brand / Company"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  required
                  className="bg-white border-[#171719] rounded-none p-4 text-lg"
                  style={{ fontFamily: 'Neue Einstellung, Inter, sans-serif' }}
                />
              </div>

              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="bg-white border-[#171719] rounded-none p-4 text-lg"
                  style={{ fontFamily: 'Neue Einstellung, Inter, sans-serif' }}
                />
              </div>

              <div>
                <Select value={formData.collaborationType} onValueChange={(value) => setFormData({...formData, collaborationType: value})}>
                  <SelectTrigger className="bg-white border-[#171719] rounded-none p-4 text-lg">
                    <SelectValue placeholder="Type of collaboration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="content-feature">Content Feature</SelectItem>
                    <SelectItem value="editorial-set">Editorial Set</SelectItem>
                    <SelectItem value="full-campaign">Full Campaign</SelectItem>
                    <SelectItem value="vip-co-creation">VIP Co-Creation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Textarea
                  placeholder="Message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={4}
                  className="bg-white border-[#171719] rounded-none p-4 text-lg"
                  style={{ fontFamily: 'Neue Einstellung, Inter, sans-serif' }}
                />
              </div>

              <div className="text-center">
                <Button 
                  type="submit"
                  className="bg-transparent border-2 border-[#171719] text-[#171719] hover:bg-[#171719] hover:text-white text-lg px-12 py-4 font-normal tracking-wide uppercase transition-all duration-300"
                  style={{ 
                    borderRadius: 0,
                    fontFamily: 'Cormorant Garamond, serif'
                  }}
                >
                  Submit Inquiry
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-12">
              <h3 
                className="text-3xl mb-4 text-[#171719]"
                className="font-cormorant"
              >
                Thank you for your inquiry!
              </h3>
              <p 
                className="text-[#4C4B4B]"
                style={{ fontFamily: 'Neue Einstellung, Inter, sans-serif', fontWeight: 300 }}
              >
                I'll be in touch within 24 hours to discuss our collaboration.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Final CTA Footer - with Background */}
      <footer className="relative py-20 px-6">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://i.postimg.cc/ncQrZfB1/11.png")',
          }}
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <blockquote 
            className="text-4xl md:text-5xl mb-12 italic text-white"
            className="font-cormorant"
          >
            "Let's co-create something unforgettable."
          </blockquote>
          <p 
            className="text-xl mb-12 text-white"
            className="font-cormorant"
          >
            — Sandra
          </p>

          <div className="flex justify-center space-x-8 text-lg">
            <Link href="/" className="hover:text-[#B5B5B3] transition-colors text-white">
              <span className="font-cormorant">Back to Selfie AI</span>
            </Link>
            <a href="#" className="hover:text-[#B5B5B3] transition-colors text-white">
              <span className="font-cormorant">Instagram</span>
            </a>
            <a href="#" className="hover:text-[#B5B5B3] transition-colors text-white">
              <span className="font-cormorant">Email Me</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Fixed Media Kit Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button 
          className="bg-[#171719] text-white hover:bg-[#4C4B4B] text-sm px-6 py-3 font-normal tracking-wide uppercase shadow-lg transition-all duration-300"
          style={{ 
            borderRadius: 0,
            fontFamily: 'Neue Einstellung, Inter, sans-serif'
          }}
        >
          Download Media Kit
        </Button>
      </div>

      {/* Lightbox Overlay */}
      {lightboxOpen && selectedMedia && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="bg-white rounded-lg overflow-hidden">
              {selectedMedia.media_type === 'VIDEO' ? (
                <video 
                  src={selectedMedia.media_url}
                  controls
                  autoPlay
                  className="max-w-full max-h-[80vh] object-contain"
                />
              ) : (
                <img 
                  src={selectedMedia.media_url}
                  alt={selectedMedia.caption || 'Instagram content'}
                  className="max-w-full max-h-[80vh] object-contain"
                />
              )}

              {selectedMedia.caption && (
                <div className="p-6">
                  <p 
                    className="text-[#171719]"
                    style={{ fontFamily: 'Neue Einstellung, Inter, sans-serif', fontWeight: 300 }}
                  >
                    {selectedMedia.caption}
                  </p>
                  {selectedMedia.permalink && (
                    <a 
                      href={selectedMedia.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 text-[#171719] underline hover:no-underline"
                      style={{ fontFamily: 'Neue Einstellung, Inter, sans-serif', fontWeight: 300 }}
                    >
                      View on Instagram
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}