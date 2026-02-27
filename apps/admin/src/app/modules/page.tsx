'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

type Module = {
  id: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  iconEmoji: string | null;
  isGated: boolean;
  _count: { lessons: number };
};

type EditingModule = {
  title: string;
  slug: string;
  description: string;
  iconEmoji: string;
  isGated: boolean;
};

const emptyForm: EditingModule = {
  title: '',
  slug: '',
  description: '',
  iconEmoji: '',
  isGated: false,
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | 'new' | null>(null);
  const [form, setForm] = useState<EditingModule>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchModules = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/modules');
    const data = await res.json();
    setModules(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  function startNew() {
    setEditing('new');
    setForm(emptyForm);
  }

  function startEdit(mod: Module) {
    setEditing(mod.id);
    setForm({
      title: mod.title,
      slug: mod.slug,
      description: mod.description,
      iconEmoji: mod.iconEmoji || '',
      isGated: mod.isGated,
    });
  }

  function cancel() {
    setEditing(null);
    setForm(emptyForm);
  }

  async function save() {
    setSaving(true);
    const method = editing === 'new' ? 'POST' : 'PUT';
    const url = editing === 'new' ? '/api/modules' : `/api/modules/${editing}`;

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setSaving(false);
    setEditing(null);
    setForm(emptyForm);
    await fetchModules();
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    await fetch(`/api/modules/${id}`, { method: 'DELETE' });
    setDeleting(null);
    await fetchModules();
  }

  async function moveModule(id: string, direction: 'up' | 'down') {
    const idx = modules.findIndex((m) => m.id === id);
    if (
      (direction === 'up' && idx === 0) ||
      (direction === 'down' && idx === modules.length - 1)
    )
      return;

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const newOrder = modules.map((m, i) => {
      if (i === idx) return { id: m.id, order: modules[swapIdx]!.order };
      if (i === swapIdx) return { id: m.id, order: modules[idx]!.order };
      return { id: m.id, order: m.order };
    });

    await fetch('/api/modules/reorder', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: newOrder }),
    });

    await fetchModules();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl text-primary">Modules</h1>
        <button
          onClick={startNew}
          className="rounded-button bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          + New Module
        </button>
      </div>

      {/* New/edit form */}
      {editing && (
        <div className="mb-6 rounded-card border border-border bg-surface p-4">
          <h2 className="mb-3 font-heading text-lg">
            {editing === 'new' ? 'New Module' : 'Edit Module'}
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
              <div className="w-48">
                <label className="mb-1 block text-xs font-medium text-text-muted">
                  Slug
                </label>
                <input
                  className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                />
              </div>
              <div className="w-20">
                <label className="mb-1 block text-xs font-medium text-text-muted">
                  Emoji
                </label>
                <input
                  className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm"
                  value={form.iconEmoji}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, iconEmoji: e.target.value }))
                  }
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-text-muted">
                Description
              </label>
              <textarea
                className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isGated}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isGated: e.target.checked }))
                  }
                />
                Gated (requires prerequisite)
              </label>
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

      {/* Module list */}
      {loading ? (
        <p className="text-text-muted">Loading...</p>
      ) : modules.length === 0 ? (
        <p className="text-text-muted">No modules yet.</p>
      ) : (
        <div className="space-y-2">
          {modules.map((mod, idx) => (
            <div
              key={mod.id}
              className="flex items-center gap-3 rounded-card border border-border bg-surface p-4"
            >
              {/* Reorder buttons */}
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveModule(mod.id, 'up')}
                  disabled={idx === 0}
                  className="text-xs text-text-muted hover:text-text disabled:opacity-30"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveModule(mod.id, 'down')}
                  disabled={idx === modules.length - 1}
                  className="text-xs text-text-muted hover:text-text disabled:opacity-30"
                >
                  ▼
                </button>
              </div>

              {/* Module info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{mod.iconEmoji}</span>
                  <Link
                    href={`/modules/${mod.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {mod.title}
                  </Link>
                  {mod.isGated && (
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700">
                      Gated
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-text-muted line-clamp-1">
                  {mod.description}
                </p>
              </div>

              {/* Meta */}
              <div className="text-right text-sm text-text-muted">
                <div>{mod._count.lessons} lessons</div>
                <div className="text-xs">/{mod.slug}</div>
              </div>

              {/* Actions */}
              <div className="flex gap-1">
                <button
                  onClick={() => startEdit(mod)}
                  className="rounded-button border border-border px-3 py-1 text-xs hover:bg-background"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${mod.title}" and all its lessons?`)) {
                      handleDelete(mod.id);
                    }
                  }}
                  disabled={deleting === mod.id}
                  className="rounded-button border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  {deleting === mod.id ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
