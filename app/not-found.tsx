import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-['Bodoni_Moda'] text-[#171719] mb-4">
          Page Not Found
        </h2>
        <p className="text-[#B5B5B3] font-['Inter'] mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="bg-[#171719] text-white font-['Inter'] font-medium px-6 py-3 hover:bg-black transition-colors duration-200"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
} 