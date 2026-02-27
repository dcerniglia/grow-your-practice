import Stripe from 'stripe'

function createStripeClient(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    console.warn('STRIPE_SECRET_KEY is not set — Stripe functionality disabled.')
    return null
  }
  return new Stripe(key, { apiVersion: '2026-02-25.clover' })
}

export const stripe = createStripeClient()
