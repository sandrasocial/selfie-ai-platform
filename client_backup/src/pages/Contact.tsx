import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, Send } from "lucide-react";
import { useMutation } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const submitContactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to send message');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "Thanks, we'll be in touch shortly."
      });
      setFormData({ name: '', email: '', message: '' });
    },
    onError: (error: Error) => {
      toast({
        title: "Send Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Required Fields",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }
    submitContactMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      <Header />

      {/* Hero Section */}
      <section className="bg-[#171719] py-20">
        <div className="container mx-auto px-6 md:px-4 text-center">
          <h1 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl md:text-5xl font-normal text-white mb-8 uppercase tracking-wide leading-tight">
            Contact Us
          </h1>
          <div className="w-24 h-px bg-white mx-auto mb-10"></div>
          <p className="font-['Helvetica'] text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            Get in touch with the SELFIE AI™ team. We're here to help you build your authentic personal brand.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 md:px-4 max-w-2xl">
          <Card className="bg-white border-[#E8E8E8] shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 font-['Cormorant_Garamond'] text-xl uppercase tracking-wide">
                <MessageSquare className="w-5 h-5" />
                Send Us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Tell us how we can help you..."
                    rows={6}
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={submitContactMutation.isPending}
                  className="w-full bg-transparent border border-[#171719] text-[#171719] hover:bg-[#171719] hover:text-white uppercase tracking-wide"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {submitContactMutation.isPending ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="mt-12 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-[#4C4B4B]" />
              <span className="font-['Helvetica'] text-[#4C4B4B]">
                For urgent matters, email us directly at 
                <a href="mailto:hello@sselfie.ai" className="ml-1 text-[#171719] underline">
                  hello@sselfie.ai
                </a>
              </span>
            </div>
            <p className="font-['Helvetica'] text-sm text-[#4C4B4B]">
              We typically respond within 24 hours during business days.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}