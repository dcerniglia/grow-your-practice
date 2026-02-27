'use client';

import { useState } from 'react';
import type { DateRangePreset, DateRange, KpiMetric } from '@gyp/shared';
import {
  DateRangeSelector,
  getDateRange,
  KpiCard,
  KpiCardGrid,
  ChartContainer,
  ServiceStatusBadge,
} from '../components/marketing';

const placeholderKpis: KpiMetric[] = [
  { label: 'Total Revenue', value: 0, format: 'currency' },
  { label: 'Purchases', value: 0, format: 'number' },
  { label: 'CPA', value: 0, format: 'currency' },
  { label: 'Email Subscribers', value: 0, format: 'number' },
  { label: 'Signup Rate', value: 0, format: 'percent' },
  { label: 'Ad Spend', value: 0, format: 'currency' },
];

export default function AdminDashboard() {
  const [datePreset, setDatePreset] = useState<DateRangePreset>('30d');
  const [dateRange, setDateRange] = useState<DateRange>(getDateRange('30d'));

  const handleDateChange = (preset: DateRangePreset, range: DateRange) => {
    setDatePreset(preset);
    setDateRange(range);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl text-primary">Marketing Dashboard</h1>
          <p className="mt-1 text-sm text-text-muted">
            {dateRange.from} — {dateRange.to}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <ServiceStatusBadge name="Stripe" connected={false} />
            <ServiceStatusBadge name="Plausible" connected={false} />
            <ServiceStatusBadge name="ConvertKit" connected={false} />
            <ServiceStatusBadge name="Meta Ads" connected={false} />
          </div>
          <DateRangeSelector value={datePreset} onChange={handleDateChange} />
        </div>
      </div>

      <KpiCardGrid>
        {placeholderKpis.map((kpi) => (
          <KpiCard key={kpi.label} metric={kpi} unavailable />
        ))}
      </KpiCardGrid>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartContainer title="Revenue Over Time" unavailable />
        <ChartContainer title="Funnel" unavailable />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartContainer title="Traffic by Source" unavailable />
        <ChartContainer title="Email Performance" unavailable />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartContainer title="Landing Page Variants" unavailable />
        <ChartContainer title="Ad Campaigns" unavailable />
      </div>

      <ChartContainer title="Weekly Report">
        <div className="text-sm text-text-muted">
          Connect at least one data source to generate the weekly report.
        </div>
      </ChartContainer>
    </div>
  );
}
