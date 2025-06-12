
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function VIPApplication() {
  const [, navigate] = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    instagram: '',
    website: '',
    currentBusiness: '',
    whyVIP: '',
    goals: '',
    budget: ''
  });

  const applicationMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/vip/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit application");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "We'll review your application and respond within 48 hours.",
      });
      navigate('/thank-you/vip');
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const required = ['fullName', 'email', 'currentBusiness', 'whyVIP', 'goals', 'budget'];
    const hasMissing = required.some(field => !formData[field as keyof typeof formData]);

    if (hasMissing) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    applicationMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      <Header />
      
      {/* Hero */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 
            className="text-5xl lg:text-6xl font-normal text-[#171719] mb-6" 
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Empire Builder VIP Application
          </h1>
          <p 
            className="text-xl text-[#4C4B4B] font-light max-w-2xl mx-auto leading-relaxed" 
            style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
          >
            Submit your details below and tell us about the empire you're building. We'll review your application and follow up personally.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-white border border-[#B5B5B3] shadow-lg">
            <CardHeader className="text-center pb-8">
              <CardTitle 
                className="text-3xl font-normal text-[#171719]" 
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Tell Us About Your Brand
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label 
                      className="text-[#4C4B4B] text-sm uppercase tracking-wide font-normal" 
                      htmlFor="fullName"
                      style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                    >
                      Full Name *
                    </Label>
                    <Input 
                      id="fullName" 
                      value={formData.fullName} 
                      onChange={e => handleInputChange('fullName', e.target.value)} 
                      className="mt-2 border-[#B5B5B3] focus:border-[#171719]" 
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <Label 
                      className="text-[#4C4B4B] text-sm uppercase tracking-wide font-normal" 
                      htmlFor="email"
                      style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                    >
                      Email Address *
                    </Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={e => handleInputChange('email', e.target.value)} 
                      className="mt-2 border-[#B5B5B3] focus:border-[#171719]" 
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label 
                      className="text-[#4C4B4B] text-sm uppercase tracking-wide font-normal" 
                      htmlFor="instagram"
                      style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                    >
                      Instagram Handle
                    </Label>
                    <Input 
                      id="instagram" 
                      value={formData.instagram} 
                      onChange={e => handleInputChange('instagram', e.target.value)} 
                      className="mt-2 border-[#B5B5B3] focus:border-[#171719]" 
                      placeholder="@yourusername"
                    />
                  </div>
                  <div>
                    <Label 
                      className="text-[#4C4B4B] text-sm uppercase tracking-wide font-normal" 
                      htmlFor="website"
                      style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                    >
                      Website (Optional)
                    </Label>
                    <Input 
                      id="website" 
                      value={formData.website} 
                      onChange={e => handleInputChange('website', e.target.value)} 
                      className="mt-2 border-[#B5B5B3] focus:border-[#171719]" 
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

                <div>
                  <Label 
                    className="text-[#4C4B4B] text-sm uppercase tracking-wide font-normal" 
                    htmlFor="currentBusiness"
                    style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                  >
                    Your Current Brand *
                  </Label>
                  <Textarea 
                    id="currentBusiness" 
                    value={formData.currentBusiness} 
                    onChange={e => handleInputChange('currentBusiness', e.target.value)} 
                    className="mt-2 min-h-[100px] border-[#B5B5B3] focus:border-[#171719]" 
                    placeholder="Tell us about your current business, industry, and what you do..."
                  />
                </div>

                <div>
                  <Label 
                    className="text-[#4C4B4B] text-sm uppercase tracking-wide font-normal" 
                    htmlFor="whyVIP"
                    style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                  >
                    Why VIP Mentorship? *
                  </Label>
                  <Textarea 
                    id="whyVIP" 
                    value={formData.whyVIP} 
                    onChange={e => handleInputChange('whyVIP', e.target.value)} 
                    className="mt-2 min-h-[120px] border-[#B5B5B3] focus:border-[#171719]" 
                    placeholder="What's driving you to seek premium mentorship? What challenges are you facing?"
                  />
                </div>

                <div>
                  <Label 
                    className="text-[#4C4B4B] text-sm uppercase tracking-wide font-normal" 
                    htmlFor="goals"
                    style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                  >
                    Your 6–12 Month Goals *
                  </Label>
                  <Textarea 
                    id="goals" 
                    value={formData.goals} 
                    onChange={e => handleInputChange('goals', e.target.value)} 
                    className="mt-2 min-h-[120px] border-[#B5B5B3] focus:border-[#171719]" 
                    placeholder="Be specific about what you want to achieve in your brand, business, and personal growth..."
                  />
                </div>

                <div>
                  <Label 
                    className="text-[#4C4B4B] text-sm uppercase tracking-wide font-normal" 
                    htmlFor="budget"
                    style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                  >
                    Investment Range *
                  </Label>
                  <Select value={formData.budget} onValueChange={value => handleInputChange('budget', value)}>
                    <SelectTrigger className="mt-2 border-[#B5B5B3] focus:border-[#171719]">
                      <SelectValue placeholder="Select your investment range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3k-5k">$3,000 – $5,000</SelectItem>
                      <SelectItem value="5k-10k">$5,000 – $10,000</SelectItem>
                      <SelectItem value="10k+">$10,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-8">
                  <Button
                    type="submit"
                    disabled={applicationMutation.isPending}
                    className="w-full bg-transparent border-2 border-[#171719] text-[#171719] hover:bg-[#171719] hover:text-white text-sm uppercase tracking-wide py-4 font-light transition-all duration-300"
                    style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                  >
                    {applicationMutation.isPending ? "SUBMITTING..." : "SEND MY APPLICATION"}
                  </Button>
                </div>

                <p 
                  className="text-center text-sm text-[#4C4B4B] font-light pt-4 leading-relaxed" 
                  style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                >
                  We'll review your application and contact you within 48 hours if accepted.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
