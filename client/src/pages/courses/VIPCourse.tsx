
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Crown, Lock, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { UserAccess, VIPAccessData, VIPProgressData } from '@/types';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';



const EMPIRE_STAGES = [
  {
    id: 1,
    title: 'Welcome Week',
    description: 'Brand foundations + clarity call',
    icon: '👋'
  },
  {
    id: 2,
    title: 'Visibility Strategy',
    description: 'Voxer week + AI brand blueprint',
    icon: '📈'
  },
  {
    id: 3,
    title: 'Monetization Moves',
    description: 'Offer building, strategy call',
    icon: '💰'
  },
  {
    id: 4,
    title: 'Empire Review',
    description: 'Audit, next-step planning',
    icon: '👑'
  }
];

export default function VIPCourse() {
  const [, setLocation] = useLocation();

  // Get user data and access
  const { data: user } = useQuery({ queryKey: ["/api/me"], retry: false });
  const { data: userAccess } = useQuery<UserAccess>({ 
    queryKey: ["/api/user-access"], 
    enabled: !!user, 
    retry: false 
  });

  // Check if user has VIP access
  const hasVIPAccess = userAccess?.vipEmpireBuilder || false;

  // Get VIP progress (only if user has access)
  const { data: progressData } = useQuery<VIPProgressData>({
    queryKey: ['vip-progress'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/vip/progress');
      return response;
    },
    enabled: hasVIPAccess,
  });

  // Create accessData object for consistency with existing code
  const accessData: VIPAccessData = {
    hasAccess: hasVIPAccess,
    isPending: userAccess?.vipApplication === 'pending',
    accessState: hasVIPAccess ? 'accepted' : (userAccess?.vipApplication === 'pending' ? 'pending' : 'locked'),
    message: hasVIPAccess ? 'Welcome to VIP Empire Builder' : 'VIP access required'
  };

  const getCtaButton = () => {
    if (hasVIPAccess) {
      return (
        <Button
          onClick={() => setLocation('/vip/portal')}
          className="bg-transparent border-2 border-[#171719] text-[#171719] hover:bg-[#171719] hover:text-white px-12 py-4 text-base font-normal tracking-wider transition-all duration-300"
          style={{ fontFamily: 'Neue Einstellung, sans-serif', textTransform: 'uppercase' }}
        >
          Enter Your VIP Portal
        </Button>
      );
    } else {
      return (
        <Button
          onClick={() => setLocation('/vip/apply')}
          className="bg-transparent border-2 border-[#171719] text-[#171719] hover:bg-[#171719] hover:text-white px-12 py-4 text-base font-normal tracking-wider transition-all duration-300"
          style={{ fontFamily: 'Neue Einstellung, sans-serif', textTransform: 'uppercase' }}
        >
          Apply for VIP Access
        </Button>
      );
    }
  };

  const getStageStatus = (stageId: number) => {
    if (!progressData) return 'locked';
    if (progressData.completedStages.includes(stageId)) return 'complete';
    if (progressData.currentStage === stageId) return 'in-progress';
    return 'locked';
  };

  const calculateProgress = () => {
    if (!progressData) return 0;
    return (progressData.completedStages.length / EMPIRE_STAGES.length) * 100;
  };

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      <Header />

      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center text-center"
        style={{
          backgroundImage: `url('https://i.postimg.cc/4dBPJ9Cj/95.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-5xl mx-auto px-8">
          <h1 className="text-6xl font-normal text-[#171719] mb-6" style={{ fontFamily: 'Cormorant Garamond, serif', textTransform: 'uppercase' }}>
            VIP Empire Builder
          </h1>
          <p className="text-xl text-[#4C4B4B] mb-12 max-w-3xl mx-auto" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
            Private mentorship. Powerful strategy. Your digital legacy begins here.
          </p>
          {getCtaButton()}
        </div>
      </section>

      {/* Program Experience Overview */}
      <section className="py-20 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light italic text-[#171719] mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Your Empire Building Journey
            </h2>
            <p className="text-lg text-[#4C4B4B] max-w-3xl mx-auto" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
              Personalized mentorship built around confidence, clarity, content creation, and strategic monetization. 
              Transform your brand into an empire-level presence that commands attention and revenue.
            </p>
          </div>

          {/* Progress Tracker - Only visible if user has access */}
          {accessData?.hasAccess && progressData && (
            <div className="mb-16">
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-[#4C4B4B]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Your Progress
                  </span>
                  <span className="text-sm text-[#4C4B4B]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Stage {progressData.currentStage} of {EMPIRE_STAGES.length}
                  </span>
                </div>
                <Progress value={calculateProgress()} className="h-2" />
                <div className="flex justify-between mt-2">
                  {EMPIRE_STAGES.map((stage) => (
                    <div 
                      key={stage.id} 
                      className={`text-xs ${
                        progressData.completedStages.includes(stage.id) 
                          ? 'text-[#171719]' 
                          : 'text-[#B5B5B3]'
                      }`}
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {stage.title}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Empire Stages */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {EMPIRE_STAGES.map((stage) => {
              const status = getStageStatus(stage.id);
              const isBlurred = accessData?.accessState !== 'accepted';
              
              return (
                <Card 
                  key={stage.id} 
                  className={`bg-[#FAFAFA] border border-[#E5E5E5] transition-all duration-300 hover:shadow-lg ${
                    isBlurred ? 'opacity-60' : ''
                  }`}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="text-4xl mb-4">{stage.icon}</div>
                    <CardTitle 
                      className="text-xl text-[#171719] font-light"
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      {stage.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p 
                      className="text-[#4C4B4B] mb-4 text-sm"
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
                    >
                      {stage.description}
                    </p>
                    
                    {/* Status Badge - Only show if user has access */}
                    {accessData?.hasAccess && (
                      <Badge 
                        variant={status === 'complete' ? 'default' : 'secondary'}
                        className={`${
                          status === 'complete' 
                            ? 'bg-[#171719] text-white' 
                            : status === 'in-progress'
                            ? 'bg-[#4C4B4B] text-white'
                            : 'bg-[#B5B5B3] text-white'
                        }`}
                      >
                        {status === 'complete' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {status === 'in-progress' && <Clock className="w-3 h-3 mr-1" />}
                        {status === 'locked' && <Lock className="w-3 h-3 mr-1" />}
                        {status === 'complete' ? 'Complete' : status === 'in-progress' ? 'In Progress' : 'Locked'}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Access State Overlay */}
          {accessData?.accessState === 'pending' && (
            <div className="mt-16 text-center">
              <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg p-8 max-w-2xl mx-auto">
                <Crown className="w-12 h-12 text-[#B5B5B3] mx-auto mb-4" />
                <h3 className="text-2xl font-light text-[#171719] mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  Application Under Review
                </h3>
                <p className="text-[#4C4B4B]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
                  Thank you for applying to Empire Builder VIP. Sandra is reviewing your application 
                  and will be in touch within 48 hours with next steps.
                </p>
              </div>
            </div>
          )}

          {accessData?.accessState === 'locked' && (
            <div className="mt-16 text-center">
              <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg p-8 max-w-2xl mx-auto">
                <Crown className="w-12 h-12 text-[#4C4B4B] mx-auto mb-4" />
                <h3 className="text-2xl font-light text-[#171719] mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  Ready to Build Your Empire?
                </h3>
                <p className="text-[#4C4B4B] mb-6" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
                  VIP Empire Builder is an exclusive mentorship program for women ready to transform 
                  their personal brand into a powerful business empire. Apply now to begin your journey.
                </p>
                <Button
                  onClick={() => setLocation('/vip/apply')}
                  className="bg-[#171719] text-white hover:bg-[#4C4B4B] px-8 py-3 text-base font-normal transition-all duration-300"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Apply for VIP Access <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Sticky CTA Footer - Only show for non-accepted users */}
      {accessData?.accessState !== 'accepted' && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#171719] text-white p-4 shadow-lg z-50">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <h4 className="font-medium" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Ready to Build Your Empire?
              </h4>
              <p className="text-sm text-white/80" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
                {accessData?.accessState === 'pending' 
                  ? 'Your application is under review' 
                  : 'Apply for exclusive VIP mentorship'}
              </p>
            </div>
            {getCtaButton()}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
