import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Import workflow definitions
import { 
  WelcomeWorkflow,
  CourseProgressWorkflow,
  SubscriptionWorkflow,
  ReminderWorkflow,
  WorkflowDefinition
} from './workflows';

// Import service integrations
import { sendEmail } from './email';
import { generatePDF } from './pdf';

// Initialize Supabase admin client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Automation request schema
const AutomationRequestSchema = z.object({
  workflow: z.string(),
  userId: z.string().optional(),
  data: z.record(z.any()),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  scheduledFor: z.string().datetime().optional()
});

// Workflow status type
type WorkflowStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'retry';

// Workflow result interface
interface WorkflowResult {
  success: boolean;
  workflowId: string;
  completedSteps: string[];
  failedSteps: string[];
  outputs: Record<string, any>;
  error?: string;
}

// Available workflows registry
const WORKFLOWS: Record<string, WorkflowDefinition> = {
  welcome_new_purchase: WelcomeWorkflow,
  course_progress_milestone: CourseProgressWorkflow,
  subscription_renewal: SubscriptionWorkflow,
  abandoned_cart: ReminderWorkflow,
  payment_failed: {
    name: 'payment_failed',
    steps: [
      { id: 'notify_user', type: 'email', retryable: true },
      { id: 'update_subscription', type: 'database', retryable: false },
      { id: 'retry_payment', type: 'stripe', retryable: true, delay: 86400 } // 24h delay
    ]
  }
};

/**
 * Main automation orchestrator endpoint
 * Processes automation requests and manages workflow execution
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Verify internal API key for security
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.INTERNAL_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request
    const body = await request.json();
    const validation = AutomationRequestSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { workflow, userId, data, priority, scheduledFor } = validation.data;

    // Check if workflow exists
    if (!WORKFLOWS[workflow]) {
      return NextResponse.json(
        { error: `Unknown workflow: ${workflow}` },
        { status: 400 }
      );
    }

    // Create automation record
    const { data: automation, error: insertError } = await supabase
      .from('automation_queue')
      .insert({
        workflow,
        user_id: userId,
        data: JSON.stringify(data),
        priority,
        status: scheduledFor ? 'scheduled' : 'pending',
        scheduled_for: scheduledFor,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to queue automation: ${insertError.message}`);
    }

    // If not scheduled, process immediately
    if (!scheduledFor) {
      // Process async (don't wait for completion)
      processAutomation(automation.id).catch(console.error);
    }

    return NextResponse.json({
      success: true,
      automationId: automation.id,
      status: automation.status,
      message: scheduledFor 
        ? `Automation scheduled for ${scheduledFor}`
        : 'Automation queued for processing'
    });

  } catch (error) {
    console.error('Orchestrator error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Process a single automation
 */
async function processAutomation(automationId: string): Promise<WorkflowResult> {
  try {
    // Get automation details
    const { data: automation, error } = await supabase
      .from('automation_queue')
      .select('*')
      .eq('id', automationId)
      .single();

    if (error || !automation) {
      throw new Error('Automation not found');
    }

    // Update status to processing
    await updateAutomationStatus(automationId, 'processing');

    // Get workflow definition
    const workflow = WORKFLOWS[automation.workflow];
    const workflowData = JSON.parse(automation.data);

    // Execute workflow steps
    const result = await executeWorkflow(
      workflow,
      workflowData,
      automation.user_id
    );

    // Update final status
    await updateAutomationStatus(
      automationId,
      result.success ? 'completed' : 'failed',
      result
    );

    return result;

  } catch (error) {
    console.error('Automation processing error:', error);
    
    // Mark as failed
    await updateAutomationStatus(automationId, 'failed', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    throw error;
  }
}

/**
 * Execute a workflow with its steps
 */
async function executeWorkflow(
  workflow: WorkflowDefinition,
  data: any,
  userId?: string
): Promise<WorkflowResult> {
  const result: WorkflowResult = {
    success: true,
    workflowId: workflow.name,
    completedSteps: [],
    failedSteps: [],
    outputs: {}
  };

  console.log(`Executing workflow: ${workflow.name}`);

  for (const step of workflow.steps) {
    try {
      // Check if step has delay
      if (step.delay) {
        await delay(step.delay * 1000);
      }

      // Execute step based on type
      const stepResult = await executeStep(step, data, userId);
      
      result.completedSteps.push(step.id);
      result.outputs[step.id] = stepResult;

      // Pass step output to next steps if needed
      data = { ...data, ...stepResult };

    } catch (error) {
      console.error(`Step ${step.id} failed:`, error);
      
      result.failedSteps.push(step.id);
      result.outputs[step.id] = { error: error.message };

      // If step is critical (non-retryable), fail the workflow
      if (!step.retryable) {
        result.success = false;
        result.error = `Critical step ${step.id} failed`;
        break;
      }

      // Queue retry if retryable
      if (step.retryable) {
        await queueStepRetry(workflow.name, step, data, userId);
      }
    }
  }

  return result;
}

/**
 * Execute a single workflow step
 */
async function executeStep(
  step: any,
  data: any,
  userId?: string
): Promise<any> {
  console.log(`Executing step: ${step.id} (${step.type})`);

  switch (step.type) {
    case 'email':
      return await executeEmailStep(step, data, userId);
    
    case 'pdf':
      return await executePDFStep(step, data, userId);
    
    case 'database':
      return await executeDatabaseStep(step, data, userId);
    
    case 'webhook':
      return await executeWebhookStep(step, data);
    
    case 'stripe':
      return await executeStripeStep(step, data, userId);
    
    case 'condition':
      return await executeConditionStep(step, data);
    
    default:
      throw new Error(`Unknown step type: ${step.type}`);
  }
}

/**
 * Execute email step
 */
async function executeEmailStep(step: any, data: any, userId?: string) {
  // Get user email if not provided
  let email = data.email;
  if (!email && userId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('user_id', userId)
      .single();
    
    email = profile?.email;
  }

  if (!email) {
    throw new Error('No email address available');
  }

  // Determine email template and variables
  const template = step.template || data.emailTemplate;
  const variables = {
    name: data.name || 'there',
    ...data,
    ...step.variables
  };

  // Send email
  const result = await sendEmail({
    to: email,
    template,
    variables,
    subject: step.subject
  });

  return {
    emailId: result.id,
    sent: true,
    timestamp: new Date().toISOString()
  };
}

/**
 * Execute PDF generation step
 */
async function executePDFStep(step: any, data: any, userId?: string) {
  const template = step.template || data.pdfTemplate;
  
  // Generate PDF
  const result = await generatePDF({
    template,
    data: {
      ...data,
      ...step.data
    }
  });

  // Store PDF reference if userId provided
  if (userId && result.url) {
    await supabase
      .from('user_documents')
      .insert({
        user_id: userId,
        document_type: template,
        document_url: result.url,
        created_at: new Date().toISOString()
      });
  }

  return {
    pdfUrl: result.url,
    pdfId: result.id,
    generated: true
  };
}

/**
 * Execute database operation step
 */
async function executeDatabaseStep(step: any, data: any, userId?: string) {
  const { table, operation, values } = step;

  switch (operation) {
    case 'insert':
      const { data: inserted } = await supabase
        .from(table)
        .insert({ ...values, ...data, user_id: userId })
        .select();
      return { inserted };

    case 'update':
      const { data: updated } = await supabase
        .from(table)
        .update({ ...values, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .select();
      return { updated };

    case 'upsert':
      const { data: upserted } = await supabase
        .from(table)
        .upsert({ ...values, ...data, user_id: userId })
        .select();
      return { upserted };

    default:
      throw new Error(`Unknown database operation: ${operation}`);
  }
}

/**
 * Execute webhook step
 */
async function executeWebhookStep(step: any, data: any) {
  const { url, method = 'POST', headers = {} } = step;

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`Webhook failed: ${response.status}`);
  }

  return {
    status: response.status,
    response: await response.json()
  };
}

/**
 * Execute Stripe operation step
 */
async function executeStripeStep(step: any, data: any, userId?: string) {
  // This would integrate with Stripe API
  // Simplified for example
  return {
    stripeOperation: step.operation,
    processed: true
  };
}

/**
 * Execute conditional step
 */
async function executeConditionStep(step: any, data: any) {
  const { condition, trueSteps, falseSteps } = step;
  
  // Evaluate condition
  const conditionMet = evaluateCondition(condition, data);
  
  // Return which branch to take
  return {
    conditionMet,
    nextSteps: conditionMet ? trueSteps : falseSteps
  };
}

/**
 * Evaluate a condition
 */
function evaluateCondition(condition: any, data: any): boolean {
  const { field, operator, value } = condition;
  const fieldValue = data[field];

  switch (operator) {
    case 'equals':
      return fieldValue === value;
    case 'not_equals':
      return fieldValue !== value;
    case 'greater_than':
      return fieldValue > value;
    case 'less_than':
      return fieldValue < value;
    case 'contains':
      return String(fieldValue).includes(value);
    case 'exists':
      return fieldValue !== undefined && fieldValue !== null;
    default:
      return false;
  }
}

/**
 * Update automation status
 */
async function updateAutomationStatus(
  automationId: string,
  status: WorkflowStatus,
  result?: any
) {
  await supabase
    .from('automation_queue')
    .update({
      status,
      completed_at: status === 'completed' ? new Date().toISOString() : null,
      error_message: result?.error,
      result: result ? JSON.stringify(result) : null,
      updated_at: new Date().toISOString()
    })
    .eq('id', automationId);
}

/**
 * Queue a step for retry
 */
async function queueStepRetry(
  workflow: string,
  step: any,
  data: any,
  userId?: string
) {
  const retryDelay = step.retryDelay || 3600; // Default 1 hour
  
  await supabase
    .from('automation_queue')
    .insert({
      workflow: `${workflow}_retry_${step.id}`,
      user_id: userId,
      data: JSON.stringify({ step, originalData: data }),
      priority: 'low',
      status: 'scheduled',
      scheduled_for: new Date(Date.now() + retryDelay * 1000).toISOString(),
      created_at: new Date().toISOString()
    });
}

/**
 * Process scheduled automations (called by cron)
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Verify cron secret
    const cronSecret = request.headers.get('x-cron-secret');
    if (cronSecret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all pending scheduled automations
    const { data: scheduled } = await supabase
      .from('automation_queue')
      .select('id')
      .eq('status', 'scheduled')
      .lte('scheduled_for', new Date().toISOString())
      .limit(10);

    if (!scheduled || scheduled.length === 0) {
      return NextResponse.json({ processed: 0 });
    }

    // Process each automation
    const results = await Promise.allSettled(
      scheduled.map(auto => processAutomation(auto.id))
    );

    const processed = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return NextResponse.json({
      processed,
      failed,
      total: scheduled.length
    });

  } catch (error) {
    console.error('Cron processing error:', error);
    return NextResponse.json(
      { error: 'Processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Helper: Delay function
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Export for use in other modules
export { processAutomation, executeWorkflow };