
import React from 'react';
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

export default function AutoTagger() {
  const { data: user } = useQuery({
    queryKey: ["/api/me"],
    retry: false,
  });

  const taggedImages = [
    {
      id: 1,
      image: "https://i.postimg.cc/HLN6LDSj/15.png",
      mood: ["CONFIDENT", "NATURAL"],
      lighting: ["GOLDEN HOUR", "SOFT"],
      tone: ["WARM", "PROFESSIONAL"]
    },
    {
      id: 2,
      image: "https://i.postimg.cc/Bbn4rXK7/3.png",
      mood: ["PLAYFUL", "BRIGHT"],
      lighting: ["NATURAL LIGHT", "HIGH KEY"],
      tone: ["COOL", "FRESH"]
    }
  ];

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
              className="text-[#171719] font-medium border-b-2 border-[#171719] pb-1"
              style={{ fontFamily: 'Neue Einstellung, sans-serif', fontSize: '14px' }}
            >
              Auto Tagger
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
            className="font-cormorant"
          >
            Auto Tagger
          </h1>
          <div className="w-24 h-px mx-auto mb-8 bg-[#171719]"></div>
          <p 
            className="text-lg mb-12 max-w-2xl mx-auto text-[#4C4B4B]"
            style={{ fontFamily: 'Neue Einstellung, sans-serif', fontWeight: '300' }}
          >
            AI-powered mood, tone, and lighting analysis for your photos
          </p>
        </div>
      </section>

      {/* Upload Section */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white border border-[#171719] hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-full h-32 border-2 border-dashed border-[#B5B5B3] group-hover:border-[#171719] transition-colors mb-6 flex items-center justify-center">
                <span 
                  className="text-[#4C4B4B] group-hover:text-[#171719] transition-colors"
                  style={{ fontFamily: 'Neue Einstellung, sans-serif', fontSize: '14px' }}
                >
                  Upload Your Image
                </span>
              </div>
              <h3 
                className="text-2xl mb-4 uppercase tracking-wide text-[#171719]"
                className="font-cormorant"
              >
                Upload for AI Analysis
              </h3>
              <p 
                className="text-[#4C4B4B] mb-6 text-center max-w-md"
                style={{ fontFamily: 'Neue Einstellung, sans-serif', fontWeight: '300' }}
              >
                Drop your selfie here and let our AI analyze the mood, lighting, and tone automatically
              </p>
              <Button 
                className="bg-transparent text-[#171719] border border-[#171719] hover:bg-[#171719] hover:text-white hover:shadow-lg transition-all duration-200 uppercase tracking-wide px-8 py-3"
                style={{ fontFamily: 'Neue Einstellung, sans-serif', fontSize: '14px', borderRadius: '0px' }}
              >
                Analyze Photo
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tagged Images */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-3xl mb-12 text-[#171719]"
            className="font-cormorant"
          >
            Recently Tagged
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {taggedImages.map((item) => (
              <Card key={item.id} className="bg-white border border-[#B5B5B3] overflow-hidden shadow-none" style={{ borderRadius: '0px' }}>
                <div className="aspect-[4/3] overflow-hidden border-b border-[#B5B5B3]">
                  <img 
                    src={item.image} 
                    alt={`Tagged image ${item.id}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 
                        className="text-[12px] font-medium mb-2 uppercase tracking-wide text-[#4C4B4B]"
                        className="font-neue"
                      >
                        Mood
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {item.mood.map((tag, index) => (
                          <span
                            key={index}
                            className="text-[12px] px-3 py-1 border border-[#171719] text-[#171719] uppercase tracking-wide"
                            style={{ fontFamily: 'Neue Einstellung, sans-serif', borderRadius: '0px' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 
                        className="text-[12px] font-medium mb-2 uppercase tracking-wide text-[#4C4B4B]"
                        className="font-neue"
                      >
                        Lighting
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {item.lighting.map((tag, index) => (
                          <span
                            key={index}
                            className="text-[12px] px-3 py-1 border border-[#171719] text-[#171719] uppercase tracking-wide"
                            style={{ fontFamily: 'Neue Einstellung, sans-serif', borderRadius: '0px' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 
                        className="text-[12px] font-medium mb-2 uppercase tracking-wide text-[#4C4B4B]"
                        className="font-neue"
                      >
                        Tone
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {item.tone.map((tag, index) => (
                          <span
                            key={index}
                            className="text-[12px] px-3 py-1 border border-[#171719] text-[#171719] uppercase tracking-wide"
                            style={{ fontFamily: 'Neue Einstellung, sans-serif', borderRadius: '0px' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
