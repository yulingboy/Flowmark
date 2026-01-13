import { useMemo } from 'react';
import { SolarDay } from 'tyme4ts';
import type { PluginSize } from '@/types';

/** 农历月份名称 */
const LUNAR_MONTH_NAMES = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];

/** 农历日期名称 */
const LUNAR_DAY_NAMES = [
  '', '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
];

/** 星期名称 */
const WEEK_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

interface TodayInfo {
  // 公历
  year: number;
  month: number;
  day: number;
  weekName: string;
  // 农历
  lunarMonth: string;
  lunarDay: string;
  lunarYear: string;
  // 干支
  yearGanZhi: string;
  monthGanZhi: string;
  dayGanZhi: string;
  // 生肖
  zodiac: string;
  // 节气
  solarTerm?: string;
  // 节日
  festival?: string;
  // 宜忌
  recommends: string[];
  avoids: string[];
}

function useTodayInfo(): TodayInfo {
  return useMemo(() => {
    const now = new Date();
    const solar = SolarDay.fromYmd(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const lunar = solar.getLunarDay();
    const lunarMonth = lunar.getLunarMonth();
    const lunarYear = lunarMonth.getLunarYear();
    
    // 节气
    const termDay = solar.getTermDay();
    const solarTerm = termDay.getDayIndex() === 0 ? termDay.getSolarTerm().getName() : undefined;
    
    // 节日
    const lunarFestival = lunar.getFestival();
    const solarFestival = solar.getFestival();
    const festival = lunarFestival?.getName() || solarFestival?.getName();
    
    // 宜忌
    const recommends = lunar.getRecommends().slice(0, 4).map(t => t.getName());
    const avoids = lunar.getAvoids().slice(0, 4).map(t => t.getName());
    
    return {
      year: solar.getYear(),
      month: solar.getMonth(),
      day: solar.getDay(),
      weekName: WEEK_NAMES[solar.getWeek().getIndex()],
      lunarMonth: `${lunarMonth.isLeap() ? '闰' : ''}${LUNAR_MONTH_NAMES[lunarMonth.getMonth() - 1]}月`,
      lunarDay: LUNAR_DAY_NAMES[lunar.getDay()],
      lunarYear: `${lunarYear.getSixtyCycle().getName()}年`,
      yearGanZhi: lunar.getYearSixtyCycle().getName(),
      monthGanZhi: lunar.getMonthSixtyCycle().getName(),
      dayGanZhi: lunar.getSixtyCycle().getName(),
      zodiac: lunarYear.getSixtyCycle().getEarthBranch().getZodiac().getName(),
      solarTerm,
      festival,
      recommends,
      avoids
    };
  }, []);
}

export function CalendarCard({ size }: { size: PluginSize }) {
  const today = useTodayInfo();

  // 1x1 尺寸：只显示日期
  if (size === '1x1') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-1">
        <span className="text-2xl font-bold text-gray-700 tabular-nums">{today.day}</span>
        <span className="text-xs text-gray-500">{today.lunarDay}</span>
      </div>
    );
  }

  // 2x2 尺寸：显示日期和农历
  if (size === '2x2') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-3 gap-1">
        {/* 公历日期 */}
        <div className="text-4xl font-bold text-gray-700 tabular-nums">{today.day}</div>
        <div className="text-sm text-gray-500">
          {today.year}年{today.month}月 {today.weekName}
        </div>
        {/* 农历 */}
        <div className="text-sm text-red-500">
          {today.lunarMonth}{today.lunarDay}
        </div>
        {/* 节日或节气 */}
        {(today.festival || today.solarTerm) && (
          <div className={`text-xs px-2 py-0.5 rounded ${today.festival ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
            {today.festival || today.solarTerm}
          </div>
        )}
      </div>
    );
  }

  // 2x4 尺寸：显示完整信息
  return (
    <div className="w-full h-full flex flex-col p-4">
      {/* 顶部：日期 */}
      <div className="flex items-start gap-4">
        <div className="text-5xl font-bold text-gray-700 tabular-nums leading-none">{today.day}</div>
        <div className="flex-1">
          <div className="text-sm text-gray-600">
            {today.year}年{today.month}月 {today.weekName}
          </div>
          <div className="text-sm text-red-500 mt-1">
            {today.lunarYear} {today.lunarMonth}{today.lunarDay}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            【{today.zodiac}年】{today.dayGanZhi}日
          </div>
        </div>
      </div>
      
      {/* 节日/节气 */}
      {(today.festival || today.solarTerm) && (
        <div className="mt-2">
          {today.festival && (
            <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded mr-2">
              {today.festival}
            </span>
          )}
          {today.solarTerm && (
            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-600 rounded">
              {today.solarTerm}
            </span>
          )}
        </div>
      )}
      
      {/* 宜忌 */}
      <div className="mt-3 flex-1 grid grid-cols-2 gap-2 text-xs">
        <div>
          <div className="text-green-600 font-medium mb-1">宜</div>
          <div className="text-gray-600 space-y-0.5">
            {today.recommends.map((item, i) => (
              <div key={i}>{item}</div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-red-600 font-medium mb-1">忌</div>
          <div className="text-gray-600 space-y-0.5">
            {today.avoids.map((item, i) => (
              <div key={i}>{item}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
