import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Pricing() {
  const { toast } = useToast();
  const [user, setUser] = useState(null);

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

  const subscribeMutation = useMutation({
    mutationFn: async (priceId) => {
      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      if (!response.ok) throw new Error("Subscription failed");
      return response.json();
    },
    onSuccess: (data) => {
      if (data.url) window.location.href = data.url;
      else toast({ title: "Error", description: "No checkout URL.", variant: "destructive" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubscribe = (priceId) => {
    if (priceId === "coaching") return (window.location.href = "/apply");
    if (!user) return (window.location.href = "/login");
    subscribeMutation.mutate(priceId);
  };

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "For getting started with your selfie journey.",
      features: [
        "2 photo edits/mo",
        "1 caption generation/mo",
        "Basic pose tips",
        "3 Sandra messages/mo",
        "Access to community",
      ],
      buttonText: "Get Started Free",
      priceId: null,
    },
    {
      name: "SELFIE PRO",
      price: "$47",
      period: "per month",
      description: "Founding Member Launch: Full feature access at locked-in rate.",
      features: [
        "Unlimited photo editing",
        "Unlimited caption + hook AI",
        "Unlimited pose coaching",
        "Unlimited Sandra chat",
        "Instagram strategy support",
        "Priority assistance",
        "Advanced AI tools",
      ],
      buttonText: "Start Now",
      priceId: "pro",
    },
    {
      name: "EMPIRE BUILDER VIP",
      price: "Apply",
      period: "exclusive access",
      description: "Sandra builds your entire brand empire with you.",
      features: [
        "Funnels + landing pages built",
        "Automation setup (emails, ManyChat, upsells)",
        "Digital product creation",
        "Weekly 1:1 strategy calls",
        "Access to Sandra's template hub",
        "Custom brand assets",
        "Revenue scaling systems",
        "Direct WhatsApp access",
      ],
      buttonText: "Apply Now",
      priceId: "coaching",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header user={user} />

      {/* Hero */}
      <section className="py-24 px-4 bg-black text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-['Cormorant Garamond'] text-5xl md:text-6xl mb-6 tracking-wide uppercase">
            Choose Your Personal Branding Journey
          </h1>
          <div className="w-24 h-px mx-auto bg-white opacity-40 mb-6"></div>
          <p className="font-['Neue Einstellung'] text-lg max-w-2xl mx-auto opacity-80">
            Join thousands of women transforming their confidence and launching their dream brand with SELFIE AI™
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className="border border-black">
                <CardHeader className="p-10">
                  <div className="text-center">
                    <div className="text-4xl font-light mb-2 text-black" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                      {plan.price}
                    </div>
                    <div className="text-sm text-gray-500 uppercase tracking-wide mb-6" style={{ fontFamily: 'Neue Einstellung, sans-serif' }}>
                      {plan.period}
                    </div>
                    <CardTitle className="font-['Cormorant Garamond'] text-2xl uppercase mb-4 tracking-wide">
                      {plan.name}
                    </CardTitle>
                    <div className="w-12 h-px mx-auto bg-black mb-6"></div>
                    <p className="text-sm text-gray-600 font-['Neue Einstellung']">
                      {plan.description}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="px-10 pb-10">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="text-sm text-gray-700 font-['Neue Einstellung'] flex items-start">
                        <span className="w-1 h-1 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handleSubscribe(plan.priceId)}
                    className="w-full uppercase rounded-none bg-black text-white hover:bg-neutral-800 font-['Neue Einstellung'] py-3 tracking-wide text-sm"
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-['Cormorant Garamond'] text-3xl mb-6 uppercase tracking-wide">
            Trusted by thousands
          </h2>
          <div className="w-12 h-px mx-auto bg-black mb-8"></div>
          <div className="border border-gray-300 p-8 bg-white">
            <blockquote className="font-['Neue Einstellung'] text-gray-700 italic mb-4">
              "Sandra's platform gave me the confidence to show up authentically online. Within 3 months, I built a following of 50K and launched my own coaching business."
            </blockquote>
            <cite className="text-sm text-gray-500 font-['Neue Einstellung'] uppercase tracking-wide">
              — Sarah M., Brand Boss Academy Member
            </cite>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}