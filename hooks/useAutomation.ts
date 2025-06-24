import { useCallback } from 'react';

interface AutomationTrigger {
  type: string;
  userId?: string;
  email: string;
  name: string;
  data?: Record<string, any>;
}

export function useAutomation() {
  const triggerAutomation = useCallback(async (trigger: AutomationTrigger) => {
    try {
      const response = await fetch('/api/automations/email-trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trigger)
      });

      if (!response.ok) {
        throw new Error(`Automation failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Automation triggered:', result);
      return result;
    } catch (error) {
      console.error('❌ Automation failed:', error);
      throw error;
    }
  }, []);

  // Convenience functions for common automation types
  const celebrateMilestone = useCallback(async (
    email: string, 
    name: string, 
    milestone: string,
    progressData?: {
      progressPercent?: number;
      daysActive?: number;
      nextMilestone?: string;
    }
  ) => {
    return triggerAutomation({
      type: 'milestone_celebration',
      email,
      name,
      data: {
        milestone,
        progressPercent: progressData?.progressPercent || 0,
        daysActive: progressData?.daysActive || 0,
        nextMilestone: progressData?.nextMilestone || 'Continue Growing',
        dashboardUrl: `${window.location.origin}/dashboard`
      }
    });
  }, [triggerAutomation]);

  const completeCourse = useCallback(async (
    email: string,
    name: string,
    courseName: string,
    certificateUrl?: string
  ) => {
    return triggerAutomation({
      type: 'course_completion',
      email,
      name,
      data: {
        courseName,
        certificateUrl,
        completionDate: new Date().toISOString(),
        nextSteps: 'Check your dashboard for advanced content'
      }
    });
  }, [triggerAutomation]);

  const submitVIPApplication = useCallback(async (
    email: string,
    name: string,
    applicationData: {
      businessStage: string;
      primaryGoal: string;
      applicationId: string;
    }
  ) => {
    return triggerAutomation({
      type: 'vip_application',
      email,
      name,
      data: {
        ...applicationData,
        submissionDate: new Date().toISOString()
      }
    });
  }, [triggerAutomation]);

  const unlockExclusiveContent = useCallback(async (
    email: string,
    name: string,
    contentData: {
      contentTitle: string;
      contentUrl: string;
      contentType: string;
      unlockReason: string;
    }
  ) => {
    return triggerAutomation({
      type: 'exclusive_content',
      email,
      name,
      data: contentData
    });
  }, [triggerAutomation]);

  const remindAbandonedCart = useCallback(async (
    email: string,
    name: string,
    cartData: {
      productName: string;
      cartUrl: string;
      discountCode?: string;
      expiryDate?: string;
    }
  ) => {
    return triggerAutomation({
      type: 'abandoned_cart',
      email,
      name,
      data: cartData
    });
  }, [triggerAutomation]);

  return {
    triggerAutomation,
    celebrateMilestone,
    completeCourse,
    submitVIPApplication,
    unlockExclusiveContent,
    remindAbandonedCart
  };
}
