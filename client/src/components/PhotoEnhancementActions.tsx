import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useReplicateEnhancement } from '@/hooks/useReplicateEnhancement';
import { 
  Sparkles, 
  Scissors, 
  Palette, 
  Loader2,
  Download,
  Eye
} from 'lucide-react';

interface PhotoEnhancementActionsProps {
  imageUrl: string;
  photoId?: string;
  onEnhanced?: (enhancedUrl: string, type: string) => void;
  compact?: boolean;
}

export function PhotoEnhancementActions({ 
  imageUrl, 
  photoId, 
  onEnhanced,
  compact = false 
}: PhotoEnhancementActionsProps) {
  const [prompt, setPrompt] = useState('');
  const [enhancedImage, setEnhancedImage] = useState<{ url: string; type: string } | null>(null);
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  
  const { 
    enhanceFace, 
    removeBackground, 
    createBrandVisual,
    isEnhancing,
    isRemovingBg,
    isCreatingBrandVisual,
    isLoading
  } = useReplicateEnhancement();

  const handleEnhanceFace = async () => {
    const result = await enhanceFace(imageUrl, photoId);
    if (result.success && result.enhancedUrl) {
      setEnhancedImage({ url: result.enhancedUrl, type: 'Face Enhanced' });
      onEnhanced?.(result.enhancedUrl, 'face_enhance');
    }
  };

  const handleRemoveBackground = async () => {
    const result = await removeBackground(imageUrl, photoId);
    if (result.success && result.enhancedUrl) {
      setEnhancedImage({ url: result.enhancedUrl, type: 'Background Removed' });
      onEnhanced?.(result.enhancedUrl, 'remove_bg');
    }
  };

  const handleCreateBrandVisual = async () => {
    const customPrompt = prompt || "professional headshot, studio lighting, clean background";
    const result = await createBrandVisual(imageUrl, customPrompt, photoId);
    if (result.success && result.enhancedUrl) {
      setEnhancedImage({ url: result.enhancedUrl, type: 'Brand Visual' });
      onEnhanced?.(result.enhancedUrl, 'brand_visual');
      setShowPromptDialog(false);
      setPrompt('');
    }
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (compact) {
    return (
      <div className="flex gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={handleEnhanceFace}
          disabled={isLoading}
          className="h-8 px-2"
        >
          {isEnhancing ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Sparkles className="w-3 h-3" />
          )}
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={handleRemoveBackground}
          disabled={isLoading}
          className="h-8 px-2"
        >
          {isRemovingBg ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Scissors className="w-3 h-3" />
          )}
        </Button>

        <Dialog open={showPromptDialog} onOpenChange={setShowPromptDialog}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              disabled={isLoading}
              className="h-8 px-2"
            >
              {isCreatingBrandVisual ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Palette className="w-3 h-3" />
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-['Prata']">Create Brand Visual</DialogTitle>
              <DialogDescription className="font-['Inter']">
                Describe the style you want for your brand visual
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="prompt" className="font-['Inter'] font-medium">
                  Style Prompt (Optional)
                </Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="professional headshot, studio lighting, clean background"
                  className="font-['Inter'] mt-2"
                  rows={3}
                />
              </div>
              <Button
                onClick={handleCreateBrandVisual}
                disabled={isCreatingBrandVisual}
                className="w-full font-['Inter'] font-medium"
              >
                {isCreatingBrandVisual ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Brand Visual'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Enhancement Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={handleEnhanceFace}
          disabled={isLoading}
          variant="outline"
          className="font-['Inter'] font-medium h-12"
        >
          {isEnhancing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enhancing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Enhance Face
            </>
          )}
        </Button>

        <Button
          onClick={handleRemoveBackground}
          disabled={isLoading}
          variant="outline"
          className="font-['Inter'] font-medium h-12"
        >
          {isRemovingBg ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Removing...
            </>
          ) : (
            <>
              <Scissors className="w-4 h-4 mr-2" />
              Remove Background
            </>
          )}
        </Button>
      </div>

      {/* Brand Visual with Custom Prompt */}
      <Dialog open={showPromptDialog} onOpenChange={setShowPromptDialog}>
        <DialogTrigger asChild>
          <Button
            disabled={isLoading}
            className="w-full font-['Inter'] font-medium h-12"
          >
            {isCreatingBrandVisual ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Palette className="w-4 h-4 mr-2" />
                Convert to Reel Cover
              </>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-['Prata'] text-xl">Create Brand Visual</DialogTitle>
            <DialogDescription className="font-['Inter']">
              Transform your photo into a professional brand visual perfect for reel covers and quote cards
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="prompt" className="font-['Inter'] font-medium">
                Style Description (Optional)
              </Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="professional headshot, studio lighting, clean background, elegant, sophisticated"
                className="font-['Inter'] mt-2"
                rows={4}
              />
              <p className="text-sm text-gray-500 mt-1 font-['Inter']">
                Leave blank for default professional styling
              </p>
            </div>
            <Button
              onClick={handleCreateBrandVisual}
              disabled={isCreatingBrandVisual}
              className="w-full font-['Inter'] font-medium"
            >
              {isCreatingBrandVisual ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Brand Visual...
                </>
              ) : (
                'Create Brand Visual'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Image Result */}
      {enhancedImage && (
        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="font-['Inter']">
              {enhancedImage.type}
            </Badge>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(enhancedImage.url, '_blank')}
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button
                size="sm"
                onClick={() => downloadImage(enhancedImage.url, `enhanced_${Date.now()}.jpg`)}
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
          <div className="aspect-square rounded-lg overflow-hidden border">
            <img
              src={enhancedImage.url}
              alt="Enhanced"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}