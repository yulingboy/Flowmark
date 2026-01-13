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

// 获取初始数据
function getInitialData(): PomodoroData {
  const stored = usePluginStore.getState().pluginData[PLUGIN_ID]?.data as PomodoroData | undefined;
  return stored || DEFAULT_DATA;
}

export function usePomodoro() {
  const storedConfig = usePluginStore(
    useShallow(state => state.pluginConfigs[PLUGIN_ID] || {})
  );
  
  const config: PomodoroConfig = useMemo(() => ({ ...DEFAULT_CONFIG, ...storedConfig }), [storedConfig]);
  
  // 使用函数初始化，避免每次渲染都读取 store
  const [data, setData] = useState<PomodoroData>(getInitialData);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(false);

  // 标记组件已挂载
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

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
    setData(prev => {
      const newData: PomodoroData = {
        ...prev,
        status: 'working',
        startedAt: Date.now(),
        pausedAt: null,
        timeLeft: prev.status === 'idle' ? config.workDuration * 60 : prev.timeLeft,
      };
      
      setTimeout(() => {
        usePluginStore.getState().setPluginData(PLUGIN_ID, 'data', newData);
      }, 0);
      
      return newData;
    });
  }, [config.workDuration]);

  // 暂停
  const pause = useCallback(() => {
    setData(prev => {
      const newData: PomodoroData = {
        ...prev,
        status: 'paused',
        pausedAt: Date.now(),
      };
      
      setTimeout(() => {
        usePluginStore.getState().setPluginData(PLUGIN_ID, 'data', newData);
      }, 0);
      
      return newData;
    });
  }, []);

  // 重置
  const reset = useCallback(() => {
    setData(prev => {
      const newData: PomodoroData = {
        ...DEFAULT_DATA,
        timeLeft: config.workDuration * 60,
        completedPomodoros: prev.completedPomodoros,
        totalPomodoros: prev.totalPomodoros,
      };
      
      setTimeout(() => {
        usePluginStore.getState().setPluginData(PLUGIN_ID, 'data', newData);
      }, 0);
      
      return newData;
    });
  }, [config.workDuration]);

  // 跳过当前阶段
  const skip = useCallback(() => {
    setData(prev => {
      const nextStatus = getNextStatus(prev.status, prev.completedPomodoros);
      const newCompleted = prev.status === 'working' ? prev.completedPomodoros + 1 : prev.completedPomodoros;
      
      const newData: PomodoroData = {
        ...prev,
        status: 'idle',
        timeLeft: getDuration(nextStatus),
        completedPomodoros: newCompleted,
        totalPomodoros: prev.status === 'working' ? prev.totalPomodoros + 1 : prev.totalPomodoros,
        startedAt: null,
        pausedAt: null,
      };
      
      setTimeout(() => {
        usePluginStore.getState().setPluginData(PLUGIN_ID, 'data', newData);
      }, 0);
      
      return newData;
    });
  }, [getNextStatus, getDuration]);

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
          
          setTimeout(() => {
            usePluginStore.getState().setPluginData(PLUGIN_ID, 'data', newData);
          }, 0);
          
          return newData;
        }
        
        const newData = { ...prev, timeLeft: prev.timeLeft - 1 };
        
        // 每 5 秒同步一次到 store，减少写入频率
        if (prev.timeLeft % 5 === 0) {
          setTimeout(() => {
            usePluginStore.getState().setPluginData(PLUGIN_ID, 'data', newData);
          }, 0);
        }
        
        return newData;
      });
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
