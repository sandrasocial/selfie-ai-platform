import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function OfferUpsell() {
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userResponse = await fetch("/api/me", {
          credentials: "include",
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        }
      } catch (error) {
        console.log("User not authenticated");
      }
    };
    loadUserData();
  }, []);

  const upsellMutation = useMutation({
    mutationFn: async (action: 'accept' | 'decline') => {
      const response = await fetch("/api/upsell-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!response.ok) throw new Error("Failed to process upsell");
      return response.json();
    },
    onSuccess: (data) => {
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const handleUpsell = (action: 'accept' | 'decline') => {
    upsellMutation.mutate(action);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header user={user} />
      <main className="container mx-auto px-6 py-24">
        <div className="text-center mb-20">
          <p className="font-['Neue Einstellung'] uppercase text-sm tracking-[0.15em] text-gray-700 mb-4">
            Exclusive Offer
          </p>
          <h1 className="font-['Cormorant Garamond'] text-5xl text-black mb-6">
            Perfect. Now Let's Supercharge Your Success
          </h1>
          <p className="text-lg font-['Neue Einstellung'] text-gray-700 max-w-2xl mx-auto">
            You're about to unlock SELFIE PRO, but this is your one-time chance to access the full Branded By Selfie™ course and scale like a pro.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-[#FAFAF9] border border-gray-200">
            <CardHeader className="text-center">
              <CardTitle className="font-['Cormorant Garamond'] text-4xl text-black mb-4">
                Branded By Selfie™
              </CardTitle>
              <div className="text-black text-3xl font-['Neue Einstellung'] mb-2">$147</div>
              <div className="text-gray-500 text-sm line-through font-['Neue Einstellung'] mb-1">$497</div>
              <div className="text-xs font-['Neue Einstellung'] uppercase tracking-widest text-red-600 mb-4">
                70% Off — Today Only
              </div>
              <p className="text-sm text-gray-600 font-['Neue Einstellung']">One-time payment • Lifetime Access</p>
            </CardHeader>

            <CardContent className="pt-8 pb-12 px-8">
              <h3 className="text-lg text-black font-semibold text-center mb-6 font-['Neue Einstellung']">
                Here's what you'll get:
              </h3>
              <ul className="grid md:grid-cols-2 gap-4 text-sm text-gray-800 font-['Neue Einstellung'] mb-10">
                <li>— Personal Branding Blueprint</li>
                <li>— Viral Content Strategy Framework</li>
                <li>— 6-Figure Funnel Templates</li>
                <li>— Brand Positioning Masterclass</li>
                <li>— Content Calendar System</li>
                <li>— Audience Growth Strategies</li>
                <li>— Monetization Playbook</li>
                <li>— Live Q&A Sessions with Sandra</li>
              </ul>

              <div className="text-center bg-white border border-gray-200 p-4 mb-8">
                <p className="text-xs font-['Neue Einstellung'] text-gray-700 tracking-wide uppercase">
                  Offer expires in 24 hours
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={() => handleUpsell('accept')}
                  disabled={upsellMutation.isPending}
                  className="w-full bg-black text-white rounded-none py-4 font-['Neue Einstellung'] uppercase tracking-wider"
                >
                  {upsellMutation.isPending ? "Processing..." : "Yes, Add This to My Order"}
                </Button>
                <Button
                  onClick={() => handleUpsell('decline')}
                  disabled={upsellMutation.isPending}
                  variant="ghost"
                  className="w-full text-gray-600 font-['Neue Einstellung'] uppercase tracking-wider"
                >
                  No Thanks, Just Give Me SELFIE PRO
                </Button>
              </div>

              <div className="mt-10 text-center">
                <p className="italic text-sm text-gray-600 font-['Neue Einstellung'] max-w-md mx-auto">
                  "The branding course helped me go from 500 to 50K followers in 3 months." — Jessica M.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}