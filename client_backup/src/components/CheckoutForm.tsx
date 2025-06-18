
import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';

interface CheckoutFormProps {
  productId: string;
}

export default function CheckoutForm({ productId }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setMessage("Payment system not ready. Please try again.");
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/thank-you/${productId}`,
        },
      });

      if (error) {
        console.error('Stripe payment error:', error);
        if (error.type === "card_error" || error.type === "validation_error") {
          setMessage(error.message || "Card error occurred");
        } else {
          setMessage("Payment failed. Please try again or contact support.");
        }
      }
    } catch (err) {
      console.error('Payment confirmation error:', err);
      setMessage("Payment failed. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="p-6 border border-[#B5B5B3] bg-[#F1F1F1]">
        <PaymentElement 
          options={{
            layout: "tabs"
          }}
        />
      </div>

      {message && (
        <div className="text-red-600 font-light text-center p-4 border border-red-200 bg-red-50">
          {message}
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full bg-[#171719] text-white hover:bg-white hover:text-[#171719] border-2 border-[#171719] font-light py-4 text-lg uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ fontFamily: 'Inter' }}
      >
        {isLoading ? 'Processing...' : 'Complete Purchase'}
      </Button>

      <div className="text-center text-[#4C4B4B] text-sm font-light">
        Your payment information is secure and encrypted
      </div>
    </form>
  );
}
