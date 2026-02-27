'use client';

import { useCallback, useEffect, useState } from 'react';
import type {
  DateRange,
  DateRangePreset,
  FunnelStep,
  KpiMetric,
  ServiceResult,
  WeeklyReportData,
  VariantData,
} from '@gyp/shared';
import {
  ChartContainer,
  DateRangeSelector,
  getDateRange,
  KpiCard,
  KpiCardGrid,
} from '../../../components/marketing';
import { FunnelChart } from '../../../components/marketing/FunnelChart';
import { WeeklyReportCard } from '../../../components/marketing/WeeklyReportCard';

type SummaryResponse = {
  stripe: ServiceResult<{ revenue: KpiMetric; purchases: KpiMetric; refundRate: KpiMetric }>;
  traffic: ServiceResult<{ visitors: KpiMetric; bounceRate: KpiMetric; pageviews: KpiMetric }>;
  variants: ServiceResult<VariantData[]>;
  email: ServiceResult<KpiMetric[]>;
  ads: ServiceResult<{ spend: KpiMetric; ctr: KpiMetric; cpc: KpiMetric }>;
  database: ServiceResult<{
    totalUsers: number;
    purchasedUsers: number;
    averageProgress: number;
    completionRate: number;
    averageTimeToPurchase: number;
  }>;
};

export default function FunnelPage() {
  const [preset, setPreset] = useState<DateRangePreset>('7d');
  const [range, setRange] = useState<DateRange>(getDateRange('7d'));
  const [loading, setLoading] = useState(true);
  const [funnelSteps, setFunnelSteps] = useState<FunnelStep[]>([]);
  const [kpis, setKpis] = useState<KpiMetric[]>([]);
  const [reportData, setReportData] = useState<WeeklyReportData | null>(null);

  const fetchData = useCallback(async (dateRange: DateRange) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/marketing/summary?from=${dateRange.from}&to=${dateRange.to}`,
      );
      const data: SummaryResponse = await res.json();

      // Build funnel steps
      const visitors =
        data.traffic.status === 'ok' ? Number(data.traffic.data.visitors.value) : 0;
      const signups =
        data.email.status === 'ok'
          ? Number(data.email.data.find((k) => k.label === 'New Subscribers')?.value ?? 0)
          : 0;
      const purchases =
        data.stripe.status === 'ok' ? Number(data.stripe.data.purchases.value) : 0;

      const steps: FunnelStep[] = [
        { label: 'Visitors', value: visitors },
        {
          label: 'Email Signups',
          value: signups,
          conversionFromPrevious: visitors > 0 ? (signups / visitors) * 100 : 0,
        },
        {
          label: 'Purchases',
          value: purchases,
          conversionFromPrevious: signups > 0 ? (purchases / signups) * 100 : 0,
        },
      ];
      setFunnelSteps(steps);

      // Computed KPIs
      const adSpend =
        data.ads.status === 'ok' ? Number(data.ads.data.spend.value) : 0;
      const revenue =
        data.stripe.status === 'ok' ? Number(data.stripe.data.revenue.value) : 0;
      const cpa = purchases > 0 ? adSpend / purchases : 0;
      const roas = adSpend > 0 ? revenue / adSpend : 0;

      setKpis([
        { label: 'CPA', value: cpa, format: 'currency', tooltip: 'Cost per acquisition. Ad spend divided by purchases. Must stay below $297 to be profitable.' },
        { label: 'ROAS', value: roas, format: 'number', tooltip: 'Return on ad spend. Revenue per dollar of ads. Above 3x is healthy for a $297 product.' },
        {
          label: 'Completion Rate',
          value: data.database.status === 'ok' ? data.database.data.completionRate : 0,
          format: 'percent',
          tooltip: 'Percent of purchasers who completed all lessons. High completion = high satisfaction.',
        },
      ]);

      // Build weekly report data
      const bestVariant =
        data.variants.status === 'ok' && data.variants.data.length > 0
          ? data.variants.data.reduce((best, v) =>
              v.conversionRate > best.conversionRate ? v : best,
            ).variant
          : 'N/A';

      const costPerSignup = signups > 0 ? adSpend / signups : 0;

      setReportData({
        weekOf: dateRange.from,
        traffic: {
          totalVisitors: visitors,
          fromMetaAds: 0, // would need source breakdown
          adSpend,
          organicDirect: visitors, // simplified
        },
        conversions: {
          newEmailSignups: signups,
          signupRate: visitors > 0 ? (signups / visitors) * 100 : 0,
          bestVariant,
          costPerSignup,
        },
        email: {
          welcomeOpenRate: 0,
          newsletterOpenRate: 0,
          unsubscribes: 0,
        },
        sales: {
          courseSales: purchases,
          revenue,
          cpa,
        },
      });
    } catch {
      setFunnelSteps([]);
      setKpis([]);
      setReportData(null);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl text-primary">Funnel</h1>
          <p className="text-sm text-text-muted">
            Full-funnel view from visitors to purchases with conversion rates at each step.
          </p>
        </div>
        <DateRangeSelector value={preset} onChange={handleDateChange} />
      </div>

      <KpiCardGrid>
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} metric={kpi} loading={loading} />
        ))}
      </KpiCardGrid>

      <ChartContainer title="Full Funnel (Visitors → Signups → Purchases)" tooltip="Conversion funnel from visitor to purchase. Biggest drop-off = biggest opportunity.">
        <FunnelChart steps={funnelSteps} loading={loading} />
      </ChartContainer>

      <ChartContainer title="Weekly Report" tooltip="Snapshot of the week's key numbers across all channels.">
        <WeeklyReportCard data={reportData} loading={loading} />
      </ChartContainer>
    </div>
  );
}
