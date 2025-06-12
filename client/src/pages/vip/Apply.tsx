
import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

const vipApplicationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  instagram: z.string().min(1, 'Instagram handle is required'),
  website: z.string().optional(),
  currentBusiness: z.string().min(10, 'Please provide more details about your current business'),
  whyVIP: z.string().min(10, 'Please tell us why you want to join VIP'),
  goals: z.string().min(10, 'Please describe your goals in detail'),
  budget: z.string().min(1, 'Please select your investment range'),
});

type VipApplicationForm = z.infer<typeof vipApplicationSchema>;

export default function Apply() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<VipApplicationForm>({
    resolver: zodResolver(vipApplicationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      instagram: '',
      website: '',
      currentBusiness: '',
      whyVIP: '',
      goals: '',
      budget: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: VipApplicationForm) => {
      return await apiRequest('POST', '/api/vip/apply', data);
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted Successfully!",
        description: "We'll review your application and get back to you within 48 hours.",
      });
      setLocation('/thank-you/vip');
    },
    onError: (error: any) => {
      toast({
        title: "Application Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: VipApplicationForm) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      {/* Header Section */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="w-16 h-16 bg-[#171719] flex items-center justify-center mx-auto mb-8">
            <div className="w-8 h-8 bg-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl mb-6 text-[#171719]" style={{ fontFamily: 'Cormorant Garamond', fontWeight: 400 }}>
            Empire Builder VIP Application
          </h1>
          <p className="text-xl text-[#4C4B4B] max-w-2xl mx-auto font-light" style={{ fontFamily: 'Neue Einstellung' }}>
            Ready to transform your business with personalized guidance? Fill out this application to join our exclusive VIP program.
          </p>
        </div>
      </section>

      {/* Application Form */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-white border border-[#B5B5B3]">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl text-[#171719] mb-4" style={{ fontFamily: 'Cormorant Garamond', fontWeight: 400 }}>
                Tell Us About Yourself
              </CardTitle>
              <CardDescription className="text-[#4C4B4B] font-light" style={{ fontFamily: 'Neue Einstellung' }}>
                All fields marked with * are required. This information helps us create a personalized strategy for your success.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#171719] font-normal" style={{ fontFamily: 'Neue Einstellung' }}>Full Name *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your full name" 
                              className="border-[#B5B5B3] focus:border-[#171719]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#171719] font-normal" style={{ fontFamily: 'Neue Einstellung' }}>Email Address *</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="your@email.com" 
                              className="border-[#B5B5B3] focus:border-[#171719]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="instagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#171719] font-normal" style={{ fontFamily: 'Neue Einstellung' }}>Instagram Handle *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="@yourusername" 
                              className="border-[#B5B5B3] focus:border-[#171719]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#171719] font-normal" style={{ fontFamily: 'Neue Einstellung' }}>Website (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://yourwebsite.com" 
                              className="border-[#B5B5B3] focus:border-[#171719]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Business Information */}
                  <FormField
                    control={form.control}
                    name="currentBusiness"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#171719] font-normal" style={{ fontFamily: 'Neue Einstellung' }}>Tell us about your current business *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe what you do, your target audience, current revenue, team size, etc." 
                            className="min-h-[120px] border-[#B5B5B3] focus:border-[#171719]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="whyVIP"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#171719] font-normal" style={{ fontFamily: 'Neue Einstellung' }}>Why do you want to join Empire Builder VIP? *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What specific challenges are you facing? What attracted you to this program?" 
                            className="min-h-[120px] border-[#B5B5B3] focus:border-[#171719]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="goals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#171719] font-normal" style={{ fontFamily: 'Neue Einstellung' }}>What are your goals for the next 12 months? *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Revenue goals, audience growth, brand development, specific milestones, etc." 
                            className="min-h-[120px] border-[#B5B5B3] focus:border-[#171719]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#171719] font-normal" style={{ fontFamily: 'Neue Einstellung' }}>Investment Range *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-[#B5B5B3] focus:border-[#171719]">
                              <SelectValue placeholder="Select your investment range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="$5,000 - $7,500">$5,000 - $7,500</SelectItem>
                            <SelectItem value="$7,500 - $10,000">$7,500 - $10,000</SelectItem>
                            <SelectItem value="$10,000 - $15,000">$10,000 - $15,000</SelectItem>
                            <SelectItem value="$15,000+">$15,000+</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <div className="pt-8">
                    <Button 
                      type="submit" 
                      disabled={mutation.isPending}
                      className="w-full bg-transparent border-2 border-[#171719] text-[#171719] hover:bg-[#171719] hover:text-white font-light text-sm uppercase tracking-wide py-4 transition-all duration-300"
                      style={{ fontFamily: 'Neue Einstellung' }}
                    >
                      {mutation.isPending ? 'SUBMITTING APPLICATION...' : 'SUBMIT VIP APPLICATION'}
                    </Button>
                  </div>

                  <p className="text-sm text-[#4C4B4B] text-center font-light pt-4" style={{ fontFamily: 'Neue Einstellung' }}>
                    By submitting this application, you agree to be contacted by our team regarding the VIP program.
                    We'll review your application within 48 hours and schedule a strategy call if you're a good fit.
                  </p>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
