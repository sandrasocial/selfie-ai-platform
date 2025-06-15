import { useState, useEffect } from 'react';

export default function ThankYouPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const triggerWebhook = async () => {
    try {
      // Get user data from sessionStorage
      const userName = sessionStorage.getItem('userName') || '';
      const userEmail = sessionStorage.getItem('userEmail') || '';

      if (!userEmail) {
        throw new Error('No user email found');
      }

      // Make webhook request
      const response = await fetch(process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL || '', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          templateId: '24197B16-1667-4C4B-A446-A37D12260E85',
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Webhook request failed');
      }

      const data = await response.json();

      // Assume the webhook returns a PDF URL
      if (data.pdfUrl) {
        setPdfUrl(data.pdfUrl);
        setStatus('success');
      } else {
        // Fallback PDF URL if webhook doesn't return one
        setPdfUrl('/api/download/selfie-guide.pdf');
        setStatus('success');
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      setErrorMessage('Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  useEffect(() => {
    triggerWebhook();
  }, []);

  const handleRetry = () => {
    setStatus('loading');
    triggerWebhook();
  };

  const handleDownload = () => {
    if (pdfUrl) {
      window.location.href = pdfUrl;
    }
  };

  return (
    <div className="bg-[#F1F1F1] min-h-screen flex items-center justify-center">
      <div className="w-full max-w-[1200px] mx-auto px-5 py-10">
        <div className="bg-white border border-[#E5E5E5] overflow-hidden relative">
          {/* Top Bar */}
          <div className="bg-[#171719] h-1 w-full"></div>

          <div className="px-8 py-16 md:px-16 md:py-24 lg:px-20 lg:py-32 text-center">
            {/* Logo */}
            <p className="text-xs tracking-[0.4em] uppercase font-thin text-[#B5B5B3] mb-10">
              SELFIE AI™
            </p>

            {/* Dynamic Content Based on Status */}
            {status === 'loading' && (
              <>
                <h1 className="text-5xl md:text-6xl lg:text-7xl leading-tight font-light tracking-[-0.02em] mb-5 text-[#171719]">
                  Almost There
                  <span className="italic block text-4xl md:text-5xl lg:text-6xl mt-3">
                    One Moment
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-[#4C4B4B] mb-12 max-w-[500px] mx-auto font-light">
                  We're personalizing your exclusive guide right now.
                </p>

                <div className="inline-flex items-center text-[#171719]">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#F1F1F1] border-t-[#171719] mr-3"></div>
                  <span className="text-sm tracking-[0.2em] uppercase">Generating PDF...</span>
                </div>
              </>
            )}

            {status === 'success' && (
              <>
                <h1 className="text-5xl md:text-6xl lg:text-7xl leading-tight font-light tracking-[-0.02em] mb-5 text-[#171719]">
                  Welcome to Your
                  <span className="italic block text-4xl md:text-5xl lg:text-6xl mt-3">
                    Selfie Journey
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-[#4C4B4B] mb-12 max-w-[500px] mx-auto font-light">
                  Your PDF is ready! Get ready to transform your selfie game and step into your confidence.
                </p>

                <button
                  onClick={handleDownload}
                  className="relative inline-block bg-[#171719] text-[#F1F1F1] px-12 py-6 md:px-16 md:py-6 text-xs tracking-[0.3em] uppercase font-light transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0 overflow-hidden"
                >
                  Download Your Guide
                  <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_3s_infinite]"></div>
                </button>

                <p className="text-xs tracking-[0.2em] uppercase text-[#B5B5B3] mt-8">
                  Your PDF is ready!
                </p>
              </>
            )}

            {status === 'error' && (
              <>
                <h1 className="text-5xl md:text-6xl lg:text-7xl leading-tight font-light tracking-[-0.02em] mb-5 text-[#171719]">
                  Let's Try
                  <span className="italic block text-4xl md:text-5xl lg:text-6xl mt-3">
                    That Again
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-[#4C4B4B] mb-12 max-w-[500px] mx-auto font-light">
                  {errorMessage || 'Sometimes technology needs a second chance. Ready to try again?'}
                </p>

                <button
                  onClick={handleRetry}
                  className="relative inline-block bg-[#171719] text-[#F1F1F1] px-12 py-6 md:px-16 md:py-6 text-xs tracking-[0.3em] uppercase font-light transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0"
                >
                  Try Again
                </button>
              </>
            )}

            {/* Divider */}
            <div className="w-16 h-px bg-[#B5B5B3] mx-auto my-16"></div>

            {/* Quote Section */}
            <div className="mb-16">
              <p className="text-3xl md:text-4xl leading-relaxed italic text-[#171719] mb-5">
                "Confidence isn't about perfection,<br/>it's about owning who you are"
              </p>
              <p className="text-xs tracking-[0.3em] uppercase text-[#B5B5B3]">
                — SANDRA
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-[#F1F1F1] px-8 py-12 md:px-16 md:py-16 lg:px-20 lg:py-20 text-center">
            <h2 className="text-3xl md:text-3xl mb-4 font-light">Ready for More?</h2>
            <p className="text-base text-[#4C4B4B] mb-8 font-light">
              This guide is just the beginning. Join SELFIE AI™ to unlock your full potential.
            </p>
            <a 
              href="/explore"
              className="inline-block border border-[#171719] text-[#171719] px-12 py-4 text-xs tracking-[0.2em] uppercase font-light transition-all duration-300 hover:bg-[#171719] hover:text-[#F1F1F1]"
            >
              Explore SELFIE AI™
            </a>
          </div>
        </div>

        {/* Social Footer */}
        <div className="text-center py-10 text-xs text-[#B5B5B3] tracking-[0.1em]">
          <p>Follow @sandra.social for daily inspiration</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
} 