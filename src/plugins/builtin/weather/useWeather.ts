import { useState, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { usePluginStore } from '../../store';
import type { WeatherData, WeatherConfig } from './types';
import { PLUGIN_ID, getWeatherIcon } from './types';

const DEFAULT_CONFIG: WeatherConfig = { location: 'Beijing', unit: 'celsius', updateInterval: 30 };

export function useWeather() {
  const weather = usePluginStore(
    useShallow(state => (state.pluginData[PLUGIN_ID]?.weatherData as WeatherData) || null)
  );
  const storedConfig = usePluginStore(
    useShallow(state => state.pluginConfigs[PLUGIN_ID] || {})
  );
  const config: WeatherConfig = { ...DEFAULT_CONFIG, ...storedConfig };
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
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
      
      usePluginStore.getState().setPluginData(PLUGIN_ID, 'weatherData', weatherData);
    } catch {
      setError('获取失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, (config.updateInterval || 30) * 60 * 1000);
    return () => clearInterval(interval);
  }, [config.location, config.unit, config.updateInterval]);

  return { weather, loading, error, refresh: fetchWeather, config };
}
