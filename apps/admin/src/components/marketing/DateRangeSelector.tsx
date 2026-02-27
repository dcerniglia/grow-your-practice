'use client';

import { useState } from 'react';
import type { DateRangePreset, DateRange } from '@gyp/shared';

const presets: { label: string; value: DateRangePreset }[] = [
  { label: 'Today', value: 'today' },
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '90 days', value: '90d' },
];

function getDateRange(preset: DateRangePreset): DateRange {
  const to = new Date();
  const from = new Date();

  switch (preset) {
    case 'today':
      break;
    case '7d':
      from.setDate(from.getDate() - 7);
      break;
    case '30d':
      from.setDate(from.getDate() - 30);
      break;
    case '90d':
      from.setDate(from.getDate() - 90);
      break;
    case 'custom':
      from.setDate(from.getDate() - 30);
      break;
  }

  return {
    from: from.toISOString().split('T')[0]!,
    to: to.toISOString().split('T')[0]!,
    label: preset,
  };
}

type Props = {
  value: DateRangePreset;
  onChange: (preset: DateRangePreset, range: DateRange) => void;
};

export function DateRangeSelector({ value, onChange }: Props) {
  return (
    <div className="flex gap-1 rounded-card bg-surface border border-border p-1">
      {presets.map((preset) => (
        <button
          key={preset.value}
          onClick={() => onChange(preset.value, getDateRange(preset.value))}
          className={`rounded-button px-3 py-1.5 text-sm font-medium transition-colors ${
            value === preset.value
              ? 'bg-primary text-white'
              : 'text-text-muted hover:text-text hover:bg-background'
          }`}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}

export { getDateRange };
