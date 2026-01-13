import React from 'react';
import type { Plugin, PluginSize } from '@/types';
import { PomodoroCard } from './PomodoroCard';
import { PomodoroModal } from './PomodoroModal';

export const pomodoroPlugin: Plugin = {
  metadata: {
    id: 'pomodoro',
    name: '番茄钟',
    version: '1.0.0',
    description: '番茄工作法计时器，帮助你专注工作',
    author: 'Built-in',
    icon: 'timer'
  },

  supportedSizes: ['1x1', '2x2', '2x4'],
  defaultSize: '2x2',
  modalSize: { width: 400, height: 480 },

  configSchema: {
    workDuration: {
      type: 'number',
      label: '工作时长 (分钟)',
      default: 25,
      min: 1,
      max: 60,
    },
    shortBreakDuration: {
      type: 'number',
      label: '短休息时长 (分钟)',
      default: 5,
      min: 1,
      max: 30,
    },
    longBreakDuration: {
      type: 'number',
      label: '长休息时长 (分钟)',
      default: 15,
      min: 5,
      max: 60,
    },
    longBreakInterval: {
      type: 'number',
      label: '长休息间隔 (番茄数)',
      default: 4,
      min: 2,
      max: 10,
    },
    autoStartBreak: {
      type: 'boolean',
      label: '自动开始休息',
      default: false,
    },
    autoStartWork: {
      type: 'boolean',
      label: '自动开始工作',
      default: false,
    },
    soundEnabled: {
      type: 'boolean',
      label: '声音提醒',
      default: true,
    },
  },

  defaultConfig: {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    autoStartBreak: false,
    autoStartWork: false,
    soundEnabled: true,
  },

  renderCard: (_api, size: PluginSize) => React.createElement(PomodoroCard, { size }),
  renderModal: () => React.createElement(PomodoroModal),
};
