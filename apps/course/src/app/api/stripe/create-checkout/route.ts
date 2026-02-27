import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 503 },
    )
  }

  const priceId = process.env.STRIPE_PRICE_ID
  if (!priceId) {
    return NextResponse.json(
      { error: 'STRIPE_PRICE_ID is not configured' },
      { status: 503 },
    )
  }

  try {
    const body = await request.json()
    const { email, promoCode } = body as { email: string; promoCode?: string }

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const origin = request.headers.get('origin') ?? ''

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      metadata: { email },
      ui_mode: 'embedded',
      return_url: `${origin}/auth/callback?session_id={CHECKOUT_SESSION_ID}`,
    }

    if (promoCode) {
      sessionParams.discounts = [{ coupon: promoCode }]
    } else {
      sessionParams.allow_promotion_codes = true
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return NextResponse.json({ clientSecret: session.client_secret })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
