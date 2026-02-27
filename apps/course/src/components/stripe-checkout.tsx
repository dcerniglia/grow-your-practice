'use client'

import { useCallback, useState } from 'react'
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
)

interface StripeCheckoutProps {
  email: string
}

export function StripeCheckout({ email }: StripeCheckoutProps) {
  const [error, setError] = useState<string | null>(null)

  const fetchClientSecret = useCallback(async () => {
    const response = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error ?? 'Failed to create checkout session')
    }

    const data = await response.json()
    return data.clientSecret as string
  }, [email])

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-800">{error}</p>
        <button
          onClick={() => setError(null)}
          className="mt-4 text-sm font-medium text-primary underline"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{
        fetchClientSecret,
        onComplete: () => {
          // Stripe handles the redirect via return_url
        },
      }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  )
}
