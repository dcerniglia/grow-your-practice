'use client';

import type { RevenueDataPoint } from '@gyp/shared';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type Props = {
  data: RevenueDataPoint[];
  loading?: boolean;
};

function formatDollar(value: number): string {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

type TooltipPayloadEntry = {
  value: number;
  dataKey: string;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
};

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length || !label) return null;
  const revenue = payload[0]!.value;
  return (
    <div className="rounded-card border border-border bg-surface px-3 py-2 shadow-sm">
      <p className="text-xs text-text-muted">{formatDateLabel(label)}</p>
      <p className="text-sm font-semibold text-text">{formatDollar(revenue)}</p>
    </div>
  );
}

export function RevenueChart({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-text-muted">
        Loading...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-text-muted">
        No revenue data for this period
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDateLabel}
            tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={formatDollar}
            tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
            tickLine={false}
            axisLine={false}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="var(--color-primary)"
            fill="var(--color-primary)"
            fillOpacity={0.1}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
