import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { UserProfile } from "@/data/templates";

interface UserProfileFormProps {
  onProfileSaved: (profile: UserProfile) => void;
  initialProfile?: UserProfile;
}

export function UserProfileForm({ onProfileSaved, initialProfile }: UserProfileFormProps) {
  const [profile, setProfile] = useState<UserProfile>(initialProfile || {
    name: "",
    niche: "",
    audience: "",
    story: "",
    offer: "",
    goals: ""
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!profile.niche || !profile.audience || !profile.story) {
      toast({
        title: "Profile Incomplete",
        description: "Please fill in at least your niche, audience, and story to get started.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      await apiRequest("POST", "/api/save-profile", profile);
      
      onProfileSaved(profile);
      toast({
        title: "Profile Saved!",
        description: "Your AI content will now be personalized to your brand.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Unable to save profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Your Brand Profile</CardTitle>
        <CardDescription>
          Tell the AI about your brand so it can create personalized content that converts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">Your Name</Label>
          <Input
            id="name"
            placeholder="e.g., Sandra"
            value={profile.name || ""}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="niche">Your Niche *</Label>
          <Input
            id="niche"
            placeholder="e.g., Online business coaching for moms"
            value={profile.niche}
            onChange={(e) => setProfile({ ...profile, niche: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="audience">Your Ideal Audience *</Label>
          <Input
            id="audience"
            placeholder="e.g., Working moms aged 30-45 who want financial freedom"
            value={profile.audience}
            onChange={(e) => setProfile({ ...profile, audience: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="story">Your Transformation Story *</Label>
          <Textarea
            id="story"
            placeholder="Share your journey - what you overcame, how you transformed, why you started helping others..."
            value={profile.story}
            onChange={(e) => setProfile({ ...profile, story: e.target.value })}
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="offer">Your Main Offer</Label>
          <Input
            id="offer"
            placeholder="e.g., 90-Day Business Breakthrough Program"
            value={profile.offer}
            onChange={(e) => setProfile({ ...profile, offer: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="goals">Your 2025 Goals</Label>
          <Textarea
            id="goals"
            placeholder="What do you want to achieve this year? Revenue goals, follower targets, impact goals..."
            value={profile.goals}
            onChange={(e) => setProfile({ ...profile, goals: e.target.value })}
            rows={3}
          />
        </div>

        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full"
          size="lg"
        >
          {isSaving ? "Saving..." : "Save Profile & Start Creating"}
        </Button>
      </CardContent>
    </Card>
  );
}