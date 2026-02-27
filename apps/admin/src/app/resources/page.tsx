'use client';

import { useCallback, useEffect, useState } from 'react';

type ResourceLesson = {
  id: string;
  title: string;
  order: number;
  module: { id: string; title: string; order: number };
};

type Resource = {
  id: string;
  title: string;
  description: string | null;
  fileName: string;
  fileUrl: string;
  fileType: string;
  lessonId: string;
  createdAt: string;
  lesson: ResourceLesson;
};

type Module = {
  id: string;
  title: string;
  order: number;
  lessons: { id: string; title: string; order: number }[];
};

type EditingResource = {
  title: string;
  description: string;
  lessonId: string;
  file: File | null;
};

const emptyForm: EditingResource = {
  title: '',
  description: '',
  lessonId: '',
  file: null,
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | 'new' | null>(null);
  const [form, setForm] = useState<EditingResource>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filterModule, setFilterModule] = useState<string>('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    const url = filterModule
      ? `/api/resources?moduleId=${filterModule}`
      : '/api/resources';
    const [resRes, modRes] = await Promise.all([
      fetch(url),
      fetch('/api/modules'),
    ]);
    setResources(await resRes.json());
    const mods = await modRes.json();
    // Modules endpoint includes lesson count but not lessons themselves
    // Fetch each module's detail for the lesson dropdown
    const modsWithLessons = await Promise.all(
      mods.map(async (m: Module & { _count?: { lessons: number } }) => {
        const r = await fetch(`/api/modules/${m.id}`);
        const detail = await r.json();
        return { id: m.id, title: m.title, order: m.order, lessons: detail.lessons || [] };
      }),
    );
    setModules(modsWithLessons);
    setLoading(false);
  }, [filterModule]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function startNew() {
    setEditing('new');
    setForm(emptyForm);
  }

  function startEdit(res: Resource) {
    setEditing(res.id);
    setForm({
      title: res.title,
      description: res.description || '',
      lessonId: res.lessonId,
      file: null,
    });
  }

  function cancel() {
    setEditing(null);
    setForm(emptyForm);
  }

  async function save() {
    setSaving(true);

    if (editing === 'new') {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('lessonId', form.lessonId);
      if (form.file) formData.append('file', form.file);

      await fetch('/api/resources', { method: 'POST', body: formData });
    } else {
      await fetch(`/api/resources/${editing}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          lessonId: form.lessonId,
        }),
      });
    }

    setSaving(false);
    setEditing(null);
    setForm(emptyForm);
    await fetchData();
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    await fetch(`/api/resources/${id}`, { method: 'DELETE' });
    setDeleting(null);
    await fetchData();
  }

  // Group lessons by module for the dropdown
  const lessonOptions = modules
    .sort((a, b) => a.order - b.order)
    .flatMap((m) =>
      (m.lessons || [])
        .sort((a: { order: number }, b: { order: number }) => a.order - b.order)
        .map((l: { id: string; title: string }) => ({
          value: l.id,
          label: `M${m.order}: ${m.title} → ${l.title}`,
        })),
    );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl text-primary">Resources</h1>
        <div className="flex items-center gap-3">
          <select
            className="rounded-input border border-border bg-background px-3 py-2 text-sm"
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
          >
            <option value="">All modules</option>
            {modules
              .sort((a, b) => a.order - b.order)
              .map((m) => (
                <option key={m.id} value={m.id}>
                  M{m.order}: {m.title}
                </option>
              ))}
          </select>
          <button
            onClick={startNew}
            className="rounded-button bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            + New Resource
          </button>
        </div>
      </div>

      {/* Edit/create form */}
      {editing && (
        <div className="mb-6 rounded-card border border-border bg-surface p-4">
          <h2 className="mb-3 font-heading text-lg">
            {editing === 'new' ? 'New Resource' : 'Edit Resource'}
          </h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-text-muted">
                Title
              </label>
              <input
                className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
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

            {editing === 'new' && (
              <div>
                <label className="mb-1 block text-xs font-medium text-text-muted">
                  File
                </label>
                <input
                  type="file"
                  accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg"
                  className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm file:mr-3 file:rounded-button file:border-0 file:bg-primary file:px-3 file:py-1 file:text-xs file:text-white"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, file: e.target.files?.[0] ?? null }))
                  }
                />
                {form.file && (
                  <p className="mt-1 text-xs text-text-muted">{form.file.name} ({(form.file.size / 1024).toFixed(0)} KB)</p>
                )}
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-medium text-text-muted">
                Linked Lesson
              </label>
              <select
                className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm"
                value={form.lessonId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, lessonId: e.target.value }))
                }
              >
                <option value="">Select a lesson...</option>
                {lessonOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={save}
                disabled={saving || !form.title || !form.lessonId || (editing === 'new' && !form.file)}
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

      {/* Resource list */}
      {loading ? (
        <p className="text-text-muted">Loading...</p>
      ) : resources.length === 0 ? (
        <p className="text-text-muted">No resources found.</p>
      ) : (
        <div className="space-y-2">
          {resources.map((res) => (
            <div
              key={res.id}
              className="flex items-center gap-3 rounded-card border border-border bg-surface p-3"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{res.title}</span>
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                    {res.fileType}
                  </span>
                </div>
                <p className="text-sm text-text-muted">
                  M{res.lesson.module.order} L{res.lesson.order}: {res.lesson.title}
                </p>
                {res.description && (
                  <p className="mt-0.5 text-xs text-text-muted line-clamp-1">
                    {res.description}
                  </p>
                )}
              </div>

              <div className="text-right text-xs text-text-muted">
                {res.fileName}
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => startEdit(res)}
                  className="rounded-button border border-border px-3 py-1 text-xs hover:bg-background"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${res.title}"?`)) handleDelete(res.id);
                  }}
                  disabled={deleting === res.id}
                  className="rounded-button border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  {deleting === res.id ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
