import React, { useRef, useEffect, useState } from 'react';

const offers = [
  {
    number: '01',
    name: 'Free Selfie Guide',
    price: '',
    description: 'The guide that started it all. Real tips that work with whatever phone you have. No apps to buy. Just you looking like you on a really good day.',
    features: ['5 Poses', 'Lighting Guide', 'Instant Download'],
    cta: 'Start Here',
    href: '/free-guide',
  },
  {
    number: '02',
    name: 'SELFIE Collective',
    price: '• $67/month',
    description: 'Stop taking 100 selfies to post none. Get your personal AI coach, see your future self, and actually start showing up. This is how I built 120K followers.',
    features: ['Personal AI Coach', 'Future Self Vision', 'Content Calendar'],
    cta: 'Join Now',
    href: '/collective',
  },
  {
    number: '03',
    name: 'VIP Empire Builder',
    price: '• Apply Only',
    description: 'Ready to build something bigger than followers? We\'ll create your entire automated business together. Real revenue. Real freedom. Limited spots.',
    features: ['Apply Only', 'Limited Spots', 'Automated Business'],
    cta: `I'm Ready`,
    href: '/apply',
    vip: true,
  },
];

export default function OfferLadderSection() {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const offersScrollRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const [showSkip, setShowSkip] = useState(false);
  const [progressVisible, setProgressVisible] = useState(false);

  // Intersection observer for active offer
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-offer-index'));
            setActive(idx);
          }
        });
      },
      { threshold: 0.5 }
    );
    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, []);

  // Hide scroll hint after scroll
  useEffect(() => {
    const onScroll = (e: any) => {
      if (e.target && e.target.scrollTop > 100) setShowHint(false);
      if (window.innerWidth <= 768 && e.target && e.target.scrollTop > window.innerHeight) setShowSkip(true);
      else setShowSkip(false);
    };
    const container = document.getElementById('offer-ladder-scroll');
    if (container) container.addEventListener('scroll', onScroll);
    return () => {
      if (container) container.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Show progress bar only when offers are in view (not header)
  useEffect(() => {
    if (!offersScrollRef.current) return;
    const handleVisibility = (entries: IntersectionObserverEntry[]) => {
      setProgressVisible(entries[0].isIntersecting);
    };
    const observer = new window.IntersectionObserver(handleVisibility, {
      root: null,
      threshold: 0.1,
    });
    observer.observe(offersScrollRef.current);
    return () => observer.disconnect();
  }, []);

  // Progress bar width
  const progress = ((active + 1) / offers.length) * 100;

  return (
    <section className="offers-section relative bg-[#171719] text-white">
      {/* Section Header (above scrollable area) */}
      <div ref={headerRef} className="section-header flex flex-col items-center justify-center text-center max-w-2xl mx-auto px-6 pt-24 pb-12">
        <img src="https://i.postimg.cc/L88db1fc/White-transperent-logo.png" alt="SELFIE Logo" className="w-32 mb-8 mx-auto" />
        <h2 className="font-bodoni text-[40px] md:text-[64px] font-light leading-[1.1] mb-6 opacity-0 translate-y-8 animate-fadeInUp">Your Path to Showing Up</h2>
        <p className="text-[18px] text-white/60 leading-[1.6] opacity-0 translate-y-4 animate-fadeInUp animation-delay-200">Choose your path. Each step builds on the last, creating your complete transformation.</p>
      </div>
      {/* Progress Bar (fixed, centered, only when offers in view) */}
      {progressVisible && (
        <div className="progress-container fixed top-1/2 left-0 right-0 z-50 pointer-events-none" style={{ transform: 'translateY(-50%)' }}>
          <div className="progress-line relative w-full h-px bg-white/10">
            <div className="progress-fill absolute top-0 left-0 h-full bg-gradient-to-r from-transparent to-white" style={{ width: `${progress}%`, transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)' }}></div>
          </div>
          <div className="progress-squares absolute top-1/2 left-0 right-0 flex justify-between px-[10%]" style={{ transform: 'translateY(-50%)' }}>
            {offers.map((_, i) => (
              <button
                key={i}
                className={`progress-square w-3 h-3 bg-[#171719] border border-white/30 rotate-45 transition-all duration-500 pointer-events-auto ${i <= active ? 'bg-white border-white scale-110 shadow-lg' : ''}`}
                aria-label={`Go to offer ${i + 1}`}
                onClick={() => sectionRefs.current[i]?.scrollIntoView({ behavior: 'smooth' })}
              />
            ))}
          </div>
        </div>
      )}
      {/* Scrollable snap container (offers only) */}
      <div id="offer-ladder-scroll" ref={offersScrollRef} className="min-h-[70vh] my-16 overflow-y-auto snap-y snap-mandatory relative max-w-3xl mx-auto px-4 sm:px-8">
        {offers.map((offer, i) => (
          <div
            key={i}
            className={`offer-section${offer.vip ? ' vip' : ''} min-h-[70vh] flex items-center justify-center relative snap-start`}
            data-offer-index={i}
            ref={el => { sectionRefs.current[i] = el; }}
          >
            <div className={`offer w-full max-w-[1400px] mx-auto px-6 md:px-16 opacity-0 scale-95 transition-all duration-700 ${active === i ? 'opacity-100 scale-100' : ''}`} data-offer={i}>
              <div className="offer-content grid grid-cols-1 md:grid-cols-[200px_1fr] gap-10 md:gap-20 items-center relative">
                <div className="offer-number text-[120px] md:text-[200px] leading-[0.8] text-right font-lingerie opacity-10 md:opacity-15 select-none transition-all duration-700">{offer.number}</div>
                <div className="offer-details transition-all duration-700">
                  <h3 className={`offer-name font-bodoni text-[28px] md:text-[48px] leading-[1.2] mb-6 flex flex-wrap items-baseline gap-6 ${offer.vip ? 'bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent' : ''}`}>{offer.name} {offer.price && <span className="offer-price text-[24px] md:text-[32px] opacity-80">{offer.price}</span>}</h3>
                  <p className="offer-description text-[16px] md:text-[18px] text-white/70 leading-[1.6] mb-8 max-w-xl">{offer.description}</p>
                  <div className="offer-features flex flex-wrap gap-6 mb-10">
                    {offer.features.map((f, j) => (
                      <span key={j} className="offer-feature text-[11px] uppercase tracking-[0.2em] opacity-60 border-b border-white/20 pb-2">{f}</span>
                    ))}
                  </div>
                  <a href={offer.href} className="offer-cta inline-flex items-center gap-4 px-8 py-4 border border-white text-white text-[11px] uppercase tracking-[0.3em] transition-all duration-500 relative overflow-hidden hover:bg-white hover:text-[#171719] focus:outline-none focus:ring-2 focus:ring-white">
                    {offer.cta}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* Scroll Hint */}
        {showHint && (
          <div className="scroll-hint fixed bottom-10 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.2em] opacity-50 z-[101]">Scroll to explore</div>
        )}
        {/* Skip Navigation (for mobile) */}
        {showSkip && (
          <a href="#" className="skip-nav fixed bottom-24 right-10 bg-white/10 border border-white/30 text-white px-6 py-3 text-[11px] uppercase tracking-[0.2em] opacity-90 z-[101]" onClick={e => { e.preventDefault(); sectionRefs.current[offers.length - 1]?.scrollIntoView({ behavior: 'smooth' }); }}>Skip to End</a>
        )}
        <style jsx>{`
          .font-lingerie { font-family: 'Lingerie', serif; }
          .font-bodoni { font-family: 'BodoniFLF', serif; }
          .offer-section { scroll-snap-align: start; }
          .progress-square { transition: all 0.6s cubic-bezier(0.4,0,0.2,1); }
          .progress-square.active { background: white; border-color: white; transform: rotate(45deg) scale(1.2); box-shadow: 0 0 20px rgba(255,255,255,0.5); }
          .progress-square:hover { border-color: white; transform: rotate(45deg) scale(1.1); }
          .offer { transition: all 0.8s cubic-bezier(0.16,1,0.3,1); }
          .offer.active { opacity: 1; transform: scale(1); }
          .offer-number { transition: all 0.8s cubic-bezier(0.16,1,0.3,1); }
          .offer.active .offer-number { opacity: 0.15; }
          .offer-details { transition: all 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s; }
          .offer.active .offer-details { transform: translateX(0); }
          @media (max-width: 1024px) {
            .offer-section { height: auto; min-height: 100vh; padding: 80px 0; }
            .offer-content { grid-template-columns: 1fr !important; gap: 40px; text-align: center; }
            .offer { padding: 0 40px; }
            .offer-number { text-align: center; font-size: 120px; opacity: 0.05; position: absolute; top: -60px; left: 50%; transform: translateX(-50%); }
            .offer.active .offer-number { transform: translateX(-50%); }
            .offer-details { transform: translateY(40px); }
            .offer.active .offer-details { transform: translateY(0); }
            .offer-name { font-size: 36px; justify-content: center; }
            .offer-features { justify-content: center; }
          }
          @media (max-width: 768px) {
            .section-header { height: auto; min-height: 100vh; padding: 100px 24px; }
            .section-title { font-size: 40px; }
            .progress-squares { padding: 0 20px; }
            .offer { padding: 0 24px; }
            .offer-name { font-size: 28px; flex-direction: column; gap: 12px; }
            .offer-price { font-size: 24px; }
            .offer-description { font-size: 16px; }
            .offer-cta { padding: 16px 32px; }
          }
          .scroll-hint { animation: fadeInUp 1s ease 1s forwards; transition: opacity 0.5s ease; }
          .skip-nav { transition: all 0.3s ease; }
          .skip-nav.visible { opacity: 1; }
          .skip-nav:hover { background: rgba(255,255,255,0.2); }
          @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </div>
    </section>
  );
} 