import { useState, useEffect } from 'react';
import { formatTime, formatDate, getWeekday, getLunarDate } from '@/utils/clock';
import type { ClockData } from '@/types';

export function useClock(): ClockData {
  const [clockData, setClockData] = useState<ClockData>(() => {
    const now = new Date();
    return {
      time: formatTime(now),
      date: formatDate(now),
      weekday: getWeekday(now),
      lunar: getLunarDate(now),
    };
  });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClockData({
        time: formatTime(now),
        date: formatDate(now),
        weekday: getWeekday(now),
        lunar: getLunarDate(now),
      });
    };

    // 每秒更新
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  return clockData;
}
