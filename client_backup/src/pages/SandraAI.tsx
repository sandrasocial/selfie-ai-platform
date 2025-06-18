import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import SandraChat from "@/components/chat/SandraChat";

export default function SandraAI() {
  const [showChat, setShowChat] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["/api/me"],
    retry: false,
  });

  return (
    <div className="min-h-screen bg-luxury-white">
      <Header user={user} />

      {/* Hero Section - Full Bleed Visual */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center animate-slow-zoom"
          style={{
            backgroundImage: 'url(https://i.postimg.cc/wxc1QX0g/3.png)'
          }}
        />
        <div 
          className="absolute inset-0"
          style={{ 
            background: 'linear-gradient(to top, rgba(23, 23, 25, 0.7), rgba(23, 23, 25, 0.3))' 
          }} 
        />

        <div className="relative z-10 text-center text-white max-w-5xl px-6 animate-fade-in">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest mb-2 font-einstellung text-luxury-light">SANDRA AI</p>
            <div className="w-16 h-px mx-auto bg-luxury-light/60" />
          </div>

          <h1 className="text-5xl md:text-6xl font-light mb-6 font-serif text-luxury-light leading-tight">
            Your Personal Brand Mentor,<br />On Demand.
          </h1>

          <p className="text-xl mb-16 max-w-3xl mx-auto font-einstellung text-luxury-light/90">
            Ask anything, anytime. Sandra's here to help you heal, create, and grow.
          </p>

          <Button 
            onClick={() => setShowChat(true)}
            className="px-12 py-4 text-sm font-normal uppercase tracking-wide border-2 hover:scale-105 hover:opacity-85 transition-all duration-300"
            style={{ 
              backgroundColor: 'transparent',
              color: '#F1F1F1',
              border: '1.5px solid #F1F1F1',
              borderRadius: '0px',
              fontFamily: 'Neue Einstellung, sans-serif',
              letterSpacing: '0.5px'
            }}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            START A NEW CONVERSATION
          </Button>
        </div>
      </section>

      {!showChat ? (
        <section className="section-luxury bg-luxury-white">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center mb-16">
              <p className="text-sm uppercase tracking-widest mb-8 font-einstellung text-luxury-gray">SANDRA AI TOOLS</p>
              <div className="luxury-divider mb-8" />
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {["REEL SCRIPT", "VIBE CHECK", "DAILY BOOST", "BRAND STRATEGY"].map((label, idx) => (
                <div 
                  key={label}
                  className="p-8 cursor-pointer group hover:opacity-80 hover:scale-[1.02] border-t border-luxury-light-gray/30 transition-all duration-300"
                  onClick={() => setShowChat(true)}
                >
                  <h3 className="text-sm uppercase tracking-[0.15em] mb-4 font-einstellung text-luxury-dark">{label}</h3>
                  <h4 className="text-3xl font-light mb-4 font-serif text-luxury-dark">
                    {label === 'REEL SCRIPT' && 'Generate a reel script for your story'}
                    {label === 'VIBE CHECK' && 'Turn your energy into content'}
                    {label === 'DAILY BOOST' && 'Confidence in your caption'}
                    {label === 'BRAND STRATEGY' && 'Strategic insights for your empire'}
                  </h4>
                  <p className="font-einstellung text-base text-luxury-gray">
                    {label === 'REEL SCRIPT' && 'Transform your experiences into viral content'}
                    {label === 'VIBE CHECK' && "What's your vibe today? Let's make it magnetic"}
                    {label === 'DAILY BOOST' && "Need a boost? Here's a powerful quote to post"}
                    {label === 'BRAND STRATEGY' && 'Transform your story into a powerful personal brand'}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center py-16 border-t border-luxury-light-gray/20">
              <blockquote className="text-3xl italic max-w-4xl mx-auto font-serif text-luxury-dark">
                "You don't need more filters. You need strategy, presence, and power."
              </blockquote>
              <cite className="block mt-6 text-xs uppercase tracking-[0.2em] font-einstellung text-luxury-gray">
                — SANDRA AI
              </cite>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {["Confidence Coaching", "Content Strategy", "Brand Building"].map((title, i) => (
                <div key={title} className="p-8 bg-luxury-light card-editorial">
                  <h3 className="font-prata text-xl text-luxury-headline mb-4 uppercase tracking-wide">{title}</h3>
                  <div className="luxury-divider-left mb-4" />
                  <p className="text-luxury-text-gray font-helvetica leading-relaxed">
                    {title === 'Confidence Coaching' && 'Rebuild your self-worth and inner strength with personalized guidance'}
                    {title === 'Content Strategy' && 'Create viral content that converts and builds your empire'}
                    {title === 'Brand Building' && 'Transform your story into a powerful personal brand'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <main className="section-luxury bg-luxury-white">
          <div className="px-4 max-w-5xl mx-auto">
            <div className="animate-fadeInUp">
              <div className="mb-8 text-center">
                <div className="numbered-headline justify-center mb-6">
                  <span className="headline-number">02.</span>
                  <h2 className="editorial-h2">Chat with Sandra</h2>
                </div>
                <div className="luxury-divider mb-6" />
                <p className="text-luxury-text-gray font-helvetica text-lg">Your personal brand and confidence mentor</p>
              </div>

              <div className="rounded-lg overflow-hidden border-0 shadow-xl bg-luxury-headline">
                <SandraChat user={user} />
              </div>

              <div className="mt-8 text-center">
                <Button 
                  onClick={() => setShowChat(false)}
                  className="btn-secondary px-8 py-3"
                >
                  Back to Welcome
                </Button>
              </div>
            </div>
          </div>
        </main>
      )}

      <Footer />
    </div>
  );
}