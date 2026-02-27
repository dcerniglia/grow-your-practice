'use client';

import type { TrafficSourceDataPoint } from '@gyp/shared';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const SOURCE_COLORS: Record<keyof Omit<TrafficSourceDataPoint, 'date'>, string> = {
  direct: '#2D6A6A',
  organic: '#3D8A8A',
  metaAds: '#D4943A',
  social: '#4DA8A8',
  referral: '#5EC0C0',
};

const SOURCE_LABELS: Record<keyof Omit<TrafficSourceDataPoint, 'date'>, string> = {
  direct: 'Direct',
  organic: 'Organic',
  metaAds: 'Meta Ads',
  social: 'Social',
  referral: 'Referral',
};

type Props = {
  data: TrafficSourceDataPoint[];
  loading?: boolean;
};

export function TrafficSourcesChart({ data, loading }: Props) {
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
        No traffic data for this period
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
          tickFormatter={(v: string) => {
            const d = new Date(v);
            return `${d.getMonth() + 1}/${d.getDate()}`;
          }}
        />
        <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
        <Tooltip
          contentStyle={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Legend
          verticalAlign="bottom"
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
        />
        {(Object.keys(SOURCE_COLORS) as Array<keyof typeof SOURCE_COLORS>).map((key) => (
          <Bar
            key={key}
            dataKey={key}
            name={SOURCE_LABELS[key]}
            stackId="sources"
            fill={SOURCE_COLORS[key]}
            radius={key === 'referral' ? [2, 2, 0, 0] : undefined}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
