'use client';

import { useState, useRef } from 'react';
import { Button } from '@/app/components/ui/button';
import { Upload, Download, Grid, Shuffle, Eye, Plus, X } from 'lucide-react';
import html2canvas from 'html2canvas';

interface FeedImage {
  id: string;
  url: string;
  file?: File;
}

export default function FeedDesigner() {
  const [images, setImages] = useState<FeedImage[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: FeedImage[] = [];
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newImages.push({
          id: Date.now().toString() + Math.random(),
          url: e.target?.result as string,
          file
        });
        
        if (newImages.length === files.length) {
          setImages(prev => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const shuffleImages = () => {
    setImages(prev => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
  };

  const downloadFeedPreview = async () => {
    if (!feedRef.current) return;

    try {
      const canvas = await html2canvas(feedRef.current, {
        backgroundColor: '#F1F1F1',
        scale: 2
      });
      
      const link = document.createElement('a');
      link.download = 'feed-preview.png';
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error generating preview:', error);
    }
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    setImages(prev => {
      const updated = [...prev];
      const [removed] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, removed);
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      {/* Header */}
      <div className="bg-white border-b border-[#B5B5B3] px-6 py-16 relative overflow-hidden">
        {/* Editorial Number */}
        <div 
          className="absolute -top-20 right-10 text-[#F1F1F1] pointer-events-none"
          style={{ 
            fontFamily: 'Bodoni Moda, serif',
            fontSize: '300px',
            fontWeight: '700',
            opacity: '0.03',
            lineHeight: '1'
          }}
        >
          FD
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <h1 
            className="text-7xl mb-4 text-[#171719]"
            style={{ 
              fontFamily: 'Bodoni Moda, serif',
              fontWeight: '300',
              letterSpacing: '-0.04em',
              lineHeight: '0.9'
            }}
          >
            Feed Designer
          </h1>
          <p 
            className="text-xl text-[#171719]"
            style={{ 
              fontFamily: 'Inter, sans-serif',
              fontWeight: '200'
            }}
          >
            Okay, so you know how hard it is to plan your grid? 
            Upload your photos and see exactly how they'll look. Drag, drop, done.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 py-6 bg-white border-b border-[#B5B5B3]">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-4">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#171719] text-[#F1F1F1] hover:bg-[#171719]/90 rounded-none"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Images
          </Button>
          
          {images.length > 0 && (
            <>
              <Button
                onClick={shuffleImages}
                variant="outline"
                className="border-[#171719] text-[#171719] rounded-none"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Shuffle
              </Button>
              
              <Button
                onClick={() => setPreviewMode(!previewMode)}
                variant="outline"
                className="border-[#171719] text-[#171719] rounded-none"
              >
                <Eye className="w-4 h-4 mr-2" />
                {previewMode ? 'Edit Mode' : 'Preview'}
              </Button>
              
              <Button
                onClick={downloadFeedPreview}
                variant="outline"
                className="border-[#171719] text-[#171719] rounded-none"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Feed Grid */}
      <div className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {images.length === 0 ? (
            <div className="text-center py-24">
              <Grid className="w-12 h-12 mx-auto mb-4 text-[#B5B5B3]" />
              <h3 
                className="text-2xl mb-2 text-[#171719]"
                style={{ 
                  fontFamily: 'Bodoni Moda, serif',
                  fontWeight: '400'
                }}
              >
                Time to design your feed
              </h3>
              <p 
                className="text-lg text-[#B5B5B3] mb-8"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: '200'
                }}
              >
                Upload some photos and I'll show you exactly how they'll look
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#171719] text-[#F1F1F1] hover:bg-[#171719]/90 uppercase tracking-widest rounded-none"
              >
                <Plus className="w-4 h-4 mr-2" />
                ADD PHOTOS
              </Button>
            </div>
          ) : (
            <div 
              ref={feedRef}
              className="bg-white p-4 rounded-none"
            >
              <div className="grid grid-cols-3 gap-1">
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    className="relative aspect-square group"
                    draggable={!previewMode}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', index.toString());
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                      moveImage(fromIndex, index);
                    }}
                  >
                    <img
                      src={image.url}
                      alt={`Feed image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {!previewMode && (
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          onClick={() => removeImage(image.id)}
                          size="sm"
                          variant="ghost"
                          className="text-white hover:bg-white/20"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Empty slots */}
                {Array.from({ length: Math.max(0, 9 - images.length) }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="aspect-square bg-[#F1F1F1] border-2 border-dashed border-[#B5B5B3] flex items-center justify-center"
                  >
                    <Plus className="w-6 h-6 text-[#B5B5B3]" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tips Section */}
      <div className="px-6 py-12 bg-white border-t border-[#B5B5B3]">
        <div className="max-w-4xl mx-auto">
          <h2 
            className="text-3xl mb-6 text-[#171719]"
            style={{ fontFamily: 'Bodoni Moda, serif' }}
          >
            Pro Tips
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 
                className="text-xl mb-2 text-[#171719]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Consistent Colors
              </h3>
              <p 
                className="text-[#171719]/70"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Stick to 3-5 colors throughout your feed for a cohesive look
              </p>
            </div>
            <div>
              <h3 
                className="text-xl mb-2 text-[#171719]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Pattern Planning
              </h3>
              <p 
                className="text-[#171719]/70"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Create patterns like checkerboard or row themes for visual interest
              </p>
            </div>
            <div>
              <h3 
                className="text-xl mb-2 text-[#171719]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Mix Content Types
              </h3>
              <p 
                className="text-[#171719]/70"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Balance selfies, quotes, and lifestyle shots for variety
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 