import { useState, useEffect, useCallback, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { usePluginStore } from '../../store';
import type { HitokotoData, HitokotoConfig, HitokotoCache } from './types';
import { PLUGIN_ID } from './types';

const DEFAULT_CONFIG: HitokotoConfig = {
  types: ['a', 'b', 'c', 'd', 'i'],
  autoRefresh: false,
  refreshInterval: 30,
};

export function useHitokoto() {
  const cache = usePluginStore(
    useShallow(state => (state.pluginData[PLUGIN_ID]?.cache as HitokotoCache) || null)
  );
  const storedConfig = usePluginStore(
    useShallow(state => state.pluginConfigs[PLUGIN_ID] || {})
  );
  const config: HitokotoConfig = { ...DEFAULT_CONFIG, ...storedConfig };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchHitokoto = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 构建类型参数
      const typeParams = config.types.map(t => `c=${t}`).join('&');
      const url = `https://v1.hitokoto.cn/?${typeParams}&encode=json`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('获取失败');

      const data: HitokotoData = await response.json();
      
      const newCache: HitokotoCache = {
        data,
        timestamp: Date.now(),
      };
      
      usePluginStore.getState().setPluginData(PLUGIN_ID, 'cache', newCache);
    } catch {
      setError('获取一言失败');
    } finally {
      setLoading(false);
    }
  }, [config.types]);

  // 初始加载
  useEffect(() => {
    if (!cache) {
      fetchHitokoto();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cache]);

  // 自动刷新
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (config.autoRefresh && config.refreshInterval > 0) {
      intervalRef.current = setInterval(
        fetchHitokoto,
        config.refreshInterval * 1000
      );
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.autoRefresh, config.refreshInterval]);

  return {
    hitokoto: cache?.data || null,
    loading,
    error,
    refresh: fetchHitokoto,
    config,
  };
}
