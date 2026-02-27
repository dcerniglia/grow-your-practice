import type { ReactNode } from 'react'

type EmptyStateProps = {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card bg-surface px-6 py-12 text-center shadow-card">
      <div className="mb-3 text-4xl">{icon}</div>
      <h3 className="font-heading text-lg text-text">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-text-muted">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
