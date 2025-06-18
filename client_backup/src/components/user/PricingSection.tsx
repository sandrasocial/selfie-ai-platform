import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

interface PricingSectionProps {
  user?: any;
}

export default function PricingSection({ user }: PricingSectionProps) {
  const { toast } = useToast();

  const subscriptionMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/create-subscription"),
    onSuccess: (response) => {
      // In a real app, you would redirect to Stripe checkout here
      toast({ 
        title: "Redirecting to checkout...",
        description: "You'll be redirected to Stripe to complete your subscription"
      });
      // window.location.href = stripeCheckoutUrl;
    },
    onError: (error: any) => {
      toast({
        title: "Checkout failed",
        description: error.message || "Failed to start checkout process",
        variant: "destructive",
      });
    },
  });

  const handleSelectFreePlan = () => {
    if (user) {
      toast({ title: "You're already on the free plan!" });
    } else {
      toast({ 
        title: "Sign up to get started",
        description: "Create an account to start using SELFIE AI™"
      });
    }
  };

  const handleSelectProPlan = () => {
    if (!user) {
      toast({ 
        title: "Authentication required",
        description: "Please sign in to upgrade to Pro",
        variant: "destructive"
      });
      return;
    }

    if (user.plan === "pro") {
      toast({ title: "You're already on the Pro plan!" });
      return;
    }

    subscriptionMutation.mutate();
  };

  return (
    <section className="w-full py-20 px-4" id="pricing">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-prata text-3xl md:text-4xl mb-6">Simple, Transparent Pricing</h2>
          <p className="text-xl text-brand-gray">Choose the plan that fits your content creation needs.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Plan */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="font-prata text-2xl mb-2">Free</h3>
                <div className="text-4xl font-semibold mb-4">
                  $0<span className="text-lg text-brand-gray font-normal">/month</span>
                </div>
                <p className="text-brand-gray">Perfect for getting started</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="text-brand-success mr-3" size={20} />
                  <span>1 selfie upload per month</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-brand-success mr-3" size={20} />
                  <span>Full AI content preview</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-brand-success mr-3" size={20} />
                  <span>Captions, affirmations & tips</span>
                </li>
                <li className="flex items-center text-brand-gray">
                  <X className="text-gray-300 mr-3" size={20} />
                  <span>PDF downloads</span>
                </li>
                <li className="flex items-center text-brand-gray">
                  <X className="text-gray-300 mr-3" size={20} />
                  <span>Content Vault access</span>
                </li>
              </ul>
              
              <Button 
                variant="outline" 
                className="w-full border-brand-brown text-brand-brown hover:bg-brand-brown hover:text-white"
                onClick={handleSelectFreePlan}
              >
                Get Started Free
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="bg-brand-brown text-white shadow-lg relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-white text-brand-brown">Most Popular</Badge>
            </div>
            
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="font-prata text-2xl mb-2">Pro</h3>
                <div className="text-4xl font-semibold mb-4">
                  $19<span className="text-lg opacity-75 font-normal">/month</span>
                </div>
                <p className="opacity-75">For serious content creators</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="text-white mr-3" size={20} />
                  <span>Unlimited selfie uploads</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-white mr-3" size={20} />
                  <span>Full AI content suite</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-white mr-3" size={20} />
                  <span>PDF downloads with branding</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-white mr-3" size={20} />
                  <span>Content Vault access</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-white mr-3" size={20} />
                  <span>Sandra's Selfie Starter Kit</span>
                </li>
              </ul>
              
              <Button 
                variant="secondary" 
                className="w-full bg-white text-brand-brown hover:bg-gray-100"
                onClick={handleSelectProPlan}
                disabled={subscriptionMutation.isPending}
              >
                {subscriptionMutation.isPending ? "Processing..." : "Start Pro Trial"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
