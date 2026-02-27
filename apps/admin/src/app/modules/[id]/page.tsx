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
  content: string;
  _count: { resources: number };
};

type ModuleDetail = {
  id: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  iconEmoji: string | null;
  isGated: boolean;
  _count: { lessons: number };
};

type EditingLesson = {
  title: string;
  slug: string;
  description: string;
  content: string;
  videoId: string;
};

const emptyForm: EditingLesson = {
  title: '',
  slug: '',
  description: '',
  content: '',
  videoId: '',
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function ModuleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [mod, setMod] = useState<ModuleDetail | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | 'new' | null>(null);
  const [form, setForm] = useState<EditingLesson>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [modRes, lessonsRes] = await Promise.all([
      fetch(`/api/modules/${id}`),
      fetch(`/api/lessons?moduleId=${id}`),
    ]);
    if (modRes.ok) setMod(await modRes.json());
    if (lessonsRes.ok) setLessons(await lessonsRes.json());
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function startNew() {
    setEditing('new');
    setForm(emptyForm);
    setPreviewMode(false);
  }

  function startEdit(lesson: Lesson) {
    setEditing(lesson.id);
    setForm({
      title: lesson.title,
      slug: lesson.slug,
      description: lesson.description || '',
      content: lesson.content,
      videoId: lesson.videoId || '',
    });
    setPreviewMode(false);
  }

  function cancel() {
    setEditing(null);
    setForm(emptyForm);
  }

  async function save() {
    setSaving(true);
    const method = editing === 'new' ? 'POST' : 'PUT';
    const url = editing === 'new' ? '/api/lessons' : `/api/lessons/${editing}`;

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        ...(editing === 'new' && { moduleId: id }),
      }),
    });

    setSaving(false);
    setEditing(null);
    setForm(emptyForm);
    await fetchData();
  }

  async function handleDelete(lessonId: string) {
    setDeleting(lessonId);
    await fetch(`/api/lessons/${lessonId}`, { method: 'DELETE' });
    setDeleting(null);
    await fetchData();
  }

  async function moveLesson(lessonId: string, direction: 'up' | 'down') {
    const idx = lessons.findIndex((l) => l.id === lessonId);
    if (
      (direction === 'up' && idx === 0) ||
      (direction === 'down' && idx === lessons.length - 1)
    )
      return;

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const newOrder = lessons.map((l, i) => {
      if (i === idx) return { id: l.id, order: lessons[swapIdx]!.order };
      if (i === swapIdx) return { id: l.id, order: lessons[idx]!.order };
      return { id: l.id, order: l.order };
    });

    await fetch('/api/lessons/reorder', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: newOrder }),
    });

    await fetchData();
  }

  if (loading) return <p className="text-text-muted">Loading...</p>;
  if (!mod) return <p className="text-red-600">Module not found.</p>;

  return (
    <div>
      <div className="mb-1">
        <Link href="/modules" className="text-sm text-text-muted hover:text-primary">
          ← Back to Modules
        </Link>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{mod.iconEmoji}</span>
          <div>
            <h1 className="font-heading text-2xl text-primary">{mod.title}</h1>
            <p className="text-sm text-text-muted">
              /{mod.slug} · {lessons.length} lessons
              {mod.isGated && ' · Gated'}
            </p>
          </div>
        </div>
        <button
          onClick={startNew}
          className="rounded-button bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          + New Lesson
        </button>
      </div>

      {/* Lesson editor */}
      {editing && (
        <div className="mb-6 rounded-card border border-border bg-surface p-4">
          <h2 className="mb-3 font-heading text-lg">
            {editing === 'new' ? 'New Lesson' : 'Edit Lesson'}
          </h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-text-muted">
                  Title
                </label>
                <input
                  className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm"
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm((f) => ({
                      ...f,
                      title,
                      ...(editing === 'new' && { slug: slugify(title) }),
                    }));
                  }}
                />
              </div>
              <div className="w-56">
                <label className="mb-1 block text-xs font-medium text-text-muted">
                  Slug
                </label>
                <input
                  className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                />
              </div>
              <div className="w-44">
                <label className="mb-1 block text-xs font-medium text-text-muted">
                  Video ID (Bunny)
                </label>
                <input
                  className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm"
                  placeholder="Optional"
                  value={form.videoId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, videoId: e.target.value }))
                  }
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-text-muted">
                Description
              </label>
              <input
                className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>

            {/* Markdown editor with preview toggle */}
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-medium text-text-muted">
                  Content (Markdown)
                </label>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPreviewMode(false)}
                    className={`rounded px-2 py-0.5 text-xs ${!previewMode ? 'bg-primary text-white' : 'text-text-muted hover:bg-background'}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setPreviewMode(true)}
                    className={`rounded px-2 py-0.5 text-xs ${previewMode ? 'bg-primary text-white' : 'text-text-muted hover:bg-background'}`}
                  >
                    Preview
                  </button>
                </div>
              </div>
              {previewMode ? (
                <div className="min-h-[300px] rounded-input border border-border bg-white p-4">
                  <MarkdownPreview content={form.content} />
                </div>
              ) : (
                <textarea
                  className="w-full rounded-input border border-border bg-background px-3 py-2 font-mono text-sm"
                  rows={16}
                  value={form.content}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, content: e.target.value }))
                  }
                />
              )}
              <p className="mt-1 text-xs text-text-muted">
                Supports: :::tip, :::warning, :::try-this directives
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={save}
                disabled={saving || !form.title || !form.slug}
                className="rounded-button bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={cancel}
                className="rounded-button border border-border px-4 py-2 text-sm hover:bg-background"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lesson list */}
      {lessons.length === 0 ? (
        <p className="text-text-muted">No lessons yet.</p>
      ) : (
        <div className="space-y-2">
          {lessons.map((lesson, idx) => (
            <div
              key={lesson.id}
              className="flex items-center gap-3 rounded-card border border-border bg-surface p-3"
            >
              {/* Reorder */}
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveLesson(lesson.id, 'up')}
                  disabled={idx === 0}
                  className="text-xs text-text-muted hover:text-text disabled:opacity-30"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveLesson(lesson.id, 'down')}
                  disabled={idx === lessons.length - 1}
                  className="text-xs text-text-muted hover:text-text disabled:opacity-30"
                >
                  ▼
                </button>
              </div>

              {/* Lesson info */}
              <span className="w-6 text-center text-sm font-medium text-text-muted">
                {lesson.order}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{lesson.title}</span>
                  {lesson.videoId && (
                    <span className="text-xs text-text-muted">🎥</span>
                  )}
                  {lesson._count.resources > 0 && (
                    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700">
                      {lesson._count.resources} resource{lesson._count.resources !== 1 && 's'}
                    </span>
                  )}
                </div>
                {lesson.description && (
                  <p className="text-sm text-text-muted">{lesson.description}</p>
                )}
              </div>

              {/* Meta */}
              <div className="text-right text-xs text-text-muted">
                /{lesson.slug}
              </div>

              {/* Actions */}
              <div className="flex gap-1">
                <button
                  onClick={() => startEdit(lesson)}
                  className="rounded-button border border-border px-3 py-1 text-xs hover:bg-background"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${lesson.title}"?`)) {
                      handleDelete(lesson.id);
                    }
                  }}
                  disabled={deleting === lesson.id}
                  className="rounded-button border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  {deleting === lesson.id ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Simple markdown preview that handles basic markdown + custom directives.
 * No external dependency — just converts to HTML for preview purposes.
 */
function MarkdownPreview({ content }: { content: string }) {
  const html = content
    // Custom directives
    .replace(
      /:::tip\n([\s\S]*?):::/g,
      '<div style="background:#e8f5e9;border-left:4px solid #4caf50;padding:12px;margin:12px 0;border-radius:4px">$1</div>',
    )
    .replace(
      /:::warning\n([\s\S]*?):::/g,
      '<div style="background:#fff3e0;border-left:4px solid #ff9800;padding:12px;margin:12px 0;border-radius:4px">$1</div>',
    )
    .replace(
      /:::try-this\n([\s\S]*?):::/g,
      '<div style="background:#e3f2fd;border-left:4px solid #2196f3;padding:12px;margin:12px 0;border-radius:4px"><strong>Try This:</strong><br/>$1</div>',
    )
    // Headers
    .replace(/^### (.+)$/gm, '<h3 style="font-size:1.1em;font-weight:bold;margin:16px 0 8px">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size:1.25em;font-weight:bold;margin:20px 0 8px">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="font-size:1.5em;font-weight:bold;margin:24px 0 12px">$1</h1>')
    // Bold and italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Lists
    .replace(/^- (.+)$/gm, '<li style="margin-left:20px">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li style="margin-left:20px;list-style-type:decimal">$1</li>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid #ccc;padding-left:12px;color:#666;margin:8px 0">$1</blockquote>')
    // Checkboxes
    .replace(/- \[ \] (.+)/g, '<label style="margin-left:20px"><input type="checkbox" disabled /> $1</label><br/>')
    .replace(/- \[x\] (.+)/g, '<label style="margin-left:20px"><input type="checkbox" checked disabled /> $1</label><br/>')
    // Paragraphs (double newline)
    .replace(/\n\n/g, '<br/><br/>');

  return (
    <div
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
