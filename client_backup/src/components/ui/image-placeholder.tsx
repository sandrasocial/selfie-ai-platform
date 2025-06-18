
import React from 'react';

interface ImagePlaceholderProps {
  label: string;
  width?: string;
  height?: string;
  className?: string;
  suggestedSize?: string;
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ 
  label, 
  width, 
  height, 
  className = "",
  suggestedSize
}) => {
  const displaySize = suggestedSize || `${width} x ${height}`;
  
  return (
    <div
      style={{
        backgroundColor: '#F1F1F1',
        width: width || '100%',
        height: height || '400px',
        border: '2px dashed #B5B5B3',
      }}
      className={`flex items-center justify-center font-helvetica text-sm text-luxury-text-gray ${className}`}
    >
      <div className="text-center">
        <div className="mb-1">Upload {label}</div>
        {displaySize && (
          <div className="text-xs text-luxury-accent">
            Suggested: {displaySize}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePlaceholder;
