import { useState, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { usePluginStore } from '../../store';
import type { FlipClockConfig } from './types';
import { PLUGIN_ID, DEFAULT_CONFIG, getCurrentTime, getCurrentDate } from './types';

export function useFlipClock() {
  const storedConfig = usePluginStore(
    useShallow(state => state.pluginConfigs[PLUGIN_ID] || {})
  );
  const config: FlipClockConfig = { ...DEFAULT_CONFIG, ...storedConfig };

  const [time, setTime] = useState(() => getCurrentTime(config.use24Hour));
  const [date, setDate] = useState(() => getCurrentDate());
  const [prevTime, setPrevTime] = useState(time);

  useEffect(() => {
    const updateTime = () => {
      const newTime = getCurrentTime(config.use24Hour);
      setPrevTime(time);
      setTime(newTime);
      setDate(getCurrentDate());
    };

    // 立即更新一次
    updateTime();

    // 每秒更新
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [config.use24Hour]);

  return {
    time,
    prevTime,
    date,
    config,
  };
}
