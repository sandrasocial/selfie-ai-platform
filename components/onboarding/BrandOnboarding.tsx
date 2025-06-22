'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Checkbox } from '@/app/components/ui/checkbox';
import { ChevronRight, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BrandOnboardingProps {
  onComplete?: () => void;
  userId?: string;
}

interface FormData {
  brand_mission: string;
  ideal_audience: string;
  brand_values: string;
  key_phrases: string;
  hashtags: string;
  visual_aesthetic: string;
  content_focus: string[];
  tone_voice: string;
  industry: string;
  experience_level: string;
  main_goals: string;
}

export default function BrandOnboarding({ onComplete, userId }: BrandOnboardingProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    brand_mission: '',
    ideal_audience: '',
    brand_values: '',
    key_phrases: '',
    hashtags: '',
    visual_aesthetic: '',
    content_focus: [],
    tone_voice: '',
    industry: '',
    experience_level: '',
    main_goals: ''
  });

  const totalSteps = 4;

  const visualAestheticOptions = [
    'Minimalistic & Clean',
    'Moody & Modern', 
    'Bright & Energetic',
    'Luxury Editorial',
    'Warm & Approachable',
    'Bold & Confident',
    'Soft & Feminine',
    'Dark & Dramatic'
  ];

  const contentFocusOptions = [
    'Personal Branding',
    'Business Strategy',
    'Lifestyle Content',
    'Behind the Scenes',
    'Educational Content',
    'Product Showcases',
    'Client Testimonials',
    'Industry Insights'
  ];

  const toneVoiceOptions = [
    'Professional & Authoritative',
    'Friendly & Approachable',
    'Inspirational & Motivating',
    'Casual & Conversational',
    'Luxury & Sophisticated',
    'Warm & Nurturing',
    'Bold & Confident',
    'Authentic & Vulnerable'
  ];

  const industryOptions = [
    'Health & Wellness',
    'Business Coaching',
    'Creative Services',
    'E-commerce',
    'Real Estate',
    'Finance & Investing',
    'Technology',
    'Fashion & Beauty',
    'Food & Lifestyle',
    'Education',
    'Other'
  ];

  const experienceLevelOptions = [
    'Just Starting Out',
    'Growing My Following',
    'Established Creator',
    'Business Owner'
  ];

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContentFocusChange = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      content_focus: checked 
        ? [...prev.content_focus, value]
        : prev.content_focus.filter(item => item !== value)
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/onboarding/brand-hub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          profileData: formData,
          onboardingStep: currentStep 
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        if (onComplete) {
          onComplete();
        } else {
          router.push('/dashboard');
        }
      } else {
        console.error('Onboarding failed:', data.error);
      }
    } catch (error) {
      console.error('Error submitting onboarding:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h1 
                className="text-4xl font-light mb-4"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: '#171719' }}
              >
                Let's Build Your Brand Foundation
              </h1>
              <p 
                className="text-lg"
                style={{ color: '#4C4B4B', fontFamily: 'Inter, sans-serif' }}
              >
                Tell me about your mission and who you're here to serve
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="mission" className="text-sm font-medium mb-3 block">
                  What's your brand mission? What are you here to do?
                </Label>
                <Textarea
                  id="mission"
                  value={formData.brand_mission}
                  onChange={(e) => handleInputChange('brand_mission', e.target.value)}
                  placeholder="Share your purpose, passion, and what drives you..."
                  className="h-32 resize-none"
                />
              </div>

              <div>
                <Label htmlFor="audience" className="text-sm font-medium mb-3 block">
                  Who is your ideal audience? Describe them in detail.
                </Label>
                <Textarea
                  id="audience"
                  value={formData.ideal_audience}
                  onChange={(e) => handleInputChange('ideal_audience', e.target.value)}
                  placeholder="Think about their demographics, interests, challenges, and dreams..."
                  className="h-32 resize-none"
                />
              </div>

              <div>
                <Label htmlFor="values" className="text-sm font-medium mb-3 block">
                  What are your core brand values?
                </Label>
                <Textarea
                  id="values"
                  value={formData.brand_values}
                  onChange={(e) => handleInputChange('brand_values', e.target.value)}
                  placeholder="The principles and beliefs that guide everything you do..."
                  className="h-32 resize-none"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h1 
                className="text-4xl font-light mb-4"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: '#171719' }}
              >
                Your Voice & Language
              </h1>
              <p 
                className="text-lg"
                style={{ color: '#4C4B4B', fontFamily: 'Inter, sans-serif' }}
              >
                Define how you communicate with your audience
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Key phrases that represent your brand
                </Label>
                <Textarea
                  value={formData.key_phrases}
                  onChange={(e) => handleInputChange('key_phrases', e.target.value)}
                  placeholder="Words and phrases you want to be known for..."
                  className="h-24 resize-none"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Your signature hashtags
                </Label>
                <Input
                  value={formData.hashtags}
                  onChange={(e) => handleInputChange('hashtags', e.target.value)}
                  placeholder="#yourbrand #yourmovement #yourmessage"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">
                  What's your tone of voice?
                </Label>
                <RadioGroup 
                  value={formData.tone_voice} 
                  onValueChange={(value) => handleInputChange('tone_voice', value)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {toneVoiceOptions.map((tone) => (
                      <div key={tone} className="flex items-center space-x-2">
                        <RadioGroupItem value={tone} id={tone} />
                        <Label htmlFor={tone} className="text-sm cursor-pointer">
                          {tone}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h1 
                className="text-4xl font-light mb-4"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: '#171719' }}
              >
                Visual Identity & Content
              </h1>
              <p 
                className="text-lg"
                style={{ color: '#4C4B4B', fontFamily: 'Inter, sans-serif' }}
              >
                Define your aesthetic and content strategy
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  What's your visual aesthetic?
                </Label>
                <RadioGroup 
                  value={formData.visual_aesthetic} 
                  onValueChange={(value) => handleInputChange('visual_aesthetic', value)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {visualAestheticOptions.map((aesthetic) => (
                      <div key={aesthetic} className="flex items-center space-x-2">
                        <RadioGroupItem value={aesthetic} id={aesthetic} />
                        <Label htmlFor={aesthetic} className="text-sm cursor-pointer">
                          {aesthetic}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">
                  What types of content do you focus on? (Select all that apply)
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {contentFocusOptions.map((focus) => (
                    <div key={focus} className="flex items-center space-x-2">
                      <Checkbox
                        id={focus}
                        checked={formData.content_focus.includes(focus)}
                        onCheckedChange={(checked) => handleContentFocusChange(focus, checked as boolean)}
                      />
                      <Label htmlFor={focus} className="text-sm cursor-pointer">
                        {focus}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h1 
                className="text-4xl font-light mb-4"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: '#171719' }}
              >
                Your Journey & Goals
              </h1>
              <p 
                className="text-lg"
                style={{ color: '#4C4B4B', fontFamily: 'Inter, sans-serif' }}
              >
                Tell me about where you are and where you're going
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  What industry are you in?
                </Label>
                <RadioGroup 
                  value={formData.industry} 
                  onValueChange={(value) => handleInputChange('industry', value)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {industryOptions.map((industry) => (
                      <div key={industry} className="flex items-center space-x-2">
                        <RadioGroupItem value={industry} id={industry} />
                        <Label htmlFor={industry} className="text-sm cursor-pointer">
                          {industry}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">
                  What's your experience level?
                </Label>
                <RadioGroup 
                  value={formData.experience_level} 
                  onValueChange={(value) => handleInputChange('experience_level', value)}
                >
                  <div className="space-y-3">
                    {experienceLevelOptions.map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <RadioGroupItem value={level} id={level} />
                        <Label htmlFor={level} className="text-sm cursor-pointer">
                          {level}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">
                  What are your main goals for the next 6 months?
                </Label>
                <Textarea
                  value={formData.main_goals}
                  onChange={(e) => handleInputChange('main_goals', e.target.value)}
                  placeholder="Share your specific goals and what success looks like for you..."
                  className="h-32 resize-none"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i + 1 <= currentStep ? 'bg-black' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
        </CardHeader>
        
        <CardContent>
          {renderStep()}
          
          <div className="flex justify-between mt-12">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            <Button
              onClick={nextStep}
              disabled={isSubmitting}
              className="bg-black hover:bg-gray-800 text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : currentStep === totalSteps ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Complete Setup
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
