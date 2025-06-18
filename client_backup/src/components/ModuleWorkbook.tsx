import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, Sparkles, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface WorkbookResponse {
  title: string;
  personalizedStrategy: string;
  actionItems: string[];
  customFrameworks: string[];
  implementationPlan: string;
  phase30?: string;
  phase60?: string;
  phase90?: string;
  keyInsights: string[];
}

interface ModuleWorkbookProps {
  moduleId: number;
  moduleTitle: string;
  onClose: () => void;
  savedWorkbookId?: number | null;
  prefilledAnswers?: Record<string, string>;
}

export default function ModuleWorkbook({ moduleId, moduleTitle, onClose, savedWorkbookId, prefilledAnswers }: ModuleWorkbookProps) {
  const [questions, setQuestions] = useState<string[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>(() => {
    // Load saved responses from localStorage on component mount
    const saved = localStorage.getItem(`workbook_responses_${moduleId}`);
    return saved ? JSON.parse(saved) : {};
  });
  const [userProfile, setUserProfile] = useState(() => {
    // Load saved profile from localStorage or use defaults
    const saved = localStorage.getItem('user_profile');
    return saved ? JSON.parse(saved) : {
      name: "",
      business: "",
      audience: "",
      currentFollowers: "",
      goals: "",
    };
  });
  const [workbook, setWorkbook] = useState<WorkbookResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [step, setStep] = useState<"questions" | "workbook">("questions");
  const { toast } = useToast();

  // Auto-save responses when they change
  useEffect(() => {
    if (Object.keys(responses).length > 0) {
      localStorage.setItem(`workbook_responses_${moduleId}`, JSON.stringify(responses));
    }
  }, [responses, moduleId]);

  // Auto-save user profile when it changes
  useEffect(() => {
    if (userProfile.name || userProfile.business) {
      localStorage.setItem('user_profile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  useEffect(() => {
    // Only fetch questions, never auto-generate workbooks
    fetchQuestions();
    
    // Load authenticated user data
    fetchUserProfile();
    
    // Load saved workbook ONLY if it exists and user explicitly requests it
    if (savedWorkbookId && step === "workbook") {
      loadSavedWorkbook();
    }
  }, [moduleId]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/me');
      if (response.ok) {
        const userData = await response.json();
        setUserProfile({
          name: userData.firstName || userData.name || "Sandra",
          business: "Personal Brand",
          audience: "Women Entrepreneurs",
          currentFollowers: "Growing",
          goals: "Build Authority & Influence"
        });
      }
    } catch (error) {
      console.log('Using default profile');
    }
  };

  const loadSavedWorkbook = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/workbooks/${savedWorkbookId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to load workbook: ${response.status}`);
      }
      
      const savedData = await response.json();
      console.log("Received workbook data:", savedData);
      
      // Create safe defaults and handle any data format
      const workbookData: WorkbookResponse = {
        title: savedData.title || `${moduleTitle} Strategic Guide`,
        personalizedStrategy: savedData.personalizedStrategy || "",
        actionItems: Array.isArray(savedData.actionItems) ? savedData.actionItems : 
                    typeof savedData.actionItems === 'string' && savedData.actionItems.startsWith('[') ? 
                    JSON.parse(savedData.actionItems) : 
                    savedData.actionItems ? [savedData.actionItems] : 
                    ["Review your strategic frameworks", "Implement your custom action plan"],
        customFrameworks: Array.isArray(savedData.customFrameworks) ? savedData.customFrameworks :
                         typeof savedData.customFrameworks === 'string' && savedData.customFrameworks.startsWith('[') ? 
                         JSON.parse(savedData.customFrameworks) : 
                         savedData.customFrameworks ? [savedData.customFrameworks] :
                         ["Your personalized framework is ready", "Custom strategies preserved"],
        implementationPlan: savedData.implementationPlan || "Your implementation plan is available in this workbook",
        keyInsights: Array.isArray(savedData.keyInsights) ? savedData.keyInsights :
                    typeof savedData.keyInsights === 'string' && savedData.keyInsights.startsWith('[') ? 
                    JSON.parse(savedData.keyInsights) : 
                    savedData.keyInsights ? [savedData.keyInsights] :
                    ["Your workbook insights are preserved", "Strategic guidance ready for implementation"]
      };
      
      setWorkbook(workbookData);
      setStep("workbook");
      
      toast({
        title: "Success!",
        description: "Your workbook has been loaded successfully.",
      });
    } catch (error: any) {
      console.error("Error loading saved workbook:", error);
      toast({
        title: "Error",
        description: "Failed to load your saved workbook. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await apiRequest("GET", `/api/workbook/questions/${moduleId}?v=${Date.now()}`);
      const data = await response.json();
      setQuestions(data.questions);
      
      // Load saved responses from localStorage first
      const savedResponses = localStorage.getItem(`workbook_responses_${moduleId}`);
      let initialResponses: Record<string, string> = {};
      
      if (savedResponses) {
        try {
          initialResponses = JSON.parse(savedResponses);
        } catch (error) {
          console.log('Could not parse saved responses');
        }
      }
      
      // Override with prefilled answers if provided
      data.questions.forEach((question: string) => {
        if (!initialResponses[question]) {
          initialResponses[question] = prefilledAnswers?.[question] || "";
        }
      });
      setResponses(initialResponses);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load workbook questions",
        variant: "destructive",
      });
    }
  };

  const handleProfileSubmit = () => {
    if (!userProfile.name || !userProfile.business) {
      toast({
        title: "Profile Required",
        description: "Please fill in your name and business to continue",
        variant: "destructive",
      });
      return;
    }
    setStep("questions");
  };

  const handleResponseChange = (question: string, value: string) => {
    const updatedResponses = {
      ...responses,
      [question]: value
    };
    setResponses(updatedResponses);
    
    // Auto-save each response immediately
    localStorage.setItem(`module${moduleId}-question-${questions.indexOf(question) + 1}`, value);
    localStorage.setItem(`workbook_responses_${moduleId}`, JSON.stringify(updatedResponses));
  };

  const generateWorkbook = async () => {
    // Check if all questions are answered
    const unansweredQuestions = questions.filter(q => !responses[q]?.trim());
    if (unansweredQuestions.length > 0) {
      toast({
        title: "Complete All Questions",
        description: "Please answer all questions to generate your personalized workbook",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);
    
    try {
      // Use actual authenticated user data instead of hardcoded fallback
      const actualProfile = {
        name: userProfile.name || "Sandra",
        business: userProfile.business || "Personal Brand",
        audience: userProfile.audience || "Women Entrepreneurs",
        currentFollowers: userProfile.currentFollowers || "Growing",
        goals: userProfile.goals || "Build Authority & Influence"
      };

      const response = await apiRequest("POST", "/api/workbook/generate", {
        moduleId,
        responses,
        userProfile: actualProfile,
      });
      
      if (!response.ok) {
        throw new Error(`Generation failed with status ${response.status}`);
      }
      
      const workbookData = await response.json();
      setWorkbook(workbookData);
      setStep("workbook");
      
      // Save workbook to user's collection
      try {
        await apiRequest("POST", "/api/workbook/save", {
          moduleId,
          moduleTitle: moduleTitle,
          workbook: workbookData,
          userProfile: actualProfile,
          responses,
        });
      } catch (saveError) {
        console.error("Failed to save workbook:", saveError);
        // Don't block the user experience if saving fails
      }
      
      toast({
        title: "Framework Plan Generated!",
        description: "Your personalized framework mastery plan is ready and saved to your collection",
      });
    } catch (error: any) {
      console.error("Workbook generation error:", error);
      setGenerationError(error.message || "Something went wrong during generation");
      
      toast({
        title: "Sandra needs a quick coffee break ☕",
        description: "Try again in a moment or refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const retryGeneration = () => {
    setGenerationError(null);
    generateWorkbook();
  };

  const downloadPDF = async () => {
    if (!workbook) return;
    
    setIsLoading(true);
    try {
      const actualProfile = {
        name: userProfile.name || "Entrepreneur",
        business: userProfile.business || "Personal Brand",
        audience: userProfile.audience || "Women Entrepreneurs", 
        currentFollowers: userProfile.currentFollowers || "Growing",
        goals: userProfile.goals || "Build Authority & Influence"
      };

      const response = await apiRequest("POST", "/api/workbook/pdf", {
        workbook,
        userProfile: actualProfile,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `${actualProfile.name}_SELFIE_Workbook.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "Download Complete!",
          description: "Your personalized workbook has been downloaded",
        });
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#3C3A35]">AI Framework Mastery Workbook</h2>
              <p className="text-gray-600">{moduleTitle}</p>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>



          {step === "questions" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-black" />
                  Your Story-Based Positioning Blueprint
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600">
                  Your story answers are ready! Click generate to create your personalized positioning workbook based entirely on your real transformation.
                </p>
                
                {questions.map((question, index) => (
                  <div key={index} className="space-y-2">
                    <Label className="text-[#3C3A35] font-medium">
                      {index + 1}. {question}
                    </Label>
                    <Textarea
                      value={responses[question] || ""}
                      onChange={(e) => handleResponseChange(question, e.target.value)}
                      placeholder="Share your thoughts..."
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                ))}
                
                <div className="space-y-3">
                  <Button 
                    onClick={generateWorkbook} 
                    disabled={isGenerating}
                    className="w-full bg-black text-white hover:bg-gray-200 hover:text-black font-['Prata'] rounded-xl transition-colors duration-200"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        Creating Your Positioning Blueprint...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate My Story-Based Blueprint
                      </>
                    )}
                  </Button>
                  
                  {generationError && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        <span className="text-gray-800 font-medium">Sandra needs a quick coffee break ☕</span>
                      </div>
                      <p className="text-gray-700 text-sm mb-3">
                        Try again in a moment - sometimes the magic takes a second try!
                      </p>
                      <Button 
                        onClick={retryGeneration}
                        disabled={isGenerating}
                        variant="outline"
                        className="w-full border-red-200 text-red-700 hover:bg-red-50"
                      >
                        {isGenerating ? (
                          <>
                            <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                            Trying again...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Try Again with Sandra
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {step === "workbook" && workbook && (
            <div className="space-y-8">
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-black mx-auto mb-6" />
                <h3 className="font-['Prata'] text-4xl font-normal text-black mb-4">From Broken to Bold</h3>
                <p className="text-gray-600 text-lg mb-8">Your story-based positioning workbook is ready. This is your roadmap from struggle to strength.</p>
                
                <Button 
                  onClick={downloadPDF} 
                  disabled={isLoading}
                  className="bg-black text-white hover:bg-gray-200 hover:text-black font-['Prata'] px-8 py-4 rounded-xl transition-colors duration-200 text-lg"
                >
                  {isLoading ? (
                    <>
                      <Download className="h-5 w-5 mr-3 animate-bounce" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5 mr-3" />
                      Download My Workbook 🖤
                    </>
                  )}
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#3C3A35]">
                    <Sparkles className="h-5 w-5" />
                    FROM BROKEN TO BOLD: Your Story-Based Positioning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {workbook.personalizedStrategy}
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#3C3A35]">
                      <CheckCircle className="h-5 w-5" />
                      Immediate Action Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {workbook.actionItems.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="bg-[#3C3A35] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#3C3A35]">
                      <FileText className="h-5 w-5" />
                      Key Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {workbook.keyInsights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-[#3C3A35] mt-1">•</span>
                          <span className="text-gray-700">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {workbook.customFrameworks.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#3C3A35]">Your Custom Frameworks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {workbook.customFrameworks.map((framework, index) => {
                        // Parse framework if it's a JSON string
                        let frameworkData;
                        try {
                          frameworkData = typeof framework === 'string' ? JSON.parse(framework) : framework;
                        } catch {
                          frameworkData = { description: framework };
                        }

                        return (
                          <div key={index} className="p-4 bg-gray-50 rounded-lg border-l-4 border-[#3C3A35]">
                            {frameworkData.name && (
                              <h4 className="font-semibold text-[#3C3A35] mb-2">{frameworkData.name}</h4>
                            )}
                            {frameworkData.description && (
                              <p className="text-gray-700 mb-3">{frameworkData.description}</p>
                            )}
                            {frameworkData.steps && Array.isArray(frameworkData.steps) && (
                              <div className="mb-3">
                                <p className="font-medium text-gray-800 mb-2">Steps:</p>
                                <ol className="space-y-1 pl-4">
                                  {frameworkData.steps.map((step, stepIndex) => (
                                    <li key={stepIndex} className="text-gray-700 text-sm">
                                      <span className="font-medium text-[#3C3A35]">{stepIndex + 1}.</span> {step}
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            )}
                            {frameworkData.implementationNotes && (
                              <div className="mt-3 p-3 bg-amber-50 rounded border-l-2 border-amber-300">
                                <p className="text-xs font-medium text-amber-800 mb-1">Implementation Notes:</p>
                                <p className="text-amber-700 text-sm">{frameworkData.implementationNotes}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-[#3C3A35]">30-60-90 Day Implementation Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Debug logging */}
                    {(() => {
                      console.log("DEBUG - workbook.phase30:", workbook.phase30);
                      console.log("DEBUG - workbook.phase60:", workbook.phase60);
                      console.log("DEBUG - workbook.phase90:", workbook.phase90);
                      console.log("DEBUG - full workbook object:", workbook);
                      return null;
                    })()}
                    
                    {/* Display actual AI-generated phase content */}
                    {workbook.phase30 && (
                      <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-[#3C3A35]">
                        <h4 className="font-semibold text-[#3C3A35] mb-2">First 30 Days</h4>
                        <p className="text-gray-700">{workbook.phase30}</p>
                      </div>
                    )}
                    {workbook.phase60 && (
                      <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                        <h4 className="font-semibold text-[#3C3A35] mb-2">Next 30 Days</h4>
                        <p className="text-gray-700">{workbook.phase60}</p>
                      </div>
                    )}
                    {workbook.phase90 && (
                      <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-gray-600">
                        <h4 className="font-semibold text-[#3C3A35] mb-2">Final 30 Days</h4>
                        <p className="text-gray-700">{workbook.phase90}</p>
                      </div>
                    )}
                    
                    {/* Fallback to implementation plan if phases not available */}
                    {!workbook.phase30 && !workbook.phase60 && !workbook.phase90 && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-700 whitespace-pre-line">
                          {typeof workbook.implementationPlan === 'string' 
                            ? workbook.implementationPlan 
                            : "Your personalized 30-60-90 day implementation plan will be detailed here."}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}