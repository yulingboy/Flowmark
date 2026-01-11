import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { usePomodoro } from './usePomodoro';
import { formatTime, STATUS_NAMES, STATUS_COLORS } from './types';

export function PomodoroModal() {
  const { data, config, start, pause, reset, skip, isRunning } = usePomodoro();
  const bgColor = STATUS_COLORS[data.status];

  // 计算进度
  const totalTime = data.status === 'working' 
    ? config.workDuration * 60 
    : data.status === 'longBreak' 
      ? config.longBreakDuration * 60 
      : config.shortBreakDuration * 60;
  const progress = ((totalTime - data.timeLeft) / totalTime) * 100;

  return (
    <div className={`h-full flex flex-col bg-gradient-to-br ${bgColor} text-white`}>
      {/* 主内容 */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* 状态 */}
        <div className="text-lg text-white/80 mb-4">
          {STATUS_NAMES[data.status]}
        </div>
        
        {/* 圆形进度 */}
        <div className="relative w-48 h-48 mb-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="8"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 88}
              strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-mono tabular-nums">
              {formatTime(data.timeLeft)}
            </span>
          </div>
        </div>
        
        {/* 控制按钮 */}
        <div className="flex items-center gap-4">
          <button
            onClick={reset}
            className="p-3 rounded-full hover:bg-white/10 transition-colors"
            title="重置"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          <button
            onClick={isRunning ? pause : start}
            className="p-5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            {isRunning ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </button>
          <button
            onClick={skip}
            className="p-3 rounded-full hover:bg-white/10 transition-colors"
            title="跳过"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* 底部统计 */}
      <div className="px-6 py-4 bg-black/10">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-white/70">
              今日完成: <span className="text-white font-medium">{data.completedPomodoros}</span> 🍅
            </span>
            <span className="text-white/70">
              总计: <span className="text-white font-medium">{data.totalPomodoros}</span> 🍅
            </span>
          </div>
          <div className="text-white/50 text-xs">
            {config.workDuration}分钟工作 / {config.shortBreakDuration}分钟休息
          </div>
        </div>
        
        {/* 番茄进度指示 */}
        <div className="flex items-center gap-1 mt-3">
          {Array.from({ length: config.longBreakInterval }).map((_, i) => (
            <div
              key={i}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                i < (data.completedPomodoros % config.longBreakInterval)
                  ? 'bg-white/30'
                  : 'bg-white/10'
              }`}
            >
              🍅
            </div>
          ))}
          <span className="text-xs text-white/50 ml-2">
            {config.longBreakInterval - (data.completedPomodoros % config.longBreakInterval)} 个后长休息
          </span>
        </div>
      </div>
    </div>
  );
}
