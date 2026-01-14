import { useEffect, useCallback, useRef } from 'react';
import { usePomodoroStore } from './store';
import type { PomodoroData, PomodoroStatus } from './types';
import { DEFAULT_CONFIG } from './types';

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
  const data = usePomodoroStore(state => state.data);
  const setData = usePomodoroStore(state => state.setData);
  const config = usePomodoroStore(state => state.config);
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 播放提示音
  const playSound = useCallback(() => {
    if (!config.soundEnabled) return;
    try {
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
      status: 'working',
      startedAt: Date.now(),
      pausedAt: null,
      timeLeft: data.status === 'idle' ? config.workDuration * 60 : data.timeLeft,
    };
    setData(newData);
  }, [data, config.workDuration, setData]);

  // 暂停
  const pause = useCallback(() => {
    const newData: PomodoroData = {
      ...data,
      status: 'paused',
      pausedAt: Date.now(),
    };
    setData(newData);
  }, [data, setData]);

  // 重置
  const reset = useCallback(() => {
    const newData: PomodoroData = {
      ...DEFAULT_DATA,
      timeLeft: config.workDuration * 60,
      completedPomodoros: data.completedPomodoros,
      totalPomodoros: data.totalPomodoros,
    };
    setData(newData);
  }, [config.workDuration, data.completedPomodoros, data.totalPomodoros, setData]);

  // 跳过当前阶段
  const skip = useCallback(() => {
    const nextStatus = getNextStatus(data.status, data.completedPomodoros);
    const newCompleted = data.status === 'working' ? data.completedPomodoros + 1 : data.completedPomodoros;
    
    const newData: PomodoroData = {
      ...data,
      status: 'idle',
      timeLeft: getDuration(nextStatus),
      completedPomodoros: newCompleted,
      totalPomodoros: data.status === 'working' ? data.totalPomodoros + 1 : data.totalPomodoros,
      startedAt: null,
      pausedAt: null,
    };
    setData(newData);
  }, [data, getNextStatus, getDuration, setData]);

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
      const currentData = usePomodoroStore.getState().data;
      
      if (currentData.timeLeft <= 1) {
        playSound();
        
        const nextStatus = getNextStatus(currentData.status, currentData.completedPomodoros);
        const newCompleted = currentData.status === 'working' ? currentData.completedPomodoros + 1 : currentData.completedPomodoros;
        const shouldAutoStart = 
          (currentData.status === 'working' && config.autoStartBreak) ||
          ((currentData.status === 'shortBreak' || currentData.status === 'longBreak') && config.autoStartWork);
        
        const newData: PomodoroData = {
          ...currentData,
          status: shouldAutoStart ? nextStatus : 'idle',
          timeLeft: getDuration(nextStatus),
          completedPomodoros: newCompleted,
          totalPomodoros: currentData.status === 'working' ? currentData.totalPomodoros + 1 : currentData.totalPomodoros,
          startedAt: shouldAutoStart ? Date.now() : null,
        };
        
        setData(newData);
      } else {
        setData({ ...currentData, timeLeft: currentData.timeLeft - 1 });
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [data.status, config, playSound, getNextStatus, getDuration]);

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
