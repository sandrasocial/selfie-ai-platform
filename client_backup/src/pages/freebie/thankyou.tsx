import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

interface UserData {
  email: string;
  name: string;
  templateId: string;
}

interface PDFState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string;
}

export default function ThankYouPage() {
  const [pdfState, setPdfState] = useState<PDFState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: ''
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [buttonText, setButtonText] = useState('Download Your Guide');
  const [pdfUrl, setPdfUrl] = useState('');
  const [location] = useLocation();

  // Configuration from environment variables
  const WEBHOOK_URL = import.meta.env.VITE_MAKE_WEBHOOK_URL || 'https://hook.eu2.make.com/cuswnmn5rvse3u7mtc4b60pdus3ku7oe';
  const TEMPLATE_ID = '24197B16-1667-4C4B-A446-A37D12260E85';
  const TIMEOUT_DURATION = 15000; // 15 seconds

  // Get user data from URL params or session storage
  const getUserData = (): UserData => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      email: urlParams.get('email') || sessionStorage.getItem('userEmail') || '',
      name: urlParams.get('name') || sessionStorage.getItem('userName') || '',
      templateId: TEMPLATE_ID
    };
  };

  // Trigger webhook for PDF generation
  const triggerPDFGeneration = async (): Promise<void> => {
    const userData = getUserData();
    
    // Reset state and show loading
    setPdfState({
      isLoading: true,
      isSuccess: false,
      isError: false,
      errorMessage: ''
    });
    setStatusMessage('Creating your personalized guide...');
    setButtonText('Processing...');

    try {
      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('timeout')), TIMEOUT_DURATION);
      });

      // Create the fetch promise
      const fetchPromise = fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          name: userData.name,
          templateId: userData.templateId,
          timestamp: new Date().toISOString()
        })
      });

      // Race between fetch and timeout
      const response = await Promise.race([fetchPromise, timeoutPromise]);

      if (response.ok) {
        const data = await response.json();
        
        // Success - wait a bit for PDF processing
        setStatusMessage('Your guide is almost ready...');

        // Simulate PDF processing time
        setTimeout(() => {
          setPdfState({
            isLoading: false,
            isSuccess: true,
            isError: false,
            errorMessage: ''
          });
          setStatusMessage('Your guide is ready! Click to download.');
          setButtonText('Download Now');

          // Use webhook PDF URL if available, otherwise fallback
          if (data.pdfUrl) {
            setPdfUrl(data.pdfUrl);
          } else {
            setPdfUrl('/selfie-guide.pdf');
          }

          // Store success state
          sessionStorage.setItem('pdfReady', 'true');
        }, 3000);
      } else {
        throw new Error(`Webhook failed with status: ${response.status}`);
      }

    } catch (error) {
      console.error('PDF generation error:', error);
      
      let errorMessage = 'An error occurred while generating your guide.';
      if (error instanceof Error) {
        if (error.message === 'timeout') {
          errorMessage = 'Taking longer than expected... You can still access your guide.';
        } else {
          errorMessage = error.message;
        }
      }

      setPdfState({
        isLoading: false,
        isSuccess: false,
        isError: true,
        errorMessage
      });
      setStatusMessage('Ready to download your guide.');
      setButtonText('Download Guide');

      // Set fallback PDF path
      setPdfUrl('/selfie-guide.pdf');

      // Enable direct download as fallback
      sessionStorage.setItem('pdfFallback', 'true');
    }
  };

  // Handle download button click
  const handleDownload = async (): Promise<void> => {
    if (pdfState.isSuccess || pdfState.isError) {
      // Direct download using stored pdfUrl or fallback
      const downloadUrl = pdfUrl || '/selfie-guide.pdf';
      window.location.href = downloadUrl;

      // Update UI
      setStatusMessage('Download started! Check your downloads folder.');
    } else {
      // First click - trigger generation
      await triggerPDFGeneration();
    }
  };

  // Auto-trigger PDF generation on page load if user data exists
  useEffect(() => {
    const userData = getUserData();
    if (userData.email) {
      // Auto-trigger after 1 second
      const timer = setTimeout(() => {
        triggerPDFGeneration();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <div className="bg-[#F1F1F1] min-h-screen">
      {/* Font imports */}
      <link 
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@100;200;300;400&family=Bodoni+Moda:ital,wght@0,400;0,700;1,400&display=swap" 
        rel="stylesheet" 
      />
      
      <style dangerouslySetInnerHTML={{
        __html: `
          .font-bordoni { font-family: 'Bodoni Moda', serif; }
          .font-lingerie { font-family: 'Playfair Display', serif; }
          .font-neue { font-family: 'Inter', sans-serif; }

          .spinner {
            border: 2px solid #F1F1F1;
            border-top: 2px solid #171719;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
            display: inline-block;
            margin-right: 8px;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
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

          @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
          }

          .download-btn {
            transition: all 0.3s ease;
          }

          .download-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }

          .download-btn:active:not(:disabled) {
            transform: translateY(0);
          }

          .cta-btn {
            transition: all 0.3s ease;
          }

          .cta-btn:hover {
            background-color: #171719;
            color: #F1F1F1;
          }

          .error-state {
            color: #dc2626;
          }

          .success-state {
            color: #16a34a;
          }
        `
      }} />

      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-[1200px] mx-auto px-5 py-10">
          <div className="bg-white border border-[#E5E5E5] overflow-hidden relative">
            {/* Top Bar */}
            <div className="bg-[#171719] h-1 w-full" />

            <div className="px-8 py-16 md:px-16 md:py-24 lg:px-20 lg:py-32 text-center">
              {/* Logo */}
              <p className="text-xs tracking-[0.4em] uppercase font-thin text-[#B5B5B3] mb-10 font-neue">
                SELFIE AI™
              </p>

              {/* Headline */}
              <h1 className="font-bordoni text-5xl md:text-6xl lg:text-7xl leading-tight font-light tracking-[-0.02em] mb-5 text-[#171719]">
                Welcome to Your
                <span className="font-lingerie italic block text-4xl md:text-5xl lg:text-6xl mt-3">
                  Selfie Journey
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-[#4C4B4B] mb-12 max-w-[500px] mx-auto font-neue font-light">
                Your exclusive guide is ready. Get ready to transform your selfie game and step into your confidence.
              </p>

              {/* Download Button */}
              <button 
                onClick={handleDownload}
                disabled={pdfState.isLoading}
                className="download-btn relative inline-block bg-[#171719] text-[#F1F1F1] px-12 py-6 md:px-16 md:py-6 text-xs tracking-[0.3em] uppercase font-light mb-16 overflow-hidden font-neue disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="relative z-10">
                  {pdfState.isLoading && <div className="spinner" />}
                  {buttonText}
                </span>
                <div className="shimmer" />
              </button>

              {/* Status Message */}
              <p 
                className={`text-xs tracking-[0.2em] uppercase mt-5 transition-opacity duration-500 font-neue ${
                  statusMessage ? 'opacity-100' : 'opacity-0'
                } ${
                  pdfState.isError ? 'error-state' : pdfState.isSuccess ? 'success-state' : 'text-[#B5B5B3]'
                }`}
              >
                {statusMessage || 'Preparing your exclusive content...'}
              </p>

              {/* Error Message */}
              {pdfState.isError && pdfState.errorMessage && (
                <p className="text-xs text-[#dc2626] mt-2 font-neue">
                  {pdfState.errorMessage}
                </p>
              )}

              {/* Divider */}
              <div className="w-16 h-px bg-[#B5B5B3] mx-auto my-16" />

              {/* Quote Section */}
              <div className="mb-16">
                <p className="font-bordoni text-3xl md:text-4xl leading-relaxed italic text-[#171719] mb-5">
                  "Confidence isn't about perfection,
                  <br />it's about owning who you are"
                </p>
                <p className="text-xs tracking-[0.3em] uppercase text-[#B5B5B3] font-neue">
                  — SANDRA
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-[#F1F1F1] px-8 py-12 md:px-16 md:py-16 lg:px-20 lg:py-20 text-center">
              <h2 className="font-bordoni text-3xl md:text-3xl mb-4 font-light">
                Ready for More?
              </h2>
              <p className="text-base text-[#4C4B4B] mb-8 font-neue font-light">
                This guide is just the beginning. Join SELFIE AI™ to unlock your full potential.
              </p>
              <a 
                href="#" 
                className="cta-btn inline-block border border-[#171719] text-[#171719] px-12 py-4 text-xs tracking-[0.2em] uppercase font-light font-neue"
              >
                Explore SELFIE AI™
              </a>
            </div>
          </div>

          {/* Social Footer */}
          <div className="text-center py-10 text-xs text-[#B5B5B3] tracking-[0.1em] font-neue">
            <p>Follow @sandra.social for daily inspiration</p>
          </div>
        </div>
      </div>
    </div>
  );
}