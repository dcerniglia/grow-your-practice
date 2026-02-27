import { getStripeMetrics } from './stripe';
import { getTrafficMetrics } from './plausible';
import { getEmailMetrics } from './convertkit';
import { getAdMetrics } from './meta-ads';
import { getDatabaseMetrics } from './database';

function numVal(v: unknown): number {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const n = Number(v);
    return Number.isNaN(n) ? 0 : n;
  }
  return 0;
}

export async function captureDaily(dateStr: string): Promise<{ date: string; ok: boolean; errors: string[] }> {
  const { PrismaClient } = await import('@gyp/database');
  const prisma = new PrismaClient();
  const errors: string[] = [];

  // All services take from/to as YYYY-MM-DD
  const from = dateStr;
  const to = dateStr;

  const [stripe, traffic, email, ads, db] = await Promise.all([
    getStripeMetrics(from, to).catch((e) => {
      errors.push(`stripe: ${e}`);
      return null;
    }),
    getTrafficMetrics(from, to).catch((e) => {
      errors.push(`plausible: ${e}`);
      return null;
    }),
    getEmailMetrics(from, to).catch((e) => {
      errors.push(`convertkit: ${e}`);
      return null;
    }),
    getAdMetrics(from, to).catch((e) => {
      errors.push(`meta-ads: ${e}`);
      return null;
    }),
    getDatabaseMetrics().catch((e) => {
      errors.push(`database: ${e}`);
      return null;
    }),
  ]);

  // Extract values from ServiceResult wrappers
  const revenue = stripe?.status === 'ok' ? numVal(stripe.data.revenue.value) : 0;
  const purchases = stripe?.status === 'ok' ? numVal(stripe.data.purchases.value) : 0;
  const refundRate = stripe?.status === 'ok' ? numVal(stripe.data.refundRate.value) : 0;

  const visitors = traffic?.status === 'ok' ? numVal(traffic.data.visitors.value) : 0;
  const pageviews = traffic?.status === 'ok' ? numVal(traffic.data.pageviews.value) : 0;
  const bounceRate = traffic?.status === 'ok' ? numVal(traffic.data.bounceRate.value) : 0;

  // ConvertKit returns an array of KpiMetrics
  let subscribers = 0;
  let newSubscribers = 0;
  if (email?.status === 'ok') {
    for (const kpi of email.data) {
      if (kpi.label === 'Subscribers') subscribers = numVal(kpi.value);
      if (kpi.label === 'New Subscribers') newSubscribers = numVal(kpi.value);
    }
  }

  const adSpend = ads?.status === 'ok' ? numVal(ads.data.spend.value) : 0;
  // Meta KPIs don't include raw clicks/impressions — derive from CTR/CPC if needed
  // For now store 0; the campaign-level endpoint has these but the KPI endpoint doesn't
  const adClicks = 0;
  const adImpressions = 0;

  const totalUsers = db?.status === 'ok' ? db.data.totalUsers : 0;
  const purchasedUsers = db?.status === 'ok' ? db.data.purchasedUsers : 0;
  const avgTimeToPurchase = db?.status === 'ok' ? db.data.averageTimeToPurchase : 0;

  // Computed metrics
  const cpa = purchases > 0 ? adSpend / purchases : 0;
  const roas = adSpend > 0 ? revenue / adSpend : 0;
  const cpl = newSubscribers > 0 ? adSpend / newSubscribers : 0;
  const signupRate = visitors > 0 ? (newSubscribers / visitors) * 100 : 0;
  const emailPurchaseRate = subscribers > 0 ? (purchases / subscribers) * 100 : 0;

  const snapshotDate = new Date(`${dateStr}T00:00:00.000Z`);

  await prisma.dailySnapshot.upsert({
    where: { date: snapshotDate },
    create: {
      date: snapshotDate,
      revenue, purchases, refundRate,
      visitors, pageviews, bounceRate,
      subscribers, newSubscribers,
      adSpend, adClicks, adImpressions,
      cpa, roas, cpl, signupRate, emailPurchaseRate,
      totalUsers, purchasedUsers, avgTimeToPurchase,
    },
    update: {
      revenue, purchases, refundRate,
      visitors, pageviews, bounceRate,
      subscribers, newSubscribers,
      adSpend, adClicks, adImpressions,
      cpa, roas, cpl, signupRate, emailPurchaseRate,
      totalUsers, purchasedUsers, avgTimeToPurchase,
    },
  });

  await prisma.$disconnect();

  return { date: dateStr, ok: errors.length === 0, errors };
}

export async function getSnapshots(from: string, to: string) {
  const { PrismaClient } = await import('@gyp/database');
  const prisma = new PrismaClient();

  const snapshots = await prisma.dailySnapshot.findMany({
    where: {
      date: {
        gte: new Date(`${from}T00:00:00.000Z`),
        lte: new Date(`${to}T00:00:00.000Z`),
      },
    },
    orderBy: { date: 'asc' },
  });

  await prisma.$disconnect();
  return snapshots;
}
