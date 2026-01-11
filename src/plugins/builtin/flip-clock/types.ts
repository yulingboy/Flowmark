export const PLUGIN_ID = 'flip-clock';

/** 翻页时钟配置 */
export interface FlipClockConfig {
  showSeconds: boolean;
  use24Hour: boolean;
  showDate: boolean;
  showLunar: boolean;
}

/** 默认配置 */
export const DEFAULT_CONFIG: FlipClockConfig = {
  showSeconds: true,
  use24Hour: true,
  showDate: true,
  showLunar: true,
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

/** 农历数据 */
const LUNAR_MONTHS = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
const LUNAR_DAYS = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];

/** 简化的农历计算（使用 tyme4ts 如果可用，否则使用简化版本） */
export async function getLunarDate(): Promise<string> {
  try {
    // 动态导入 tyme4ts
    const { SolarDay } = await import('tyme4ts');
    const now = new Date();
    const solar = SolarDay.fromYmd(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const lunar = solar.getLunarDay();
    return `${lunar.getMonth().getName()}${lunar.getName()}`;
  } catch {
    // 简化版本：显示固定格式
    const now = new Date();
    const month = now.getMonth();
    const day = now.getDate();
    // 简化计算，实际农历需要复杂算法
    const lunarMonth = LUNAR_MONTHS[month % 12];
    const lunarDay = LUNAR_DAYS[(day - 1) % 30];
    return `${lunarMonth}月${lunarDay}`;
  }
}

/** 同步获取农历日期（使用简化版本） */
export function getLunarDateSync(): string {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();
  const lunarMonth = LUNAR_MONTHS[month % 12];
  const lunarDay = LUNAR_DAYS[(day - 1) % 30];
  return `${lunarMonth}月${lunarDay}`;
}

/** 获取当前日期 */
export function getCurrentDate(showLunar: boolean = true) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const weekday = weekdays[now.getDay()];
  const lunar = showLunar ? getLunarDateSync() : '';

  const formatted = showLunar 
    ? `${year}年${month}月${day}日  ${lunar}  ${weekday}`
    : `${year}年${month}月${day}日  ${weekday}`;

  return {
    year,
    month: padZero(month),
    day: padZero(day),
    weekday,
    lunar,
    formatted,
  };
}
