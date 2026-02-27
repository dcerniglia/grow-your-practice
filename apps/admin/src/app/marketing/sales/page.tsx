'use client';

import { useCallback, useEffect, useState } from 'react';
import type { DateRange, DateRangePreset, KpiMetric, RevenueDataPoint, ServiceResult } from '@gyp/shared';
import {
  ChartContainer,
  DateRangeSelector,
  getDateRange,
  KpiCard,
  KpiCardGrid,
} from '../../../components/marketing';
import { RevenueChart } from '../../../components/marketing/RevenueChart';

type StripeMetrics = {
  revenue: KpiMetric;
  purchases: KpiMetric;
  refundRate: KpiMetric;
};

type ApiResponse = {
  metrics: ServiceResult<StripeMetrics>;
  series: ServiceResult<RevenueDataPoint[]>;
};

export default function SalesPage() {
  const [preset, setPreset] = useState<DateRangePreset>('30d');
  const [range, setRange] = useState<DateRange>(getDateRange('30d'));
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<StripeMetrics | null>(null);
  const [series, setSeries] = useState<RevenueDataPoint[]>([]);
  const [unavailable, setUnavailable] = useState(false);

  const fetchData = useCallback(async (dateRange: DateRange) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/marketing/stripe?from=${dateRange.from}&to=${dateRange.to}`,
      );
      if (!res.ok) {
        setUnavailable(true);
        return;
      }
      const data = (await res.json()) as ApiResponse;

      if (data.metrics.status === 'ok') {
        setMetrics(data.metrics.data);
        setUnavailable(false);
      } else {
        setUnavailable(true);
      }

      if (data.series.status === 'ok') {
        setSeries(data.series.data);
      } else {
        setSeries([]);
      }
    } catch {
      setUnavailable(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData(range);
  }, [range, fetchData]);

  function handleDateChange(newPreset: DateRangePreset, newRange: DateRange) {
    setPreset(newPreset);
    setRange(newRange);
  }

  const fallbackMetric = (label: string, format: KpiMetric['format']): KpiMetric => ({
    label,
    value: 0,
    format,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl text-primary">Sales</h1>
          <p className="text-sm text-text-muted">
            Stripe revenue, purchases, refunds, and payment analytics.
          </p>
        </div>
        <DateRangeSelector value={preset} onChange={handleDateChange} />
      </div>

      <KpiCardGrid>
        <KpiCard
          metric={{ ...(metrics?.revenue ?? fallbackMetric('Revenue', 'currency')), tooltip: 'Gross Stripe revenue after refunds.' }}
          loading={loading}
          unavailable={unavailable}
        />
        <KpiCard
          metric={{ ...(metrics?.purchases ?? fallbackMetric('Purchases', 'number')), tooltip: 'Total completed course purchases.' }}
          loading={loading}
          unavailable={unavailable}
        />
        <KpiCard
          metric={{ ...(metrics?.refundRate ?? fallbackMetric('Refund Rate', 'percent')), tooltip: 'Percent of purchases refunded. Below 5% is healthy.' }}
          loading={loading}
          unavailable={unavailable}
        />
      </KpiCardGrid>

      <ChartContainer title="Revenue Over Time" unavailable={unavailable && !loading} tooltip="Daily revenue. Spikes often correlate with email sends or ad launches.">
        <RevenueChart data={series} loading={loading} />
      </ChartContainer>
    </div>
  );
}
