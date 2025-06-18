

import React from 'react';
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

export default function DailyBoost() {
  const { data: user } = useQuery({
    queryKey: ["/api/me"],
    retry: false,
  });

  const motivationQuotes = [
    "Your face is your brand. Show it boldly.",
    "Every selfie is a signature.",
    "Confidence captured, beauty amplified.",
    "Your story lives in every frame."
  ];

  const [currentQuote] = React.useState(motivationQuotes[0]);

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      <Header user={user} />
      
      {/* Studio Navigation */}
      <section className="w-full py-4 px-4 border-b border-[#B5B5B3] sticky top-0 bg-white z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/studio" className="inline-flex items-center text-[#4C4B4B] hover:text-[#171719] transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            <span style={{ fontFamily: 'Neue Einstellung, sans-serif', fontSize: '14px' }}>
              Back to Studio
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/studio/notes" 
              className="text-[#4C4B4B] hover:text-[#171719] transition-colors"
              style={{ fontFamily: 'Neue Einstellung, sans-serif', fontSize: '14px' }}
            >
              Brand Notes
            </Link>
            <Link 
              href="/studio/tagger" 
              className="text-[#4C4B4B] hover:text-[#171719] transition-colors"
              style={{ fontFamily: 'Neue Einstellung, sans-serif', fontSize: '14px' }}
            >
              Auto Tagger
            </Link>
            <Link 
              href="/studio/boost" 
              className="text-[#171719] font-medium border-b-2 border-[#171719] pb-1"
              style={{ fontFamily: 'Neue Einstellung, sans-serif', fontSize: '14px' }}
            >
              Daily Boost
            </Link>
            <Link 
              href="/studio/editor" 
              className="text-[#4C4B4B] hover:text-[#171719] transition-colors"
              style={{ fontFamily: 'Neue Einstellung, sans-serif', fontSize: '14px' }}
            >
              Selfie Editor
            </Link>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 
            className="text-5xl md:text-6xl font-normal mb-8 uppercase tracking-wide text-[#171719]"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Daily Upload Boost
          </h1>
          <div className="w-24 h-px mx-auto mb-8 bg-[#171719]"></div>
          <p 
            className="text-lg mb-12 max-w-2xl mx-auto text-[#4C4B4B]"
            style={{ fontFamily: 'Neue Einstellung, sans-serif', fontWeight: '300' }}
          >
            Stay motivated with daily inspiration and upload reminders
          </p>
        </div>
      </section>

      {/* Daily Boost Content */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white border border-[#171719] overflow-hidden shadow-none" style={{ borderRadius: '0px' }}>
            <div className="grid md:grid-cols-2">
              <div className="p-12">
                <h3 
                  className="text-3xl mb-6 uppercase tracking-wide text-[#171719]"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  Daily Inspiration
                </h3>
                <div className="w-16 h-px mb-8 bg-[#171719]"></div>
                <blockquote 
                  className="text-xl mb-8 italic leading-relaxed text-[#4C4B4B]"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  "{currentQuote}"
                </blockquote>
                <Button 
                  className="bg-transparent text-[#171719] border border-[#171719] hover:bg-[#171719] hover:text-white hover:shadow-lg transition-all duration-200 uppercase tracking-wide px-8 py-3"
                  style={{ fontFamily: 'Neue Einstellung, sans-serif', fontSize: '14px', borderRadius: '0px' }}
                >
                  Upload Today's Selfie
                </Button>
              </div>
              <div className="aspect-square md:aspect-auto border-l border-[#B5B5B3]">
                <img 
                  src="https://i.postimg.cc/fLSsQQth/IMG-6384-jpg.jpg" 
                  alt="Daily inspiration"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </Card>

          {/* Upload Progress */}
          <div className="mt-16 text-center">
            <p 
              className="text-[#4C4B4B] mb-2 uppercase tracking-wide"
              style={{ fontFamily: 'Neue Einstellung, sans-serif', fontSize: '14px' }}
            >
              Your Upload Streak
            </p>
            <div 
              className="text-4xl mb-2 text-[#171719]"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              7 Days
            </div>
            <p 
              className="text-[#4C4B4B]"
              style={{ fontFamily: 'Neue Einstellung, sans-serif', fontWeight: '300' }}
            >
              Keep going — you're building momentum
            </p>
            <div className="w-16 h-px mx-auto mt-6 bg-[#B5B5B3]"></div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
