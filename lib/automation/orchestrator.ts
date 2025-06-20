// Agent: Automation AI provided this orchestrator
// Manages the complete automation flow
// app/api/automation/orchestrator/route.ts
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/utils/logger';
// import commented for deployment

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

interface AutomationPayload {
  type: string;
  userId?: string;
  purchaseId?: string;
  productType?: string;
  email?: string;
  name?: string;
  [key: string]: any;
}

export async function triggerAutomation(payload: AutomationPayload) {
  logger.info('Triggering automation', payload.type);

  try {
    switch (payload.type) {
      case 'purchase_completed':
        await handlePurchaseCompleted(payload);
        break;

      case 'free_guide_requested':
        await handleFreeGuideRequest(payload);
        break;

      default:
        logger.info(`Unknown automation type: ${payload.type}`);
    }

    logger.info(`Automation completed: ${payload.type}`);
  } catch (error) {
    logger.error(`Automation failed: ${payload.type}`, error);
    throw error;
  }
}

async function handlePurchaseCompleted(payload: AutomationPayload) {
  const { userId, productType, email, name, purchaseId } = payload;

  logger.info(`Processing purchase for ${email} - ${productType}`);

  // Step 1: Send welcome email (TEMPORARILY DISABLED FOR DEPLOYMENT)
  // const emailResult = await sendEmail({
  //   type: 'purchase_welcome',
  //   to: email!,
  //   data: {
  //     name,
  //     productType,
  //     productName: getProductName(productType!),
  //     loginUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/login`
  //   }
  // });
  // if (!emailResult.success) {
  //   throw new Error(`Email failed: ${emailResult.error}`);
  // }
  // console.log(`✅ Welcome email sent to ${email}`);

  // Step 2: Queue PDF generation for later
  // TODO: Generate PDFs when PDFMonkey templates are ready
  if (productType === 'starter_kit' || productType === 'branded') {
    logger.info('PDF generation queued for later');
    
    // Store a record to generate PDFs later
    await supabase
      .from('automation_jobs')
      .insert({
        type: 'generate_workbooks',
        payload: {
          userId,
          email,
          name,
          productType,
          purchaseId
        },
        status: 'pending',
        created_at: new Date().toISOString()
      });
  }

  // Step 3: Email sequences
  // TODO: Trigger Make.com webhook for email sequences
  if (productType === 'branded') {
    logger.info('TODO: Trigger Make.com branded welcome sequence');
    // Will implement: triggerMakeWebhook('branded_welcome_sequence', {...})
  }

  // Step 4: Console notification (replacing Slack)
  logger.info('PURCHASE COMPLETED NOTIFICATION:');
  logger.info(`   Customer: ${name} (${email})`);
  logger.info(`   Product: ${getProductName(productType!)}`);
  logger.info(`   User ID: ${userId}`);
  logger.info(`   Purchase ID: ${purchaseId}`);
}

async function handleFreeGuideRequest(payload: AutomationPayload) {
  const { email, name } = payload;

  logger.info(`Processing free guide request for ${email}`);

  // Step 1: Queue PDF generation
  logger.info('PDF generation queued for later');
  
  // Store a record to generate PDF later
  const { data: job } = await supabase
    .from('automation_jobs')
    .insert({
      type: 'generate_free_guide',
      payload: {
        email,
        name
      },
      status: 'pending',
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  // Step 2: Send immediate confirmation email (TEMPORARILY DISABLED FOR DEPLOYMENT)
  // const emailResult = await sendEmail({
  //   type: 'free_guide_confirmation',
  //   to: email!,
  //   data: {
  //     name
  //   }
  // });
  // if (!emailResult.success) {
  //   throw new Error(`Email delivery failed: ${emailResult.error}`);
  // }

  // Step 3: Add to email list
  await supabase
    .from('email_list')
    .upsert({
      email,
      name,
      source: 'free_guide',
      subscribed: true,
      tags: ['free_guide', 'lead'],
      created_at: new Date().toISOString()
    }, {
      onConflict: 'email'
    });

  // Step 4: Queue nurture sequence
  // TODO: Trigger Make.com free guide nurture sequence
  logger.info('TODO: Trigger Make.com free guide nurture sequence');
  // Will implement: triggerMakeWebhook('free_guide_nurture', {...})

  logger.info(`Free guide request processed for ${email}`);
}

function getProductName(productType: string): string {
  const names: Record<string, string> = {
    starter_kit: 'Selfie Starter Kit',
    branded: 'Branded Experience',
    vip: 'VIP Program'
  };
  return names[productType] || productType;
}

// API endpoint handler for Next.js
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    await triggerAutomation(payload);
    
    return Response.json({ 
      success: true,
      message: `Automation ${payload.type} triggered successfully`
    });
  } catch (error) {
    logger.error('Automation API error:', error);
    return Response.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Automation failed'
      },
      { status: 500 }
    );
  }
}