import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, HelpCircle, BookOpen, Video, Mail } from "lucide-react";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Support() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I access my purchased courses?",
      answer: "After purchase, you'll receive an email with access instructions. You can also access your courses through the Dashboard by clicking 'My Courses' or visiting /courses directly."
    },
    {
      question: "What's included in the Selfie Starter Kit?",
      answer: "The Starter Kit includes a comprehensive video masterclass on selfie techniques, brand development guidance, and implementation strategies. You'll learn lighting, angles, and authentic personal branding fundamentals."
    },
    {
      question: "How does the AI content generation work?",
      answer: "Our Sandra AI analyzes your brand profile and preferences to generate personalized content suggestions, captions, and strategies that align with your unique voice and aesthetic."
    },
    {
      question: "Can I cancel my VIP Empire Builder subscription?",
      answer: "Yes, you can cancel your subscription at any time through your account settings. You'll retain access until the end of your current billing period."
    },
    {
      question: "How do I update my profile information?",
      answer: "Visit your My Account page to update your profile details, including name, email, and brand preferences. Changes are saved automatically."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards through Stripe's secure payment processing. Your payment information is encrypted and never stored on our servers."
    },
    {
      question: "How do I download my generated content?",
      answer: "Generated content can be downloaded directly from the studio tools. Look for the download button next to each generated piece, or export multiple items at once."
    },
    {
      question: "Is there a mobile app available?",
      answer: "Currently, SELFIE AI is a web-based platform optimized for all devices. You can access all features through your mobile browser with full functionality."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      <Header />

      {/* Hero Section */}
      <section className="bg-[#171719] py-20">
        <div className="container mx-auto px-6 md:px-4 text-center">
          <h1 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl md:text-5xl font-normal text-white mb-8 uppercase tracking-wide leading-tight">
            Support Center
          </h1>
          <div className="w-24 h-px bg-white mx-auto mb-10"></div>
          <p className="font-['Helvetica'] text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions and get the help you need to maximize your SELFIE AI™ experience.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 md:px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-['Cormorant_Garamond'] text-2xl md:text-3xl font-normal text-[#171719] mb-4 uppercase tracking-wide">
              Frequently Asked Questions
            </h2>
            <p className="font-['Helvetica'] text-[#4C4B4B]">
              Quick answers to the most common questions about SELFIE AI™
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-white border-[#E8E8E8] shadow-sm">
                <CardHeader>
                  <Button
                    variant="ghost"
                    onClick={() => toggleFaq(index)}
                    className="w-full justify-between p-0 h-auto font-normal text-left"
                  >
                    <CardTitle className="flex items-center gap-3 font-['Helvetica'] text-base font-medium text-[#171719]">
                      <HelpCircle className="w-5 h-5 flex-shrink-0" />
                      {faq.question}
                    </CardTitle>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 flex-shrink-0" />
                    )}
                  </Button>
                </CardHeader>
                {openFaq === index && (
                  <CardContent className="pt-0">
                    <p className="font-['Helvetica'] text-[#4C4B4B] leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Additional Support Options */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white border-[#E8E8E8] shadow-sm text-center">
              <CardContent className="pt-8">
                <BookOpen className="w-12 h-12 text-[#4C4B4B] mx-auto mb-4" />
                <h3 className="font-['Cormorant_Garamond'] text-lg font-normal text-[#171719] mb-2 uppercase tracking-wide">
                  Documentation
                </h3>
                <p className="font-['Helvetica'] text-sm text-[#4C4B4B] mb-4">
                  Comprehensive guides and tutorials for all platform features.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-[#171719] text-[#171719] hover:bg-[#171719] hover:text-white"
                >
                  View Docs
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E8E8E8] shadow-sm text-center">
              <CardContent className="pt-8">
                <Video className="w-12 h-12 text-[#4C4B4B] mx-auto mb-4" />
                <h3 className="font-['Cormorant_Garamond'] text-lg font-normal text-[#171719] mb-2 uppercase tracking-wide">
                  Video Tutorials
                </h3>
                <p className="font-['Helvetica'] text-sm text-[#4C4B4B] mb-4">
                  Step-by-step video guides for getting the most from your tools.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-[#171719] text-[#171719] hover:bg-[#171719] hover:text-white"
                >
                  Watch Videos
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E8E8E8] shadow-sm text-center">
              <CardContent className="pt-8">
                <Mail className="w-12 h-12 text-[#4C4B4B] mx-auto mb-4" />
                <h3 className="font-['Cormorant_Garamond'] text-lg font-normal text-[#171719] mb-2 uppercase tracking-wide">
                  Direct Support
                </h3>
                <p className="font-['Helvetica'] text-sm text-[#4C4B4B] mb-4">
                  Can't find what you're looking for? Contact our support team.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = '/contact'}
                  className="border-[#171719] text-[#171719] hover:bg-[#171719] hover:text-white"
                >
                  Contact Us
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}