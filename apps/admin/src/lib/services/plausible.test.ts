import { describe, it, expect, vi, beforeEach } from 'vitest';
import { clearCache } from '../cache';

beforeEach(() => {
  clearCache();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('plausible service', () => {
  it('returns unavailable when env vars are missing', async () => {
    vi.stubEnv('PLAUSIBLE_API_KEY', '');
    vi.stubEnv('PLAUSIBLE_SITE_ID', '');
    const { getTrafficMetrics } = await import('./plausible');
    const result = await getTrafficMetrics('2026-01-01', '2026-01-31');
    expect(result.status).toBe('unavailable');
  });

  it('returns unavailable when only one env var is set', async () => {
    vi.stubEnv('PLAUSIBLE_API_KEY', 'key');
    vi.stubEnv('PLAUSIBLE_SITE_ID', '');
    const { getTrafficMetrics } = await import('./plausible');
    const result = await getTrafficMetrics('2026-01-01', '2026-01-31');
    expect(result.status).toBe('unavailable');
  });

  it('returns unavailable on API error', async () => {
    vi.stubEnv('PLAUSIBLE_API_KEY', 'key');
    vi.stubEnv('PLAUSIBLE_SITE_ID', 'site');
    global.fetch = vi.fn().mockRejectedValue(new Error('fail'));
    const { getTrafficMetrics } = await import('./plausible');
    const result = await getTrafficMetrics('2026-01-01', '2026-01-31');
    expect(result.status).toBe('unavailable');
  });

  it('getVariantData returns unavailable when env missing', async () => {
    vi.stubEnv('PLAUSIBLE_API_KEY', '');
    vi.stubEnv('PLAUSIBLE_SITE_ID', '');
    const { getVariantData } = await import('./plausible');
    const result = await getVariantData('2026-01-01', '2026-01-31');
    expect(result.status).toBe('unavailable');
  });
});
