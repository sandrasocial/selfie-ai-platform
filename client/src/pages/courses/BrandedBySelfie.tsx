import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, 
  CheckCircle, 
  Lock, 
  Download,
  BookOpen,
  Clock,
  Target,
  FileText,
  Video,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Brain,
  Camera,
  MessageCircle,
  Calendar,
  Clipboard
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { CourseNavigation } from '@/components/CourseNavigation';
import { BRANDED_BY_SELFIE_COURSE, BrandedModule, BrandedLesson, AI_TOOLS } from '@shared/brandedBySelfieData';
import { apiRequest } from '@/lib/queryClient';
import { cn } from '@/lib/utils';

// AI Tool Modal Component
const AIToolModal = ({ 
  tool, 
  isOpen, 
  onClose 
}: { 
  tool: any; 
  isOpen: boolean; 
  onClose: () => void; 
}) => {
  if (!isOpen) return null;

  const getToolIcon = (id: string) => {
    switch (id) {
      case 'confidence-coach': return <Brain className="w-6 h-6" />;
      case 'selfie-analyzer': return <Camera className="w-6 h-6" />;
      case 'brand-voice': return <MessageCircle className="w-6 h-6" />;
      case 'content-planner': return <Calendar className="w-6 h-6" />;
      case 'workbook-generator': return <Clipboard className="w-6 h-6" />;
      default: return <Sparkles className="w-6 h-6" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-[#F1F1F1] rounded-lg">
              {getToolIcon(tool.id)}
            </div>
            <div>
              <h3 className="font-['Cormorant_Garamond'] text-2xl font-normal text-[#171719]">
                {tool.title}
              </h3>
              <p className="text-[#4C4B4B] font-light">
                {tool.description}
              </p>
            </div>
          </div>
          
          <div className="bg-[#F1F1F1] p-6 rounded-lg mb-6">
            <p className="text-[#4C4B4B] text-center font-light">
              AI Tool integration coming soon. This will provide personalized guidance based on your progress and goals.
            </p>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button 
              onClick={onClose}
              className="bg-transparent border border-[#4C4B4B] text-[#4C4B4B] hover:bg-[#4C4B4B] hover:text-white"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Lesson Content Component
const LessonContent = ({ 
  lesson, 
  moduleId, 
  onComplete, 
  onNotesChange, 
  notes 
}: {
  lesson: BrandedLesson;
  moduleId: string;
  onComplete: () => void;
  onNotesChange: (notes: string) => void;
  notes: string;
}) => {
  return (
    <div className="luxury-lesson-container">
      {/* Hero Video Section */}
      {lesson.videoUrl && (
        <section className="video-hero">
          <div className="video-wrapper">
            <iframe
              src={lesson.videoUrl}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={lesson.title}
            />
          </div>
          <div className="video-overlay"></div>
          
          {/* Lesson Header Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10">
            <div className="max-w-4xl mx-auto">
              <span className="module-indicator text-white/80">
                MODULE {moduleId.toUpperCase()}
              </span>
              <h1 className="lesson-title text-white mb-4">
                {lesson.title}
              </h1>
              <p className="text-xl font-light text-white/90 max-w-2xl">
                {lesson.description}
              </p>
              
              <div className="flex items-center gap-6 mt-6 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{lesson.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  <span className="capitalize">{lesson.type}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Key Takeaways Section */}
      <section className="content-section bg-white">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="font-['Cormorant_Garamond'] text-4xl font-normal text-[#171719] mb-8 text-center">
            What You'll Master
          </h2>
          
          {lesson.content && (
            <div className="prose prose-xl max-w-none text-center mb-12">
              <p className="body-text text-xl leading-relaxed">
                {lesson.content}
              </p>
            </div>
          )}

          {/* Action Items */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="action-item-luxury">
              <div className="checkmark-icon">✓</div>
              <h4 className="font-medium text-[#171719] mb-2">Download Resources</h4>
              <p className="text-[#4C4B4B] font-light">Get your lesson workbook and templates</p>
            </div>
            <div className="action-item-luxury">
              <div className="checkmark-icon">✓</div>
              <h4 className="font-medium text-[#171719] mb-2">Take Action</h4>
              <p className="text-[#4C4B4B] font-light">Apply what you've learned immediately</p>
            </div>
            <div className="action-item-luxury">
              <div className="checkmark-icon">✓</div>
              <h4 className="font-medium text-[#171719] mb-2">Share Progress</h4>
              <p className="text-[#4C4B4B] font-light">Document your transformation journey</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Tools Section */}
      <section className="content-section bg-[#F1F1F1]">
        <div className="max-w-5xl mx-auto px-8">
          <h2 className="font-['Cormorant_Garamond'] text-4xl font-normal text-[#171719] mb-4 text-center">
            Your AI-Powered Tools
          </h2>
          <p className="text-center text-[#4C4B4B] font-light text-lg mb-12 max-w-2xl mx-auto">
            Personalized guidance and feedback designed specifically for this lesson
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {AI_TOOLS.slice(0, 2).map(tool => (
              <div key={tool.id} className="ai-tool-card-luxury">
                <div className="ai-tool-icon">
                  <span className="text-2xl">{tool.icon}</span>
                </div>
                <h4 className="font-['Cormorant_Garamond'] text-2xl font-normal text-[#171719] mb-3">
                  {tool.title}
                </h4>
                <p className="text-[#4C4B4B] font-light mb-6 leading-relaxed">
                  {tool.description}
                </p>
                <Button className="btn-luxury btn-luxury-primary w-full">
                  Activate Tool
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notes & Reflection Section */}
      <section className="content-section bg-white">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="font-['Cormorant_Garamond'] text-4xl font-normal text-[#171719] mb-8 text-center">
            Capture Your Transformation
          </h2>
          <p className="text-center text-[#4C4B4B] font-light text-lg mb-12 max-w-2xl mx-auto">
            Document your insights, breakthroughs, and commitment to growth
          </p>
          
          <div className="notes-container-luxury">
            <Textarea
              placeholder="What resonated most with you in this lesson? What action will you take immediately? What shift do you feel happening in your confidence?"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              className="notes-textarea-luxury"
            />
          </div>
        </div>
      </section>

      {/* Completion Section */}
      <section className="content-section bg-[#171719] text-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="font-['Cormorant_Garamond'] text-4xl font-normal mb-6">
            Ready for Your Next Breakthrough?
          </h2>
          <p className="text-white/80 font-light text-lg mb-8 max-w-2xl mx-auto">
            Every lesson completed is a step closer to the magnetic, confident CEO you're becoming.
          </p>
          
          <Button 
            onClick={onComplete}
            className="btn-luxury bg-white text-[#171719] hover:bg-[#F1F1F1] px-12 py-4 text-lg font-medium"
          >
            <CheckCircle className="w-5 h-5 mr-3" />
            Mark Lesson Complete
          </Button>
          
          <p className="text-white/60 text-sm mt-6">
            Your progress is automatically saved
          </p>
        </div>
      </section>
    </div>
  );
};

function BrandedBySelfie() {
  const [currentModuleId, setCurrentModuleId] = useState<string>('confidence');
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState<BrandedLesson | null>(null);
  const [userProgress, setUserProgress] = useState<Record<string, boolean>>({});
  const [lessonNotes, setLessonNotes] = useState<string>('');
  const [showAITool, setShowAITool] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check course access
  const { data: accessData, isLoading: accessLoading } = useQuery({
    queryKey: ["/api/courses/branded/check-access"],
    retry: false,
  });

  // Get course progress
  const { data: progressData } = useQuery({
    queryKey: ["/api/courses/branded/progress"],
    enabled: !!(accessData as any)?.hasAccess,
    retry: false,
  });

  // Mark lesson complete mutation
  const completeLessonMutation = useMutation({
    mutationFn: async ({ moduleId, lessonId }: { moduleId: string; lessonId: string }) => {
      await apiRequest("POST", "/api/courses/branded/progress", {
        moduleId,
        lessonId,
        completed: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses/branded/progress"] });
      toast({
        title: "Progress Saved",
        description: "Lesson marked as complete!",
      });
    },
  });

  // Initialize with first lesson
  useEffect(() => {
    if (!currentLessonId && BRANDED_BY_SELFIE_COURSE.length > 0) {
      const firstModule = BRANDED_BY_SELFIE_COURSE[0];
      const firstLesson = firstModule.lessons[0];
      setCurrentModuleId(firstModule.id);
      setCurrentLessonId(firstLesson.id);
      setCurrentLesson(firstLesson);
    }
  }, [currentLessonId]);

  const handleLessonSelect = (moduleId: string, lessonId: string) => {
    const module = BRANDED_BY_SELFIE_COURSE.find(m => m.id === moduleId);
    const lesson = module?.lessons.find(l => l.id === lessonId);
    
    if (lesson) {
      setCurrentModuleId(moduleId);
      setCurrentLessonId(lessonId);
      setCurrentLesson(lesson);
      setLessonNotes('');
    }
  };

  const handleMarkComplete = () => {
    if (currentModuleId && currentLessonId) {
      setUserProgress(prev => ({ ...prev, [currentLessonId]: true }));
      completeLessonMutation.mutate({ 
        moduleId: currentModuleId, 
        lessonId: currentLessonId 
      });
    }
  };

  const handleNotesChange = (notes: string) => {
    setLessonNotes(notes);
  };

  // Navigation helpers
  const getCurrentModuleIndex = () => {
    return BRANDED_BY_SELFIE_COURSE.findIndex(m => m.id === currentModuleId);
  };

  const getCurrentLessonIndex = () => {
    const module = BRANDED_BY_SELFIE_COURSE.find(m => m.id === currentModuleId);
    return module?.lessons.findIndex(l => l.id === currentLessonId) ?? -1;
  };

  const getNextLesson = () => {
    const moduleIndex = getCurrentModuleIndex();
    const lessonIndex = getCurrentLessonIndex();
    const currentModule = BRANDED_BY_SELFIE_COURSE[moduleIndex];
    
    if (lessonIndex < currentModule.lessons.length - 1) {
      return {
        moduleId: currentModule.id,
        lessonId: currentModule.lessons[lessonIndex + 1].id
      };
    } else if (moduleIndex < BRANDED_BY_SELFIE_COURSE.length - 1) {
      const nextModule = BRANDED_BY_SELFIE_COURSE[moduleIndex + 1];
      return {
        moduleId: nextModule.id,
        lessonId: nextModule.lessons[0].id
      };
    }
    return null;
  };

  const getPreviousLesson = () => {
    const moduleIndex = getCurrentModuleIndex();
    const lessonIndex = getCurrentLessonIndex();
    
    if (lessonIndex > 0) {
      const currentModule = BRANDED_BY_SELFIE_COURSE[moduleIndex];
      return {
        moduleId: currentModule.id,
        lessonId: currentModule.lessons[lessonIndex - 1].id
      };
    } else if (moduleIndex > 0) {
      const prevModule = BRANDED_BY_SELFIE_COURSE[moduleIndex - 1];
      return {
        moduleId: prevModule.id,
        lessonId: prevModule.lessons[prevModule.lessons.length - 1].id
      };
    }
    return null;
  };

  if (accessLoading) {
    return (
      <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#171719] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!(accessData as any)?.hasAccess) {
    return (
      <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <Lock className="w-16 h-16 text-[#4C4B4B] mx-auto mb-6" />
          <h1 className="font-['Cormorant_Garamond'] text-3xl font-normal text-[#171719] mb-4">
            Course Access Required
          </h1>
          <p className="text-[#4C4B4B] mb-8 font-light">
            Purchase Branded by Selfie™ to access this premium transformation experience.
          </p>
          <Button 
            onClick={() => window.location.href = "/products/branded-by-selfie"}
            className="bg-transparent border border-[#171719] text-[#171719] hover:bg-[#171719] hover:text-white font-light uppercase tracking-wide"
          >
            Get Access - $397
          </Button>
        </div>
      </div>
    );
  }

  if (!currentLesson) {
    return (
      <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#171719] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const nextLesson = getNextLesson();
  const previousLesson = getPreviousLesson();

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      <Header />
      
      <div className="flex">
        {/* Left Sidebar - Course Navigation */}
        <div className="hidden lg:block w-80 h-screen sticky top-0 overflow-hidden">
          <CourseNavigation
            courseData={BRANDED_BY_SELFIE_COURSE}
            currentModuleId={currentModuleId}
            currentLessonId={currentLessonId ?? undefined}
            onLessonSelect={handleLessonSelect}
            userProgress={userProgress}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-h-screen">
          <div className="max-w-5xl mx-auto px-6 py-12">
            {/* Lesson Content */}
            <LessonContent
              lesson={currentLesson}
              moduleId={currentModuleId}
              onComplete={handleMarkComplete}
              onNotesChange={handleNotesChange}
              notes={lessonNotes}
            />

            {/* Navigation Footer */}
            <div className="mt-16 pt-8 border-t border-[#B5B5B3]/20">
              <div className="flex items-center justify-between">
                <div>
                  {previousLesson && (
                    <Button
                      onClick={() => handleLessonSelect(previousLesson.moduleId, previousLesson.lessonId)}
                      className="bg-transparent border border-[#4C4B4B] text-[#4C4B4B] hover:bg-[#4C4B4B] hover:text-white"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous Lesson
                    </Button>
                  )}
                </div>

                <div className="text-center">
                  <div className="flex items-center gap-2 justify-center mb-2">
                    {BRANDED_BY_SELFIE_COURSE.map((module, moduleIndex) =>
                      module.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson.id}
                          className={cn(
                            "w-2 h-2 rounded-full transition-all duration-300",
                            lesson.id === currentLessonId 
                              ? "bg-[#171719] w-8" 
                              : userProgress[lesson.id] 
                                ? "bg-[#4C4B4B]" 
                                : "bg-[#B5B5B3]"
                          )}
                        />
                      ))
                    )}
                  </div>
                  <p className="text-sm text-[#4C4B4B] font-light">
                    {Object.keys(userProgress).length} of {
                      BRANDED_BY_SELFIE_COURSE.reduce((acc, module) => acc + module.lessons.length, 0)
                    } lessons complete
                  </p>
                </div>

                <div>
                  {nextLesson && (
                    <Button
                      onClick={() => handleLessonSelect(nextLesson.moduleId, nextLesson.lessonId)}
                      className="bg-[#171719] text-white hover:bg-[#4C4B4B]"
                    >
                      Next Lesson
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Tool Modal */}
      {showAITool && (
        <AIToolModal
          tool={showAITool}
          isOpen={!!showAITool}
          onClose={() => setShowAITool(null)}
        />
      )}
    </div>
  );
}

export default BrandedBySelfie;