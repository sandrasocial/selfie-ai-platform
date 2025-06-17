export interface WorkflowDefinition {
  name: string;
  steps: Array<{
    id: string;
    type: string;
    retryable: boolean;
    delay?: number;
    [key: string]: any;
  }>;
}

export const WelcomeWorkflow: WorkflowDefinition = {
  name: 'welcome_new_purchase',
  steps: [
    { id: 'send_welcome_email', type: 'email', retryable: true },
    { id: 'generate_welcome_pdf', type: 'pdf', retryable: true },
    { id: 'create_user_record', type: 'database', retryable: false }
  ]
};

export const CourseProgressWorkflow: WorkflowDefinition = {
  name: 'course_progress_milestone',
  steps: [
    { id: 'check_progress', type: 'database', retryable: false },
    { id: 'send_congrats', type: 'email', retryable: true }
  ]
};

export const SubscriptionWorkflow: WorkflowDefinition = {
  name: 'subscription_renewal',
  steps: [
    { id: 'notify_renewal', type: 'email', retryable: true }
  ]
};

export const ReminderWorkflow: WorkflowDefinition = {
  name: 'abandoned_cart',
  steps: [
    { id: 'send_reminder', type: 'email', retryable: true, delay: 3600 }
  ]
}; 