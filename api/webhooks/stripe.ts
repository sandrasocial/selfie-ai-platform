import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

// Initialize Supabase admin client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Webhook event types we handle
type WebhookEvent = 
  | 'checkout.session.completed'
  | 'customer.subscription.created'
  | 'customer.subscription.updated'
  | 'customer.subscription.deleted'
  | 'invoice.payment_succeeded'
  | 'invoice.payment_failed';

/**
 * Main Stripe webhook handler
 * Processes payment events and updates user data
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  console.log(`Processing webhook: ${event.type}`);

  try {
    // Handle different event types
    switch (event.type as WebhookEvent) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Log webhook processing
    await supabase.from('webhook_logs').insert({
      service: 'stripe',
      event_type: event.type,
      event_id: event.id,
      processed_at: new Date().toISOString(),
      status: 'success'
    });

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);

    // Log error
    await supabase.from('webhook_logs').insert({
      service: 'stripe',
      event_type: event.type,
      event_id: event.id,
      processed_at: new Date().toISOString(),
      status: 'error',
      error_message: error instanceof Error ? error.message : 'Unknown error'
    });

    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful checkout completion
 * Creates user purchase record and triggers automation
 */
async function handleCheckoutCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  
  // Extract metadata
  const userId = session.metadata?.user_id;
  const productId = session.metadata?.product_id;
  const productType = session.metadata?.product_type || 'course';
  
  if (!userId || !productId) {
    throw new Error('Missing required metadata in checkout session');
  }

  // Create purchase record
  const { data: purchase, error: purchaseError } = await supabase
    .from('purchases')
    .insert({
      user_id: userId,
      stripe_session_id: session.id,
      stripe_customer_id: session.customer as string,
      product_id: productId,
      product_type: productType,
      amount: session.amount_total! / 100, // Convert from cents
      currency: session.currency,
      status: 'completed',
      purchased_at: new Date().toISOString()
    })
    .select()
    .single();

  if (purchaseError) {
    throw new Error(`Failed to create purchase record: ${purchaseError.message}`);
  }

  // Grant access based on product type
  if (productType === 'course') {
    await grantCourseAccess(userId, productId);
  } else if (productType === 'tools') {
    await grantToolAccess(userId, productId);
  }

  // Trigger welcome automation
  await triggerWelcomeAutomation({
    userId,
    productId,
    purchaseId: purchase.id,
    email: session.customer_details?.email!,
    name: session.customer_details?.name!
  });

  console.log(`Checkout completed for user ${userId}, product ${productId}`);
}

/**
 * Handle new subscription creation
 */
async function handleSubscriptionCreated(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  
  const userId = subscription.metadata?.user_id;
  if (!userId) {
    throw new Error('Missing user_id in subscription metadata');
  }

  // Create or update subscription record
  const { error } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer as string,
      status: subscription.status,
      price_id: subscription.items.data[0].price.id,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      created_at: new Date().toISOString()
    }, {
      onConflict: 'stripe_subscription_id'
    });

  if (error) {
    throw new Error(`Failed to create subscription record: ${error.message}`);
  }

  // Update user profile with subscription status
  await supabase
    .from('profiles')
    .update({
      subscription_status: 'active',
      subscription_tier: getSubscriptionTier(subscription.items.data[0].price.id),
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);

  console.log(`Subscription created for user ${userId}`);
}

/**
 * Handle subscription updates
 */
async function handleSubscriptionUpdated(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const previousAttributes = event.data.previous_attributes;
  
  const userId = subscription.metadata?.user_id;
  if (!userId) {
    throw new Error('Missing user_id in subscription metadata');
  }

  // Update subscription record
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      price_id: subscription.items.data[0].price.id,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    throw new Error(`Failed to update subscription: ${error.message}`);
  }

  // Check if plan changed
  if (previousAttributes?.items) {
    await handlePlanChange(userId, subscription);
  }

  // Update user profile
  await supabase
    .from('profiles')
    .update({
      subscription_status: subscription.status === 'active' ? 'active' : 'inactive',
      subscription_tier: getSubscriptionTier(subscription.items.data[0].price.id),
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);

  console.log(`Subscription updated for user ${userId}`);
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionDeleted(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  
  const userId = subscription.metadata?.user_id;
  if (!userId) {
    throw new Error('Missing user_id in subscription metadata');
  }

  // Update subscription record
  await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id);

  // Update user profile
  await supabase
    .from('profiles')
    .update({
      subscription_status: 'canceled',
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);

  // Trigger cancellation automation
  await triggerCancellationAutomation(userId, subscription.id);

  console.log(`Subscription canceled for user ${userId}`);
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;
  
  // Log payment
  await supabase
    .from('payment_history')
    .insert({
      stripe_invoice_id: invoice.id,
      stripe_customer_id: invoice.customer as string,
      amount: invoice.amount_paid / 100,
      currency: invoice.currency,
      status: 'succeeded',
      paid_at: new Date().toISOString()
    });

  console.log(`Payment succeeded for invoice ${invoice.id}`);
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;
  const customerId = invoice.customer as string;
  
  // Log failed payment
  await supabase
    .from('payment_history')
    .insert({
      stripe_invoice_id: invoice.id,
      stripe_customer_id: customerId,
      amount: invoice.amount_due / 100,
      currency: invoice.currency,
      status: 'failed',
      failed_at: new Date().toISOString()
    });

  // Get user from customer ID
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (subscription?.user_id) {
    // Trigger payment failed automation
    await triggerPaymentFailedAutomation(subscription.user_id, invoice.id);
  }

  console.log(`Payment failed for invoice ${invoice.id}`);
}

/**
 * Grant course access to user
 */
async function grantCourseAccess(userId: string, courseId: string) {
  const { error } = await supabase
    .from('course_access')
    .insert({
      user_id: userId,
      course_id: courseId,
      granted_at: new Date().toISOString(),
      expires_at: null // Lifetime access
    });

  if (error) {
    throw new Error(`Failed to grant course access: ${error.message}`);
  }
}

/**
 * Grant tool access to user
 */
async function grantToolAccess(userId: string, toolId: string) {
  const { error } = await supabase
    .from('tool_access')
    .insert({
      user_id: userId,
      tool_id: toolId,
      granted_at: new Date().toISOString()
    });

  if (error) {
    throw new Error(`Failed to grant tool access: ${error.message}`);
  }
}

/**
 * Determine subscription tier from price ID
 */
function getSubscriptionTier(priceId: string): string {
  const tierMap = {
    [process.env.STRIPE_PRICE_STARTER!]: 'starter',
    [process.env.STRIPE_PRICE_PRO!]: 'pro',
    [process.env.STRIPE_PRICE_BUSINESS!]: 'business'
  };
  
  return tierMap[priceId] || 'starter';
}

/**
 * Handle plan changes
 */
async function handlePlanChange(userId: string, subscription: Stripe.Subscription) {
  const newTier = getSubscriptionTier(subscription.items.data[0].price.id);
  
  // Log plan change
  await supabase
    .from('plan_changes')
    .insert({
      user_id: userId,
      new_tier: newTier,
      changed_at: new Date().toISOString()
    });

  // Trigger plan change automation
  await triggerPlanChangeAutomation(userId, newTier);
}

/**
 * Trigger welcome automation flow
 */
async function triggerWelcomeAutomation(data: {
  userId: string;
  productId: string;
  purchaseId: string;
  email: string;
  name: string;
}) {
  // Queue automation task
  const { error } = await supabase
    .from('automation_queue')
    .insert({
      workflow: 'welcome_new_purchase',
      user_id: data.userId,
      data: JSON.stringify(data),
      status: 'pending',
      created_at: new Date().toISOString()
    });

  if (error) {
    console.error('Failed to queue welcome automation:', error);
  }
}

/**
 * Trigger cancellation automation
 */
async function triggerCancellationAutomation(userId: string, subscriptionId: string) {
  await supabase
    .from('automation_queue')
    .insert({
      workflow: 'subscription_canceled',
      user_id: userId,
      data: JSON.stringify({ subscriptionId }),
      status: 'pending',
      created_at: new Date().toISOString()
    });
}

/**
 * Trigger payment failed automation
 */
async function triggerPaymentFailedAutomation(userId: string, invoiceId: string) {
  await supabase
    .from('automation_queue')
    .insert({
      workflow: 'payment_failed',
      user_id: userId,
      data: JSON.stringify({ invoiceId }),
      status: 'pending',
      created_at: new Date().toISOString()
    });
}

/**
 * Trigger plan change automation
 */
async function triggerPlanChangeAutomation(userId: string, newTier: string) {
  await supabase
    .from('automation_queue')
    .insert({
      workflow: 'plan_changed',
      user_id: userId,
      data: JSON.stringify({ newTier }),
      status: 'pending',
      created_at: new Date().toISOString()
    });
}

// Health check endpoint
export async function GET(request: NextRequest): Promise<NextResponse> {
  return NextResponse.json({
    status: 'healthy',
    service: 'SELFIE AI™ Stripe Webhooks',
    version: '4.0',
    timestamp: new Date().toISOString()
  });
}