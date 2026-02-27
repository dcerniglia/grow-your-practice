'use client'

export default function CourseError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 text-5xl">😔</div>
      <h1 className="font-heading text-2xl text-text">Something went wrong</h1>
      <p className="mt-2 max-w-md text-text-muted">
        Let&apos;s try that again. If this keeps happening, try refreshing the page.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-button bg-primary px-6 py-2.5 font-medium text-white transition-colors hover:bg-primary-dark"
      >
        Try again
      </button>
    </div>
  )
}
