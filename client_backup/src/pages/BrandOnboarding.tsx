import React, { useState } from 'react';
import { ChevronRight, Check } from 'lucide-react';
import { useLocation } from 'wouter';

interface BrandOnboardingFormProps {
  onComplete: () => void;
  userId: string;
}

interface FormData {
  brandMission: string;
  idealAudience: string;
  brandValues: string;
  keyPhrases: string;
  hashtags: string;
  visualAesthetic: string;
  contentFocus: string[];
  toneVoice: string;
  industry: string;
  experienceLevel: string;
  mainGoals: string;
}

const BrandOnboardingForm: React.FC<BrandOnboardingFormProps> = ({ onComplete, userId }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    brandMission: '',
    idealAudience: '',
    brandValues: '',
    keyPhrases: '',
    hashtags: '',
    visualAesthetic: '',
    contentFocus: [],
    toneVoice: '',
    industry: '',
    experienceLevel: '',
    mainGoals: ''
  });

  const totalSteps = 4;

  const visualAestheticOptions = [
    'Minimal & Clean',
    'Bold & Vibrant',
    'Soft & Feminine',
    'Dark & Moody',
    'Bright & Colorful',
    'Vintage & Retro',
    'Modern & Sleek',
    'Organic & Natural'
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

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(value)
        ? (prev[field] as string[]).filter((item: string) => item !== value)
        : [...(prev[field] as string[]), value]
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/user-profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...formData
        }),
      });

      if (response.ok) {
        onComplete();
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-light mb-4" style={{ fontFamily: 'Cormorant Garamond' }}>
                Let's Build Your Brand Foundation
              </h2>
              <p className="text-lg text-gray-600">
                Tell me about your mission and who you're here to serve
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">
                  What's your brand mission? What are you here to do?
                </label>
                <textarea
                  value={formData.brandMission}
                  onChange={(e) => handleInputChange('brandMission', e.target.value)}
                  placeholder="Share your purpose, passion, and what drives you..."
                  className="w-full h-32 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">
                  Who is your ideal audience? Describe them in detail.
                </label>
                <textarea
                  value={formData.idealAudience}
                  onChange={(e) => handleInputChange('idealAudience', e.target.value)}
                  placeholder="Think about their demographics, interests, challenges, and dreams..."
                  className="w-full h-32 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">
                  What are your core brand values?
                </label>
                <textarea
                  value={formData.brandValues}
                  onChange={(e) => handleInputChange('brandValues', e.target.value)}
                  placeholder="The principles and beliefs that guide everything you do..."
                  className="w-full h-32 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-light mb-4" style={{ fontFamily: 'Cormorant Garamond' }}>
                Your Voice & Language
              </h2>
              <p className="text-lg text-gray-600">
                Let's define how you communicate with your audience
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">
                  Key phrases that represent your brand
                </label>
                <textarea
                  value={formData.keyPhrases}
                  onChange={(e) => handleInputChange('keyPhrases', e.target.value)}
                  placeholder="Words and phrases you want to be known for..."
                  className="w-full h-24 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">
                  Your signature hashtags
                </label>
                <input
                  type="text"
                  value={formData.hashtags}
                  onChange={(e) => handleInputChange('hashtags', e.target.value)}
                  placeholder="#yourbrand #yourmovement #yourmessage"
                  className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">
                  What's your tone of voice?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {toneVoiceOptions.map((tone) => (
                    <label key={tone} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="toneVoice"
                        value={tone}
                        checked={formData.toneVoice === tone}
                        onChange={(e) => handleInputChange('toneVoice', e.target.value)}
                        className="w-4 h-4 text-black"
                      />
                      <span className="text-sm">{tone}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-light mb-4" style={{ fontFamily: 'Cormorant Garamond' }}>
                Visual Identity & Content
              </h2>
              <p className="text-lg text-gray-600">
                Define your aesthetic and content strategy
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">
                  What's your visual aesthetic?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {visualAestheticOptions.map((aesthetic) => (
                    <label key={aesthetic} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="visualAesthetic"
                        value={aesthetic}
                        checked={formData.visualAesthetic === aesthetic}
                        onChange={(e) => handleInputChange('visualAesthetic', e.target.value)}
                        className="w-4 h-4 text-black"
                      />
                      <span className="text-sm">{aesthetic}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">
                  What type of content do you want to focus on? (Select all that apply)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {contentFocusOptions.map((content) => (
                    <label key={content} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.contentFocus.includes(content)}
                        onChange={() => handleCheckboxChange('contentFocus', content)}
                        className="w-4 h-4 text-black"
                      />
                      <span className="text-sm">{content}</span>
                    </label>
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
              <h2 className="text-4xl font-light mb-4" style={{ fontFamily: 'Cormorant Garamond' }}>
                Your Journey & Goals
              </h2>
              <p className="text-lg text-gray-600">
                Tell me about where you are and where you're going
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">
                  What industry are you in?
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Select your industry</option>
                  {industryOptions.map((industry) => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">
                  What's your experience level?
                </label>
                <div className="space-y-3">
                  {experienceLevelOptions.map((level) => (
                    <label key={level} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="experienceLevel"
                        value={level}
                        checked={formData.experienceLevel === level}
                        onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                        className="w-4 h-4 text-black"
                      />
                      <span className="text-sm">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">
                  What are your main goals for the next 6 months?
                </label>
                <textarea
                  value={formData.mainGoals}
                  onChange={(e) => handleInputChange('mainGoals', e.target.value)}
                  placeholder="Share your specific goals and what success looks like for you..."
                  className="w-full h-32 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-black focus:border-transparent"
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step < currentStep ? 'bg-black text-white' :
                  step === currentStep ? 'bg-black text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {step < currentStep ? <Check size={16} /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-black' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 text-center">
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          {renderStep()}

          {/* Navigation */}
          <div className="flex justify-between mt-12 pt-8 border-t border-gray-100">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Previous
            </button>

            {currentStep === totalSteps ? (
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 flex items-center space-x-2"
              >
                <span>Complete Setup</span>
                <Check size={16} />
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 flex items-center space-x-2"
              >
                <span>Continue</span>
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main BrandOnboarding page component
const BrandOnboarding: React.FC = () => {
  const [, setLocation] = useLocation();
  
  // Mock user ID - in production this would come from auth context
  const userId = "1";

  const handleComplete = () => {
    // Redirect to dashboard after completion
    setLocation('/dashboard');
  };

  return (
    <BrandOnboardingForm 
      userId={userId} 
      onComplete={handleComplete}
    />
  );
};

export default BrandOnboarding;