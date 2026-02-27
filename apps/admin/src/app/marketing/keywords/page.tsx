'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Keyword = {
  id: string;
  keyword: string;
  monthlyVolume: number | null;
  cpc: number | null;
  intentMatch: boolean;
  notes: string | null;
  category: string | null;
  createdAt: string;
  updatedAt: string;
};

type SortKey = 'keyword' | 'monthlyVolume' | 'cpc' | 'intentMatch' | 'category';
type SortDir = 'asc' | 'desc';

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortKey>('keyword');
  const [dir, setDir] = useState<SortDir>('asc');
  const [intentOnly, setIntentOnly] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [importing, setImporting] = useState(false);
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const editRef = useRef<HTMLInputElement>(null);

  const fetchKeywords = useCallback(async () => {
    const params = new URLSearchParams({ sort, dir });
    if (intentOnly) params.set('intentOnly', 'true');
    if (categoryFilter) params.set('category', categoryFilter);
    const res = await fetch(`/api/keywords?${params}`);
    const data = await res.json();
    setKeywords(data);
    setLoading(false);
  }, [sort, dir, intentOnly, categoryFilter]);

  useEffect(() => {
    fetchKeywords();
  }, [fetchKeywords]);

  useEffect(() => {
    if (editingCell && editRef.current) {
      editRef.current.focus();
      editRef.current.select();
    }
  }, [editingCell]);

  const handleSort = (key: SortKey) => {
    if (sort === key) {
      setDir(dir === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(key);
      setDir(key === 'keyword' ? 'asc' : 'desc');
    }
  };

  const sortArrow = (key: SortKey) => {
    if (sort !== key) return '';
    return dir === 'asc' ? ' ↑' : ' ↓';
  };

  const handleSave = async (id: string, field: string, value: string) => {
    let parsed: unknown = value;
    if (field === 'monthlyVolume') parsed = value ? parseInt(value, 10) : null;
    else if (field === 'cpc') parsed = value ? parseFloat(value) : null;
    else if (field === 'notes' || field === 'category') parsed = value || null;

    await fetch(`/api/keywords/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: parsed }),
    });
    setEditingCell(null);
    fetchKeywords();
  };

  const handleToggleIntent = async (kw: Keyword) => {
    await fetch(`/api/keywords/${kw.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intentMatch: !kw.intentMatch }),
    });
    fetchKeywords();
  };

  const handleAdd = async () => {
    if (!newKeyword.trim()) return;
    await fetch('/api/keywords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword: newKeyword.trim() }),
    });
    setNewKeyword('');
    fetchKeywords();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/keywords/${id}`, { method: 'DELETE' });
    setDeleteConfirm(null);
    fetchKeywords();
  };

  const handleImport = async () => {
    setImporting(true);
    const res = await fetch('/api/keywords/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csv: csvText }),
    });
    const result = await res.json();
    alert(`Imported ${result.created} keywords. ${result.skipped} skipped.`);
    setCsvText('');
    setShowImport(false);
    setImporting(false);
    fetchKeywords();
  };

  // Compute categories for filter dropdown
  const categories = Array.from(new Set(keywords.map((k) => k.category).filter(Boolean))) as string[];

  // Summary stats (computed from full dataset — refetch without filters for accuracy)
  const totalKeywords = keywords.length;
  const flaggedCount = keywords.filter((k) => k.intentMatch).length;
  const flaggedWithCpc = keywords.filter((k) => k.intentMatch && k.cpc != null);
  const avgCpcFlagged =
    flaggedWithCpc.length > 0
      ? flaggedWithCpc.reduce((sum, k) => sum + (k.cpc ?? 0), 0) / flaggedWithCpc.length
      : 0;

  const startEdit = (id: string, field: string, currentValue: string) => {
    setEditingCell({ id, field });
    setEditValue(currentValue);
  };

  const cellClass =
    'px-3 py-2 cursor-pointer hover:bg-primary/5 transition-colors';

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl text-primary">Keywords</h1>
        <button
          onClick={() => setShowImport(!showImport)}
          className="rounded-button bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90"
        >
          {showImport ? 'Cancel Import' : 'Bulk Import'}
        </button>
      </div>

      {/* Summary Stats */}
      <div className="mb-4 flex gap-6 text-sm text-text-muted">
        <span>
          <strong className="text-text">{totalKeywords}</strong> keywords
        </span>
        <span>
          <strong className="text-text">{flaggedCount}</strong> flagged for intent
        </span>
        <span>
          Avg CPC (flagged): <strong className="text-text">${avgCpcFlagged.toFixed(2)}</strong>
        </span>
      </div>

      {/* Filters */}
      <div className="mb-4 flex items-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={intentOnly}
            onChange={(e) => setIntentOnly(e.target.checked)}
            className="accent-primary"
          />
          Intent match only
        </label>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-input border border-border bg-surface px-2 py-1"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Bulk Import */}
      {showImport && (
        <div className="mb-4 rounded-card border border-border bg-surface p-4">
          <p className="mb-2 text-sm text-text-muted">
            Paste CSV from Google Keyword Planner (keyword, volume, CPC per line). Tab or
            comma separated.
          </p>
          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            rows={8}
            className="w-full rounded-input border border-border bg-background p-2 font-mono text-sm"
            placeholder={`ai for therapists\t1200\t$2.50\ntherapist ai tools\t800\t$1.80`}
          />
          <button
            onClick={handleImport}
            disabled={importing || !csvText.trim()}
            className="mt-2 rounded-button bg-accent px-4 py-2 text-sm text-white hover:bg-accent/90 disabled:opacity-50"
          >
            {importing ? 'Importing...' : 'Import'}
          </button>
        </div>
      )}

      {/* Add row */}
      <div className="mb-2 flex gap-2">
        <input
          type="text"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add keyword..."
          className="flex-1 rounded-input border border-border bg-surface px-3 py-2 text-sm"
        />
        <button
          onClick={handleAdd}
          disabled={!newKeyword.trim()}
          className="rounded-button bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90 disabled:opacity-50"
        >
          Add
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-sm text-text-muted">Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-card border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface text-xs uppercase text-text-muted">
              <tr>
                <th
                  className="cursor-pointer px-3 py-2 hover:text-text"
                  onClick={() => handleSort('keyword')}
                >
                  Keyword{sortArrow('keyword')}
                </th>
                <th
                  className="cursor-pointer px-3 py-2 text-right hover:text-text"
                  onClick={() => handleSort('monthlyVolume')}
                >
                  Volume{sortArrow('monthlyVolume')}
                </th>
                <th
                  className="cursor-pointer px-3 py-2 text-right hover:text-text"
                  onClick={() => handleSort('cpc')}
                >
                  CPC{sortArrow('cpc')}
                </th>
                <th
                  className="cursor-pointer px-3 py-2 text-center hover:text-text"
                  onClick={() => handleSort('intentMatch')}
                >
                  Intent{sortArrow('intentMatch')}
                </th>
                <th
                  className="cursor-pointer px-3 py-2 hover:text-text"
                  onClick={() => handleSort('category')}
                >
                  Category{sortArrow('category')}
                </th>
                <th className="px-3 py-2">Notes</th>
                <th className="px-3 py-2 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {keywords.map((kw) => (
                <tr key={kw.id} className="border-b border-border last:border-0">
                  {/* Keyword */}
                  <td
                    className={cellClass}
                    onClick={() => startEdit(kw.id, 'keyword', kw.keyword)}
                  >
                    {editingCell?.id === kw.id && editingCell.field === 'keyword' ? (
                      <input
                        ref={editRef}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleSave(kw.id, 'keyword', editValue)}
                        onKeyDown={(e) =>
                          e.key === 'Enter' && handleSave(kw.id, 'keyword', editValue)
                        }
                        className="w-full rounded border border-primary bg-background px-1 py-0.5 text-sm"
                      />
                    ) : (
                      kw.keyword
                    )}
                  </td>

                  {/* Volume */}
                  <td
                    className={`${cellClass} text-right`}
                    onClick={() =>
                      startEdit(kw.id, 'monthlyVolume', kw.monthlyVolume?.toString() ?? '')
                    }
                  >
                    {editingCell?.id === kw.id && editingCell.field === 'monthlyVolume' ? (
                      <input
                        ref={editRef}
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleSave(kw.id, 'monthlyVolume', editValue)}
                        onKeyDown={(e) =>
                          e.key === 'Enter' && handleSave(kw.id, 'monthlyVolume', editValue)
                        }
                        className="w-20 rounded border border-primary bg-background px-1 py-0.5 text-right text-sm"
                      />
                    ) : (
                      kw.monthlyVolume?.toLocaleString() ?? '—'
                    )}
                  </td>

                  {/* CPC */}
                  <td
                    className={`${cellClass} text-right`}
                    onClick={() => startEdit(kw.id, 'cpc', kw.cpc?.toString() ?? '')}
                  >
                    {editingCell?.id === kw.id && editingCell.field === 'cpc' ? (
                      <input
                        ref={editRef}
                        type="number"
                        step="0.01"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleSave(kw.id, 'cpc', editValue)}
                        onKeyDown={(e) =>
                          e.key === 'Enter' && handleSave(kw.id, 'cpc', editValue)
                        }
                        className="w-20 rounded border border-primary bg-background px-1 py-0.5 text-right text-sm"
                      />
                    ) : kw.cpc != null ? (
                      `$${kw.cpc.toFixed(2)}`
                    ) : (
                      '—'
                    )}
                  </td>

                  {/* Intent */}
                  <td className="px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={kw.intentMatch}
                      onChange={() => handleToggleIntent(kw)}
                      className="accent-primary"
                    />
                  </td>

                  {/* Category */}
                  <td
                    className={cellClass}
                    onClick={() => startEdit(kw.id, 'category', kw.category ?? '')}
                  >
                    {editingCell?.id === kw.id && editingCell.field === 'category' ? (
                      <input
                        ref={editRef}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleSave(kw.id, 'category', editValue)}
                        onKeyDown={(e) =>
                          e.key === 'Enter' && handleSave(kw.id, 'category', editValue)
                        }
                        className="w-full rounded border border-primary bg-background px-1 py-0.5 text-sm"
                      />
                    ) : (
                      kw.category ?? '—'
                    )}
                  </td>

                  {/* Notes */}
                  <td
                    className={cellClass}
                    onClick={() => startEdit(kw.id, 'notes', kw.notes ?? '')}
                  >
                    {editingCell?.id === kw.id && editingCell.field === 'notes' ? (
                      <input
                        ref={editRef}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleSave(kw.id, 'notes', editValue)}
                        onKeyDown={(e) =>
                          e.key === 'Enter' && handleSave(kw.id, 'notes', editValue)
                        }
                        className="w-full rounded border border-primary bg-background px-1 py-0.5 text-sm"
                      />
                    ) : (
                      <span className="text-text-muted">{kw.notes || '—'}</span>
                    )}
                  </td>

                  {/* Delete */}
                  <td className="px-3 py-2 text-center">
                    {deleteConfirm === kw.id ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDelete(kw.id)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="text-xs text-text-muted hover:underline"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(kw.id)}
                        className="text-text-muted hover:text-red-600"
                        title="Delete"
                      >
                        ×
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {keywords.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-text-muted">
                    No keywords yet. Add one above or use Bulk Import.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
