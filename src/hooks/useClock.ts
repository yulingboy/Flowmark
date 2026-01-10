import { useState, useEffect } from 'react';
import { formatTime, formatDate, formatYear, getWeekday, getLunarDate } from '@/utils/clock';
import { useSettingsStore } from '@/stores/settingsStore';
import type { ClockData } from '@/types';

interface ExtendedClockData extends ClockData {
  year: string;
  showLunar: boolean;
  showDate: boolean;
  showWeekday: boolean;
  showYear: boolean;
  clockColor: string;
  clockFontSize: 'small' | 'medium' | 'large';
}

export function useClock(): ExtendedClockData {
  const { 
    showSeconds, 
    show24Hour, 
    showLunar, 
    showDate, 
    showWeekday, 
    showYear,
    clockColor,
    clockFontSize,
  } = useSettingsStore();
  
  const [clockData, setClockData] = useState<ClockData & { year: string }>(() => {
    const now = new Date();
    return {
      time: formatTime(now, showSeconds, show24Hour),
      date: formatDate(now),
      year: formatYear(now),
      weekday: getWeekday(now),
      lunar: getLunarDate(now),
    };
  });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClockData({
        time: formatTime(now, showSeconds, show24Hour),
        date: formatDate(now),
        year: formatYear(now),
        weekday: getWeekday(now),
        lunar: getLunarDate(now),
      });
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [showSeconds, show24Hour]);

  return { 
    ...clockData, 
    showLunar, 
    showDate, 
    showWeekday, 
    showYear,
    clockColor,
    clockFontSize,
  };
}
