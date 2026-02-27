'use client';

import { useState, useEffect, useCallback } from 'react';
import type { DateRangePreset, DateRange, KpiMetric, EmailMetricDataPoint } from '@gyp/shared';
import {
  ChartContainer,
  DateRangeSelector,
  getDateRange,
  KpiCard,
  KpiCardGrid,
  EmailPerformanceChart,
} from '../../../components/marketing';

type TagBreakdown = { tag: string; count: number };

type ConvertKitData = {
  kpis: KpiMetric[];
  growth: EmailMetricDataPoint[];
  tags: TagBreakdown[];
};

type ApiResponse =
  | { status: 'ok'; data: ConvertKitData }
  | { status: 'unavailable'; error: string };

export default function EmailPage() {
  const [preset, setPreset] = useState<DateRangePreset>('30d');
  const [range, setRange] = useState<DateRange>(getDateRange('30d'));
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [data, setData] = useState<ConvertKitData | null>(null);

  const fetchData = useCallback(async (r: DateRange) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/marketing/convertkit?from=${r.from}&to=${r.to}`);
      const json: ApiResponse = await res.json();
      if (json.status === 'unavailable') {
        setUnavailable(true);
        setData(null);
      } else {
        setUnavailable(false);
        setData(json.data);
      }
    } catch {
      setUnavailable(true);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData(range);
  }, [range, fetchData]);

  function handleRangeChange(p: DateRangePreset, r: DateRange) {
    setPreset(p);
    setRange(r);
  }

  const defaultKpis: KpiMetric[] = [
    { label: 'Subscribers', value: 0, format: 'number', tooltip: 'Total active ConvertKit subscribers.' },
    { label: 'New Subscribers', value: 0, format: 'number', tooltip: 'Subscribers added in this period.' },
    { label: 'Open Rate', value: 'N/A', tooltip: 'Percent of delivered emails opened. Above 40% is strong for a niche list.' },
    { label: 'Click Rate', value: 'N/A', tooltip: 'Percent of opened emails where a link was clicked. Measures content engagement.' },
  ];

  const kpis = data?.kpis ?? defaultKpis;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl text-primary">Email</h1>
          <p className="text-sm text-text-muted">
            ConvertKit subscriber metrics, open rates, and sequence performance.
          </p>
        </div>
        <DateRangeSelector value={preset} onChange={handleRangeChange} />
      </div>

      <KpiCardGrid>
        {kpis.map((metric) => (
          <KpiCard key={metric.label} metric={metric} loading={loading} unavailable={unavailable} />
        ))}
      </KpiCardGrid>

      <ChartContainer title="Email Performance (Open Rate / Click Rate)" unavailable={unavailable} tooltip="Trends in open and click rates. Drops may signal deliverability issues or list fatigue.">
        <EmailPerformanceChart data={data?.growth ?? []} loading={loading} />
      </ChartContainer>

      <ChartContainer title="Tag Breakdown" unavailable={unavailable} tooltip="Subscriber counts per ConvertKit tag. Tags track which lead magnet or sequence a subscriber came through.">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : data?.tags.length ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {data.tags.map((t) => (
              <div
                key={t.tag}
                className="rounded-card border border-border bg-background p-3"
              >
                <p className="text-sm font-medium text-text">{t.tag}</p>
                <p className="mt-1 text-lg font-semibold text-primary">
                  {t.count.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center text-sm text-text-muted">
            No tags found
          </div>
        )}
      </ChartContainer>
    </div>
  );
}
