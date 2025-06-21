export default function StartHerePage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center px-6 max-w-2xl mx-auto">
        <h1 className="font-bodoni text-[48px] md:text-[72px] text-[#171719] mb-6">
          Start Your Journey
        </h1>
        <p className="font-inter text-[#4C4B4B] text-lg mb-8 leading-relaxed">
          Ready to build your personal brand from your camera roll? 
          Let's find the perfect path for you.
        </p>
        <div className="space-y-4">
          <a 
            href="/#footer-cta"
            className="block bg-[#171719] text-white px-8 py-4 font-inter text-[11px] uppercase tracking-[0.3em] hover:translate-y-[-2px] transition-all duration-300"
          >
            Get the Free Guide
          </a>
          <a 
            href="/tools/glow-check"
            className="block border border-[#171719] text-[#171719] px-8 py-4 font-inter text-[11px] uppercase tracking-[0.3em] hover:bg-[#171719] hover:text-white transition-all duration-300"
          >
            Try The Glow Check™
          </a>
        </div>
      </div>
    </div>
  );
} 