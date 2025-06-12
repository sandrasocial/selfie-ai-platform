import React, { useState } from 'react';
import { Link } from "wouter";
import { Camera, Edit, Sparkles, MessageCircle, Target, ImageIcon, Grid3x3, Upload, FileImage, Quote, StickyNote, Tag, Calendar, Save, Download, RotateCcw, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SubscriptionStatusWidget from "@/components/SubscriptionStatusWidget";
import TierAccessGuard from "@/components/TierAccessGuard";
import { useQuery } from "@tanstack/react-query";

export default function Studio() {
  const { data: user } = useQuery({
    queryKey: ["/api/me"],
    retry: false,
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [gridView, setGridView] = useState<'grid' | 'calendar'>('grid');
  const [filterPreset, setFilterPreset] = useState('natural');
  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    contrast: 0,
    warmth: 0,
    sharpness: 0
  });
  const [showOriginal, setShowOriginal] = useState(false);

  const toolsData = [
    {
      title: "Selfie Editor",
      description: "AI filters + photo adjustment",
      image: "https://i.postimg.cc/C1hK0FBt/heroimage_homepage_(1).png",
      href: "/studio/editor"
    },
    {
      title: "Feed Designer",
      description: "Grid planner with drag-to-schedule",
      image: "https://i.postimg.cc/d05zmx5K/2.png",
      href: "/studio/feed-designer"
    },
    {
      title: "Photo Vault",
      description: "Browse, filter, and manage uploads",
      image: "https://i.postimg.cc/dQ5q8mbb/22.png",
      href: "/studio/photo-vault"
    },
    {
      title: "Daily Upload Boost",
      description: "Quote widget + reminder",
      image: "https://i.postimg.cc/SK4F0n0L/85.png",
      href: "/studio/boost"
    },
    {
      title: "Brand Notes",
      description: "Notion-style notes per photo",
      image: "https://i.postimg.cc/KY664Mz6/8.png",
      href: "/studio/notes"
    },
    {
      title: "Auto Tagger",
      description: "Mood, tone, lighting suggestions",
      image: "https://i.postimg.cc/6QVKTdV1/36.png",
      href: "/studio/tagger"
    }
  ];

  const vaultImages = [
    "https://i.postimg.cc/HLN6LDSj/15.png",
    "https://i.postimg.cc/Bbn4rXK7/3.png",
    "https://i.postimg.cc/nhDpf8Xx/35.png",
    "https://i.postimg.cc/26JSx8ss/5.png",
    "https://i.postimg.cc/dQ5q8mbb/22.png",
    "https://i.postimg.cc/V673b4J4/81.png"
  ];

  const voguFilters = [
    { name: 'Natural', value: 'natural' },
    { name: 'Luminous', value: 'luminous' },
    { name: 'Editorial', value: 'editorial' },
    { name: 'Moody', value: 'moody' },
    { name: 'Minimal', value: 'minimal' },
    { name: 'Vogue', value: 'vogue' }
  ];

  const motivationQuotes = [
    "Your face is your brand. Show it boldly.",
    "Every selfie is a signature.",
    "Confidence captured, beauty amplified.",
    "Your story lives in every frame."
  ];

  const [currentQuote] = useState(motivationQuotes[0]);

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      <Header user={user} />

      {/* Hero Section */}
      <section 
        className="w-full min-h-[70vh] flex items-center justify-center px-4 relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://i.postimg.cc/rwgGZ6jy/flatlay-overlay-Url.png')`,
        }}
      >
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-normal mb-8 leading-tight uppercase tracking-tight" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F1F1F1' }}>
            Studio
          </h1>
          <div className="w-24 h-px mx-auto mb-8" style={{ backgroundColor: '#F1F1F1' }}></div>
          <p className="text-lg md:text-xl mb-12 max-w-4xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#F1F1F1' }}>
            Your tools for visual branding, caption clarity, and personal brand strategy—powered by AI, styled by you.
          </p>
        </div>
      </section>

      {/* Subscription Status */}
      <section className="py-8 px-4 bg-[#F1F1F1]">
        <div className="max-w-4xl mx-auto">
          <SubscriptionStatusWidget compact />
        </div>
      </section>

      {/* Tool Suite Grid */}
      <section className="py-20 px-4 bg-[#F1F1F1]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {toolsData.map((tool, index) => {
              // Determine tier requirements for each tool
              const getToolTier = (toolTitle: string) => {
                switch (toolTitle) {
                  case 'Feed Designer':
                  case 'Brand Notes':
                    return 'starter';
                  case 'Photo Vault':
                  case 'Auto Tagger':
                    return 'branded';
                  case 'Daily Upload Boost':
                    return 'vip';
                  default:
                    return null; // Free tier
                }
              };

              const requiredTier = getToolTier(tool.title);

              const getTierBadge = (tier: string) => {
                if (tier === 'vip') {
                  return (
                    <Badge 
                      className="uppercase tracking-wide absolute top-4 right-4 z-20"
                      style={{ 
                        backgroundColor: '#171719',
                        color: 'white',
                        fontFamily: 'Neue Einstellung, sans-serif',
                        fontSize: '12px',
                        letterSpacing: '0.5px',
                        borderRadius: '0px',
                        border: 'none'
                      }}
                    >
                      VIP
                    </Badge>
                  );
                }
                
                return (
                  <Badge 
                    className="uppercase tracking-wide absolute top-4 right-4 z-20"
                    style={{ 
                      backgroundColor: '#B5B5B3',
                      color: '#171719',
                      fontFamily: 'Neue Einstellung, sans-serif',
                      fontSize: '12px',
                      letterSpacing: '0.5px',
                      borderRadius: '0px',
                      border: 'none'
                    }}
                  >
                    PRO
                  </Badge>
                );
              };

              if (!requiredTier) {
                // Free tier tool
                return (
                  <Link href={tool.href} key={tool.title} className="block group">
                    <Card 
                      className="bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.03] cursor-pointer overflow-hidden"
                      style={{ border: '1px solid #B5B5B3', borderRadius: '0px' }}
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        <img 
                          src={tool.image} 
                          alt={tool.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-8">
                        <h3 
                          className="text-2xl mb-3 transition-colors tracking-wide group-hover:underline" 
                          style={{ fontFamily: 'Cormorant Garamond, serif', color: '#171719' }}
                        >
                          {tool.title}
                        </h3>
                        <div 
                          className="w-12 h-px mb-4 group-hover:w-16 transition-all duration-300" 
                          style={{ backgroundColor: '#171719' }}
                        ></div>
                        <p 
                          className="text-sm leading-relaxed" 
                          style={{ fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#171719' }}
                        >
                          {tool.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              }

              // Tier-restricted tool
              return (
                <TierAccessGuard 
                  key={tool.title}
                  requiredTier={requiredTier as 'starter' | 'branded' | 'vip'}
                  showUpgrade={true}
                  fallbackComponent={
                    <Card 
                      className="bg-white shadow-sm cursor-not-allowed overflow-hidden relative group"
                      style={{ border: '1px solid #B5B5B3', borderRadius: '0px' }}
                    >
                      {getTierBadge(requiredTier)}
                      
                      <div className="aspect-[4/3] overflow-hidden">
                        <img 
                          src={tool.image} 
                          alt={tool.title}
                          className="w-full h-full object-cover"
                          style={{ filter: 'blur(2px)', opacity: '0.6' }}
                        />
                      </div>
                      
                      <CardContent className="p-8">
                        <h3 
                          className="text-2xl mb-3 tracking-wide" 
                          style={{ fontFamily: 'Cormorant Garamond, serif', color: '#171719', opacity: '0.7' }}
                        >
                          {tool.title}
                        </h3>
                        <div 
                          className="w-12 h-px mb-4" 
                          style={{ backgroundColor: '#171719', opacity: '0.7' }}
                        ></div>
                        <p 
                          className="text-sm leading-relaxed mb-4" 
                          style={{ fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#171719', opacity: '0.7' }}
                        >
                          {tool.description}
                        </p>
                        
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p 
                            className="text-sm font-medium"
                            style={{ 
                              fontFamily: 'Neue Einstellung, sans-serif',
                              color: '#171719',
                              letterSpacing: '0.5px',
                              textTransform: 'uppercase'
                            }}
                          >
                            Unlock This Tool
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  }
                >
                  <Link href={tool.href} className="block group">
                    <Card 
                      className="bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.03] cursor-pointer overflow-hidden"
                      style={{ border: '1px solid #B5B5B3', borderRadius: '0px' }}
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        <img 
                          src={tool.image} 
                          alt={tool.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-8">
                        <h3 
                          className="text-2xl mb-3 transition-colors tracking-wide group-hover:underline" 
                          style={{ fontFamily: 'Cormorant Garamond, serif', color: '#171719' }}
                        >
                          {tool.title}
                        </h3>
                        <div 
                          className="w-12 h-px mb-4 group-hover:w-16 transition-all duration-300" 
                          style={{ backgroundColor: '#171719' }}
                        ></div>
                        <p 
                          className="text-sm leading-relaxed" 
                          style={{ fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#171719' }}
                        >
                          {tool.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </TierAccessGuard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Upload + Feed Designer Area */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-6 uppercase tracking-wide" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#000000' }}>
              Plan. Polish. Post.
            </h2>
            <div className="w-24 h-px mx-auto mb-8" style={{ backgroundColor: '#000000' }}></div>
            <p className="text-lg max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#4C4B4B' }}>
              Your visual content strategy starts here
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4 bg-[#F1F1F1] p-2">
              <Button
                variant={gridView === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setGridView('grid')}
                className={gridView === 'grid' ? 'bg-black text-white hover:bg-gray-800 border-0' : 'bg-transparent text-black border border-black hover:bg-black hover:text-white'}
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px', borderRadius: '0px' }}
              >
                Grid View
              </Button>
              <Button
                variant={gridView === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setGridView('calendar')}
                className={gridView === 'calendar' ? 'bg-black text-white hover:bg-gray-800 border-0' : 'bg-transparent text-black border border-black hover:bg-black hover:text-white'}
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px', borderRadius: '0px' }}
              >
                Calendar View
              </Button>
            </div>
          </div>

          {/* Grid Planner */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mb-12">
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} className="aspect-square bg-white border border-dashed border-[#B5B5B3] flex items-center justify-center cursor-pointer hover:border-black transition-colors group relative">
                {i < 3 ? (
                  <>
                    <img 
                      src={vaultImages[i]} 
                      alt={`Grid item ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Schedule this
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 stroke-black fill-none group-hover:stroke-black transition-colors" />
                    <span className="text-xs group-hover:text-black transition-colors" style={{ fontFamily: 'Inter, sans-serif', color: '#4C4B4B' }}>
                      Upload Selfie
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Content Actions */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Button className="bg-transparent text-black border border-black hover:bg-black hover:text-white font-helvetica uppercase tracking-wide">
              <Save className="w-4 h-4 mr-2" />
              Save as Draft
            </Button>
            <Button className="bg-transparent text-black border border-black hover:bg-black hover:text-white font-helvetica uppercase tracking-wide">
              <Calendar className="w-4 h-4 mr-2" />
              Add to Calendar
            </Button>
            <Select>
              <SelectTrigger className="w-48 border-black font-helvetica">
                <SelectValue placeholder="Content Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reel">Reel</SelectItem>
                <SelectItem value="quote">Quote</SelectItem>
                <SelectItem value="selfie">Selfie</SelectItem>
                <SelectItem value="story">Story</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Visual Editor Module */}
      {selectedImage && (
        <section className="py-20 px-4 bg-[#F1F1F1]">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-prata text-4xl text-center mb-12 uppercase tracking-wide">Visual Editor</h2>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Image Preview */}
              <div className="relative">
                <div className="aspect-[4/5] bg-white rounded-none overflow-hidden">
                  <img 
                    src={selectedImage} 
                    alt="Editing"
                    className="w-full h-full object-cover"
                    style={{
                      filter: showOriginal ? 'none' : `brightness(${100 + adjustments.brightness}%) contrast(${100 + adjustments.contrast}%) saturate(${100 + adjustments.warmth}%)`
                    }}
                  />
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={showOriginal}
                      onCheckedChange={setShowOriginal}
                    />
                    <span className="font-helvetica text-sm">Show Original</span>
                  </div>
                </div>
              </div>

              {/* Editor Controls */}
              <div className="space-y-8">
                <Tabs defaultValue="filters">
                  <TabsList className="grid w-full grid-cols-2 bg-white">
                    <TabsTrigger value="filters" className="font-helvetica uppercase tracking-wide">Vogue Filters</TabsTrigger>
                    <TabsTrigger value="adjust" className="font-helvetica uppercase tracking-wide">Adjust</TabsTrigger>
                  </TabsList>

                  <TabsContent value="filters" className="space-y-4 mt-8">
                    <div className="grid grid-cols-2 gap-4">
                      {voguFilters.map((filter) => (
                        <Button
                          key={filter.value}
                          variant={filterPreset === filter.value ? 'default' : 'outline'}
                          onClick={() => setFilterPreset(filter.value)}
                          className="h-12 font-helvetica uppercase tracking-wide border-black hover:bg-black hover:text-white"
                        >
                          {filter.name}
                        </Button>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="adjust" className="space-y-6 mt-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-helvetica mb-2 uppercase tracking-wide">Brightness</label>
                        <Slider
                          value={[adjustments.brightness]}
                          onValueChange={([value]) => setAdjustments(prev => ({ ...prev, brightness: value }))}
                          min={-50}
                          max={50}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-helvetica mb-2 uppercase tracking-wide">Contrast</label>
                        <Slider
                          value={[adjustments.contrast]}
                          onValueChange={([value]) => setAdjustments(prev => ({ ...prev, contrast: value }))}
                          min={-50}
                          max={50}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-helvetica mb-2 uppercase tracking-wide">Warmth</label>
                        <Slider
                          value={[adjustments.warmth]}
                          onValueChange={([value]) => setAdjustments(prev => ({ ...prev, warmth: value }))}
                          min={-50}
                          max={50}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-helvetica mb-2 uppercase tracking-wide">Sharpness</label>
                        <Slider
                          value={[adjustments.sharpness]}
                          onValueChange={([value]) => setAdjustments(prev => ({ ...prev, sharpness: value }))}
                          min={-50}
                          max={50}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setAdjustments({ brightness: 0, contrast: 0, warmth: 0, sharpness: 0 })}
                    className="flex-1 border-black hover:bg-black hover:text-white font-helvetica uppercase tracking-wide"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  <Button className="flex-1 bg-black text-white hover:bg-gray-800 font-helvetica uppercase tracking-wide">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button className="flex-1 bg-black text-white hover:bg-gray-800 font-helvetica uppercase tracking-wide">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Photo Vault Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-6 uppercase tracking-wide" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#000000' }}>
              Photo Vault
            </h2>
            <div className="w-24 h-px mx-auto mb-8" style={{ backgroundColor: '#000000' }}></div>
            <p className="text-lg max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#4C4B4B' }}>
              Your curated collection of brand visuals
            </p>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <Select>
              <SelectTrigger className="w-48 border border-black" style={{ fontFamily: 'Neue Einstellung, sans-serif', fontSize: '14px', borderRadius: '0px' }}>
                <SelectValue placeholder="Filter by Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-48 border border-black" style={{ fontFamily: 'Neue Einstellung, sans-serif', fontSize: '14px', borderRadius: '0px' }}>
                <SelectValue placeholder="Filter by Tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="selfie">Selfie</SelectItem>
                <SelectItem value="edited">Edited</SelectItem>
                <SelectItem value="posted">Posted</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-48 border border-black" style={{ fontFamily: 'Neue Einstellung, sans-serif', fontSize: '14px', borderRadius: '0px' }}>
                <SelectValue placeholder="Color Tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="warm">Warm</SelectItem>
                <SelectItem value="cool">Cool</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {vaultImages.map((image, index) => (
              <div 
                key={index}
                className="aspect-square cursor-pointer group relative overflow-hidden"
                onClick={() => setSelectedImage(image)}
              >
                <img 
                  src={image} 
                  alt={`Vault image ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <Edit className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Upload Motivation Widget */}
      <section className="py-20 px-4 bg-[#F1F1F1]">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white border-0 shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-12">
                <h3 className="text-3xl mb-6 uppercase tracking-wide" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#000000' }}>Daily Inspiration</h3>
                <div className="w-16 h-px mb-8" style={{ backgroundColor: '#000000' }}></div>
                <blockquote className="text-xl mb-8 italic leading-relaxed" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#4C4B4B' }}>
                  "{currentQuote}"
                </blockquote>
                <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3" style={{ fontFamily: 'Neue Einstellung, sans-serif', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px', borderRadius: '0px' }}>
                  Upload Today's Selfie
                </Button>
              </div>
              <div className="aspect-square md:aspect-auto">
                <img 
                  src="https://i.postimg.cc/fLSsQQth/IMG-6384-jpg.jpg" 
                  alt="Daily inspiration"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}