'use client';

import type { KpiMetric } from '@gyp/shared';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { Tooltip } from './Tooltip';

function formatValue(value: string | number, format?: KpiMetric['format']): string {
  if (typeof value === 'string') return value;
  switch (format) {
    case 'currency':
      return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    case 'percent':
      return `${value.toFixed(1)}%`;
    case 'number':
    default:
      return value.toLocaleString('en-US');
  }
}

type Props = {
  metric: KpiMetric;
  loading?: boolean;
  unavailable?: boolean;
};

export function KpiCard({ metric, loading, unavailable }: Props) {
  if (loading) {
    return (
      <div className="rounded-card border border-border bg-surface p-4 animate-pulse">
        <div className="h-3 w-20 bg-background-dark rounded mb-3" />
        <div className="h-7 w-24 bg-background-dark rounded mb-2" />
        <div className="h-3 w-16 bg-background-dark rounded" />
      </div>
    );
  }

  if (unavailable) {
    return (
      <div className="rounded-card border border-border bg-surface p-4 opacity-60">
        <p className="text-xs text-text-muted">
        {metric.label}
        {metric.tooltip && <Tooltip content={metric.tooltip} />}
      </p>
        <p className="mt-1 text-sm text-text-muted">Not connected</p>
      </div>
    );
  }

  const delta = metric.deltaPercent;
  const isPositive = delta !== undefined && delta >= 0;

  return (
    <div className="rounded-card border border-border bg-surface p-4">
      <p className="text-xs text-text-muted">
        {metric.label}
        {metric.tooltip && <Tooltip content={metric.tooltip} />}
      </p>
      <div className="mt-1 flex items-end gap-3">
        <p className="text-2xl font-semibold text-text">
          {formatValue(metric.value, metric.format)}
        </p>
        {delta !== undefined && (
          <span
            className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-500'}`}
          >
            {isPositive ? '↑' : '↓'} {Math.abs(delta).toFixed(1)}%
          </span>
        )}
      </div>
      {metric.sparklineData && metric.sparklineData.length > 1 && (
        <div className="mt-2 h-8">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metric.sparklineData.map((v, i) => ({ i, v }))}>
              <Area
                type="monotone"
                dataKey="v"
                stroke="var(--color-primary)"
                fill="var(--color-primary)"
                fillOpacity={0.1}
                strokeWidth={1.5}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export function KpiCardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {children}
    </div>
  );
}
