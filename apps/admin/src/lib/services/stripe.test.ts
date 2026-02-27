import { describe, it, expect, vi, beforeEach } from 'vitest';
import { clearCache } from '../cache';

beforeEach(() => {
  clearCache();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('stripe service', () => {
  it('returns unavailable when STRIPE_SECRET_KEY is not set', async () => {
    vi.stubEnv('STRIPE_SECRET_KEY', '');
    // Re-import to pick up env
    const { getStripeMetrics } = await import('./stripe');
    const result = await getStripeMetrics('2026-01-01', '2026-01-31');
    expect(result.status).toBe('unavailable');
  });

  it('returns unavailable when API call fails', async () => {
    vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_fake');
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
    const { getStripeMetrics } = await import('./stripe');
    const result = await getStripeMetrics('2026-01-01', '2026-01-31');
    expect(result.status).toBe('unavailable');
  });

  it('parses successful charge data correctly', async () => {
    vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_fake');
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        has_more: false,
        data: [
          {
            id: 'ch_1',
            amount: 29700,
            currency: 'usd',
            created: Math.floor(new Date('2026-01-15').getTime() / 1000),
            status: 'succeeded',
            refunded: false,
          },
          {
            id: 'ch_2',
            amount: 29700,
            currency: 'usd',
            created: Math.floor(new Date('2026-01-16').getTime() / 1000),
            status: 'succeeded',
            refunded: true,
          },
        ],
      }),
    });

    const { getStripeMetrics } = await import('./stripe');
    const result = await getStripeMetrics('2026-01-01', '2026-01-31');

    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(Number(result.data.revenue.value)).toBe(594);
      expect(Number(result.data.purchases.value)).toBe(2);
      expect(Number(result.data.refundRate.value)).toBe(50);
    }
  });

  it('returns cached data on second call', async () => {
    vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_fake');
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ has_more: false, data: [] }),
    });
    global.fetch = mockFetch;

    const { getStripeMetrics } = await import('./stripe');
    await getStripeMetrics('2026-01-01', '2026-01-31');
    await getStripeMetrics('2026-01-01', '2026-01-31');

    // fetch should only be called once (second call uses cache)
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('getRevenueSeries returns daily data points', async () => {
    vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_fake');
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        has_more: false,
        data: [
          {
            id: 'ch_1',
            amount: 29700,
            currency: 'usd',
            created: Math.floor(new Date('2026-01-15').getTime() / 1000),
            status: 'succeeded',
            refunded: false,
          },
        ],
      }),
    });

    const { getRevenueSeries } = await import('./stripe');
    const result = await getRevenueSeries('2026-01-14', '2026-01-16');

    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.data.length).toBe(3); // 14th, 15th, 16th
      const jan15 = result.data.find((d) => d.date === '2026-01-15');
      expect(jan15?.revenue).toBe(297);
      expect(jan15?.purchases).toBe(1);
    }
  });
});
