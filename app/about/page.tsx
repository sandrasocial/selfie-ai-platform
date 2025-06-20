export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center px-6">
        <h1 className="font-bodoni text-[48px] md:text-[72px] text-[#171719] mb-4">
          About Sandra
        </h1>
        <p className="font-inter text-[#4C4B4B] text-lg mb-8">
          This page is coming soon. We're crafting something special.
        </p>
        <a 
          href="/"
          className="inline-block bg-[#171719] text-white px-8 py-4 font-inter text-[11px] uppercase tracking-[0.3em] hover:translate-y-[-2px] transition-all duration-300"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
} 