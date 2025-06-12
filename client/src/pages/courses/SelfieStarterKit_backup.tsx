import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, CheckCircle, Clock, Download, ArrowLeft, ArrowRight, ChevronDown, ChevronUp
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { apiRequest } from '@/lib/queryClient';
import { cn } from '@/lib/utils';

const COURSE_DATA = [
  {
    id: 'module-1',
    title: 'Start Here',
    subtitle: 'Your Brand, Your Power',
    lessons: [{ id: 'brand-power', title: 'Your Brand, Your Power', duration: '8 min' }]
  },
  {
    id: 'module-2', 
    title: 'Selfie Editing',
    subtitle: 'Edit Like a Pro (Even on iPhone)',
    lessons: [
      { id: 'presets', title: 'Applying Your Presets', duration: '12 min' },
      { id: 'iphone-edit', title: 'iPhone Quick Edit', duration: '8 min' }
    ]
  },
  {
    id: 'module-3',
    title: 'Smart Edits With Apps', 
    subtitle: 'Add Mood Without Losing the Real You',
    lessons: [
      { id: 'hypic', title: 'Editorial Edge with Hypic', duration: '10 min' },
      { id: 'capcut', title: 'Luxe Video with CapCut', duration: '15 min' }
    ]
  },
  {
    id: 'module-4',
    title: 'Hands-Free Like a CEO',
    subtitle: 'Shoot Solo, Stay in Flow', 
    lessons: [{ id: 'hands-free', title: 'Voice & Gesture Control', duration: '8 min' }]
  },
  {
    id: 'module-5',
    title: 'Brand Aesthetic Builder',
    subtitle: 'Design Like a CEO™',
    lessons: [{ id: 'aesthetic', title: 'Your Visual Strategy', duration: '20 min' }]
  },
  {
    id: 'module-6',
    title: 'Captions That Convert',
    subtitle: 'Write Like a Vibe',
    lessons: [{ id: 'captions', title: 'Words That Connect', duration: '15 min' }]
  }
];

const AESTHETIC_COLLECTIONS = [
  { id: 'pink', name: 'PINK', images: ['https://i.postimg.cc/QtnSw23T/1.png', 'https://i.postimg.cc/c1t4jf7K/102.png', 'https://i.postimg.cc/CKtpH6Qc/117.png', 'https://i.postimg.cc/SKnwsfxC/126.png', 'https://i.postimg.cc/bwwXXhX6/125.png', 'https://i.postimg.cc/wjGGSRQv/134.png'] },
  { id: 'cream', name: 'CREAM', images: ['https://i.postimg.cc/ryRY7Nht/10.png', 'https://i.postimg.cc/zvWNBZ8s/110.png', 'https://i.postimg.cc/t4zXWjWy/105.png', 'https://i.postimg.cc/Dfs31h3D/121.png', 'https://i.postimg.cc/YCRXQnST/15.png', 'https://i.postimg.cc/s2t02Bx2/137.png'] },
  { id: 'beige', name: 'BEIGE', images: ['https://i.postimg.cc/VNCRLn6H/1.png', 'https://i.postimg.cc/WbY6GXqH/10.png', 'https://i.postimg.cc/d1QLSczm/34.png', 'https://i.postimg.cc/W3skLkJZ/24.png', 'https://i.postimg.cc/QMhtHrxG/42.png', 'https://i.postimg.cc/WzHFkYYm/25.png'] },
  { id: 'coastal', name: 'COASTAL', images: ['https://i.postimg.cc/tC1JZ53k/103.png', 'https://i.postimg.cc/Zqj4DBP0/119.png', 'https://i.postimg.cc/wMn6cCXV/113.png', 'https://i.postimg.cc/wvTT6cxh/110.png', 'https://i.postimg.cc/52SXbtqW/128.png', 'https://i.postimg.cc/zXmvhhx1/132.png'] },
  { id: 'energy', name: 'ENERGY & HEALING', images: ['https://i.postimg.cc/MTjrNHg1/127161.png', 'https://i.postimg.cc/6p5bwYDW/a-a-bur-A-close-up-of-jasmine-petals-each-with-its-own-unique-a03a9998-01de-41e8-acd3-041b9403e5ac-0.png', 'https://i.postimg.cc/wjpysr6z/xelanft_resting_minimalistic_setting_no_face_seen_bright_natu_a1b2aefd-03ce-4137-8f43-74bed0e9f354_3.png', 'https://i.postimg.cc/Dz520jzx/xelanft_getting_a_massage_minimalistic_setting_no_face_seen_b_5c32c84d-9a8e-4f7f-91c3-ee6b9bc8c3bc_2.png', 'https://i.postimg.cc/0NJqhSWR/xelanft_yoga_pose_minimalistic_setting_no_face_seen_bright_n_55e7f05c-c670-46c1-8f5e-2b65e35f3fd6_2.png', 'https://i.postimg.cc/jjMzb5KY/xelanft_candles_minimalistic_setting_no_face_seen_bright_nat_af938b85-7c6e-4976-9eca-57e3c2f82c18_3.png'] },
  { id: 'golden', name: 'GOLDEN HOUR', images: ['https://i.postimg.cc/Kz4g8yJc/12.png', 'https://i.postimg.cc/zG12Mqkg/18.png', 'https://i.postimg.cc/j5kPHjLJ/2.png', 'https://i.postimg.cc/CK7jK707/3.png', 'https://i.postimg.cc/MKsX3Gws/57.png', 'https://i.postimg.cc/hGmjGbdw/60.png'] },
  { id: 'health', name: 'HEALTH & WELLNESS', images: ['https://i.postimg.cc/RFsK7LgR/xelanft-bowl-of-fresh-fruits-minimalistic-setting-no-face-see-1e953559-47d3-4f55-8898-f9ab6cd0cf93-0.png', 'https://i.postimg.cc/XNBkfT0B/xelanft_holding_a_healing_stone_minimalistic_setting_no_face__eda9bbb8-1c02-48ac-b63f-ba1466a3c137_0.png', 'https://i.postimg.cc/W1TmPzq0/xelanft_lemon_water_minimalistic_setting_bright_natural_studi_be04fe14-63de-4481-b34c-bbe4846efe44_1.png', 'https://i.postimg.cc/4N9kT6vz/xelanft_smoothie_minimalistic_setting_no_face_seen_bright_na_7b0b8d7f-b7e7-4a41-9ad1-ba0675c0c1c5_3.png', 'https://i.postimg.cc/KzMdXKTm/xelanft_salad_minimalistic_setting_no_face_seen_bright_natur_8e5e24a1-0e0e-4959-b7e7-5e3fb3b41b4a_2.png', 'https://i.postimg.cc/7YpqG3mX/xelanft_exercise_minimalistic_setting_no_face_seen_bright_na_87e48b59-1076-44a0-a5df-6cfe3b0f0dc3_0.png'] },
  { id: 'moody', name: 'MOODY & MODERN', images: ['https://i.postimg.cc/SRz1B39j/100.png', 'https://i.postimg.cc/pVh2VdY5/103.png', 'https://i.postimg.cc/PrnktQ50/112.png', 'https://i.postimg.cc/zfc94nQt/116.png', 'https://i.postimg.cc/1znFrS1g/43.png', 'https://i.postimg.cc/WpMMysFg/39.png'] },
  { id: 'minimal', name: 'MINIMALISTIC', images: ['https://i.postimg.cc/02VLGyr8/1.png', 'https://i.postimg.cc/QCHzNRZp/111.png', 'https://i.postimg.cc/fLhXRX45/176.png', 'https://i.postimg.cc/WzWXZt8C/19.png', 'https://i.postimg.cc/KcqNJk7s/30.png', 'https://i.postimg.cc/2y6xCrYw/27.png'] }
];

export default function SelfieStarterKit() {
  const [selectedModule, setSelectedModule] = useState('module-1');
  const [selectedLesson, setSelectedLesson] = useState('brand-power');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [heroOverlayVisible, setHeroOverlayVisible] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({ 'module-1': true });
  const [selectedAesthetic, setSelectedAesthetic] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Load course progress from backend
  const { data: courseProgress, isLoading } = useQuery({
    queryKey: ['/api/course-progress/starter-kit'],
    enabled: true
  });

  // Load saved notes
  const { data: savedNotes } = useQuery({
    queryKey: ['/api/course-notes/starter-kit'],
    enabled: true
  });

  // Initialize notes and progress from backend data
  useEffect(() => {
    if ((savedNotes as any)?.notes) {
      setNotes((savedNotes as any).notes);
    }
  }, [savedNotes]);

  // Calculate progress from backend data
  const completedLessons = (courseProgress as any)?.completedLessons || {};
  const totalLessons = COURSE_DATA.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedCount = Object.keys(completedLessons).length;
  const progress = (completedCount / totalLessons) * 100;

  // Mutation to mark lesson complete
  const markCompleteMutation = useMutation({
    mutationFn: async ({ moduleId, lessonId }: { moduleId: string; lessonId: string }) => {
      const response = await fetch('/api/course-progress/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: 'starter-kit',
          moduleId,
          lessonId,
          completed: true
        })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/course-progress/starter-kit'] });
      toast({ title: "Progress Saved", description: "Lesson marked complete." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save progress. Please try again." });
    }
  });

  // Mutation to save notes
  const saveNotesMutation = useMutation({
    mutationFn: async (notesData: Record<string, string>) => {
      const response = await fetch('/api/course-notes/starter-kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: notesData })
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Notes Saved", description: "Your notes have been saved." });
    }
  });

  // Enhanced AI generation mutations
  const generateWorkbookMutation = useMutation({
    mutationFn: async ({ templateId, title, moduleId }: { templateId: string; title: string; moduleId: string }) => {
      const response = await fetch('/api/ai/workbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          moduleId,
          workbookType: title,
          userNotes: notes[moduleId] || '',
          selectedAesthetic,
          progressData: completedLessons,
          courseId: 'starter-kit'
        })
      });
      if (!response.ok) {
        throw new Error('Failed to generate workbook');
      }
      return response.json();
    },
    onSuccess: (data: any) => {
      toast({ 
        title: "Workbook Ready!", 
        description: "Download starting..." 
      });
      if (data?.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      }
    },
    onError: (error) => {
      toast({ 
        title: "Generation Failed", 
        description: "Please try again in a moment.",
        variant: "destructive"
      });
    }
  });

  const generateVisualStrategyMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/ai/visual-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: '6724E507-38D0-4C4C-8C2D-CEC891968D73',
          selectedAesthetic,
          brandReflections: notes['module-5'] || '',
          completedModules: Object.keys(completedLessons)
        })
      });
      if (!response.ok) {
        throw new Error('Failed to generate visual strategy');
      }
      return response.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Visual Strategy Ready!",
        description: "Your brand blueprint is downloading..."
      });
      if (data?.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      }
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Please try again in a moment.",
        variant: "destructive"
      });
    }
  });

  const generateCaptionGuideMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/ai/captions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: '25FB2EEB-6366-49D5-82A0-98553DCF4C60',
          writingStyle: notes['module-6'] || '',
          brandVoice: notes['module-1'] || '',
          selectedAesthetic
        })
      });
      if (!response.ok) {
        throw new Error('Failed to generate caption guide');
      }
      return response.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Caption Guide Ready!",
        description: "Your personalized guide is downloading..."
      });
      if (data?.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      }
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Please try again in a moment.",
        variant: "destructive"
      });
    }
  });

  // Mutation to save aesthetic selection
  const saveAestheticMutation = useMutation({
    mutationFn: async (aestheticId: string) => {
      const response = await fetch('/api/course-progress/aesthetic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: 'starter-kit',
          selectedAesthetic: aestheticId
        })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/course-progress/starter-kit'] });
    }
  });

  // Animation effects
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.fade-in-element');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          el.classList.add('visible');
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const markComplete = (moduleId: string, lessonId: string) => {
    markCompleteMutation.mutate({ moduleId, lessonId });
  };

  const generateWorkbook = async (templateId: string, title: string, moduleId: string = 'general') => {
    toast({ title: "Generating...", description: `Creating your ${title}` });
    generateWorkbookMutation.mutate({ templateId, title, moduleId });
  };

  const saveNotes = (moduleId: string, noteText: string) => {
    const updatedNotes = { ...notes, [moduleId]: noteText };
    setNotes(updatedNotes);
    saveNotesMutation.mutate(updatedNotes);
  };

  const handleAestheticSelection = (aestheticId: string) => {
    setSelectedAesthetic(aestheticId);
    saveAestheticMutation.mutate(aestheticId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#171719] mx-auto mb-4"></div>
          <p className="text-[#4C4B4B] font-light">Loading your course...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <style dangerouslySetInnerHTML={{
        __html: `
          .fade-in-element {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .fade-in-element.visible {
            opacity: 1;
            transform: translateY(0);
          }
          .parallax-bg {
            transform: translateY(var(--parallax-offset, 0));
            transition: transform 0.1s linear;
          }
        `
      }} />
      
      <Header />

      {/* Hero Video Section */}
      <section className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <div style={{padding:'56.25% 0 0 0',position:'relative',height:'100%'}}>
            <iframe 
              src="https://player.vimeo.com/video/1091785973?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              style={{position:'absolute',top:'0',left:'0',width:'100%',height:'100%'}}
              title="Welcome To Selfie Starter Kit"
            />
          </div>
        </div>
        
        <div 
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center transition-all duration-1500",
            !heroOverlayVisible && "opacity-0 pointer-events-none"
          )}
        >
          <div className="text-center text-white px-4 sm:px-6 lg:px-8 fade-in-element visible max-w-6xl mx-auto">
            <h1 className="font-['Cormorant_Garamond'] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal mb-4 sm:mb-6 lg:mb-8 tracking-tight leading-tight">
              Welcome to Your Transformation
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-light mb-8 sm:mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed">
              Six Modules to Transform Your Online Presence
            </p>
            <Button 
              onClick={() => setHeroOverlayVisible(false)}
              className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-lg font-medium"
            >
              Start Your Journey
            </Button>
          </div>
        </div>
      </section>

      {/* Progress Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl">Selfie Starter Kit</h2>
              <p className="text-[#4C4B4B] font-light text-sm sm:text-base">
                {completedCount} of {totalLessons} lessons complete
              </p>
            </div>
            <div className="flex-1 max-w-md">
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Sidebar - Course Navigation */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-32 space-y-4">
              <h3 className="font-['Cormorant_Garamond'] text-xl sm:text-2xl mb-6">Course Modules</h3>
              {COURSE_DATA.map((module) => (
                <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full p-4 text-left bg-[#F1F1F1] hover:bg-[#E8E8E8] transition-colors flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-['Cormorant_Garamond'] text-lg font-medium">{module.title}</h4>
                      <p className="text-[#4C4B4B] text-sm font-light">{module.subtitle}</p>
                    </div>
                    {expandedModules[module.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  
                  {expandedModules[module.id] && (
                    <div className="bg-white">
                      {module.lessons.map((lesson) => {
                        const isCompleted = completedLessons[`${module.id}-${lesson.id}`];
                        const isSelected = selectedModule === module.id && selectedLesson === lesson.id;
                        
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => {
                              setSelectedModule(module.id);
                              setSelectedLesson(lesson.id);
                            }}
                            className={cn(
                              "w-full p-4 text-left border-t border-gray-100 hover:bg-gray-50 transition-colors flex items-center gap-3",
                              isSelected && "bg-blue-50 border-blue-200"
                            )}
                          >
                            {isCompleted ? (
                              <CheckCircle className="text-green-600" size={16} />
                            ) : (
                              <Play className="text-[#4C4B4B]" size={16} />
                            )}
                            <div className="flex-1">
                              <p className="font-light">{lesson.title}</p>
                              <p className="text-[#4C4B4B] text-xs flex items-center gap-1">
                                <Clock size={12} />
                                {lesson.duration}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 order-1 lg:order-2 space-y-12">
            
            {/* Module 1: Start Here */}
            {selectedModule === 'module-1' && (
              <div className="space-y-8 fade-in-element">
                <div className="relative h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://i.postimg.cc/fRHzXhYQ/selfie.jpg")'
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white px-4">
                      <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl md:text-5xl mb-4">
                        Your Brand, Your Power
                      </h2>
                      <p className="text-lg sm:text-xl font-light mb-6 max-w-2xl">
                        "Stop dimming your light to make others comfortable. Your brand isn't just what you do—it's who you are when no one's watching."
                      </p>
                    </div>
                  </div>
                </div>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-[#F1F1F1] p-6 sm:p-8">
                  <h4 className="font-['Cormorant_Garamond'] text-2xl mb-4">Brand Foundation Workbook</h4>
                  <p className="text-[#4C4B4B] font-light mb-6">Create your personal brand foundation with AI-guided prompts.</p>
                  <Button 
                    onClick={() => generateWorkbook('BRAND-FOUNDATION-001', 'Brand Foundation Workbook', 'module-1')}
                    disabled={generateWorkbookMutation.isPending}
                    className="w-full bg-[#171719] text-white hover:bg-[#2A2A2A] border-0"
                  >
                    {generateWorkbookMutation.isPending ? 'Generating...' : 'Generate My Foundation Guide'}
                  </Button>
                </Card>

                <div className="bg-[#F1F1F1] p-6 sm:p-8 rounded-lg">
                  <h4 className="font-['Cormorant_Garamond'] text-2xl mb-6">Your Brand Reflection Notes</h4>
                  <Textarea
                    placeholder="What does your brand represent? What makes you unique? Write your thoughts here..."
                    value={notes['module-1'] || ''}
                    onChange={(e) => saveNotes('module-1', e.target.value)}
                    className="min-h-32 border-0 bg-white focus:ring-2 focus:ring-[#171719]"
                  />
                </div>

                <div className="text-center">
                  <Button 
                    onClick={() => markComplete('module-1', 'brand-power')}
                    disabled={markCompleteMutation.isPending}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                  >
                    {completedLessons['module-1-brand-power'] ? 'Completed ✓' : 'Mark Complete'}
                  </Button>
                </div>
              </div>
            )}

            {/* Module 2: Selfie Editing */}
            {selectedModule === 'module-2' && (
              <div className="space-y-8 fade-in-element">
                <div className="relative h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://i.postimg.cc/yxvPTmKT/editing.jpg")'
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white px-4">
                      <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl md:text-5xl mb-4">
                        Edit Like a Pro
                      </h2>
                      <p className="text-lg sm:text-xl font-light mb-6 max-w-2xl">
                        "The goal isn't perfection. It's authenticity with intention. Edit to enhance, not to hide."
                      </p>
                    </div>
                  </div>
                </div>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-[#F1F1F1] to-white p-6 sm:p-8">
                  <h4 className="font-['Cormorant_Garamond'] text-2xl mb-4">Editing Presets Collection</h4>
                  <p className="text-[#4C4B4B] font-light mb-6">Professional editing presets and step-by-step tutorials.</p>
                  <Button 
                    onClick={() => generateWorkbook('EDITING-PRESETS-001', 'Editing Guide', 'module-2')}
                    disabled={generateWorkbookMutation.isPending}
                    className="w-full bg-[#171719] text-white hover:bg-[#2A2A2A] border-0"
                  >
                    {generateWorkbookMutation.isPending ? 'Generating...' : 'Get My Editing Presets'}
                  </Button>
                </Card>

                <div className="bg-[#F1F1F1] p-6 sm:p-8 rounded-lg">
                  <h4 className="font-['Cormorant_Garamond'] text-2xl mb-6">Editing Process Notes</h4>
                  <Textarea
                    placeholder="Note your favorite editing techniques, preset preferences, and workflow tips..."
                    value={notes['module-2'] || ''}
                    onChange={(e) => saveNotes('module-2', e.target.value)}
                    className="min-h-32 border-0 bg-white focus:ring-2 focus:ring-[#171719]"
                  />
                </div>

                <div className="text-center">
                  <Button 
                    onClick={() => markComplete('module-2', selectedLesson)}
                    disabled={markCompleteMutation.isPending}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                  >
                    {completedLessons[`module-2-${selectedLesson}`] ? 'Completed ✓' : 'Mark Complete'}
                  </Button>
                </div>
              </div>
            )}

            {/* Module 3: Smart Edits With Apps */}
            {selectedModule === 'module-3' && (
              <div className="space-y-8 fade-in-element">
                <div className="relative h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://i.postimg.cc/MKsX3Gws/57.png")'
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white px-4">
                      <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl md:text-5xl mb-4">
                        Smart Edits With Apps
                      </h2>
                      <p className="text-lg sm:text-xl font-light mb-6 max-w-2xl">
                        "Technology is your creative partner, not your crutch. Use it to amplify your vision, not replace it."
                      </p>
                    </div>
                  </div>
                </div>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-[#F1F1F1] p-6 sm:p-8">
                  <h4 className="font-['Cormorant_Garamond'] text-2xl mb-4">Advanced App Techniques</h4>
                  <p className="text-[#4C4B4B] font-light mb-6">Master Hypic, CapCut, and other professional editing apps.</p>
                  <Button 
                    onClick={() => generateWorkbook('APP-TECHNIQUES-001', 'App Mastery Guide', 'module-3')}
                    disabled={generateWorkbookMutation.isPending}
                    className="w-full bg-[#171719] text-white hover:bg-[#2A2A2A] border-0"
                  >
                    {generateWorkbookMutation.isPending ? 'Generating...' : 'Get My App Guide'}
                  </Button>
                </Card>

                <div className="bg-[#F1F1F1] p-6 sm:p-8 rounded-lg">
                  <h4 className="font-['Cormorant_Garamond'] text-2xl mb-6">App Workflow Notes</h4>
                  <Textarea
                    placeholder="Document your app workflows, favorite features, and creative techniques..."
                    value={notes['module-3'] || ''}
                    onChange={(e) => saveNotes('module-3', e.target.value)}
                    className="min-h-32 border-0 bg-white focus:ring-2 focus:ring-[#171719]"
                  />
                </div>

                <div className="text-center">
                  <Button 
                    onClick={() => markComplete('module-3', selectedLesson)}
                    disabled={markCompleteMutation.isPending}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                  >
                    {completedLessons[`module-3-${selectedLesson}`] ? 'Completed ✓' : 'Mark Complete'}
                  </Button>
                </div>
              </div>
            )}

            {/* Module 4: Hands-Free Like a CEO */}
            {selectedModule === 'module-4' && (
              <div className="space-y-8 fade-in-element">
                <div className="relative h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://i.postimg.cc/hGmjGbdw/60.png")'
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white px-4">
                      <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl md:text-5xl mb-4">
                        Hands-Free Like a CEO
                      </h2>
                      <p className="text-lg sm:text-xl font-light mb-6 max-w-2xl">
                        "Most people wait for the 'right time' to show up. You? You set the camera, say the word, and start leading. That's CEO energy."
                      </p>
                    </div>
                  </div>
                </div>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-[#F1F1F1] p-6 sm:p-8">
                  <h4 className="font-['Cormorant_Garamond'] text-2xl mb-4">AI Pose Guide Workbook</h4>
                  <p className="text-[#4C4B4B] font-light mb-6">Beginner-to-advanced solo pose prompts for hands-free filming.</p>
                  <Button 
                    onClick={() => generateWorkbook('POSE-GUIDE-001', 'AI Pose Guide Workbook', 'module-4')}
                    disabled={generateWorkbookMutation.isPending}
                    className="w-full bg-[#171719] text-white hover:bg-[#2A2A2A] border-0"
                  >
                    {generateWorkbookMutation.isPending ? 'Generating...' : 'Generate My Pose Guide'}
                  </Button>
                </Card>

                <div className="bg-[#F1F1F1] p-6 sm:p-8 rounded-lg">
                  <h4 className="font-['Cormorant_Garamond'] text-2xl mb-6">Hands-Free Filming Notes</h4>
                  <Textarea
                    placeholder="Note your favorite poses, camera angles, and hands-free techniques..."
                    value={notes['module-4'] || ''}
                    onChange={(e) => saveNotes('module-4', e.target.value)}
                    className="min-h-32 border-0 bg-white focus:ring-2 focus:ring-[#171719]"
                  />
                </div>

                <div className="text-center">
                  <Button 
                    onClick={() => markComplete('module-4', 'hands-free')}
                    disabled={markCompleteMutation.isPending}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                  >
                    {completedLessons['module-4-hands-free'] ? 'Completed ✓' : 'Mark Complete'}
                  </Button>
                </div>
              </div>
            )}

            {/* Module 5: Brand Aesthetic Builder */}
            {selectedModule === 'module-5' && (
              <div className="space-y-8 fade-in-element">
                <div className="relative h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://i.postimg.cc/CK7jK707/3.png")'
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white px-4">
                      <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl md:text-5xl mb-4">
                        Design Like a CEO™
                      </h2>
                      <p className="text-lg sm:text-xl font-light mb-6 max-w-2xl">
                        "Your aesthetic isn't decoration. It's communication. Every color, every texture, every choice tells your story before you say a word."
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 sm:space-y-8">
                  <h4 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl text-center mb-6 sm:mb-8">Brand Aesthetic Collections</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {AESTHETIC_COLLECTIONS.map((collection) => (
                      <div 
                        key={collection.id}
                        onClick={() => handleAestheticSelection(collection.id)}
                        className={cn(
                          "cursor-pointer transition-all duration-300 border-2 rounded-lg overflow-hidden",
                          selectedAesthetic === collection.id ? "border-[#171719] shadow-xl scale-105" : "border-transparent hover:border-[#B5B5B3] hover:shadow-lg"
                        )}
                      >
                        <h5 className="font-['Cormorant_Garamond'] text-lg sm:text-xl lg:text-2xl text-center py-3 sm:py-4 bg-[#F1F1F1]">{collection.name}</h5>
                        <div className="grid grid-cols-3 gap-1">
                          {collection.images.map((img, idx) => (
                            <div key={idx} className="aspect-square">
                              <img 
                                src={img} 
                                alt={`${collection.name} ${idx + 1}`} 
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                          ))}
                        </div>
                        {selectedAesthetic === collection.id && (
                          <div className="bg-[#171719] text-white text-center py-2 text-sm font-medium">
                            ✓ Selected
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-[#F1F1F1] to-white p-6 sm:p-8">
                  <h4 className="font-['Cormorant_Garamond'] text-2xl mb-4">Branding Blueprint Workbook</h4>
                  <p className="text-[#4C4B4B] font-light mb-6">AI will generate your complete visual strategy based on your selected aesthetic.</p>
                  <Button 
                    onClick={() => generateVisualStrategyMutation.mutate()}
                    disabled={!selectedAesthetic || generateVisualStrategyMutation.isPending}
                    className={cn(
                      "w-full border-0",
                      selectedAesthetic ? "bg-[#171719] text-white hover:bg-[#2A2A2A]" : "bg-[#B5B5B3] text-white cursor-not-allowed"
                    )}
                  >
                    {generateVisualStrategyMutation.isPending ? 'Generating...' : 
                     selectedAesthetic ? 'Generate My Branding Blueprint' : 'Select an Aesthetic First'}
                  </Button>
                </Card>

                <div className="bg-[#F1F1F1] p-6 sm:p-8 rounded-lg">
                  <h4 className="font-['Cormorant_Garamond'] text-2xl mb-6">Brand Strategy Notes</h4>
                  <Textarea
                    placeholder="Describe your brand vision, color preferences, and aesthetic goals..."
                    value={notes['module-5'] || ''}
                    onChange={(e) => saveNotes('module-5', e.target.value)}
                    className="min-h-32 border-0 bg-white focus:ring-2 focus:ring-[#171719]"
                  />
                </div>

                <div className="text-center">
                  <Button 
                    onClick={() => markComplete('module-5', 'aesthetic')}
                    disabled={markCompleteMutation.isPending}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                  >
                    {completedLessons['module-5-aesthetic'] ? 'Completed ✓' : 'Mark Complete'}
                  </Button>
                </div>
              </div>
            )}

            {/* Module 6: Captions That Convert */}
            {selectedModule === 'module-6' && (
              <div className="space-y-8 fade-in-element">
                <div className="relative h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://i.postimg.cc/j5kPHjLJ/2.png")'
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white px-4">
                      <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl md:text-5xl mb-4">
                        Captions That Convert
                      </h2>
                      <p className="text-lg sm:text-xl font-light mb-6 max-w-2xl">
                        "Think of your captions like a voice note to your best friend. Don't overthink it. Just tell the truth, make her feel seen, and invite her into something bigger."
                      </p>
                    </div>
                  </div>
                </div>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-[#F1F1F1] p-6 sm:p-8">
                  <h4 className="font-['Cormorant_Garamond'] text-2xl mb-4">Caption Strategy Workbook</h4>
                  <p className="text-[#4C4B4B] font-light mb-6">Generate your personalized caption guide with AI-powered insights.</p>
                  <Button 
                    onClick={() => generateCaptionGuideMutation.mutate()}
                    disabled={generateCaptionGuideMutation.isPending}
                    className="w-full bg-[#171719] text-white hover:bg-[#2A2A2A] border-0"
                  >
                    {generateCaptionGuideMutation.isPending ? 'Generating...' : 'Generate My Caption Guide'}
                  </Button>
                </Card>

                <div className="bg-[#F1F1F1] p-6 sm:p-8 rounded-lg">
                  <h4 className="font-['Cormorant_Garamond'] text-2xl mb-6">Caption Writing Notes</h4>
                  <Textarea
                    placeholder="Note your brand voice, favorite caption styles, and engagement strategies..."
                    value={notes['module-6'] || ''}
                    onChange={(e) => saveNotes('module-6', e.target.value)}
                    className="min-h-32 border-0 bg-white focus:ring-2 focus:ring-[#171719]"
                  />
                </div>

                <div className="text-center">
                  <Button 
                    onClick={() => markComplete('module-6', 'captions')}
                    disabled={markCompleteMutation.isPending}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                  >
                    {completedLessons['module-6-captions'] ? 'Completed ✓' : 'Mark Complete'}
                  </Button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Final Section - Only show when progress is 100% */}
      {progress === 100 && (
        <section className="relative py-20 sm:py-32 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("https://i.postimg.cc/zG12Mqkg/18.png")'
            }}
          />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-['Cormorant_Garamond'] text-4xl sm:text-5xl md:text-6xl text-white mb-8 fade-in-element">
              You Did It, CEO
            </h2>
            <p className="text-xl sm:text-2xl text-white/90 font-light mb-12 max-w-3xl mx-auto fade-in-element">
              You've completed the Selfie Starter Kit. You now have the tools, the confidence, and the strategy to show up authentically online. The world is ready for your vision.
            </p>
            <div className="fade-in-element">
              <Button 
                onClick={() => window.location.href = '/dashboard'}
                className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg font-medium"
              >
                Continue Your Journey
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}