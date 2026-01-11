export const PLUGIN_ID = 'flip-clock';

/** 翻页时钟配置 */
export interface FlipClockConfig {
  showSeconds: boolean;
  use24Hour: boolean;
  showDate: boolean;
}

/** 默认配置 */
export const DEFAULT_CONFIG: FlipClockConfig = {
  showSeconds: true,
  use24Hour: true,
  showDate: true,
};

/** 格式化数字为两位 */
export function padZero(num: number): string {
  return num.toString().padStart(2, '0');
}

/** 获取当前时间 */
export function getCurrentTime(use24Hour: boolean) {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  let period = '';

  if (!use24Hour) {
    period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
  }

  return {
    hours: padZero(hours),
    minutes: padZero(minutes),
    seconds: padZero(seconds),
    period,
  };
}

/** 获取当前日期 */
export function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekday = weekdays[now.getDay()];

  return {
    year,
    month: padZero(month),
    day: padZero(day),
    weekday,
    formatted: `${year}年${month}月${day}日 ${weekday}`,
  };
}
