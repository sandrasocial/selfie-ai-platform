import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Edit3, Save, X } from 'lucide-react';

const MyBrandProfile = () => {
  const { user: supabaseUser } = useSupabaseAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  // Fetch user profile
  const { data: profile, isLoading: loading } = useQuery({
    queryKey: ['user-profile', supabaseUser?.id],
    queryFn: async () => {
      const response = await fetch(`/api/user-profiles?userId=${supabaseUser.id}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      return data.profile;
    },
    enabled: !!supabaseUser?.id,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData) => {
      const response = await fetch('/api/user-profiles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: supabaseUser.id, ...profileData }),
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user-profile', supabaseUser?.id]);
      setIsEditing(false);
    },
  });

  useEffect(() => {
    if (profile) {
      setEditData({
        brandMission: profile.brand_mission || '',
        idealAudience: profile.ideal_audience || '',
        brandValues: profile.brand_values || '',
        keyPhrases: profile.key_phrases || '',
        hashtags: profile.hashtags || '',
        visualAesthetic: profile.visual_aesthetic || '',
        contentFocus: profile.content_focus || [],
        toneVoice: profile.tone_voice || '',
        industry: profile.industry || '',
        experienceLevel: profile.experience_level || '',
        mainGoals: profile.main_goals || ''
      });
    }
  }, [profile]);

  const handleSave = async () => {
    updateProfileMutation.mutate(editData);
  };

  const handleCancel = () => {
    if (profile) {
      setEditData({
        brandMission: profile.brand_mission || '',
        idealAudience: profile.ideal_audience || '',
        brandValues: profile.brand_values || '',
        keyPhrases: profile.key_phrases || '',
        hashtags: profile.hashtags || '',
        visualAesthetic: profile.visual_aesthetic || '',
        contentFocus: profile.content_focus || [],
        toneVoice: profile.tone_voice || '',
        industry: profile.industry || '',
        experienceLevel: profile.experience_level || '',
        mainGoals: profile.main_goals || ''
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-light mb-4" style={{ fontFamily: 'Cormorant Garamond' }}>
            No profile found
          </h2>
          <p className="text-gray-600 mb-6">Complete your onboarding to create your brand profile.</p>
          <button className="px-6 py-3 border border-black bg-transparent hover:bg-black hover:text-white transition-colors">
            START ONBOARDING
          </button>
        </div>
      </div>
    );
  }

  const ProfileField = ({ label, value, field, multiline = false, placeholder = '' }) => {
    const displayValue = Array.isArray(value) ? value.join(', ') : value;
    
    return (
      <div className="border-b border-gray-200 py-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-700 mb-2">{label}</h3>
            {isEditing ? (
              multiline ? (
                <textarea
                  value={editData[field] || ''}
                  onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full p-3 border border-gray-300 rounded-none resize-none h-24 focus:outline-none focus:border-black transition-colors"
                />
              ) : (
                <input
                  type="text"
                  value={editData[field] || ''}
                  onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full p-3 border border-gray-300 rounded-none focus:outline-none focus:border-black transition-colors"
                />
              )
            ) : (
              <p className="text-gray-900 leading-relaxed">
                {displayValue || <span className="text-gray-400 italic">Not specified</span>}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-light mb-4" style={{ fontFamily: 'Cormorant Garamond' }}>
                My Brand Profile
              </h1>
              <p className="text-gray-300">
                Your brand DNA that powers all personalized content across the platform
              </p>
            </div>
            <div className="flex space-x-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-6 py-3 border border-white bg-transparent text-white hover:bg-white hover:text-black transition-colors"
                >
                  <Edit3 size={18} className="mr-2" />
                  EDIT PROFILE
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-6 py-3 border border-gray-400 bg-transparent text-gray-300 hover:border-white hover:text-white transition-colors"
                  >
                    <X size={18} className="mr-2" />
                    CANCEL
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={updateProfileMutation.isPending}
                    className="flex items-center px-6 py-3 border border-white bg-white text-black hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    <Save size={18} className="mr-2" />
                    {updateProfileMutation.isPending ? 'SAVING...' : 'SAVE CHANGES'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-0">
          {/* Brand Foundation */}
          <div className="mb-12">
            <h2 className="text-2xl font-light mb-8" style={{ fontFamily: 'Cormorant Garamond' }}>
              Brand Foundation
            </h2>
            
            <ProfileField
              label="Brand Mission"
              value={profile.brand_mission}
              field="brandMission"
              multiline
              placeholder="What you're here to do, your purpose..."
            />
            
            <ProfileField
              label="Ideal Audience"
              value={profile.ideal_audience}
              field="idealAudience"
              multiline
              placeholder="Who you serve, their characteristics..."
            />
            
            <ProfileField
              label="Brand Values"
              value={profile.brand_values}
              field="brandValues"
              placeholder="What you stand for..."
            />
          </div>

          {/* Visual Identity */}
          <div className="mb-12">
            <h2 className="text-2xl font-light mb-8" style={{ fontFamily: 'Cormorant Garamond' }}>
              Visual Identity
            </h2>
            
            <ProfileField
              label="Visual Aesthetic"
              value={profile.visual_aesthetic}
              field="visualAesthetic"
              placeholder="Your visual style preference..."
            />
            
            <ProfileField
              label="Content Focus"
              value={profile.content_focus}
              field="contentFocus"
              placeholder="Types of content you create..."
            />
          </div>

          {/* Voice & Language */}
          <div className="mb-12">
            <h2 className="text-2xl font-light mb-8" style={{ fontFamily: 'Cormorant Garamond' }}>
              Voice & Language
            </h2>
            
            <ProfileField
              label="Tone & Voice"
              value={profile.tone_voice}
              field="toneVoice"
              placeholder="How you communicate..."
            />
            
            <ProfileField
              label="Key Phrases"
              value={profile.key_phrases}
              field="keyPhrases"
              placeholder="Words that represent your brand..."
            />
            
            <ProfileField
              label="Hashtags"
              value={profile.hashtags}
              field="hashtags"
              placeholder="#yourbrand, #keywords..."
            />
          </div>

          {/* Business Details */}
          <div className="mb-12">
            <h2 className="text-2xl font-light mb-8" style={{ fontFamily: 'Cormorant Garamond' }}>
              Business Details
            </h2>
            
            <ProfileField
              label="Industry"
              value={profile.industry}
              field="industry"
              placeholder="Your field or niche..."
            />
            
            <ProfileField
              label="Experience Level"
              value={profile.experience_level}
              field="experienceLevel"
              placeholder="Where you are in your journey..."
            />
            
            <ProfileField
              label="Current Goals"
              value={profile.main_goals}
              field="mainGoals"
              multiline
              placeholder="What you want to achieve..."
            />
          </div>
        </div>

        {/* Impact Statement */}
        <div className="mt-16 p-8 bg-gray-50 border-l-4 border-black">
          <h3 className="text-lg font-medium mb-3">Profile Impact</h3>
          <p className="text-gray-600 leading-relaxed">
            Your brand profile powers personalized content across Sandra AI, workbook generation, 
            pose coaching, and content suggestions. The more complete your profile, the better 
            your personalized experience becomes.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Last updated: {new Date(profile.updated_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBrandProfile;