import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export interface EnhancementResult {
  success: boolean;
  enhancedUrl?: string;
  message?: string;
}

export function useReplicateEnhancement() {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [isCreatingBrandVisual, setIsCreatingBrandVisual] = useState(false);
  const { toast } = useToast();

  const enhanceFace = async (imageUrl: string, photoId?: string): Promise<EnhancementResult> => {
    setIsEnhancing(true);
    try {
      const response = await apiRequest('POST', '/api/photo/enhance-face', {
        imageUrl,
        photoId
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Face Enhanced",
          description: "Your photo has been enhanced successfully",
        });
        return result;
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Enhancement failed');
      }
    } catch (error: any) {
      console.error('Face enhancement error:', error);
      toast({
        title: "Enhancement Failed",
        description: error.message || "Failed to enhance photo",
        variant: "destructive",
      });
      return { success: false, message: error.message };
    } finally {
      setIsEnhancing(false);
    }
  };

  const removeBackground = async (imageUrl: string, photoId?: string): Promise<EnhancementResult> => {
    setIsRemovingBg(true);
    try {
      const response = await apiRequest('POST', '/api/photo/remove-background', {
        imageUrl,
        photoId
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Background Removed",
          description: "Background has been removed successfully",
        });
        return result;
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Background removal failed');
      }
    } catch (error: any) {
      console.error('Background removal error:', error);
      toast({
        title: "Background Removal Failed",
        description: error.message || "Failed to remove background",
        variant: "destructive",
      });
      return { success: false, message: error.message };
    } finally {
      setIsRemovingBg(false);
    }
  };

  const createBrandVisual = async (imageUrl: string, prompt?: string, photoId?: string): Promise<EnhancementResult> => {
    setIsCreatingBrandVisual(true);
    try {
      const response = await apiRequest('POST', '/api/photo/create-brand-visual', {
        imageUrl,
        prompt,
        photoId
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Brand Visual Created",
          description: "Your brand visual has been created successfully",
        });
        return result;
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Brand visual creation failed');
      }
    } catch (error: any) {
      console.error('Brand visual creation error:', error);
      toast({
        title: "Brand Visual Creation Failed",
        description: error.message || "Failed to create brand visual",
        variant: "destructive",
      });
      return { success: false, message: error.message };
    } finally {
      setIsCreatingBrandVisual(false);
    }
  };

  return {
    enhanceFace,
    removeBackground,
    createBrandVisual,
    isEnhancing,
    isRemovingBg,
    isCreatingBrandVisual,
    isLoading: isEnhancing || isRemovingBg || isCreatingBrandVisual
  };
}