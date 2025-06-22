
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { useLocation } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function EmpireBuilderVIP() {
  const [, setLocation] = useLocation();

  const programFeatures = [
    "Private weekly 1:1 coaching calls",
    "Brand strategy blueprint + story work", 
    "Instagram + sales page audits",
    "AI-powered content workflows",
    "Confidence coaching + mindset rituals",
    "Access to all courses (Selfie Starter Kit + Branded)",
    "Personal dashboard"
  ];

  const whoItsFor = [
    "You're making $5K+ per month but feel stuck",
    "You have a clear vision but need strategy",
    "You're ready to invest in premium mentorship",
    "You want to become known as THE expert",
    "You're committed to showing up consistently"
  ];

  const whoItsNotFor = [
    "You're just starting out in business",
    "You want quick fixes or magic solutions", 
    "You're not ready to invest in yourself",
    "You prefer DIY approaches over mentorship",
    "You're looking for the cheapest option"
  ];

  const testimonials = [
    {
      quote: "Sandra helped me go from invisible to industry leader in 6 months. My confidence and revenue both tripled.",
      author: "Sarah M.",
      title: "Marketing Consultant"
    },
    {
      quote: "The VIP experience gave me clarity I'd been searching for years. Now I attract dream clients effortlessly.",
      author: "Jessica K.", 
      title: "Life Coach"
    },
    {
      quote: "Working with Sandra 1:1 transformed not just my business, but how I show up in the world. Priceless.",
      author: "Amanda R.",
      title: "Online Educator"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-center">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: `linear-gradient(rgba(23, 23, 25, 0.4), rgba(23, 23, 25, 0.4)), url('https://i.postimg.cc/fLSsQQth/IMG-6384-jpg.jpg')` 
          }} 
        />
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <h1 
            className="text-6xl md:text-7xl font-normal mb-4 text-white leading-tight"
            className="font-cormorant"
          >
            Build Your Brand.
          </h1>
          <h2 
            className="text-4xl md:text-5xl font-normal italic mb-8 text-white leading-tight"
            className="font-cormorant"
          >
            Step Into Empire Energy.
          </h2>
          <p 
            className="text-lg text-white/90 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
            className="font-neue"
          >
            Personalized mentorship for the woman ready to lead with her story, strategy, and presence.
          </p>
          <Button 
            onClick={() => setLocation('/vip/apply')} 
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#171719] font-normal uppercase tracking-wide px-8 py-3 text-sm transition-all duration-300"
            className="font-neue"
          >
            APPLY NOW
          </Button>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 
              className="text-5xl md:text-6xl font-normal mb-6 text-[#171719]"
              className="font-cormorant"
            >
              What's Inside Empire Builder VIP
            </h2>
            <p 
              className="text-lg text-[#4C4B4B] max-w-3xl mx-auto font-light"
              className="font-neue"
            >
              Everything you need to build an empire-level personal brand that attracts premium opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 
                className="text-3xl font-normal text-[#171719] mb-8"
                className="font-cormorant"
              >
                Your VIP Experience Includes:
              </h3>
              <div className="space-y-4">
                {programFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <Check className="w-5 h-5 text-[#4C4B4B] mt-1 flex-shrink-0" />
                    <span 
                      className="text-base text-[#4C4B4B] font-light"
                      className="font-neue"
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="bg-white border border-[#B5B5B3] shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-8">
                <h4 
                  className="text-2xl font-normal text-[#171719] mb-4"
                  className="font-cormorant"
                >
                  Premium Mentorship
                </h4>
                <p 
                  className="text-[#4C4B4B] leading-relaxed font-light"
                  className="font-neue"
                >
                  This isn't just coaching—it's a complete transformation. You'll work directly with Sandra to build 
                  an empire-level brand that positions you as the go-to expert in your field.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Who It's For / Who It's Not */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-5xl md:text-6xl font-normal text-[#171719] text-center mb-16"
            className="font-cormorant"
          >
            Is Empire Builder VIP Right For You?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Who It's For */}
            <Card className="bg-[#F1F1F1] border border-[#B5B5B3] hover:scale-105 transition-transform duration-300">
              <CardContent className="p-8">
                <h3 
                  className="text-3xl font-normal text-[#171719] mb-8 text-center"
                  className="font-cormorant"
                >
                  This Is For You If:
                </h3>
                <div className="space-y-4">
                  {whoItsFor.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <Check className="w-5 h-5 text-[#4C4B4B] mt-1 flex-shrink-0" />
                      <span 
                        className="text-[#4C4B4B] font-light"
                        className="font-neue"
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Who It's Not For */}
            <Card className="bg-[#171719] border border-[#171719] hover:scale-105 transition-transform duration-300">
              <CardContent className="p-8">
                <h3 
                  className="text-3xl font-normal text-white mb-8 text-center"
                  className="font-cormorant"
                >
                  This Is NOT For You If:
                </h3>
                <div className="space-y-4">
                  {whoItsNotFor.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <X className="w-5 h-5 text-white/60 mt-1 flex-shrink-0" />
                      <span 
                        className="text-white/80 font-light"
                        className="font-neue"
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-5xl md:text-6xl font-normal text-[#171719] text-center mb-16"
            className="font-cormorant"
          >
            Empire Builder Success Stories
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white border border-[#B5B5B3] shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300">
                <CardContent className="p-8">
                  <blockquote 
                    className="text-[#4C4B4B] leading-relaxed mb-6 italic font-normal text-lg"
                    className="font-cormorant"
                  >
                    "{testimonial.quote}"
                  </blockquote>
                  <div>
                    <p 
                      className="font-normal text-[#171719]"
                      className="font-neue"
                    >
                      {testimonial.author}
                    </p>
                    <p 
                      className="text-[#B5B5B3] text-sm font-light"
                      className="font-neue"
                    >
                      {testimonial.title}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-[#171719]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="text-5xl md:text-6xl font-normal text-white mb-8"
            className="font-cormorant"
          >
            Investment In Your Empire
          </h2>
          <p 
            className="text-xl text-white/80 mb-8 max-w-2xl mx-auto font-light"
            className="font-neue"
          >
            Starts at $3,000. Full pricing shared during discovery call.
          </p>
          <p 
            className="text-white/60 mb-12 font-light"
            className="font-neue"
          >
            This is a premium mentorship experience designed for serious entrepreneurs ready to invest in their empire.
          </p>
          <Button 
            onClick={() => setLocation('/vip/apply')} 
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#171719] font-normal uppercase tracking-wide px-8 py-3 text-sm transition-all duration-300"
            className="font-neue"
          >
            APPLY NOW
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
