// Agent: Automation AI provided this Stripe webhook handler
// This handles payments and creates users automatically // app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/utils/logger';

// Product mapping - UPDATE THESE WITH YOUR STRIPE PRICE IDS
const PRODUCT_MAP = {
  'price_1234567890': { // Replace with your Starter Kit price ID
    type: 'starter_kit',
    price: 67,
    name: 'Selfie Starter Kit'
  },
  'price_0987654321': { // Replace with your Branded price ID
    type: 'branded',
    price: 397,
    name: 'Branded Experience'
  }
};

export async function POST(req: NextRequest) {
  // Initialize services inside the handler to avoid build-time errors
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
  });
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL! as string,
    process.env.SUPABASE_SERVICE_KEY! as string
  ) as any;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  // Verify webhook signature
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    logger.error('❌ Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  logger.info(`📨 Processing webhook: ${event.type} - ${event.id}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object as Stripe.Checkout.Session, stripe, supabase);
        break;

      case 'payment_intent.succeeded':
        logger.info('💰 Payment succeeded:', event.data.object.id);
        break;

      default:
        logger.info(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    logger.error('❌ Webhook processing error:', error);
    // Return success to prevent Stripe retries
    return NextResponse.json({ received: true });
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session, stripe: Stripe, supabase: ReturnType<typeof createClient>) {
  logger.info('🎉 Processing checkout completion:', session.id);

  // Extract customer info
  const email = (session.customer_email || session.customer_details?.email) as string;
  const name = session.customer_details?.name as string;
  
  if (!email) {
    throw new Error('No email found in checkout session');
  }

  // Get line items to determine product
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
  const priceId = lineItems.data[0]?.price?.id as string;
  
  if (!priceId) {
    throw new Error('No price ID found in checkout session');
  }

  const product = PRODUCT_MAP[priceId as keyof typeof PRODUCT_MAP];
  if (!product) {
    logger.error(`❌ Unknown product for price ID: ${priceId}`);
    // Log available price IDs for debugging
    logger.info('Available price IDs:', Object.keys(PRODUCT_MAP));
    throw new Error(`Unknown product for price ID: ${priceId}`);
  }

  logger.info(`📦 Product purchased: ${product.name} ($${product.price})`);

  // Create or update user
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  let userId: string;

  if (existingUser) {
    // Update existing user
    logger.info('👤 Updating existing user:', email);
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        full_name: name,
        stripe_customer_id: session.customer as string,
        updated_at: new Date().toISOString()
      })
      .eq('id', (existingUser.id as string))
      .select()
      .single();

    if (updateError || !updatedUser) {
      throw new Error(`Failed to update user: ${updateError?.message}`);
    }
    userId = updatedUser.id as string;
  } else {
    // Create new user via auth
    logger.info('👤 Creating new user:', email);
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        full_name: name
      }
    });

    if (authError || !authData.user) {
      throw new Error(`Failed to create auth user: ${authError?.message}`);
    }

    // Create user record
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        full_name: name,
        stripe_customer_id: session.customer as string
      })
      .select()
      .single();

    if (userError || !newUser) {
      throw new Error(`Failed to create user record: ${userError?.message}`);
    }
    userId = newUser.id as string;
  }

  // Create purchase record
  logger.info('💳 Recording purchase...');
  const { data: purchase, error: purchaseError } = await supabase
    .from('purchases')
    .insert({
      user_id: userId,
      product_type: product.type,
      product_name: product.name,
      amount: session.amount_total! / 100,
      currency: session.currency,
      stripe_payment_id: session.payment_intent as string,
      stripe_session_id: session.id,
      status: 'completed',
      purchased_at: new Date().toISOString()
    })
    .select()
    .single();

  if (purchaseError || !purchase) {
    throw new Error(`Failed to record purchase: ${purchaseError?.message}`);
  }

  // Grant access based on product
  logger.info('🔓 Granting product access...');
  await grantProductAccess(userId, product.type, supabase);

  // Import and trigger automation
  // const { triggerAutomation } = await import('path-to-automation');
  // await triggerAutomation({
  //   type: 'purchase_completed',
  //   userId,
  //   purchaseId: purchase.id,
  //   productType: product.type,
  //   email,
  //   name: name || 'Friend'
  // });

  logger.info(`✅ Successfully processed purchase for ${email} - ${product.name}`);
  
  // Log notification (replace Slack)
  logger.info('🎊 NEW PURCHASE NOTIFICATION:');
  logger.info(`   Customer: ${name} (${email})`);
  logger.info(`   Product: ${product.name}`);
  logger.info(`   Amount: $${session.amount_total! / 100}`);
  logger.info(`   Time: ${new Date().toISOString()}`);
}

async function grantProductAccess(userId: string, productType: string, supabase: ReturnType<typeof createClient>) {
  const accessData: any = {
    user_id: userId,
    granted_at: new Date().toISOString()
  };

  switch (productType) {
    case 'starter_kit':
      accessData.starter_kit_access = true;
      accessData.course_modules = ['module_1', 'module_2', 'module_3'];
      accessData.workbook_access = true;
      break;

    case 'branded':
      accessData.starter_kit_access = true;
      accessData.branded_access = true;
      accessData.course_modules = 'all';
      accessData.ai_credits = 1000;
      accessData.pose_coach_access = true;
      accessData.brand_tools_access = true;
      accessData.workbook_access = true;
      break;
  }

  const { error } = await supabase
    .from('user_access')
    .upsert(accessData, {
      onConflict: 'user_id'
    });

  if (error) {
    throw new Error(`Failed to grant access: ${error.message}`);
  }

  // Update user role
  const role = productType === 'branded' ? 'premium' : 'basic';
  await supabase
    .from('users')
    .update({
      role,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  logger.info(`✅ Access granted: ${productType} for user ${userId}`);
}
