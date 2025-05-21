import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';

// Required for Next.js 15 webhook handling
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Stripe requires the raw body to validate the signature
export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: ReadableStream<Uint8Array>) {
  const reader = readable.getReader();
  let result = new Uint8Array(0);
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const newResult = new Uint8Array(result.length + value.length);
    newResult.set(result);
    newResult.set(value, result.length);
    result = newResult;
  }
  // Convert Uint8Array to Buffer for Stripe
  return Buffer.from(result);
}

async function updateItemAvailability(session: Stripe.Checkout.Session, makeAvailable: boolean) {
  try {
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
    for (const item of lineItems.data) {
      if (item.price && item.price.product) {
        const product = await stripe.products.retrieve(item.price.product as string);
        const id = product.metadata.id;
        const type = product.metadata.type;
        if (id && type) {
          if (type === 'card') {
            await supabase.from('cards').update({ is_available: makeAvailable }).eq('id', id);
          } else if (type === 'sealed') {
            await supabase.from('sealed_products').update({ is_available: makeAvailable }).eq('id', id);
          }
        }
      }
    }
  } catch (err) {
    console.error('DB Update Error:', err);
    throw err;
  }
}

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // Temporary logging for debugging
  console.log('Webhook received');
  console.log('Signature:', sig);
  console.log('Webhook secret exists:', !!webhookSecret);

  if (!sig || !webhookSecret) {
    console.error('Missing stripe-signature or webhook secret');
    return NextResponse.json(
      { error: 'Missing stripe-signature or webhook secret' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    const rawBody = await buffer(req.body as ReadableStream<Uint8Array>);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook Error:', err);
    return NextResponse.json(
      { error: `Webhook Error: ${(err as Error).message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        // Payment successful, keep items as unavailable
        const session = event.data.object as Stripe.Checkout.Session;
        await updateItemAvailability(session, false);
        break;

      case 'checkout.session.expired':
      case 'payment_intent.payment_failed':
        // Payment failed or session expired, make items available again
        const failedSession = event.data.object as Stripe.Checkout.Session;
        await updateItemAvailability(failedSession, true);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return NextResponse.json(
      { error: `Error processing webhook: ${(err as Error).message}` },
      { status: 500 }
    );
  }
} 