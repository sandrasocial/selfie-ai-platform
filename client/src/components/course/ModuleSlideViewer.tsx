import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Download } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ModuleSlideViewerProps {
  moduleId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ModuleSlideViewer({ moduleId, isOpen, onClose }: ModuleSlideViewerProps) {
  const [currentSlide, setCurrentSlide] = useState(1);
  
  // Define slides for each module
  const moduleSlides = {
    1: Array.from({ length: 23 }, (_, i) => ({
      id: i + 1,
      src: `/courseSlides/module1/${i + 1}.png`,
      title: getSlideTitle(i + 1)
    }))
  };

  const slides = moduleSlides[moduleId as keyof typeof moduleSlides] || [];
  const totalSlides = slides.length;

  function getSlideTitle(slideNumber: number): string {
    const titles: { [key: number]: string } = {
      1: "The Viral Selfie Blueprint",
      2: "Welcome",
      3: "Masterclass Contents", 
      4: "Module One: Positioning",
      5: "Position Yourself as Category-of-One",
      6: "The Uncopyable Angle Framework",
      7: "Framework Overview",
      8: "AI Prompts to Surface Your Angle",
      9: "Real World Examples",
      10: "The Ex-Engineer-Turned-Brand-Strategist",
      11: "The Burnt-Out Coach Who Now Preaches Anti-Hustle",
      12: "The Data Nerd Who Makes Audience Growth Fun",
      13: "Your Positioning Statement",
      14: "The 5-Part Voice Identity Audit",
      15: "Voice Audit Framework",
      16: "Audit Your Current Voice",
      17: "Voice Consistency Check",
      18: "Voice Alignment Assessment",
      19: "Voice Evolution Strategy",
      20: "Implementation Guidelines",
      21: "The 5-Part Voice Identity Audit",
      22: "Spot the Dilution (and Cut It)",
      23: "Create Your Personal Content Compass"
    };
    return titles[slideNumber] || `Slide ${slideNumber}`;
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < totalSlides ? prev + 1 : 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 1 ? prev - 1 : totalSlides));
  };

  const goToSlide = (slideNumber: number) => {
    setCurrentSlide(slideNumber);
  };

  if (!slides.length) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[90vh] p-0 bg-white">
        <div className="relative h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-white">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Module One: Positioning</h2>
              <p className="text-gray-600">Slide {currentSlide} of {totalSlides}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Main Slide Area */}
          <div className="flex-1 relative bg-gray-50 flex items-center justify-center">
            <div className="relative max-w-5xl w-full h-full flex items-center justify-center p-8">
              <img 
                src={slides[currentSlide - 1]?.src} 
                alt={slides[currentSlide - 1]?.title}
                className="max-w-full max-h-full object-contain shadow-lg rounded-lg"
              />
              
              {/* Navigation Arrows */}
              <Button
                variant="outline" 
                size="sm"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                onClick={prevSlide}
                disabled={currentSlide === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm" 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                onClick={nextSlide}
                disabled={currentSlide === totalSlides}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="p-6 border-t bg-white">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {slides[currentSlide - 1]?.title}
              </div>
              
              {/* Slide Thumbnails */}
              <div className="flex gap-2 overflow-x-auto max-w-md">
                {slides.slice(Math.max(0, currentSlide - 6), Math.min(slides.length, currentSlide + 5)).map((slide, index) => {
                  const slideIndex = Math.max(0, currentSlide - 6) + index;
                  const slideNumber = slideIndex + 1;
                  return (
                    <button
                      key={slide.id}
                      onClick={() => goToSlide(slideNumber)}
                      className={`flex-shrink-0 w-12 h-8 border-2 rounded overflow-hidden transition-all ${
                        slideNumber === currentSlide 
                          ? 'border-gray-900 shadow-md' 
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img 
                        src={slide.src} 
                        alt={`Slide ${slideNumber}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={prevSlide} disabled={currentSlide === 1}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" onClick={nextSlide} disabled={currentSlide === totalSlides}>
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}