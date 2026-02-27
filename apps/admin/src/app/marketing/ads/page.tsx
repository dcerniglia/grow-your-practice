'use client';

import { useCallback, useEffect, useState } from 'react';
import type { DateRangePreset, DateRange, KpiMetric, CampaignData, ServiceResult } from '@gyp/shared';
import {
  DateRangeSelector,
  getDateRange,
  KpiCard,
  KpiCardGrid,
  ChartContainer,
} from '../../../components/marketing';
import { CampaignTable } from '../../../components/marketing/CampaignTable';

type AdMetrics = {
  spend: KpiMetric;
  ctr: KpiMetric;
  cpc: KpiMetric;
};

type ApiResponse = {
  metrics: ServiceResult<AdMetrics>;
  campaigns: ServiceResult<CampaignData[]>;
};

const defaultMetric: KpiMetric = { label: '', value: 0 };

export default function AdsPage() {
  const [preset, setPreset] = useState<DateRangePreset>('30d');
  const [range, setRange] = useState<DateRange>(getDateRange('30d'));
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [metrics, setMetrics] = useState<AdMetrics>({
    spend: { ...defaultMetric, label: 'Ad Spend', format: 'currency' },
    ctr: { ...defaultMetric, label: 'CTR', format: 'percent' },
    cpc: { ...defaultMetric, label: 'CPC', format: 'currency' },
  });
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);

  const fetchData = useCallback(async (from: string, to: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/marketing/meta-ads?from=${from}&to=${to}`);
      const data = (await res.json()) as ApiResponse;

      if (data.metrics.status === 'unavailable') {
        setUnavailable(true);
        return;
      }

      setUnavailable(false);
      setMetrics(data.metrics.data);

      if (data.campaigns.status === 'ok') {
        setCampaigns(data.campaigns.data);
      }
    } catch {
      setUnavailable(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(range.from, range.to);
  }, [range, fetchData]);

  function handleRangeChange(newPreset: DateRangePreset, newRange: DateRange) {
    setPreset(newPreset);
    setRange(newRange);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl text-primary">Ads</h1>
          <p className="text-sm text-text-muted">
            Meta Ads campaign performance, spend, and ROI tracking.
          </p>
        </div>
        <DateRangeSelector value={preset} onChange={handleRangeChange} />
      </div>

      <KpiCardGrid>
        <KpiCard metric={metrics.spend} loading={loading} unavailable={unavailable} />
        <KpiCard metric={metrics.ctr} loading={loading} unavailable={unavailable} />
        <KpiCard metric={metrics.cpc} loading={loading} unavailable={unavailable} />
      </KpiCardGrid>

      <ChartContainer title="Campaign Performance" unavailable={unavailable}>
        {!unavailable && (
          <CampaignTable campaigns={campaigns} loading={loading} />
        )}
      </ChartContainer>
    </div>
  );
}
