import { getResourcesByModule } from '@/lib/course-data'

export default async function ResourcesPage() {
  const resourcesByModule = await getResourcesByModule()

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-heading text-3xl text-primary">Resources</h1>
      <p className="mt-2 text-text-muted">
        Downloadable templates, checklists, and guides to support your learning.
      </p>

      {resourcesByModule.length === 0 && (
        <div className="mt-12 rounded-card bg-surface p-8 text-center shadow-card">
          <p className="text-text-muted">Resources will appear here as you unlock modules.</p>
        </div>
      )}

      <div className="mt-8 space-y-10">
        {resourcesByModule.map((group) => (
          <section key={group.moduleId}>
            <h2 className="mb-4 flex items-center gap-2 font-heading text-xl text-text">
              <span>{group.iconEmoji}</span>
              <span>{group.moduleTitle}</span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {group.resources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex flex-col justify-between rounded-card bg-surface p-5 shadow-card"
                >
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium uppercase text-primary">
                        {resource.fileType}
                      </span>
                    </div>
                    <h3 className="font-heading text-base text-text">{resource.title}</h3>
                    {resource.description && (
                      <p className="mt-1 text-sm text-text-muted">{resource.description}</p>
                    )}
                  </div>
                  <ResourceDownloadButton resource={resource} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

function ResourceDownloadButton({
  resource,
}: {
  resource: { id: string; url: string; title: string }
}) {
  const hasUrl = resource.url && resource.url !== '#'

  if (!hasUrl) {
    return (
      <span className="mt-4 inline-block rounded-button bg-border px-4 py-2 text-center text-sm text-text-muted">
        Coming soon
      </span>
    )
  }

  return (
    <a
      href={resource.url}
      onClick={() => {
        // Fire-and-forget download tracking
        fetch(`/api/resources/download/${resource.id}`, { method: 'POST' }).catch(() => {})
      }}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 inline-block rounded-button bg-primary px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-primary-dark"
    >
      Download
    </a>
  )
}
