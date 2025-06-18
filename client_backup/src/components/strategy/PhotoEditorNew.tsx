import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  Download, 
  Sparkles, 
  Palette, 
  Sliders, 
  Scissors,
  RotateCcw
} from 'lucide-react';

interface PhotoEditorProps {
  user?: any;
}

export default function PhotoEditorNew({ user }: PhotoEditorProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingType, setProcessingType] = useState<string>('');
  const [showBefore, setShowBefore] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'filters' | 'adjust' | 'crop'>('ai');
  
  // Filter and adjustment states
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [presetIntensity, setPresetIntensity] = useState(100);
  const [cropFormat, setCropFormat] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [activeAdjustment, setActiveAdjustment] = useState<string>("");
  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    contrast: 0,
    sharpness: 0,
    vignette: 0,
    temperature: 0,
    saturation: 0
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorSectionRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Handle tab changes with smooth scroll
  const handleTabChange = (tab: "ai" | "filters" | "adjust" | "crop") => {
    setActiveTab(tab);
    setActiveFilter("");
    setActiveAdjustment("");
    setTimeout(() => {
      editorSectionRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }, 100);
  };

  // Fix temperature adjustment to prevent purple shift
  const handleTemperatureChange = (value: number[]) => {
    setAdjustments(prev => ({ 
      ...prev, 
      temperature: value[0] * 0.3
    }));
  };



  // API functions
  const handleFaceEnhancement = async () => {
    if (!uploadedImage) return;
    setIsProcessing(true);
    setProcessingType('ENHANCING FACE');
    
    try {
      console.log('Starting face enhancement...');
      const response = await fetch('/api/replicate/face-enhancement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: uploadedImage })
      });
      
      if (response.ok) {
        const data = await response.json();
        setEnhancedImage(data.enhanced_url);
        toast({ title: "Face enhanced successfully!", variant: "default" });
      } else {
        throw new Error('Enhancement failed');
      }
    } catch (error) {
      toast({ title: "Enhancement failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
      setProcessingType('');
    }
  };

  const handleBackgroundRemoval = async () => {
    if (!uploadedImage) return;
    setIsProcessing(true);
    setProcessingType('REMOVING BACKGROUND');
    
    try {
      console.log('Starting background removal...');
      const response = await fetch('/api/replicate/remove-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: uploadedImage })
      });
      
      if (response.ok) {
        const data = await response.json();
        setEnhancedImage(data.enhanced_url);
        toast({ title: "Background removed successfully!", variant: "default" });
      } else {
        throw new Error('Background removal failed');
      }
    } catch (error) {
      toast({ title: "Background removal failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
      setProcessingType('');
    }
  };

  const handleApplyVogueFilter = async () => {
    if (!uploadedImage) return;
    setIsProcessing(true);
    setProcessingType('APPLYING EDITORIAL FILTER');
    
    try {
      console.log('Starting Vogue filter application...');
      const response = await fetch('/api/replicate/vogue-filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image_url: uploadedImage,
          style: "moody editorial" 
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setEnhancedImage(data.enhanced_url);
        toast({ title: "Editorial filter applied!", variant: "default" });
      } else {
        throw new Error('Filter application failed');
      }
    } catch (error) {
      toast({ title: "Filter application failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
      setProcessingType('');
    }
  };

  // Restore original Vogue preset filters
  const voguePresets = [
    { name: 'Glow', filter: 'brightness(137%) contrast(86%) saturate(108%) sepia(5%) hue-rotate(-7deg)', description: 'Soft luminous glow' },
    { name: 'Luna', filter: 'brightness(113%) contrast(105%) saturate(108%) sepia(3%) hue-rotate(2deg)', description: 'Dreamy moonlight' },
    { name: 'Bare', filter: 'brightness(115%) contrast(106%) saturate(86%) sepia(4%) hue-rotate(3deg)', description: 'Natural minimalism' },
    { name: 'Cine', filter: 'brightness(115%) contrast(117%) saturate(78%) sepia(9%) hue-rotate(5deg)', description: 'Cinematic mood' },
    { name: 'Noir', filter: 'brightness(48%) contrast(72%) saturate(100%) sepia(5%) hue-rotate(3deg)', description: 'Dramatic darkness' },
    { name: 'Street', filter: 'brightness(110%) contrast(112%) saturate(85%) sepia(3%) hue-rotate(4deg)', description: 'Urban edge' },
    { name: 'Muse', filter: 'brightness(100%) contrast(106%) saturate(100%) sepia(2%) hue-rotate(0deg)', description: 'Editorial polish' },
    { name: 'Skin', filter: 'brightness(74%) contrast(109%) saturate(90%) sepia(4%) hue-rotate(3deg)', description: 'Portrait perfection' },
    { name: 'Soft', filter: 'brightness(106%) contrast(107%) saturate(91%) sepia(3%) hue-rotate(2deg)', description: 'Gentle elegance' },
    { name: 'Grace', filter: 'brightness(85%) contrast(106%) saturate(108%) sepia(2%) hue-rotate(-10deg)', description: 'Refined beauty' }
  ];

  // Helper functions
  const getCombinedFilter = (preset: string, intensity: number) => {
    const presetData = voguePresets.find(p => p.name === preset);
    if (!presetData) return 'none';
    
    const factor = intensity / 100;
    return presetData.filter.replace(/(\d+(?:\.\d+)?)/g, (match) => {
      const value = parseFloat(match);
      return (1 + (value - 1) * factor).toString();
    });
  };

  const getAdjustmentStyles = () => {
    // Fix temperature to use proper warm/cool adjustment
    const temperatureFilter = adjustments.temperature !== 0 
      ? adjustments.temperature > 0 
        ? `sepia(${Math.abs(adjustments.temperature) * 0.6}%) hue-rotate(${adjustments.temperature * 0.5}deg)` // Warmer
        : `hue-rotate(${adjustments.temperature * 0.8}deg) saturate(${100 - Math.abs(adjustments.temperature) * 0.2}%)` // Cooler
      : '';
    
    // Fix vignette to only affect the image, not the entire page
    const vignetteFilter = adjustments.vignette > 0 
      ? `drop-shadow(inset 0 0 ${adjustments.vignette * 2}px rgba(0,0,0,${adjustments.vignette * 0.02}))`
      : '';
    
    return {
      filter: `brightness(${100 + adjustments.brightness}%) 
               contrast(${100 + adjustments.contrast}%) 
               saturate(${100 + adjustments.saturation}%) 
               ${temperatureFilter}
               ${adjustments.sharpness !== 0 ? `contrast(${100 + adjustments.sharpness * 0.3}%) blur(${adjustments.sharpness < 0 ? Math.abs(adjustments.sharpness) * 0.1 : 0}px)` : ''}
               ${vignetteFilter}`.replace(/\s+/g, ' ').trim()
    };
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setEnhancedImage(null);
        setSelectedPreset("");
        setActiveFilter("");
        setActiveAdjustment("");
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle crop functionality
  const applyCrop = (format: string) => {
    if (!uploadedImage) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      let { width, height } = img;
      let cropWidth, cropHeight, x = 0, y = 0;
      
      switch (format) {
        case 'Square':
          cropWidth = cropHeight = Math.min(width, height);
          x = (width - cropWidth) / 2;
          y = (height - cropHeight) / 2;
          break;
        case 'Portrait':
          cropWidth = width;
          cropHeight = width * 1.25; // 4:5 ratio
          if (cropHeight > height) {
            cropHeight = height;
            cropWidth = height * 0.8;
            x = (width - cropWidth) / 2;
          } else {
            y = (height - cropHeight) / 2;
          }
          break;
        case 'Story':
          cropWidth = width;
          cropHeight = width * 1.78; // 9:16 ratio
          if (cropHeight > height) {
            cropHeight = height;
            cropWidth = height * 0.56;
            x = (width - cropWidth) / 2;
          } else {
            y = (height - cropHeight) / 2;
          }
          break;
        case 'Landscape':
          cropWidth = width;
          cropHeight = width * 0.6; // 5:3 ratio
          if (cropHeight > height) {
            cropHeight = height;
            cropWidth = height * 1.67;
            x = (width - cropWidth) / 2;
          } else {
            y = (height - cropHeight) / 2;
          }
          break;
        default:
          cropWidth = width;
          cropHeight = height;
      }
      
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      ctx?.drawImage(img, x, y, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
      
      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setEnhancedImage(croppedDataUrl);
      toast({ title: `Image cropped to ${format} format`, variant: "default" });
    };
    
    img.src = enhancedImage || uploadedImage;
  };

  const downloadImage = () => {
    const imageToDownload = enhancedImage || uploadedImage;
    if (imageToDownload) {
      const link = document.createElement('a');
      link.href = imageToDownload;
      link.download = `selfie-ai-${cropFormat || 'edited'}.jpg`;
      link.click();
      toast({ title: "Image downloaded!", variant: "default" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {!uploadedImage ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-black p-12 text-center">
            <div className="mb-8">
              <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="font-['Prata'] text-2xl text-black mb-4">Upload Your Photo</h2>
              <p className="font-['Inter'] text-gray-600 mb-8">
                Upload a high-quality photo to begin your Vogue-style transformation
              </p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-black text-white hover:bg-gray-800 hover:shadow-lg px-8 py-4 text-sm font-bold uppercase tracking-wider border-none rounded-none"
            >
              <Upload className="w-5 h-5 mr-2" />
              Choose Photo
            </Button>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          {/* Sticky Photo Preview */}
          <div className="sticky top-20 z-30 mb-8 bg-gray-50 pb-4">
            {/* Active Tool Indicator */}
            {(activeFilter || activeAdjustment) && (
              <div className="text-center mb-4">
                <p className="text-gray-500 text-sm font-['Inter']">
                  You're editing: {activeFilter || activeAdjustment}
                </p>
              </div>
            )}

            {/* Photo with Before/After Toggle */}
            <div className="bg-white border border-black p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-['Prata'] text-lg text-black">Preview</h2>
                <div className="inline-flex items-center bg-gray-100 border border-gray-300">
                  <button
                    onClick={() => setShowBefore(false)}
                    className={`px-4 py-2 font-['Inter'] text-xs font-medium transition-all border-none ${
                      !showBefore 
                        ? 'bg-black text-white' 
                        : 'bg-transparent text-gray-600 hover:text-black'
                    }`}
                  >
                    Enhanced
                  </button>
                  <button
                    onClick={() => setShowBefore(true)}
                    className={`px-4 py-2 font-['Inter'] text-xs font-medium transition-all border-none ${
                      showBefore 
                        ? 'bg-black text-white' 
                        : 'bg-transparent text-gray-600 hover:text-black'
                    }`}
                  >
                    Original
                  </button>
                </div>
              </div>

              <div className="relative">
                {/* Processing Overlay */}
                {isProcessing && (
                  <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10">
                    <div className="text-center text-white">
                      <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="font-['Inter'] text-sm font-medium uppercase tracking-wider">{processingType}</p>
                    </div>
                  </div>
                )}
                
                <img
                  src={showBefore ? uploadedImage : (enhancedImage || uploadedImage)}
                  alt="Photo preview"
                  className="w-full max-h-[50vh] object-contain"
                  style={{
                    filter: showBefore ? 'none' : `${getCombinedFilter(selectedPreset, presetIntensity)} ${getAdjustmentStyles().filter || ''}`.trim()
                  }}
                />
              </div>
            </div>
          </div>

          {/* Top Tab Navigation */}
          <div className="bg-white border-b border-black mb-8">
            <div className="flex">
              {[
                { key: 'ai', label: 'AI ENHANCE', icon: Sparkles },
                { key: 'filters', label: 'FILTERS', icon: Palette },
                { key: 'adjust', label: 'ADJUST', icon: Sliders },
                { key: 'crop', label: 'CROP', icon: Scissors }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => handleTabChange(key as any)}
                  className={`flex-1 px-6 py-4 font-['Inter'] text-sm font-bold uppercase tracking-wider border-none transition-all rounded-none ${
                    activeTab === key
                      ? 'bg-black text-white shadow-lg'
                      : 'bg-white text-black border border-black hover:bg-black hover:text-white hover:shadow-lg'
                  }`}
                >
                  <Icon className="w-4 h-4 inline mr-2" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Collapsible Editor Tools */}
          <div ref={editorSectionRef} className="bg-white border border-black">
            {/* AI Enhancement Section */}
            {activeTab === 'ai' && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={handleFaceEnhancement}
                    disabled={isProcessing}
                    className="bg-black text-white hover:bg-gray-800 hover:shadow-lg px-6 py-4 text-sm font-bold uppercase tracking-wider border-none rounded-none"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    ENHANCE FACE
                  </Button>
                  <Button 
                    onClick={handleBackgroundRemoval}
                    disabled={isProcessing}
                    className="bg-white text-black border border-black hover:bg-black hover:text-white hover:shadow-lg px-6 py-4 text-sm font-bold uppercase tracking-wider rounded-none"
                  >
                    <Scissors className="w-4 h-4 mr-2" />
                    REMOVE BACKGROUND
                  </Button>
                  <Button 
                    onClick={handleApplyVogueFilter}
                    disabled={isProcessing}
                    className="bg-black text-white hover:bg-gray-800 hover:shadow-lg px-6 py-4 text-sm font-bold uppercase tracking-wider border-none rounded-none"
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    EDITORIAL FILTER
                  </Button>
                  <Button 
                    onClick={() => {
                      setUploadedImage(null);
                      setEnhancedImage(null);
                      setSelectedPreset("");
                      setActiveFilter("");
                      setActiveAdjustment("");
                    }}
                    className="bg-white text-black border border-black hover:bg-black hover:text-white px-6 py-4 text-sm font-bold uppercase tracking-wider"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    RESET
                  </Button>
                </div>
              </div>
            )}

            {/* Filters Section */}
            {activeTab === 'filters' && (
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {voguePresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        setSelectedPreset(preset.name);
                        setActiveFilter(preset.name);
                      }}
                      className={`p-4 text-sm font-bold uppercase tracking-wider border transition-all rounded-none ${
                        selectedPreset === preset.name
                          ? 'bg-black text-white border-black shadow-lg'
                          : 'bg-white text-black border-black hover:bg-black hover:text-white hover:shadow-lg'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>

                {/* Filter Intensity Slider */}
                {selectedPreset && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <Label className="text-sm font-bold uppercase tracking-wider text-black">
                        Intensity: {presetIntensity}%
                      </Label>
                    </div>
                    <Slider
                      value={[presetIntensity]}
                      onValueChange={(value) => setPresetIntensity(value[0])}
                      min={0}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Adjustments Section */}
            {activeTab === 'adjust' && (
              <div className="p-6 space-y-6">
                {[
                  { key: 'brightness', label: 'Brightness', min: -50, max: 50 },
                  { key: 'contrast', label: 'Contrast', min: -50, max: 50 },
                  { key: 'saturation', label: 'Saturation', min: -50, max: 50 },
                  { key: 'temperature', label: 'Temperature', min: -50, max: 50 },
                  { key: 'sharpness', label: 'Sharpness', min: -20, max: 20 },
                  { key: 'vignette', label: 'Vignette', min: 0, max: 50 }
                ].map(({ key, label, min, max }) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium text-black">{label}</Label>
                      <span className="text-sm text-gray-600">
                        {adjustments[key as keyof typeof adjustments]}
                      </span>
                    </div>
                    <Slider
                      value={[adjustments[key as keyof typeof adjustments]]}
                      onValueChange={(value) => {
                        if (key === 'temperature') {
                          handleTemperatureChange(value);
                        } else {
                          setAdjustments(prev => ({ ...prev, [key]: value[0] }));
                        }
                        setActiveAdjustment(label);
                      }}
                      min={min}
                      max={max}
                      step={1}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Crop Section */}
            {activeTab === 'crop' && (
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {['Square', 'Portrait', 'Story', 'Landscape'].map((format) => (
                    <button
                      key={format}
                      onClick={() => {
                        setCropFormat(format);
                        applyCrop(format);
                      }}
                      className={`p-4 text-sm font-bold uppercase tracking-wider border transition-all rounded-none ${
                        cropFormat === format
                          ? 'bg-black text-white border-black shadow-lg'
                          : 'bg-white text-black border-black hover:bg-black hover:text-white hover:shadow-lg'
                      }`}
                    >
                      {format}
                    </button>
                  ))}
                </div>
                
                {/* Reset Crop Button */}
                {cropFormat && (
                  <div className="text-center">
                    <button
                      onClick={() => {
                        setCropFormat('');
                        setEnhancedImage(uploadedImage);
                        toast({ title: "Crop reset to original", variant: "default" });
                      }}
                      className="bg-white text-black border border-black hover:bg-black hover:text-white hover:shadow-lg px-6 py-2 text-sm font-bold uppercase tracking-wider rounded-none transition-all"
                    >
                      Reset Crop
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 p-6 bg-white border border-black">
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => {
                  setUploadedImage(null);
                  setEnhancedImage(null);
                  setSelectedPreset("");
                  setPresetIntensity(100);
                  setActiveFilter("");
                  setActiveAdjustment("");
                  setAdjustments({
                    brightness: 0,
                    contrast: 0,
                    sharpness: 0,
                    vignette: 0,
                    temperature: 0,
                    saturation: 0
                  });
                }}
                variant="outline"
                className="bg-white border-black text-black hover:bg-black hover:text-white hover:shadow-lg px-8 py-3 text-sm font-bold uppercase tracking-wider rounded-none"
              >
                Upload New
              </Button>
              <Button 
                onClick={downloadImage} 
                className="bg-black text-white hover:bg-gray-800 hover:shadow-lg px-8 py-3 text-sm font-bold uppercase tracking-wider rounded-none"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}