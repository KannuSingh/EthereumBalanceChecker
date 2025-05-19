import { BalanceResponse } from '../types';

const CACHE_TTL_SECONDS = 60;

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

// In-memory cache store
class BalanceCache {
  private cache: Map<string, CacheItem<BalanceResponse>> = new Map();
  
  /**
   * Get data from cache if it exists and is not expired
   */
  get(address: string): BalanceResponse | null {
    const normalizedAddress = address.toLowerCase();
    const item = this.cache.get(normalizedAddress);
    
    if (!item) {
      return null;
    }
    
    const now = Date.now();
    const ageInSeconds = (now - item.timestamp) / 1000;
    
    // Check if the cache item has expired
    if (ageInSeconds > CACHE_TTL_SECONDS) {
      // Remove expired item
      this.cache.delete(normalizedAddress);
      return null;
    }
    
    return item.data;
  }
  
  /**
   * Store data in cache with current timestamp
   */
  set(address: string, data: BalanceResponse): void {
    const normalizedAddress = address.toLowerCase();
    this.cache.set(normalizedAddress, {
      data,
      timestamp: Date.now()
    });
  }
  
  /**
   * Clear all items from cache
   */
  clear(): void {
    this.cache.clear();
  }
  
}

export const balanceCache = new BalanceCache();