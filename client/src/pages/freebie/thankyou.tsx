import React from 'react';
import { Link } from 'wouter';

export default function ThankYou() {
  // Get PDF URL from query params or use default
  const urlParams = new URLSearchParams(window.location.search);
  const dynamicPdfUrl = urlParams.get('pdf');
  const pdfUrl = dynamicPdfUrl || 'https://selfie-ai-platform.vercel.app/selfie-guide.pdf';

  const handleDownload = () => {
    // Open PDF in new tab for download
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center p-5 md:p-10">
      <style>{`
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        
        .shimmer {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 3s infinite;
        }
        
        .loading-text {
          font-size: 12px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #B5B5B3;
          margin-top: 20px;
          opacity: 0;
          animation: fadeIn 0.5s ease forwards;
          animation-delay: 0.5s;
        }
      `}</style>

      <div className="w-full max-w-4xl">
        <div className="bg-white border border-[#E5E5E5] overflow-hidden relative shadow-lg md:shadow-2xl">
          {/* Top Bar */}
          <div className="bg-[#171719] h-1 w-full"></div>
          
          {/* Content */}
          <div className="px-6 py-12 md:px-20 md:py-24 text-center">
            <p className="font-['Neue_Einstellung'] text-[14px] letter-spacing-[0.4em] text-[#B5B5B3] uppercase font-light mb-10">
              SELFIE AI™
            </p>
            
            <h1 className="font-['Bordoni_FLF'] text-[36px] md:text-[64px] lg:text-[72px] leading-[1.1] font-light tracking-[-0.02em] mb-5 text-[#171719]">
              Welcome to Your
              <span className="block font-['Bordoni_FLF'] italic text-[32px] md:text-[56px] lg:text-[64px] mt-2">
                Selfie Journey
              </span>
            </h1>
            
            <p className="text-[16px] md:text-[18px] lg:text-[20px] leading-[1.6] text-[#4C4B4B] mb-12 md:mb-16 max-w-2xl mx-auto">
              Your exclusive guide is ready. Get ready to transform your selfie game and step into your confidence.
            </p>
            
            <button
              onClick={handleDownload}
              className="group relative inline-block bg-[#171719] text-[#F1F1F1] px-12 md:px-16 py-5 md:py-6 text-[12px] md:text-[14px] letter-spacing-[0.3em] uppercase font-light transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg mb-16 overflow-hidden"
            >
              <span className="relative z-10">Download Your Guide</span>
              <div className="shimmer"></div>
            </button>
            
            <p className="loading-text">Preparing your exclusive content...</p>
            
            {/* Divider */}
            <div className="w-16 h-px bg-[#B5B5B3] mx-auto my-16"></div>
            
            {/* Quote Section */}
            <div className="mb-16">
              <p className="font-['Bordoni_FLF'] text-[24px] md:text-[32px] leading-[1.3] italic text-[#171719] mb-5">
                "Confidence isn't about perfection,<br />it's about owning who you are"
              </p>
              <p className="font-['Neue_Einstellung'] text-[11px] md:text-[12px] letter-spacing-[0.3em] uppercase text-[#B5B5B3]">
                — SANDRA
              </p>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="bg-[#F1F1F1] px-6 py-12 md:px-20 md:py-16 text-center">
            <h2 className="font-['Bordoni_FLF'] text-[24px] md:text-[28px] mb-4 font-light text-[#171719]">
              Ready for More?
            </h2>
            <p className="text-[14px] md:text-[16px] text-[#4C4B4B] mb-8">
              This guide is just the beginning. Join SELFIE AI™ to unlock your full potential.
            </p>
            <Link href="/dashboard">
              <button className="inline-block border border-[#171719] text-[#171719] px-12 md:px-14 py-4 md:py-5 text-[11px] md:text-[13px] letter-spacing-[0.2em] uppercase font-light transition-all duration-300 hover:bg-[#171719] hover:text-[#F1F1F1]">
                Explore SELFIE AI™
              </button>
            </Link>
          </div>
        </div>
        
        {/* Social Footer */}
        <div className="text-center pt-10 md:pt-12">
          <p className="font-['Neue_Einstellung'] text-[11px] md:text-[13px] text-[#B5B5B3] letter-spacing-[0.1em]">
            Follow @sandra.social for daily inspiration
          </p>
        </div>
      </div>
    </div>
  );
}
// ready for push
   