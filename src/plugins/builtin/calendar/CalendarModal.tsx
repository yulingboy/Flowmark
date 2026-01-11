import { useState, useMemo } from 'react';
import { SolarDay, SolarMonth, LunarDay } from 'tyme4ts';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/** 星期名称 */
const WEEK_NAMES = ['日', '一', '二', '三', '四', '五', '六'];

/** 农历月份名称 */
const LUNAR_MONTH_NAMES = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];

/** 农历日期名称 */
const LUNAR_DAY_NAMES = [
  '', '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
];

interface DayInfo {
  solarDay: SolarDay;
  lunarDay: LunarDay;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  lunarText: string;
  festival?: string;
  solarTerm?: string;
  isHoliday?: boolean;
  isWorkday?: boolean;
}

function getLunarDayText(lunarDay: LunarDay): string {
  const day = lunarDay.getDay();
  if (day === 1) {
    const month = lunarDay.getLunarMonth();
    const monthName = LUNAR_MONTH_NAMES[month.getMonth() - 1];
    return month.isLeap() ? `闰${monthName}月` : `${monthName}月`;
  }
  return LUNAR_DAY_NAMES[day];
}

export function CalendarModal() {
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<{ solar: SolarDay; lunar: LunarDay } | null>(null);

  const today = useMemo(() => {
    return SolarDay.fromYmd(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }, []);

  /** 生成日历数据 */
  const calendarDays = useMemo(() => {
    const solarMonth = SolarMonth.fromYm(currentYear, currentMonth);
    const firstDay = solarMonth.getFirstDay();
    const daysInMonth = solarMonth.getDayCount();
    const firstDayWeek = firstDay.getWeek().getIndex();
    
    const days: DayInfo[] = [];
    
    // 填充上月日期
    if (firstDayWeek > 0) {
      const prevMonth = solarMonth.next(-1);
      const prevDaysCount = prevMonth.getDayCount();
      for (let i = firstDayWeek - 1; i >= 0; i--) {
        const day = prevDaysCount - i;
        const solarDay = SolarDay.fromYmd(prevMonth.getYear(), prevMonth.getMonth(), day);
        const lunarDay = solarDay.getLunarDay();
        const weekIndex = solarDay.getWeek().getIndex();
        const termDay = solarDay.getTermDay();
        const holiday = solarDay.getLegalHoliday();
        
        days.push({
          solarDay,
          lunarDay,
          isCurrentMonth: false,
          isToday: solarDay.equals(today),
          isWeekend: weekIndex === 0 || weekIndex === 6,
          lunarText: getLunarDayText(lunarDay),
          festival: lunarDay.getFestival()?.getName() || solarDay.getFestival()?.getName(),
          solarTerm: termDay.getDayIndex() === 0 ? termDay.getSolarTerm().getName() : undefined,
          isHoliday: holiday ? !holiday.isWork() : undefined,
          isWorkday: holiday?.isWork()
        });
      }
    }
    
    // 填充本月日期
    for (let day = 1; day <= daysInMonth; day++) {
      const solarDay = SolarDay.fromYmd(currentYear, currentMonth, day);
      const lunarDay = solarDay.getLunarDay();
      const weekIndex = solarDay.getWeek().getIndex();
      const termDay = solarDay.getTermDay();
      const holiday = solarDay.getLegalHoliday();
      
      days.push({
        solarDay,
        lunarDay,
        isCurrentMonth: true,
        isToday: solarDay.equals(today),
        isWeekend: weekIndex === 0 || weekIndex === 6,
        lunarText: getLunarDayText(lunarDay),
        festival: lunarDay.getFestival()?.getName() || solarDay.getFestival()?.getName(),
        solarTerm: termDay.getDayIndex() === 0 ? termDay.getSolarTerm().getName() : undefined,
        isHoliday: holiday ? !holiday.isWork() : undefined,
        isWorkday: holiday?.isWork()
      });
    }
    
    // 填充下月日期
    const remainingDays = 42 - days.length;
    if (remainingDays > 0) {
      const nextMonth = solarMonth.next(1);
      for (let day = 1; day <= remainingDays; day++) {
        const solarDay = SolarDay.fromYmd(nextMonth.getYear(), nextMonth.getMonth(), day);
        const lunarDay = solarDay.getLunarDay();
        const weekIndex = solarDay.getWeek().getIndex();
        const termDay = solarDay.getTermDay();
        const holiday = solarDay.getLegalHoliday();
        
        days.push({
          solarDay,
          lunarDay,
          isCurrentMonth: false,
          isToday: solarDay.equals(today),
          isWeekend: weekIndex === 0 || weekIndex === 6,
          lunarText: getLunarDayText(lunarDay),
          festival: lunarDay.getFestival()?.getName() || solarDay.getFestival()?.getName(),
          solarTerm: termDay.getDayIndex() === 0 ? termDay.getSolarTerm().getName() : undefined,
          isHoliday: holiday ? !holiday.isWork() : undefined,
          isWorkday: holiday?.isWork()
        });
      }
    }
    
    return days;
  }, [currentYear, currentMonth, today]);

  const goToPrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth() + 1);
  };

  const handleDayClick = (dayInfo: DayInfo) => {
    setSelectedDate({ solar: dayInfo.solarDay, lunar: dayInfo.lunarDay });
  };

  /** 获取选中日期的详细信息 */
  const dateDetails = useMemo(() => {
    if (!selectedDate) return null;
    
    const { solar, lunar } = selectedDate;
    const lunarMonth = lunar.getLunarMonth();
    const lunarYear = lunarMonth.getLunarYear();
    const termDay = solar.getTermDay();
    const term = termDay.getSolarTerm();
    const lunarFestival = lunar.getFestival();
    const solarFestival = solar.getFestival();
    const legalHoliday = solar.getLegalHoliday();
    const recommends = lunar.getRecommends().slice(0, 6);
    const avoids = lunar.getAvoids().slice(0, 6);
    
    return {
      solarDate: `${solar.getYear()}年${solar.getMonth()}月${solar.getDay()}日`,
      lunarDate: lunar.toString(),
      yearGanZhi: lunar.getYearSixtyCycle().getName(),
      monthGanZhi: lunar.getMonthSixtyCycle().getName(),
      dayGanZhi: lunar.getSixtyCycle().getName(),
      zodiac: lunarYear.getSixtyCycle().getEarthBranch().getZodiac().getName(),
      constellation: solar.getConstellation().getName(),
      solarTerm: termDay.getDayIndex() === 0 ? term.getName() : `${term.getName()}后${termDay.getDayIndex()}天`,
      festival: lunarFestival?.getName() || solarFestival?.getName(),
      legalHoliday: legalHoliday ? `${legalHoliday.getName()}${legalHoliday.isWork() ? '(调休)' : '(休)'}` : null,
      recommends: recommends.map(t => t.getName()),
      avoids: avoids.map(t => t.getName()),
      duty: lunar.getDuty().getName(),
      twelveStar: lunar.getTwelveStar().getName(),
      twentyEightStar: lunar.getTwentyEightStar().getName(),
    };
  }, [selectedDate]);

  const getDayClassName = (dayInfo: DayInfo) => {
    const classes = [
      'relative flex flex-col items-center justify-center p-1 rounded-lg cursor-pointer transition-all duration-200',
      'hover:bg-gray-100'
    ];
    if (!dayInfo.isCurrentMonth) classes.push('opacity-40');
    if (dayInfo.isToday) classes.push('bg-blue-500 text-white hover:bg-blue-600');
    else if (selectedDate?.solar.equals(dayInfo.solarDay)) classes.push('bg-blue-100 ring-2 ring-blue-500');
    if (dayInfo.isWeekend && !dayInfo.isToday) classes.push('text-red-500');
    return classes.join(' ');
  };

  const getLunarClassName = (dayInfo: DayInfo) => {
    const classes = ['text-[10px] leading-tight truncate max-w-full'];
    if (dayInfo.isToday) classes.push('text-white/80');
    else if (dayInfo.festival) classes.push('text-red-500');
    else if (dayInfo.solarTerm) classes.push('text-green-600');
    else classes.push('text-gray-500');
    return classes.join(' ');
  };

  return (
    <div className="flex h-full">
      {/* 左侧日历 */}
      <div className="flex-1 p-4 border-r border-gray-200">
        <div className="select-none">
          {/* 头部导航 */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={goToPrevMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-gray-800">{currentYear}年{currentMonth}月</span>
              <button onClick={goToToday} className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors">
                今天
              </button>
            </div>
            <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* 星期标题 */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEK_NAMES.map((name, index) => (
              <div key={name} className={`text-center text-sm font-medium py-2 ${index === 0 || index === 6 ? 'text-red-500' : 'text-gray-600'}`}>
                {name}
              </div>
            ))}
          </div>

          {/* 日期网格 */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((dayInfo, index) => (
              <div key={index} className={getDayClassName(dayInfo)} onClick={() => handleDayClick(dayInfo)} style={{ minHeight: '48px' }}>
                <span className="text-sm font-medium tabular-nums">{dayInfo.solarDay.getDay()}</span>
                <span className={getLunarClassName(dayInfo)}>{dayInfo.festival || dayInfo.solarTerm || dayInfo.lunarText}</span>
                {dayInfo.isHoliday && <span className="absolute top-0.5 right-0.5 text-[8px] text-green-500 font-medium">休</span>}
                {dayInfo.isWorkday && <span className="absolute top-0.5 right-0.5 text-[8px] text-orange-500 font-medium">班</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 右侧详情 */}
      <div className="w-56 p-4 overflow-y-auto bg-gray-50">
        {dateDetails ? (
          <div className="space-y-4">
            <div className="text-center pb-3 border-b border-gray-200">
              <div className="text-2xl font-bold text-gray-800">{selectedDate?.solar.getDay()}</div>
              <div className="text-sm text-gray-600 mt-1">{dateDetails.solarDate}</div>
              <div className="text-sm text-red-600 mt-1">{dateDetails.lunarDate}</div>
              {dateDetails.festival && (
                <div className="mt-2 px-2 py-1 bg-red-100 text-red-600 text-xs rounded inline-block">{dateDetails.festival}</div>
              )}
              {dateDetails.legalHoliday && (
                <div className="mt-1 px-2 py-1 bg-green-100 text-green-600 text-xs rounded inline-block">{dateDetails.legalHoliday}</div>
              )}
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-gray-500 uppercase">干支</h4>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white rounded p-2 shadow-sm">
                  <div className="text-xs text-gray-500">年</div>
                  <div className="text-sm font-medium">{dateDetails.yearGanZhi}</div>
                </div>
                <div className="bg-white rounded p-2 shadow-sm">
                  <div className="text-xs text-gray-500">月</div>
                  <div className="text-sm font-medium">{dateDetails.monthGanZhi}</div>
                </div>
                <div className="bg-white rounded p-2 shadow-sm">
                  <div className="text-xs text-gray-500">日</div>
                  <div className="text-sm font-medium">{dateDetails.dayGanZhi}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-gray-500 uppercase">其他</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">生肖</span><span>{dateDetails.zodiac}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">星座</span><span>{dateDetails.constellation}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">节气</span><span className="text-green-600">{dateDetails.solarTerm}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">值神</span><span>{dateDetails.duty}</span></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-gray-500 uppercase">宜忌</h4>
              <div className="space-y-2">
                <div><span className="text-xs text-green-600 font-medium">宜：</span><span className="text-xs text-gray-600">{dateDetails.recommends.join(' ')}</span></div>
                <div><span className="text-xs text-red-600 font-medium">忌：</span><span className="text-xs text-gray-600">{dateDetails.avoids.join(' ')}</span></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">点击日期查看详情</div>
        )}
      </div>
    </div>
  );
}
