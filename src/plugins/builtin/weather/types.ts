export const PLUGIN_ID = 'weather';

/** 当前天气数据 */
export interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  city: string;
  wind: string;
  windDir: string;
  pressure: number;
  isDay: boolean;
}

/** 小时预报 */
export interface HourlyForecast {
  time: string;
  temperature: number;
  icon: string;
  isDay: boolean;
}

/** 每日预报 */
export interface DailyForecast {
  date: string;
  weekday: string;
  maxTemp: number;
  minTemp: number;
  icon: string;
}

/** 完整天气响应 */
export interface WeatherResponse {
  current: WeatherData;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
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

/** 星期名称 */
const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

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
