import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Play, CheckCircle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

// Generic types for course data
interface CourseLesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: string;
  videoUrl?: string;
  content?: any;
}

interface CourseModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: CourseLesson[];
  estimatedDuration: string;
}

interface CourseNavigationProps {
  courseData: CourseModule[];
  currentModuleId?: string;
  currentLessonId?: string;
  onLessonSelect: (moduleId: string, lessonId: string) => void;
  userProgress?: Record<string, boolean>;
}

const CircularProgress = ({ progress = 0, size = 32 }: { progress: number; size?: number }) => {
  const radius = (size - 4) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#B5B5B3"
          strokeWidth="2"
          fill="transparent"
          opacity="0.3"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#171719"
          strokeWidth="2"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium text-[#171719]">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};

const LessonItem = ({ 
  lesson, 
  moduleId, 
  isActive, 
  isCompleted, 
  isLocked, 
  onSelect 
}: {
  lesson: CourseLesson;
  moduleId: string;
  isActive: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  onSelect: (moduleId: string, lessonId: string) => void;
}) => {
  return (
    <button
      onClick={() => !isLocked && onSelect(moduleId, lesson.id)}
      disabled={isLocked}
      className={cn(
        "w-full text-left p-4 rounded-lg transition-all duration-300 ease-out group",
        "hover:bg-white/50 hover:shadow-sm",
        isActive && "bg-white shadow-md ring-1 ring-[#B5B5B3]/20",
        isLocked && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {isLocked ? (
            <Lock className="w-4 h-4 text-[#B5B5B3]" />
          ) : isCompleted ? (
            <CheckCircle className="w-4 h-4 text-[#171719]" />
          ) : (
            <Play className="w-4 h-4 text-[#4C4B4B] group-hover:text-[#171719] transition-colors" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            "font-medium text-sm leading-snug mb-1 transition-colors",
            "font-['Inter'] font-normal",
            isActive ? "text-[#171719]" : "text-[#4C4B4B]",
            "group-hover:text-[#171719]"
          )}>
            {lesson.title}
          </h4>
          
          <p className="text-xs text-[#B5B5B3] mb-2 line-clamp-2">
            {lesson.description}
          </p>
          
          <div className="flex items-center gap-2 text-xs text-[#B5B5B3]">
            <span>{lesson.duration}</span>
            <span>•</span>
            <span className="capitalize">{lesson.type}</span>
          </div>
        </div>
      </div>
    </button>
  );
};

const ModuleSection = ({ 
  module, 
  isExpanded, 
  onToggle, 
  currentLessonId, 
  onLessonSelect,
  userProgress = {}
}: {
  module: CourseModule;
  isExpanded: boolean;
  onToggle: () => void;
  currentLessonId?: string;
  onLessonSelect: (moduleId: string, lessonId: string) => void;
  userProgress: Record<string, boolean>;
}) => {
  const completedLessons = module.lessons.filter(lesson => userProgress[lesson.id]).length;
  const progressPercentage = (completedLessons / module.lessons.length) * 100;
  
  return (
    <div className="mb-6">
      <button
        onClick={onToggle}
        className={cn(
          "w-full p-4 rounded-xl transition-all duration-300 ease-out",
          "bg-white/80 hover:bg-white hover:shadow-lg",
          "border border-[#B5B5B3]/20 hover:border-[#B5B5B3]/40",
          isExpanded && "shadow-lg border-[#B5B5B3]/40"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-2xl">{module.icon}</div>
            
            <div className="text-left">
              <h3 className={cn(
                "font-['Cormorant_Garamond'] text-lg font-normal text-[#171719] mb-1",
                "tracking-wide uppercase"
              )}>
                {module.title}
              </h3>
              <p className="text-sm text-[#4C4B4B] font-light">
                {module.estimatedDuration} • {module.lessons.length} lessons
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <CircularProgress progress={progressPercentage} size={36} />
            
            <div className="transition-transform duration-300 ease-out">
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-[#4C4B4B]" />
              ) : (
                <ChevronRight className="w-5 h-5 text-[#4C4B4B]" />
              )}
            </div>
          </div>
        </div>
      </button>
      
      <div className={cn(
        "overflow-hidden transition-all duration-500 ease-out",
        isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="pt-4 pl-4 space-y-2">
          {module.lessons.map((lesson, index) => {
            const isCompleted = userProgress[lesson.id] || false;
            const isLocked = index > 0 && !userProgress[module.lessons[index - 1].id];
            const isActive = currentLessonId === lesson.id;
            
            return (
              <LessonItem
                key={lesson.id}
                lesson={lesson}
                moduleId={module.id}
                isActive={isActive}
                isCompleted={isCompleted}
                isLocked={isLocked}
                onSelect={onLessonSelect}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const CourseNavigation: React.FC<CourseNavigationProps> = ({
  courseData,
  currentModuleId,
  currentLessonId,
  onLessonSelect,
  userProgress = {}
}) => {
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  
  // Determine course title based on data structure
  const courseTitle = courseData.length > 0 && courseData[0].id.includes('starter') 
    ? 'Selfie Starter Kit™' 
    : 'Branded by Selfie™';
  
  const courseDescription = courseData.length > 0 && courseData[0].id.includes('starter')
    ? 'Master the fundamentals of personal branding'
    : 'Your complete transformation journey';
  
  useEffect(() => {
    if (currentModuleId && !expandedModules.includes(currentModuleId)) {
      setExpandedModules(prev => [...prev, currentModuleId]);
    }
  }, [currentModuleId, expandedModules]);
  
  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      if (prev.includes(moduleId)) {
        return prev.filter(id => id !== moduleId);
      } else {
        return [...prev, moduleId];
      }
    });
  };
  
  return (
    <div className="h-full bg-[#F1F1F1] border-r border-[#B5B5B3]/20">
      <div className="p-6 border-b border-[#B5B5B3]/20">
        <h2 className={cn(
          "font-['Cormorant_Garamond'] text-2xl font-normal text-[#171719] mb-2",
          "tracking-wide"
        )}>
          {courseTitle}
        </h2>
        <p className="text-sm text-[#4C4B4B] font-light">
          {courseDescription}
        </p>
      </div>
      
      <div className="p-6 space-y-6 overflow-y-auto">
        {courseData.map((module: CourseModule) => (
          <ModuleSection
            key={module.id}
            module={module}
            isExpanded={expandedModules.includes(module.id)}
            onToggle={() => toggleModule(module.id)}
            currentLessonId={currentLessonId}
            onLessonSelect={onLessonSelect}
            userProgress={userProgress}
          />
        ))}
      </div>
    </div>
  );
};