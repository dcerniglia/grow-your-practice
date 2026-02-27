type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

const store = new Map<string, CacheEntry<unknown>>();

export function getCached<T>(key: string): T | null {
  const entry = store.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.data;
}

export function setCache<T>(key: string, data: T, ttlMs: number): void {
  store.set(key, { data, expiresAt: Date.now() + ttlMs });
}

export function clearCache(prefix?: string): void {
  if (!prefix) {
    store.clear();
    return;
  }
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}

// TTL presets (milliseconds)
export const TTL = {
  STRIPE: 5 * 60 * 1000,      // 5 min
  PLAUSIBLE: 5 * 60 * 1000,   // 5 min
  CONVERTKIT: 15 * 60 * 1000, // 15 min
  META_ADS: 15 * 60 * 1000,   // 15 min
  DATABASE: 1 * 60 * 1000,    // 1 min
} as const;
