/**
 * API 缓存管理器
 * 用于缓存API请求结果，根据请求参数生成唯一缓存键
 * 支持内存缓存和localStorage持久化缓存
 */

class CacheManager {
  constructor(options = {}) {
    // 内存缓存
    this.memoryCache = new Map();
    
    // 是否启用localStorage持久化（默认启用）
    this.enablePersistence = options.enablePersistence !== false;
    
    // 缓存前缀，用于区分不同的应用或版本
    this.cachePrefix = options.cachePrefix || 'api_cache_';
    
    // 默认缓存过期时间（毫秒），null表示永不过期
    // 默认24小时过期
    this.defaultTTL = options.defaultTTL || (24 * 60 * 60 * 1000);
    
    // 从localStorage加载缓存
    if (this.enablePersistence) {
      this.loadFromStorage();
    }
  }

  /**
   * 生成缓存键
   * @param {string} service - 服务名称（如 'polygon', 'coingecko'）
   * @param {Object} params - 请求参数对象
   * @returns {string} 缓存键
   */
  generateCacheKey(service, params) {
    // 将参数对象转换为排序后的字符串，确保参数顺序不影响缓存键
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    
    return `${this.cachePrefix}${service}_${sortedParams}`;
  }

  /**
   * 获取缓存
   * @param {string} service - 服务名称
   * @param {Object} params - 请求参数对象
   * @returns {Object|null} 缓存的数据，如果不存在或已过期则返回null
   */
  get(service, params) {
    const key = this.generateCacheKey(service, params);
    
    // 先从内存缓存获取
    const memoryItem = this.memoryCache.get(key);
    if (memoryItem) {
      // 检查是否过期
      if (this.isExpired(memoryItem)) {
        this.memoryCache.delete(key);
        if (this.enablePersistence) {
          this.removeFromStorage(key);
        }
        return null;
      }
      return memoryItem.data;
    }
    
    // 从localStorage获取
    if (this.enablePersistence) {
      try {
        const storageKey = this.getStorageKey(key);
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const item = JSON.parse(stored);
          // 检查是否过期
          if (this.isExpired(item)) {
            localStorage.removeItem(storageKey);
            return null;
          }
          // 将数据加载到内存缓存
          this.memoryCache.set(key, item);
          return item.data;
        }
      } catch (error) {
        console.error('Error reading from localStorage:', error);
      }
    }
    
    return null;
  }

  /**
   * 设置缓存
   * @param {string} service - 服务名称
   * @param {Object} params - 请求参数对象
   * @param {*} data - 要缓存的数据
   * @param {number|null} ttl - 过期时间（毫秒），null表示使用默认TTL，0表示永不过期
   */
  set(service, params, data, ttl = null) {
    const key = this.generateCacheKey(service, params);
    const expiresAt = ttl === null 
      ? (this.defaultTTL ? Date.now() + this.defaultTTL : null)
      : (ttl === 0 ? null : Date.now() + ttl);
    
    const cacheItem = {
      data: data,
      expiresAt: expiresAt,
      cachedAt: Date.now(),
      service: service,
      params: params
    };
    
    // 保存到内存缓存
    this.memoryCache.set(key, cacheItem);
    
    // 保存到localStorage
    if (this.enablePersistence) {
      try {
        const storageKey = this.getStorageKey(key);
        localStorage.setItem(storageKey, JSON.stringify(cacheItem));
      } catch (error) {
        // localStorage可能已满或不可用
        console.warn('Failed to save to localStorage:', error);
        // 尝试清理一些旧缓存
        this.cleanupStorage();
        try {
          const storageKey = this.getStorageKey(key);
          localStorage.setItem(storageKey, JSON.stringify(cacheItem));
        } catch (retryError) {
          console.error('Failed to save to localStorage after cleanup:', retryError);
        }
      }
    }
  }

  /**
   * 检查缓存项是否过期
   * @param {Object} item - 缓存项
   * @returns {boolean} 是否过期
   */
  isExpired(item) {
    if (!item.expiresAt) {
      return false; // 永不过期
    }
    return Date.now() > item.expiresAt;
  }

  /**
   * 删除缓存
   * @param {string} service - 服务名称
   * @param {Object} params - 请求参数对象
   */
  delete(service, params) {
    const key = this.generateCacheKey(service, params);
    this.memoryCache.delete(key);
    
    if (this.enablePersistence) {
      this.removeFromStorage(key);
    }
  }

  /**
   * 清空所有缓存
   * @param {string} service - 可选，如果提供则只清空该服务的缓存
   */
  clear(service = null) {
    if (service) {
      // 只清空特定服务的缓存
      const keysToDelete = [];
      for (const [key, item] of this.memoryCache.entries()) {
        if (item.service === service) {
          keysToDelete.push(key);
        }
      }
      keysToDelete.forEach(key => {
        this.memoryCache.delete(key);
        if (this.enablePersistence) {
          this.removeFromStorage(key);
        }
      });
    } else {
      // 清空所有缓存
      this.memoryCache.clear();
      if (this.enablePersistence) {
        this.clearStorage();
      }
    }
  }

  /**
   * 获取localStorage键名
   * @param {string} key - 缓存键
   * @returns {string} localStorage键名
   */
  getStorageKey(key) {
    return key; // 直接使用缓存键作为localStorage键
  }

  /**
   * 从localStorage加载缓存到内存
   */
  loadFromStorage() {
    if (!this.enablePersistence || typeof localStorage === 'undefined') {
      return;
    }
    
    try {
      const prefix = this.cachePrefix;
      const keys = Object.keys(localStorage);
      
      keys.forEach(storageKey => {
        if (storageKey.startsWith(prefix)) {
          try {
            const item = JSON.parse(localStorage.getItem(storageKey));
            // 检查是否过期
            if (!this.isExpired(item)) {
              this.memoryCache.set(storageKey, item);
            } else {
              // 删除过期缓存
              localStorage.removeItem(storageKey);
            }
          } catch (error) {
            console.warn(`Failed to load cache item ${storageKey}:`, error);
            // 删除损坏的缓存项
            localStorage.removeItem(storageKey);
          }
        }
      });
    } catch (error) {
      console.error('Error loading cache from localStorage:', error);
    }
  }

  /**
   * 从localStorage删除缓存项
   * @param {string} key - 缓存键
   */
  removeFromStorage(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  /**
   * 清空localStorage中的所有缓存
   */
  clearStorage() {
    if (typeof localStorage === 'undefined') {
      return;
    }
    
    try {
      const prefix = this.cachePrefix;
      const keys = Object.keys(localStorage);
      
      keys.forEach(key => {
        if (key.startsWith(prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage cache:', error);
    }
  }

  /**
   * 清理localStorage中的过期缓存
   */
  cleanupStorage() {
    if (typeof localStorage === 'undefined') {
      return;
    }
    
    try {
      const prefix = this.cachePrefix;
      const keys = Object.keys(localStorage);
      let cleanedCount = 0;
      
      keys.forEach(storageKey => {
        if (storageKey.startsWith(prefix)) {
          try {
            const item = JSON.parse(localStorage.getItem(storageKey));
            if (this.isExpired(item)) {
              localStorage.removeItem(storageKey);
              cleanedCount++;
            }
          } catch (error) {
            // 删除损坏的缓存项
            localStorage.removeItem(storageKey);
            cleanedCount++;
          }
        }
      });
      
      if (cleanedCount > 0) {
        console.log(`Cleaned up ${cleanedCount} expired cache items`);
      }
    } catch (error) {
      console.error('Error cleaning up localStorage:', error);
    }
  }

  /**
   * 获取缓存统计信息
   * @returns {Object} 统计信息
   */
  getStats() {
    const memorySize = this.memoryCache.size;
    let storageSize = 0;
    
    if (this.enablePersistence && typeof localStorage !== 'undefined') {
      try {
        const prefix = this.cachePrefix;
        const keys = Object.keys(localStorage);
        storageSize = keys.filter(key => key.startsWith(prefix)).length;
      } catch (error) {
        console.error('Error getting storage stats:', error);
      }
    }
    
    return {
      memoryCacheSize: memorySize,
      storageCacheSize: storageSize,
      totalCacheSize: memorySize + storageSize
    };
  }
}

// 创建默认实例
const cacheManager = new CacheManager({
  enablePersistence: true,
  cachePrefix: 'market_data_cache_',
  defaultTTL: 24 * 60 * 60 * 1000 // 24小时
});

export default cacheManager;
export { CacheManager };
