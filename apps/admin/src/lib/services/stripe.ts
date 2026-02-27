import type { ServiceResult, RevenueDataPoint, KpiMetric } from '@gyp/shared';
import { getCached, setCache, TTL } from '../cache';

const STRIPE_BASE = 'https://api.stripe.com/v1';

type StripeCharge = {
  id: string;
  amount: number;
  currency: string;
  created: number;
  refunded: boolean;
  status: string;
};

type StripeListResponse = {
  data: StripeCharge[];
  has_more: boolean;
};

type StripeMetrics = {
  revenue: KpiMetric;
  purchases: KpiMetric;
  refundRate: KpiMetric;
};

function getSecretKey(): string | null {
  return process.env.STRIPE_SECRET_KEY ?? null;
}

async function stripeGet(path: string, params: Record<string, string>): Promise<Response> {
  const key = getSecretKey();
  if (!key) throw new Error('Stripe API key not configured');

  const url = new URL(`${STRIPE_BASE}${path}`);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  return fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${key}`,
    },
  });
}

async function fetchAllCharges(fromUnix: number, toUnix: number): Promise<StripeCharge[]> {
  const charges: StripeCharge[] = [];
  let startingAfter: string | undefined;

  for (;;) {
    const params: Record<string, string> = {
      'created[gte]': String(fromUnix),
      'created[lte]': String(toUnix),
      limit: '100',
    };
    if (startingAfter) {
      params.starting_after = startingAfter;
    }

    const res = await stripeGet('/charges', params);
    if (!res.ok) {
      throw new Error(`Stripe API error: ${res.status} ${res.statusText}`);
    }

    const body = (await res.json()) as StripeListResponse;
    charges.push(...body.data);

    if (!body.has_more || body.data.length === 0) break;
    startingAfter = body.data[body.data.length - 1]!.id;
  }

  return charges;
}

function toUnix(isoDate: string): number {
  return Math.floor(new Date(isoDate).getTime() / 1000);
}

function toDayKey(unixTs: number): string {
  return new Date(unixTs * 1000).toISOString().split('T')[0]!;
}

export async function getStripeMetrics(from: string, to: string): Promise<ServiceResult<StripeMetrics>> {
  if (!getSecretKey()) {
    return { status: 'unavailable', error: 'Stripe API key not configured' };
  }

  const cacheKey = `stripe:metrics:${from}:${to}`;
  const cached = getCached<StripeMetrics>(cacheKey);
  if (cached) return { status: 'ok', data: cached };

  try {
    const charges = await fetchAllCharges(toUnix(from), toUnix(to));

    const succeeded = charges.filter((c) => c.status === 'succeeded');
    const refunded = succeeded.filter((c) => c.refunded);
    const totalRevenue = succeeded.reduce((sum, c) => sum + c.amount, 0) / 100;
    const purchaseCount = succeeded.length;
    const refundCount = refunded.length;
    const refundRate = purchaseCount > 0 ? (refundCount / purchaseCount) * 100 : 0;

    const data: StripeMetrics = {
      revenue: {
        label: 'Revenue',
        value: totalRevenue,
        format: 'currency',
      },
      purchases: {
        label: 'Purchases',
        value: purchaseCount,
        format: 'number',
      },
      refundRate: {
        label: 'Refund Rate',
        value: refundRate,
        format: 'percent',
      },
    };

    setCache(cacheKey, data, TTL.STRIPE);
    return { status: 'ok', data };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown Stripe error';
    return { status: 'unavailable', error: message };
  }
}

export async function getRevenueSeries(from: string, to: string): Promise<ServiceResult<RevenueDataPoint[]>> {
  if (!getSecretKey()) {
    return { status: 'unavailable', error: 'Stripe API key not configured' };
  }

  const cacheKey = `stripe:revenue-series:${from}:${to}`;
  const cached = getCached<RevenueDataPoint[]>(cacheKey);
  if (cached) return { status: 'ok', data: cached };

  try {
    const charges = await fetchAllCharges(toUnix(from), toUnix(to));
    const succeeded = charges.filter((c) => c.status === 'succeeded');

    // Build a map of day -> { revenue, purchases }
    const dayMap = new Map<string, { revenue: number; purchases: number }>();

    // Pre-fill all days in range
    const startDate = new Date(from);
    const endDate = new Date(to);
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().split('T')[0]!;
      dayMap.set(key, { revenue: 0, purchases: 0 });
    }

    for (const charge of succeeded) {
      const key = toDayKey(charge.created);
      const entry = dayMap.get(key);
      if (entry) {
        entry.revenue += charge.amount / 100;
        entry.purchases += 1;
      }
    }

    const data: RevenueDataPoint[] = Array.from(dayMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, vals]) => ({
        date,
        revenue: Math.round(vals.revenue * 100) / 100,
        purchases: vals.purchases,
      }));

    setCache(cacheKey, data, TTL.STRIPE);
    return { status: 'ok', data };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown Stripe error';
    return { status: 'unavailable', error: message };
  }
}
