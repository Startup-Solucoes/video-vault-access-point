
import { useState, useEffect, useCallback, useRef } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // time to live em milliseconds
}

interface CacheConfig {
  defaultTTL?: number;
  maxSize?: number;
}

export const useCache = <T>(config: CacheConfig = {}) => {
  const { defaultTTL = 5 * 60 * 1000, maxSize = 100 } = config; // 5 minutos padrão
  const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map());
  const [, forceUpdate] = useState({});

  const triggerUpdate = () => forceUpdate({});

  const isExpired = useCallback((entry: CacheEntry<T>): boolean => {
    return Date.now() - entry.timestamp > entry.ttl;
  }, []);

  const cleanExpired = useCallback(() => {
    const cache = cacheRef.current;
    const keysToDelete: string[] = [];
    
    cache.forEach((entry, key) => {
      if (isExpired(entry)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => cache.delete(key));
    
    if (keysToDelete.length > 0) {
      console.log(`🧹 Cache: Removidas ${keysToDelete.length} entradas expiradas`);
    }
  }, [isExpired]);

  const enforceMaxSize = useCallback(() => {
    const cache = cacheRef.current;
    if (cache.size <= maxSize) return;

    // Remove as entradas mais antigas
    const entries = Array.from(cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    const toRemove = entries.slice(0, cache.size - maxSize + 1);
    toRemove.forEach(([key]) => cache.delete(key));
    
    console.log(`📦 Cache: Removidas ${toRemove.length} entradas antigas (limite de tamanho)`);
  }, [maxSize]);

  const get = useCallback((key: string): T | null => {
    cleanExpired();
    const entry = cacheRef.current.get(key);
    
    if (!entry) {
      console.log(`❌ Cache miss: ${key}`);
      return null;
    }
    
    if (isExpired(entry)) {
      cacheRef.current.delete(key);
      console.log(`⏰ Cache expirado: ${key}`);
      return null;
    }
    
    console.log(`✅ Cache hit: ${key}`);
    return entry.data;
  }, [cleanExpired, isExpired]);

  const set = useCallback((key: string, data: T, customTTL?: number): void => {
    const ttl = customTTL || defaultTTL;
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl
    };
    
    cacheRef.current.set(key, entry);
    enforceMaxSize();
    
    console.log(`💾 Cache armazenado: ${key} (TTL: ${ttl}ms)`);
    triggerUpdate();
  }, [defaultTTL, enforceMaxSize]);

  const invalidate = useCallback((key: string): void => {
    if (cacheRef.current.delete(key)) {
      console.log(`🗑️ Cache invalidado: ${key}`);
      triggerUpdate();
    }
  }, []);

  const invalidatePattern = useCallback((pattern: string): void => {
    const regex = new RegExp(pattern);
    const keysToDelete: string[] = [];
    
    cacheRef.current.forEach((_, key) => {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => cacheRef.current.delete(key));
    
    if (keysToDelete.length > 0) {
      console.log(`🗑️ Cache invalidado por padrão "${pattern}": ${keysToDelete.length} entradas`);
      triggerUpdate();
    }
  }, []);

  const clear = useCallback((): void => {
    const size = cacheRef.current.size;
    cacheRef.current.clear();
    console.log(`🧹 Cache limpo: ${size} entradas removidas`);
    triggerUpdate();
  }, []);

  const getStats = useCallback(() => {
    cleanExpired();
    return {
      size: cacheRef.current.size,
      maxSize,
      defaultTTL
    };
  }, [cleanExpired, maxSize, defaultTTL]);

  // Limpeza automática a cada 5 minutos
  useEffect(() => {
    const interval = setInterval(cleanExpired, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [cleanExpired]);

  return {
    get,
    set,
    invalidate,
    invalidatePattern,
    clear,
    getStats
  };
};
