import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ExternalLink, ImageIcon, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { Link } from 'wouter';

const ImagePlaceholder = ({ label, width, height, className = "" }: { 
  label: string; 
  width?: string; 
  height?: string; 
  className?: string; 
}) => (
  <div
    style={{
      backgroundColor: '#F1F1F1',
      width: width || '100%',
      height: height || '400px',
      border: '2px dashed #B5B5B3',
    }}
    className={`flex items-center justify-center font-helvetica text-sm text-luxury-text-gray ${className}`}
  >
    <div className="text-center">
      <div>Upload {label}</div>
      <div className="text-xs mt-1">Suggested size: {width} x {height}</div>
    </div>
  </div>
);

export default function Templates() {
  const { data: user } = useQuery({
    queryKey: ["/api/me"],
    retry: false,
  });

  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const isPro = user?.plan === 'pro';

  const templateCards = [
    {
      id: 1,
      title: "Day 1: Introduce Yourself (but with energy)",
      description: "Make your first impression count with authentic energy",
      category: "Introduction",
      imagePlaceholder: "1200x800",
      generatorUrl: "/studio/content-generator?prompt=introduce-yourself",
      coverImage: "/assets/templates/day1-intro.jpg"
    },
    {
      id: 2,
      title: "Day 15: That One Turning Point",
      description: "Share the moment that changed everything for you",
      category: "Story",
      imagePlaceholder: "1200x800"
    },
    {
      id: 3,
      title: "Day 30: Your Future Self. In Focus.",
      description: "Paint the picture of where you're headed",
      category: "Vision",
      imagePlaceholder: "1200x800"
    },
    {
      id: 4,
      title: "Monday Motivation",
      description: "Start the week with intention and power",
      category: "Weekly",
      imagePlaceholder: "1200x800"
    },
    {
      id: 5,
      title: "Behind the Scenes",
      description: "Show the real work behind your success",
      category: "Authentic",
      imagePlaceholder: "1200x800"
    },
    {
      id: 6,
      title: "Transformation Tuesday", 
      description: "Before and after your mindset shift",
      category: "Growth",
      imagePlaceholder: "1200x800"
    }
  ];

  return (
    <div className="min-h-screen bg-luxury-light">
      <Header user={user} />

      <section className="section-luxury bg-luxury-headline text-luxury-white">
        <div className="container mx-auto px-4 text-center animate-fadeInUp">
          <h1 className="font-prata text-5xl md:text-6xl mb-6 text-luxury-white uppercase tracking-wide">
            Your Daily Content Vault
          </h1>
          <div className="luxury-divider mb-8" style={{backgroundColor: '#B5B5B3'}}></div>
          <p className="font-helvetica text-xl text-luxury-light max-w-2xl mx-auto text-block-luxury">
            30 days of branded prompts, ready to post. All you. All intentional.
          </p>
        </div>
      </section>

      <main className="section-luxury bg-luxury-white">
        <div className="px-4 max-w-6xl mx-auto">
          <div className="space-y-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {templateCards.map((template, index) => (
                <Card key={template.id} className="card-editorial bg-luxury-white border-luxury-accent">
                  <div className="relative">
                    <ImagePlaceholder 
                      label={`Template ${template.id} Cover`}
                      width="1200"
                      height="800"
                      className="w-full h-48"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-luxury-headline/70 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge variant="secondary" className="mb-2 bg-luxury-accent text-luxury-headline">
                        {template.category}
                      </Badge>
                      <h3 className="font-prata text-lg text-luxury-white leading-tight">
                        {template.title}
                      </h3>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-luxury-text-gray text-sm font-helvetica mb-4">
                      {template.description}
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="btn-primary w-full"
                          onClick={() => setSelectedTemplate(template)}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Use Template
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="font-prata text-xl text-luxury-headline">
                            {template.title}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <ImagePlaceholder 
                            label={`Template ${template.id} Preview`}
                            width="800"
                            height="1000"
                            className="w-full h-64"
                          />
                          <p className="text-luxury-text-gray font-helvetica">
                            {template.description}
                          </p>
                          <div className="flex gap-3">
                            <Button className="btn-primary flex-1">
                              <Download className="w-4 h-4 mr-2" />
                              Download Template
                            </Button>
                            <Button className="btn-secondary">
                              Customize
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}