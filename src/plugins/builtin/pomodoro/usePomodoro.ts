import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { usePluginStore } from '../../store';
import type { PomodoroData, PomodoroConfig, PomodoroStatus } from './types';
import { PLUGIN_ID, DEFAULT_CONFIG } from './types';

const DEFAULT_DATA: PomodoroData = {
  status: 'idle',
  timeLeft: DEFAULT_CONFIG.workDuration * 60,
  completedPomodoros: 0,
  totalPomodoros: 0,
  startedAt: null,
  pausedAt: null,
};

interface WebkitWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

export function usePomodoro() {
  const storedData = usePluginStore(
    useShallow(state => (state.pluginData[PLUGIN_ID]?.data as PomodoroData) || null)
  );
  const storedConfig = usePluginStore(
    useShallow(state => state.pluginConfigs[PLUGIN_ID] || {})
  );
  
  const config: PomodoroConfig = useMemo(() => ({ ...DEFAULT_CONFIG, ...storedConfig }), [storedConfig]);
  const [data, setData] = useState<PomodoroData>(storedData || DEFAULT_DATA);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 保存数据到 store
  const saveData = useCallback((newData: PomodoroData) => {
    setData(newData);
    usePluginStore.getState().setPluginData(PLUGIN_ID, 'data', newData);
  }, []);

  // 播放提示音
  const playSound = useCallback(() => {
    if (!config.soundEnabled) return;
    try {
      // 使用 Web Audio API 生成简单提示音
      const AudioContextClass = window.AudioContext || (window as WebkitWindow).webkitAudioContext;
      if (!AudioContextClass) return;
      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch {
      // 忽略音频错误
    }
  }, [config.soundEnabled]);

  // 获取下一个状态
  const getNextStatus = useCallback((currentStatus: PomodoroStatus, completedCount: number): PomodoroStatus => {
    if (currentStatus === 'working') {
      if ((completedCount + 1) % config.longBreakInterval === 0) {
        return 'longBreak';
      }
      return 'shortBreak';
    }
    return 'working';
  }, [config.longBreakInterval]);

  // 获取状态对应的时长
  const getDuration = useCallback((status: PomodoroStatus): number => {
    switch (status) {
      case 'working': return config.workDuration * 60;
      case 'shortBreak': return config.shortBreakDuration * 60;
      case 'longBreak': return config.longBreakDuration * 60;
      default: return config.workDuration * 60;
    }
  }, [config]);

  // 开始计时
  const start = useCallback(() => {
    const newData: PomodoroData = {
      ...data,
      status: data.status === 'paused' ? (storedData?.status === 'paused' ? 'working' : data.status) : 'working',
      startedAt: Date.now(),
      pausedAt: null,
      timeLeft: data.status === 'idle' ? config.workDuration * 60 : data.timeLeft,
    };
    
    if (data.status === 'idle') {
      newData.status = 'working';
      newData.timeLeft = config.workDuration * 60;
    } else if (data.status === 'paused') {
      // 恢复之前的状态
      newData.status = 'working';
    }
    
    saveData(newData);
  }, [data, config.workDuration, saveData, storedData]);

  // 暂停
  const pause = useCallback(() => {
    saveData({
      ...data,
      status: 'paused',
      pausedAt: Date.now(),
    });
  }, [data, saveData]);

  // 重置
  const reset = useCallback(() => {
    saveData({
      ...DEFAULT_DATA,
      timeLeft: config.workDuration * 60,
      completedPomodoros: data.completedPomodoros,
      totalPomodoros: data.totalPomodoros,
    });
  }, [config.workDuration, data.completedPomodoros, data.totalPomodoros, saveData]);

  // 跳过当前阶段
  const skip = useCallback(() => {
    const nextStatus = getNextStatus(data.status, data.completedPomodoros);
    const newCompleted = data.status === 'working' ? data.completedPomodoros + 1 : data.completedPomodoros;
    
    saveData({
      ...data,
      status: 'idle',
      timeLeft: getDuration(nextStatus),
      completedPomodoros: newCompleted,
      totalPomodoros: data.status === 'working' ? data.totalPomodoros + 1 : data.totalPomodoros,
      startedAt: null,
      pausedAt: null,
    });
  }, [data, getNextStatus, getDuration, saveData]);

  // 计时器逻辑
  useEffect(() => {
    if (data.status === 'idle' || data.status === 'paused') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setData(prev => {
        if (prev.timeLeft <= 1) {
          // 时间到
          playSound();
          
          const nextStatus = getNextStatus(prev.status, prev.completedPomodoros);
          const newCompleted = prev.status === 'working' ? prev.completedPomodoros + 1 : prev.completedPomodoros;
          const shouldAutoStart = 
            (prev.status === 'working' && config.autoStartBreak) ||
            ((prev.status === 'shortBreak' || prev.status === 'longBreak') && config.autoStartWork);
          
          const newData: PomodoroData = {
            ...prev,
            status: shouldAutoStart ? nextStatus : 'idle',
            timeLeft: getDuration(nextStatus),
            completedPomodoros: newCompleted,
            totalPomodoros: prev.status === 'working' ? prev.totalPomodoros + 1 : prev.totalPomodoros,
            startedAt: shouldAutoStart ? Date.now() : null,
          };
          
          usePluginStore.getState().setPluginData(PLUGIN_ID, 'data', newData);
          return newData;
        }
        
        const newData = { ...prev, timeLeft: prev.timeLeft - 1 };
        usePluginStore.getState().setPluginData(PLUGIN_ID, 'data', newData);
        return newData;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [data.status, config, playSound, getNextStatus, getDuration]);

  // 同步 store 数据 - 使用 ref 追踪
  const prevStoredDataRef = useRef(storedData);
  useEffect(() => {
    if (storedData && storedData !== prevStoredDataRef.current && storedData !== data) {
      setData(storedData);
    }
    prevStoredDataRef.current = storedData;
     
  }, [storedData, data]);

  return {
    data,
    config,
    start,
    pause,
    reset,
    skip,
    isRunning: data.status === 'working' || data.status === 'shortBreak' || data.status === 'longBreak',
  };
}
