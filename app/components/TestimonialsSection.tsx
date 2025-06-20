import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      id: 1,
      text: "Sandra, thank you so much for each of your reels. 90% of them sound exactly like my life. Inspired by you, I started taking selfies and actually posting them. Three months later, I quit my job.",
      author: "Maria",
      location: "Barcelona",
      featured: true
    },
    {
      id: 2,
      text: "I spend 26 years and I'm recently divorce in december. New beginning! Thanks for this gorgeous inspiración.",
      author: "Laura",
      location: "Madrid"
    },
    {
      id: 3,
      text: "Your posts have been inspirational, motivational and educational to help me pursue my Instagram growth and content moving forward.",
      author: "Zayish",
      location: "London"
    },
    {
      id: 4,
      text: "No matter what we do we will be judged. As long as we know our content helps those who need it that's what matters. Thank you for your content Sandra!",
      author: "Claviste",
      location: "Paris"
    },
    {
      id: 5,
      text: "Love how you show the actual camera settings. So helpful.",
      author: "Sarah",
      location: "New York"
    },
    {
      id: 6,
      text: "Ready to stop playing small at 41.",
      author: "Michelle",
      location: "Toronto"
    },
    {
      id: 7,
      text: "You made me realize I don't need perfection. I need strategy.",
      author: "Emma",
      location: "Sydney"
    },
    {
      id: 8,
      text: "I've taken some of my best selfies thanks to you.",
      author: "Jessica",
      location: "Los Angeles"
    },
    {
      id: 9,
      text: "You made me stop using filters. I actually like what I see now.",
      author: "Ana",
      location: "Lisbon"
    }
  ];

  const stats = [
    { number: "10K+", label: "Women Transformed" },
    { number: "2.4M", label: "Lives Touched" },
    { number: "87%", label: "Show Up More" }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  return (
    <section className="bg-[#171719] py-24 relative overflow-hidden">
      {/* Background Editorial Number */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
        <span className="font-bodoni text-[600px] leading-none text-white opacity-[0.02]">"</span>
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 sm:px-8 md:px-16 lg:px-24">
        {/* Section Header */}
        <div className="flex items-baseline gap-8 mb-20">
          <div className="font-bodoni italic text-[120px] leading-none text-white opacity-10">05</div>
          <div>
            <h2 className="font-bodoni text-[64px] tracking-tight text-white">
              Their Words, Not Mine
            </h2>
            <div className="w-32 h-px bg-white/20 mt-4"></div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-bodoni italic text-[48px] text-white">{stat.number}</div>
              <div className="font-inter text-[11px] uppercase tracking-[0.3em] text-white/40 mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="max-w-4xl mx-auto text-center">
                    <p className={`font-bodoni italic leading-tight text-white mb-8 ${
                      testimonial.featured ? 'text-[48px]' : 'text-[32px]'
                    }`}>
                      "{testimonial.text}"
                    </p>
                    <p className="font-inter text-[12px] uppercase tracking-[0.3em] text-white/60">
                      — {testimonial.author}, {testimonial.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-16">
            <button
              onClick={goToPrev}
              className="p-3 border border-white/20 hover:border-white/40 transition-colors group"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 transition-all duration-300 ${
                    index === currentIndex 
                      ? 'w-8 bg-white' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="p-3 border border-white/20 hover:border-white/40 transition-colors group"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Bottom Section - Grid of Quick Testimonials */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
          <div className="bg-[#171719] p-8 group hover:bg-white/5 transition-colors">
            <p className="font-inter text-white/80 mb-4">
              "Your tips turned my boring selfies into real photos I'm proud of."
            </p>
            <p className="font-inter text-[10px] uppercase tracking-[0.3em] text-white/40">
              — Rachel, Dublin
            </p>
          </div>
          <div className="bg-[#171719] p-8 group hover:bg-white/5 transition-colors">
            <p className="font-inter text-white/80 mb-4">
              "This gave me the push to show up more confidently online."
            </p>
            <p className="font-inter text-[10px] uppercase tracking-[0.3em] text-white/40">
              — Sophie, Berlin
            </p>
          </div>
          <div className="bg-[#171719] p-8 group hover:bg-white/5 transition-colors">
            <p className="font-inter text-white/80 mb-4">
              "Finally someone who gets it. Real advice, real results."
            </p>
            <p className="font-inter text-[10px] uppercase tracking-[0.3em] text-white/40">
              — Nina, Stockholm
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 