import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { addSubscriber } from '@/lib/convertkit'
import { PrismaClient } from '@gyp/database'

const prisma = new PrismaClient()
import type Stripe from 'stripe'

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 503 },
    )
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'STRIPE_WEBHOOK_SECRET is not configured' },
      { status: 503 },
    )
  }

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 },
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 },
    )
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const email = session.customer_email ?? session.metadata?.email
    const stripeCustomerId =
      typeof session.customer === 'string'
        ? session.customer
        : session.customer?.id ?? null

    if (email) {
      try {
        await prisma.user.upsert({
          where: { email },
          update: {
            purchasedAt: new Date(),
            ...(stripeCustomerId ? { stripeCustomerId } : {}),
          },
          create: {
            email,
            purchasedAt: new Date(),
            ...(stripeCustomerId ? { stripeCustomerId } : {}),
          },
        })
        console.log(`Purchase completed for ${email}`)

        // Decision: Tag purchaser in ConvertKit for newsletter segmentation (ADR pending, Issue #19)
        addSubscriber(email, ['gyp-purchased']).catch((err) =>
          console.error('ConvertKit tagging failed after purchase:', err),
        )
      } catch (error) {
        console.error('Error upserting user after purchase:', error)
      }
    } else {
      console.warn('checkout.session.completed event missing email')
    }
  }

  return NextResponse.json({ received: true })
}
