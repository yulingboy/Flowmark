export const PLUGIN_ID = 'weather';

/** 当前天气数据 */
export interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  city: string;
  feelsLike: number;
  wind: string;
  windDir: string;
  pressure: number;
  visibility: number;
  uvIndex: number;
  cloudCover: number;
}

/** 小时预报 */
export interface HourlyForecast {
  time: string;
  temperature: number;
  icon: string;
  condition: string;
  chanceOfRain: number;
}

/** 每日预报 */
export interface DailyForecast {
  date: string;
  weekday: string;
  maxTemp: number;
  minTemp: number;
  icon: string;
  condition: string;
  chanceOfRain: number;
  sunrise: string;
  sunset: string;
}

/** 天文数据 */
export interface AstronomyData {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  moonPhase: string;
  moonIllumination: number;
}

/** 完整天气响应 */
export interface WeatherResponse {
  current: WeatherData;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  astronomy: AstronomyData;
}

/** 天气配置 */
export interface WeatherConfig {
  location: string;
  unit: 'celsius' | 'fahrenheit';
  updateInterval: number;
}

/** 天气缓存 */
export interface WeatherCache {
  data: WeatherResponse;
  timestamp: number;
  location: string;
}

/** 验证位置输入 */
export function validateLocation(location: string): boolean {
  if (!location || typeof location !== 'string') return false;
  const trimmed = location.trim();
  if (trimmed.length < 2) return false;
  return /[a-zA-Z\u4e00-\u9fa5]/.test(trimmed);
}

/** 天气状况到图标的映射 */
export const WEATHER_CONDITIONS: Record<string, { icon: string; color: string }> = {
  'clear': { icon: 'sun', color: '#FFB800' },
  'sunny': { icon: 'sun', color: '#FFB800' },
  'partly cloudy': { icon: 'cloud-sun', color: '#87CEEB' },
  'cloudy': { icon: 'cloud', color: '#A0AEC0' },
  'overcast': { icon: 'cloud', color: '#718096' },
  'mist': { icon: 'cloud-fog', color: '#A0AEC0' },
  'fog': { icon: 'cloud-fog', color: '#A0AEC0' },
  'rain': { icon: 'cloud-rain', color: '#4299E1' },
  'light rain': { icon: 'cloud-drizzle', color: '#63B3ED' },
  'heavy rain': { icon: 'cloud-rain-wind', color: '#2B6CB0' },
  'thunderstorm': { icon: 'cloud-lightning', color: '#805AD5' },
  'snow': { icon: 'snowflake', color: '#E2E8F0' },
  'light snow': { icon: 'cloud-snow', color: '#EDF2F7' },
  'sleet': { icon: 'cloud-hail', color: '#A0AEC0' },
};

/** 获取天气图标名称 */
export function getWeatherIconName(condition: string): string {
  const lowerCondition = condition.toLowerCase();
  for (const [key, value] of Object.entries(WEATHER_CONDITIONS)) {
    if (lowerCondition.includes(key)) {
      return value.icon;
    }
  }
  return 'cloud-sun';
}

/** 获取天气图标颜色 */
export function getWeatherColor(condition: string): string {
  const lowerCondition = condition.toLowerCase();
  for (const [key, value] of Object.entries(WEATHER_CONDITIONS)) {
    if (lowerCondition.includes(key)) {
      return value.color;
    }
  }
  return '#87CEEB';
}

/** 获取 emoji 图标（兼容旧版） */
export function getWeatherIcon(condition: string): string {
  const iconMap: Record<string, string> = {
    'sun': '☀️',
    'cloud-sun': '⛅',
    'cloud': '☁️',
    'cloud-fog': '🌫️',
    'cloud-rain': '🌧️',
    'cloud-drizzle': '🌦️',
    'cloud-rain-wind': '🌧️',
    'cloud-lightning': '⛈️',
    'snowflake': '❄️',
    'cloud-snow': '🌨️',
    'cloud-hail': '🌨️',
  };
  const iconName = getWeatherIconName(condition);
  return iconMap[iconName] || '🌤️';
}

/** 星期名称 */
export const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

/** 获取星期名称 */
export function getWeekday(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) return '今天';
  if (date.toDateString() === tomorrow.toDateString()) return '明天';
  return WEEKDAYS[date.getDay()];
}
