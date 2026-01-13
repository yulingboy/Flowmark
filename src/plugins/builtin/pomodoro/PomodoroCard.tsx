import { Play, Pause, RotateCcw, Timer } from 'lucide-react';
import type { PluginSize } from '@/types';
import { usePomodoro } from './usePomodoro';
import { formatTime, STATUS_NAMES, STATUS_COLORS, STATUS_ACCENT } from './types';

export function PomodoroCard({ size }: { size: PluginSize }) {
  const { data, config, start, pause, reset, isRunning } = usePomodoro();
  const bgColor = STATUS_COLORS[data.status];
  const accentColor = STATUS_ACCENT[data.status];

  // 计算进度
  const totalTime = data.status === 'working' 
    ? config.workDuration * 60 
    : data.status === 'longBreak' 
      ? config.longBreakDuration * 60 
      : config.shortBreakDuration * 60;
  const progress = ((totalTime - data.timeLeft) / totalTime) * 100;

  // 1x1 尺寸：只显示时间
  if (size === '1x1') {
    return (
      <div 
        className={`w-full h-full flex flex-col items-center justify-center ${bgColor} backdrop-blur-sm rounded-xl cursor-pointer`}
        onClick={isRunning ? pause : start}
      >
        <Timer className="w-5 h-5 text-white/60 mb-1" style={{ color: accentColor }} />
        <span className="text-lg font-mono text-white/90 tabular-nums">
          {formatTime(data.timeLeft)}
        </span>
      </div>
    );
  }

  // 2x2 尺寸：显示时间和控制按钮
  if (size === '2x2') {
    return (
      <div className={`w-full h-full flex flex-col ${bgColor} backdrop-blur-sm rounded-xl p-3 text-white`}>
        {/* 状态指示 */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/60">{STATUS_NAMES[data.status]}</span>
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
        </div>
        
        {/* 时间 */}
        <div className="flex-1 flex items-center justify-center">
          <span className="text-4xl font-mono tabular-nums text-white/90">
            {formatTime(data.timeLeft)}
          </span>
        </div>

        {/* 进度条 */}
        <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-3">
          <div 
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${progress}%`, backgroundColor: accentColor }}
          />
        </div>
        
        {/* 控制按钮 */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); reset(); }}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-white/60" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); isRunning ? pause() : start(); }}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            {isRunning ? (
              <Pause className="w-5 h-5 text-white/90" />
            ) : (
              <Play className="w-5 h-5 text-white/90 ml-0.5" />
            )}
          </button>
        </div>
        
        {/* 番茄计数 */}
        <div className="text-xs text-white/40 text-center mt-2 tabular-nums">
          {data.completedPomodoros} 个番茄
        </div>
      </div>
    );
  }

  // 2x4 尺寸：完整显示
  return (
    <div className={`w-full h-full flex flex-col ${bgColor} backdrop-blur-sm rounded-xl p-4 text-white`}>
      {/* 顶部状态 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
          <span className="text-sm text-white/70">{STATUS_NAMES[data.status]}</span>
        </div>
        <span className="text-sm text-white/50 tabular-nums">{data.completedPomodoros} 番茄</span>
      </div>
      
      {/* 时间显示 */}
      <div className="flex-1 flex items-center justify-center">
        <span className="text-6xl font-mono tabular-nums text-white/90">
          {formatTime(data.timeLeft)}
        </span>
      </div>
      
      {/* 进度条 */}
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${progress}%`, backgroundColor: accentColor }}
        />
      </div>
      
      {/* 控制按钮 */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={(e) => { e.stopPropagation(); reset(); }}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          title="重置"
        >
          <RotateCcw className="w-5 h-5 text-white/60" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); isRunning ? pause() : start(); }}
          className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          {isRunning ? (
            <Pause className="w-6 h-6 text-white/90" />
          ) : (
            <Play className="w-6 h-6 text-white/90 ml-0.5" />
          )}
        </button>
      </div>
    </div>
  );
}
