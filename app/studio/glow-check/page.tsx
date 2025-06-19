'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Camera, Download, Share2, Sparkles, Sun, Zap, Grid3x3, Star, Calendar, Hash, TrendingUp, Instagram, Linkedin } from 'lucide-react';

export default function GlowCheckStudio() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [glowScore, setGlowScore] = useState<number | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showStudio, setShowStudio] = useState(false);
  const [filterIntensity, setFilterIntensity] = useState(100);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [showCaptionModal, setShowCaptionModal] = useState(false);
  const [trendingPercentage, setTrendingPercentage] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Glow Check Categories
  const glowCategories = {
    luminosity: { score: 0, feedback: '' },
    angles: { score: 0, feedback: '' },
    presence: { score: 0, feedback: '' },
    composition: { score: 0, feedback: '' },
    story: { score: 0, feedback: '' }
  };

  // Sandra's Custom Filters - Nordic Collection
  const nordicFilters = [
    { 
      name: 'ICELAND', 
      filter: 'brightness(110%) contrast(105%) saturate(85%) sepia(10%) hue-rotate(190deg)',
      description: 'Cool, ethereal glow'
    },
    { 
      name: 'OSLO', 
      filter: 'brightness(115%) contrast(95%) saturate(110%) sepia(15%) hue-rotate(10deg)',
      description: 'Warm golden hour'
    },
    { 
      name: 'STOCKHOLM', 
      filter: 'brightness(105%) contrast(120%) saturate(90%) sepia(5%) hue-rotate(0deg)',
      description: 'High contrast editorial'
    },
    { 
      name: 'COPENHAGEN', 
      filter: 'brightness(112%) contrast(98%) saturate(95%) sepia(8%) hue-rotate(5deg)',
      description: 'Soft, dreamy light'
    },
    { 
      name: 'REYKJAVIK', 
      filter: 'brightness(95%) contrast(115%) saturate(85%) sepia(12%) hue-rotate(-5deg)',
      description: 'Moody, powerful'
    }
  ];

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setGlowScore(null);
        setShowStudio(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Analyze the selfie
  const analyzeGlow = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const score = Math.floor(Math.random() * 15) + 75; // 75-90 range
      setGlowScore(score);
      setIsAnalyzing(false);
      
      // Auto-scroll to results
      setTimeout(() => {
        document.getElementById('glow-results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 2500);
  };

  // Generate AI caption based on filter and mood
  const generateCaption = () => {
    const captions = {
      'ICELAND': [
        "That effortless cool thing? Found it.",
        "Less is more. And this is everything.",
        "When you know, you know."
      ],
      'OSLO': [
        "Caught the good light today.",
        "This is my happy place.",
        "Sunshine state of mind."
      ],
      'STOCKHOLM': [
        "Feeling very editorial today.",
        "Sometimes you need the contrast.",
        "Magazine mode: on."
      ],
      'COPENHAGEN': [
        "Soft but strong. My favorite combo.",
        "Dreamy but focused.",
        "Cozy vibes, big dreams."
      ],
      'REYKJAVIK': [
        "Moody in the best way.",
        "Dark coffee, bright ideas.",
        "This energy though."
      ]
    };

    const filterCaptions = captions[selectedFilter] || [
      "Just me being me.",
      "Building something beautiful here.",
      "One photo at a time."
    ];

    const caption = filterCaptions[Math.floor(Math.random() * filterCaptions.length)];
    setGeneratedCaption(caption);
    setShowCaptionModal(true);
  };

  // Check trending status
  useEffect(() => {
    if (selectedFilter) {
      // Simulate trending data
      const trending = Math.floor(Math.random() * 50) + 30; // 30-80%
      setTrendingPercentage(trending);
    }
  }, [selectedFilter]);

  // Calendar integration
  const saveToCalendar = () => {
    setShowCalendarModal(true);
  };

  // Social share functions
  const shareToInstagram = () => {
    // In real app, this would use Instagram API
    alert('Opening Instagram... (In production, this would share directly)');
  };

  const shareToLinkedIn = () => {
    // In real app, this would use LinkedIn API
    alert('Opening LinkedIn... (In production, this would share directly)');
  };
  const downloadEditedImage = () => {
    if (!uploadedImage || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Apply filter
      if (selectedFilter && ctx) {
        const filter = nordicFilters.find(f => f.name === selectedFilter);
        if (filter) {
          ctx.filter = filter.filter.replace(/\)/g, `) opacity(${filterIntensity}%`);
        }
      }
      
      ctx?.drawImage(img, 0, 0);
      
      // Download
      const link = document.createElement('a');
      link.download = `selfie-ai-${selectedFilter || 'original'}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();
    };
    
    img.src = uploadedImage;
  };

  // Get feedback based on score
  const getGlowFeedback = (score: number) => {
    if (score >= 85) return "Okay, this is really good. Like, really good. Just a tiny tweak and it's perfect.";
    if (score >= 75) return "You've got something here. Let's just polish it up a bit.";
    return "No worries, we all start somewhere. I know exactly how to fix this.";
  };

  return (
    <div className="min-h-screen bg-[#171719]">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-5xl md:text-7xl text-white font-light tracking-tight">
            The Glow Check
          </h1>
          <p className="text-white/60 text-lg mt-4 max-w-2xl">
            Time for some honest feedback. But like, the kind that actually helps.
          </p>
        </div>
      </div>

      {/* Upload Section */}
      {!uploadedImage && (
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/20 hover:border-white/40 transition-all duration-500 cursor-pointer group"
          >
            <div className="p-20 text-center">
              <Upload className="w-16 h-16 text-white/40 group-hover:text-white/60 mx-auto mb-6 transition-colors" />
              <h2 className="text-2xl text-white mb-2">Drop your selfie here</h2>
              <p className="text-white/60">Click to upload. Time to glow.</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>
      )}

      {/* Analysis Section */}
      {uploadedImage && !showStudio && (
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Preview */}
            <div className="relative">
              <img 
                src={uploadedImage} 
                alt="Your selfie" 
                className="w-full h-auto"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 text-white animate-pulse mx-auto mb-4" />
                    <p className="text-white text-lg">Analyzing your glow...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Analysis Panel */}
            <div className="flex flex-col justify-center">
              {!glowScore && !isAnalyzing && (
                <div>
                  <h2 className="text-3xl text-white mb-6">Ready?</h2>
                  <p className="text-white/60 text-lg mb-8">
                    I'll look at your lighting, angles, and that special something that makes people stop and look.
                  </p>
                  <button
                    onClick={analyzeGlow}
                    className="bg-white text-[#171719] px-10 py-4 text-sm tracking-[0.3em] hover:bg-[#F1F1F1] transition-colors"
                  >
                    SHOW ME
                  </button>
                </div>
              )}

              {/* Results */}
              {glowScore && (
                <div id="glow-results" className="animate-fadeIn">
                  <div className="mb-8">
                    <p className="text-white/60 text-sm tracking-[0.3em] mb-2">YOUR GLOW SCORE</p>
                    <div className="text-8xl text-white font-light">{glowScore}</div>
                  </div>
                  
                  <p className="text-white/80 text-lg mb-8 italic">
                    "{getGlowFeedback(glowScore)}"
                  </p>

                  <div className="space-y-4 mb-8">
                    {/* Score Breakdown */}
                    <div className="flex justify-between items-center text-white/60">
                      <span className="flex items-center gap-2">
                        <Sun className="w-4 h-4" /> Light Quality
                      </span>
                      <span>{Math.floor(Math.random() * 10) + 80}/100</span>
                    </div>
                    <div className="flex justify-between items-center text-white/60">
                      <span className="flex items-center gap-2">
                        <Grid3x3 className="w-4 h-4" /> Your Best Angle
                      </span>
                      <span>{Math.floor(Math.random() * 10) + 75}/100</span>
                    </div>
                    <div className="flex justify-between items-center text-white/60">
                      <span className="flex items-center gap-2">
                        <Zap className="w-4 h-4" /> That Special Something
                      </span>
                      <span>{Math.floor(Math.random() * 10) + 85}/100</span>
                    </div>
                    <div className="flex justify-between items-center text-white/60">
                      <span className="flex items-center gap-2">
                        <Camera className="w-4 h-4" /> Overall Vibe
                      </span>
                      <span>{Math.floor(Math.random() * 10) + 80}/100</span>
                    </div>
                    <div className="flex justify-between items-center text-white/60">
                      <span className="flex items-center gap-2">
                        <Star className="w-4 h-4" /> Story Power
                      </span>
                      <span>{Math.floor(Math.random() * 10) + 78}/100</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowStudio(true)}
                    className="w-full border border-white text-white px-8 py-4 text-sm tracking-[0.3em] hover:bg-white hover:text-[#171719] transition-all duration-500"
                  >
                    PERFECT THIS →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Studio Section */}
      {showStudio && uploadedImage && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Filters Panel */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl text-white mb-6">Nordic Collection</h2>
              <div className="space-y-3">
                {nordicFilters.map((filter) => (
                  <button
                    key={filter.name}
                    onClick={() => setSelectedFilter(filter.name)}
                    className={`w-full text-left p-4 border transition-all duration-300 ${
                      selectedFilter === filter.name 
                        ? 'bg-white text-[#171719] border-white' 
                        : 'bg-transparent text-white border-white/20 hover:border-white/40'
                    }`}
                  >
                    <div className="font-medium tracking-[0.2em] text-sm">{filter.name}</div>
                    <div className={`text-xs mt-1 ${
                      selectedFilter === filter.name ? 'text-[#171719]/60' : 'text-white/60'
                    }`}>
                      {filter.description}
                    </div>
                  </button>
                ))}
              </div>

              {/* Intensity Slider */}
              {selectedFilter && (
                <div className="mt-8">
                  <label className="text-white text-sm tracking-[0.2em]">
                    INTENSITY: {filterIntensity}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filterIntensity}
                    onChange={(e) => setFilterIntensity(Number(e.target.value))}
                    className="w-full mt-2 accent-white"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                <button
                  onClick={downloadEditedImage}
                  className="w-full bg-white text-[#171719] px-6 py-3 text-sm tracking-[0.2em] hover:bg-[#F1F1F1] transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  DOWNLOAD
                </button>
                
                {/* New Bonus Features */}
                <button
                  onClick={saveToCalendar}
                  className="w-full border border-white text-white px-6 py-3 text-sm tracking-[0.2em] hover:bg-white hover:text-[#171719] transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  SAVE TO CALENDAR
                </button>
                
                <button
                  onClick={generateCaption}
                  className="w-full border border-white text-white px-6 py-3 text-sm tracking-[0.2em] hover:bg-white hover:text-[#171719] transition-all flex items-center justify-center gap-2"
                >
                  <Hash className="w-4 h-4" />
                  GENERATE CAPTION
                </button>
                
                <div className="flex gap-3">
                  <button
                    onClick={shareToInstagram}
                    className="flex-1 border border-white/20 text-white px-4 py-3 text-sm tracking-[0.2em] hover:border-white/40 transition-colors flex items-center justify-center gap-2"
                  >
                    <Instagram className="w-4 h-4" />
                    SHARE
                  </button>
                  <button
                    onClick={shareToLinkedIn}
                    className="flex-1 border border-white/20 text-white px-4 py-3 text-sm tracking-[0.2em] hover:border-white/40 transition-colors flex items-center justify-center gap-2"
                  >
                    <Linkedin className="w-4 h-4" />
                    SHARE
                  </button>
                </div>
                
                <button
                  onClick={() => {
                    setSelectedFilter('');
                    setFilterIntensity(100);
                  }}
                  className="w-full border border-white/20 text-white/60 px-6 py-3 text-sm tracking-[0.2em] hover:text-white hover:border-white/40 transition-colors"
                >
                  RESET
                </button>
              </div>
              
              {/* Trending Indicator */}
              {selectedFilter && trendingPercentage > 40 && (
                <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="flex items-center gap-2 text-white">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm tracking-[0.2em]">TRENDING</span>
                  </div>
                  <p className="text-white/80 text-sm mt-1">
                    This style is up +{trendingPercentage}% this week
                  </p>
                </div>
              )}
            </div>

            {/* Image Preview */}
            <div className="lg:col-span-2">
              <div className="relative bg-black">
                <img 
                  src={uploadedImage} 
                  alt="Edit preview" 
                  className="w-full h-auto"
                  style={{
                    filter: selectedFilter 
                      ? nordicFilters.find(f => f.name === selectedFilter)?.filter.replace(/\)/g, `) opacity(${filterIntensity}%`)
                      : 'none'
                  }}
                />
                {/* Before/After Toggle */}
                <button
                  className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-sm text-white px-4 py-2 text-xs tracking-[0.2em] border border-white/20"
                  onMouseDown={() => setSelectedFilter('')}
                  onMouseUp={() => setSelectedFilter(selectedFilter || 'ICELAND')}
                  onMouseLeave={() => setSelectedFilter(selectedFilter || 'ICELAND')}
                >
                  HOLD FOR BEFORE
                </button>
              </div>

              {/* Quick Tips */}
              <div className="mt-6 p-6 bg-white/5 border border-white/10">
                <h3 className="text-white text-sm tracking-[0.2em] mb-3">QUICK WINS</h3>
                <ul className="space-y-2 text-white/60 text-sm">
                  <li>• ICELAND for that untouchable vibe</li>
                  <li>• OSLO when you need some warmth</li>
                  <li>• STOCKHOLM gives instant editorial</li>
                  <li>• Try a few. See what feels right.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Canvas for Export */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Calendar Modal */}
      {showCalendarModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-[#171719] border border-white/20 max-w-md w-full p-8">
            <h3 className="text-2xl text-white mb-6">Add to Content Calendar</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-white/60 text-sm tracking-[0.2em] block mb-2">
                  SELECT DAY
                </label>
                <select 
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 focus:border-white/40 outline-none"
                >
                  <option value="">Pick your power day...</option>
                  <option value="monday">Monday - Fresh Start</option>
                  <option value="tuesday">Tuesday - Real Talk</option>
                  <option value="wednesday">Wednesday - Wisdom Drop</option>
                  <option value="thursday">Thursday - Behind the Scenes</option>
                  <option value="friday">Friday - Celebration</option>
                  <option value="saturday">Saturday - Stories</option>
                  <option value="sunday">Sunday - Strategy</option>
                </select>
              </div>
              
              <div>
                <label className="text-white/60 text-sm tracking-[0.2em] block mb-2">
                  NOTES
                </label>
                <textarea 
                  placeholder="What's the story here?"
                  className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 focus:border-white/40 outline-none h-24 resize-none"
                />
              </div>
              
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowCalendarModal(false);
                    alert('Added to calendar! (In production, this would save to your calendar)');
                  }}
                  className="flex-1 bg-white text-[#171719] px-6 py-3 text-sm tracking-[0.2em] hover:bg-[#F1F1F1] transition-colors"
                >
                  SAVE
                </button>
                <button
                  onClick={() => setShowCalendarModal(false)}
                  className="flex-1 border border-white/20 text-white px-6 py-3 text-sm tracking-[0.2em] hover:border-white/40 transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Caption Modal */}
      {showCaptionModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-[#171719] border border-white/20 max-w-md w-full p-8">
            <h3 className="text-2xl text-white mb-6">Your Caption</h3>
            
            <div className="bg-white/5 border border-white/10 p-6 mb-6">
              <p className="text-white text-lg italic">"{generatedCaption}"</p>
            </div>
            
            <div className="space-y-3">
              <p className="text-white/60 text-sm">YOUR POWER TAGS</p>
              <p className="text-white/80 text-sm">
                #PersonalBrand #{selectedFilter}Energy #ContentThatConverts #BrandYourSelfie #StrategicContent #AuthenticPresence #SelfieStrategy
              </p>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${generatedCaption}\n\n#SelfieQueen #PersonalBrand #${selectedFilter}Vibes #GlowUp #ContentCreator`);
                  alert('Caption copied to clipboard!');
                  setShowCaptionModal(false);
                }}
                className="flex-1 bg-white text-[#171719] px-6 py-3 text-sm tracking-[0.2em] hover:bg-[#F1F1F1] transition-colors"
              >
                COPY CAPTION
              </button>
              <button
                onClick={() => setShowCaptionModal(false)}
                className="flex-1 border border-white/20 text-white px-6 py-3 text-sm tracking-[0.2em] hover:border-white/40 transition-colors"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
} 