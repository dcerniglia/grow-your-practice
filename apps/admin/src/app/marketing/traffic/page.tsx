'use client';

import { useCallback, useEffect, useState } from 'react';
import type {
  DateRange,
  DateRangePreset,
  KpiMetric,
  ServiceResult,
  TrafficSourceDataPoint,
  VariantData,
} from '@gyp/shared';
import {
  ChartContainer,
  DateRangeSelector,
  getDateRange,
  KpiCard,
  KpiCardGrid,
  TrafficSourcesChart,
  VariantComparisonChart,
} from '../../../components/marketing';

type PlausibleResponse = {
  metrics: ServiceResult<{ visitors: KpiMetric; bounceRate: KpiMetric; pageviews: KpiMetric }>;
  sources: ServiceResult<TrafficSourceDataPoint[]>;
  variants: ServiceResult<VariantData[]>;
};

export default function TrafficPage() {
  const [preset, setPreset] = useState<DateRangePreset>('30d');
  const [range, setRange] = useState<DateRange>(getDateRange('30d'));
  const [loading, setLoading] = useState(true);
  const [metricsData, setMetricsData] = useState<{
    visitors: KpiMetric;
    bounceRate: KpiMetric;
    pageviews: KpiMetric;
  } | null>(null);
  const [sourcesData, setSourcesData] = useState<TrafficSourceDataPoint[]>([]);
  const [variantData, setVariantData] = useState<VariantData[]>([]);
  const [unavailable, setUnavailable] = useState(false);

  const fetchData = useCallback(async (dateRange: DateRange) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/marketing/plausible?from=${dateRange.from}&to=${dateRange.to}`
      );
      const json: PlausibleResponse = await res.json();

      if (json.metrics.status === 'ok') {
        setMetricsData(json.metrics.data);
        setUnavailable(false);
      } else {
        setMetricsData(null);
        setUnavailable(true);
      }

      if (json.sources.status === 'ok') {
        setSourcesData(json.sources.data);
      } else {
        setSourcesData([]);
      }

      if (json.variants.status === 'ok') {
        setVariantData(json.variants.data);
      } else {
        setVariantData([]);
      }
    } catch {
      setUnavailable(true);
      setMetricsData(null);
      setSourcesData([]);
      setVariantData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(range);
  }, [range, fetchData]);

  const handleDateChange = (newPreset: DateRangePreset, newRange: DateRange) => {
    setPreset(newPreset);
    setRange(newRange);
  };

  const signupRate: KpiMetric = {
    label: 'Signup Rate',
    value: variantData.length > 0
      ? variantData.reduce((sum, v) => sum + v.conversionRate, 0) / variantData.length
      : 0,
    format: 'percent',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl text-primary">Traffic</h1>
          <p className="text-sm text-text-muted">
            Plausible analytics deep-dive — visitors, sources, and variant performance.
          </p>
        </div>
        <DateRangeSelector value={preset} onChange={handleDateChange} />
      </div>

      {unavailable && !loading ? (
        <div className="rounded-card border border-border bg-surface p-8 text-center">
          <p className="text-text-muted">
            Plausible is not connected. Add <code className="text-xs">PLAUSIBLE_API_KEY</code> and{' '}
            <code className="text-xs">PLAUSIBLE_SITE_ID</code> environment variables to enable.
          </p>
        </div>
      ) : (
        <>
          <KpiCardGrid>
            <KpiCard
              metric={metricsData?.visitors ?? { label: 'Visitors', value: 0, format: 'number' }}
              loading={loading}
              unavailable={unavailable}
            />
            <KpiCard
              metric={metricsData?.bounceRate ?? { label: 'Bounce Rate', value: 0, format: 'percent' }}
              loading={loading}
              unavailable={unavailable}
            />
            <KpiCard
              metric={signupRate}
              loading={loading}
              unavailable={unavailable}
            />
          </KpiCardGrid>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ChartContainer title="Traffic by Source">
              <TrafficSourcesChart data={sourcesData} loading={loading} />
            </ChartContainer>
            <ChartContainer title="Variant Comparison (A/B/C)">
              <VariantComparisonChart data={variantData} loading={loading} />
            </ChartContainer>
          </div>
        </>
      )}
    </div>
  );
}
