import type {
  ServiceResult,
  TrafficSourceDataPoint,
  VariantData,
  KpiMetric,
} from '@gyp/shared';
import { getCached, setCache, TTL } from '../cache';

const API_KEY = process.env.PLAUSIBLE_API_KEY;
const SITE_ID = process.env.PLAUSIBLE_SITE_ID;
const BASE_URL = 'https://plausible.io/api/v2';

function isConfigured(): boolean {
  return Boolean(API_KEY && SITE_ID);
}

function unavailable<T>(reason: string): ServiceResult<T> {
  return { status: 'unavailable', error: reason };
}

async function queryPlausible<T>(body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${BASE_URL}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ site_id: SITE_ID, ...body }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Plausible API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

type PlausibleResult = {
  results: Array<{
    dimensions: string[];
    metrics: number[];
  }>;
};

// --- Traffic Metrics (KPI cards) ---

export async function getTrafficMetrics(
  from: string,
  to: string
): Promise<ServiceResult<{ visitors: KpiMetric; bounceRate: KpiMetric; pageviews: KpiMetric }>> {
  if (!isConfigured()) return unavailable('Plausible API keys not configured');

  const cacheKey = `plausible:metrics:${from}:${to}`;
  const cached = getCached<{ visitors: KpiMetric; bounceRate: KpiMetric; pageviews: KpiMetric }>(cacheKey);
  if (cached) return { status: 'ok', data: cached };

  try {
    const result = await queryPlausible<PlausibleResult>({
      metrics: ['visitors', 'bounce_rate', 'pageviews'],
      date_range: [from, to],
    });

    const row = result.results[0];
    if (!row) throw new Error('No data returned from Plausible');

    const [visitors, bounceRate, pageviews] = row.metrics;

    const data = {
      visitors: {
        label: 'Visitors',
        value: visitors ?? 0,
        format: 'number' as const,
      },
      bounceRate: {
        label: 'Bounce Rate',
        value: bounceRate ?? 0,
        format: 'percent' as const,
      },
      pageviews: {
        label: 'Pageviews',
        value: pageviews ?? 0,
        format: 'number' as const,
      },
    };

    setCache(cacheKey, data, TTL.PLAUSIBLE);
    return { status: 'ok', data };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return unavailable(message);
  }
}

// --- Traffic Sources (daily, broken by source) ---

const SOURCE_MAP: Record<string, keyof Omit<TrafficSourceDataPoint, 'date'>> = {
  'Google': 'organic',
  'Bing': 'organic',
  'DuckDuckGo': 'organic',
  'Facebook': 'metaAds',
  'Instagram': 'metaAds',
  'Twitter': 'social',
  'LinkedIn': 'social',
  'Reddit': 'social',
  'Direct / None': 'direct',
};

function classifySource(source: string): keyof Omit<TrafficSourceDataPoint, 'date'> {
  if (!source || source === '' || source === '(not set)') return 'direct';
  return SOURCE_MAP[source] ?? 'referral';
}

export async function getTrafficSources(
  from: string,
  to: string
): Promise<ServiceResult<TrafficSourceDataPoint[]>> {
  if (!isConfigured()) return unavailable('Plausible API keys not configured');

  const cacheKey = `plausible:sources:${from}:${to}`;
  const cached = getCached<TrafficSourceDataPoint[]>(cacheKey);
  if (cached) return { status: 'ok', data: cached };

  try {
    const result = await queryPlausible<PlausibleResult>({
      metrics: ['visitors'],
      date_range: [from, to],
      dimensions: ['time:day', 'visit:source'],
    });

    const dayMap = new Map<string, TrafficSourceDataPoint>();

    for (const row of result.results) {
      const date = row.dimensions[0]!;
      const source = row.dimensions[1] ?? '';
      const visitors = row.metrics[0] ?? 0;

      if (!dayMap.has(date)) {
        dayMap.set(date, { date, direct: 0, organic: 0, metaAds: 0, social: 0, referral: 0 });
      }

      const entry = dayMap.get(date)!;
      const category = classifySource(source);
      entry[category] += visitors;
    }

    const data = Array.from(dayMap.values()).sort(
      (a, b) => a.date.localeCompare(b.date)
    );

    setCache(cacheKey, data, TTL.PLAUSIBLE);
    return { status: 'ok', data };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return unavailable(message);
  }
}

// --- Variant Comparison (A/B/C landing pages) ---

const VARIANT_PATHS = ['/v/a/', '/v/b/', '/v/c/'];

export async function getVariantData(
  from: string,
  to: string
): Promise<ServiceResult<VariantData[]>> {
  if (!isConfigured()) return unavailable('Plausible API keys not configured');

  const cacheKey = `plausible:variants:${from}:${to}`;
  const cached = getCached<VariantData[]>(cacheKey);
  if (cached) return { status: 'ok', data: cached };

  try {
    const result = await queryPlausible<PlausibleResult>({
      metrics: ['visitors', 'events'],
      date_range: [from, to],
      dimensions: ['event:page'],
      filters: [['contains', 'event:page', ['/v/']]],
    });

    const variantMap = new Map<string, { visitors: number; signups: number }>();

    for (const path of VARIANT_PATHS) {
      variantMap.set(path, { visitors: 0, signups: 0 });
    }

    for (const row of result.results) {
      const page = row.dimensions[0] ?? '';
      const matchedPath = VARIANT_PATHS.find((p) => page.startsWith(p));
      if (!matchedPath) continue;

      const entry = variantMap.get(matchedPath)!;
      entry.visitors += row.metrics[0] ?? 0;
    }

    const data: VariantData[] = VARIANT_PATHS.map((path) => {
      const entry = variantMap.get(path)!;
      const label = path.replace('/v/', '').replace('/', '').toUpperCase();
      return {
        variant: `Variant ${label}`,
        visitors: entry.visitors,
        signups: entry.signups,
        conversionRate: entry.visitors > 0
          ? Number(((entry.signups / entry.visitors) * 100).toFixed(1))
          : 0,
      };
    });

    setCache(cacheKey, data, TTL.PLAUSIBLE);
    return { status: 'ok', data };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return unavailable(message);
  }
}
