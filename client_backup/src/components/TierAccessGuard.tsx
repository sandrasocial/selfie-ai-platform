
import { useState, useEffect, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TierAccessGuardProps {
  requiredTier: 'starter' | 'branded' | 'vip';
  children: ReactNode;
  fallbackComponent?: ReactNode;
  showUpgrade?: boolean;
}

interface SubscriptionData {
  isSubscribed: boolean;
  isExpired: boolean;
  planType: string;
}

export default function TierAccessGuard({ 
  requiredTier, 
  children, 
  fallbackComponent,
  showUpgrade = true 
}: TierAccessGuardProps) {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSubscriptionStatus();
  }, []);

  useEffect(() => {
    if (subscription) {
      checkAccess();
    }
  }, [subscription, requiredTier]);

  const loadSubscriptionStatus = async () => {
    try {
      // 🧪 DEV OVERRIDE: Check if this is userId "1" in development (REMOVE IN PRODUCTION)
      const userResponse = await fetch('/api/me', { credentials: 'include' });
      if (userResponse.ok) {
        const userData = await userResponse.json();
        if (import.meta.env.DEV && userData.id === 1) {
          console.log('🧪 Dev override: Granting full tier access to userId 1');
          setHasAccess(true);
          setLoading(false);
          return;
        }
      }

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

  const checkAccess = () => {
    if (!subscription?.isSubscribed || subscription?.isExpired) {
      setHasAccess(false);
      return;
    }

    const planType = subscription.planType?.toLowerCase();

    switch (requiredTier) {
      case 'starter':
        setHasAccess(['pro', 'starter', 'premium', 'branded', 'vip'].includes(planType));
        break;
      case 'branded':
        setHasAccess(['premium', 'branded', 'vip'].includes(planType));
        break;
      case 'vip':
        setHasAccess(planType === 'vip');
        break;
      default:
        setHasAccess(false);
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

  const getTierDisplayName = (tier: string) => {
    switch (tier) {
      case 'starter':
        return 'Starter Kit';
      case 'branded':
        return 'Branded by Selfie™';
      case 'vip':
        return 'VIP Empire Builder';
      default:
        return tier;
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'vip':
        return <Crown className="w-8 h-8" style={{ color: 'white' }} />;
      case 'branded':
        return <Sparkles className="w-8 h-8" style={{ color: 'white' }} />;
      case 'starter':
        return <Lock className="w-8 h-8" style={{ color: 'white' }} />;
      default:
        return <Lock className="w-8 h-8" style={{ color: 'white' }} />;
    }
  };

  const getAccessBadge = (tier: string) => {
    if (tier === 'vip') {
      return (
        <Badge 
          className="uppercase tracking-wide"
          style={{ 
            backgroundColor: '#171719',
            color: 'white',
            fontFamily: 'Neue Einstellung, sans-serif',
            fontSize: '12px',
            letterSpacing: '0.5px',
            borderRadius: '0px',
            border: 'none'
          }}
        >
          <Crown className="w-3 h-3 mr-1" />
          VIP
        </Badge>
      );
    }
    
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
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 rounded" style={{ backgroundColor: '#B5B5B3' }}></div>
      </div>
    );
  }

  if (hasAccess) {
    return (
      <div 
        className="transition-all duration-300 hover:scale-[1.03] cursor-pointer"
        style={{ transformOrigin: 'center' }}
      >
        {children}
      </div>
    );
  }

  if (fallbackComponent) {
    return <>{fallbackComponent}</>;
  }

  return (
    <div className="relative group">
      {/* Locked Content with Overlay */}
      <div className="relative">
        <div style={{ filter: 'blur(2px)', opacity: '0.6' }}>
          {children}
        </div>
        
        {/* Overlay */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-300"
          style={{ 
            backgroundColor: 'rgba(23, 23, 25, 0.85)',
            backdropFilter: 'blur(4px)'
          }}
        >
          {/* Access Badge */}
          <div className="absolute top-4 right-4">
            {getAccessBadge(requiredTier)}
          </div>

          {/* Center Content */}
          <div className="text-center max-w-xs px-6">
            <div className="mb-4">
              {getTierIcon(requiredTier)}
            </div>

            <h3 
              className="text-xl font-normal mb-3"
              style={{ 
                fontFamily: 'Cormorant Garamond, serif',
                color: 'white'
              }}
            >
              Unlock with {getTierDisplayName(requiredTier)}
            </h3>

            <p 
              className="text-sm mb-6 opacity-90"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                fontWeight: '300',
                color: 'white'
              }}
            >
              Upgrade to access this exclusive feature
            </p>

            {showUpgrade && (
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => handleUpgrade(requiredTier)}
                  className="transition-all duration-300"
                  style={{ 
                    backgroundColor: 'transparent',
                    color: 'white',
                    border: '1px solid white',
                    fontFamily: 'Neue Einstellung, sans-serif',
                    fontSize: '14px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    borderRadius: '0px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = '#171719';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'white';
                  }}
                >
                  Unlock This Tool
                </Button>

                {requiredTier !== 'vip' && (
                  <Button
                    variant="ghost"
                    onClick={() => handleUpgrade('vip')}
                    className="text-white hover:text-white hover:bg-white/10"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '12px',
                      borderRadius: '0px'
                    }}
                  >
                    Or go VIP for everything
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
