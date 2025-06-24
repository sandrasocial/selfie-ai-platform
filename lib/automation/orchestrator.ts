// Agent: Automation AI provided this orchestrator
// Manages the complete automation flow
// app/api/automation/orchestrator/route.ts
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/utils/logger';
import { sendEmail, sendPurchaseConfirmation, sendMilestoneCelebration } from '@/api/automations/email';
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

  // Step 3: Email sequences - IMPLEMENTED
  try {
    if (productType === 'branded') {
      logger.info('🎯 Triggering branded welcome sequence');
      await triggerBrandedWelcomeSequence(userId, email, name, productType);
    } else {
      logger.info('🎯 Triggering starter welcome sequence');
      await triggerStarterWelcomeSequence(userId, email, name, productType);
    }
    
    // Send immediate purchase confirmation
    await sendPurchaseConfirmationEmail(email, name, {
      productName: productType === 'branded' ? 'Branded Experience' : 'Selfie Starter Kit',
      productPrice: productType === 'branded' ? '397' : '67',
      orderId: purchaseId,
      orderDate: new Date().toLocaleDateString(),
      totalAmount: productType === 'branded' ? '397' : '67',
      dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      supportUrl: `${process.env.NEXT_PUBLIC_APP_URL}/support`
    });
    
    logger.info('✅ Email automation triggered successfully');
  } catch (emailError) {
    logger.error('❌ Email automation failed:', emailError);
    // Don't fail the entire process for email issues
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

// Email sequence functions
async function triggerBrandedWelcomeSequence(userId: string, email: string, name: string, productType: string) {
  try {
    // Immediate welcome email
    await sendEmail({
      to: email,
      template: 'welcome',
      variables: { 
        name, 
        purchaseType: 'branded',
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        supportUrl: `${process.env.NEXT_PUBLIC_APP_URL}/support`
      }
    });

    // Schedule follow-up emails via Make.com webhook
    await triggerMakeWebhook('branded_welcome_sequence', {
      userId,
      email,
      name,
      productType,
      timestamp: new Date().toISOString()
    });

    logger.info(`✅ Branded welcome sequence triggered for ${email}`);
  } catch (error) {
    logger.error(`❌ Failed to trigger branded welcome sequence:`, error);
    throw error;
  }
}

async function triggerStarterWelcomeSequence(userId: string, email: string, name: string, productType: string) {
  try {
    // Immediate welcome email
    await sendEmail({
      to: email,
      template: 'welcome',
      variables: { 
        name, 
        purchaseType: 'starter',
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        supportUrl: `${process.env.NEXT_PUBLIC_APP_URL}/support`
      }
    });

    // Schedule follow-up emails via Make.com webhook
    await triggerMakeWebhook('starter_welcome_sequence', {
      userId,
      email,
      name,
      productType,
      timestamp: new Date().toISOString()
    });

    logger.info(`✅ Starter welcome sequence triggered for ${email}`);
  } catch (error) {
    logger.error(`❌ Failed to trigger starter welcome sequence:`, error);
    throw error;
  }
}

async function sendPurchaseConfirmationEmail(email: string, name: string, orderDetails: Record<string, any>) {
  try {
    await sendPurchaseConfirmation(email, name, orderDetails);
    logger.info(`✅ Purchase confirmation sent to ${email}`);
  } catch (error) {
    logger.error(`❌ Failed to send purchase confirmation:`, error);
    throw error;
  }
}

// Make.com webhook trigger
async function triggerMakeWebhook(scenarioName: string, data: Record<string, any>) {
  try {
    const webhookUrls = {
      'branded_welcome_sequence': process.env.MAKE_BRANDED_WEBHOOK_URL,
      'starter_welcome_sequence': process.env.MAKE_STARTER_WEBHOOK_URL,
      'vip_application': process.env.MAKE_VIP_WEBHOOK_URL,
      'milestone_celebration': process.env.MAKE_MILESTONE_WEBHOOK_URL
    };

    const webhookUrl = webhookUrls[scenarioName as keyof typeof webhookUrls];
    
    if (!webhookUrl) {
      logger.warn(`⚠️ No webhook URL configured for ${scenarioName}`);
      return;
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Make.com webhook failed: ${response.status}`);
    }

    logger.info(`✅ Make.com webhook triggered: ${scenarioName}`);
  } catch (error) {
    logger.error(`❌ Make.com webhook failed for ${scenarioName}:`, error);
    // Don't throw - webhook failures shouldn't break the main flow
  }
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