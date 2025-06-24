import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, sendMilestoneCelebration } from '@/api/automations/email';
import { logger } from '@/lib/utils/logger';

export async function POST(req: NextRequest) {
  try {
    const { type, userId, email, name, data } = await req.json();

    logger.info(`📧 Processing email automation: ${type} for ${email}`);

    switch (type) {
      case 'milestone_celebration':
        await handleMilestoneCelebration(email, name, data);
        break;
        
      case 'course_completion':
        await handleCourseCompletion(email, name, data);
        break;
        
      case 'vip_application':
        await handleVIPApplication(email, name, data);
        break;
        
      case 'exclusive_content':
        await handleExclusiveContent(email, name, data);
        break;
        
      case 'abandoned_cart':
        await handleAbandonedCart(email, name, data);
        break;
        
      default:
        return NextResponse.json(
          { error: `Unknown automation type: ${type}` },
          { status: 400 }
        );
    }

    logger.info(`✅ Email automation completed: ${type}`);
    return NextResponse.json({ success: true, type });

  } catch (error) {
    logger.error('❌ Email automation failed:', error);
    return NextResponse.json(
      { error: 'Automation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function handleMilestoneCelebration(email: string, name: string, data: any) {
  await sendMilestoneCelebration(email, name, data.milestone);
  
  // Trigger Make.com webhook for follow-up sequence
  await triggerMakeWebhook('milestone_celebration', {
    email,
    name,
    milestone: data.milestone,
    progressPercent: data.progressPercent || 0,
    daysActive: data.daysActive || 0,
    nextMilestone: data.nextMilestone || 'Next Goal'
  });
}

async function handleCourseCompletion(email: string, name: string, data: any) {
  await sendEmail({
    to: email,
    template: 'course-completion',
    variables: {
      name,
      courseName: data.courseName,
      completionDate: new Date().toLocaleDateString(),
      certificateUrl: data.certificateUrl,
      nextSteps: data.nextSteps,
      dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    }
  });
}

async function handleVIPApplication(email: string, name: string, data: any) {
  await sendEmail({
    to: email,
    template: 'vip-application',
    variables: {
      name,
      applicationId: data.applicationId,
      submissionDate: new Date().toLocaleDateString(),
      businessStage: data.businessStage,
      primaryGoal: data.primaryGoal
    }
  });
}

async function handleExclusiveContent(email: string, name: string, data: any) {
  await sendEmail({
    to: email,
    template: 'exclusive-content',
    variables: {
      name,
      contentTitle: data.contentTitle,
      contentUrl: data.contentUrl,
      contentType: data.contentType,
      unlockReason: data.unlockReason
    }
  });
}

async function handleAbandonedCart(email: string, name: string, data: any) {
  await sendEmail({
    to: email,
    template: 'abandoned-cart-reminder',
    variables: {
      name,
      productName: data.productName,
      cartUrl: data.cartUrl,
      discountCode: data.discountCode,
      expiryDate: data.expiryDate
    }
  });
}

// Make.com webhook trigger helper
async function triggerMakeWebhook(scenarioName: string, data: Record<string, any>) {
  try {
    const webhookUrls = {
      'milestone_celebration': process.env.MAKE_MILESTONE_WEBHOOK_URL,
      'course_completion': process.env.MAKE_COURSE_COMPLETION_WEBHOOK_URL,
      'vip_follow_up': process.env.MAKE_VIP_FOLLOW_UP_WEBHOOK_URL
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
  }
}
