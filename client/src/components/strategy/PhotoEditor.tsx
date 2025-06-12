import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Camera, Upload, Download, RotateCcw, ChevronDown, ChevronUp, Sparkles, Crop } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PhotoEditorProps {
  user?: any;
}

export default function PhotoEditor({ user }: PhotoEditorProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [showBefore, setShowBefore] = useState(false);
  const [presetIntensity, setPresetIntensity] = useState<number>(100);
  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    contrast: 0,
    sharpness: 0,
    vignette: 0,
    temperature: 0,
    saturation: 0
  });
  const [activeTab, setActiveTab] = useState<"filters" | "adjust" | "crop">("filters");
  const [cropAspectRatio, setCropAspectRatio] = useState<string>("");
  const [expandedAdjustment, setExpandedAdjustment] = useState<string>("");
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [cropScale, setCropScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingType, setProcessingType] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setEnhancedImage(null); // Reset enhanced image when uploading new
      };
      reader.readAsDataURL(file);
    }
  };

  // AI Enhancement Functions
  const handleEnhanceFace = async () => {
    if (!uploadedImage) return;
    
    setIsProcessing(true);
    setProcessingType("Enhancing face...");
    
    try {
      const response = await fetch('/api/replicate/enhance-face', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: uploadedImage
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to enhance face');
      }
      
      const data = await response.json();
      setEnhancedImage(data.enhanced_url);
      
      toast({
        title: "Face Enhanced!",
        description: "Your photo has been professionally retouched.",
      });
    } catch (error) {
      toast({
        title: "Enhancement Failed",
        description: "There was an error enhancing your photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingType("");
    }
  };

  const handleRemoveBackground = async () => {
    if (!uploadedImage) return;
    
    setIsProcessing(true);
    setProcessingType("Removing background...");
    
    try {
      const response = await fetch('/api/replicate/remove-background', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: uploadedImage
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove background');
      }
      
      const data = await response.json();
      setEnhancedImage(data.enhanced_url);
      
      toast({
        title: "Background Removed!",
        description: "Your photo is now ready for professional use.",
      });
    } catch (error) {
      toast({
        title: "Background Removal Failed",
        description: "There was an error processing your photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingType("");
    }
  };

  const handleApplyVogueFilter = async () => {
    if (!uploadedImage) return;
    
    setIsProcessing(true);
    setProcessingType("Applying Vogue filter...");
    
    try {
      const response = await fetch('/api/replicate/vogue-filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: uploadedImage,
          style: "moody editorial"
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to apply filter');
      }
      
      const data = await response.json();
      setEnhancedImage(data.enhanced_url);
      
      toast({
        title: "Vogue Filter Applied!",
        description: "Your photo now has a professional editorial look.",
      });
    } catch (error) {
      toast({
        title: "Filter Failed",
        description: "There was an error applying the filter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingType("");
    }
  };

  // Handle preset click
  const handlePresetClick = (presetName: string) => {
    setSelectedPreset(presetName);
    setShowBefore(false);
  };

  // Get preset-specific filter styles for the 10 final presets with new Vogue-style names
  const getPresetFilter = (presetName: string): string => {
    const filters: Record<string, string> = {
      'Glow': 'brightness(137%) contrast(86%) saturate(108%) sepia(5%) hue-rotate(-7deg)',
      'Luna': 'brightness(113%) contrast(105%) saturate(108%) sepia(3%) hue-rotate(2deg)',
      'Bare': 'brightness(115%) contrast(106%) saturate(86%) sepia(4%) hue-rotate(3deg)',
      'Cine': 'brightness(115%) contrast(117%) saturate(78%) sepia(9%) hue-rotate(5deg)',
      'Noir': 'brightness(48%) contrast(72%) saturate(100%) sepia(5%) hue-rotate(3deg)',
      'Street': 'brightness(110%) contrast(112%) saturate(85%) sepia(3%) hue-rotate(4deg)',
      'Muse': 'brightness(100%) contrast(106%) saturate(100%) sepia(2%) hue-rotate(0deg)',
      'Skin': 'brightness(74%) contrast(109%) saturate(90%) sepia(4%) hue-rotate(3deg)',
      'Soft': 'brightness(106%) contrast(107%) saturate(91%) sepia(3%) hue-rotate(2deg)',
      'Grace': 'brightness(85%) contrast(106%) saturate(108%) sepia(2%) hue-rotate(-10deg)'
    };
    return filters[presetName] || 'none';
  };

  // Get adjustment filters based on user controls
  const getAdjustmentFilter = (): string => {
    const filters = [];
    
    if (adjustments.brightness !== 0) {
      const brightnessValue = 100 + adjustments.brightness;
      filters.push(`brightness(${brightnessValue}%)`);
    }
    
    if (adjustments.contrast !== 0) {
      const contrastValue = 100 + adjustments.contrast;
      filters.push(`contrast(${contrastValue}%)`);
    }
    
    if (adjustments.saturation !== 0) {
      const saturationValue = 100 + adjustments.saturation;
      filters.push(`saturate(${saturationValue}%)`);
    }
    
    if (adjustments.temperature !== 0) {
      filters.push(`hue-rotate(${adjustments.temperature}deg)`);
    }
    
    return filters.join(' ');
  };

  // Scale filter intensity by reducing the effect values
  const scaleFilterIntensity = (filterString: string, intensity: number): string => {
    return filterString.replace(/(\w+)\(([^)]+)\)/g, (match, property, value) => {
      if (property === 'brightness' || property === 'contrast' || property === 'saturate') {
        const numValue = parseFloat(value.replace('%', ''));
        const baseValue = 100;
        const scaledValue = baseValue + (numValue - baseValue) * intensity;
        return `${property}(${scaledValue}%)`;
      }
      if (property === 'sepia' || property === 'hue-rotate') {
        const numValue = parseFloat(value.replace(/[^\d.-]/g, ''));
        const scaledValue = numValue * intensity;
        const unit = value.includes('deg') ? 'deg' : '%';
        return `${property}(${scaledValue}${unit})`;
      }
      return match;
    });
  };

  // Combine preset filter with intensity and adjustments
  const getCombinedFilter = (presetName: string, intensity: number): string => {
    const adjustmentFilter = getAdjustmentFilter();
    
    if (presetName && intensity > 0) {
      const presetFilter = getPresetFilter(presetName);
      if (presetFilter !== 'none') {
        const scaledFilter = scaleFilterIntensity(presetFilter, intensity / 100);
        
        if (!adjustmentFilter) return scaledFilter;
        return `${scaledFilter} ${adjustmentFilter}`;
      }
    }
    
    return adjustmentFilter || 'none';
  };

  // Download edited image with all applied effects
  const downloadImage = () => {
    if (!uploadedImage) {
      toast({
        title: "No Image",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Set canvas dimensions based on crop ratio if applied
      let canvasWidth = img.width;
      let canvasHeight = img.height;
      
      if (cropAspectRatio) {
        const ratios: Record<string, number> = {
          "1:1": 1,
          "4:5": 4/5,
          "9:16": 9/16
        };
        
        const targetRatio = ratios[cropAspectRatio];
        if (targetRatio) {
          // Use the preview dimensions for consistent output
          const previewDims = getCropPreviewDimensions();
          if (previewDims) {
            canvasWidth = previewDims.width * 2; // Higher resolution output
            canvasHeight = previewDims.height * 2;
          }
        }
      }
      
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      
      if (ctx) {
        // Apply all CSS filters to canvas context
        const combinedFilter = getCombinedFilter(selectedPreset, presetIntensity);
        if (combinedFilter !== 'none') {
          ctx.filter = combinedFilter;
        }
        
        if (cropAspectRatio) {
          // Apply the user's crop positioning and scaling
          const scaleRatio = (canvasWidth / (getCropPreviewDimensions()?.width || 300));
          const scaledX = cropPosition.x * scaleRatio;
          const scaledY = cropPosition.y * scaleRatio;
          const finalScale = cropScale * scaleRatio;
          
          ctx.drawImage(
            img,
            scaledX, scaledY,
            img.width * finalScale, img.height * finalScale
          );
        } else {
          // Draw normal image without crop
          ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
        }
      }
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `selfie-ai-edited-${Date.now()}.jpg`;
          a.click();
          URL.revokeObjectURL(url);
          
          toast({
            title: "Download Complete",
            description: "Your edited image has been saved",
          });
        }
      }, 'image/jpeg', 0.95);
    };
    
    img.crossOrigin = "anonymous";
    img.src = uploadedImage;
  };

  // AI Enhance function
  const handleAIEnhance = () => {
    setAdjustments(prev => ({
      ...prev,
      contrast: Math.min(30, prev.contrast + 15),
      sharpness: Math.min(40, prev.sharpness + 20),
      brightness: Math.min(15, prev.brightness + 5)
    }));
    toast({
      title: "AI Enhanced",
      description: "Applied intelligent contrast, sharpness, and brightness adjustments",
    });
  };

  // Apply crop with aspect ratio
  const applyCrop = (ratio: string) => {
    setCropAspectRatio(ratio);
    setCropPosition({ x: 0, y: 0 });
    setCropScale(1);
    toast({
      title: "Crop Applied", 
      description: `Image cropped to ${ratio} format`,
    });
  };

  // Handle crop drag functionality
  const handleCropMouseDown = (e: React.MouseEvent) => {
    if (!cropAspectRatio) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - cropPosition.x, y: e.clientY - cropPosition.y });
  };

  const handleCropMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !cropAspectRatio) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setCropPosition({ x: newX, y: newY });
  };

  const handleCropMouseUp = () => {
    setIsDragging(false);
  };

  // Get crop preview dimensions
  const getCropPreviewDimensions = () => {
    if (!cropAspectRatio) return null;
    
    const ratios: Record<string, number> = {
      "1:1": 1,
      "4:5": 4/5,
      "9:16": 9/16
    };
    
    const targetRatio = ratios[cropAspectRatio];
    const previewSize = 300; // Fixed preview container size
    
    if (targetRatio <= 1) {
      return {
        width: previewSize * targetRatio,
        height: previewSize
      };
    } else {
      return {
        width: previewSize,
        height: previewSize / targetRatio
      };
    }
  };

  // Toggle adjustment panel
  const toggleAdjustment = (adjustmentType: string) => {
    setExpandedAdjustment(expandedAdjustment === adjustmentType ? "" : adjustmentType);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="font-['Prata'] text-3xl text-black mb-2">Professional Photo Editor</h1>
        <p className="font-['Inter'] text-gray-600">Transform your photos with Sandra's signature presets</p>
      </div>

      {/* Upload Section */}
      {!uploadedImage && (
        <div className="max-w-md mx-auto">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="font-['Prata'] text-lg text-black mb-2">Upload Your Photo</h3>
            <p className="text-gray-500 mb-4 font-['Inter']">
              Drag and drop or click to select a photo to edit
            </p>
            <Button onClick={() => fileInputRef.current?.click()} className="bg-black text-white hover:bg-gray-800">
              <Upload className="w-4 h-4 mr-2" />
              Choose Photo
            </Button>
          </div>
        </div>
      )}

      {uploadedImage && (
        <>
          {/* Before/After Toggle */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button 
              size="sm" 
              variant="ghost" 
              className={`font-['Inter'] font-bold uppercase tracking-wide text-xs ${showBefore ? 'bg-black text-white' : 'text-black hover:bg-gray-100'}`}
              onClick={() => setShowBefore(true)}
            >
              Before
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className={`font-['Inter'] font-bold uppercase tracking-wide text-xs ${!showBefore ? 'bg-black text-white' : 'text-black hover:bg-gray-100'}`}
              onClick={() => setShowBefore(false)}
            >
              After
            </Button>
          </div>

          {/* Image Preview */}
          <div className="max-w-lg mx-auto mb-8">
            <div className="aspect-square bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
              <img
                src={uploadedImage}
                alt="Preview"
                className="w-full h-full object-cover transition-all duration-300"
                style={{
                  filter: !showBefore ? getCombinedFilter(selectedPreset, presetIntensity) : 'none'
                }}
              />
            </div>
            {selectedPreset && !showBefore && (
              <p className="text-center mt-3 font-['Inter'] text-sm text-gray-600">
                Applied: <strong>{selectedPreset}</strong> filter at {presetIntensity}%
              </p>
            )}
          </div>

          {/* Professional Photo Editor */}
          <div>
            <h3 className="font-['Prata'] text-xl text-black mb-6">Professional Photo Editor</h3>
            
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-6">
              {[
                { id: 'filters', label: 'Filters' },
                { id: 'adjust', label: 'Adjust' },
                { id: 'crop', label: 'Crop' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 font-['Inter'] font-medium text-sm border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Filters Tab */}
            {activeTab === 'filters' && (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                  {[
                    { name: 'Glow', description: 'Soft luminous glow', color: '#F8F9FA' },
                    { name: 'Luna', description: 'Dreamy moonlight', color: '#F1F3F4' },
                    { name: 'Bare', description: 'Natural minimalism', color: '#F5F5F5' },
                    { name: 'Cine', description: 'Cinematic mood', color: '#4B5563' },
                    { name: 'Noir', description: 'Dramatic darkness', color: '#111827' },
                    { name: 'Street', description: 'Urban edge', color: '#6366F1' },
                    { name: 'Muse', description: 'Editorial polish', color: '#8B5CF6' },
                    { name: 'Skin', description: 'Portrait perfection', color: '#F472B6' },
                    { name: 'Soft', description: 'Gentle elegance', color: '#DB2777' },
                    { name: 'Grace', description: 'Refined beauty', color: '#BE185D' }
                  ].map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      className={`h-20 flex flex-col items-center justify-center p-2 border-2 transition-all duration-200 hover:shadow-lg ${
                        selectedPreset === preset.name 
                          ? 'border-black bg-black text-white shadow-lg ring-2 ring-black ring-offset-1' 
                          : 'border-gray-300 hover:border-black'
                      }`}
                      style={{
                        backgroundColor: selectedPreset === preset.name ? '#000' : preset.color,
                        color: selectedPreset === preset.name ? '#fff' : 
                              preset.name === 'Cine' || preset.name === 'Noir' ? '#fff' : '#000'
                      }}
                      onClick={() => handlePresetClick(preset.name)}
                    >
                      <span className="font-['Prata'] text-xs font-medium">{preset.name}</span>
                      <span className="font-['Inter'] text-xs opacity-80 text-center leading-tight">{preset.description}</span>
                    </Button>
                  ))}
                </div>

                {/* Preset Intensity Slider */}
                {selectedPreset && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="font-['Inter'] text-sm font-medium text-gray-700">
                        Filter Intensity
                      </Label>
                      <span className="font-['Inter'] text-xs text-gray-500">
                        {presetIntensity}%
                      </span>
                    </div>
                    <Slider
                      value={[presetIntensity]}
                      onValueChange={(value) => setPresetIntensity(value[0])}
                      max={100}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Adjust Tab */}
            {activeTab === 'adjust' && (
              <div className="space-y-4">
                {/* AI Enhance Button */}
                <div className="flex items-center justify-between">
                  <h3 className="font-['Prata'] text-lg">Professional Adjustments</h3>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleAIEnhance}
                      className="bg-black text-white hover:bg-gray-800 text-xs"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Enhance
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setAdjustments({
                        brightness: 0,
                        contrast: 0,
                        sharpness: 0,
                        vignette: 0,
                        temperature: 0,
                        saturation: 0
                      })}
                      className="text-xs"
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Reset All
                    </Button>
                  </div>
                </div>

                {/* Collapsible Adjustment Controls */}
                <div className="space-y-2">
                  {Object.entries(adjustments).map(([key, value]) => (
                    <div key={key} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => toggleAdjustment(key)}
                        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-['Inter'] text-sm font-medium capitalize">{key}</span>
                          <span className="font-['Inter'] text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {value > 0 ? '+' : ''}{value}
                          </span>
                        </div>
                        {expandedAdjustment === key ? 
                          <ChevronUp className="w-4 h-4 text-gray-400" /> : 
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        }
                      </button>
                      
                      {expandedAdjustment === key && (
                        <div className="p-3 border-t border-gray-200 bg-gray-50">
                          <div className="flex items-center gap-3 mb-2">
                            <Slider
                              value={[value]}
                              onValueChange={(newValue) => setAdjustments(prev => ({ ...prev, [key]: newValue[0] }))}
                              max={key === 'temperature' ? 180 : 100}
                              min={key === 'temperature' ? -180 : -100}
                              step={1}
                              className="flex-1"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setAdjustments(prev => ({ ...prev, [key]: 0 }))}
                              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                            >
                              <RotateCcw className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Crop Tab */}
            {activeTab === 'crop' && (
              <div className="space-y-6">
                <h3 className="font-['Prata'] text-lg">Crop & Resize</h3>
                
                {/* Crop Ratio Selection */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { name: 'Square', ratio: '1:1', desc: 'Instagram Posts' },
                    { name: 'Vertical', ratio: '4:5', desc: 'Instagram Feed' },
                    { name: 'Story', ratio: '9:16', desc: 'Stories & Reels' }
                  ].map((crop) => (
                    <Button
                      key={crop.name}
                      variant={cropAspectRatio === crop.ratio ? "default" : "outline"}
                      onClick={() => applyCrop(crop.ratio)}
                      className={`h-20 flex flex-col items-center justify-center p-3 border-2 transition-all ${
                        cropAspectRatio === crop.ratio 
                          ? 'bg-black text-white border-black' 
                          : 'hover:border-black'
                      }`}
                    >
                      <Crop className="w-4 h-4 mb-1" />
                      <span className="font-['Inter'] text-xs font-medium">{crop.name}</span>
                      <span className="font-['Inter'] text-xs opacity-70">{crop.desc}</span>
                    </Button>
                  ))}
                </div>

                {/* Live Crop Preview */}
                {cropAspectRatio && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-['Prata'] text-base mb-3">Crop Preview</h4>
                      <p className="font-['Inter'] text-sm text-gray-600 mb-4">
                        Drag the image to reposition it within the crop frame. This is what will be saved when you download.
                      </p>
                      
                      {/* Interactive Crop Preview */}
                      <div className="flex justify-center">
                        <div 
                          className="relative border-2 border-black bg-white overflow-hidden cursor-move select-none"
                          style={{
                            width: getCropPreviewDimensions()?.width || 300,
                            height: getCropPreviewDimensions()?.height || 300
                          }}
                          onMouseDown={handleCropMouseDown}
                          onMouseMove={handleCropMouseMove}
                          onMouseUp={handleCropMouseUp}
                          onMouseLeave={handleCropMouseUp}
                          ref={cropContainerRef}
                        >
                          <img
                            src={uploadedImage}
                            alt="Crop preview"
                            className="absolute pointer-events-none"
                            style={{
                              filter: getCombinedFilter(selectedPreset, presetIntensity),
                              transform: `translate(${cropPosition.x}px, ${cropPosition.y}px) scale(${cropScale})`,
                              transformOrigin: 'top left',
                              width: getCropPreviewDimensions()?.width || 300,
                              height: 'auto',
                              minHeight: getCropPreviewDimensions()?.height || 300,
                              objectFit: 'cover'
                            }}
                            draggable={false}
                          />
                          
                          {/* Crop guide overlay */}
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="w-full h-full border border-white border-opacity-50 border-dashed"></div>
                          </div>
                        </div>
                      </div>

                      {/* Crop Controls */}
                      <div className="flex items-center justify-center gap-4 mt-4">
                        <div className="flex items-center gap-2">
                          <Label className="font-['Inter'] text-xs">Scale:</Label>
                          <Slider
                            value={[cropScale]}
                            onValueChange={(value) => setCropScale(value[0])}
                            max={2}
                            min={0.5}
                            step={0.1}
                            className="w-24"
                          />
                          <span className="font-['Inter'] text-xs text-gray-500 w-8">
                            {cropScale.toFixed(1)}x
                          </span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => {
                            setCropPosition({ x: 0, y: 0 });
                            setCropScale(1);
                          }}
                          className="text-xs"
                        >
                          <RotateCcw className="w-3 h-3 mr-1" />
                          Reset
                        </Button>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-['Inter'] text-sm text-gray-600">
                        Crop applied: {cropAspectRatio} format. Use the preview above to position your image perfectly.
                      </p>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => {
                          setCropAspectRatio("");
                          setCropPosition({ x: 0, y: 0 });
                          setCropScale(1);
                        }}
                        className="mt-2 text-xs"
                      >
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Remove Crop
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Rotate Left
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <RotateCcw className="w-4 h-4 mr-2 transform scale-x-[-1]" />
                    Flip Horizontal
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => {
                setUploadedImage(null);
                setSelectedPreset("");
                setPresetIntensity(100);
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
            >
              Upload New Photo
            </Button>
            <Button onClick={downloadImage} className="bg-black text-white hover:bg-gray-800">
              <Download className="w-4 h-4 mr-2" />
              Download Image
            </Button>
          </div>
        </>
      )}
    </div>
  );
}