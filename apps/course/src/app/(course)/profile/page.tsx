'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/use-auth'
import { PageTransition } from '@/components/page-transition'
import { AnimatedProgressBar } from '@/components/animated-progress-bar'

type TechComfort = 'beginner' | 'intermediate' | 'comfortable'

const TECH_OPTIONS: { value: TechComfort; label: string }[] = [
  { value: 'beginner', label: '🌱 Beginner — I barely use my phone' },
  { value: 'intermediate', label: '🌿 Intermediate — I use apps but AI is new' },
  { value: 'comfortable', label: '🌳 Comfortable — I\'ve tried ChatGPT' },
]

type ProfileData = {
  name: string
  techComfortLevel: TechComfort | ''
  purchasedAt: string | null
  lessonsCompleted: number
  modulesCompleted: number
  totalLessons: number
  totalModules: number
}

export default function ProfilePage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [name, setName] = useState('')
  const [techComfort, setTechComfort] = useState<TechComfort | ''>('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/profile')
        if (res.ok) {
          const data = (await res.json()) as ProfileData
          setProfile(data)
          setName(data.name || '')
          setTechComfort(data.techComfortLevel || '')
        }
      } catch (err) {
        console.error('Failed to load profile:', err)
      }
      setLoadingProfile(false)
    }
    if (!authLoading && user) loadProfile()
    if (!authLoading && !user) setLoadingProfile(false)
  }, [authLoading, user])

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, techComfortLevel: techComfort }),
      })
      if (res.ok) setSaved(true)
    } catch (err) {
      console.error('Save error:', err)
    }
    setSaving(false)
    setTimeout(() => setSaved(false), 3000)
  }

  if (authLoading || loadingProfile) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="h-8 w-48 animate-pulse rounded bg-border" />
        <div className="mt-8 space-y-4">
          <div className="h-24 animate-pulse rounded-card bg-surface" />
          <div className="h-24 animate-pulse rounded-card bg-surface" />
        </div>
      </div>
    )
  }

  const progressPercent =
    profile && profile.totalLessons > 0
      ? Math.round((profile.lessonsCompleted / profile.totalLessons) * 100)
      : 0

  return (
    <PageTransition>
    <div className="mx-auto max-w-2xl">
      <h1 className="font-heading text-3xl text-primary">Profile</h1>

      {/* Account info */}
      <div className="mt-8 rounded-card bg-surface p-6 shadow-card">
        <h2 className="mb-4 font-heading text-lg text-text">Account</h2>
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-text-muted">Email</label>
          <p className="text-text">{user?.email ?? '—'}</p>
        </div>
        <div className="mb-4">
          <label htmlFor="profile-name" className="mb-1 block text-sm font-medium text-text-muted">
            Name
          </label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-input border border-border bg-background px-4 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="profile-tech" className="mb-1 block text-sm font-medium text-text-muted">
            Tech comfort level
          </label>
          <select
            id="profile-tech"
            value={techComfort}
            onChange={(e) => setTechComfort(e.target.value as TechComfort)}
            className="w-full rounded-input border border-border bg-background px-4 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Select...</option>
            {TECH_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-button bg-primary px-6 py-2.5 font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
          {saved && <span className="text-sm text-primary">Saved!</span>}
        </div>
      </div>

      {/* Progress */}
      <div className="mt-6 rounded-card bg-surface p-6 shadow-card">
        <h2 className="mb-4 font-heading text-lg text-text">Progress</h2>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-text-muted">Overall</span>
          <span className="text-sm font-medium text-primary">{progressPercent}%</span>
        </div>
        <AnimatedProgressBar percent={progressPercent} height="h-2.5" className="mb-4" />
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="rounded-card bg-background p-4">
            <p className="text-2xl font-bold text-primary">{profile?.lessonsCompleted ?? 0}</p>
            <p className="text-xs text-text-muted">
              of {profile?.totalLessons ?? 0} lessons
            </p>
          </div>
          <div className="rounded-card bg-background p-4">
            <p className="text-2xl font-bold text-primary">{profile?.modulesCompleted ?? 0}</p>
            <p className="text-xs text-text-muted">
              of {profile?.totalModules ?? 0} modules
            </p>
          </div>
        </div>
      </div>

      {/* Purchase info */}
      {profile?.purchasedAt && (
        <div className="mt-6 rounded-card bg-surface p-6 shadow-card">
          <h2 className="mb-2 font-heading text-lg text-text">Purchase</h2>
          <p className="text-sm text-text-muted">
            Purchased on{' '}
            {new Date(profile.purchasedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      )}

      {/* Sign out */}
      <div className="mt-6">
        <button
          onClick={signOut}
          className="rounded-button border border-border px-5 py-2.5 text-sm text-text-muted transition-colors hover:bg-background-dark hover:text-text"
        >
          Sign out
        </button>
      </div>
    </div>
    </PageTransition>
  )
}
