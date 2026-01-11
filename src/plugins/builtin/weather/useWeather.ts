import { useState, useEffect, useCallback, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { usePluginStore } from '../../store';
import type { WeatherData, WeatherConfig, WeatherCache } from './types';
import { PLUGIN_ID, getWeatherIcon, validateLocation } from './types';

const DEFAULT_CONFIG: WeatherConfig = { location: 'Beijing', unit: 'celsius', updateInterval: 30 };

const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
};

function calculateBackoff(attempt: number, baseDelay: number, maxDelay: number): number {
  return Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
}

export function formatCacheAge(timestamp: number): string {
  const now = Date.now();
  const diff = Math.floor((now - timestamp) / 1000);
  
  if (diff < 60) return '刚刚更新';
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前更新`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前更新`;
  return `${Math.floor(diff / 86400)} 天前更新`;
}

export function useWeather() {
  const weatherCache = usePluginStore(
    useShallow(state => (state.pluginData[PLUGIN_ID]?.weatherCache as WeatherCache) || null)
  );
  const storedConfig = usePluginStore(
    useShallow(state => state.pluginConfigs[PLUGIN_ID] || {})
  );
  const config: WeatherConfig = { ...DEFAULT_CONFIG, ...storedConfig };
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheAge, setCacheAge] = useState<string>('');
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!weatherCache?.timestamp) return;
    
    const updateAge = () => setCacheAge(formatCacheAge(weatherCache.timestamp));
    updateAge();
    
    const interval = setInterval(updateAge, 60000);
    return () => clearInterval(interval);
  }, [weatherCache?.timestamp]);

  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  const fetchWeatherWithRetry = useCallback(async (isRetry = false) => {
    if (!validateLocation(config.location)) {
      setError('请输入有效的位置名称');
      return;
    }

    if (!isRetry) {
      retryCountRef.current = 0;
    }

    setLoading(true);
    if (!isRetry) setError(null);
    
    try {
      const response = await fetch(
        `https://wttr.in/${encodeURIComponent(config.location)}?format=j1`
      );
      if (!response.ok) throw new Error('获取天气失败');
      
      const data = await response.json();
      const current = data.current_condition[0];
      
      const weatherData: WeatherData = {
        temperature: parseInt(config.unit === 'celsius' ? current.temp_C : current.temp_F),
        condition: current.weatherDesc[0].value,
        icon: getWeatherIcon(current.weatherDesc[0].value),
        humidity: parseInt(current.humidity),
        city: data.nearest_area[0].areaName[0].value,
        feelsLike: parseInt(config.unit === 'celsius' ? current.FeelsLikeC : current.FeelsLikeF),
        wind: current.windspeedKmph + ' km/h'
      };
      
      const cache: WeatherCache = {
        data: weatherData,
        timestamp: Date.now(),
        location: config.location,
      };
      
      usePluginStore.getState().setPluginData(PLUGIN_ID, 'weatherCache', cache);
      retryCountRef.current = 0;
      setError(null);
    } catch {
      if (retryCountRef.current < RETRY_CONFIG.maxRetries) {
        const delay = calculateBackoff(
          retryCountRef.current,
          RETRY_CONFIG.baseDelay,
          RETRY_CONFIG.maxDelay
        );
        retryCountRef.current++;
        setError(`获取失败，${Math.round(delay / 1000)}秒后重试 (${retryCountRef.current}/${RETRY_CONFIG.maxRetries})`);
        
        retryTimeoutRef.current = setTimeout(() => {
          fetchWeatherWithRetry(true);
        }, delay);
      } else {
        setError('获取失败，请稍后重试');
        retryCountRef.current = 0;
      }
    } finally {
      setLoading(false);
    }
  }, [config.location, config.unit]);

  const refresh = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    retryCountRef.current = 0;
    fetchWeatherWithRetry(false);
  }, [fetchWeatherWithRetry]);

  useEffect(() => {
    fetchWeatherWithRetry(false);
    const interval = setInterval(() => fetchWeatherWithRetry(false), (config.updateInterval || 30) * 60 * 1000);
    return () => clearInterval(interval);
  }, [config.location, config.unit, config.updateInterval, fetchWeatherWithRetry]);

  return { 
    weather: weatherCache?.data || null, 
    loading, 
    error, 
    refresh, 
    config,
    cacheAge,
    cacheTimestamp: weatherCache?.timestamp,
  };
}

