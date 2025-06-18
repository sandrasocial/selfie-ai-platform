import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, CreditCard, Shield, LogOut, Edit, Save, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';

export default function MyAccount() {
  const [, setLocation] = useLocation();
  const { user: supabaseUser, signOut } = useSupabaseAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!supabaseUser) {
      setLocation('/auth');
    }
  }, [supabaseUser, setLocation]);

  // Fetch user profile
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/me'],
    enabled: !!supabaseUser?.id
  });

  // Fetch subscription status
  const { data: subscriptionStatus } = useQuery({
    queryKey: ['/api/subscription/status'],
    enabled: !!supabaseUser?.id
  });

  // Fetch purchase history
  const { data: purchases } = useQuery({
    queryKey: ['/api/purchases'],
    enabled: !!supabaseUser?.id
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof profileData) => {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/me'] });
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(profileData);
  };

  const handleSignOut = async () => {
    await signOut();
    setLocation('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#171719] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-['Helvetica'] text-[#4C4B4B]">Loading account...</p>
        </div>
      </div>
    );
  }

  if (!supabaseUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      <Header />

      {/* Hero Section */}
      <section className="bg-[#171719] py-20">
        <div className="container mx-auto px-6 md:px-4 text-center">
          <h1 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl md:text-5xl font-normal text-white mb-8 uppercase tracking-wide leading-tight">
            My Account
          </h1>
          <div className="w-24 h-px bg-white mx-auto mb-10"></div>
          <p className="font-['Helvetica'] text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            Manage your SELFIE AI™ account settings and preferences.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-6 md:px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Settings */}
            <Card className="bg-white border-[#E8E8E8] shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between font-['Cormorant_Garamond'] text-xl uppercase tracking-wide">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5" />
                    Profile
                  </div>
                  {!isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="p-2 h-auto"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Enter your last name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={handleSaveProfile}
                        disabled={updateProfileMutation.isPending}
                        className="flex-1 bg-transparent border border-[#171719] text-[#171719] hover:bg-[#171719] hover:text-white uppercase tracking-wide"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="flex-1"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm text-[#4C4B4B]">Name</Label>
                        <p className="font-medium">{user?.firstName || 'Not set'} {user?.lastName || ''}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-[#4C4B4B]">Email</Label>
                        <p className="font-medium">{user?.email || 'Not set'}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-[#4C4B4B]">Member Since</Label>
                        <p className="font-medium">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Subscription Status */}
            <Card className="bg-white border-[#E8E8E8] shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-['Cormorant_Garamond'] text-xl uppercase tracking-wide">
                  <CreditCard className="w-5 h-5" />
                  Subscription
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-[#4C4B4B]">Plan</Label>
                    <Badge variant={subscriptionStatus?.plan === 'VIP' ? 'default' : 'secondary'}>
                      {subscriptionStatus?.plan || 'FREE'}
                    </Badge>
                  </div>
                  {subscriptionStatus?.status && (
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-[#4C4B4B]">Status</Label>
                      <Badge variant={subscriptionStatus.status === 'active' ? 'default' : 'secondary'}>
                        {subscriptionStatus.status.toUpperCase()}
                      </Badge>
                    </div>
                  )}
                  {subscriptionStatus?.renewalDate && (
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-[#4C4B4B]">Next Renewal</Label>
                      <p className="font-medium">
                        {new Date(subscriptionStatus.renewalDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Purchase History */}
          <Card className="bg-white border-[#E8E8E8] shadow-sm mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 font-['Cormorant_Garamond'] text-xl uppercase tracking-wide">
                <Shield className="w-5 h-5" />
                Purchase History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {purchases && purchases.length > 0 ? (
                <div className="space-y-4">
                  {purchases.map((purchase: any) => (
                    <div key={purchase.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{purchase.productName}</h4>
                        <p className="text-sm text-[#4C4B4B]">
                          {new Date(purchase.purchaseDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${purchase.amount}</p>
                        <Badge variant="outline" className="text-xs">
                          {purchase.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#4C4B4B] text-center py-8">
                  No purchases found.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Account Actions */}
          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}