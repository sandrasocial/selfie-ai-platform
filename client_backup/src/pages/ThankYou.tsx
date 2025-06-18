
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

export default function ThankYou() {
  const { data: user } = useQuery({
    queryKey: ["/api/me"],
    retry: false,
  });

  return (
    <>
      <Header user={user} />
      <main className="px-4 py-20 max-w-4xl mx-auto text-center">
        <div className="mb-16">
          <div className="w-20 h-20 bg-luxury-headline text-white flex items-center justify-center mx-auto mb-6 font-prata text-3xl">
            ✓
          </div>
          <h1 className="font-prata text-5xl text-luxury-headline mb-6 uppercase tracking-wide">
            Welcome to SELFIE AI PRO
          </h1>
          <div className="luxury-divider mb-8"></div>
          <p className="text-luxury-text-gray font-helvetica text-lg max-w-xl mx-auto">
            Your next-level visibility era starts now.
          </p>
        </div>

        <Card className="border-luxury-accent bg-white mb-16">
          <CardContent className="p-10 text-left">
            <h2 className="font-prata text-2xl text-luxury-headline mb-8 uppercase tracking-wide">
              What Happens Next
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-prata text-base text-luxury-headline uppercase tracking-widest mb-2">
                  Step 01
                </h3>
                <p className="text-luxury-text-gray font-helvetica text-sm leading-relaxed">
                  Access your dashboard and explore AI-powered tools and branded templates.
                </p>
              </div>
              <div>
                <h3 className="font-prata text-base text-luxury-headline uppercase tracking-widest mb-2">
                  Step 02
                </h3>
                <p className="text-luxury-text-gray font-helvetica text-sm leading-relaxed">
                  Chat with Sandra AI for daily strategy, visibility tips, and glow-up guidance.
                </p>
              </div>
              <div>
                <h3 className="font-prata text-base text-luxury-headline uppercase tracking-widest mb-2">
                  Step 03
                </h3>
                <p className="text-luxury-text-gray font-helvetica text-sm leading-relaxed">
                  Show up with confidence, go viral, and build your digital empire.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-12">
          <Button asChild className="btn-primary px-10 py-4 text-sm uppercase tracking-wider">
            <Link href="/templates">Go to Dashboard</Link>
          </Button>
          <p className="mt-4 text-sm text-luxury-text-gray font-helvetica">
            You'll also receive a welcome email with your login details and next steps.
          </p>
        </div>

        <div className="bg-luxury-light py-10 px-6 rounded-lg max-w-3xl mx-auto">
          <blockquote className="font-prata text-xl italic text-luxury-headline mb-6">
            "This platform completely changed how I show up online. My content went viral three times in the first month."
          </blockquote>
          <div className="luxury-divider mb-4"></div>
          <p className="text-sm text-luxury-text-gray font-helvetica">
            — Jessica M., SELFIE PRO Member
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
