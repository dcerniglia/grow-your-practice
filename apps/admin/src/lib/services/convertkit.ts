import type { ServiceResult, EmailMetricDataPoint, KpiMetric } from '@gyp/shared';
import { getCached, setCache, TTL } from '../cache';

const BASE_URL = 'https://api.convertkit.com/v3';

type TagBreakdown = { tag: string; count: number };

type ConvertKitMetrics = {
  kpis: KpiMetric[];
  growth: EmailMetricDataPoint[];
  tags: TagBreakdown[];
};

type SubscribersResponse = {
  total_subscribers: number;
  subscribers: Array<{
    id: number;
    created_at: string;
    email_address: string;
    state: string;
  }>;
};

type TagResponse = {
  tags: Array<{
    id: number;
    name: string;
    created_at: string;
  }>;
};

type TagSubscribersResponse = {
  total_subscribers: number;
};

function getSecret(): string | null {
  return process.env.CONVERTKIT_API_SECRET ?? null;
}

async function ckFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const secret = getSecret();
  if (!secret) throw new Error('CONVERTKIT_API_SECRET not configured');

  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set('api_secret', secret);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`ConvertKit API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export async function getEmailMetrics(
  from: string,
  to: string,
): Promise<ServiceResult<KpiMetric[]>> {
  if (!getSecret()) {
    return { status: 'unavailable', error: 'ConvertKit API secret not configured' };
  }

  const cacheKey = `ck:kpis:${from}:${to}`;
  const cached = getCached<KpiMetric[]>(cacheKey);
  if (cached) return { status: 'ok', data: cached };

  try {
    const [allSubs, periodSubs] = await Promise.all([
      ckFetch<SubscribersResponse>('/subscribers', { page: '1' }),
      ckFetch<SubscribersResponse>('/subscribers', { from, to }),
    ]);

    const totalSubscribers = allSubs.total_subscribers;
    const newSubscribers = periodSubs.total_subscribers;

    // ConvertKit v3 doesn't expose aggregate open/click/unsub rates directly.
    // These would come from broadcast stats in a production integration.
    // For now we return subscriber-based KPIs.
    const kpis: KpiMetric[] = [
      {
        label: 'Subscribers',
        value: totalSubscribers,
        format: 'number',
      },
      {
        label: 'New Subscribers',
        value: newSubscribers,
        format: 'number',
      },
      {
        label: 'Open Rate',
        value: 'N/A',
      },
      {
        label: 'Click Rate',
        value: 'N/A',
      },
    ];

    setCache(cacheKey, kpis, TTL.CONVERTKIT);
    return { status: 'ok', data: kpis };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown ConvertKit error';
    return { status: 'unavailable', error: message };
  }
}

export async function getSubscriberGrowth(
  from: string,
  to: string,
): Promise<ServiceResult<EmailMetricDataPoint[]>> {
  if (!getSecret()) {
    return { status: 'unavailable', error: 'ConvertKit API secret not configured' };
  }

  const cacheKey = `ck:growth:${from}:${to}`;
  const cached = getCached<EmailMetricDataPoint[]>(cacheKey);
  if (cached) return { status: 'ok', data: cached };

  try {
    const res = await ckFetch<SubscribersResponse>('/subscribers', {
      from,
      to,
      sort_order: 'asc',
    });

    // Build daily subscriber counts from the returned subscribers
    const dailyMap = new Map<string, number>();
    const start = new Date(from);
    const end = new Date(to);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dailyMap.set(d.toISOString().split('T')[0]!, 0);
    }

    for (const sub of res.subscribers) {
      const day = sub.created_at.split('T')[0]!;
      if (dailyMap.has(day)) {
        dailyMap.set(day, (dailyMap.get(day) ?? 0) + 1);
      }
    }

    // Accumulate running total for subscriber count per day
    let running = 0;
    const dataPoints: EmailMetricDataPoint[] = [];
    for (const [date, newCount] of dailyMap) {
      running += newCount;
      dataPoints.push({
        date,
        subscribers: running,
        // Open/click rates approximated; ConvertKit doesn't provide daily rate breakdowns
        openRate: 0,
        clickRate: 0,
      });
    }

    setCache(cacheKey, dataPoints, TTL.CONVERTKIT);
    return { status: 'ok', data: dataPoints };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown ConvertKit error';
    return { status: 'unavailable', error: message };
  }
}

export async function getTagBreakdown(): Promise<ServiceResult<TagBreakdown[]>> {
  if (!getSecret()) {
    return { status: 'unavailable', error: 'ConvertKit API secret not configured' };
  }

  const cacheKey = 'ck:tags';
  const cached = getCached<TagBreakdown[]>(cacheKey);
  if (cached) return { status: 'ok', data: cached };

  try {
    const tagsRes = await ckFetch<TagResponse>('/tags');

    // Fetch subscriber count for each tag
    const tagBreakdown: TagBreakdown[] = await Promise.all(
      tagsRes.tags.map(async (tag) => {
        const subRes = await ckFetch<TagSubscribersResponse>(
          `/tags/${tag.id}/subscriptions`,
          { page: '1' },
        );
        return {
          tag: tag.name,
          count: subRes.total_subscribers ?? 0,
        };
      }),
    );

    // Sort descending by count
    tagBreakdown.sort((a, b) => b.count - a.count);

    setCache(cacheKey, tagBreakdown, TTL.CONVERTKIT);
    return { status: 'ok', data: tagBreakdown };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown ConvertKit error';
    return { status: 'unavailable', error: message };
  }
}

export async function getAllConvertKitData(
  from: string,
  to: string,
): Promise<ServiceResult<ConvertKitMetrics>> {
  const [kpisResult, growthResult, tagsResult] = await Promise.all([
    getEmailMetrics(from, to),
    getSubscriberGrowth(from, to),
    getTagBreakdown(),
  ]);

  if (kpisResult.status === 'unavailable') {
    return { status: 'unavailable', error: kpisResult.error };
  }

  return {
    status: 'ok',
    data: {
      kpis: kpisResult.data,
      growth: growthResult.status === 'ok' ? growthResult.data : [],
      tags: tagsResult.status === 'ok' ? tagsResult.data : [],
    },
  };
}
