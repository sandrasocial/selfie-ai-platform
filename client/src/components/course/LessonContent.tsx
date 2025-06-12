
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface LessonContentProps {
  selectedLessonData: any;
  isLessonComplete: (moduleId: string, lessonId: string) => boolean;
  onMarkComplete: (moduleId: string, lessonId: string) => void;
  isMarkingComplete?: boolean;
}

export function LessonContent({ 
  selectedLessonData, 
  isLessonComplete, 
  onMarkComplete, 
  isMarkingComplete 
}: LessonContentProps) {
  if (!selectedLessonData) {
    return (
      <Card className="bg-white border border-[#B5B5B3] shadow-none">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 bg-[#4C4B4B] mx-auto mb-8"></div>
          <h2 className="text-3xl mb-6 text-[#171719]" style={{ fontFamily: 'Cormorant Garamond' }}>
            Welcome to Your Glow-Up Era
          </h2>
          <p className="text-[#4C4B4B] mb-12 font-light leading-relaxed text-lg">
            This is about more than just selfies. It's about how you see yourself.
          </p>
          <div className="bg-[#F1F1F1] p-8 border border-[#B5B5B3]">
            <h3 className="text-xl mb-6 text-[#171719]" style={{ fontFamily: 'Cormorant Garamond' }}>
              Your Transformation Journey:
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="text-center">
                <div className="text-lg text-[#171719] mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>
                  Welcome + Mindset
                </div>
                <div className="text-[#4C4B4B] font-light">Foundation</div>
              </div>
              <div className="text-center">
                <div className="text-lg text-[#171719] mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>
                  Editing Masterclass
                </div>
                <div className="text-[#4C4B4B] font-light">Skills</div>
              </div>
              <div className="text-center">
                <div className="text-lg text-[#171719] mb-2" style={{ fontFamily: 'Cormorant Garamond' }}>
                  Tools Hub
                </div>
                <div className="text-[#4C4B4B] font-light">Resources</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-[#B5B5B3] shadow-none">
      <CardContent className="p-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Badge className="mb-4 bg-[#4C4B4B] text-white px-3 py-1 font-light border-0 capitalize">
              {selectedLessonData.moduleId}
            </Badge>
            <h2 className="text-3xl text-[#171719]" style={{ fontFamily: 'Cormorant Garamond' }}>
              {selectedLessonData.title}
            </h2>
          </div>
          {isLessonComplete(selectedLessonData.moduleId, selectedLessonData.lessonId) ? (
            <Badge className="bg-[#F1F1F1] text-[#171719] border border-[#171719] px-4 py-2 font-light">
              Complete
            </Badge>
          ) : (
            <Button
              onClick={() => onMarkComplete(selectedLessonData.moduleId, selectedLessonData.lessonId)}
              disabled={isMarkingComplete}
              className="bg-[#171719] text-white hover:bg-[#4C4B4B] border-0 px-6 py-2 font-light"
            >
              Mark Complete
            </Button>
          )}
        </div>

        <p className="text-[#4C4B4B] mb-12 leading-relaxed font-light text-lg">
          {selectedLessonData.description}
        </p>

        {/* Video Content */}
        {selectedLessonData.videoUrl && (
          <div className="mb-12">
            <h3 className="text-xl mb-6 text-[#171719]" style={{ fontFamily: 'Cormorant Garamond' }}>
              Video Lesson
            </h3>
            <div className="aspect-video bg-[#171719] flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-white mb-6 mx-auto flex items-center justify-center">
                  <div className="w-0 h-0 border-l-8 border-r-0 border-t-8 border-b-8 border-l-[#171719] border-t-transparent border-b-transparent ml-2"></div>
                </div>
                <p className="text-white font-light text-lg">Video content will be embedded here</p>
                <p className="text-[#B5B5B3] text-sm mt-3 font-light">{selectedLessonData.videoUrl}</p>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Checklist */}
        {selectedLessonData.moduleId === "welcome" && (
          <div className="bg-[#F1F1F1] p-8 border border-[#B5B5B3] mb-12">
            <h3 className="text-xl mb-6 text-[#171719]" style={{ fontFamily: 'Cormorant Garamond' }}>
              Your Action Checklist
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-5 h-5 bg-[#171719]"></div>
                <span className="text-[#4C4B4B] font-light">Watch welcome video</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-5 h-5 border-2 border-[#171719]"></div>
                <span className="text-[#4C4B4B] font-light">Answer Sandra AI: "What's your confidence blocker?"</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-5 h-5 border-2 border-[#171719]"></div>
                <span className="text-[#4C4B4B] font-light">Get 5-step AI action plan</span>
              </div>
            </div>
          </div>
        )}

        {/* PDF/Resource Content */}
        {selectedLessonData.pdfUrl && (
          <div className="border border-[#B5B5B3] p-8 mb-12 bg-[#F1F1F1]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-8 bg-[#171719] flex items-center justify-center">
                <div className="w-4 h-5 bg-white"></div>
              </div>
              <h3 className="text-xl text-[#171719]" style={{ fontFamily: 'Cormorant Garamond' }}>
                Downloadable Resource
              </h3>
            </div>
            <Button className="bg-[#171719] text-white hover:bg-[#4C4B4B] border-0 px-8 py-3 font-light">
              <a href={selectedLessonData.pdfUrl} download>
                Download PDF
              </a>
            </Button>
          </div>
        )}

        {/* Implementation Guide */}
        <div className="bg-[#4C4B4B] p-8">
          <h3 className="text-xl mb-6 text-white" style={{ fontFamily: 'Cormorant Garamond' }}>
            Implementation Guide
          </h3>
          <div className="space-y-4 text-sm text-white font-light">
            <p>• Watch the complete video lesson</p>
            <p>• Complete all action items in your checklist</p>
            <p>• Apply the strategies to your personal brand</p>
            <p>• Mark lesson as complete when finished</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
