import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

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
        },
      },
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