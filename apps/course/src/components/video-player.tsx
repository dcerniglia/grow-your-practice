'use client'

import { useEffect, useRef, useCallback } from 'react'

const BUNNY_LIBRARY_ID = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID ?? ''

type VideoPlayerProps = {
  videoId: string
  lessonId: string
}

const THRESHOLDS = [25, 50, 75, 100]

export function VideoPlayer({ videoId, lessonId }: VideoPlayerProps) {
  const reportedThresholds = useRef<Set<number>>(new Set())
  const lastWatchPercent = useRef(0)

  const reportProgress = useCallback(
    async (percent: number) => {
      try {
        await fetch('/api/progress/lesson', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lessonId, videoWatchedPercent: percent }),
        })
      } catch {
        // Silently fail — progress will be retried
      }
    },
    [lessonId],
  )

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      // Bunny Stream sends postMessage events for player state
      if (typeof event.data !== 'object' || !event.data.type) return
      if (event.data.type === 'bunny-stream') {
        const percent = Math.round((event.data.currentTime / event.data.duration) * 100)
        lastWatchPercent.current = percent

        for (const t of THRESHOLDS) {
          if (percent >= t && !reportedThresholds.current.has(t)) {
            reportedThresholds.current.add(t)
            void reportProgress(percent)
          }
        }
      }
    }

    window.addEventListener('message', handleMessage)

    // Report on page leave
    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden' && lastWatchPercent.current > 0) {
        void reportProgress(lastWatchPercent.current)
      }
    }

    function handleBeforeUnload() {
      if (lastWatchPercent.current > 0) {
        // Use sendBeacon for reliability on unload
        navigator.sendBeacon(
          '/api/progress/lesson',
          JSON.stringify({ lessonId, videoWatchedPercent: lastWatchPercent.current }),
        )
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('message', handleMessage)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [lessonId, reportProgress])

  if (!BUNNY_LIBRARY_ID) {
    return (
      <div className="mb-8 flex aspect-video items-center justify-center rounded-card bg-surface text-text-muted shadow-card">
        <p>Video player — configure NEXT_PUBLIC_BUNNY_LIBRARY_ID to enable</p>
      </div>
    )
  }

  return (
    <div className="mb-8 overflow-hidden rounded-card shadow-card">
      <div className="relative aspect-video">
        <iframe
          src={`https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${videoId}?autoplay=false&preload=true`}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          title="Lesson video"
        />
      </div>
    </div>
  )
}
