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
    averageTimeToPurchase: number;
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
  const totalSubscribers = emailKpis
    ? Number(emailKpis.find((k) => k.label === 'Subscribers')?.value ?? 0)
    : 0;
  const dbData = data?.database.status === 'ok' ? data.database.data : null;

  const kpis: { metric: KpiMetric; unavailable: boolean }[] = [
    // Row 1
    {
      metric: { ...(stripe?.revenue ?? { label: 'Total Revenue', value: 0, format: 'currency' }), tooltip: 'Gross revenue from Stripe after refunds. This is your top-line number.' },
      unavailable: !stripeOk,
    },
    {
      metric: { ...(stripe?.purchases ?? { label: 'Purchases', value: 0, format: 'number' }), tooltip: 'Total course purchases in this period.' },
      unavailable: !stripeOk,
    },
    {
      metric: { label: 'CPA', value: purchaseVal > 0 ? adSpendVal / purchaseVal : 0, format: 'currency', tooltip: 'Cost per acquisition. Ad spend divided by purchases. Must stay below $297 to be profitable.' },
      unavailable: !stripeOk || !metaOk,
    },
    {
      metric: { label: 'ROAS', value: adSpendVal > 0 ? revenueVal / adSpendVal : 0, format: 'number', tooltip: 'Return on ad spend. Revenue per dollar of ads. Above 3x is healthy for a $297 product.' },
      unavailable: !stripeOk || !metaOk,
    },
    {
      metric: { ...(ads?.spend ?? { label: 'Ad Spend', value: 0, format: 'currency' }), tooltip: 'Total Meta Ads spend in this period.' },
      unavailable: !metaOk,
    },
    // Row 2
    {
      metric: { ...(emailKpis?.find((k) => k.label === 'Subscribers') ?? { label: 'Email Subscribers', value: 0, format: 'number' }), tooltip: 'Total ConvertKit subscribers. Your owned audience — not dependent on ad platforms.' },
      unavailable: !convertkitOk,
    },
    {
      metric: { label: 'Signup Rate', value: visitorsVal > 0 ? (signupsVal / visitorsVal) * 100 : 0, format: 'percent', tooltip: 'Percent of visitors who subscribe. Measures how compelling your lead magnet is.' },
      unavailable: !plausibleOk || !convertkitOk,
    },
    {
      metric: { label: 'CPL', value: signupsVal > 0 ? adSpendVal / signupsVal : 0, format: 'currency', tooltip: 'Cost per lead. What you pay in ads for each email subscriber. Lower is better.' },
      unavailable: !metaOk || !convertkitOk,
    },
    {
      metric: { label: 'Email→Purchase %', value: totalSubscribers > 0 ? (purchaseVal / totalSubscribers) * 100 : 0, format: 'percent', tooltip: 'Percent of your email list that purchased. Highest-leverage metric — more revenue with zero extra ad spend.' },
      unavailable: !stripeOk || !convertkitOk,
    },
    {
      metric: { label: 'Time to Purchase', value: dbData?.averageTimeToPurchase ?? 0, format: 'number', tooltip: 'Average days from signup to purchase. Tells you how long your nurture sequence needs to be.' },
      unavailable: !dbData,
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
        <ChartContainer title="Revenue Over Time" unavailable={!stripeOk && !loading} tooltip="Daily revenue trend. Look for patterns around email sends and ad campaigns.">
          <RevenueChart data={revSeries} loading={loading} />
        </ChartContainer>
        <ChartContainer title="Funnel" tooltip="Conversion funnel from visitor to purchase. Biggest drop-off = biggest opportunity.">
          <FunnelChart steps={funnelSteps} loading={loading} />
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartContainer title="Landing Page Variants" unavailable={!plausibleOk && !loading} tooltip="A/B/C test results. Higher conversion rate = better headline/copy combo.">
          <VariantComparisonChart data={variantsData} loading={loading} />
        </ChartContainer>
        <ChartContainer title="Email Performance" unavailable={!convertkitOk && !loading} tooltip="Open and click rates over time. Declining rates may signal list fatigue.">
          <EmailPerformanceChart data={[]} loading={loading} />
        </ChartContainer>
      </div>

      <ChartContainer title="Weekly Report" tooltip="Snapshot of the week's key numbers across all channels.">
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
