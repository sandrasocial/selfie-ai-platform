import React from 'react';

const testimonials = [
  {
    text: 'You made me stop using filters. I actually like what I see now.',
    name: 'Ana, Lisbon',
  },
  {
    text: "Your tips turned my boring selfies into real photos I'm proud of.",
    name: 'Rachel, Dublin',
  },
  {
    text: 'This gave me the push to show up more confidently online.',
    name: 'Sophie, Berlin',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative py-24 bg-[#171719] text-white overflow-hidden">
      {/* Background Number */}
      <div className="absolute -top-10 right-0 pointer-events-none select-none z-0">
        <span style={{ fontFamily: 'Lingerie' }} className="text-[30vw] leading-[0.8] text-white/5">05</span>
      </div>
      <div className="relative max-w-[1200px] mx-auto px-6 z-10">
        {/* Header */}
        <div className="text-center mb-20 fade-in">
          <h2 className="font-bodoni text-[36px] md:text-[48px] font-light leading-[1.2]">Their Words, Not Mine</h2>
        </div>
        {/* Featured Testimonial */}
        <div className="max-w-3xl mx-auto mb-20 text-center fade-in">
          <p className="font-bodoni italic text-[24px] md:text-[32px] leading-[1.4] font-light mb-6 text-white/95">
            "Sandra, thank you so much for each of your reels. 90% of them sound exactly like my life. Inspired by you, I started taking selfies and actually posting them. Three months later, I quit my job."
          </p>
          <div className="text-[12px] uppercase tracking-[0.3em] text-white/60">— Maria, Barcelona</div>
        </div>
        {/* Simple Grid of 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mb-16">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-simple fade-in text-center px-6 py-10 bg-white/5 hover:bg-white/10 transition-all duration-500 cursor-pointer" style={{ animationDelay: `${0.15 * (i + 1)}s` }}>
              <p className="font-inter text-[16px] leading-[1.6] mb-5 text-white/90">"{t.text}"</p>
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/50">{t.name}</div>
            </div>
          ))}
        </div>
        {/* View More */}
        <div className="text-center fade-in mt-12">
          <a href="/stories" className="inline-flex items-center gap-3 text-white text-[12px] uppercase tracking-[0.2em] opacity-80 hover:opacity-100 transition-all">
            Read More Stories
            <span className="arrow">→</span>
          </a>
        </div>
      </div>
      <style jsx>{`
        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeIn 0.8s ease forwards;
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
} 