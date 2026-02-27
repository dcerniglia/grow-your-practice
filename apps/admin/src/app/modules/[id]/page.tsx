'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type Lesson = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  order: number;
  videoId: string | null;
};

type ModuleDetail = {
  id: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  iconEmoji: string | null;
  isGated: boolean;
  lessons: Lesson[];
  _count: { lessons: number };
};

export default function ModuleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [mod, setMod] = useState<ModuleDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchModule = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/modules/${id}`);
    if (res.ok) {
      setMod(await res.json());
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchModule();
  }, [fetchModule]);

  if (loading) return <p className="text-text-muted">Loading...</p>;
  if (!mod) return <p className="text-red-600">Module not found.</p>;

  return (
    <div>
      <div className="mb-1">
        <Link href="/modules" className="text-sm text-text-muted hover:text-primary">
          ← Back to Modules
        </Link>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <span className="text-2xl">{mod.iconEmoji}</span>
        <div>
          <h1 className="font-heading text-2xl text-primary">{mod.title}</h1>
          <p className="text-sm text-text-muted">
            /{mod.slug} · {mod._count.lessons} lessons
            {mod.isGated && ' · Gated'}
          </p>
        </div>
      </div>

      <p className="mb-6 text-sm text-text-muted">{mod.description}</p>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-lg">Lessons</h2>
        <p className="text-xs text-text-muted">
          Lesson editing coming in issue #59
        </p>
      </div>

      {mod.lessons.length === 0 ? (
        <p className="text-text-muted">No lessons yet.</p>
      ) : (
        <div className="space-y-2">
          {mod.lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="flex items-center gap-3 rounded-card border border-border bg-surface p-3"
            >
              <span className="w-6 text-center text-sm font-medium text-text-muted">
                {lesson.order}
              </span>
              <div className="flex-1">
                <div className="font-medium">{lesson.title}</div>
                {lesson.description && (
                  <p className="text-sm text-text-muted">{lesson.description}</p>
                )}
              </div>
              <div className="text-right text-xs text-text-muted">
                {lesson.videoId ? '🎥' : '📝'} /{lesson.slug}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
