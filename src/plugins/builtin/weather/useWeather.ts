import { useState, useEffect, useCallback } from 'react';
import { useWeatherStore } from './store';
import type { WeatherResponse, WeatherCache, WeatherData, HourlyForecast, DailyForecast } from './types';
import { getWeekday } from './types';

/** 格式化缓存时间 */
function formatCacheAge(timestamp: number): string {
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 60) return '刚刚更新';
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前更新`;
  return `${Math.floor(diff / 3600)} 小时前更新`;
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

interface WeatherApiCurrent {
  temp_C: string;
  temp_F: string;
  weatherDesc: { value: string }[];
  lang_zh?: { value: string }[];
  weatherCode: string;
  humidity: string;
  windspeedKmph: string;
  winddir16Point: string;
  pressure: string;
}

interface WeatherApiArea {
  areaName: { value: string }[];
}

interface WeatherApiHourly {
  time: string;
  tempC: string;
  tempF: string;
  weatherCode: string;
}

interface WeatherApiDay {
  date: string;
  maxtempC: string;
  maxtempF: string;
  mintempC: string;
  mintempF: string;
  hourly?: WeatherApiHourly[];
}

interface WeatherApiResponse {
  current_condition: WeatherApiCurrent[];
  nearest_area: WeatherApiArea[];
  weather?: WeatherApiDay[];
}

/** 解析 API 响应数据 */
function parseWeatherResponse(data: WeatherApiResponse, unit: 'celsius' | 'fahrenheit'): WeatherResponse {
  const current = data.current_condition[0];
  const area = data.nearest_area[0];
  const weather = data.weather || [];
  const currentHour = new Date().getHours();
  const isDay = currentHour >= 6 && currentHour < 18;
  
  const currentWeather: WeatherData = {
    temperature: parseInt(unit === 'celsius' ? current.temp_C : current.temp_F),
    condition: current.lang_zh?.[0]?.value || current.weatherDesc[0].value,
    icon: current.weatherCode || '116',
    humidity: parseInt(current.humidity),
    city: area.areaName[0].value,
    wind: `${current.windspeedKmph}km/h`,
    windDir: translateWindDir(current.winddir16Point),
    pressure: parseInt(current.pressure),
    isDay,
  };
  
  const hourly: HourlyForecast[] = [];
  weather.slice(0, 2).forEach((day: WeatherApiDay, dayIndex: number) => {
    (day.hourly || []).forEach((hour: WeatherApiHourly) => {
      const hourNum = parseInt(hour.time) / 100;
      if (dayIndex === 0 && hourNum < currentHour) return;
      if (hourly.length >= 24) return;
      hourly.push({
        time: `${hourNum}:00`,
        temperature: parseInt(unit === 'celsius' ? hour.tempC : hour.tempF),
        icon: hour.weatherCode || '116',
        isDay: hourNum >= 6 && hourNum < 18,
      });
    });
  });
  
  const daily: DailyForecast[] = weather.slice(0, 7).map((day: WeatherApiDay) => ({
    date: day.date,
    weekday: getWeekday(day.date),
    maxTemp: parseInt(unit === 'celsius' ? day.maxtempC : day.maxtempF),
    minTemp: parseInt(unit === 'celsius' ? day.mintempC : day.mintempF),
    icon: day.hourly?.[4]?.weatherCode || '116',
  }));
  
  return { current: currentWeather, hourly, daily };
}

export function useWeather() {
  const weatherCache = useWeatherStore(state => state.weatherCache);
  const config = useWeatherStore(state => state.config);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheAge, setCacheAge] = useState('');

  useEffect(() => {
    if (!weatherCache?.timestamp) return;
    const updateAge = () => setCacheAge(formatCacheAge(weatherCache.timestamp));
    updateAge();
    const interval = setInterval(updateAge, 60000);
    return () => clearInterval(interval);
  }, [weatherCache?.timestamp]);

  const fetchWeather = useCallback(async () => {
    if (!config.location?.trim()) {
      setError('请输入城市名称');
      return;
    }
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://wttr.in/${encodeURIComponent(config.location)}?format=j1`);
      if (!response.ok) throw new Error('获取天气失败');
      
      const data = await response.json();
      const cache: WeatherCache = {
        data: parseWeatherResponse(data, config.unit),
        timestamp: Date.now(),
        location: config.location,
      };
      useWeatherStore.getState().setWeatherCache(cache);
    } catch {
      setError('获取失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [config.location, config.unit]);

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, (config.updateInterval || 30) * 60 * 1000);
    return () => clearInterval(interval);
  }, [config.location, config.unit, config.updateInterval, fetchWeather]);

  return { 
    weather: weatherCache?.data || null, 
    loading, 
    error, 
    refresh: fetchWeather, 
    cacheAge,
  };
}
