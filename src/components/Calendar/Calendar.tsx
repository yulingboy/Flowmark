import { useState, useMemo } from 'react';
import { SolarDay, SolarMonth, LunarDay } from 'tyme4ts';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  /** 初始日期，默认为今天 */
  initialDate?: Date;
  /** 日期选择回调 */
  onDateSelect?: (date: Date, lunar: LunarDay) => void;
  /** 是否显示农历 */
  showLunar?: boolean;
  /** 是否显示节气 */
  showSolarTerm?: boolean;
  /** 是否显示节日 */
  showFestival?: boolean;
  /** 自定义类名 */
  className?: string;
}

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

/**
 * 获取农历日期显示文本
 */
function getLunarDayText(lunarDay: LunarDay): string {
  const day = lunarDay.getDay();
  if (day === 1) {
    // 初一显示月份
    const month = lunarDay.getLunarMonth();
    const monthName = LUNAR_MONTH_NAMES[month.getMonth() - 1];
    return month.isLeap() ? `闰${monthName}月` : `${monthName}月`;
  }
  return LUNAR_DAY_NAMES[day];
}

/**
 * 获取节日信息
 */
function getFestivalInfo(solarDay: SolarDay, lunarDay: LunarDay): string | undefined {
  // 优先显示农历节日
  const lunarFestival = lunarDay.getFestival();
  if (lunarFestival) {
    return lunarFestival.getName();
  }
  
  // 其次显示公历节日
  const solarFestival = solarDay.getFestival();
  if (solarFestival) {
    return solarFestival.getName();
  }
  
  return undefined;
}

/**
 * 获取节气信息
 */
function getSolarTermInfo(solarDay: SolarDay): string | undefined {
  const termDay = solarDay.getTermDay();
  if (termDay.getDayIndex() === 0) {
    return termDay.getSolarTerm().getName();
  }
  return undefined;
}

/**
 * 获取法定假日信息
 */
function getHolidayInfo(solarDay: SolarDay): { isHoliday: boolean; isWorkday: boolean } | undefined {
  const holiday = solarDay.getLegalHoliday();
  if (holiday) {
    return {
      isHoliday: !holiday.isWork(),
      isWorkday: holiday.isWork()
    };
  }
  return undefined;
}

export function Calendar({
  initialDate = new Date(),
  onDateSelect,
  showLunar = true,
  showSolarTerm = true,
  showFestival = true,
  className = ''
}: CalendarProps) {
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<SolarDay | null>(null);

  const today = useMemo(() => {
    const now = new Date();
    return SolarDay.fromYmd(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }, []);

  /** 生成日历数据 */
  const calendarDays = useMemo(() => {
    const solarMonth = SolarMonth.fromYm(currentYear, currentMonth);
    const firstDay = solarMonth.getFirstDay();
    const daysInMonth = solarMonth.getDayCount();
    
    // 获取本月第一天是星期几 (0-6)
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
        
        days.push({
          solarDay,
          lunarDay,
          isCurrentMonth: false,
          isToday: solarDay.equals(today),
          isWeekend: weekIndex === 0 || weekIndex === 6,
          lunarText: getLunarDayText(lunarDay),
          festival: showFestival ? getFestivalInfo(solarDay, lunarDay) : undefined,
          solarTerm: showSolarTerm ? getSolarTermInfo(solarDay) : undefined,
          ...getHolidayInfo(solarDay)
        });
      }
    }
    
    // 填充本月日期
    for (let day = 1; day <= daysInMonth; day++) {
      const solarDay = SolarDay.fromYmd(currentYear, currentMonth, day);
      const lunarDay = solarDay.getLunarDay();
      const weekIndex = solarDay.getWeek().getIndex();
      
      days.push({
        solarDay,
        lunarDay,
        isCurrentMonth: true,
        isToday: solarDay.equals(today),
        isWeekend: weekIndex === 0 || weekIndex === 6,
        lunarText: getLunarDayText(lunarDay),
        festival: showFestival ? getFestivalInfo(solarDay, lunarDay) : undefined,
        solarTerm: showSolarTerm ? getSolarTermInfo(solarDay) : undefined,
        ...getHolidayInfo(solarDay)
      });
    }
    
    // 填充下月日期
    const remainingDays = 42 - days.length; // 6行7列
    if (remainingDays > 0) {
      const nextMonth = solarMonth.next(1);
      for (let day = 1; day <= remainingDays; day++) {
        const solarDay = SolarDay.fromYmd(nextMonth.getYear(), nextMonth.getMonth(), day);
        const lunarDay = solarDay.getLunarDay();
        const weekIndex = solarDay.getWeek().getIndex();
        
        days.push({
          solarDay,
          lunarDay,
          isCurrentMonth: false,
          isToday: solarDay.equals(today),
          isWeekend: weekIndex === 0 || weekIndex === 6,
          lunarText: getLunarDayText(lunarDay),
          festival: showFestival ? getFestivalInfo(solarDay, lunarDay) : undefined,
          solarTerm: showSolarTerm ? getSolarTermInfo(solarDay) : undefined,
          ...getHolidayInfo(solarDay)
        });
      }
    }
    
    return days;
  }, [currentYear, currentMonth, today, showFestival, showSolarTerm]);

  /** 切换到上一个月 */
  const goToPrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  /** 切换到下一个月 */
  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  /** 回到今天 */
  const goToToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth() + 1);
  };

  /** 处理日期点击 */
  const handleDayClick = (dayInfo: DayInfo) => {
    setSelectedDate(dayInfo.solarDay);
    if (onDateSelect) {
      const date = new Date(
        dayInfo.solarDay.getYear(),
        dayInfo.solarDay.getMonth() - 1,
        dayInfo.solarDay.getDay()
      );
      onDateSelect(date, dayInfo.lunarDay);
    }
  };

  /** 获取日期单元格的样式类 */
  const getDayClassName = (dayInfo: DayInfo) => {
    const classes = [
      'relative flex flex-col items-center justify-center p-1 rounded-lg cursor-pointer transition-all duration-200',
      'hover:bg-gray-100'
    ];
    
    if (!dayInfo.isCurrentMonth) {
      classes.push('opacity-40');
    }
    
    if (dayInfo.isToday) {
      classes.push('bg-blue-500 text-white hover:bg-blue-600');
    } else if (selectedDate?.equals(dayInfo.solarDay)) {
      classes.push('bg-blue-100 ring-2 ring-blue-500');
    }
    
    if (dayInfo.isWeekend && !dayInfo.isToday) {
      classes.push('text-red-500');
    }
    
    return classes.join(' ');
  };

  /** 获取农历/节日文本的样式 */
  const getLunarClassName = (dayInfo: DayInfo) => {
    const classes = ['text-[10px] leading-tight truncate max-w-full'];
    
    if (dayInfo.isToday) {
      classes.push('text-white/80');
    } else if (dayInfo.festival) {
      classes.push('text-red-500');
    } else if (dayInfo.solarTerm) {
      classes.push('text-green-600');
    } else {
      classes.push('text-gray-500');
    }
    
    return classes.join(' ');
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-4 select-none ${className}`}>
      {/* 头部：年月导航 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPrevMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          title="上一月"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-800">
            {currentYear}年{currentMonth}月
          </span>
          <button
            onClick={goToToday}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            今天
          </button>
        </div>
        
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          title="下一月"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* 星期标题 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEK_NAMES.map((name, index) => (
          <div
            key={name}
            className={`text-center text-sm font-medium py-2 ${
              index === 0 || index === 6 ? 'text-red-500' : 'text-gray-600'
            }`}
          >
            {name}
          </div>
        ))}
      </div>

      {/* 日期网格 */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((dayInfo, index) => (
          <div
            key={index}
            className={getDayClassName(dayInfo)}
            onClick={() => handleDayClick(dayInfo)}
            style={{ minHeight: '52px' }}
          >
            {/* 公历日期 */}
            <span className="text-sm font-medium tabular-nums">
              {dayInfo.solarDay.getDay()}
            </span>
            
            {/* 农历/节日/节气 */}
            {showLunar && (
              <span className={getLunarClassName(dayInfo)}>
                {dayInfo.festival || dayInfo.solarTerm || dayInfo.lunarText}
              </span>
            )}
            
            {/* 假日/调休标记 */}
            {dayInfo.isHoliday && (
              <span className="absolute top-0.5 right-0.5 text-[8px] text-green-500 font-medium">休</span>
            )}
            {dayInfo.isWorkday && (
              <span className="absolute top-0.5 right-0.5 text-[8px] text-orange-500 font-medium">班</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
