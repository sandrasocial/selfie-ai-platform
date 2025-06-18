
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Download, Eye, Calendar, Sparkles } from "lucide-react";
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

export default function Workbooks() {
  const { data: user } = useQuery({
    queryKey: ["/api/me"],
    retry: false,
  });

  const [workbooks, setWorkbooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkbooks = async () => {
      try {
        const response = await fetch('/api/workbooks', {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setWorkbooks(data);
        }
      } catch (error) {
        console.error('Failed to fetch workbooks:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchWorkbooks();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-light flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-headline mx-auto"></div>
          <p className="text-sm text-luxury-text-gray font-helvetica">Loading your workbooks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-light">
      <Header user={user} />

      {/* Hero Section */}
      <section className="section-luxury bg-luxury-headline text-luxury-white">
        <div className="container mx-auto px-4 text-center animate-fadeInUp">
          <h1 className="font-prata text-5xl md:text-6xl mb-6 text-luxury-white uppercase tracking-wide">
            Your Strategy Blueprint
          </h1>
          <div className="luxury-divider mb-8" style={{backgroundColor: '#B5B5B3'}}></div>
          <p className="font-helvetica text-xl text-luxury-light max-w-2xl mx-auto text-block-luxury">
            Custom-built from your answers. This is the roadmap to your personal brand power.
          </p>
        </div>
      </section>

      <main className="section-luxury bg-luxury-white">
        <div className="max-w-6xl mx-auto px-4">
          
          {workbooks.length > 0 ? (
            <div className="space-y-12">
              {/* Workbooks Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {workbooks.map((workbook, index) => (
                  <Card key={workbook.id} className={`card-editorial bg-luxury-white border-luxury-accent animate-fadeInUp animate-delay-${(index % 3 + 1) * 100}`}>
                    <div className="relative">
                      <ImagePlaceholder 
                        label={`Workbook ${workbook.id} Cover`}
                        width="2480"
                        height="3508"
                        className="w-full h-48"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-luxury-headline/70 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <Badge variant="secondary" className="mb-2 bg-luxury-accent text-luxury-headline">
                          <BookOpen className="w-3 h-3 mr-1" />
                          WORKBOOK
                        </Badge>
                        <h3 className="font-prata text-lg text-luxury-white leading-tight">
                          {workbook.title || 'Your Personal Brand Blueprint'}
                        </h3>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-4 h-4 text-luxury-accent" />
                        <span className="text-xs text-luxury-text-gray font-helvetica">
                          Created {new Date(workbook.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-luxury-text-gray text-sm font-helvetica mb-4">
                        {workbook.personalizedStrategy?.substring(0, 100)}...
                      </p>
                      <div className="flex gap-2">
                        <Link href={`/workbook/${workbook.id}`}>
                          <Button className="btn-primary flex-1">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </Link>
                        <Button 
                          className="btn-secondary"
                          onClick={() => window.open(`/api/workbook/${workbook.id}/pdf`, '_blank')}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Action Section */}
              <Card className="card-editorial bg-luxury-light border-luxury-accent">
                <CardContent className="p-8 text-center">
                  <h3 className="font-prata text-2xl text-luxury-headline mb-4 uppercase tracking-wide">
                    Ready to Show Up for Her?
                  </h3>
                  <div className="luxury-divider mb-6"></div>
                  <p className="text-luxury-text-gray font-helvetica mb-6 max-w-md mx-auto">
                    Take your strategy and turn it into consistent, powerful content.
                  </p>
                  <Link href="/content-vault">
                    <Button className="btn-primary">
                      Open My Vault
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Empty State */
            <Card className="card-editorial bg-luxury-white border-luxury-accent animate-fadeInUp">
              <CardContent className="p-12 text-center">
                <BookOpen className="w-16 h-16 mx-auto text-luxury-accent mb-6" />
                <h2 className="font-prata text-2xl text-luxury-headline mb-4 uppercase tracking-wide">
                  Create Your First Strategy Blueprint
                </h2>
                <div className="luxury-divider mb-6"></div>
                <p className="text-luxury-text-gray font-helvetica mb-8 max-w-md mx-auto">
                  Answer a few questions about your story and goals, and get a personalized brand strategy workbook.
                </p>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="p-6 bg-luxury-light border border-luxury-accent">
                    <h4 className="font-prata text-lg text-luxury-headline mb-2 uppercase tracking-wide">Module 1</h4>
                    <p className="text-luxury-text-gray text-sm font-helvetica mb-3">
                      Discover your authentic story and unique positioning.
                    </p>
                    <Link href="/courses/branded-by-selfie/module-1">
                      <Button className="btn-secondary w-full text-sm">
                        Start Module 1
                      </Button>
                    </Link>
                  </div>
                  <div className="p-6 bg-luxury-light border border-luxury-accent">
                    <h4 className="font-prata text-lg text-luxury-headline mb-2 uppercase tracking-wide">Module 2</h4>
                    <p className="text-luxury-text-gray text-sm font-helvetica mb-3">
                      Build your magnetic message and brand voice.
                    </p>
                    <Link href="/courses/branded-by-selfie/module-2">
                      <Button className="btn-secondary w-full text-sm">
                        Start Module 2
                      </Button>
                    </Link>
                  </div>
                </div>
                <Link href="/courses/branded-by-selfie">
                  <Button className="btn-primary">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Begin Your Brand Journey
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
