interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of items in cache
}

class MemoryCache {
  private cache = new Map<string, CacheItem<any>>();
  private defaultTTL: number;
  private maxSize: number;

  constructor(options: CacheOptions = {}) {
    this.defaultTTL = options.ttl || 5 * 60 * 1000; // Default 5 minutes
    this.maxSize = options.maxSize || 100; // Default max 100 items
  }

  /**
   * Get an item from cache
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // Check if item has expired
    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  /**
   * Set an item in cache
   */
  set<T>(key: string, data: T, ttl?: number): void {
    // If cache is at max size, remove oldest item
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    };

    this.cache.set(key, item);
  }

  /**
   * Check if a key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Delete a specific key from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clear expired entries
   */
  clearExpired(): number {
    const now = Date.now();
    let clearedCount = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
        clearedCount++;
      }
    }

    return clearedCount;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      defaultTTL: this.defaultTTL,
    };
  }

  /**
   * Get all cache keys
   */
  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }
}

// Create a singleton instance for the application
const apiCache = new MemoryCache({
  ttl: 5 * 60 * 1000, // 5 minutes for API responses
  maxSize: 50, // Store up to 50 different API responses
});

/**
 * Generic cache wrapper for async functions
 */
export async function withCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: { ttl?: number; forceRefresh?: boolean } = {},
): Promise<T> {
  const { ttl, forceRefresh = false } = options;

  // Check cache first (unless force refresh is requested)
  if (!forceRefresh) {
    const cached = apiCache.get<T>(key);
    if (cached !== null) {
      return cached;
    }
  }

  try {
    // Fetch fresh data
    const data = await fetchFn();

    // Store in cache
    apiCache.set(key, data, ttl);

    return data;
  } catch (error) {
    // If fetch fails and we have cached data (even if expired), return it
    const cached = apiCache.get<T>(key);
    if (cached !== null) {
      console.warn(`API call failed, returning cached data for key: ${key}`);
      return cached;
    }

    // If no cached data available, re-throw the error
    throw error;
  }
}

/**
 * Cache management functions
 */
export const cacheManager = {
  /**
   * Clear all cached data
   */
  clearAll: () => apiCache.clear(),

  /**
   * Clear specific cache entry
   */
  clear: (key: string) => apiCache.delete(key),

  /**
   * Clear expired entries
   */
  clearExpired: () => apiCache.clearExpired(),

  /**
   * Get cache statistics
   */
  getStats: () => apiCache.getStats(),

  /**
   * Get all cache keys
   */
  getKeys: () => apiCache.getKeys(),

  /**
   * Check if key exists in cache
   */
  has: (key: string) => apiCache.has(key),
};

// Auto-cleanup expired entries every 10 minutes
if (typeof window !== "undefined") {
  setInterval(
    () => {
      const cleared = apiCache.clearExpired();
      if (cleared > 0) {
        console.log(`Cache cleanup: removed ${cleared} expired entries`);
      }
    },
    10 * 60 * 1000,
  );
}

export { apiCache };
