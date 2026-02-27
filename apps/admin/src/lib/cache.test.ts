import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getCached, setCache, clearCache } from './cache';

beforeEach(() => {
  clearCache();
});

describe('cache', () => {
  it('returns null for missing keys', () => {
    expect(getCached('nonexistent')).toBeNull();
  });

  it('stores and retrieves values', () => {
    setCache('test-key', { value: 42 }, 60_000);
    expect(getCached('test-key')).toEqual({ value: 42 });
  });

  it('returns null for expired entries', () => {
    vi.useFakeTimers();
    setCache('expires', 'data', 1000);
    expect(getCached('expires')).toBe('data');

    vi.advanceTimersByTime(1001);
    expect(getCached('expires')).toBeNull();
    vi.useRealTimers();
  });

  it('clears all entries', () => {
    setCache('a', 1, 60_000);
    setCache('b', 2, 60_000);
    clearCache();
    expect(getCached('a')).toBeNull();
    expect(getCached('b')).toBeNull();
  });

  it('clears entries by prefix', () => {
    setCache('stripe:metrics', 1, 60_000);
    setCache('stripe:series', 2, 60_000);
    setCache('plausible:traffic', 3, 60_000);
    clearCache('stripe');
    expect(getCached('stripe:metrics')).toBeNull();
    expect(getCached('stripe:series')).toBeNull();
    expect(getCached('plausible:traffic')).toBe(3);
  });
});
