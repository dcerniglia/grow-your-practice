'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageTransition } from './page-transition'
import { StaggerList, StaggerItem } from './stagger-list'
import type { ResourceGroup } from '@/lib/course-data'

function ResourceDownloadButton({
  resource,
}: {
  resource: { id: string; url: string; title: string }
}) {
  const [downloaded, setDownloaded] = useState(false)
  const hasUrl = resource.url && resource.url !== '#'

  if (!hasUrl) {
    return (
      <span className="mt-4 inline-block rounded-button bg-border px-4 py-2 text-center text-sm text-text-muted">
        Coming soon
      </span>
    )
  }

  function handleClick() {
    fetch(`/api/resources/download/${resource.id}`, { method: 'POST' }).catch(() => {})
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 1500)
  }

  return (
    <a
      href={resource.url}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 inline-flex items-center justify-center gap-2 rounded-button bg-primary px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-primary-dark"
    >
      <AnimatePresence mode="wait">
        {downloaded ? (
          <motion.svg
            key="check"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <path
              fillRule="evenodd"
              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
              clipRule="evenodd"
            />
          </motion.svg>
        ) : (
          <motion.span
            key="text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Download
          </motion.span>
        )}
      </AnimatePresence>
    </a>
  )
}

type ResourcesClientProps = {
  resourcesByModule: ResourceGroup[]
}

export function ResourcesClient({ resourcesByModule }: ResourcesClientProps) {
  return (
    <PageTransition>
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
              <StaggerList className="grid gap-4 sm:grid-cols-2">
                {group.resources.map((resource) => (
                  <StaggerItem key={resource.id}>
                    <div className="flex h-full flex-col justify-between rounded-card bg-surface p-5 shadow-card transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
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
                  </StaggerItem>
                ))}
              </StaggerList>
            </section>
          ))}
        </div>
      </div>
    </PageTransition>
  )
}
