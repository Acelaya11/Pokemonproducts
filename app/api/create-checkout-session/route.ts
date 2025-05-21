import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

interface CartItem {
  id: number;
  item_name: string;
  price: number;
  imageUrl: string;
  type: 'card' | 'sealed';
  set?: string;
  psa_grade?: string;
  series?: string;
  email?: string;
}

export async function POST(req: Request) {
  try {
    const { items, email } = await req.json() as { items: CartItem[], email?: string };

    // Check availability and reserve items
    for (const item of items) {
      const { data, error } = await supabase
        .from(item.type === 'card' ? 'cards' : 'sealed_products')
        .select('is_available')
        .eq('id', item.id)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: `Item ${item.item_name} not found` },
          { status: 404 }
        );
      }

      if (!data.is_available) {
        return NextResponse.json(
          { error: `Item ${item.item_name} is no longer available` },
          { status: 400 }
        );
      }

      // Reserve the item
      const { error: updateError } = await supabase
        .from(item.type === 'card' ? 'cards' : 'sealed_products')
        .update({ is_available: false })
        .eq('id', item.id);

      if (updateError) {
        return NextResponse.json(
          { error: `Failed to reserve item ${item.item_name}` },
          { status: 500 }
        );
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: CartItem) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.item_name,
            metadata: {
              id: String(item.id),
              type: item.type,
            },
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: 1,
      })),
      mode: 'payment',
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/Ponchos?canceled=true`,
      customer_email: email || undefined,
      automatic_tax: { enabled: true },
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: 'Thank you for your purchase!',
          account_tax_ids: ['txr_1Qxxxxxxxxxxxxx'], // You'll need to add your tax ID here
          custom_fields: [
            {
              name: 'Order Type',
              value: 'Pokemon Cards & Products',
            },
          ],
        },
      },
      payment_intent_data: {
        receipt_email: email || undefined,
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: 'usd',
            },
            display_name: 'Free Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
      ],
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { error: error.message },
      { status: error instanceof Error ? 500 : 500 }
    );
  }
} 