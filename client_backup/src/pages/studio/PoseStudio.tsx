
import React from 'react';
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";

export default function PoseStudio() {
  const { data: user } = useQuery({
    queryKey: ["/api/me"],
    retry: false,
  });

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
              href="/studio/editor" 
              className="text-[#4C4B4B] hover:text-[#171719] transition-colors"
              style={{ fontFamily: 'Neue Einstellung, sans-serif', fontSize: '14px' }}
            >
              Selfie Editor
            </Link>
            <Link 
              href="/studio/pose" 
              className="text-[#171719] font-medium border-b-2 border-[#171719] pb-1"
              style={{ fontFamily: 'Neue Einstellung, sans-serif', fontSize: '14px' }}
            >
              Pose Coach
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
            Pose Coach
          </h1>
          <div className="w-24 h-px mx-auto mb-8 bg-[#171719]"></div>
          <p 
            className="text-lg mb-12 max-w-2xl mx-auto text-[#4C4B4B]"
            style={{ fontFamily: 'Neue Einstellung, sans-serif', fontWeight: '300' }}
          >
            Professional posing techniques and guidance
          </p>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-[#B5B5B3] p-16 text-center">
            <h3 
              className="text-2xl font-normal mb-6 uppercase tracking-wide text-[#171719]"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Coming Soon
            </h3>
            <p 
              className="text-base leading-relaxed text-[#4C4B4B] max-w-xl mx-auto"
              style={{ fontFamily: 'Neue Einstellung, sans-serif', fontWeight: '300' }}
            >
              This feature is currently being developed. You'll be able to learn professional posing techniques and receive personalized guidance to enhance your content creation.
            </p>
            <div className="w-16 h-px mx-auto mt-8 bg-[#B5B5B3]"></div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
