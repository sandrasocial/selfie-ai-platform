'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface SelfieUploaderProps {
  onImageUpload: (imageUrl: string) => void;
  isUploading: boolean;
}

export default function SelfieUploader({ onImageUpload, isUploading }: SelfieUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    try {
      setUploadProgress(0);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // In production, you'd upload to your storage service here
      // For now, we'll create a local URL
      const imageUrl = URL.createObjectURL(file);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Call the parent handler
      onImageUpload(imageUrl);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    disabled: isUploading
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed transition-all duration-300 cursor-pointer
          ${isDragActive || dragActive 
            ? 'border-[#171719] bg-[#F1F1F1]' 
            : 'border-[#B5B5B3] bg-white hover:border-[#171719] hover:bg-[#F1F1F1]'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
      >
        <input {...getInputProps()} />
        
        <div className="p-12 text-center">
          {isUploading ? (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto border-4 border-[#171719] border-t-transparent rounded-full animate-spin"></div>
              <div className="space-y-2">
                <p className="text-lg font-['Inter'] text-[#171719]">
                  Analyzing your selfie...
                </p>
                <div className="w-full bg-[#B5B5B3] h-2">
                  <div 
                    className="bg-[#171719] h-2 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-[#B5B5B3] font-['Inter']">
                  {uploadProgress}% complete
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Upload Icon */}
              <div className="w-20 h-20 mx-auto bg-[#171719] flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>

              {/* Upload Text */}
              <div className="space-y-2">
                <h3 className="text-2xl font-['Bodoni_Moda'] text-[#171719]">
                  {isDragActive ? 'Drop your selfie here' : 'Upload Your Selfie'}
                </h3>
                <p className="text-[#B5B5B3] font-['Inter']">
                  {isDragActive 
                    ? 'Release to analyze your selfie' 
                    : 'Drag & drop or click to select an image'
                  }
                </p>
              </div>

              {/* Upload Button */}
              <button className="bg-[#171719] text-white font-['Inter'] font-medium px-8 py-3 hover:bg-black transition-colors duration-200">
                Choose File
              </button>

              {/* File Requirements */}
              <div className="text-xs text-[#B5B5B3] font-['Inter'] space-y-1">
                <p>Supported formats: JPEG, PNG, WebP</p>
                <p>Maximum file size: 10MB</p>
                <p>For best results, use a clear, well-lit selfie</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      {!isUploading && (
        <div className="mt-8 p-6 bg-[#F1F1F1] border border-[#B5B5B3]">
          <h4 className="text-lg font-['Bodoni_Moda'] text-[#171719] mb-3">
            Tips for the Best Score
          </h4>
          <ul className="space-y-2 text-sm text-[#B5B5B3] font-['Inter']">
            <li className="flex items-start gap-2">
              <span className="text-[#171719] mt-1">•</span>
              <span>Use natural lighting or face a window</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#171719] mt-1">•</span>
              <span>Position your eyes in the upper third of the frame</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#171719] mt-1">•</span>
              <span>Choose a clean, uncluttered background</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#171719] mt-1">•</span>
              <span>Wear colors that complement your skin tone</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
} 