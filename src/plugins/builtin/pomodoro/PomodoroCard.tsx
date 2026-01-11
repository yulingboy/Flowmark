import { Play, Pause, RotateCcw } from 'lucide-react';
import type { PluginSize } from '../../types';
import { usePomodoro } from './usePomodoro';
import { formatTime, STATUS_NAMES, STATUS_COLORS } from './types';

export function PomodoroCard({ size }: { size: PluginSize }) {
  const { data, start, pause, reset, isRunning } = usePomodoro();
  const bgColor = STATUS_COLORS[data.status];

  // 1x1 尺寸：只显示时间
  if (size === '1x1') {
    return (
      <div 
        className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${bgColor} rounded-xl cursor-pointer`}
        onClick={isRunning ? pause : start}
      >
        <span className="text-xl font-mono text-white tabular-nums">
          {formatTime(data.timeLeft)}
        </span>
      </div>
    );
  }

  // 2x2 尺寸：显示时间和控制按钮
  if (size === '2x2') {
    return (
      <div className={`w-full h-full flex flex-col bg-gradient-to-br ${bgColor} rounded-xl p-3 text-white`}>
        {/* 状态 */}
        <div className="text-xs text-white/70 text-center">
          {STATUS_NAMES[data.status]}
        </div>
        
        {/* 时间 */}
        <div className="flex-1 flex items-center justify-center">
          <span className="text-4xl font-mono tabular-nums">
            {formatTime(data.timeLeft)}
          </span>
        </div>
        
        {/* 控制按钮 */}
        <div className="flex items-center justify-center gap-3">
          <div
            onClick={(e) => { e.stopPropagation(); reset(); }}
            className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') reset(); }}
          >
            <RotateCcw className="w-4 h-4" />
          </div>
          <div
            onClick={(e) => { e.stopPropagation(); if (isRunning) { pause(); } else { start(); } }}
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') { if (isRunning) { pause(); } else { start(); } } }}
          >
            {isRunning ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </div>
        </div>
        
        {/* 番茄计数 */}
        <div className="text-xs text-white/60 text-center mt-2">
          🍅 {data.completedPomodoros} 个番茄
        </div>
      </div>
    );
  }

  // 2x4 尺寸：完整显示
  return (
    <div className={`w-full h-full flex flex-col bg-gradient-to-br ${bgColor} rounded-xl p-4 text-white`}>
      {/* 顶部状态 */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/80">{STATUS_NAMES[data.status]}</span>
        <span className="text-sm text-white/60">🍅 {data.completedPomodoros}</span>
      </div>
      
      {/* 时间显示 */}
      <div className="flex-1 flex items-center justify-center">
        <span className="text-6xl font-mono tabular-nums">
          {formatTime(data.timeLeft)}
        </span>
      </div>
      
      {/* 进度条 */}
      <div className="h-1 bg-white/20 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-white/60 transition-all duration-1000"
          style={{ 
            width: `${((data.status === 'working' ? 25 * 60 : 5 * 60) - data.timeLeft) / (data.status === 'working' ? 25 * 60 : 5 * 60) * 100}%` 
          }}
        />
      </div>
      
      {/* 控制按钮 */}
      <div className="flex items-center justify-center gap-4">
        <div
          onClick={(e) => { e.stopPropagation(); reset(); }}
          className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          title="重置"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') reset(); }}
        >
          <RotateCcw className="w-5 h-5" />
        </div>
        <div
          onClick={(e) => { e.stopPropagation(); if (isRunning) { pause(); } else { start(); } }}
          className="p-4 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') { if (isRunning) { pause(); } else { start(); } } }}
        >
          {isRunning ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-0.5" />
          )}
        </div>
      </div>
    </div>
  );
}
