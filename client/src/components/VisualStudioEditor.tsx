
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { usePhotoLibrary } from '@/hooks/usePhotoLibrary';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Upload, 
  Download, 
  Sparkles, 
  Scissors,
  RotateCcw,
  Palette,
  Sliders,
  Crop,
  ChevronLeft,
  ChevronRight,
  Sun,
  Circle,
  Droplets,
  Thermometer,
  Focus,
  Target,
  X,
  Save,
  Wand2,
  Plus
} from 'lucide-react';
import { useSwipeable } from 'react-swipeable';

interface VisualStudioEditorProps {
  user?: any;
}

interface VisualStudioSession {
  id: string;
  title: string;
  promptType: string;
  editingMode: string;
  generatedContent: {
    visualConcepts?: string[];
    designElements?: string[];
    colorPalette?: string[];
    layoutSuggestions?: string[];
    copyOptions?: string[];
    brandingNotes?: string[];
    technicalSpecs?: {
      dimensions?: string;
      format?: string;
      resolution?: string;
    };
  };
  status: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function VisualStudioEditor({ user }: VisualStudioEditorProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingType, setProcessingType] = useState<string>('');
  const [showBefore, setShowBefore] = useState(false);
  const [activeTab, setActiveTab] = useState<'filters' | 'adjust' | 'ai'>('filters');
  const [currentSlide, setCurrentSlide] = useState(0); // 0 = Filters, 1 = Adjust, 2 = AI
  const [showIntensitySlider, setShowIntensitySlider] = useState(false);
  const [activeAdjustment, setActiveAdjustment] = useState<string | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string>(processedImage || uploadedImage || '');
  const [cropCtx, setCropCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cropStart, setCropStart] = useState({ x: 0, y: 0 });
  const [cropEnd, setCropEnd] = useState({ x: 0, y: 0 });
  const [cropCanvasWidth, setCropCanvasWidth] = useState(400);
  const [cropCanvasHeight, setCropCanvasHeight] = useState(400);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // AI Enhancement states
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [selectedPromptType, setSelectedPromptType] = useState<string>('brand-photoshoot');
  const [selectedEditingMode, setSelectedEditingMode] = useState<string>('enhance');

  const photoLibrary = usePhotoLibrary(user?.id || '');
  const queryClient = useQueryClient();

  // Filter and adjustment states
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const [filterIntensity, setFilterIntensity] = useState(100);
  const [cropFormat, setCropFormat] = useState<string>('');
  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    warmth: 0,
    sharpness: 0,
    vignette: 0
  });

  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { savePhoto } = usePhotoLibrary(user?.id);

  // Fetch user's visual studio sessions
  const { data: sessions, isLoading: sessionsLoading } = useQuery<VisualStudioSession[]>({
    queryKey: ['/api/visual-studio'],
    enabled: !!user?.id,
    refetchOnWindowFocus: false,
  });

  // Generate AI content mutation
  const generateContentMutation = useMutation({
    mutationFn: async (requestData: {
      title: string;
      promptType: string;
      editingMode: string;
      prompt: string;
      context?: {
        brandStyle?: string;
        targetAudience?: string;
        platform?: string;
        colorScheme?: string;
        mood?: string;
        industry?: string;
      };
      tags?: string[];
    }) => {
      const response = await fetch('/api/visual-studio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate content');
      }

      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/visual-studio'] });
      toast({
        title: "Strategy Saved!",
        description: "Your strategy has been saved to your Studio Vault.",
        className: "bg-white border-black text-black",
      });
      setShowAIPanel(false);
      setAiPrompt('');
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Unable to generate AI content. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update session mutation
  const updateSessionMutation = useMutation({
    mutationFn: async ({ sessionId, updates }: { 
      sessionId: string; 
      updates: { title?: string; status?: string; tags?: string[]; } 
    }) => {
      const response = await fetch(`/api/visual-studio/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update session');
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/visual-studio'] });
      toast({
        title: "Session Updated",
        description: "Your changes have been saved.",
        className: "bg-luxury-beige border-luxury-beige text-luxury-black",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Unable to update session.",
        variant: "destructive",
      });
    },
  });

  // Vogue LUT Filters - Professional color grading
  const vogueFilters = [
    { name: 'Glow', filter: 'brightness(130%) contrast(95%) saturate(115%) sepia(8%) hue-rotate(-5deg)', description: 'Soft luminous glow' },
    { name: 'Luna', filter: 'brightness(110%) contrast(108%) saturate(105%) sepia(3%) hue-rotate(2deg)', description: 'Dreamy moonlight' },
    { name: 'Bare', filter: 'brightness(112%) contrast(102%) saturate(88%) sepia(4%) hue-rotate(1deg)', description: 'Natural minimalism' },
    { name: 'Cine', filter: 'brightness(108%) contrast(118%) saturate(82%) sepia(12%) hue-rotate(8deg)', description: 'Cinematic mood' },
    { name: 'Noir', filter: 'brightness(55%) contrast(125%) saturate(95%) sepia(8%) hue-rotate(0deg)', description: 'Dramatic darkness' },
    { name: 'Street', filter: 'brightness(105%) contrast(110%) saturate(90%) sepia(5%) hue-rotate(3deg)', description: 'Urban edge' },
    { name: 'Muse', filter: 'brightness(98%) contrast(108%) saturate(102%) sepia(2%) hue-rotate(-2deg)', description: 'Editorial polish' },
    { name: 'Skin', filter: 'brightness(78%) contrast(112%) saturate(88%) sepia(6%) hue-rotate(2deg)', description: 'Portrait perfection' },
    { name: 'Soft', filter: 'brightness(103%) contrast(98%) saturate(92%) sepia(3%) hue-rotate(1deg)', description: 'Gentle elegance' },
    { name: 'Grace', filter: 'brightness(88%) contrast(105%) saturate(110%) sepia(3%) hue-rotate(-8deg)', description: 'Refined beauty' }
  ];

  // AI Enhancement Options
  const promptTypes = [
    { value: 'brand-photoshoot', label: 'Brand Photoshoot' },
    { value: 'content-calendar', label: 'Content Calendar' },
    { value: 'social-media-post', label: 'Social Media Post' },
    { value: 'story-template', label: 'Story Template' },
    { value: 'reel-concept', label: 'Reel Concept' },
    { value: 'carousel-design', label: 'Carousel Design' },
    { value: 'custom', label: 'Custom Strategy' }
  ];

  const editingModes = [
    { value: 'generate', label: 'Generate New' },
    { value: 'enhance', label: 'Enhance Existing' },
    { value: 'redesign', label: 'Redesign' },
    { value: 'optimize', label: 'Optimize' }
  ];

  // Handle AI content generation with auto-populated user profile data
  const handleAIGenerate = () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a description for your visual strategy.",
        variant: "destructive",
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Login Required",
        description: "Please log in to use AI features.",
        variant: "destructive",
      });
      return;
    }

    // Auto-populate context from user's brand profile
    const userProfile = user?.profileData || {};
    const context = {
      brandStyle: userProfile.brandStyle || 'Professional minimalist',
      targetAudience: userProfile.targetAudience || 'Female entrepreneurs',
      platform: userProfile.primaryPlatform || 'Instagram',
      colorScheme: userProfile.colorScheme || 'Neutral tones',
      mood: userProfile.brandPersonality || 'Confident and approachable',
      industry: userProfile.industry || 'Personal branding',
      brandValues: userProfile.brandValues || [],
      contentGoals: userProfile.contentGoals || []
    };

    const requestData = {
      title: `${selectedPromptType.replace('-', ' ').toUpperCase()} Strategy - ${new Date().toLocaleDateString()}`,
      promptType: selectedPromptType,
      editingMode: selectedEditingMode,
      prompt: aiPrompt,
      context,
      brandProfileSnapshot: userProfile,
      tags: ['ai-generated', selectedPromptType, selectedEditingMode]
    };

    generateContentMutation.mutate(requestData);
  };

  // Helper functions
  const getCombinedFilter = (preset: string, intensity: number) => {
    if (!preset) return 'none';

    const strength = intensity / 100;

    switch (preset) {
      case 'Glow': {
        return `brightness(${1 + 0.2 * strength}) contrast(${1 + 0.1 * strength})`;
      }
      case 'Luna': {
        return `saturate(${1 + 0.15 * strength}) brightness(${1 + 0.05 * strength})`;
      }
      case 'Bare': {
        return `sepia(${0.2 * strength}) brightness(${1 + 0.05 * strength})`;
      }
      case 'Cine': {
        return `brightness(${1 + 0.08 * strength}) contrast(${1 + 0.18 * strength}) saturate(${1 - 0.18 * strength}) sepia(${0.12 * strength}) hue-rotate(${8 * strength}deg)`;
      }
      case 'Noir': {
        return `grayscale(${0.6 * strength}) contrast(${1 + 0.25 * strength}) brightness(${1 - 0.45 * strength})`;
      }
      case 'Street': {
        return `brightness(${1 + 0.05 * strength}) contrast(${1 + 0.1 * strength}) saturate(${1 - 0.1 * strength}) sepia(${0.05 * strength}) hue-rotate(${3 * strength}deg)`;
      }
      case 'Muse': {
        return `brightness(${1 - 0.02 * strength}) contrast(${1 + 0.08 * strength}) saturate(${1 + 0.02 * strength}) sepia(${0.02 * strength}) hue-rotate(${-2 * strength}deg)`;
      }
      case 'Skin': {
        return `brightness(${1 - 0.22 * strength}) contrast(${1 + 0.12 * strength}) saturate(${1 - 0.12 * strength}) sepia(${0.06 * strength}) hue-rotate(${2 * strength}deg)`;
      }
      case 'Soft': {
        return `brightness(${1 + 0.03 * strength}) contrast(${1 - 0.02 * strength}) saturate(${1 - 0.08 * strength}) sepia(${0.03 * strength}) hue-rotate(${1 * strength}deg)`;
      }
      case 'Grace': {
        return `brightness(${1 - 0.12 * strength}) contrast(${1 + 0.05 * strength}) saturate(${1 + 0.1 * strength}) sepia(${0.03 * strength}) hue-rotate(${-8 * strength}deg)`;
      }
      default: {
        return 'none';
      }
    }
  };

  const getAdjustmentStyles = () => {
    const warmthFilter = adjustments.warmth !== 0 
      ? adjustments.warmth > 0 
        ? `sepia(${Math.abs(adjustments.warmth) * 0.4}%) hue-rotate(${adjustments.warmth * 0.3}deg)`
        : `hue-rotate(${adjustments.warmth * 0.6}deg) saturate(${100 - Math.abs(adjustments.warmth) * 0.2}%)`
      : '';

    return {
      filter: `brightness(${100 + adjustments.brightness}%) 
               contrast(${100 + adjustments.contrast}%) 
               saturate(${100 + adjustments.saturation}%) 
               ${warmthFilter}
               ${adjustments.sharpness !== 0 ? `contrast(${100 + adjustments.sharpness * 0.2}%)` : ''}`.replace(/\s+/g, ' ').trim()
    };
  };

  const updateVignetteOverlay = (vignetteValue: number) => {
    const overlay = document.getElementById('vignette-overlay');
    if (overlay) {
      const opacity = (vignetteValue / 100) * 0.7;
      overlay.style.background = `radial-gradient(circle at center, transparent 50%, rgba(0,0,0,${opacity}) 100%)`;
    }
  };

  // Update editedImage when processedImage changes
  useEffect(() => {
    if (processedImage) {
      setEditedImage(processedImage);
    } else if (uploadedImage) {
      setEditedImage(uploadedImage);
    }
  }, [processedImage, uploadedImage]);

  // Initialize canvas when crop modal opens
  useEffect(() => {
    if (!cropModalOpen || !cropImageSrc) return;

    const img = new Image();
    img.src = cropImageSrc;
    img.onload = () => {
      const canvas = document.getElementById("cropCanvas") as HTMLCanvasElement;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Set canvas dimensions to image's natural size
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          setCropCanvasWidth(img.naturalWidth);
          setCropCanvasHeight(img.naturalHeight);

          // Draw the image onto the canvas
          ctx.drawImage(img, 0, 0);
          setCropCtx(ctx);
        }
      }
    };
  }, [cropModalOpen, cropImageSrc]);

  // Mouse event handlers for crop selection
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = cropCanvasWidth / rect.width;
    const scaleY = cropCanvasHeight / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setCropStart({ x, y });
    setCropEnd({ x, y });
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !cropImageSrc) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = cropCanvasWidth / rect.width;
    const scaleY = cropCanvasHeight / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setCropEnd({ x, y });

    // Redraw the canvas with selection overlay
    const img = new Image();
    img.src = cropImageSrc;
    img.onload = () => {
      const canvas = document.getElementById("cropCanvas") as HTMLCanvasElement;
      const ctx = canvas?.getContext("2d");
      if (ctx) {
        // Clear and redraw original image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        // Draw semi-transparent overlay
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Calculate selection rectangle
        const startX = Math.min(cropStart.x, x);
        const startY = Math.min(cropStart.y, y);
        const width = Math.abs(x - cropStart.x);
        const height = Math.abs(y - cropStart.y);

        // Clear the selected area
        ctx.clearRect(startX, startY, width, height);
        ctx.drawImage(img, startX, startY, width, height, startX, startY, width, height);

        // Draw selection border
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(startX, startY, width, height);
      }
    };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Apply crop function
  const applyCrop = () => {
    if (!cropCtx) return;

    const { x: x1, y: y1 } = cropStart;
    const { x: x2, y: y2 } = cropEnd;
    const cropX = Math.min(x1, x2);
    const cropY = Math.min(y1, y2);
    const cropWidth = Math.abs(x2 - x1);
    const cropHeight = Math.abs(y2 - y1);

    if (cropWidth === 0 || cropHeight === 0) {
      toast({ title: "No selection", description: "Please select an area to crop", variant: "destructive" });
      return;
    }

    // Create temporary canvas for cropping
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    if (tempCtx) {
      tempCanvas.width = cropWidth;
      tempCanvas.height = cropHeight;

      // Draw the cropped portion
      const sourceCanvas = document.getElementById("cropCanvas") as HTMLCanvasElement;
      tempCtx.drawImage(
        sourceCanvas,
        cropX, cropY, cropWidth, cropHeight,
        0, 0, cropWidth, cropHeight
      );

      // Convert to data URL and update state
      const croppedDataURL = tempCanvas.toDataURL("image/jpeg", 0.95);
      setEditedImage(croppedDataURL);
      setProcessedImage(croppedDataURL);
      setCropModalOpen(false);
      toast({ title: "Crop applied successfully", variant: "default" });
    }
  };

  // Undo crop function
  const undoCrop = () => {
    const originalSrc = uploadedImage || processedImage;
    if (originalSrc) {
      setEditedImage(originalSrc);
      setProcessedImage(originalSrc);
      setCropStart({ x: 0, y: 0 });
      setCropEnd({ x: 0, y: 0 });
      toast({ title: "Crop undone", variant: "default" });
    }
  };

  // Save photo to Content Vault
  const handleSavePhoto = async () => {
    if (!user?.id) {
      toast({
        title: "Login Required",
        description: "Please log in to save photos to your vault.",
        variant: "destructive",
      });
      return;
    }

    const imageToSave = processedImage || uploadedImage;
    if (!imageToSave) {
      toast({
        title: "No Photo to Save",
        description: "Please upload and edit a photo first.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Convert image to blob for upload
      const response = await fetch(imageToSave);
      const blob = await response.blob();
      
      // Create a unique filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `selfie-edited-${timestamp}.jpg`;
      
      // Create file object
      const file = new File([blob], filename, { type: 'image/jpeg' });
      
      // Generate a mock UUID for now (in production, this would be from actual upload service)
      const mockUuid = `edited-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Save to photo library with Content Vault integration
      await savePhoto({
        uploadcare_uuid: mockUuid,
        file_url: imageToSave,
        file_name: filename,
        file_size: file.size,
        tags: ['selfie-editor', 'edited', selectedFilter || 'no-filter'].filter(Boolean)
      });

      // Show success state
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);

      toast({
        title: "Photo Saved!",
        description: "Your edited photo has been saved to your Studio Vault.",
        className: "bg-white border-black text-black",
      });

    } catch (error: any) {
      console.error('Error saving photo:', error);
      toast({
        title: "Save Failed",
        description: error.message || "Unable to save photo to vault.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Resize to max 1024px on longest side to avoid "request entity too large"
        const maxSize = 1024;
        let { width, height } = img;

        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        // Use higher quality for better results
        const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(resizedDataUrl);
      };

      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const resizedImage = await resizeImage(file);
        setUploadedImage(resizedImage);
        setProcessedImage(null);
        setSelectedFilter("");
        setCropFormat("");
        toast({ title: "Image uploaded and optimized", variant: "default" });
      } catch (error) {
        console.error('Image resize error:', error);
        toast({ title: "Upload failed", description: "Please try a different image", variant: "destructive" });
      }
    }
  };

  const handleDownload = async () => {
    const imageToDownload = processedImage || uploadedImage;
    if (!imageToDownload) {
      toast({ title: "No image to download", variant: "destructive" });
      return;
    }

    try {
      // Create a canvas to render the final image with all effects
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        // Apply CSS filters as canvas operations
        if (!showBefore) {
          const filterValue = `${getCombinedFilter(selectedFilter, filterIntensity)} ${getAdjustmentStyles().filter || ''}`.trim();
          if (filterValue) {
            ctx.filter = filterValue;
          }
        }

        // Draw the image
        ctx.drawImage(img, 0, 0);

        // Apply vignette effect if present
        if (adjustments.vignette > 0) {
          const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
          );
          gradient.addColorStop(0.5, 'transparent');
          gradient.addColorStop(1, `rgba(0,0,0,${(adjustments.vignette / 50) * 0.7})`);

          ctx.globalCompositeOperation = 'multiply';
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Convert to blob and handle download
        canvas.toBlob((blob) => {
          if (!blob) {
            toast({ title: "Failed to process image", variant: "destructive" });
            return;
          }

          const blobUrl = URL.createObjectURL(blob);
          const isMobile = /iPhone|iPad|Android/.test(navigator.userAgent);

          if (isMobile) {
            // Open in new tab for mobile users to save manually
            window.open(blobUrl, '_blank');
            toast({ 
              title: "Image opened in new tab", 
              description: "Tap and hold the image to save to your Photos",
              variant: "default" 
            });
          } else {
            // Direct download for desktop
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `selfie-ai-${selectedFilter || 'edited'}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
            toast({ title: "Image downloaded!", variant: "default" });
          }
        }, 'image/png');
      };

      img.crossOrigin = 'anonymous';
      img.src = imageToDownload;

    } catch (error) {
      console.error('Download error:', error);
      toast({ title: "Download failed", description: "Please try again", variant: "destructive" });
    }
  };

  // Save edited photo to library
  const handleSaveImage = async () => {
    if (!user?.id) {
      toast({ title: "Please log in to save photos", variant: "destructive" });
      return;
    }

    const imageToSave = processedImage || uploadedImage;
    if (!imageToSave) {
      toast({ title: "No image to save", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      // Create a canvas to render the final image with all effects
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;

        // Apply CSS filters as canvas operations for the saved image
        if (!showBefore) {
          const filterValue = `${getCombinedFilter(selectedFilter, filterIntensity)} ${getAdjustmentStyles().filter || ''}`.trim();
          if (filterValue && filterValue !== 'none') {
            ctx.filter = filterValue;
          }
        }

        // Draw the image with effects
        ctx.drawImage(img, 0, 0);

        // Apply vignette effect if present
        if (adjustments.vignette > 0) {
          const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
          );
          gradient.addColorStop(0.5, 'transparent');
          gradient.addColorStop(1, `rgba(0,0,0,${(adjustments.vignette / 50) * 0.7})`);

          ctx.globalCompositeOperation = 'multiply';
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Convert to data URL
        const finalImageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        // Update the editedImage state with the processed result
        setEditedImage(finalImageDataUrl);
        setProcessedImage(finalImageDataUrl);

        // Generate unique filename with filter info
        const filterName = selectedFilter || 'edited';
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '');
        const fileName = `selfie-ai-${filterName}-${timestamp}.jpg`;

        // Create blob for file size calculation
        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              // Save to photo library using the hook
              await photoLibrary.savePhoto({
                uploadcare_uuid: `edited-${timestamp}`,
                file_url: finalImageDataUrl,
                file_name: fileName,
                file_size: blob.size,
                tags: selectedFilter ? [selectedFilter, 'edited'] : ['edited']
              });

              toast({ 
                title: "Photo Saved Successfully", 
                description: "Edited photo added to your library"
              });
            } catch (error) {
              console.error('Save error:', error);
              toast({ 
                title: "Save failed", 
                description: "Unable to save to photo library",
                variant: "destructive" 
              });
            }
          }
          setIsSaving(false);
        }, 'image/jpeg', 0.9);
      };

      img.crossOrigin = 'anonymous';
      img.src = imageToSave;

    } catch (error) {
      console.error('Save image error:', error);
      toast({ 
        title: "Save failed", 
        description: "Please try again",
        variant: "destructive" 
      });
      setIsSaving(false);
    }
  };

  const resetAll = () => {
    setProcessedImage(null);
    setSelectedFilter("");
    setFilterIntensity(100);
    setCropFormat("");
    setAdjustments({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      warmth: 0,
      sharpness: 0,
      vignette: 0
    });
    toast({ title: "Reset to original", variant: "default" });
  };

  // Carousel navigation handlers
  const nextSlide = () => {
    setCurrentSlide(currentSlide === 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? 1 : currentSlide - 1);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Adjustment icons configuration
  const adjustmentIcons = [
    { key: 'brightness', label: 'Brightness', icon: Sun, min: -50, max: 50 },
    { key: 'contrast', label: 'Contrast', icon: Circle, min: -50, max: 50 },
    { key: 'saturation', label: 'Saturation', icon: Droplets, min: -50, max: 50 },
    { key: 'warmth', label: 'Warmth', icon: Thermometer, min: -50, max: 50 },
    { key: 'sharpness', label: 'Sharpness', icon: Focus, min: 0, max: 100 },
    { key: 'vignette', label: 'Vignette', icon: Target, min: 0, max: 100 }
  ];

  // Swipe handlers with improved mobile touch handling
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => nextSlide(),
    onSwipedRight: () => prevSlide(),
    trackMouse: false, // Disable mouse tracking to prevent desktop conflicts
    delta: 50, // Minimum swipe distance
    swipeDuration: 500, // Maximum swipe duration
  });

  return (
    <div className="min-h-screen bg-gray-50 py-4 lg:py-8 px-2 lg:px-4 overflow-x-hidden">
      {!uploadedImage ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-black p-12 text-center">
            <div className="mb-8">
              <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="font-['Prata'] text-2xl text-black mb-4">Professional Photo Studio</h2>
              <p className="font-['Inter'] text-gray-600 mb-8">
                Upload your photo to begin professional editing with AI enhancement tools
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

          {/* AI Sessions Panel */}
          {user?.id && (
            <div className="mt-8">
              <div className="bg-white border border-black p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-['Prata'] text-xl text-black">AI Visual Strategies</h3>
                  <Button
                    onClick={() => setShowAIPanel(true)}
                    className="bg-black text-white hover:bg-gray-800 px-4 py-2 text-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New
                  </Button>
                </div>

                {sessionsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-black border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Loading your strategies...</p>
                  </div>
                ) : sessions && sessions.length > 0 ? (
                  <div className="space-y-3">
                    {sessions.slice(0, 3).map((session) => (
                      <div key={session.id} className="border border-gray-200 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-['Prata'] text-sm text-black">{session.title}</h4>
                          <span className="text-xs text-gray-500 uppercase">{session.promptType}</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">
                          Created {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                        {session.generatedContent.visualConcepts && (
                          <div className="text-xs text-gray-700">
                            <strong>Concepts:</strong> {session.generatedContent.visualConcepts.slice(0, 2).join(', ')}
                            {session.generatedContent.visualConcepts.length > 2 && '...'}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Sparkles className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">No AI strategies yet. Create your first one!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4">
          {/* Success Banner */}
          {showSaveSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 p-4 text-center">
              <p className="text-green-800 font-medium">
                Photo saved to your Studio Vault successfully!
              </p>
            </div>
          )}

          {/* Preview Section - Always at Top */}
          <div className="mb-6">
            <div className="bg-white border border-black p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                <h2 className="font-['Prata'] text-lg text-black">Preview</h2>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center bg-gray-100 border border-gray-300 w-full sm:w-auto">
                    <button
                      onClick={() => setShowBefore(false)}
                      className="bg-black text-white font-semibold p-3 lg:p-2 rounded-none opacity-100 flex-1 sm:flex-none min-h-[44px] text-sm lg:text-base"
                    >
                      Enhanced
                    </button>
                    <button
                      onClick={() => setShowBefore(true)}
                      className="bg-black text-white font-semibold p-3 lg:p-2 rounded-none opacity-100 flex-1 sm:flex-none min-h-[44px] text-sm lg:text-base"
                    >
                      Original
                    </button>
                  </div>
                  {user?.id && (
                    <Button
                      onClick={() => setShowAIPanel(true)}
                      className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 text-sm"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      AI Strategy
                    </Button>
                  )}
                </div>
              </div>

              <div className="relative w-full">
                {isProcessing && (
                  <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10 rounded">
                    <div className="text-center text-white">
                      <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="font-['Inter'] text-sm font-medium uppercase tracking-wider">{processingType}</p>
                    </div>
                  </div>
                )}

                <img
                  ref={imageRef}
                  src={showBefore ? uploadedImage : (processedImage || uploadedImage)}
                  alt="Photo preview"
                  className="w-full max-w-full h-auto object-contain rounded"
                  style={{
                    filter: showBefore ? 'none' : `${getCombinedFilter(selectedFilter, filterIntensity)} ${getAdjustmentStyles().filter || ''}`.trim(),
                    maxHeight: 'min(80vh, 600px)'
                  }}
                />

                <div 
                  id="vignette-overlay" 
                  className="absolute top-0 left-0 pointer-events-none rounded"
                  style={{
                    width: '100%',
                    height: '100%',
                    background: `radial-gradient(circle at center, transparent 50%, rgba(0,0,0,${(adjustments.vignette / 50) * 0.7}) 100%)`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Desktop Layout - Side by Side */}
          <div className="hidden lg:flex gap-6">
            {/* Left Column - Controls */}
            <div className="w-1/3">
              {/* Tab Navigation */}
              <div className="bg-white border-b border-black mb-8">
                <div className="flex">
                  {[
                    { key: 'filters', label: 'VOGUE FILTERS', icon: Palette },
                    { key: 'adjust', label: 'ADJUST', icon: Sliders }
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key as any)}
                      className="bg-black text-white font-semibold p-2 rounded-none opacity-100 flex-1 px-6 py-4 text-sm font-bold uppercase tracking-wider border-none min-h-[44px]"
                    >
                      <Icon className="w-4 h-4 inline mr-2" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editor Tools */}
              <div className="bg-white border border-black">
                {/* Vogue Filters Section */}
                {activeTab === 'filters' && (
                  <div className="p-4 lg:p-6">
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {vogueFilters.map((filter) => (
                        <button
                          key={filter.name}
                          onClick={() => {
                            setSelectedFilter(filter.name);
                            setProcessedImage(uploadedImage);
                          }}
                          className="bg-black text-white font-semibold p-3 lg:p-2 rounded-none opacity-100 min-h-[44px] text-sm lg:text-base"
                        >
                          {filter.name}
                        </button>
                      ))}
                    </div>

                    {selectedFilter && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <Label className="text-sm font-bold uppercase tracking-wider text-black">
                            Intensity: {filterIntensity}%
                          </Label>
                        </div>
                        <Slider
                          value={[filterIntensity]}
                          onValueChange={(value) => setFilterIntensity(value[0])}
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
                  <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
                    {[
                      { key: 'brightness', label: 'Brightness', min: -50, max: 50 },
                      { key: 'contrast', label: 'Contrast', min: -50, max: 50 },
                      { key: 'saturation', label: 'Saturation', min: -50, max: 50 },
                      { key: 'warmth', label: 'Warmth', min: -50, max: 50 },
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
                            setAdjustments(prev => ({ ...prev, [key]: value[0] }));
                            setProcessedImage(uploadedImage);
                            if (key === 'vignette') {
                              updateVignetteOverlay(value[0]);
                            }
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
              </div>

              {/* Action Buttons */}
              <div className="mt-4 lg:mt-8 p-4 lg:p-6 bg-white border border-black">
                <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center">
                  <Button 
                    onClick={resetAll}
                    className="bg-black text-white font-semibold p-2 rounded-none opacity-100 px-6 lg:px-8 py-3 text-sm font-bold uppercase tracking-wider min-h-[44px]"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset All
                  </Button>
                  <Button 
                    onClick={handleSaveImage}
                    disabled={isSaving}
                    className="bg-black text-white font-semibold p-2 rounded-none opacity-100 px-6 lg:px-8 py-3 text-sm font-bold uppercase tracking-wider min-h-[44px]"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Photo'}
                  </Button>
                  <Button 
                    onClick={handleDownload} 
                    className="bg-black text-white font-semibold p-2 rounded-none opacity-100 px-6 lg:px-8 py-3 text-sm font-bold uppercase tracking-wider min-h-[44px]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column - Image Canvas */}
            <div className="w-full lg:w-2/3 order-2 lg:order-2">
              <div className="bg-white border border-black p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                  <h2 className="font-['Prata'] text-lg text-black">Preview</h2>
                  <div className="inline-flex items-center bg-gray-100 border border-gray-300 w-full sm:w-auto">
                    <button
                      onClick={() => setShowBefore(false)}
                      className="bg-black text-white font-semibold p-3 lg:p-2 rounded-none opacity-100 flex-1 sm:flex-none min-h-[44px] text-sm lg:text-base"
                    >
                      Enhanced
                    </button>
                    <button
                      onClick={() => setShowBefore(true)}
                      className="bg-black text-white font-semibold p-3 lg:p-2 rounded-none opacity-100 flex-1 sm:flex-none min-h-[44px] text-sm lg:text-base"
                    >
                      Original
                    </button>
                  </div>
                </div>

                <div className="relative w-full">
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10 rounded">
                      <div className="text-center text-white">
                        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="font-['Inter'] text-sm font-medium uppercase tracking-wider">{processingType}</p>
                      </div>
                    </div>
                  )}

                  <img
                    ref={imageRef}
                    src={showBefore ? uploadedImage : (processedImage || uploadedImage)}
                    alt="Photo preview"
                    className="w-full max-w-full h-auto object-contain rounded"
                    style={{
                      filter: showBefore ? 'none' : `${getCombinedFilter(selectedFilter, filterIntensity)} ${getAdjustmentStyles().filter || ''}`.trim(),
                      maxHeight: 'min(80vh, 600px)'
                    }}
                  />

                  <div 
                    id="vignette-overlay" 
                    className="absolute top-0 left-0 pointer-events-none rounded"
                    style={{
                      width: '100%',
                      height: '100%',
                      background: `radial-gradient(circle at center, transparent 50%, rgba(0,0,0,${(adjustments.vignette / 50) * 0.7}) 100%)`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Horizontal Carousel Layout */}
          <div className="lg:hidden">
            {/* Swipe Indicator */}
            <div className="bg-black bg-opacity-75 text-white text-center py-2 mb-4">
              <p className="font-['Prata'] text-sm">
                {currentSlide === 0 ? 'Filters' : 'Adjust'} • Swipe to switch
              </p>
            </div>

            {/* Main Carousel Container */}
            <div 
              {...swipeHandlers} 
              className="bg-white border border-black relative overflow-hidden"
            >
              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-1 rounded-full"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-1 rounded-full"
                aria-label="Next slide"
              >
                <ChevronRight className="w-3 h-3" />
              </button>

              {/* Slides Container */}
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {/* Slide 1: Horizontal Filter Buttons */}
                <div className="w-full flex-shrink-0 p-4" aria-label="Filters carousel slide">
                  {/* Horizontal Filter Carousel */}
                  <div className="relative">
                    <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
                      {vogueFilters.map((filter) => (
                        <button
                          key={filter.name}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFilter(filter.name);
                            setProcessedImage(uploadedImage);
                            setShowIntensitySlider(true);
                          }}
                          onTouchStart={(e) => e.stopPropagation()}
                          className="bg-black text-white font-['Prata'] text-xs p-4 rounded-none opacity-100 flex-shrink-0"
                          style={{ width: '80px', height: '80px' }}
                        >
                          {filter.name}
                        </button>
                      ))}
                    </div>

                    {/* Intensity Control */}
                    {selectedFilter && showIntensitySlider && (
                      <div className="mt-4 bg-black bg-opacity-75 text-white p-3 rounded">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-xs font-bold uppercase tracking-wider">
                            Intensity: {filterIntensity}%
                          </Label>
                          <button
                            onClick={() => setShowIntensitySlider(false)}
                            className="text-white p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <Slider
                          value={[filterIntensity]}
                          onValueChange={(value) => setFilterIntensity(value[0])}
                          min={0}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Slide 2: Horizontal Adjustment Icons */}
                <div className="w-full flex-shrink-0 p-4" aria-label="Adjust carousel slide">
                  {/* Horizontal Adjustment Icons */}
                  <div className="relative">
                    <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
                      {adjustmentIcons.map(({ key, label, icon: Icon }) => (
                        <button
                          key={key}
                          onClick={() => setActiveAdjustment(activeAdjustment === key ? null : key)}
                          className="bg-black text-white p-4 rounded-none opacity-100 flex-shrink-0 flex flex-col items-center justify-center"
                          style={{ width: '80px', height: '80px' }}
                        >
                          <Icon className="w-6 h-6 mb-1" />
                          <span className="text-xs font-['Prata']">{label.slice(0, 4)}</span>
                        </button>
                      ))}
                    </div>

                    {/* Pop-up Adjustment Control */}
                    {activeAdjustment && (
                      <div className="mt-4 bg-black bg-opacity-75 text-white p-3 rounded">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-xs font-bold uppercase tracking-wider">
                            {adjustmentIcons.find(adj => adj.key === activeAdjustment)?.label}: {adjustments[activeAdjustment as keyof typeof adjustments]}
                          </Label>
                          <button
                            onClick={() => setActiveAdjustment(null)}
                            className="text-white p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <Slider
                          value={[adjustments[activeAdjustment as keyof typeof adjustments]]}
                          onValueChange={(value) => setAdjustments({
                            ...adjustments,
                            [activeAdjustment]: value[0]
                          })}
                          min={adjustmentIcons.find(adj => adj.key === activeAdjustment)?.min || 0}
                          max={adjustmentIcons.find(adj => adj.key === activeAdjustment)?.max || 100}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                      <Button 
                        onClick={resetAll} 
                        className="bg-black text-white font-semibold p-3 rounded-none opacity-100 min-h-[44px] text-sm flex-1"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        RESET ALL
                      </Button>
                      {user?.id && (
                        <Button 
                          onClick={handleSavePhoto} 
                          disabled={isSaving}
                          className="bg-purple-600 text-white hover:bg-purple-700 font-semibold p-3 rounded-none opacity-100 min-h-[44px] text-sm flex-1"
                        >
                          {isSaving ? (
                            <>
                              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                              SAVING...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              SAVE TO VAULT
                            </>
                          )}
                        </Button>
                      )}
                      <Button 
                        onClick={handleDownload} 
                        className="bg-black text-white font-semibold p-3 rounded-none opacity-100 min-h-[44px] text-sm flex-1"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        DOWNLOAD
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Strategy Panel Modal */}
      {showAIPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-['Prata'] text-2xl text-black">Create AI Visual Strategy</h2>
                <button
                  onClick={() => setShowAIPanel(false)}
                  className="text-black hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Prompt Type Selection */}
                <div>
                  <Label className="text-sm font-bold uppercase tracking-wider text-black mb-3 block">
                    Strategy Type
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {promptTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setSelectedPromptType(type.value)}
                        className={`p-3 text-sm border ${
                          selectedPromptType === type.value
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-black border-gray-300 hover:border-black'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Editing Mode Selection */}
                <div>
                  <Label className="text-sm font-bold uppercase tracking-wider text-black mb-3 block">
                    Editing Mode
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {editingModes.map((mode) => (
                      <button
                        key={mode.value}
                        onClick={() => setSelectedEditingMode(mode.value)}
                        className={`p-3 text-sm border ${
                          selectedEditingMode === mode.value
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-black border-gray-300 hover:border-black'
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prompt Input */}
                <div>
                  <Label className="text-sm font-bold uppercase tracking-wider text-black mb-3 block">
                    Describe Your Vision
                  </Label>
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Describe the visual strategy you want to create. Be specific about your brand, target audience, style preferences, and goals..."
                    className="w-full h-32 p-4 border border-gray-300 focus:border-black focus:outline-none resize-none"
                    maxLength={2000}
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {aiPrompt.length}/2000 characters
                  </div>
                </div>

                {/* Generate Button */}
                <div className="flex gap-4">
                  <Button
                    onClick={() => setShowAIPanel(false)}
                    variant="outline"
                    className="flex-1 border-black text-black hover:bg-gray-100"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAIGenerate}
                    disabled={generateContentMutation.isPending || !aiPrompt.trim()}
                    className="flex-1 bg-black text-white hover:bg-gray-800"
                  >
                    {generateContentMutation.isPending ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Strategy
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Crop Modal - Hidden */}
      {false && cropModalOpen && cropImageSrc && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative w-11/12 md:w-3/4 lg:w-1/2 bg-white p-6">
            <h2 className="text-2xl font-prata mb-4">Crop Image</h2>
            <div className="flex flex-col items-center space-y-4">
              <div className="max-w-full max-h-96 overflow-auto border">
                <canvas
                  id="cropCanvas"
                  width={cropCanvasWidth}
                  height={cropCanvasHeight}
                  className="max-w-full max-h-full border cursor-crosshair"
                  style={{ maxWidth: '100%', maxHeight: '400px' }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
              </div>
              <p className="text-sm text-gray-600 text-center">
                Click and drag to select the area you want to crop
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={applyCrop}
                  className="bg-black text-white px-6 py-2 rounded-none uppercase"
                >
                  Apply Crop
                </button>
                <button
                  onClick={() => setCropModalOpen(false)}
                  className="bg-black text-white px-6 py-2 rounded-none uppercase"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
