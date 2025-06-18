import React from 'react';
import { Upload } from 'lucide-react';

interface CustomUploadButtonProps {
  onUpload: (fileInfo: any) => void;
  disabled?: boolean;
  className?: string;
}

const CustomUploadButton: React.FC<CustomUploadButtonProps> = ({ 
  onUpload, 
  disabled = false,
  className = ""
}) => {
  const openUploader = () => {
    if (disabled) return;

    // Dynamic import to avoid SSR issues
    import('uploadcare-widget').then((uploadcare) => {
      const widget = uploadcare.default;
      
      widget.openDialog(null, {
        publicKey: import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY,
        multiple: false,
        crop: false,
        tabs: 'file camera url',
        preview: true,
        clearable: true,
        locale: 'en',
      }).done((file: any) => {
        file.done((fileInfo: any) => {
          if (fileInfo?.cdnUrl) {
            onUpload(fileInfo);
          }
        });
      });
    }).catch((error) => {
      console.error('Error loading Uploadcare widget:', error);
    });
  };

  return (
    <button
      onClick={openUploader}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        bg-black text-white hover:bg-white hover:text-black
        border-2 border-black
        px-6 py-3
        font-['Inter'] font-medium text-sm uppercase tracking-wide
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      <Upload className="w-4 h-4" />
      Upload Your Photo
    </button>
  );
};

export default CustomUploadButton;