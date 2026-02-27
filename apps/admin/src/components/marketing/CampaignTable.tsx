'use client';

import type { CampaignData } from '@gyp/shared';
import { Area, AreaChart } from 'recharts';

type Props = {
  campaigns: CampaignData[];
  loading?: boolean;
};

function formatCurrency(value: number): string {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

const statusStyles: Record<CampaignData['status'], string> = {
  active: 'bg-green-50 text-green-700',
  paused: 'bg-gray-100 text-text-muted',
  completed: 'bg-blue-50 text-blue-700',
};

function StatusBadge({ status }: { status: CampaignData['status'] }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[status]}`}>
      {status}
    </span>
  );
}

function Sparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;
  const chartData = data.map((v, i) => ({ i, v }));

  return (
    <AreaChart width={50} height={24} data={chartData}>
      <Area
        type="monotone"
        dataKey="v"
        stroke="var(--color-primary)"
        fill="var(--color-primary)"
        fillOpacity={0.15}
        strokeWidth={1}
        dot={false}
        isAnimationActive={false}
      />
    </AreaChart>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 10 }).map((_, i) => (
        <td key={i} className="px-3 py-3">
          <div className="h-4 w-16 rounded bg-background-dark" />
        </td>
      ))}
    </tr>
  );
}

export function CampaignTable({ campaigns, loading }: Props) {
  const columns = [
    'Campaign',
    'Status',
    'Spend',
    'Impressions',
    'Clicks',
    'CTR',
    'CPC',
    'Conversions',
    'CPA',
    'Trend',
  ];

  return (
    <div className="overflow-x-auto rounded-card border border-border bg-surface">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-background">
            {columns.map((col) => (
              <th key={col} className="px-3 py-2.5 text-left text-xs font-medium text-text-muted">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {loading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : campaigns.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-3 py-12 text-center text-sm text-text-muted">
                No campaigns found for this date range.
              </td>
            </tr>
          ) : (
            campaigns.map((c) => (
              <tr key={c.id} className="hover:bg-background/50">
                <td className="px-3 py-2.5 font-medium text-text">{c.name}</td>
                <td className="px-3 py-2.5">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-3 py-2.5 tabular-nums">{formatCurrency(c.spend)}</td>
                <td className="px-3 py-2.5 tabular-nums">{formatNumber(c.impressions)}</td>
                <td className="px-3 py-2.5 tabular-nums">{formatNumber(c.clicks)}</td>
                <td className="px-3 py-2.5 tabular-nums">{formatPercent(c.ctr)}</td>
                <td className="px-3 py-2.5 tabular-nums">{formatCurrency(c.cpc)}</td>
                <td className="px-3 py-2.5 tabular-nums">{formatNumber(c.conversions)}</td>
                <td className="px-3 py-2.5 tabular-nums">{formatCurrency(c.cpa)}</td>
                <td className="px-3 py-2.5">
                  <Sparkline data={c.sparklineData} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
