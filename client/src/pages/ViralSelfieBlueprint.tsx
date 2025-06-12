import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import CourseChat from "@/components/chat/CourseChat";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useSessionReady } from "@/hooks/useSessionReady";
import coverImage from "@assets/1.png";

export default function ViralSelfieBlueprint() {
  const { user: supabaseUser, sessionReady } = useSupabaseAuth();
  const { isReady } = useSessionReady();
  const { data: user } = useQuery({ 
    queryKey: ["/api/me"], 
    retry: false,
    enabled: isReady && sessionReady && !!supabaseUser?.id
  });
  const [showSandraChat, setShowSandraChat] = useState(false);

  return (
    <div className="min-h-screen bg-luxury-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${coverImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/40" />
        <div className="relative z-10 text-center text-white max-w-5xl px-6 animate-fade-in">
          <p className="text-xs uppercase tracking-[0.3em] mb-4 font-sans" style={{ color: '#F1F1F1' }}>
            PREMIUM COURSE
          </p>
          <h1 className="text-6xl font-light mb-6 leading-tight font-prata uppercase">
            The Viral Selfie<br />Blueprint™
          </h1>
          <p className="text-xl font-sans opacity-90">
            Become Magnetic
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-24 space-y-24">
        {/* Launch Notice */}
        <Card className="bg-luxury-light border border-luxury-accent card-editorial">
          <CardContent className="text-center p-12">
            <p className="text-xs uppercase tracking-[0.25em] font-sans mb-8 text-luxury-text-gray">
              Launching Soon for Founding Members
            </p>
            <h2 className="font-prata text-4xl text-luxury-headline mb-6">
              The Viral Selfie Blueprint™ is being elevated.
            </h2>
            <p className="font-helvetica text-luxury-text-gray text-lg max-w-3xl mx-auto mb-10 leading-relaxed">
              All 5 modules are being transformed into an ultra-personalized, high-end course experience. You'll be the first to unlock the full power of SELFIE AI™ strategy the moment it drops.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div>
                <h4 className="font-prata text-lg text-luxury-headline mb-2 uppercase">Modules 1–5</h4>
                <p className="font-helvetica text-luxury-text-gray text-sm">Complete transformation curriculum</p>
              </div>
              <div>
                <h4 className="font-prata text-lg text-luxury-headline mb-2 uppercase">AI Workbooks</h4>
                <p className="font-helvetica text-luxury-text-gray text-sm">Personalized branding & content plans</p>
              </div>
              <div>
                <h4 className="font-prata text-lg text-luxury-headline mb-2 uppercase">Founding Access</h4>
                <p className="font-helvetica text-luxury-text-gray text-sm">Early unlock + lifetime perks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sandra AI */}
        <Card className="bg-luxury-white border border-luxury-accent card-editorial">
          <CardContent className="p-8 flex justify-between items-center">
            <div className="text-left">
              <h3 className="font-prata text-xl text-luxury-headline mb-2 uppercase">Need help?</h3>
              <p className="font-helvetica text-luxury-text-gray">Sandra AI is here for 1:1 support and brand coaching.</p>
            </div>
            <Button className="btn-primary" onClick={() => setShowSandraChat(true)}>
              Chat with Sandra
            </Button>
          </CardContent>
        </Card>

        {/* Available Tools */}
        <Card className="bg-luxury-light border border-luxury-accent card-editorial">
          <CardContent className="p-10">
            <h2 className="font-prata text-3xl text-center text-luxury-headline mb-10 uppercase tracking-wide">
              Tools You Can Use Right Now
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-luxury-white p-6">
                <h4 className="font-prata text-lg text-luxury-headline mb-2 uppercase">30-Day Templates</h4>
                <p className="font-helvetica text-luxury-text-gray mb-4 text-sm">
                  Get access to our complete daily content system: hooks, captions, story slides.
                </p>
                <Link href="/templates">
                  <Button className="btn-secondary w-full">Access Templates</Button>
                </Link>
              </div>
              <div className="bg-luxury-white p-6">
                <h4 className="font-prata text-lg text-luxury-headline mb-2 uppercase">AI Studio</h4>
                <p className="font-helvetica text-luxury-text-gray mb-4 text-sm">
                  Create with AI tools for reels, captions, mood-based content & more.
                </p>
                <Link href="/studio">
                  <Button className="btn-secondary w-full">Open Studio</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {showSandraChat && <CourseChat onClose={() => setShowSandraChat(false)} />}
      <Footer />
    </div>
  );
}