'use client';

import { useCallback, useEffect, useState } from 'react';
import type {
  DateRangePreset,
  DateRange,
  KpiMetric,
  RevenueDataPoint,
  FunnelStep,
  VariantData,
  ServiceResult,
} from '@gyp/shared';
import {
  DateRangeSelector,
  getDateRange,
  KpiCard,
  KpiCardGrid,
  ChartContainer,
  ServiceStatusBadge,
  RevenueChart,
  TrafficSourcesChart,
  EmailPerformanceChart,
  VariantComparisonChart,
  CampaignTable,
  FunnelChart,
  WeeklyReportCard,
} from '../components/marketing';

type SummaryData = {
  stripe: ServiceResult<{ revenue: KpiMetric; purchases: KpiMetric; refundRate: KpiMetric }>;
  revenueSeries: ServiceResult<RevenueDataPoint[]>;
  traffic: ServiceResult<{ visitors: KpiMetric; bounceRate: KpiMetric; pageviews: KpiMetric }>;
  variants: ServiceResult<VariantData[]>;
  email: ServiceResult<KpiMetric[]>;
  ads: ServiceResult<{ spend: KpiMetric; ctr: KpiMetric; cpc: KpiMetric }>;
  database: ServiceResult<{
    totalUsers: number;
    purchasedUsers: number;
    averageProgress: number;
    completionRate: number;
  }>;
};

export default function AdminDashboard() {
  const [datePreset, setDatePreset] = useState<DateRangePreset>('30d');
  const [dateRange, setDateRange] = useState<DateRange>(getDateRange('30d'));
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SummaryData | null>(null);

  // Extract data with proper narrowing
  const stripe = data?.stripe.status === 'ok' ? data.stripe.data : null;
  const revSeries = data?.revenueSeries.status === 'ok' ? data.revenueSeries.data : [];
  const traffic = data?.traffic.status === 'ok' ? data.traffic.data : null;
  const variantsData = data?.variants.status === 'ok' ? data.variants.data : [];
  const emailKpis = data?.email.status === 'ok' ? data.email.data : null;
  const ads = data?.ads.status === 'ok' ? data.ads.data : null;

  const stripeOk = !!stripe;
  const plausibleOk = !!traffic;
  const convertkitOk = !!emailKpis;
  const metaOk = !!ads;

  const fetchData = useCallback(async (range: DateRange) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/marketing/summary?from=${range.from}&to=${range.to}`);
      setData(await res.json());
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData(dateRange);
  }, [dateRange, fetchData]);

  function handleDateChange(preset: DateRangePreset, range: DateRange) {
    setDatePreset(preset);
    setDateRange(range);
  }

  // Build KPI row
  const adSpendVal = ads ? Number(ads.spend.value) : 0;
  const purchaseVal = stripe ? Number(stripe.purchases.value) : 0;
  const revenueVal = stripe ? Number(stripe.revenue.value) : 0;
  const visitorsVal = traffic ? Number(traffic.visitors.value) : 0;
  const signupsVal = emailKpis
    ? Number(emailKpis.find((k) => k.label === 'New Subscribers')?.value ?? 0)
    : 0;

  const kpis: { metric: KpiMetric; unavailable: boolean }[] = [
    {
      metric: stripe?.revenue ?? { label: 'Total Revenue', value: 0, format: 'currency' },
      unavailable: !stripeOk,
    },
    {
      metric: stripe?.purchases ?? { label: 'Purchases', value: 0, format: 'number' },
      unavailable: !stripeOk,
    },
    {
      metric: { label: 'CPA', value: purchaseVal > 0 ? adSpendVal / purchaseVal : 0, format: 'currency' },
      unavailable: !stripeOk || !metaOk,
    },
    {
      metric: emailKpis?.find((k) => k.label === 'Subscribers') ?? { label: 'Email Subscribers', value: 0, format: 'number' },
      unavailable: !convertkitOk,
    },
    {
      metric: { label: 'Signup Rate', value: visitorsVal > 0 ? (signupsVal / visitorsVal) * 100 : 0, format: 'percent' },
      unavailable: !plausibleOk || !convertkitOk,
    },
    {
      metric: ads?.spend ?? { label: 'Ad Spend', value: 0, format: 'currency' },
      unavailable: !metaOk,
    },
  ];

  // Build funnel steps
  const funnelSteps: FunnelStep[] = [
    { label: 'Visitors', value: visitorsVal },
    { label: 'Email Signups', value: signupsVal, conversionFromPrevious: visitorsVal > 0 ? (signupsVal / visitorsVal) * 100 : 0 },
    { label: 'Purchases', value: purchaseVal, conversionFromPrevious: signupsVal > 0 ? (purchaseVal / signupsVal) * 100 : 0 },
  ];

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
            <ServiceStatusBadge name="Stripe" connected={stripeOk} />
            <ServiceStatusBadge name="Plausible" connected={plausibleOk} />
            <ServiceStatusBadge name="ConvertKit" connected={convertkitOk} />
            <ServiceStatusBadge name="Meta Ads" connected={metaOk} />
          </div>
          <DateRangeSelector value={datePreset} onChange={handleDateChange} />
        </div>
      </div>

      <KpiCardGrid>
        {kpis.map(({ metric, unavailable }) => (
          <KpiCard key={metric.label} metric={metric} loading={loading} unavailable={unavailable} />
        ))}
      </KpiCardGrid>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartContainer title="Revenue Over Time" unavailable={!stripeOk && !loading}>
          <RevenueChart data={revSeries} loading={loading} />
        </ChartContainer>
        <ChartContainer title="Funnel">
          <FunnelChart steps={funnelSteps} loading={loading} />
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartContainer title="Landing Page Variants" unavailable={!plausibleOk && !loading}>
          <VariantComparisonChart data={variantsData} loading={loading} />
        </ChartContainer>
        <ChartContainer title="Email Performance" unavailable={!convertkitOk && !loading}>
          <EmailPerformanceChart data={[]} loading={loading} />
        </ChartContainer>
      </div>

      <ChartContainer title="Weekly Report">
        <WeeklyReportCard
          data={
            !loading && (stripeOk || plausibleOk || convertkitOk || metaOk)
              ? {
                  weekOf: dateRange.from,
                  traffic: {
                    totalVisitors: visitorsVal,
                    fromMetaAds: 0,
                    adSpend: adSpendVal,
                    organicDirect: visitorsVal,
                  },
                  conversions: {
                    newEmailSignups: signupsVal,
                    signupRate: visitorsVal > 0 ? (signupsVal / visitorsVal) * 100 : 0,
                    bestVariant:
                      variantsData.length > 0
                        ? variantsData.reduce((a, b) => (a.conversionRate > b.conversionRate ? a : b)).variant
                        : 'N/A',
                    costPerSignup: signupsVal > 0 ? adSpendVal / signupsVal : 0,
                  },
                  email: { welcomeOpenRate: 0, newsletterOpenRate: 0, unsubscribes: 0 },
                  sales: {
                    courseSales: purchaseVal,
                    revenue: revenueVal,
                    cpa: purchaseVal > 0 ? adSpendVal / purchaseVal : 0,
                  },
                }
              : null
          }
          loading={loading}
        />
      </ChartContainer>
    </div>
  );
}
