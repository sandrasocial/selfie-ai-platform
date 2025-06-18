
import { Card, CardContent } from "@/components/ui/card";

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: any[];
}

interface LessonNavigationProps {
  modules: Module[];
  selectedLesson: string | null;
  onLessonSelect: (lessonId: string) => void;
  isLessonComplete: (moduleId: string, lessonId: string) => boolean;
}

export function LessonNavigation({ 
  modules, 
  selectedLesson, 
  onLessonSelect, 
  isLessonComplete 
}: LessonNavigationProps) {
  return (
    <Card className="bg-white border border-[#B5B5B3] shadow-none">
      <CardContent className="p-8">
        <h2 className="text-2xl mb-8 text-[#171719]" style={{ fontFamily: 'Cormorant Garamond' }}>
          Course Content
        </h2>
        <div className="space-y-8">
          {modules.map((module) => (
            <div key={module.id}>
              <div className="mb-6">
                <h3 className="text-lg mb-2 text-[#171719]" style={{ fontFamily: 'Cormorant Garamond' }}>
                  {module.title}
                </h3>
                <p className="text-sm text-[#4C4B4B] font-light">{module.description}</p>
                <p className="text-xs text-[#B5B5B3] mt-2">
                  {module.lessons.length} lessons
                </p>
              </div>
              <div className="space-y-3">
                {module.lessons.map((lesson: any) => (
                  <button
                    key={`${lesson.moduleId}-${lesson.lessonId}`}
                    onClick={() => onLessonSelect(`${lesson.moduleId}-${lesson.lessonId}`)}
                    className={`w-full text-left p-4 border transition-colors ${
                      selectedLesson === `${lesson.moduleId}-${lesson.lessonId}`
                        ? 'border-[#171719] bg-[#F1F1F1]'
                        : 'border-[#B5B5B3] hover:border-[#4C4B4B] bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {lesson.videoUrl ? (
                          <div className="w-6 h-6 bg-[#171719] flex items-center justify-center">
                            <div className="w-0 h-0 border-l-3 border-r-0 border-t-3 border-b-3 border-l-white border-t-transparent border-b-transparent ml-1"></div>
                          </div>
                        ) : (
                          <div className="w-6 h-6 bg-[#171719] flex items-center justify-center">
                            <div className="w-3 h-4 bg-white"></div>
                          </div>
                        )}
                        <span className="text-sm font-light text-[#171719]">{lesson.title}</span>
                      </div>
                      {isLessonComplete(lesson.moduleId, lesson.lessonId) && (
                        <div className="w-5 h-5 bg-[#171719]"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
