
import { useState, useEffect, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionData {
  isSubscribed: boolean;
  isExpired: boolean;
  expiresInDays: number | null;
  planType: string;
}

interface SubscriptionStatusWidgetProps {
  compact?: boolean;
  showUpgradeButton?: boolean;
}

export default function SubscriptionStatusWidget({ compact = false, showUpgradeButton = true }: SubscriptionStatusWidgetProps) {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSubscriptionStatus();
  }, []);

  const loadSubscriptionStatus = async () => {
    try {
      const response = await fetch('/api/subscription', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planType: string) => {
    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType }),
        credentials: 'include'
      });

      if (response.ok) {
        const { checkoutUrl } = await response.json();
        window.location.href = checkoutUrl;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      toast({
        title: "Checkout Failed",
        description: "Unable to start checkout process",
        variant: "destructive",
      });
    }
  };

  const getPlanDisplayName = (planType: string) => {
    switch (planType?.toLowerCase()) {
      case 'pro':
      case 'starter':
        return 'Starter Kit';
      case 'premium':
      case 'branded':
        return 'Branded by Selfie™';
      case 'vip':
        return 'VIP Empire Builder';
      default:
        return 'Free';
    }
  };

  const getPlanIcon = (planType: string) => {
    switch (planType?.toLowerCase()) {
      case 'vip':
        return <Crown className="w-4 h-4" style={{ color: '#171719' }} />;
      case 'premium':
      case 'branded':
        return <CheckCircle className="w-4 h-4" style={{ color: '#171719' }} />;
      case 'pro':
      case 'starter':
        return <CheckCircle className="w-4 h-4" style={{ color: '#171719' }} />;
      default:
        return null;
    }
  };

  const getTierBadge = (planType: string) => {
    const plan = planType?.toLowerCase();
    
    if (plan === 'vip') {
      return (
        <Badge 
          className="uppercase tracking-wide"
          style={{ 
            backgroundColor: '#171719',
            color: 'white',
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '12px',
            letterSpacing: '0.5px',
            borderRadius: '0px',
            border: 'none'
          }}
        >
          VIP
        </Badge>
      );
    }
    
    if (plan === 'pro' || plan === 'starter' || plan === 'premium' || plan === 'branded') {
      return (
        <Badge 
          className="uppercase tracking-wide"
          style={{ 
            backgroundColor: '#B5B5B3',
            color: '#171719',
            fontFamily: 'Neue Einstellung, sans-serif',
            fontSize: '12px',
            letterSpacing: '0.5px',
            borderRadius: '0px',
            border: 'none'
          }}
        >
          PRO
        </Badge>
      );
    }
    
    return (
      <Badge 
        variant="outline"
        className="uppercase tracking-wide"
        style={{ 
          backgroundColor: 'transparent',
          color: '#171719',
          fontFamily: 'Neue Einstellung, sans-serif',
          fontSize: '12px',
          letterSpacing: '0.5px',
          borderRadius: '0px',
          border: '1px solid #171719'
        }}
      >
        FREE
      </Badge>
    );
  };

  const getNextRenewalDate = () => {
    if (subscription?.expiresInDays && subscription.expiresInDays > 0) {
      const renewalDate = new Date();
      renewalDate.setDate(renewalDate.getDate() + subscription.expiresInDays);
      return renewalDate.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
      });
    }
    return null;
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-20 rounded" style={{ backgroundColor: '#F1F1F1' }}></div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-4">
        {getTierBadge(subscription?.planType || 'free')}
        
        {subscription?.isExpired && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Expired
          </Badge>
        )}

        {subscription?.expiresInDays && subscription.expiresInDays <= 7 && (
          <Badge variant="outline" style={{ borderColor: '#4C4B4B', color: '#4C4B4B' }}>
            Expires in {subscription.expiresInDays} days
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card 
      className="border-0 shadow-none"
      style={{ backgroundColor: '#F1F1F1' }}
    >
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Subscription Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {getPlanIcon(subscription?.planType || 'free')}
              <div>
                <h3 
                  className="text-2xl md:text-3xl font-normal mb-1"
                  style={{ 
                    fontFamily: 'Cormorant Garamond, serif',
                    color: '#171719'
                  }}
                >
                  {getPlanDisplayName(subscription?.planType || 'free')}
                </h3>
                {getNextRenewalDate() && (
                  <p 
                    className="text-sm"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: '300',
                      color: '#4C4B4B'
                    }}
                  >
                    Renews {getNextRenewalDate()}
                  </p>
                )}
              </div>
            </div>

            {getTierBadge(subscription?.planType || 'free')}
          </div>

          {/* Status Messages & Actions */}
          <div className="flex flex-col items-start md:items-end gap-4">
            {/* Status Messages */}
            {subscription?.isExpired && (
              <div className="p-3 rounded" style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca' }}>
                <p className="text-sm" style={{ color: '#dc2626' }}>
                  Your subscription has expired. Renew now to continue accessing premium features.
                </p>
              </div>
            )}

            {subscription?.expiresInDays && subscription.expiresInDays <= 7 && !subscription.isExpired && (
              <div className="p-3 rounded" style={{ backgroundColor: '#fef3c7', border: '1px solid #fde68a' }}>
                <p className="text-sm" style={{ color: '#d97706' }}>
                  Your subscription expires in {subscription.expiresInDays} days.
                </p>
              </div>
            )}

            {/* Upgrade Buttons */}
            {showUpgradeButton && (!subscription?.isSubscribed || subscription?.isExpired) && (
              <div className="flex gap-2">
                {(!subscription?.planType || subscription.planType === 'free') && (
                  <Button
                    size="sm"
                    onClick={() => handleUpgrade('starter')}
                    className="transition-all duration-300"
                    style={{ 
                      backgroundColor: 'transparent',
                      color: '#171719',
                      border: '1px solid #171719',
                      fontFamily: 'Neue Einstellung, sans-serif',
                      fontSize: '14px',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      borderRadius: '0px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#171719';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#171719';
                    }}
                  >
                    UPGRADE NOW
                  </Button>
                )}

                <Button
                  size="sm"
                  onClick={() => handleUpgrade('vip')}
                  className="transition-all duration-300"
                  style={{ 
                    backgroundColor: 'transparent',
                    color: '#171719',
                    border: '1px solid #171719',
                    fontFamily: 'Neue Einstellung, sans-serif',
                    fontSize: '14px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    borderRadius: '0px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#171719';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#171719';
                  }}
                >
                  GO VIP
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
