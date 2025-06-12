import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { aestheticCollections, getRandomCollectionImages, AestheticCollection } from '@shared/aestheticCollections';

interface CollectionSelectorProps {
  onSelectCollection?: (collection: AestheticCollection, selectedImages: string[]) => void;
  showPurchaseOption?: boolean;
}

export default function CollectionSelector({ onSelectCollection, showPurchaseOption = false }: CollectionSelectorProps) {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [gridImages, setGridImages] = useState<string[]>([]);
  const [showGrid, setShowGrid] = useState(false);

  const handleUseAesthetic = (collectionId: string) => {
    const collection = aestheticCollections[collectionId];
    const randomImages = getRandomCollectionImages(collection.albumPostUrl, 9);
    
    setSelectedCollection(collectionId);
    setGridImages(randomImages);
    setShowGrid(true);
    
    if (onSelectCollection) {
      onSelectCollection(collection, randomImages);
    }
  };

  const handlePurchaseCollection = (collectionId: string) => {
    // This will connect to purchase logic later
    console.log(`Purchase collection: ${collectionId}`);
  };

  return (
    <div className="space-y-8">
      {/* Collection Display */}
      {Object.values(aestheticCollections).map((collection) => (
        <div key={collection.id} className="bg-white border border-[#B5B5B3] overflow-hidden">
          {/* Collection Header */}
          <div className="p-6 border-b border-[#B5B5B3]">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-light text-[#171719] mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>
                  {collection.name}
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {collection.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-[#F1F1F1] text-[#4C4B4B] text-sm uppercase tracking-wide">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              {showPurchaseOption && (
                <div className="text-right">
                  <div className="text-lg font-light text-[#171719] mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>
                    ${collection.price}
                  </div>
                  <Button
                    onClick={() => handlePurchaseCollection(collection.id)}
                    className="bg-[#171719] text-white hover:bg-[#4C4B4B] uppercase tracking-wide text-sm"
                  >
                    Download Collection
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Cover Mockup */}
          <div className="p-6">
            <div className="mb-6">
              <img
                src={collection.coverMockup}
                alt={`${collection.name} cover`}
                className="w-full max-w-md mx-auto border border-[#B5B5B3]"
              />
            </div>

            {/* Action Button */}
            <div className="text-center mb-6">
              <Button
                onClick={() => handleUseAesthetic(collection.id)}
                className="bg-transparent border-2 border-[#171719] text-[#171719] hover:bg-[#171719] hover:text-white uppercase tracking-wide px-8 py-3"
              >
                Use This Aesthetic
              </Button>
            </div>

            {/* Instagram-style Grid (shows after clicking "Use This Aesthetic") */}
            {showGrid && selectedCollection === collection.id && (
              <div className="space-y-6">
                <div className="border-t border-[#B5B5B3] pt-6">
                  <h4 className="text-xl font-light text-[#171719] mb-4" style={{ fontFamily: 'Cormorant Garamond' }}>
                    Collection Preview
                  </h4>
                  <div className="grid grid-cols-3 gap-2 max-w-lg mx-auto">
                    {gridImages.map((imageUrl, index) => (
                      <div key={index} className="aspect-square">
                        <img
                          src={imageUrl}
                          alt={`${collection.name} ${index + 1}`}
                          className="w-full h-full object-cover border border-[#B5B5B3]"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Color Palette */}
                {collection.dominantColors && (
                  <div className="border-t border-[#B5B5B3] pt-6">
                    <h4 className="text-lg font-light text-[#171719] mb-3" style={{ fontFamily: 'Cormorant Garamond' }}>
                      Dominant Colors
                    </h4>
                    <div className="flex space-x-3">
                      {collection.dominantColors.map((color, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div
                            className="w-12 h-12 border border-[#B5B5B3]"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-xs text-[#4C4B4B] mt-1 uppercase tracking-wide">
                            {color}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Font Suggestions */}
                {collection.suggestedFonts && (
                  <div className="border-t border-[#B5B5B3] pt-6">
                    <h4 className="text-lg font-light text-[#171719] mb-3" style={{ fontFamily: 'Cormorant Garamond' }}>
                      Suggested Fonts
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-[#F1F1F1] p-3 border border-[#B5B5B3]">
                        <span className="text-[#4C4B4B] text-sm uppercase tracking-wide">Primary:</span>
                        <span className="text-[#171719]" style={{ fontFamily: collection.suggestedFonts.primary }}>
                          {collection.suggestedFonts.primary}
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-[#F1F1F1] p-3 border border-[#B5B5B3]">
                        <span className="text-[#4C4B4B] text-sm uppercase tracking-wide">Secondary:</span>
                        <span className="text-[#171719]" style={{ fontFamily: collection.suggestedFonts.secondary }}>
                          {collection.suggestedFonts.secondary}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tone Keywords */}
                {collection.tone && (
                  <div className="border-t border-[#B5B5B3] pt-6">
                    <h4 className="text-lg font-light text-[#171719] mb-3" style={{ fontFamily: 'Cormorant Garamond' }}>
                      Brand Tone
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {collection.tone.map((keyword, index) => (
                        <span key={index} className="px-3 py-1 bg-[#F1F1F1] text-[#4C4B4B] text-sm border border-[#B5B5B3]">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}