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
