export const PLUGIN_ID = 'weather';

export interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  city: string;
  feelsLike?: number;
  wind?: string;
}

export interface WeatherConfig {
  location: string;
  unit: 'celsius' | 'fahrenheit';
  updateInterval: number;
}

export interface WeatherCache {
  data: WeatherData;
  timestamp: number;
  location: string;
}

// 验证位置输入
export function validateLocation(location: string): boolean {
  if (!location || typeof location !== 'string') return false;
  const trimmed = location.trim();
  // 至少2个字符，不能只包含特殊字符或数字
  if (trimmed.length < 2) return false;
  // 必须包含至少一个字母或中文字符
  return /[a-zA-Z\u4e00-\u9fa5]/.test(trimmed);
}

export const WEATHER_ICONS: Record<string, string> = {
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

export function getWeatherIcon(condition: string): string {
  for (const [key, icon] of Object.entries(WEATHER_ICONS)) {
    if (condition.toLowerCase().includes(key.toLowerCase())) {
      return icon;
    }
  }
  return '🌤️';
}
