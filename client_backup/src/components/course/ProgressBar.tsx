
interface ProgressBarProps {
  completedLessons: number;
  totalLessons: number;
  description: string;
}

export function ProgressBar({ completedLessons, totalLessons, description }: ProgressBarProps) {
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="mb-8">
      <p className="text-xl text-[#4C4B4B] mb-8 font-light leading-relaxed max-w-3xl">
        {description}
      </p>
      
      {/* Progress Bar */}
      <div className="bg-[#B5B5B3] h-2 mb-3 max-w-md">
        <div 
          className="bg-[#171719] h-2 transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <p className="text-sm text-[#4C4B4B] font-light">
        {completedLessons} of {totalLessons} lessons complete ({progressPercentage}%)
      </p>
    </div>
  );
}
