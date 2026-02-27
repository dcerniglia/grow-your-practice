import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mb-4 text-5xl">🔍</div>
      <h1 className="font-heading text-2xl text-text">We couldn&apos;t find that page</h1>
      <p className="mt-2 max-w-md text-text-muted">
        It may have been moved or doesn&apos;t exist. Let&apos;s get you back on track.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 rounded-button bg-primary px-6 py-2.5 font-medium text-white transition-colors hover:bg-primary-dark"
      >
        Back to Dashboard
      </Link>
    </div>
  )
}
