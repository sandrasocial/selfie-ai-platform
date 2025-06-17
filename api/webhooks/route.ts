import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';
import { Database } from '@/types/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const supabase = createClient<Database>();

  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    ) as Stripe.DiscriminatedEvent;

    switch (event.type) {
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const previousAttributes = event.data.previous_attributes;
        const userId = subscription.metadata?.userId;

        if (!userId) {
          throw new Error('Missing userId in subscription metadata');
        }

        // Type-safe check for plan changes
        if (previousAttributes && 
            'items' in previousAttributes && 
            Array.isArray(previousAttributes.items)) {
          
          await updateSubscription(supabase, userId, subscription);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;

        if (userId) {
          await removeSubscription(supabase, userId);
        }
        break;
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 400 }
    );
  }
}

async function updateSubscription(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  subscription: Stripe.Subscription
) {
  const { error } = await supabase
    .from('users')
    .update({ 
      stripe_subscription_id: subscription.id,
      stripe_price_id: subscription.items.data[0]?.price.id,
      subscription_status: subscription.status,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (error) {
    throw new Error(`Failed to update user subscription: ${error.message}`);
  }
}

async function removeSubscription(
  supabase: ReturnType<typeof createClient>,
  userId: string
) {
  const { error } = await supabase
    .from('users')
    .update({ 
      stripe_subscription_id: null,
      stripe_price_id: null,
      subscription_status: 'inactive',
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (error) {
    throw new Error(`Failed to remove user subscription: ${error.message}`);
  }
}