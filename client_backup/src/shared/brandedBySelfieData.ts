export interface CourseModule {
  id: number;
  title: string;
  description: string;
  lessons: CourseLesson[];
  duration: string;
}

export interface CourseLesson {
  id: number;
  title: string;
  description: string;
  videoUrl?: string;
  duration: string;
  type: 'video' | 'text' | 'assignment';
  content?: string;
}

export const brandedBySelfieModules: CourseModule[] = [
  {
    id: 1,
    title: "Foundation: Your Brand DNA",
    description: "Discover your authentic voice and establish your brand foundation",
    duration: "2 hours",
    lessons: [
      {
        id: 1,
        title: "Discovering Your Authentic Voice",
        description: "Learn to identify and articulate your unique brand voice",
        videoUrl: "/assets/courses/branded/module-1-lesson-1.mp4",
        duration: "25 minutes",
        type: "video"
      },
      {
        id: 2,
        title: "Brand Values & Mission",
        description: "Define your core values and mission statement",
        videoUrl: "/assets/courses/branded/module-1-lesson-2.mp4",
        duration: "30 minutes",
        type: "video"
      }
    ]
  },
  {
    id: 2,
    title: "Visual Identity Mastery",
    description: "Create a cohesive visual brand that stands out",
    duration: "3 hours",
    lessons: [
      {
        id: 1,
        title: "Color Psychology for Personal Brands",
        description: "Understanding how colors impact your brand perception",
        videoUrl: "/assets/courses/branded/module-2-lesson-1.mp4",
        duration: "35 minutes",
        type: "video"
      },
      {
        id: 2,
        title: "Typography & Visual Consistency",
        description: "Selecting fonts and maintaining visual consistency",
        videoUrl: "/assets/courses/branded/module-2-lesson-2.mp4",
        duration: "28 minutes",
        type: "video"
      }
    ]
  },
  {
    id: 3,
    title: "Content Strategy & Execution",
    description: "Master content creation and strategic planning",
    duration: "4 hours",
    lessons: [
      {
        id: 1,
        title: "Content Pillars Framework",
        description: "Build a sustainable content strategy",
        videoUrl: "/assets/courses/branded/module-3-lesson-1.mp4",
        duration: "40 minutes",
        type: "video"
      }
    ]
  }
];

export const courseMetadata = {
  title: "Branded by Selfie™",
  description: "The complete personal branding transformation system",
  price: 397,
  currency: "USD",
  totalDuration: "9+ hours",
  modules: brandedBySelfieModules.length,
  lessons: brandedBySelfieModules.reduce((total, module) => total + module.lessons.length, 0)
};

export const BRANDED_BY_SELFIE_COURSE = {
  modules: brandedBySelfieModules,
  metadata: courseMetadata
};

export type BrandedModule = CourseModule;
export type BrandedLesson = CourseLesson;

export const AI_TOOLS = [
  {
    id: 'strategy-generator',
    name: 'Strategy Generator',
    description: 'Generate personalized branding strategies',
    icon: 'Target'
  },
  {
    id: 'content-generator',
    name: 'Content Generator',
    description: 'Create engaging content ideas',
    icon: 'FileText'
  },
  {
    id: 'sandra-ai',
    name: 'Sandra AI',
    description: 'Personal branding coach',
    icon: 'MessageSquare'
  }
];