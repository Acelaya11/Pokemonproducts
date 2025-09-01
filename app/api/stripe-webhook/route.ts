import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
  return Buffer.from(result);
}

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json(
      { error: 'Missing stripe-signature or webhook secret' },
      { status: 400 }
    );
  }

  // Initialize Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const rawBody = await buffer(req.body as ReadableStream<Uint8Array>);
    const event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    
    // Handle successful checkout
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as { id: string; line_items?: { data: Array<{ price?: { metadata?: { id?: string } } }> } };
      // Extract line items from the session
      const lineItems = session.line_items?.data || [];
      
      if (lineItems.length === 0) {
        return NextResponse.json({ received: true });
      }

      // Process each item and update database
      for (const item of lineItems) {
        const itemId = item.price?.metadata?.id;
        
        if (itemId) {
          // Update the item's availability in the database
          const { error } = await supabase
            .from('items')
            .update({ is_available: false })
            .eq('id', itemId);
          
          if (error) {
            console.error(`Error updating item ${itemId}:`, error);
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook Error:', err);
    return NextResponse.json(
      { error: `Webhook Error: ${(err as Error).message}` },
      { status: 400 }
    );
  }
} 