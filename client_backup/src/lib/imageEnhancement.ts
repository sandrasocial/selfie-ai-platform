export interface EnhancementSettings {
  enhanceImage: boolean;
  filterStyle: string;
  brightnessAdjust: number;
  contrastAdjust: number;
}

export class ImageProcessor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  async enhanceImage(imageFile: File, settings: EnhancementSettings): Promise<File> {
    if (!settings.enhanceImage) {
      return imageFile;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          // Set canvas size to match image
          this.canvas.width = img.width;
          this.canvas.height = img.height;

          // Clear canvas
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

          // Apply filter effects
          this.ctx.filter = this.buildFilterString(settings);

          // Draw the enhanced image
          this.ctx.drawImage(img, 0, 0);

          // Convert back to file
          this.canvas.toBlob((blob) => {
            if (blob) {
              const enhancedFile = new File([blob], imageFile.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(enhancedFile);
            } else {
              reject(new Error('Failed to create enhanced image'));
            }
          }, 'image/jpeg', 0.95);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(imageFile);
    });
  }

  private buildFilterString(settings: EnhancementSettings): string {
    let filters: string[] = [];

    // Base brightness and contrast
    const brightness = 1 + (settings.brightnessAdjust / 100);
    const contrast = 1 + (settings.contrastAdjust / 100);
    
    filters.push(`brightness(${brightness})`);
    filters.push(`contrast(${contrast})`);

    // Style-specific filters based on Sandra's Lightroom presets
    switch (settings.filterStyle) {
      // Light & Dreamy Collection
      case 'scandi-light-1':
        filters.push('brightness(1.37)');
        filters.push('contrast(0.86)');
        filters.push('saturate(1.08)');
        filters.push('hue-rotate(-7deg)');
        break;
      
      case 'scandi-light-2':
        filters.push('brightness(1.13)');
        filters.push('contrast(1.05)');
        filters.push('saturate(1.03)');
        filters.push('hue-rotate(2deg)');
        break;
      
      case 'scandi-light-3':
        filters.push('brightness(1.51)');
        filters.push('contrast(1.18)');
        filters.push('saturate(0.99)');
        filters.push('hue-rotate(2deg)');
        break;
      
      case 'scandi-light-5':
        filters.push('brightness(1.15)');
        filters.push('contrast(1.06)');
        filters.push('saturate(0.86)');
        filters.push('hue-rotate(3deg)');
        break;

      // Dark & Moody Collection
      case 'scandi-dark-1':
        filters.push('brightness(1.13)');
        filters.push('contrast(1.15)');
        filters.push('saturate(0.91)');
        filters.push('hue-rotate(11deg)');
        break;
      
      case 'scandi-dark-2':
        filters.push('brightness(1.20)');
        filters.push('contrast(1.23)');
        filters.push('saturate(0.86)');
        filters.push('hue-rotate(17deg)');
        break;
      
      case 'scandi-dark-4':
        filters.push('brightness(1.15)');
        filters.push('contrast(1.17)');
        filters.push('saturate(0.78)');
        filters.push('hue-rotate(5deg)');
        break;
      
      case 'scandi-dark-5':
        filters.push('brightness(0.48)');
        filters.push('contrast(0.72)');
        filters.push('saturate(1.03)');
        filters.push('hue-rotate(3deg)');
        break;

      // Deep Urban Collection
      case 'nordic-urban-1':
        filters.push('brightness(0.19)');
        filters.push('contrast(0.67)');
        filters.push('saturate(1.04)');
        filters.push('hue-rotate(4deg)');
        break;
      
      case 'nordic-urban-2':
        filters.push('brightness(0.19)');
        filters.push('contrast(0.67)');
        filters.push('saturate(1.04)');
        filters.push('hue-rotate(4deg)');
        break;
      
      case 'nordic-urban-4':
        filters.push('brightness(1.10)');
        filters.push('contrast(1.12)');
        filters.push('saturate(0.85)');
        filters.push('hue-rotate(4deg)');
        break;
      
      case 'nordic-urban-5':
        filters.push('contrast(1.06)');
        filters.push('saturate(1.0)');
        break;

      // Selfie Glow Up Collection
      case 'glow-up-1':
        filters.push('brightness(0.74)');
        filters.push('contrast(1.09)');
        filters.push('saturate(0.90)');
        filters.push('hue-rotate(3deg)');
        break;
      
      case 'glow-up-2':
        filters.push('brightness(0.10)');
        filters.push('contrast(0.92)');
        filters.push('saturate(1.01)');
        filters.push('hue-rotate(-9deg)');
        break;
      
      case 'glow-up-3':
        filters.push('brightness(1.06)');
        filters.push('contrast(1.07)');
        filters.push('saturate(0.91)');
        filters.push('hue-rotate(2deg)');
        break;
      
      case 'glow-up-4':
        filters.push('brightness(0.85)');
        filters.push('contrast(1.06)');
        filters.push('saturate(1.08)');
        filters.push('hue-rotate(-10deg)');
        break;
      
      case 'natural':
      default:
        // Natural enhancement - subtle improvements
        filters.push('saturate(1.02)');
        break;
    }

    return filters.join(' ');
  }

  async createPreviewUrl(imageFile: File, settings: EnhancementSettings): Promise<string> {
    if (!settings.enhanceImage) {
      return URL.createObjectURL(imageFile);
    }

    const enhancedFile = await this.enhanceImage(imageFile, settings);
    return URL.createObjectURL(enhancedFile);
  }

  // Advanced AI-style enhancements (simulated with sophisticated Canvas filters)
  async applyAIEnhancements(imageFile: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          this.canvas.width = img.width;
          this.canvas.height = img.height;
          
          // Step 1: Noise reduction (simulated with slight blur then sharpen)
          this.ctx.filter = 'blur(0.5px)';
          this.ctx.drawImage(img, 0, 0);
          
          // Step 2: Skin smoothing and enhancement
          this.ctx.filter = 'contrast(1.05) saturate(1.03) brightness(1.02)';
          this.ctx.drawImage(this.canvas, 0, 0);
          
          // Step 3: Edge enhancement
          this.ctx.filter = 'contrast(1.02)';
          this.ctx.drawImage(this.canvas, 0, 0);

          this.canvas.toBlob((blob) => {
            if (blob) {
              const enhancedFile = new File([blob], imageFile.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(enhancedFile);
            } else {
              reject(new Error('Failed to create AI-enhanced image'));
            }
          }, 'image/jpeg', 0.98);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image for AI enhancement'));
      img.src = URL.createObjectURL(imageFile);
    });
  }
}

export const imageProcessor = new ImageProcessor();