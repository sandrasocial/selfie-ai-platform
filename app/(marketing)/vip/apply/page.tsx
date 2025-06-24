'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  instagram: string;
  currentRevenue: string;
  revenueGoal: string;
  biggestChallenge: string;
  previousInvestment: string;
  whyNow: string;
  commitment: string;
  timeline: string;
}

export default function VIPApplication() {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
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

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      // Save application to database
      const { error } = await supabase
        .from('vip_applications')
        .insert({
          user_id: user?.id || null,
          ...formData,
          status: 'pending',
          submitted_at: new Date().toISOString()
        });

      if (error) throw error;

      // Send notification email (you'll implement this with your email service)
      await fetch('/api/vip-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      toast.success('Application submitted successfully');
      router.push('/thank-you/vip-application');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      {/* Hero Section */}
      <section className="relative px-6 py-32 bg-[#171719] overflow-hidden">
        {/* Editorial Number */}
        <div 
          className="absolute -top-20 right-10 text-[#F1F1F1] pointer-events-none"
          style={{ 
            fontFamily: 'Bodoni Moda, serif',
            fontSize: '300px',
            fontWeight: '700',
            opacity: '0.03',
            lineHeight: '1'
          }}
        >
          VIP
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 
            className="text-7xl md:text-8xl mb-8 text-[#F1F1F1]"
            style={{ 
              fontFamily: 'Bodoni Moda, serif',
              fontWeight: '300',
              letterSpacing: '-0.04em',
              lineHeight: '0.9'
            }}
          >
            Empire Builder<br />VIP Application
          </h1>
          
          <p 
            className="text-xl md:text-2xl text-[#F1F1F1]/80 max-w-2xl mx-auto"
            style={{ 
              fontFamily: 'Inter, sans-serif',
              fontWeight: '200'
            }}
          >
            Okay, so you're ready to go all in. This is where we build your 
            empire together. One-on-one. No distractions. Just results.
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="px-6 py-32 bg-white relative">
        {/* Editorial Number */}
        <div 
          className="absolute -top-20 left-10 text-[#171719] pointer-events-none"
          style={{ 
            fontFamily: 'Bodoni Moda, serif',
            fontSize: '300px',
            fontWeight: '700',
            opacity: '0.03',
            lineHeight: '1'
          }}
        >
          01
        </div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 
            className="text-5xl md:text-6xl mb-12 text-[#171719] text-center"
            style={{ 
              fontFamily: 'Bodoni Moda, serif',
              fontWeight: '300',
              letterSpacing: '-0.04em',
              lineHeight: '0.9'
            }}
          >
            Is This You?
          </h2>
          
          <div className="space-y-6 text-lg text-[#171719]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '200' }}>
            <p>
              You've been building something real but you know you're playing small.
            </p>
            <p>
              You see other women scaling to $50K, $100K months and think "why not me?"
            </p>
            <p>
              You're tired of piecing together free content and ready for a clear path.
            </p>
            <p>
              You want someone who's been there to show you exactly what works.
            </p>
            <p className="pt-6 text-xl">
              Good. Let's talk.
            </p>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="px-6 py-32 bg-[#F1F1F1] relative">
        {/* Editorial Number */}
        <div 
          className="absolute -top-20 right-10 text-white pointer-events-none"
          style={{ 
            fontFamily: 'Bodoni Moda, serif',
            fontSize: '300px',
            fontWeight: '700',
            opacity: '0.03',
            lineHeight: '1'
          }}
        >
          02
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 
            className="text-5xl md:text-6xl mb-16 text-[#171719] text-center"
            style={{ 
              fontFamily: 'Bodoni Moda, serif',
              fontWeight: '300',
              letterSpacing: '-0.04em',
              lineHeight: '0.9'
            }}
          >
            The VIP Experience
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 
                className="text-3xl mb-6 text-[#171719]"
                style={{ fontFamily: 'Bodoni Moda, serif' }}
              >
                What's Included
              </h3>
              <ul className="space-y-4 text-[#171719]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '200' }}>
                <li>→ Weekly 1:1 calls with me (yes, actually me)</li>
                <li>→ Your personal brand built from scratch</li>
                <li>→ Content strategy that converts</li>
                <li>→ Sales systems that feel good</li>
                <li>→ Direct access via Voxer between calls</li>
                <li>→ Custom templates and tools</li>
                <li>→ 90-day intensive support</li>
              </ul>
            </div>
            
            <div>
              <h3 
                className="text-3xl mb-6 text-[#171719]"
                style={{ fontFamily: 'Bodoni Moda, serif' }}
              >
                The Results
              </h3>
              <ul className="space-y-4 text-[#171719]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '200' }}>
                <li>→ Clear brand that attracts dream clients</li>
                <li>→ Content system that runs itself</li>
                <li>→ Confidence to charge what you're worth</li>
                <li>→ Sales without the sleaze</li>
                <li>→ Business that supports your life</li>
                <li>→ Strategy that actually makes sense</li>
                <li>→ CEO mindset that sticks</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="px-6 py-32 bg-white relative">
        {/* Editorial Number */}
        <div 
          className="absolute -top-20 left-10 text-[#171719] pointer-events-none"
          style={{ 
            fontFamily: 'Bodoni Moda, serif',
            fontSize: '300px',
            fontWeight: '700',
            opacity: '0.03',
            lineHeight: '1'
          }}
        >
          03
        </div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <Card className="border-[#171719] border-2 rounded-none">
            <CardHeader className="text-center pb-12 pt-16">
              <CardTitle 
                className="text-5xl text-[#171719]"
                style={{ 
                  fontFamily: 'Bodoni Moda, serif',
                  fontWeight: '300',
                  letterSpacing: '-0.04em'
                }}
              >
                Let's See If We're A Fit
              </CardTitle>
              <p 
                className="text-lg text-[#171719]/70 mt-4"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: '200'
                }}
              >
                Be real with me. I'll be real with you.
              </p>
            </CardHeader>
            
            <CardContent className="px-12 pb-16">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label 
                      htmlFor="firstName" 
                      className="text-[#171719] uppercase tracking-wider text-sm mb-2"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      className="border-[#171719] focus:border-[#171719] rounded-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label 
                      htmlFor="lastName" 
                      className="text-[#171719] uppercase tracking-wider text-sm mb-2"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                      className="border-[#171719] focus:border-[#171719] rounded-none"
                      required
                    />
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label 
                      htmlFor="email" 
                      className="text-[#171719] uppercase tracking-wider text-sm mb-2"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="border-[#171719] focus:border-[#171719] rounded-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label 
                      htmlFor="instagram" 
                      className="text-[#171719] uppercase tracking-wider text-sm mb-2"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Instagram Handle *
                    </Label>
                    <Input
                      id="instagram"
                      value={formData.instagram}
                      onChange={(e) => updateField('instagram', e.target.value)}
                      placeholder="@yourusername"
                      className="border-[#171719] focus:border-[#171719] rounded-none"
                      required
                    />
                  </div>
                </div>

                {/* Business Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label 
                      htmlFor="currentRevenue" 
                      className="text-[#171719] uppercase tracking-wider text-sm mb-2"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Current Monthly Revenue *
                    </Label>
                    <Select 
                      value={formData.currentRevenue} 
                      onValueChange={(value) => updateField('currentRevenue', value)}
                    >
                      <SelectTrigger 
                        className="border-[#171719] focus:border-[#171719] rounded-none"
                      >
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-5k">$0 - $5K</SelectItem>
                        <SelectItem value="5k-10k">$5K - $10K</SelectItem>
                        <SelectItem value="10k-25k">$10K - $25K</SelectItem>
                        <SelectItem value="25k-50k">$25K - $50K</SelectItem>
                        <SelectItem value="50k+">$50K+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label 
                      htmlFor="revenueGoal" 
                      className="text-[#171719] uppercase tracking-wider text-sm mb-2"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Revenue Goal (90 days) *
                    </Label>
                    <Select 
                      value={formData.revenueGoal} 
                      onValueChange={(value) => updateField('revenueGoal', value)}
                    >
                      <SelectTrigger 
                        className="border-[#171719] focus:border-[#171719] rounded-none"
                      >
                        <SelectValue placeholder="Select goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10k">$10K/month</SelectItem>
                        <SelectItem value="25k">$25K/month</SelectItem>
                        <SelectItem value="50k">$50K/month</SelectItem>
                        <SelectItem value="100k">$100K/month</SelectItem>
                        <SelectItem value="100k+">$100K+/month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Challenge Field */}
                <div>
                  <Label 
                    htmlFor="biggestChallenge" 
                    className="text-[#171719] uppercase tracking-wider text-sm mb-2"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    What's your biggest challenge right now? *
                  </Label>
                  <Textarea
                    id="biggestChallenge"
                    value={formData.biggestChallenge}
                    onChange={(e) => updateField('biggestChallenge', e.target.value)}
                    placeholder="Be specific. What's actually stopping you?"
                    className="min-h-[120px] border-[#171719] focus:border-[#171719] rounded-none"
                    required
                  />
                </div>

                {/* Why Now Field */}
                <div>
                  <Label 
                    htmlFor="whyNow" 
                    className="text-[#171719] uppercase tracking-wider text-sm mb-2"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Why is NOW the time for VIP support? *
                  </Label>
                  <Textarea
                    id="whyNow"
                    value={formData.whyNow}
                    onChange={(e) => updateField('whyNow', e.target.value)}
                    placeholder="What's different about right now?"
                    className="min-h-[120px] border-[#171719] focus:border-[#171719] rounded-none"
                    required
                  />
                </div>

                {/* Investment Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label 
                      htmlFor="previousInvestment" 
                      className="text-[#171719] uppercase tracking-wider text-sm mb-2"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Previous coaching investment? *
                    </Label>
                    <Select 
                      value={formData.previousInvestment} 
                      onValueChange={(value) => updateField('previousInvestment', value)}
                    >
                      <SelectTrigger 
                        className="border-[#171719] focus:border-[#171719] rounded-none"
                      >
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None yet</SelectItem>
                        <SelectItem value="0-5k">$0 - $5K</SelectItem>
                        <SelectItem value="5k-10k">$5K - $10K</SelectItem>
                        <SelectItem value="10k-25k">$10K - $25K</SelectItem>
                        <SelectItem value="25k+">$25K+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label 
                      htmlFor="commitment" 
                      className="text-[#171719] uppercase tracking-wider text-sm mb-2"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Ready to invest $10K+ in yourself? *
                    </Label>
                    <Select 
                      value={formData.commitment} 
                      onValueChange={(value) => updateField('commitment', value)}
                    >
                      <SelectTrigger 
                        className="border-[#171719] focus:border-[#171719] rounded-none"
                      >
                        <SelectValue placeholder="Select answer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes, I'm ready</SelectItem>
                        <SelectItem value="payment-plan">Yes, with payment plan</SelectItem>
                        <SelectItem value="considering">Still considering</SelectItem>
                        <SelectItem value="no">Not at this time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Timeline Field */}
                <div>
                  <Label 
                    htmlFor="timeline" 
                    className="text-[#171719] uppercase tracking-wider text-sm mb-2"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    When do you want to start? *
                  </Label>
                  <Select 
                    value={formData.timeline} 
                    onValueChange={(value) => updateField('timeline', value)}
                  >
                    <SelectTrigger 
                      className="border-[#171719] focus:border-[#171719] rounded-none"
                    >
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">ASAP</SelectItem>
                      <SelectItem value="2-weeks">Within 2 weeks</SelectItem>
                      <SelectItem value="month">Within a month</SelectItem>
                      <SelectItem value="later">Not sure yet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit Button */}
                <div className="pt-8">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#171719] text-[#F1F1F1] hover:bg-[#171719]/90 text-lg py-8 uppercase tracking-widest rounded-none"
                  >
                    {isSubmitting ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}
                  </Button>
                  
                  <p 
                    className="text-center text-[#171719]/60 text-sm mt-6"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: '200'
                    }}
                  >
                    You'll hear from me personally within 48 hours.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Investment Section */}
      <section className="px-6 py-32 bg-[#171719] relative">
        {/* Editorial Number */}
        <div 
          className="absolute -top-20 right-10 text-[#F1F1F1] pointer-events-none"
          style={{ 
            fontFamily: 'Bodoni Moda, serif',
            fontSize: '300px',
            fontWeight: '700',
            opacity: '0.03',
            lineHeight: '1'
          }}
        >
          04
        </div>
        
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 
            className="text-5xl md:text-6xl mb-8 text-[#F1F1F1]"
            style={{ 
              fontFamily: 'Bodoni Moda, serif',
              fontWeight: '300',
              letterSpacing: '-0.04em',
              lineHeight: '0.9'
            }}
          >
            The Investment
          </h2>
          
          <p 
            className="text-2xl mb-12 text-[#F1F1F1]/80"
            style={{ 
              fontFamily: 'Inter, sans-serif',
              fontWeight: '200'
            }}
          >
            VIP starts at $10K for 90 days of transformation.
          </p>
          
          <p 
            className="text-lg text-[#F1F1F1]/60 max-w-2xl mx-auto"
            style={{ 
              fontFamily: 'Inter, sans-serif',
              fontWeight: '200'
            }}
          >
            Payment plans available. This isn't about the money - it's about 
            being ready to change everything. Most clients make their investment 
            back within the first 30 days.
          </p>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="px-6 py-32 bg-white relative">
        <div className="max-w-4xl mx-auto">
          <blockquote 
            className="text-3xl md:text-4xl text-center mb-8 text-[#171719]"
            style={{ 
              fontFamily: 'Bodoni Moda, serif',
              fontWeight: '300',
              fontStyle: 'italic'
            }}
          >
            "Sandra didn't just help me build a business. She helped me become 
            the woman who runs a $50K/month empire. Best investment I ever made."
          </blockquote>
          <p 
            className="text-center text-[#171719]/60"
            style={{ 
              fontFamily: 'Inter, sans-serif',
              fontWeight: '200'
            }}
          >
            — Rachel S., VIP Graduate
          </p>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-6 py-32 bg-[#F1F1F1]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 
            className="text-5xl md:text-6xl mb-8 text-[#171719]"
            style={{ 
              fontFamily: 'Bodoni Moda, serif',
              fontWeight: '300',
              letterSpacing: '-0.04em',
              lineHeight: '0.9'
            }}
          >
            One More Thing
          </h2>
          
          <p 
            className="text-xl text-[#171719] mb-12"
            style={{ 
              fontFamily: 'Inter, sans-serif',
              fontWeight: '200'
            }}
          >
            I only work with 8 women per quarter. If you're feeling that pull, 
            that "this is it" feeling - trust it. Your empire is waiting.
          </p>
          
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-[#171719] text-[#F1F1F1] hover:bg-[#171719]/90 text-lg px-12 py-6 uppercase tracking-widest rounded-none"
          >
            APPLY NOW
          </Button>
        </div>
      </section>
    </div>
  );
} 