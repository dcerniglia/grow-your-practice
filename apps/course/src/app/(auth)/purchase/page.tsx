'use client'

import { useState } from 'react'
import { StripeCheckout } from '@/components/stripe-checkout'

export default function PurchasePage() {
  const [email, setEmail] = useState('')
  const [showCheckout, setShowCheckout] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setShowCheckout(true)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="rounded-[12px] bg-surface p-8 shadow-card">
          <h1 className="font-heading text-3xl text-primary">
            Grow Your Practice with AI
          </h1>
          <p className="mt-3 text-text-muted">
            The complete course for therapists ready to save time, reduce
            burnout, and deliver better outcomes with AI tools built for private
            practice.
          </p>

          <div className="mt-6 rounded-[8px] bg-background p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-text-muted">
                Founding Member Pricing
              </span>
              <span className="font-heading text-2xl text-primary">$297</span>
            </div>
            <p className="mt-1 text-xs text-text-muted">
              One-time payment &middot; Lifetime access &middot; All future
              updates included
            </p>
          </div>

          {!showCheckout ? (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-text"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-[6px] border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-[8px] bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
              >
                Continue to Checkout
              </button>
            </form>
          ) : (
            <div className="mt-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-text-muted">
                  Checking out as <strong>{email}</strong>
                </p>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-sm text-primary hover:underline"
                >
                  Change
                </button>
              </div>
              <StripeCheckout email={email} />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
