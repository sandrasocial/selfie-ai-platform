import { useState, useEffect } from 'react';
import { SupabaseService } from '@/lib/supabaseService';
import { useToast } from '@/hooks/use-toast';

export function useSubscription(userId: string) {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      loadSubscription();
    }
  }, [userId]);

  const loadSubscription = async () => {
    try {
      const data = await SupabaseService.getSubscriptionStatus(userId);
      setSubscription(data);
    } catch (error: any) {
      console.error('Error loading subscription:', error);
      // Don't show error toast for missing subscription (normal for free users)
      if (error.code !== 'PGRST116') {
        toast({
          title: "Load Failed",
          description: "Unable to load subscription status",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const updateSubscription = async (subscriptionData: any) => {
    try {
      const updated = await SupabaseService.updateSubscriptionStatus(userId, subscriptionData);
      setSubscription(updated);
      return updated;
    } catch (error: any) {
      console.error('Error updating subscription:', error);
      toast({
        title: "Update Failed",
        description: "Unable to update subscription",
        variant: "destructive",
      });
      throw error;
    }
  };

  const cancelSubscription = async () => {
    try {
      const updated = await SupabaseService.cancelSubscription(userId);
      setSubscription(updated);
      
      toast({
        title: "Subscription Canceled",
        description: "Your subscription has been canceled",
      });
      
      return updated;
    } catch (error: any) {
      console.error('Error canceling subscription:', error);
      toast({
        title: "Cancel Failed",
        description: "Unable to cancel subscription",
        variant: "destructive",
      });
      throw error;
    }
  };

  const isPro = () => {
    return subscription?.plan === 'PRO' && subscription?.status === 'active';
  };

  const isVip = () => {
    return subscription?.plan === 'VIP' && subscription?.status === 'active';
  };

  const isActive = () => {
    return subscription?.status === 'active';
  };

  const getCurrentPlan = () => {
    if (!subscription || subscription.status !== 'active') {
      return 'FREE';
    }
    return subscription.plan;
  };

  return {
    subscription,
    loading,
    updateSubscription,
    cancelSubscription,
    isPro,
    isVip,
    isActive,
    getCurrentPlan,
    refreshSubscription: loadSubscription
  };
}