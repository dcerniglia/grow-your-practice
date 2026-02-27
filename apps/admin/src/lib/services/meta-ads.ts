import type { ServiceResult, KpiMetric, CampaignData } from '@gyp/shared';
import { getCached, setCache, TTL } from '../cache';

const META_BASE = 'https://graph.facebook.com/v21.0';

type MetaInsightRow = {
  campaign_id: string;
  campaign_name: string;
  spend: string;
  impressions: string;
  clicks: string;
  ctr: string;
  cpc: string;
  actions?: { action_type: string; value: string }[];
  date_start: string;
  date_stop: string;
};

type MetaInsightsResponse = {
  data: MetaInsightRow[];
  paging?: { next?: string };
};

type AdMetrics = {
  spend: KpiMetric;
  ctr: KpiMetric;
  cpc: KpiMetric;
};

function getAccessToken(): string | null {
  return process.env.META_ACCESS_TOKEN ?? null;
}

function getAdAccountId(): string | null {
  return process.env.META_AD_ACCOUNT_ID ?? null;
}

async function metaGet(path: string, params: Record<string, string>): Promise<Response> {
  const token = getAccessToken();
  if (!token) throw new Error('Meta access token not configured');

  const url = new URL(`${META_BASE}${path}`);
  url.searchParams.set('access_token', token);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  return fetch(url.toString());
}

function extractConversions(actions?: { action_type: string; value: string }[]): number {
  if (!actions) return 0;
  const conversionTypes = [
    'offsite_conversion.fb_pixel_lead',
    'offsite_conversion.fb_pixel_purchase',
    'lead',
    'purchase',
  ];
  return actions
    .filter((a) => conversionTypes.includes(a.action_type))
    .reduce((sum, a) => sum + Number(a.value), 0);
}

async function fetchInsights(
  accountId: string,
  from: string,
  to: string,
  extraParams?: Record<string, string>,
): Promise<MetaInsightRow[]> {
  const timeRange = JSON.stringify({ since: from, until: to });
  const params: Record<string, string> = {
    fields: 'campaign_id,campaign_name,spend,impressions,clicks,actions,ctr,cpc',
    time_range: timeRange,
    level: 'campaign',
    ...extraParams,
  };

  const rows: MetaInsightRow[] = [];
  let nextUrl: string | undefined;

  // First request
  const res = await metaGet(`/act_${accountId}/insights`, params);
  if (!res.ok) {
    throw new Error(`Meta API error: ${res.status} ${res.statusText}`);
  }
  const body = (await res.json()) as MetaInsightsResponse;
  rows.push(...body.data);
  nextUrl = body.paging?.next;

  // Paginate
  while (nextUrl) {
    const pageRes = await fetch(nextUrl);
    if (!pageRes.ok) break;
    const pageBody = (await pageRes.json()) as MetaInsightsResponse;
    rows.push(...pageBody.data);
    nextUrl = pageBody.paging?.next;
  }

  return rows;
}

export async function getAdMetrics(from: string, to: string): Promise<ServiceResult<AdMetrics>> {
  const token = getAccessToken();
  const accountId = getAdAccountId();
  if (!token || !accountId) {
    return { status: 'unavailable', error: 'Meta Ads API credentials not configured' };
  }

  const cacheKey = `meta:metrics:${from}:${to}`;
  const cached = getCached<AdMetrics>(cacheKey);
  if (cached) return { status: 'ok', data: cached };

  try {
    const rows = await fetchInsights(accountId, from, to);

    const totalSpend = rows.reduce((sum, r) => sum + Number(r.spend), 0);
    const totalImpressions = rows.reduce((sum, r) => sum + Number(r.impressions), 0);
    const totalClicks = rows.reduce((sum, r) => sum + Number(r.clicks), 0);
    const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const avgCpc = totalClicks > 0 ? totalSpend / totalClicks : 0;

    const data: AdMetrics = {
      spend: {
        label: 'Ad Spend',
        value: totalSpend,
        format: 'currency',
      },
      ctr: {
        label: 'CTR',
        value: avgCtr,
        format: 'percent',
      },
      cpc: {
        label: 'CPC',
        value: avgCpc,
        format: 'currency',
      },
    };

    setCache(cacheKey, data, TTL.META_ADS);
    return { status: 'ok', data };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown Meta Ads error';
    return { status: 'unavailable', error: message };
  }
}

export async function getCampaigns(from: string, to: string): Promise<ServiceResult<CampaignData[]>> {
  const token = getAccessToken();
  const accountId = getAdAccountId();
  if (!token || !accountId) {
    return { status: 'unavailable', error: 'Meta Ads API credentials not configured' };
  }

  const cacheKey = `meta:campaigns:${from}:${to}`;
  const cached = getCached<CampaignData[]>(cacheKey);
  if (cached) return { status: 'ok', data: cached };

  try {
    // Fetch aggregate campaign data
    const rows = await fetchInsights(accountId, from, to);

    // Fetch daily breakdown for sparklines
    const dailyRows = await fetchInsights(accountId, from, to, { time_increment: '1' });

    // Group daily spend by campaign_id
    const dailyByCampaign = new Map<string, Map<string, number>>();
    for (const row of dailyRows) {
      let dayMap = dailyByCampaign.get(row.campaign_id);
      if (!dayMap) {
        dayMap = new Map<string, number>();
        dailyByCampaign.set(row.campaign_id, dayMap);
      }
      dayMap.set(row.date_start, Number(row.spend));
    }

    // Build sorted date keys for sparkline ordering
    const allDates = new Set<string>();
    for (const dayMap of dailyByCampaign.values()) {
      for (const date of dayMap.keys()) {
        allDates.add(date);
      }
    }
    const sortedDates = Array.from(allDates).sort();

    const campaigns: CampaignData[] = rows.map((row) => {
      const spend = Number(row.spend);
      const impressions = Number(row.impressions);
      const clicks = Number(row.clicks);
      const ctr = Number(row.ctr);
      const cpc = Number(row.cpc);
      const conversions = extractConversions(row.actions);
      const cpa = conversions > 0 ? spend / conversions : 0;

      // Build sparkline from daily data
      const dayMap = dailyByCampaign.get(row.campaign_id);
      const sparklineData = sortedDates.map((date) => dayMap?.get(date) ?? 0);

      // Determine status based on spend activity
      let status: CampaignData['status'] = 'completed';
      if (sparklineData.length > 0 && sparklineData[sparklineData.length - 1]! > 0) {
        status = 'active';
      } else if (spend > 0 && sparklineData.some((v) => v > 0)) {
        status = 'paused';
      }

      return {
        id: row.campaign_id,
        name: row.campaign_name,
        status,
        spend,
        impressions,
        clicks,
        ctr,
        cpc,
        conversions,
        cpa,
        sparklineData,
      };
    });

    setCache(cacheKey, campaigns, TTL.META_ADS);
    return { status: 'ok', data: campaigns };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown Meta Ads error';
    return { status: 'unavailable', error: message };
  }
}
