
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  Lock, 
  Calendar,
  Play,
  FileText,
  Mic,
  BookOpen,
  Sparkles,
  Star,
  Eye,
  ChevronRight
} from "lucide-react";
import Header from '@/components/layout/Header';

type DropItem = {
  id: string;
  title: string;
  type: 'Template' | 'Audio' | 'Course' | 'AI Script';
  description: string;
  availableFrom: Date;
  fileUrl: string;
  locked: boolean;
  featured?: boolean;
  imageUrl?: string;
};

export default function MonthlyDrops() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [user, setUser] = useState<any>(null);

  // Get current month for dynamic labeling
  const currentMonth = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  }).toUpperCase();

  // Mock data for Monthly Drops
  const mockDrops: DropItem[] = [
    {
      id: '1',
      title: 'Visual Confidence Templates',
      type: 'Template',
      description: 'Instagram story templates designed to boost your camera confidence and personal brand.',
      availableFrom: new Date('2024-01-01'),
      fileUrl: '/downloads/visual-confidence-templates.zip',
      locked: false,
      featured: true,
      imageUrl: 'https://i.postimg.cc/dQ5q8mbb/22.png'
    },
    {
      id: '2',
      title: 'Mirror Work Audio Guide',
      type: 'Audio',
      description: 'Daily affirmations and mirror work practices to build unshakeable self-confidence.',
      availableFrom: new Date('2024-01-01'),
      fileUrl: '/downloads/mirror-work-audio.mp3',
      locked: false,
      imageUrl: 'https://i.postimg.cc/bwYKyKCW/122.png'
    },
    {
      id: '3',
      title: 'Brand Voice Clarity Course',
      type: 'Course',
      description: 'Mini-course on finding and refining your authentic brand voice across all platforms.',
      availableFrom: new Date('2024-01-15'),
      fileUrl: '/courses/brand-voice-clarity',
      locked: false,
      imageUrl: 'https://i.postimg.cc/nhDpf8Xx/35.png'
    },
    {
      id: '4',
      title: 'Sandra AI Power Scripts',
      type: 'AI Script',
      description: 'Custom AI prompts for generating authentic, conversion-focused social media content.',
      availableFrom: new Date('2024-01-01'),
      fileUrl: '/downloads/sandra-ai-scripts.pdf',
      locked: false,
      imageUrl: 'https://i.postimg.cc/wxc1QX0g/3.png'
    },
    {
      id: '5',
      title: 'Camera Confidence Bootcamp',
      type: 'Course',
      description: 'Video training series to overcome camera shyness and show up boldly.',
      availableFrom: new Date('2024-02-01'),
      fileUrl: '/courses/camera-confidence',
      locked: true,
      imageUrl: 'https://i.postimg.cc/bYB7yCcw/128.png'
    },
    {
      id: '6',
      title: 'Viral Hook Templates',
      type: 'Template',
      description: 'Proven caption hooks and reel scripts that stop the scroll and drive engagement.',
      availableFrom: new Date('2024-02-15'),
      fileUrl: '/downloads/viral-hooks.zip',
      locked: true,
      imageUrl: 'https://i.postimg.cc/Fs2XZPDB/78.png'
    }
  ];

  const filteredDrops = activeFilter === 'all' 
    ? mockDrops 
    : mockDrops.filter(drop => drop.type.toLowerCase() === activeFilter);

  const featuredDrop = mockDrops.find(drop => drop.featured);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Template': return FileText;
      case 'Audio': return Mic;
      case 'Course': return BookOpen;
      case 'AI Script': return Sparkles;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Template': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Audio': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Course': return 'bg-green-100 text-green-800 border-green-200';
      case 'AI Script': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userResponse = await fetch("/api/me", {
          credentials: "include",
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        }
      } catch (error) {
        console.log("User not authenticated");
      }
    };

    loadUserData();
  }, []);

  return (
    <div className="min-h-screen bg-luxury-white">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden" style={{ backgroundColor: '#171719' }}>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url(https://i.postimg.cc/d0MV1PLq/IMG-8465-jpg.jpg)'
          }}
        />
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(23, 23, 25, 0.4)' }} />
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Section Label */}
          <div className="mb-8">
            <p 
              className="text-xs uppercase tracking-widest mb-2"
              style={{ 
                fontFamily: 'Neue Einstellung, sans-serif',
                letterSpacing: '0.3em',
                color: '#B5B5B3'
              }}
            >
              {currentMonth} DROP
            </p>
            <div 
              className="w-16 h-px mx-auto"
              style={{ backgroundColor: '#B5B5B3', opacity: '0.6' }}
            />
          </div>

          {/* Main Headline */}
          <h1 
            className="text-5xl md:text-6xl font-light mb-6"
            style={{ 
              fontFamily: 'Cormorant Garamond, serif',
              fontWeight: '300',
              color: '#F1F1F1',
              lineHeight: '1.1'
            }}
          >
            Mirror & Message
          </h1>
          
          {/* Description */}
          <p 
            className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed"
            style={{ 
              fontFamily: 'Neue Einstellung, sans-serif',
              color: '#F1F1F1',
              opacity: '0.9'
            }}
          >
            This month's drop is all about visibility rituals, brand voice clarity, and camera confidence.
          </p>
          
          {/* CTA Button */}
          <Button 
            className="px-12 py-4 text-sm font-normal uppercase tracking-wide border-2 transition-all duration-300 hover:scale-105"
            style={{ 
              backgroundColor: 'transparent',
              color: '#F1F1F1',
              border: '1.5px solid #F1F1F1',
              borderRadius: '0px',
              fontFamily: 'Neue Einstellung, sans-serif',
              letterSpacing: '0.5px'
            }}
          >
            Explore This Month's Drop
          </Button>
        </div>
      </section>

      {/* Featured Drop Section */}
      {featuredDrop && (
        <section className="py-16 px-6" style={{ backgroundColor: '#F1F1F1' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 
                className="text-3xl md:text-4xl font-normal mb-4"
                style={{ 
                  fontFamily: 'Cormorant Garamond, serif',
                  color: '#171719'
                }}
              >
                Featured Drop
              </h2>
              <div 
                className="w-24 h-px mx-auto"
                style={{ backgroundColor: '#4C4B4B' }}
              />
            </div>

            <Card 
              className="relative overflow-hidden transition-all duration-500 cursor-pointer group border-0"
              style={{ 
                backgroundColor: '#F1F1F1',
                borderRadius: '0px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div className="md:flex">
                {/* Image Section */}
                <div className="md:w-1/2 relative">
                  <div 
                    className="h-64 md:h-80 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${featuredDrop.imageUrl})`
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <Star className="w-6 h-6" style={{ color: '#F1F1F1' }} />
                  </div>
                </div>

                {/* Content Section */}
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                  <div className="mb-4">
                    <Badge 
                      className={`uppercase tracking-wide text-xs border ${getTypeColor(featuredDrop.type)}`}
                      style={{ 
                        fontFamily: 'Neue Einstellung, sans-serif',
                        borderRadius: '0px'
                      }}
                    >
                      {featuredDrop.type}
                    </Badge>
                  </div>

                  <h3 
                    className="text-2xl md:text-3xl font-normal mb-4"
                    style={{ 
                      fontFamily: 'Cormorant Garamond, serif',
                      color: '#171719'
                    }}
                  >
                    {featuredDrop.title}
                  </h3>

                  <p 
                    className="text-lg mb-8 leading-relaxed"
                    style={{ 
                      fontFamily: 'Neue Einstellung, sans-serif',
                      color: '#4C4B4B'
                    }}
                  >
                    {featuredDrop.description}
                  </p>

                  <Button 
                    className="self-start px-8 py-3 font-medium uppercase tracking-wide transition-all duration-300"
                    style={{ 
                      backgroundColor: '#171719',
                      color: '#F1F1F1',
                      border: '2px solid #171719',
                      borderRadius: '0px',
                      fontFamily: 'Neue Einstellung, sans-serif',
                      letterSpacing: '0.5px'
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Now
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Filter Tabs */}
      <section className="py-8 px-6" style={{ backgroundColor: '#F1F1F1' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {['all', 'template', 'audio', 'course', 'ai script'].map((filter) => (
              <Button
                key={filter}
                variant="ghost"
                onClick={() => setActiveFilter(filter)}
                className={`uppercase text-xs px-4 py-2 border transition-all duration-300 ${
                  activeFilter === filter 
                    ? 'border-[#171719] bg-[#171719] text-[#F1F1F1]' 
                    : 'border-[#B5B5B3] text-[#4C4B4B] hover:border-[#171719]'
                }`}
                style={{ 
                  fontFamily: 'Neue Einstellung, sans-serif',
                  letterSpacing: '0.3em',
                  borderRadius: '0px'
                }}
              >
                {filter === 'all' ? 'All Drops' : filter.replace(' ', ' ')}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Drops Grid */}
      <section className="py-16 px-6" style={{ backgroundColor: '#F1F1F1' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDrops.map((drop, index) => {
              const TypeIcon = getTypeIcon(drop.type);
              const isComingSoon = drop.availableFrom > new Date();
              
              return (
                <Card 
                  key={drop.id}
                  className={`relative overflow-hidden transition-all duration-500 cursor-pointer group border-0 ${
                    drop.locked || isComingSoon ? 'opacity-75' : ''
                  }`}
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    borderRadius: '0px',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                    animationDelay: `${index * 100}ms`
                  }}
                  onMouseEnter={(e) => {
                    if (!drop.locked && !isComingSoon) {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  {/* Lock Overlay */}
                  {(drop.locked || isComingSoon) && (
                    <div className="absolute inset-0 z-20 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="text-center text-white">
                        {isComingSoon ? (
                          <>
                            <Calendar className="w-8 h-8 mx-auto mb-2" />
                            <p 
                              className="text-sm uppercase tracking-wide"
                              className="font-neue"
                            >
                              Coming {drop.availableFrom.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                          </>
                        ) : (
                          <>
                            <Lock className="w-8 h-8 mx-auto mb-2" />
                            <p 
                              className="text-sm uppercase tracking-wide"
                              className="font-neue"
                            >
                              Unlock with Plan
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Image Section */}
                  <div className="relative">
                    <div 
                      className={`h-48 bg-cover bg-center transition-all duration-300 ${
                        drop.locked || isComingSoon ? 'filter blur-sm grayscale' : ''
                      }`}
                      style={{
                        backgroundImage: `url(${drop.imageUrl})`
                      }}
                    />
                    
                    {/* Type Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge 
                        className={`uppercase tracking-wide text-xs border ${getTypeColor(drop.type)}`}
                        style={{ 
                          fontFamily: 'Neue Einstellung, sans-serif',
                          borderRadius: '0px'
                        }}
                      >
                        <TypeIcon className="w-3 h-3 mr-1" />
                        {drop.type}
                      </Badge>
                    </div>

                    {/* Lock Icon */}
                    {(drop.locked || isComingSoon) && (
                      <div className="absolute top-4 right-4">
                        {isComingSoon ? (
                          <Calendar className="w-5 h-5 text-white" />
                        ) : (
                          <Lock className="w-5 h-5 text-white" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <CardContent className="p-6">
                    <CardTitle 
                      className="text-xl font-normal mb-3"
                      style={{ 
                        fontFamily: 'Cormorant Garamond, serif',
                        color: '#171719'
                      }}
                    >
                      {drop.title}
                    </CardTitle>

                    <CardDescription 
                      className="text-sm mb-6 leading-relaxed"
                      style={{ 
                        fontFamily: 'Neue Einstellung, sans-serif',
                        color: '#4C4B4B'
                      }}
                    >
                      {drop.description}
                    </CardDescription>

                    {/* CTA Button */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {drop.locked ? (
                        <Button 
                          className="w-full px-4 py-2 text-sm font-medium uppercase tracking-wide"
                          style={{ 
                            backgroundColor: 'transparent',
                            color: '#4C4B4B',
                            border: '1px solid #B5B5B3',
                            borderRadius: '0px',
                            fontFamily: 'Neue Einstellung, sans-serif',
                            letterSpacing: '0.3em'
                          }}
                          disabled
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          Unlock with Plan
                        </Button>
                      ) : isComingSoon ? (
                        <Button 
                          className="w-full px-4 py-2 text-sm font-medium uppercase tracking-wide"
                          style={{ 
                            backgroundColor: 'transparent',
                            color: '#4C4B4B',
                            border: '1px solid #B5B5B3',
                            borderRadius: '0px',
                            fontFamily: 'Neue Einstellung, sans-serif',
                            letterSpacing: '0.3em'
                          }}
                          disabled
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Coming Soon
                        </Button>
                      ) : (
                        <Button 
                          className="w-full px-4 py-2 text-sm font-medium uppercase tracking-wide transition-all duration-300"
                          style={{ 
                            backgroundColor: '#171719',
                            color: '#F1F1F1',
                            border: '1px solid #171719',
                            borderRadius: '0px',
                            fontFamily: 'Neue Einstellung, sans-serif',
                            letterSpacing: '0.3em'
                          }}
                        >
                          {drop.type === 'Audio' ? (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Play
                            </>
                          ) : drop.type === 'Course' ? (
                            <>
                              <Eye className="w-4 h-4 mr-2" />
                              Open
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredDrops.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: '#B5B5B3' }} />
              <h3 
                className="text-2xl font-normal mb-2"
                style={{ 
                  fontFamily: 'Cormorant Garamond, serif',
                  color: '#4C4B4B'
                }}
              >
                No drops found
              </h3>
              <p 
                style={{ 
                  fontFamily: 'Neue Einstellung, sans-serif',
                  color: '#B5B5B3'
                }}
              >
                Try adjusting your filter or check back soon for new content.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-20 px-6" style={{ backgroundColor: '#171719' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="text-3xl md:text-4xl font-normal mb-6"
            style={{ 
              fontFamily: 'Cormorant Garamond, serif',
              color: '#F1F1F1'
            }}
          >
            Get All Monthly Drops
          </h2>
          
          <p 
            className="text-lg mb-8 leading-relaxed"
            style={{ 
              fontFamily: 'Neue Einstellung, sans-serif',
              color: '#F1F1F1',
              opacity: '0.9'
            }}
          >
            Upgrade to unlock every monthly drop and build your empire with exclusive content.
          </p>
          
          <Button 
            className="px-12 py-4 text-sm font-normal uppercase tracking-wide border-2 transition-all duration-300 hover:scale-105"
            style={{ 
              backgroundColor: 'transparent',
              color: '#F1F1F1',
              border: '1.5px solid #F1F1F1',
              borderRadius: '0px',
              fontFamily: 'Neue Einstellung, sans-serif',
              letterSpacing: '0.5px'
            }}
          >
            Upgrade Now
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}
