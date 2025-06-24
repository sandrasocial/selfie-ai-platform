export interface WorkflowDefinition {
  name: string;
  description: string;
  steps: Array<{
    id: string;
    type: string;
    retryable: boolean;
    delay?: number;
    template?: string;
    variables?: Record<string, any>;
    [key: string]: any;
  }>;
}

// Enhanced welcome workflow for new purchases
export const WelcomeWorkflow: WorkflowDefinition = {
  name: 'welcome_new_purchase',
  description: 'Complete welcome sequence for new customers',
  steps: [
    { 
      id: 'send_purchase_confirmation', 
      type: 'email', 
      template: 'purchase-confirmation',
      retryable: true 
    },
    { 
      id: 'send_welcome_email', 
      type: 'email', 
      template: 'welcome',
      retryable: true,
      delay: 300 // 5 minutes after purchase
    },
    { 
      id: 'create_user_record', 
      type: 'database', 
      retryable: false 
    }
  ]
};

// Branded customer welcome sequence
export const BrandedWelcomeWorkflow: WorkflowDefinition = {
  name: 'branded_welcome_sequence',
  description: 'Premium welcome sequence for Branded Experience customers',
  steps: [
    { 
      id: 'send_branded_welcome', 
      type: 'email', 
      template: 'welcome',
      variables: { purchaseType: 'branded' },
      retryable: true 
    },
    { 
      id: 'schedule_vip_call', 
      type: 'calendar', 
      retryable: true,
      delay: 3600 // 1 hour
    },
    { 
      id: 'send_getting_started', 
      type: 'email', 
      template: 'branded-getting-started',
      retryable: true,
      delay: 86400 // 24 hours
    }
  ]
};

// Starter kit welcome sequence
export const StarterWelcomeWorkflow: WorkflowDefinition = {
  name: 'starter_welcome_sequence',
  description: 'Welcome sequence for Starter Kit customers',
  steps: [
    { 
      id: 'send_starter_welcome', 
      type: 'email', 
      template: 'welcome',
      variables: { purchaseType: 'starter' },
      retryable: true 
    },
    { 
      id: 'send_first_tips', 
      type: 'email', 
      template: 'starter-tips-day1',
      retryable: true,
      delay: 86400 // 24 hours
    },
    { 
      id: 'send_progress_check', 
      type: 'email', 
      template: 'progress-check',
      retryable: true,
      delay: 604800 // 7 days
    }
  ]
};

// Enhanced course progress workflow
export const CourseProgressWorkflow: WorkflowDefinition = {
  name: 'course_progress_milestone',
  description: 'Celebrate user milestones and progress',
  steps: [
    { 
      id: 'check_progress', 
      type: 'database', 
      retryable: false 
    },
    { 
      id: 'send_congrats', 
      type: 'email', 
      template: 'milestone-celebration',
      retryable: true 
    },
    { 
      id: 'unlock_bonus_content', 
      type: 'database', 
      retryable: true 
    }
  ]
};

// VIP application workflow
export const VIPApplicationWorkflow: WorkflowDefinition = {
  name: 'vip_application_received',
  description: 'Handle VIP application submissions',
  steps: [
    { 
      id: 'send_application_confirmation', 
      type: 'email', 
      template: 'vip-application',
      retryable: true 
    },
    { 
      id: 'notify_team', 
      type: 'notification', 
      retryable: true 
    },
    { 
      id: 'schedule_review', 
      type: 'calendar', 
      retryable: true,
      delay: 3600 // 1 hour
    }
  ]
};

// Subscription renewal workflow
export const SubscriptionWorkflow: WorkflowDefinition = {
  name: 'subscription_renewal',
  description: 'Handle subscription renewals and failures',
  steps: [
    { 
      id: 'notify_renewal', 
      type: 'email', 
      template: 'subscription-renewal',
      retryable: true 
    },
    { 
      id: 'update_access', 
      type: 'database', 
      retryable: false 
    }
  ]
};

// Abandoned cart/application workflow
export const AbandonedCartWorkflow: WorkflowDefinition = {
  name: 'abandoned_cart_recovery',
  description: 'Re-engage users who abandoned their purchase',
  steps: [
    { 
      id: 'send_reminder', 
      type: 'email', 
      template: 'abandoned-cart-reminder',
      retryable: true, 
      delay: 3600 // 1 hour
    },
    { 
      id: 'send_urgency', 
      type: 'email', 
      template: 'abandoned-cart-urgency',
      retryable: true, 
      delay: 259200 // 3 days
    }
  ]
}; 