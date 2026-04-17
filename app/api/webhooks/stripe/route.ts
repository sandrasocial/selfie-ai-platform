// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logger } from '@/lib/utils/logger';

// Real Stripe price IDs → product mapping
// Last updated from Stripe Dashboard April 2026
const PRODUCT_MAP: Record<string, { type: string; price: number; name: string }> = {
  // Selfie Guide
  'price_1T96EJEVJvME7vkwyI7B4aqH': { type: 'selfie_guide', price: 17, name: 'Selfie Guide' },
  'price_1T8SsMEVJvME7vkwUrkiCtlA': { type: 'selfie_guide', price: 17, name: 'Selfie Guide' },
  // Brand Strategy Pack
  'price_1T8T2PEVJvME7vkwaCywCCnB': { type: 'brand_strategy', price: 19, name: 'Brand Strategy Pack' },
  // Selfie Guide + Brand Strategy Bundle
  'price_1T8TrrEVJvME7vkwIr5aC8z8': { type: 'bundle_guide_strategy', price: 27, name: 'Selfie Guide + Brand Strategy Bundle' },
  // AI Photo Prompt Pack
  'price_1T3aR3EVJvME7vkw6pzbZS9m': { type: 'photo_prompt_pack', price: 17, name: 'AI Photo Prompt Pack' },
  // Academy mini-products
  'price_1T2xljEVJvME7vkwFcaN1GEw': { type: 'academy_what_to_say', price: 17, name: 'Academy: What To Say' },
  'price_1T2xllEVJvME7vkwHC3r6GAI': { type: 'academy_show_up', price: 27, name: 'Academy: Show Up' },
  'price_1T2xlmEVJvME7vkwkbgotHoB': { type: 'academy_get_paid', price: 47, name: 'Academy: Get Paid' },
  // SSELFIE Brand Blueprint
  'price_1SnlJEEVJvME7vkw1thdr7WK': { type: 'brand_blueprint', price: 47, name: 'SSELFIE Brand Blueprint' },
  // Brand Engine Cohort
  'price_1T0RquEVJvME7vkwoSeyKs5s': { type: 'brand_engine_cohort', price: 2497, name: 'Brand Engine Cohort' },
  // Brand Engine VIP
  'price_1T0RqwEVJvME7vkwTqUP6n1z': { type: 'brand_engine_vip', price: 4997, name: 'Brand Engine VIP' },
  // SSELFIE Agents Starter
  'price_1TCfzgEVJvME7vkwU2HhzgEU': { type: 'agents_starter', price: 47, name: 'SSELFIE Agents Starter' },
  // SSELFIE SUITE (subscription)
  'price_1TCfzfEVJvME7vkwNlYft5yq': { type: 'suite_monthly', price: 97, name: 'SSELFIE SUITE Monthly' },
  // SSELFIE Studio Annual
  'price_1TA699EVJvME7vkwTyp3CUOl': { type: 'studio_annual', price: 970, name: 'SSELFIE Studio Annual' },
  // Personal brand products
  'price_1TJoluEVJvME7vkw7kM0ALUA': { type: 'personal_brand_large', price: 39, name: 'SSELFIE Personal Brand' },
  'price_1TJoluEVJvME7vkwC9T3EbO5': { type: 'personal_brand_small', price: 19, name: 'SSELFIE Personal Brand' },
  'price_1TJoltEVJvME7vkwTET2g6bH': { type: 'personal_brand_monthly', price: 97, name: 'SSELFIE Personal Brand Monthly' },
  'price_1TJolsEVJvME7vkwTvqlyLpq': { type: 'personal_brand_bundle', price: 47, name: 'SSELFIE Personal Brand Bundle' },
};

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!stripeKey || !webhookSecret || !supabaseUrl || !supabaseServiceKey) {
    logger.error('❌ Missing required environment variables for Stripe webhook');
    // Return 200 so Stripe doesn't keep retrying — this is a config issue, not a transient error
    return NextResponse.json({ received: true });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
  // Use service role key so admin operations (createUser, etc.) work
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    logger.error('❌ Missing stripe-signature header');
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    logger.error('❌ Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
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

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        logger.info(`📋 Subscription event: ${event.type}`, event.data.object.id);
        break;

      case 'invoice.payment_succeeded':
      case 'invoice.payment_failed':
        logger.info(`🧾 Invoice event: ${event.type}`, event.data.object.id);
        break;

      default:
        logger.info(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    logger.error('❌ Webhook processing error:', error);
    // Return 200 to prevent Stripe from retrying — log the error for investigation
    return NextResponse.json({ received: true });
  }
}

async function handleCheckoutComplete(
  session: Stripe.Checkout.Session,
  stripe: Stripe,
  supabase: SupabaseClient<any, any, any>
) {
  logger.info('🎉 Processing checkout completion:', session.id);

  const email = (session.customer_email || session.customer_details?.email) as string;
  const name = session.customer_details?.name as string;

  if (!email) {
    logger.error('❌ No email found in checkout session:', session.id);
    return; // Don't throw — return gracefully so we still return 200
  }

  // Get line items to determine product
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
  const priceId = lineItems.data[0]?.price?.id;

  if (!priceId) {
    logger.error('❌ No price ID found in checkout session:', session.id);
    return;
  }

  const product = PRODUCT_MAP[priceId];
  if (!product) {
    // Unknown product — log it for investigation but don't fail the webhook
    logger.error(`⚠️ Unknown price ID received: ${priceId} — add it to PRODUCT_MAP in route.ts`);
    return;
  }

  logger.info(`📦 Product purchased: ${product.name} ($${product.price})`);

  // Check for existing user
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  let userId: string;

  if (existingUser) {
    logger.info('👤 Updating existing user:', email);
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        full_name: name,
        stripe_customer_id: session.customer as string,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingUser.id as string)
      .select()
      .single();

    if (updateError || !updatedUser) {
      throw new Error(`Failed to update user: ${updateError?.message}`);
    }
    userId = updatedUser.id as string;
  } else {
    logger.info('👤 Creating new user:', email);
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { full_name: name }
    });

    if (authError || !authData.user) {
      throw new Error(`Failed to create auth user: ${authError?.message}`);
    }

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

  // Record purchase
  logger.info('💳 Recording purchase...');
  const { error: purchaseError } = await supabase
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
    });

  if (purchaseError) {
    throw new Error(`Failed to record purchase: ${purchaseError.message}`);
  }

  // Grant access
  logger.info('🔓 Granting product access...');
  await grantProductAccess(userId, product.type, supabase);

  logger.info(`✅ Processed purchase: ${email} — ${product.name} ($${product.price})`);
}

async function grantProductAccess(
  userId: string,
  productType: string,
  supabase: SupabaseClient<any, any, any>
) {
  const accessData: Record<string, unknown> = {
    user_id: userId,
    granted_at: new Date().toISOString()
  };

  switch (productType) {
    case 'selfie_guide':
      accessData.selfie_guide_access = true;
      break;
    case 'brand_strategy':
      accessData.brand_strategy_access = true;
      break;
    case 'bundle_guide_strategy':
      accessData.selfie_guide_access = true;
      accessData.brand_strategy_access = true;
      break;
    case 'photo_prompt_pack':
      accessData.photo_prompt_pack_access = true;
      break;
    case 'academy_what_to_say':
    case 'academy_show_up':
    case 'academy_get_paid':
      accessData[`${productType}_access`] = true;
      break;
    case 'brand_blueprint':
      accessData.brand_blueprint_access = true;
      break;
    case 'agents_starter':
      accessData.ai_credits = 60;
      break;
    case 'suite_monthly':
      accessData.ai_credits = 200;
      accessData.suite_access = true;
      break;
    case 'studio_annual':
      accessData.studio_access = true;
      break;
    case 'brand_engine_cohort':
    case 'brand_engine_vip':
      accessData.brand_engine_access = true;
      break;
    default:
      accessData[`${productType}_access`] = true;
  }

  const { error } = await supabase
    .from('user_access')
    .upsert(accessData, { onConflict: 'user_id' });

  if (error) {
    throw new Error(`Failed to grant access: ${error.message}`);
  }

  const isPremium = ['brand_engine_vip', 'brand_engine_cohort', 'suite_monthly', 'studio_annual'].includes(productType);
  await supabase
    .from('users')
    .update({ role: isPremium ? 'premium' : 'basic', updated_at: new Date().toISOString() })
    .eq('id', userId);

  logger.info(`✅ Access granted: ${productType} for user ${userId}`);
}
