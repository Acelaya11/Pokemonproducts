import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

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

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    const rawBody = await buffer(req.body as any);
    event = stripe.webhooks.constructEvent(rawBody, sig!, webhookSecret!);
  } catch (err) {
    return NextResponse.json({ error: `Webhook Error: ${(err as Error).message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    try {
      // Retrieve the line items for this session
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
      for (const item of lineItems.data) {
        if (item.price && item.price.product) {
          const product = await stripe.products.retrieve(item.price.product as string);
          const id = product.metadata.id;
          const type = product.metadata.type;
          if (id && type) {
            if (type === 'card') {
              await supabase.from('cards').update({ is_available: false }).eq('id', id);
            } else if (type === 'sealed') {
              await supabase.from('sealed_products').update({ is_available: false }).eq('id', id);
            }
          }
        }
      }
    } catch (err) {
      return NextResponse.json({ error: `DB Update Error: ${(err as Error).message}` }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
} 