import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function CoachingApplication() {
  const { data: user } = useQuery({
    queryKey: ["/api/me"],
    retry: false,
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    instagram: '',
    currentRevenue: '',
    revenueGoal: '',
    biggestChallenge: '',
    previousInvestment: '',
    whyNow: '',
    commitment: '',
    timeline: ''
  });

  const { toast } = useToast();

  const applicationMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/coaching-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Sandra will personally review your application within 48 hours.",
      });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        instagram: '',
        currentRevenue: '',
        revenueGoal: '',
        biggestChallenge: '',
        previousInvestment: '',
        whyNow: '',
        commitment: '',
        timeline: ''
      });
    },
    onError: (error: any) => {
      toast({
        title: "Submission Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applicationMutation.mutate(formData);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Header user={user} />
      <main className="bg-[#F1F1F1] text-[#171719] font-inter">
        <section className="py-20 px-4 max-w-5xl mx-auto text-center">
          <h1 className="text-[64px] font-['Cormorant Garamond'] font-normal leading-tight mb-6">
            Empire Builder VIP Application
          </h1>
          <p className="text-[18px] italic text-[#4C4B4B] max-w-2xl mx-auto">
            Sandra selects 8 women per quarter for her most intimate business-building experience. You don't just learn—you launch, lead, and elevate.
          </p>
        </section>

        {/* What's Included */}
        <section className="px-4 pb-20 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                title: "Complete Sales Funnel Built",
                desc: "Landing pages, emails, and automation setup."
              },
              {
                title: "Digital Product Creation",
                desc: "Design and launch your signature offer."
              },
              {
                title: "Marketing Automation",
                desc: "ManyChat, email marketing, and scheduled content."
              },
              {
                title: "VIP Resource Hub",
                desc: "Full access to Sandra's proven assets and tools."
              }
            ].map((item, i) => (
              <div key={i} className="border border-[#B5B5B3] bg-white p-6">
                <h3 className="font-['Cormorant Garamond'] text-[24px] mb-2">{item.title}</h3>
                <p className="text-[16px] text-[#4C4B4B] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Application Form */}
        <section className="pb-20 px-4">
          <Card className="max-w-4xl mx-auto border border-[#B5B5B3] bg-white">
            <CardHeader className="text-center py-12">
              <CardTitle className="text-[36px] italic font-['Cormorant Garamond']">
                Apply Now
              </CardTitle>
              <p className="text-[16px] text-[#4C4B4B] italic mt-4">
                Be honest and detailed—Sandra reads every word.
              </p>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Info */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label>First Name *</Label>
                    <Input value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name *</Label>
                    <Input value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address *</Label>
                    <Input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Instagram Handle</Label>
                    <Input value={formData.instagram} onChange={(e) => updateField('instagram', e.target.value)} />
                  </div>
                </div>

                {/* Revenue Goals */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label>Current Monthly Revenue *</Label>
                    <Select value={formData.currentRevenue} onValueChange={(value) => updateField('currentRevenue', value)}>
                      <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1k">$0 - $1,000</SelectItem>
                        <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                        <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                        <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                        <SelectItem value="25k+">$25,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Revenue Goal in 90 Days *</Label>
                    <Select value={formData.revenueGoal} onValueChange={(value) => updateField('revenueGoal', value)}>
                      <SelectTrigger><SelectValue placeholder="Select goal" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5k">$5,000/month</SelectItem>
                        <SelectItem value="10k">$10,000/month</SelectItem>
                        <SelectItem value="25k">$25,000/month</SelectItem>
                        <SelectItem value="50k">$50,000/month</SelectItem>
                        <SelectItem value="100k+">$100,000+/month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Long Answers */}
                <div className="space-y-6">
                  <div>
                    <Label>What's your biggest challenge right now? *</Label>
                    <Textarea
                      value={formData.biggestChallenge}
                      onChange={(e) => updateField('biggestChallenge', e.target.value)}
                      rows={4}
                      required
                    />
                  </div>
                  <div>
                    <Label>What's the most you've invested in your business? *</Label>
                    <Select value={formData.previousInvestment} onValueChange={(value) => updateField('previousInvestment', value)}>
                      <SelectTrigger><SelectValue placeholder="Select amount" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-500">Under $500</SelectItem>
                        <SelectItem value="500-2k">$500 - $2,000</SelectItem>
                        <SelectItem value="2k-5k">$2,000 - $5,000</SelectItem>
                        <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                        <SelectItem value="10k+">$10,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Why is now the right time? *</Label>
                    <Textarea
                      value={formData.whyNow}
                      onChange={(e) => updateField('whyNow', e.target.value)}
                      rows={4}
                      required
                    />
                  </div>
                  <div>
                    <Label>How committed are you? *</Label>
                    <Select value={formData.commitment} onValueChange={(value) => updateField('commitment', value)}>
                      <SelectTrigger><SelectValue placeholder="Select commitment" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="somewhat">Somewhat committed</SelectItem>
                        <SelectItem value="very">Very committed</SelectItem>
                        <SelectItem value="all-in">All in—this is my priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>When do you want to start? *</Label>
                    <Select value={formData.timeline} onValueChange={(value) => updateField('timeline', value)}>
                      <SelectTrigger><SelectValue placeholder="Select timeline" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asap">ASAP</SelectItem>
                        <SelectItem value="2-weeks">Within 2 weeks</SelectItem>
                        <SelectItem value="month">Within a month</SelectItem>
                        <SelectItem value="later">Not sure / later</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-10">
                  <Button
                    type="submit"
                    disabled={applicationMutation.isPending}
                    className="w-full bg-black text-white text-[14px] uppercase tracking-[0.5px] py-4"
                  >
                    {applicationMutation.isPending ? "Submitting..." : "Submit Application"}
                  </Button>
                  <p className="text-center text-[#4C4B4B] text-sm italic mt-4">
                    You'll receive a personal response within 48 hours.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Social Proof */}
        <section className="pb-24 px-4">
          <div className="max-w-4xl mx-auto text-center border border-[#B5B5B3] bg-white p-12">
            <blockquote className="text-[18px] italic text-[#4C4B4B] mb-6 leading-relaxed">
              "Working with Sandra 1:1 was the best investment I ever made. In 90 days, I went from $2K to $15K months and finally felt confident showing up as the CEO of my life."
            </blockquote>
            <cite className="text-[#171719] text-sm uppercase tracking-wide">– Emma R., Previous VIP Client</cite>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}