export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse">
      {/* Greeting */}
      <div className="h-9 w-64 rounded bg-gray-200" />
      <div className="mt-2 h-5 w-96 rounded bg-gray-200" />

      {/* Progress card */}
      <div className="mt-8 rounded-card bg-surface p-6 shadow-card">
        <div className="mb-3 flex items-center justify-between">
          <div className="h-6 w-32 rounded bg-gray-200" />
          <div className="h-5 w-20 rounded bg-gray-200" />
        </div>
        <div className="h-3 w-full rounded-full bg-gray-200" />
        <div className="mt-2 h-4 w-44 rounded bg-gray-200" />
      </div>

      {/* Continue learning card */}
      <div className="mt-6 rounded-card bg-surface p-6 shadow-card">
        <div className="h-4 w-40 rounded bg-gray-200" />
        <div className="mt-2 h-7 w-64 rounded bg-gray-200" />
        <div className="mt-2 h-4 w-48 rounded bg-gray-200" />
        <div className="mt-4 h-10 w-32 rounded-button bg-gray-200" />
      </div>

      {/* Module grid */}
      <div className="mt-10 h-7 w-24 rounded bg-gray-200" />
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-card bg-surface p-5 shadow-card">
            <div className="mb-2 h-8 w-8 rounded bg-gray-200" />
            <div className="h-5 w-32 rounded bg-gray-200" />
            <div className="mt-3 h-1.5 w-full rounded-full bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function LessonSkeleton() {
  return (
    <div className="mx-auto max-w-[720px] animate-pulse">
      {/* Breadcrumb */}
      <div className="mb-1 h-4 w-40 rounded bg-gray-200" />
      {/* Title */}
      <div className="h-9 w-80 rounded bg-gray-200" />
      <div className="mt-1 h-4 w-16 rounded bg-gray-200" />

      {/* Video placeholder */}
      <div className="mt-6 aspect-video rounded-card bg-gray-200" />

      {/* Content lines */}
      <div className="mt-6 space-y-3">
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-5/6 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-4/6 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-3/4 rounded bg-gray-200" />
      </div>

      {/* Actions */}
      <div className="mt-12 flex flex-col items-center gap-4 border-t border-border pt-8">
        <div className="h-12 w-48 rounded-button bg-gray-200" />
      </div>
    </div>
  )
}

export function SidebarSkeleton() {
  return (
    <div className="flex h-screen w-[260px] shrink-0 flex-col border-r border-border bg-surface animate-pulse">
      {/* Logo */}
      <div className="border-b border-border px-5 py-4">
        <div className="h-6 w-40 rounded bg-gray-200" />
      </div>

      {/* Module items */}
      <div className="flex-1 py-2 space-y-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2 px-5 py-2.5">
            <div className="h-5 w-5 rounded bg-gray-200" />
            <div className="h-4 flex-1 rounded bg-gray-200" />
          </div>
        ))}
      </div>

      {/* Bottom links */}
      <div className="border-t border-border px-3 py-3 space-y-2">
        <div className="h-8 w-full rounded bg-gray-200" />
        <div className="h-8 w-full rounded bg-gray-200" />
      </div>
    </div>
  )
}

export function ModuleOverviewSkeleton() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse">
      <div className="mb-2 h-10 w-10 rounded bg-gray-200" />
      <div className="h-9 w-64 rounded bg-gray-200" />
      <div className="mt-2 h-5 w-48 rounded bg-gray-200" />
      <div className="mt-4 h-2 w-full rounded-full bg-gray-200" />

      <div className="mt-8 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-card bg-surface p-4 shadow-card">
            <div className="h-8 w-8 shrink-0 rounded-full bg-gray-200" />
            <div className="flex-1">
              <div className="h-5 w-48 rounded bg-gray-200" />
              <div className="mt-1 h-3 w-16 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ResourcesSkeleton() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse">
      <div className="h-9 w-36 rounded bg-gray-200" />
      <div className="mt-2 h-5 w-80 rounded bg-gray-200" />

      <div className="mt-8 space-y-10">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i}>
            <div className="mb-4 h-7 w-48 rounded bg-gray-200" />
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="rounded-card bg-surface p-5 shadow-card">
                  <div className="mb-2 h-5 w-16 rounded bg-gray-200" />
                  <div className="h-5 w-40 rounded bg-gray-200" />
                  <div className="mt-1 h-4 w-full rounded bg-gray-200" />
                  <div className="mt-4 h-9 w-24 rounded-button bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse">
      <div className="h-9 w-24 rounded bg-gray-200" />

      <div className="mt-8 rounded-card bg-surface p-6 shadow-card">
        <div className="mb-4 h-6 w-24 rounded bg-gray-200" />
        <div className="mb-4 space-y-2">
          <div className="h-4 w-12 rounded bg-gray-200" />
          <div className="h-5 w-48 rounded bg-gray-200" />
        </div>
        <div className="mb-4 space-y-2">
          <div className="h-4 w-12 rounded bg-gray-200" />
          <div className="h-10 w-full rounded-input bg-gray-200" />
        </div>
        <div className="mb-6 space-y-2">
          <div className="h-4 w-32 rounded bg-gray-200" />
          <div className="h-10 w-full rounded-input bg-gray-200" />
        </div>
        <div className="h-10 w-32 rounded-button bg-gray-200" />
      </div>

      <div className="mt-6 rounded-card bg-surface p-6 shadow-card">
        <div className="mb-4 h-6 w-24 rounded bg-gray-200" />
        <div className="h-2.5 w-full rounded-full bg-gray-200" />
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="rounded-card bg-background p-4">
            <div className="mx-auto h-8 w-8 rounded bg-gray-200" />
            <div className="mx-auto mt-1 h-3 w-20 rounded bg-gray-200" />
          </div>
          <div className="rounded-card bg-background p-4">
            <div className="mx-auto h-8 w-8 rounded bg-gray-200" />
            <div className="mx-auto mt-1 h-3 w-20 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  )
}
