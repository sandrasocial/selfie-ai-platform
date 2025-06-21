'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-['Bodoni_Moda'] text-[#171719] mb-4">
          Something went wrong!
        </h2>
        <p className="text-[#B5B5B3] font-['Inter'] mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={reset}
          className="bg-[#171719] text-white font-['Inter'] font-medium px-6 py-3 hover:bg-black transition-colors duration-200"
        >
          Try again
        </button>
      </div>
    </div>
  );
} 