import { useState, useEffect, useCallback } from 'react';
import type { PluginAPI, PluginSize } from '../../types';

interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  city: string;
  feelsLike?: number;
  wind?: string;
}

interface WeatherConfig {
  location: string;
  unit: 'celsius' | 'fahrenheit';
  updateInterval: number;
}

const WEATHER_ICONS: Record<string, string> = {
  'Clear': '☀️',
  'Sunny': '☀️',
  'Partly cloudy': '⛅',
  'Cloudy': '☁️',
  'Overcast': '☁️',
  'Mist': '🌫️',
  'Fog': '🌫️',
  'Rain': '🌧️',
  'Light rain': '🌦️',
  'Heavy rain': '🌧️',
  'Thunderstorm': '⛈️',
  'Snow': '❄️',
  'Light snow': '🌨️',
};

function getWeatherIcon(condition: string): string {
  for (const [key, icon] of Object.entries(WEATHER_ICONS)) {
    if (condition.toLowerCase().includes(key.toLowerCase())) {
      return icon;
    }
  }
  return '🌤️';
}

function useWeather(api: PluginAPI) {
  const config = api.getConfig<WeatherConfig>();
  const [weather, setWeather] = useState<WeatherData | null>(
    api.getStorage<WeatherData>('weatherData')
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    if (!config.location) return;
    setLoading(true);
    setError(null);
    
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
      
      setWeather(weatherData);
      api.setStorage('weatherData', weatherData);
    } catch {
      setError('获取失败');
    } finally {
      setLoading(false);
    }
  }, [config.location, config.unit, api]);

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, (config.updateInterval || 30) * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchWeather, config.updateInterval]);

  return { weather, loading, error, refresh: fetchWeather, config };
}

// 卡片视图
export function WeatherCard({ api, size }: { api: PluginAPI; size: PluginSize }) {
  const { weather, loading, error, refresh, config } = useWeather(api);

  if (loading && !weather) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        <span className="animate-pulse text-sm">加载中...</span>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
        <span className="text-sm">{error}</span>
        <button onClick={refresh} className="text-xs text-blue-400 mt-1">重试</button>
      </div>
    );
  }

  if (!weather) return null;

  if (size === '1x1') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-2">
        <span className="text-2xl">{weather.icon}</span>
        <span className="text-lg font-bold text-gray-700">{weather.temperature}°</span>
      </div>
    );
  }

  if (size === '2x2') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-3 gap-1">
        <span className="text-4xl">{weather.icon}</span>
        <span className="text-2xl font-bold text-gray-700">
          {weather.temperature}°{config.unit === 'celsius' ? 'C' : 'F'}
        </span>
        <span className="text-sm text-gray-500">{weather.city}</span>
        <span className="text-xs text-gray-400">{weather.condition}</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="flex items-center gap-3">
        <span className="text-5xl">{weather.icon}</span>
        <div>
          <div className="text-3xl font-bold text-gray-700">
            {weather.temperature}°{config.unit === 'celsius' ? 'C' : 'F'}
          </div>
          <div className="text-sm text-gray-500">{weather.city}</div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
        <div>体感: {weather.feelsLike}°</div>
        <div>湿度: {weather.humidity}%</div>
        <div>风速: {weather.wind}</div>
        <div>{weather.condition}</div>
      </div>
    </div>
  );
}

// 弹窗视图
export function WeatherModal({ api }: { api: PluginAPI }) {
  const { weather, loading, refresh, config } = useWeather(api);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-500 text-sm">当前城市: {config.location}</span>
        <button 
          onClick={refresh}
          disabled={loading}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? '刷新中...' : '刷新'}
        </button>
      </div>
      
      {weather ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
            <span className="text-6xl">{weather.icon}</span>
            <div>
              <div className="text-4xl font-bold text-gray-700">
                {weather.temperature}°{config.unit === 'celsius' ? 'C' : 'F'}
              </div>
              <div className="text-lg text-gray-500">{weather.condition}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-400">体感温度</div>
              <div className="text-lg font-medium text-gray-700">{weather.feelsLike}°</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-400">湿度</div>
              <div className="text-lg font-medium text-gray-700">{weather.humidity}%</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-400">风速</div>
              <div className="text-lg font-medium text-gray-700">{weather.wind}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-400">城市</div>
              <div className="text-lg font-medium text-gray-700">{weather.city}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">暂无天气数据</div>
      )}
    </div>
  );
}
