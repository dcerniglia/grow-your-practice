'use client';

import type { EmailMetricDataPoint } from '@gyp/shared';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
} from 'recharts';

type Props = {
  data: EmailMetricDataPoint[];
  loading?: boolean;
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

type TooltipPayloadEntry = {
  name: string;
  value: number;
  color: string;
};

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-card border border-border bg-surface p-3 shadow-sm">
      <p className="text-xs font-medium text-text">{label ? formatDate(label) : ''}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: {entry.value.toFixed(1)}%
        </p>
      ))}
    </div>
  );
}

export function EmailPerformanceChart({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-text-muted">
        No email performance data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
        />
        <YAxis
          domain={[0, 100]}
          tickFormatter={(v: number) => `${v}%`}
          tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <ReferenceLine
          y={50}
          stroke="var(--color-text-muted)"
          strokeDasharray="4 4"
          label={{ value: '50% target', position: 'right', fontSize: 10, fill: 'var(--color-text-muted)' }}
        />
        <ReferenceLine
          y={5}
          stroke="var(--color-text-muted)"
          strokeDasharray="4 4"
          label={{ value: '5% target', position: 'right', fontSize: 10, fill: 'var(--color-text-muted)' }}
        />
        <Line
          type="monotone"
          dataKey="openRate"
          name="Open Rate"
          stroke="var(--color-primary)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="clickRate"
          name="Click Rate"
          stroke="var(--color-accent)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
