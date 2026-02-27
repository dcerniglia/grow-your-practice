'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SproutAnimation } from '@/components/sprout-animation'

type TechComfort = 'beginner' | 'intermediate' | 'comfortable'

const GOALS = [
  'Save time on notes',
  'Get more clients',
  'Improve client care',
  'Reduce burnout',
  'Better marketing',
] as const

const TECH_OPTIONS: { value: TechComfort; emoji: string; label: string }[] = [
  { value: 'beginner', emoji: '🌱', label: 'I barely use my phone' },
  { value: 'intermediate', emoji: '🌿', label: 'I use apps but AI is new to me' },
  { value: 'comfortable', emoji: '🌳', label: "I've tried ChatGPT a few times" },
]

const READY_MESSAGES: Record<TechComfort, string> = {
  beginner:
    "Perfect — this course was built for you. We start from the very beginning, and every step is designed to feel approachable. You'll be amazed at what you can do.",
  intermediate:
    "Great — you've got a solid foundation. This course will show you how to use AI specifically for your therapy practice, in ways that are practical and compliant.",
  comfortable:
    "Awesome — you already know the basics. We'll take you further with therapy-specific workflows, HIPAA-safe techniques, and strategies to transform your practice.",
}

const TOTAL_STEPS = 5

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const [name, setName] = useState('')
  const [techComfort, setTechComfort] = useState<TechComfort | null>(null)
  const [goals, setGoals] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  function goForward() {
    setDirection('forward')
    setStep((s) => s + 1)
  }

  function goBack() {
    setDirection('back')
    setStep((s) => s - 1)
  }

  function toggleGoal(goal: string) {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal],
    )
  }

  async function handleComplete() {
    setSubmitting(true)
    try {
      await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, techComfortLevel: techComfort, goals }),
      })
    } catch (err) {
      console.error('Onboarding save error:', err)
    }
    router.push('/dashboard')
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center">
      {/* Progress dots */}
      <div className="mb-8 flex gap-2">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
              i === step ? 'bg-primary' : i < step ? 'bg-primary-light' : 'bg-border'
            }`}
          />
        ))}
      </div>

      {/* Step card */}
      <div
        key={step}
        className={`w-full max-w-lg rounded-card bg-surface p-8 shadow-card ${
          direction === 'forward' ? 'animate-fade-in-right' : 'animate-fade-in-left'
        }`}
      >
        {step === 0 && (
          <div className="text-center">
            <SproutAnimation />
            <h1 className="font-heading text-3xl text-primary">
              Welcome to Grow Your Practice
            </h1>
            <p className="mt-4 text-text-muted">
              In just a few quick questions, we&apos;ll personalize your learning experience.
            </p>
            <button
              onClick={goForward}
              className="mt-8 rounded-button bg-primary px-8 py-3 font-medium text-white transition-colors hover:bg-primary-dark"
            >
              Let&apos;s get started
            </button>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="font-heading text-2xl text-text">What should we call you?</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your first name"
              autoFocus
              className="mt-6 w-full rounded-input border border-border bg-background px-4 py-3 text-text placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="mt-8 flex justify-between">
              <button
                onClick={goBack}
                className="rounded-button px-5 py-2.5 text-sm text-text-muted hover:text-text"
              >
                &larr; Back
              </button>
              <button
                onClick={goForward}
                disabled={!name.trim()}
                className="rounded-button bg-primary px-6 py-2.5 font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-40"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-heading text-2xl text-text">
              How comfortable are you with technology?
            </h2>
            <div className="mt-6 space-y-3">
              {TECH_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTechComfort(opt.value)}
                  className={`flex w-full items-center gap-3 rounded-card border-2 p-4 text-left transition-colors ${
                    techComfort === opt.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary-light'
                  }`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="text-text">{opt.label}</span>
                </button>
              ))}
            </div>
            <div className="mt-8 flex justify-between">
              <button
                onClick={goBack}
                className="rounded-button px-5 py-2.5 text-sm text-text-muted hover:text-text"
              >
                &larr; Back
              </button>
              <button
                onClick={goForward}
                disabled={!techComfort}
                className="rounded-button bg-primary px-6 py-2.5 font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-40"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-heading text-2xl text-text">What matters most to you?</h2>
            <p className="mt-2 text-sm text-text-muted">Select all that apply.</p>
            <div className="mt-6 space-y-3">
              {GOALS.map((goal) => (
                <button
                  key={goal}
                  onClick={() => toggleGoal(goal)}
                  className={`flex w-full items-center gap-3 rounded-card border-2 p-4 text-left transition-colors ${
                    goals.includes(goal)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary-light'
                  }`}
                >
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                      goals.includes(goal)
                        ? 'border-primary bg-primary text-white'
                        : 'border-border'
                    }`}
                  >
                    {goals.includes(goal) && (
                      <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-text">{goal}</span>
                </button>
              ))}
            </div>
            <div className="mt-8 flex justify-between">
              <button
                onClick={goBack}
                className="rounded-button px-5 py-2.5 text-sm text-text-muted hover:text-text"
              >
                &larr; Back
              </button>
              <button
                onClick={goForward}
                disabled={goals.length === 0}
                className="rounded-button bg-primary px-6 py-2.5 font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-40"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center">
            <div className="mb-4 text-5xl">🎉</div>
            <h2 className="font-heading text-2xl text-text">
              You&apos;re ready{name ? `, ${name}` : ''}!
            </h2>
            <p className="mt-4 text-text-muted">
              {techComfort ? READY_MESSAGES[techComfort] : ''}
            </p>
            <button
              onClick={handleComplete}
              disabled={submitting}
              className="mt-8 rounded-button bg-accent px-8 py-3 font-medium text-white transition-colors hover:bg-accent-dark disabled:opacity-60"
            >
              {submitting ? 'Saving...' : "Let's get started →"}
            </button>
            <div className="mt-4">
              <button
                onClick={goBack}
                className="text-sm text-text-muted hover:text-text"
              >
                &larr; Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
