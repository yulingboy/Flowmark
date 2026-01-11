import { Progress, Button } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, RedoOutlined, StepForwardOutlined } from '@ant-design/icons';
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
        
        {/* 圆形进度 - 使用 Ant Design Progress */}
        <Progress
          type="circle"
          percent={progress}
          size={192}
          format={() => (
            <span className="text-5xl font-mono tabular-nums text-white">
              {formatTime(data.timeLeft)}
            </span>
          )}
          strokeColor="rgba(255,255,255,0.8)"
          trailColor="rgba(255,255,255,0.2)"
          strokeWidth={4}
          className="mb-6"
        />
        
        {/* 控制按钮 - 使用 Ant Design Button */}
        <div className="flex items-center gap-4">
          <Button
            shape="circle"
            size="large"
            icon={<RedoOutlined />}
            onClick={reset}
            title="重置"
            className="!bg-transparent !border-none !text-white hover:!bg-white/10 !w-12 !h-12"
          />
          <Button
            shape="circle"
            size="large"
            icon={isRunning ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={isRunning ? pause : start}
            className="!bg-white/20 !border-none !text-white hover:!bg-white/30 !w-16 !h-16 !text-2xl"
          />
          <Button
            shape="circle"
            size="large"
            icon={<StepForwardOutlined />}
            onClick={skip}
            title="跳过"
            className="!bg-transparent !border-none !text-white hover:!bg-white/10 !w-12 !h-12"
          />
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
