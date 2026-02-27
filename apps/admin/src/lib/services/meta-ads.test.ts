import { describe, it, expect, vi, beforeEach } from 'vitest';
import { clearCache } from '../cache';

beforeEach(() => {
  clearCache();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('meta-ads service', () => {
  it('returns unavailable when env vars are missing', async () => {
    vi.stubEnv('META_ACCESS_TOKEN', '');
    vi.stubEnv('META_AD_ACCOUNT_ID', '');
    const { getAdMetrics } = await import('./meta-ads');
    const result = await getAdMetrics('2026-01-01', '2026-01-31');
    expect(result.status).toBe('unavailable');
  });

  it('returns unavailable when only token is set', async () => {
    vi.stubEnv('META_ACCESS_TOKEN', 'token');
    vi.stubEnv('META_AD_ACCOUNT_ID', '');
    const { getAdMetrics } = await import('./meta-ads');
    const result = await getAdMetrics('2026-01-01', '2026-01-31');
    expect(result.status).toBe('unavailable');
  });

  it('returns unavailable on API error', async () => {
    vi.stubEnv('META_ACCESS_TOKEN', 'token');
    vi.stubEnv('META_AD_ACCOUNT_ID', 'act_123');
    global.fetch = vi.fn().mockRejectedValue(new Error('fail'));
    const { getAdMetrics } = await import('./meta-ads');
    const result = await getAdMetrics('2026-01-01', '2026-01-31');
    expect(result.status).toBe('unavailable');
  });

  it('getCampaigns returns unavailable when env missing', async () => {
    vi.stubEnv('META_ACCESS_TOKEN', '');
    vi.stubEnv('META_AD_ACCOUNT_ID', '');
    const { getCampaigns } = await import('./meta-ads');
    const result = await getCampaigns('2026-01-01', '2026-01-31');
    expect(result.status).toBe('unavailable');
  });
});
