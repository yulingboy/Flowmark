import { useState, useEffect, useCallback, useRef } from 'react';
import { formatTime, formatDate, formatYear, getWeekday, getLunarDate } from '../utils/clock';
import { useClockStore } from '../store/clockStore';
import { usePageVisibility } from '@/hooks/usePageVisibility';
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
  } = useClockStore();
  
  const isVisible = usePageVisibility();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // 初始化时钟数据
  const initClockData = useCallback(() => {
    const now = new Date();
    return {
      time: formatTime(now, showSeconds, show24Hour),
      date: formatDate(now),
      year: formatYear(now),
      weekday: getWeekday(now),
      lunar: getLunarDate(now),
    };
  }, [showSeconds, show24Hour]);

  const [clockData, setClockData] = useState<ClockData & { year: string }>(initClockData);

  const updateClock = useCallback(() => {
    setClockData(initClockData());
  }, [initClockData]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (isVisible) {
      // 立即更新一次
      updateClock();
      intervalRef.current = setInterval(updateClock, 1000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
     
  }, [isVisible, updateClock]);

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
