import { useState, useEffect, useCallback, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { usePluginStore } from '../../store';
import type { 
  WeatherResponse, 
  WeatherConfig, 
  WeatherCache,
  WeatherData,
  HourlyForecast,
  DailyForecast,
  AstronomyData
} from './types';
import { PLUGIN_ID, validateLocation, getWeekday } from './types';

const DEFAULT_CONFIG: WeatherConfig = { 
  location: 'Beijing', 
  unit: 'celsius', 
  updateInterval: 30 
};

const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
};

function calculateBackoff(attempt: number, baseDelay: number, maxDelay: number): number {
  return Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
}

/** 格式化缓存时间 */
export function formatCacheAge(timestamp: number): string {
  const now = Date.now();
  const diff = Math.floor((now - timestamp) / 1000);
  
  if (diff < 60) return '刚刚更新';
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前更新`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前更新`;
  return `${Math.floor(diff / 86400)} 天前更新`;
}

/** 解析 API 响应数据 */
function parseWeatherResponse(data: any, unit: 'celsius' | 'fahrenheit'): WeatherResponse {
  const current = data.current_condition[0];
  const area = data.nearest_area[0];
  const weather = data.weather || [];
  
  // 获取当前小时判断白天/夜晚
  const currentHour = new Date().getHours();
  const isDay = currentHour >= 6 && currentHour < 18;
  
  // 当前天气
  const currentWeather: WeatherData = {
    temperature: parseInt(unit === 'celsius' ? current.temp_C : current.temp_F),
    condition: current.lang_zh?.[0]?.value || current.weatherDesc[0].value,
    icon: current.weatherCode || '116',
    humidity: parseInt(current.humidity),
    city: area.areaName[0].value,
    feelsLike: parseInt(unit === 'celsius' ? current.FeelsLikeC : current.FeelsLikeF),
    wind: `${current.windspeedKmph}km/h`,
    windDir: translateWindDir(current.winddir16Point),
    pressure: parseInt(current.pressure),
    visibility: parseInt(current.visibility),
    uvIndex: parseInt(current.uvIndex),
    cloudCover: parseInt(current.cloudcover),
    isDay,
  };
  
  // 小时预报
  const hourly: HourlyForecast[] = [];
  const now = new Date();
  const currentHourNum = now.getHours();
  
  weather.slice(0, 2).forEach((day: any, dayIndex: number) => {
    (day.hourly || []).forEach((hour: any) => {
      const hourNum = parseInt(hour.time) / 100;
      if (dayIndex === 0 && hourNum < currentHourNum) return;
      if (hourly.length >= 24) return;
      
      const hourIsDay = hourNum >= 6 && hourNum < 18;
      hourly.push({
        time: `${hourNum}:00`,
        temperature: parseInt(unit === 'celsius' ? hour.tempC : hour.tempF),
        icon: hour.weatherCode || '116',
        condition: hour.lang_zh?.[0]?.value || hour.weatherDesc[0].value,
        chanceOfRain: parseInt(hour.chanceofrain),
        isDay: hourIsDay,
      });
    });
  });
  
  // 每日预报
  const daily: DailyForecast[] = weather.slice(0, 7).map((day: any) => {
    const middayHour = day.hourly?.[4] || day.hourly?.[0] || {};
    return {
      date: day.date,
      weekday: getWeekday(day.date),
      maxTemp: parseInt(unit === 'celsius' ? day.maxtempC : day.maxtempF),
      minTemp: parseInt(unit === 'celsius' ? day.mintempC : day.mintempF),
      icon: middayHour.weatherCode || '116',
      condition: middayHour.lang_zh?.[0]?.value || middayHour.weatherDesc?.[0]?.value || 'Sunny',
      chanceOfRain: Math.max(...(day.hourly || []).map((h: any) => parseInt(h.chanceofrain) || 0)),
      sunrise: day.astronomy?.[0]?.sunrise || '',
      sunset: day.astronomy?.[0]?.sunset || '',
    };
  });
  
  // 天文数据
  const todayAstro = weather[0]?.astronomy?.[0] || {};
  const astronomy: AstronomyData = {
    sunrise: todayAstro.sunrise || '',
    sunset: todayAstro.sunset || '',
    moonrise: todayAstro.moonrise || '',
    moonset: todayAstro.moonset || '',
    moonPhase: todayAstro.moon_phase || '',
    moonIllumination: parseInt(todayAstro.moon_illumination) || 0,
  };
  
  return { current: currentWeather, hourly, daily, astronomy };
}

/** 翻译风向 */
function translateWindDir(dir: string): string {
  const dirMap: Record<string, string> = {
    'N': '北风', 'NNE': '东北偏北', 'NE': '东北风', 'ENE': '东北偏东',
    'E': '东风', 'ESE': '东南偏东', 'SE': '东南风', 'SSE': '东南偏南',
    'S': '南风', 'SSW': '西南偏南', 'SW': '西南风', 'WSW': '西南偏西',
    'W': '西风', 'WNW': '西北偏西', 'NW': '西北风', 'NNW': '西北偏北',
  };
  return dirMap[dir] || dir;
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

  // 更新缓存时间显示
  useEffect(() => {
    if (!weatherCache?.timestamp) return;
    
    const updateAge = () => setCacheAge(formatCacheAge(weatherCache.timestamp));
    updateAge();
    
    const interval = setInterval(updateAge, 60000);
    return () => clearInterval(interval);
  }, [weatherCache?.timestamp]);

  // 清理重试定时器
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
      const weatherData = parseWeatherResponse(data, config.unit);
      
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

  // 初始加载和定时刷新
  useEffect(() => {
    fetchWeatherWithRetry(false);
    const interval = setInterval(
      () => fetchWeatherWithRetry(false), 
      (config.updateInterval || 30) * 60 * 1000
    );
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
