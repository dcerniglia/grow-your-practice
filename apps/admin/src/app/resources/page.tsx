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
  fileName: string;
  fileUrl: string;
  fileType: string;
  lessonId: string;
};

const emptyForm: EditingResource = {
  title: '',
  description: '',
  fileName: '',
  fileUrl: '',
  fileType: 'PDF',
  lessonId: '',
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
      fileName: res.fileName,
      fileUrl: res.fileUrl,
      fileType: res.fileType,
      lessonId: res.lessonId,
    });
  }

  function cancel() {
    setEditing(null);
    setForm(emptyForm);
  }

  async function save() {
    setSaving(true);
    const method = editing === 'new' ? 'POST' : 'PUT';
    const url = editing === 'new' ? '/api/resources' : `/api/resources/${editing}`;

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

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
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-text-muted">
                  Title
                </label>
                <input
                  className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div className="w-24">
                <label className="mb-1 block text-xs font-medium text-text-muted">
                  File Type
                </label>
                <select
                  className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm"
                  value={form.fileType}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fileType: e.target.value }))
                  }
                >
                  <option>PDF</option>
                  <option>DOCX</option>
                  <option>XLSX</option>
                  <option>PNG</option>
                </select>
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

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-text-muted">
                  File Name
                </label>
                <input
                  className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm"
                  placeholder="e.g. hipaa-decision-tree.pdf"
                  value={form.fileName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fileName: e.target.value }))
                  }
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-text-muted">
                  File URL
                </label>
                <input
                  className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm"
                  placeholder="/resources/filename.pdf or Supabase URL"
                  value={form.fileUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fileUrl: e.target.value }))
                  }
                />
              </div>
            </div>

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

            <p className="text-xs text-text-muted">
              File upload to Supabase Storage will be added once the bucket is configured.
              For now, enter the file URL manually.
            </p>

            <div className="flex gap-2">
              <button
                onClick={save}
                disabled={saving || !form.title || !form.fileName || !form.fileUrl || !form.lessonId}
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
