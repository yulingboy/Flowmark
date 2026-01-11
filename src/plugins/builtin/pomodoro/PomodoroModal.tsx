import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { usePomodoro } from './usePomodoro';
import { formatTime, STATUS_NAMES, STATUS_ACCENT } from './types';

export function PomodoroModal() {
  const { data, config, start, pause, reset, skip, isRunning } = usePomodoro();
  const accentColor = STATUS_ACCENT[data.status];

  // 计算进度
  const totalTime = data.status === 'working' 
    ? config.workDuration * 60 
    : data.status === 'longBreak' 
      ? config.longBreakDuration * 60 
      : config.shortBreakDuration * 60;
  const progress = ((totalTime - data.timeLeft) / totalTime) * 100;

  // 圆形进度条参数
  const size = 160;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="h-full flex flex-col bg-neutral-900 text-neutral-100 overflow-hidden">
      {/* 主内容 */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* 状态 */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
          <span className="text-sm text-neutral-400">{STATUS_NAMES[data.status]}</span>
        </div>
        
        {/* 圆形进度 */}
        <div className="relative mb-6">
          <svg width={size} height={size} className="-rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={accentColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-mono tabular-nums">
              {formatTime(data.timeLeft)}
            </span>
          </div>
        </div>
        
        {/* 控制按钮 */}
        <div className="flex items-center gap-3">
          <button
            onClick={reset}
            className="p-2.5 rounded-full hover:bg-neutral-800 transition-colors"
          >
            <RotateCcw className="w-5 h-5 text-neutral-500" />
          </button>
          <button
            onClick={isRunning ? pause : start}
            className="p-3.5 rounded-full transition-colors"
            style={{ backgroundColor: `${accentColor}20` }}
          >
            {isRunning ? (
              <Pause className="w-7 h-7" style={{ color: accentColor }} />
            ) : (
              <Play className="w-7 h-7 ml-0.5" style={{ color: accentColor }} />
            )}
          </button>
          <button
            onClick={skip}
            className="p-2.5 rounded-full hover:bg-neutral-800 transition-colors"
          >
            <SkipForward className="w-5 h-5 text-neutral-500" />
          </button>
        </div>
      </div>

      {/* 底部统计 */}
      <div className="px-4 py-3 border-t border-neutral-800">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <span className="text-neutral-500">
              今日 <span className="text-neutral-300 tabular-nums">{data.completedPomodoros}</span>
            </span>
            <span className="text-neutral-500">
              总计 <span className="text-neutral-300 tabular-nums">{data.totalPomodoros}</span>
            </span>
          </div>
          <span className="text-neutral-600 text-xs">
            {config.workDuration}分 / {config.shortBreakDuration}分
          </span>
        </div>
      </div>
    </div>
  );
}
