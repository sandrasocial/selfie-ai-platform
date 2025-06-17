// /components/forms/checkout-form.tsx
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, Radio } from '@/components/ui/radio';
import { Form, FormField, FormSection } from '@/components/ui/form-field';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface CheckoutFormData {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Billing Address
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  
  // Payment
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  paymentMethod: 'card' | 'paypal';
  
  // Preferences
  sameAsShipping: boolean;
  savePaymentInfo: boolean;
  subscribeToUpdates: boolean;
  agreeToTerms: boolean;
}

interface CheckoutFormProps {
  product?: {
    name: string;
    price: string;
    description?: string;
  };
  onSubmit?: (data: CheckoutFormData) => void;
}

// ============================================
// CONSTANTS
// ============================================

const COUNTRIES = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'au', label: 'Australia' },
  { value: 'no', label: 'Norway' },
  { value: 'is', label: 'Iceland' },
  // Add more countries as needed
];

const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  // Add more states as needed
];

// ============================================
// CHECKOUT FORM COMPONENT
// ============================================

export default function CheckoutForm({ product, onSubmit }: CheckoutFormProps) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'us',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    paymentMethod: 'card',
    sameAsShipping: true,
    savePaymentInfo: false,
    subscribeToUpdates: true,
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Update form data
  const updateFormData = (field: keyof CheckoutFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {};

    // Required fields
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Please enter a valid email';
    
    if (!formData.sameAsShipping) {
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.postalCode) newErrors.postalCode = 'Postal code is required';
    }

    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
      if (!formData.cardExpiry) newErrors.cardExpiry = 'Expiry date is required';
      if (!formData.cardCvc) newErrors.cardCvc = 'CVC is required';
    }

    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      onSubmit?.(formData);
    }, 2000);
  };

  // Format card number input
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };

  // Format expiry date
  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  if (submitSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="py-16 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="font-['Bodoni_Moda',serif] text-3xl mb-4">
            Order Confirmed!
          </h2>
          <p className="text-[#4C4B4B] mb-8">
            Check your email for order details and access instructions.
          </p>
          <Button onClick={() => window.location.href = '/dashboard'}>
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Form
        onSubmit={handleSubmit}
        loading={isSubmitting}
        className="grid lg:grid-cols-3 gap-8"
      >
        {/* Main Form Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Information */}
          <FormSection
            title="Personal Information"
            description="We'll use this to create your account"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                label="First Name"
                required
                error={errors.firstName}
              >
                <Input
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  placeholder="Sandra"
                />
              </FormField>

              <FormField
                label="Last Name"
                required
                error={errors.lastName}
              >
                <Input
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  placeholder="Sigurjonsdottir"
                />
              </FormField>
            </div>

            <FormField
              label="Email Address"
              required
              error={errors.email}
              helperText="You'll use this to login"
            >
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                placeholder="queen@example.com"
              />
            </FormField>

            <FormField
              label="Phone Number"
              helperText="Optional - for order updates"
            >
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </FormField>
          </FormSection>

          {/* Payment Method */}
          <FormSection
            title="Payment Method"
            description="All transactions are secure and encrypted"
          >
            <FormField>
              <RadioGroup
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={(value) => updateFormData('paymentMethod', value)}
              >
                <Radio
                  value="card"
                  label="Credit or Debit Card"
                  helperText="Visa, Mastercard, Amex, Discover"
                />
                <Radio
                  value="paypal"
                  label="PayPal"
                  helperText="You'll be redirected to PayPal"
                />
              </RadioGroup>
            </FormField>

            {formData.paymentMethod === 'card' && (
              <>
                <FormField
                  label="Card Number"
                  required
                  error={errors.cardNumber}
                >
                  <Input
                    value={formData.cardNumber}
                    onChange={(e) => updateFormData('cardNumber', formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    leftIcon={<CreditCard className="w-5 h-5" />}
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Expiry Date"
                    required
                    error={errors.cardExpiry}
                  >
                    <Input
                      value={formData.cardExpiry}
                      onChange={(e) => updateFormData('cardExpiry', formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </FormField>

                  <FormField
                    label="CVC"
                    required
                    error={errors.cardCvc}
                    info="3-digit security code on the back of your card"
                  >
                    <Input
                      value={formData.cardCvc}
                      onChange={(e) => updateFormData('cardCvc', e.target.value.replace(/\D/g, ''))}
                      placeholder="123"
                      maxLength={3}
                    />
                  </FormField>
                </div>

                <FormField>
                  <Checkbox
                    label="Save payment information for future purchases"
                    checked={formData.savePaymentInfo}
                    onChange={(e) => updateFormData('savePaymentInfo', e.target.checked)}
                  />
                </FormField>
              </>
            )}
          </FormSection>

          {/* Billing Address */}
          <FormSection
            title="Billing Address"
            description="Enter the address associated with your payment method"
          >
            <FormField>
              <Checkbox
                label="Same as shipping address"
                checked={formData.sameAsShipping}
                onChange={(e) => updateFormData('sameAsShipping', e.target.checked)}
              />
            </FormField>

            {!formData.sameAsShipping && (
              <>
                <FormField
                  label="Address"
                  required
                  error={errors.address}
                >
                  <Input
                    value={formData.address}
                    onChange={(e) => updateFormData('address', e.target.value)}
                    placeholder="123 Main Street"
                  />
                </FormField>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    label="City"
                    required
                    error={errors.city}
                  >
                    <Input
                      value={formData.city}
                      onChange={(e) => updateFormData('city', e.target.value)}
                      placeholder="Los Angeles"
                    />
                  </FormField>

                  <FormField
                    label="State"
                    required
                    error={errors.state}
                  >
                    <Select
                      options={US_STATES}
                      value={formData.state}
                      onChange={(value) => updateFormData('state', value)}
                      placeholder="Select state"
                    />
                  </FormField>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    label="Postal Code"
                    required
                    error={errors.postalCode}
                  >
                    <Input
                      value={formData.postalCode}
                      onChange={(e) => updateFormData('postalCode', e.target.value)}
                      placeholder="90001"
                    />
                  </FormField>

                  <FormField
                    label="Country"
                    required
                  >
                    <Select
                      options={COUNTRIES}
                      value={formData.country}
                      onChange={(value) => updateFormData('country', value)}
                    />
                  </FormField>
                </div>
              </>
            )}
          </FormSection>

          {/* Preferences */}
          <FormSection>
            <FormField>
              <Checkbox
                label="Send me tips and updates about SELFIE AI™"
                helperText="Unsubscribe anytime. We respect your inbox."
                checked={formData.subscribeToUpdates}
                onChange={(e) => updateFormData('subscribeToUpdates', e.target.checked)}
              />
            </FormField>

            <FormField error={errors.agreeToTerms}>
              <Checkbox
                label="I agree to the Terms of Service and Privacy Policy"
                checked={formData.agreeToTerms}
                onChange={(e) => updateFormData('agreeToTerms', e.target.checked)}
              />
            </FormField>
          </FormSection>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card variant="soft" className="sticky top-8">
            <CardContent className="p-6">
              <h3 className="font-['Bodoni_Moda',serif] text-2xl mb-6">
                Order Summary
              </h3>

              {product ? (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      {product.description && (
                        <p className="text-sm text-[#4C4B4B] mt-1">
                          {product.description}
                        </p>
                      )}
                    </div>
                    <p className="font-['Bodoni_Moda',serif] text-xl">
                      {product.price}
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-medium">
                      <span>Total</span>
                      <span className="font-['Bodoni_Moda',serif]">
                        {product.price}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-medium">
                      <span>Total</span>
                      <span>$0.00</span>
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                fullWidth
                size="lg"
                className="mt-6"
                loading={isSubmitting}
                loadingText="Processing..."
              >
                Complete Purchase
              </Button>

              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[#4C4B4B]">
                <Lock className="w-4 h-4" />
                <span>Secure checkout</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </Form>
    </div>
  );
}

// ============================================
// USAGE EXAMPLE
// ============================================

/**
 * Complete Checkout Page
 * @example
 * ```tsx
 * import CheckoutForm from '@/components/forms/checkout-form';
 * 
 * export default function CheckoutPage() {
 *   const product = {
 *     name: 'Branded by Selfie™',
 *     price: '$397',
 *     description: 'Complete brand transformation system'
 *   };
 * 
 *   const handleCheckout = async (data) => {
 *     // Process payment
 *     await processPayment(data);
 *     // Redirect to success page
 *     router.push('/checkout/success');
 *   };
 * 
 *   return (
 *     <div className="min-h-screen bg-[#F1F1F1] py-12">
 *       <div className="max-w-7xl mx-auto px-4">
 *         <h1 className="font-['Bodoni_Moda',serif] text-4xl text-center mb-12">
 *           Complete Your Purchase
 *         </h1>
 *         
 *         <CheckoutForm
 *           product={product}
 *           onSubmit={handleCheckout}
 *         />
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 */