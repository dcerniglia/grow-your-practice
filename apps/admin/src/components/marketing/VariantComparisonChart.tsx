'use client';

import type { VariantData } from '@gyp/shared';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const VARIANT_COLORS: Record<string, string> = {
  'Variant A': '#2D6A6A',
  'Variant B': '#D4943A',
  'Variant C': '#8B5CF6',
};

type Props = {
  data: VariantData[];
  loading?: boolean;
};

export function VariantComparisonChart({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-text-muted">
        No variant data for this period
      </div>
    );
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="variant"
            tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
          />
          <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
          <Tooltip
            contentStyle={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={((value: number, name: string) => {
              return [value.toLocaleString(), name];
            }) as never}
          />
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          />
          <Bar dataKey="visitors" name="Visitors" radius={[2, 2, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.variant} fill={VARIANT_COLORS[entry.variant] ?? '#999'} />
            ))}
          </Bar>
          <Bar dataKey="signups" name="Signups" radius={[2, 2, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.variant}
                fill={VARIANT_COLORS[entry.variant] ?? '#999'}
                opacity={0.5}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-2 flex justify-center gap-6">
        {data.map((v) => (
          <span key={v.variant} className="text-xs text-text-muted">
            {v.variant}: {v.conversionRate}% conv.
          </span>
        ))}
      </div>
    </div>
  );
}
