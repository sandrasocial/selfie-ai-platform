
import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DevLoginButton from '@/components/DevLoginButton';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <DevLoginButton />

      {/* Hero Section - Full Bleed */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Desktop Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center hidden md:block"
          style={{
            backgroundImage: 'url(https://i.postimg.cc/0QVy2L7N/Heroimagehomaepage-1.png)'
          }}
        />
        {/* Mobile Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center block md:hidden"
          style={{
            backgroundImage: 'url(https://i.postimg.cc/C1hK0FBt/heroimage-homepage-1.png)'
          }}
        />
        {/* Soft Overlay */}
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(23, 23, 25, 0.4)' }}
        />

        <div className="relative z-10 text-center text-white max-w-4xl px-6 animate-fade-in">
          {/* Section Label */}
          <div className="mb-8">
            <p 
              className="text-sm uppercase tracking-widest mb-2"
              style={{ 
                fontFamily: 'Neue Einstellung, sans-serif',
                fontSize: '14px',
                letterSpacing: '0.2em',
                color: '#F1F1F1'
              }}
            >
              SELFIE AI™
            </p>
          </div>

          {/* Headline */}
          <h1 
            className="text-4xl md:text-6xl font-normal mb-8 animate-fade-in-delay"
            style={{ 
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(40px, 8vw, 64px)',
              fontWeight: '400',
              lineHeight: '1.1',
              color: 'white'
            }}
          >
            Turn Your Selfies Into<br />
            Strategic Brand Assets
          </h1>

          {/* Supporting Copy */}
          <p 
            className="text-base md:text-lg mb-12 max-w-2xl mx-auto"
            style={{ 
              fontFamily: 'Neue Einstellung, sans-serif',
              fontSize: 'clamp(16px, 2vw, 18px)',
              fontWeight: '400',
              opacity: '0.9',
              maxWidth: '640px'
            }}
          >
            The most powerful branding tool is already in your hand—your phone.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-fade-in-delay">
            <Link href="/dashboard">
              <Button 
                className="hero-cta-button"
                style={{ 
                  fontFamily: 'Neue Einstellung, sans-serif',
                  fontSize: '14px',
                  fontWeight: '400',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  border: '1.5px solid white',
                  padding: '14px 28px',
                  background: 'transparent',
                  color: 'white',
                  borderRadius: '0',
                  transition: 'all 0.3s ease',
                  minWidth: '200px'
                }}
              >
                START YOUR JOURNEY
              </Button>
            </Link>
            <Link href="/pricing">
              <Button 
                className="hero-cta-button"
                style={{ 
                  fontFamily: 'Neue Einstellung, sans-serif',
                  fontSize: '14px',
                  fontWeight: '400',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  border: '1.5px solid white',
                  padding: '14px 28px',
                  background: 'transparent',
                  color: 'white',
                  borderRadius: '0',
                  transition: 'all 0.3s ease',
                  minWidth: '200px'
                }}
              >
                VIEW PLANS
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Proof Section - Transformation */}
      <section className="py-20 text-center" style={{ backgroundColor: '#171719' }}>
        <h2 
          className="text-white mb-4"
          style={{ 
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '36px',
            fontWeight: '400'
          }}
        >
          Transformation
        </h2>
        <p 
          className="text-white italic mb-16"
          style={{ 
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '18px'
          }}
        >
          See the power of strategic personal branding
        </p>

        <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto mb-16 px-6">
          <div className="text-white">
            <div 
              className="text-5xl mb-2"
              style={{ 
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '48px'
              }}
            >
              90
            </div>
            <div 
              className="uppercase tracking-wide"
              style={{ 
                fontFamily: 'Neue Einstellung, sans-serif',
                fontSize: '14px',
                letterSpacing: '0.5px'
              }}
            >
              DAYS
            </div>
          </div>
          <div className="text-white">
            <div 
              className="text-5xl mb-2"
              style={{ 
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '48px'
              }}
            >
              120K
            </div>
            <div 
              className="uppercase tracking-wide"
              style={{ 
                fontFamily: 'Neue Einstellung, sans-serif',
                fontSize: '14px',
                letterSpacing: '0.5px'
              }}
            >
              FOLLOWERS
            </div>
          </div>
          <div className="text-white">
            <div 
              className="text-5xl mb-2"
              style={{ 
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '48px'
              }}
            >
              1.7M
            </div>
            <div 
              className="uppercase tracking-wide"
              style={{ 
                fontFamily: 'Neue Einstellung, sans-serif',
                fontSize: '14px',
                letterSpacing: '0.5px'
              }}
            >
              REACH
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-8 px-6 max-w-6xl mx-auto">
          <div className="w-1/2">
            <img 
              src="https://i.postimg.cc/XNt6zt4j/1.png" 
              alt="Before transformation" 
              className="w-full object-cover"
              style={{ filter: 'saturate(0.6)' }}
            />
          </div>
          <div className="w-1/2">
            <img 
              src="https://i.postimg.cc/d05zmx5K/2.png" 
              alt="After transformation" 
              className="w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* About Sandra Section */}
      <section className="py-20 px-6 bg-white">
        <div className="grid md:grid-cols-3 items-center gap-12 max-w-6xl mx-auto">
          <div>
            <h2 
              className="italic mb-6"
              style={{ 
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '36px',
                color: '#171719'
              }}
            >
              Hi, I'm Sandra.
            </h2>
            <p 
              style={{ 
                fontFamily: 'Neue Einstellung, sans-serif',
                fontSize: '18px',
                lineHeight: '1.6',
                color: '#171719'
              }}
            >
              Personal branding mentor. Single mom of 3. Building my dream life from rock bottom—and helping women do the same.
            </p>
          </div>
          
          <div className="relative">
            <img 
              src="https://i.postimg.cc/rwgGZ6jy/flatlay-overlay-Url.png" 
              alt="Sandra's workspace" 
              className="w-full h-96 object-cover"
            />
          </div>
          
          <div>
            <p 
              className="italic mb-6"
              style={{ 
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '24px',
                lineHeight: '1.4',
                color: '#171719'
              }}
            >
              "Every selfie tells a story. Let's make yours unforgettable."
            </p>
            <p 
              style={{ 
                fontFamily: 'Neue Einstellung, sans-serif',
                fontSize: '16px',
                color: '#171719'
              }}
            >
              — Sandra
            </p>
          </div>
        </div>
      </section>

      {/* Platform Tools Section */}
      <section className="py-20 px-6" style={{ backgroundColor: '#171719' }}>
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-center mb-16 text-white"
            style={{ 
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '36px'
            }}
          >
            The Tools That Built My Empire
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'AI Studio',
                description: 'Create, enhance, and perfect your content with artificial intelligence.',
                image: 'https://i.postimg.cc/PxvRkfVQ/story-Image1.png',
                cta: 'EXPLORE'
              },
              {
                title: 'Template Library',
                description: 'Consistency meets creativity—30-day strategic content flow.',
                image: 'https://i.postimg.cc/wxc1QX0g/3.png',
                cta: 'VIEW'
              },
              {
                title: 'Sandra AI Chat',
                description: 'Personal mentorship, strategy and content creation support.',
                image: 'https://i.postimg.cc/KY664Mz6/8.png',
                cta: 'CHAT'
              },
              {
                title: 'Strategy Workbooks',
                description: 'Turn insights into income with guided strategic planning.',
                image: 'https://i.postimg.cc/rwgGZ6jy/flatlay-overlay-Url.png',
                cta: 'START'
              }
            ].map((tool, index) => (
              <div 
                key={index} 
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              >
                <div className="relative h-80 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${tool.image})`,
                      filter: 'grayscale(30%)'
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 transition-all duration-300" />
                  
                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                    <h3 
                      className="mb-3"
                      style={{ 
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '24px'
                      }}
                    >
                      {tool.title}
                    </h3>
                    <p 
                      className="mb-4 opacity-90"
                      style={{ 
                        fontFamily: 'Neue Einstellung, sans-serif',
                        fontSize: '14px',
                        lineHeight: '1.4'
                      }}
                    >
                      {tool.description}
                    </p>
                    <div 
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ 
                        fontFamily: 'Neue Einstellung, sans-serif',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {tool.cta} →
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offer Ladder Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-center mb-16"
            style={{ 
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '36px',
              color: '#171719'
            }}
          >
            Your Empire Pathway
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Show Your Face™',
                subtitle: 'Free Guide',
                description: 'Start showing up with confidence—even if you\'ve been hiding.',
                link: '/freebie/selfie-guide',
                bgColor: '#F8F8F8'
              },
              {
                title: 'Selfie Starter Kit',
                subtitle: '$67',
                description: 'Lighting, posing, editing—your complete content system.',
                link: '/products/starter-kit',
                bgColor: '#E8E8E8'
              },
              {
                title: 'Branded by Selfie™',
                subtitle: '$397',
                description: 'Turn your personal image into a brand that sells.',
                link: '/products/branded-by-selfie',
                bgColor: '#171719'
              },
              {
                title: 'Empire Builder VIP',
                subtitle: 'Elite',
                description: 'You\'re not just building a brand—you\'re building an empire.',
                link: '/vip/apply',
                bgColor: '#171719'
              }
            ].map((offer, index) => (
              <Link key={index} href={offer.link}>
                <div 
                  className="h-80 p-8 transition-transform duration-300 hover:scale-105 cursor-pointer group"
                  style={{ backgroundColor: offer.bgColor }}
                >
                  <div className="h-full flex flex-col justify-between">
                    <div>
                      <h3 
                        className="mb-2"
                        style={{ 
                          fontFamily: 'Cormorant Garamond, serif',
                          fontSize: '24px',
                          color: offer.bgColor === '#171719' ? 'white' : '#171719'
                        }}
                      >
                        {offer.title}
                      </h3>
                      <p 
                        className="mb-4"
                        style={{ 
                          fontFamily: 'Neue Einstellung, sans-serif',
                          fontSize: '16px',
                          color: offer.bgColor === '#171719' ? 'white' : '#171719',
                          opacity: '0.8'
                        }}
                      >
                        {offer.subtitle}
                      </p>
                      <p 
                        style={{ 
                          fontFamily: 'Neue Einstellung, sans-serif',
                          fontSize: '14px',
                          lineHeight: '1.5',
                          color: offer.bgColor === '#171719' ? 'white' : '#171719',
                          opacity: '0.9'
                        }}
                      >
                        {offer.description}
                      </p>
                    </div>
                    
                    <div 
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ 
                        fontFamily: 'Neue Einstellung, sans-serif',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        color: offer.bgColor === '#171719' ? 'white' : '#171719'
                      }}
                    >
                      {index === 0 ? 'DOWNLOAD' : index === 3 ? 'APPLY' : 'VIEW'} →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6" style={{ backgroundColor: '#171719' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="mb-4 text-white"
            style={{ 
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '36px'
            }}
          >
            Women Finding Their Voice
          </h2>
          <p 
            className="mb-16 text-white italic"
            style={{ 
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '18px'
            }}
          >
            Real stories from women reclaiming their power
          </p>
          
          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                quote: "Sandra I'm not going to lie, I just took the BEST photo of myself that I've taken in YEARS.",
                author: "Confidence Queen"
              },
              {
                quote: "You literally changed my photo-taking from boring to professional. Thank you.",
                author: "Content Creator"
              },
              {
                quote: "I heard the words I'd been waiting my whole life to hear. And finally posted my story.",
                author: "Olha, Dream Pursuer"
              },
              {
                quote: "Sandra's method isn't just about taking better photos—it's about claiming your space.",
                author: "Brand Builder"
              }
            ].map((testimonial, index) => (
              <div key={index} className="text-left">
                <p 
                  className="italic mb-4 text-white"
                  style={{ 
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '20px',
                    lineHeight: '1.5'
                  }}
                >
                  "{testimonial.quote}"
                </p>
                <p 
                  className="text-white"
                  style={{ 
                    fontFamily: 'Neue Einstellung, sans-serif',
                    fontSize: '14px',
                    opacity: '0.8'
                  }}
                >
                  — {testimonial.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
