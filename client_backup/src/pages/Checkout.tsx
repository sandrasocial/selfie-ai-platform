
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Checkout() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    city: '',
    zipCode: ''
  });

  const { data: user } = useQuery({
    queryKey: ["/api/me"],
    retry: false,
  });

  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Checkout Initiated",
      description: "Redirecting to secure payment processing...",
    });
    setTimeout(() => {
      window.location.href = '/thank-you';
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      <Header user={user} />
      
      <main className="px-4 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h1 
            className="text-5xl md:text-6xl font-normal text-[#171719] leading-tight mb-6"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Complete Your Order
          </h1>
          <div className="w-24 h-px bg-[#4C4B4B] mx-auto mb-8" />
          <p 
            className="text-lg font-light text-[#4C4B4B] max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
          >
            Join SELFIE PRO and transform your content strategy with Sandra's AI-powered system.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Order Summary */}
          <Card className="bg-white border border-[#B5B5B3] shadow-sm">
            <CardHeader className="pb-8">
              <CardTitle 
                className="text-3xl font-normal text-[#171719] mb-4"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Order Summary
              </CardTitle>
              <div className="w-16 h-px bg-[#4C4B4B]" />
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="border border-[#B5B5B3] p-6 bg-[#F1F1F1]">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 
                      className="text-xl font-normal text-[#171719] mb-2"
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      SELFIE PRO
                    </h3>
                    <p 
                      className="text-sm font-light text-[#4C4B4B]"
                      style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                    >
                      Monthly subscription
                    </p>
                  </div>
                  <div className="text-right">
                    <div 
                      className="text-2xl font-normal text-[#171719]"
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      $47.00
                    </div>
                    <div 
                      className="text-sm font-light text-[#4C4B4B]"
                      style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                    >
                      per month
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#B5B5B3] pt-6">
                <div className="flex justify-between items-center">
                  <span 
                    className="text-xl font-normal text-[#171719]"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    Total
                  </span>
                  <span 
                    className="text-xl font-normal text-[#171719]"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    $47.00/month
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 
                  className="text-lg font-normal text-[#171719]"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  What's Included:
                </h4>
                <ul className="space-y-3">
                  {[
                    'Unlimited AI content generation',
                    'Access to all templates', 
                    'Sandra AI coaching chat',
                    'Weekly strategy sessions',
                    'Priority support'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#171719]" />
                      <span 
                        className="text-sm font-light text-[#4C4B4B]"
                        style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card className="bg-white border border-[#B5B5B3] shadow-sm">
            <CardHeader className="pb-8">
              <CardTitle 
                className="text-3xl font-normal text-[#171719] mb-4"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Payment Information
              </CardTitle>
              <div className="w-16 h-px bg-[#4C4B4B]" />
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label 
                    htmlFor="name"
                    className="text-sm font-medium text-[#171719]"
                    style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                  >
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="border border-[#B5B5B3] bg-transparent text-[#171719] focus:border-[#171719]"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label 
                    htmlFor="email"
                    className="text-sm font-medium text-[#171719]"
                    style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="border border-[#B5B5B3] bg-transparent text-[#171719] focus:border-[#171719]"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label 
                    htmlFor="cardNumber"
                    className="text-sm font-medium text-[#171719]"
                    style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                  >
                    Card Number
                  </Label>
                  <Input
                    id="cardNumber"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    className="border border-[#B5B5B3] bg-transparent text-[#171719] focus:border-[#171719]"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label 
                      htmlFor="expiryDate"
                      className="text-sm font-medium text-[#171719]"
                      style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                    >
                      Expiry Date
                    </Label>
                    <Input
                      id="expiryDate"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      className="border border-[#B5B5B3] bg-transparent text-[#171719] focus:border-[#171719]"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label 
                      htmlFor="cvv"
                      className="text-sm font-medium text-[#171719]"
                      style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                    >
                      CVV
                    </Label>
                    <Input
                      id="cvv"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      className="border border-[#B5B5B3] bg-transparent text-[#171719] focus:border-[#171719]"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label 
                    htmlFor="billingAddress"
                    className="text-sm font-medium text-[#171719]"
                    style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                  >
                    Billing Address
                  </Label>
                  <Input
                    id="billingAddress"
                    value={formData.billingAddress}
                    onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                    className="border border-[#B5B5B3] bg-transparent text-[#171719] focus:border-[#171719]"
                    placeholder="Enter your address"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label 
                      htmlFor="city"
                      className="text-sm font-medium text-[#171719]"
                      style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                    >
                      City
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="border border-[#B5B5B3] bg-transparent text-[#171719] focus:border-[#171719]"
                      placeholder="City"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label 
                      htmlFor="zipCode"
                      className="text-sm font-medium text-[#171719]"
                      style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                    >
                      ZIP Code
                    </Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      className="border border-[#B5B5B3] bg-transparent text-[#171719] focus:border-[#171719]"
                      placeholder="12345"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full px-8 py-4 text-sm font-medium uppercase tracking-wide mt-8"
                  style={{ 
                    backgroundColor: '#171719',
                    color: '#F1F1F1',
                    border: '2px solid #171719',
                    borderRadius: '0px',
                    fontFamily: 'Neue Einstellung, sans-serif',
                    letterSpacing: '0.5px'
                  }}
                >
                  Complete Purchase – $47.00/month
                </Button>

                <div className="text-center mt-6">
                  <p 
                    className="text-xs font-light text-[#4C4B4B] italic"
                    style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                  >
                    Powered by Stripe. Your information is secure and encrypted.
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="w-4 h-4 border border-[#4C4B4B] flex items-center justify-center">
                      <div className="w-2 h-2 bg-[#4C4B4B]" />
                    </div>
                    <span 
                      className="text-xs font-light text-[#4C4B4B]"
                      style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                    >
                      256-bit SSL encryption
                    </span>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
