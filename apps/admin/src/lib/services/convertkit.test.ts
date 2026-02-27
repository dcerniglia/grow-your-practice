import { describe, it, expect, vi, beforeEach } from 'vitest';
import { clearCache } from '../cache';

beforeEach(() => {
  clearCache();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('convertkit service', () => {
  it('returns unavailable when CONVERTKIT_API_SECRET is not set', async () => {
    vi.stubEnv('CONVERTKIT_API_SECRET', '');
    const { getEmailMetrics } = await import('./convertkit');
    const result = await getEmailMetrics('2026-01-01', '2026-01-31');
    expect(result.status).toBe('unavailable');
  });

  it('returns unavailable on API error', async () => {
    vi.stubEnv('CONVERTKIT_API_SECRET', 'secret');
    global.fetch = vi.fn().mockRejectedValue(new Error('fail'));
    const { getEmailMetrics } = await import('./convertkit');
    const result = await getEmailMetrics('2026-01-01', '2026-01-31');
    expect(result.status).toBe('unavailable');
  });

  it('getTagBreakdown returns unavailable when secret missing', async () => {
    vi.stubEnv('CONVERTKIT_API_SECRET', '');
    const { getTagBreakdown } = await import('./convertkit');
    const result = await getTagBreakdown();
    expect(result.status).toBe('unavailable');
  });
});
